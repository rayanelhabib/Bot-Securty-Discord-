const db = require('pro.db');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');
const express = require('express');
const path = require('path');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');

module.exports = client => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // حماية ضد سرقة السورس
  app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Feature-Policy', "geolocation 'none'; microphone 'none'; camera 'none'");
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-src https://www.google.com/recaptcha/;");
    next();
  });

  // حماية ضد فتح F12
  app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-src https://www.google.com/recaptcha/;");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });

  // reCAPTCHA
  app.post('/verify-recaptcha', async (req, res) => {
    const { 'g-recaptcha-response': recaptchaResponse } = req.body;
    const secretKey = '6LeR778rAAAAAOlmnNBIuSes3UPLYLSGu9qPugws';
    try {
      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${recaptchaResponse}`
      });
      const data = await response.json();
      if (data.success) res.redirect('/home');
      else res.status(400).send('reCAPTCHA verification failed. Please try again.');
    } catch (error) {
      console.error('Error verifying reCAPTCHA:', error);
      res.status(500).send('An error occurred during reCAPTCHA verification.');
    }
  });

  app.get('/', (req, res) => {
    res.render('index', { disableDevTools: true });
  });

  // Discord OAuth
  app.use(session({
    secret: 'p3I8F3KVQ09nSFyNpVr3SAXcDjndaBPV',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  const domain = 'http://45.86.155.150:6412';
  passport.use(new DiscordStrategy({
    clientID: require('./Config.json').DISCORD_CLIENT_ID,
    clientSecret: require('./Config.json').DISCORD_CLIENT_SECRET,
    callbackURL: `${domain}/auth/discord/callback`,
    scope: ['identify', 'guilds']
  }, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, profile));
  }));

  app.get('/auth/discord', passport.authenticate('discord'));
  app.get('/auth/discord/callback', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard');
  });

  // API لجلب السيرفرات التي لديك صلاحيات فيها والـ bot موجود
  app.get('/api/user-guilds', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json([]);
    const userGuilds = req.user.guilds || [];
    const botGuilds = client.guilds.cache;
    const allowedGuilds = userGuilds
      .filter(g => botGuilds.has(g.id) && (g.permissions & 0x20) === 0x20) // ManageGuild
      .map(g => ({
        id: g.id,
        name: g.name,
        icon: g.icon
          ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`
          : 'https://cdn.discordapp.com/embed/avatars/0.png'
      }));
    res.json(allowedGuilds);
  });

  // Dashboard
  app.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/auth/discord');
    const userGuilds = req.user.guilds;
    const botGuilds = client.guilds.cache;
    const commonGuilds = userGuilds.filter(userGuild => botGuilds.has(userGuild.id)).map(guild => ({
      id: guild.id,
      name: guild.name,
      icon: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
    }));
    const user = client.users.cache.get(req.user.id) || req.user;
    res.render('dashboard', { user, guilds: commonGuilds, disableDevTools: true });
  });

  app.get('/logout', (req, res) => {
    req.logout(err => {
      if (err) console.error('Error during logout:', err);
      res.redirect('/');
    });
  });

  // Server dashboard
  app.get('/dashboard/:guildId', async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/auth/discord');
    const guildId = req.params.guildId;
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return res.status(404).send('السيرفر غير موجود');
    const member = guild.members.cache.get(req.user.id);
    if (!member || !member.permissions.has('ManageGuild')) return res.status(403).send('ليس لديك الصلاحيات الكافية لإدارة هذا السيرفر');

    const serverSettings = { name: guild.name, memberCount: guild.memberCount };
    const commands = await client.application?.commands.fetch();
    const commandsWithStatus = await Promise.all(commands.map(async command => ({
      name: command.name,
      description: command.description,
      enabled: await db.get(`${guildId}_command_${command.name}`) !== false
    })));

    res.render('server-dashboard', {
      user: req.user,
      guild,
      settings: serverSettings,
      server: { name: guild.name, icon: guild.iconURL({ dynamic: true, size: 128 }) },
      commands: commandsWithStatus,
      db,
      disableDevTools: true
    });
  });

  app.post('/dashboard/:guildId/update', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/auth/discord');
    const guildId = req.params.guildId;
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return res.status(404).send('السيرفر غير موجود');
    const member = guild.members.cache.get(req.user.id);
    if (!member || !member.permissions.has('ManageGuild')) return res.status(403).send('ليس لديك الصلاحيات الكافية لإدارة هذا السيرفر');
    res.redirect(`/dashboard/${guildId}`);
  });

  // Toggle commands & protections
  app.post('/api/toggle-command', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ success: false, message: 'غير مصرح' });
    const { commandName, isEnabled, guildId } = req.body;
    try {
      const guild = client.guilds.cache.get(guildId);
      if (!guild) return res.status(404).json({ success: false, message: 'السيرفر غير موجود' });
      const member = guild.members.cache.get(req.user.id);
      if (!member || !member.permissions.has('ManageGuild')) return res.status(403).json({ success: false, message: 'ليس لديك الصلاحيات الكافية' });
      await db.set(`${guildId}_command_${commandName}`, isEnabled);
      res.json({ success: true, message: `تم ${isEnabled ? 'تفعيل' : 'تعطيل'} الأمر بنجاح` });
    } catch (error) {
      console.error('خطأ في تبديل حالة الأمر:', error);
      res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحديث حالة الأمر' });
    }
  });

  app.post('/api/toggle-protection', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ success: false, message: 'غير مصرح' });
    const { protectionType, isEnabled, guildId } = req.body;
    try {
      const guild = client.guilds.cache.get(guildId);
      if (!guild) return res.status(404).json({ success: false, message: 'السيرفر غير موجود' });
      const member = guild.members.cache.get(req.user.id);
      if (!member || !member.permissions.has('ManageGuild')) return res.status(403).json({ success: false, message: 'ليس لديك الصلاحيات الكافية' });
      await db.set(`${guildId}_${protectionType}`, isEnabled);
      res.json({ success: true, message: `تم ${isEnabled ? 'تفعيل' : 'تعطيل'} الحماية بنجاح` });
    } catch (error) {
      console.error('خطأ في تبديل حالة الحماية:', error);
      res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحديث حالة الحماية' });
    }
  });

  // Verification
  app.get('/verify', async (req, res) => {
    const { guild: guildId, user: userId } = req.query;
    if (!guildId || !userId) return res.status(400).render('error', { message: 'Missing guild or user ID' });
    try {
      const guild = client.guilds.cache.get(guildId);
      if (!guild) return res.status(404).render('error', { message: 'Guild not found' });
      const member = await guild.members.fetch(userId);
      if (!member) return res.status(404).render('error', { message: 'Member not found' });
      const verifyRoleId = await db.get(`${guildId}_verify_role`);
      if (!verifyRoleId) return res.status(400).render('error', { message: 'Verification role not set' });
      res.render('verify', { guildId, userId });
    } catch (error) {
      console.error('Error during verification:', error);
      res.status(500).render('error', { message: 'An error occurred during verification' });
    }
  });

  app.post('/verify', async (req, res) => {
    const { guildId, userId } = req.body;
    try {
      const guild = client.guilds.cache.get(guildId);
      if (!guild) return res.status(404).json({ success: false, message: 'Guild not found' });
      const member = await guild.members.fetch(userId);
      if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
      const verifyRoleId = await db.get(`${guildId}_verify_role`);
      if (!verifyRoleId) return res.status(400).json({ success: false, message: 'Verification role not set' });
      await member.roles.add(verifyRoleId);
      res.json({ success: true, message: 'Verification successful!' });
    } catch (error) {
      console.error('Error during verification:', error);
      res.status(500).json({ success: false, message: 'An error occurred during verification' });
    }
  });

  // Bot status endpoint
  app.get('/api/bot-status', (req, res) => {
  try {
    const uptime = client.uptime || 0;
    const servers = client.guilds.cache.size || 0;
    const online = client.ws.status === 0; // 0 = CONNECTED

    // Calculate total users across all guilds
    let users = 0;
    client.guilds.cache.forEach(guild => {
      users += guild.memberCount;
    });

    res.json({ 
      online, 
      servers, 
      users,       // Added total users
      uptime: msToTime(uptime) 
    });
  } catch (err) {
    console.error('Error fetching bot status:', err);
    res.status(500).json({ online: false, servers: 0, users: 0, uptime: '0s' });
  }
});

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  let days = Math.floor(duration / (1000 * 60 * 60 * 24));
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}


  const pterodactylPort = process.env.SERVER_PORT || 6412;
  app.listen(pterodactylPort, '0.0.0.0', () => {
    console.log(`Server is running on ${domain}:${pterodactylPort}`);
  });
};
