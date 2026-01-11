const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  Collection, 
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  AuditLogEvent
} = require("boda.js");
const fs = require("fs");
const config = require("./Config.json");
const db = require("pro.db");
const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [
    Partials.Channel, 
    Partials.GuildMember, 
    Partials.Message, 
    Partials.Reaction, 
    Partials.ThreadMember, 
    Partials.User,
    Partials.GuildScheduledEvent
  ]
});

client.commands = new Collection();
client.db = db;

fs.readdirSync(`${process.cwd()}/Handler/`).forEach((Handler) => {
  require(`${process.cwd()}/Handler/${Handler}`)(client);
});
//+===============================require======================================
require("./Events/logebots")(client);
require("./Events/wellcom")(client);
//+===============================exite======================================
/////////////////////////////////// AFK V
const afkChannels = {
    '1366177830551162985': '1395092071127191632',
    '1131528417947435069': '1413577961675952320',
    '1376993662793285672': '1409235644550746243',
  
};

async function joinAFK(guildId, channelId) {
    try {
        const guild = await client.guilds.fetch(guildId);
        const channel = guild.channels.cache.get(channelId);

        if (!channel || !channel.isVoiceBased()) {
            console.log(`Invalid voice channel for guild ${guildId}`);
            return;
        }

        // الانضمام للقناة الصوتية باستخدام @discordjs/voice
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator
        });

        // انتظار التأكد من أن الاتصال جاهز
        await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
        console.log(`Joined AFK channel ${channel.name} in ${guild.name}`);

        // إعادة الانضمام تلقائيًا عند قطع الاتصال
        connection.on('stateChange', (oldState, newState) => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                console.log(`Rejoining AFK channel ${channel.name} in ${guild.name} after 5s`);
                setTimeout(() => joinAFK(guildId, channelId), 5000);
            }
        });

    } catch (err) {
        console.error(`Failed to join voice in guild ${guildId}:`, err);
        setTimeout(() => joinAFK(guildId, channelId), 10000); // إعادة المحاولة بعد 10 ثوانٍ
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    for (const [guildId, channelId] of Object.entries(afkChannels)) {
        joinAFK(guildId, channelId);
    }
});
//////////////////////////
client.on('messageCreate', async (message) => {
    if (['1413578000208887888', ''].includes(message.channel.id)) {
        if(message.author.bot) return;
        message.react('✅');
    }
});

client.Prefix = '!';
client.commandss = new Collection();
client.commands = new Collection();

client.on('ready', () => {
    require('./server')(client);
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton() && interaction.customId === 'ver') {
        const guildId = interaction.guild.id;
        const userId = interaction.user.id;
        const dashboardUrl = `http://45.86.155.150:6412/verify?guild=${guildId}&user=${userId}`;

        // Embed for verification
        const verifyEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Verification Process')
            .setDescription('Click the button below to complete the verification process.');

        const verifyButton = new ButtonBuilder()
            .setLabel('Verify')
            .setStyle(ButtonStyle.Link)
            .setURL(dashboardUrl);

        const row = new ActionRowBuilder().addComponents(verifyButton);

        // Reply to the user
        await interaction.reply({ embeds: [verifyEmbed], components: [row], ephemeral: true });

        // --- Logging to ChannelsVER_${guild.id} ---
        const logChannelId = await db.get(`ChannelsVER_${guildId}`);
        if (logChannelId) {
            const logChannel = interaction.guild.channels.cache.get(logChannelId);
            if (logChannel && logChannel.isTextBased()) {
                const time = Math.floor(Date.now() / 1000); // timestamp in seconds
                const logEmbed = new EmbedBuilder()
                    .setTitle('📝 Verification Button Clicked')
                    .setColor(0x0099FF)
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`**User:** <@${userId}>\n**Channel:** <#${interaction.channel.id}>\n**Time:** <t:${time}:F>`)
                    .setTimestamp();

                logChannel.send({ embeds: [logEmbed] });
            }
        }
    }
});

/////////////////////////// TICKETS

client.on('messageCreate', async message =>{ 
    if (message.content.startsWith('-ticket')) {
    const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('boda.js');

    // Create embeds for Arabic and English
    const ticketEmbedAr = new EmbedBuilder()
        .setColor(0x4CAF50)
        .setTitle('🎫 نظام التذاكر')
        .setDescription('مرحبًا بك في نظام الدعم الخاص بنا. إذا كنت بحاجة إلى مساعدة، يرجى الضغط على الزر أدناه لفتح تذكرة.');

    const ticketEmbedEn = new EmbedBuilder()
        .setColor(0x4CAF50)
        .setTitle('🎫 Ticket System')
        .setDescription('Welcome to our support system. If you need assistance, please click the button below to open a ticket.');

    // Create buttons for Arabic and English
    const buttonAr = new ButtonBuilder()
        .setCustomId('open_ticket_ar')
        .setLabel('فتح تذكرة')
        .setStyle(ButtonStyle.Primary);

    const buttonEn = new ButtonBuilder()
        .setCustomId('open_ticket_en')
        .setLabel('Open Ticket')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder()
        .addComponents(buttonAr, buttonEn);

    // Send both embeds with the buttons
    await message.channel.send({ embeds: [ticketEmbedAr, ticketEmbedEn], components: [row] });
    }
})

// Ticket interaction handling
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const { guild, member, customId } = interaction;
    const lang = customId.endsWith('_ar') ? 'ar' : 'en';

    if (customId.startsWith('open_ticket')) {
        // Check if user already has an open ticket
        const existingTicket = guild.channels.cache.find(channel => 
            channel.name === `ticket-${member.user.username.replace(/\./g, '')}`
        );

        if (existingTicket) {
            return interaction.reply({
                content: lang === 'ar' ? 'لديك بالفعل تذكرة مفتوحة!' : 'You already have an open ticket!',
                ephemeral: true
            });
        }

        // Create new ticket channel
        const ticketChannel = await guild.channels.create({
            name: `ticket-${member.user.username}`,
            type: 0,
            parent: '1413577974493610188', // Text channel
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: ['ViewChannel'],
                },
                {
                    id: member.id,
                    allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                },
                {
                    id: lang === 'en' ? '1413577746218745877' : '1413577751243391089', // Staff role IDs
                    allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                },
            ],
        });

        // Create embed for the new ticket
        const ticketEmbed = {
            color: 0x4CAF50,
            title: lang === 'ar' ? '🎫 تذكرة جديدة' : '🎫 New Ticket',
            description: lang === 'ar' 
                ? `مرحبًا ${member}! هذه هي تذكرتك. يرجى وصف مشكلتك وسيقوم أحد أعضاء الفريق بمساعدتك قريبًا.`
                : `Hello ${member}! This is your ticket. Please describe your issue and a staff member will assist you soon.`,
            footer: { text: lang === 'ar' ? 'شكرًا لصبرك' : 'Thank you for your patience' },
        };

        // Create close ticket button
        const closeButton = {
            type: 1,
            components: [{
                type: 2,
                style: 4,
                label: lang === 'ar' ? 'إغلاق التذكرة' : 'Close Ticket',
                custom_id: `close_ticket_${lang}`,
            }],
        };

        await ticketChannel.send({ embeds: [ticketEmbed], components: [closeButton] });

        return interaction.reply({
            content: lang === 'ar' 
                ? `تم إنشاء تذكرتك بنجاح! يرجى الانتقال إلى ${ticketChannel}`
                : `Your ticket has been successfully created! Please proceed to ${ticketChannel}`,
            ephemeral: true
        });
    }

    if (customId.startsWith('close_ticket')) {
        const channel = interaction.channel;
        if (!channel.name.startsWith('ticket-')) {
            return interaction.reply({
                content: lang === 'ar' ? 'هذه ليست قناة تذكرة!' : 'This is not a ticket channel!',
                ephemeral: true
            });
        }

        await interaction.reply(lang === 'ar' ? 'جارٍ إغلاق التذكرة...' : 'Closing the ticket...');

        setTimeout(() => {
            channel.delete().catch(error => console.error('Error deleting channel:', error));
        }, 5000);
    }
});

// ====== Info Command ======

// حفظ وقت آخر ضغط لكل مستخدم لتطبيق الـ cooldown
const buttonCooldowns = new Map();

// تعريف الإيمبدات خارج الأحداث
let infoEmbedAr;
let infoEmbedEn;

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('info')) return;

  const creationDate = client.user.createdAt.toLocaleDateString();

  // الإيمبد العربي
  infoEmbedAr = new EmbedBuilder()
    .setColor(0x4CAF50)
    .setTitle('<:Safety:1413590713718935753> معلومات عن بوت الأمان')
    .setDescription(
      '**بوت الأمان هو حارس سيرفر الديسكورد الخاص بك. يوفر حماية متقدمة وإدارة فعالة لضمان بيئة آمنة ومنظمة لمجتمعك.**'
    )
    .addFields(
      { name: 'تاريخ الإنشاء', value: creationDate, inline: true },
      { name: 'المطور', value: 'فريق الأمان', inline: true },
      { name: 'الإصدار', value: '1.0.0', inline: true },
      {
        name: 'الوصف',
        value:
          '**بوت الأمان هو حل شامل لحماية وإدارة سيرفرات الديسكورد. يتميز بمجموعة واسعة من الميزات الأمنية المتقدمة، بما في ذلك الحماية ضد الرسائل المزعجة والروابط الضارة وعمليات الاحتيال وهجمات الاختراق الجماعي. يوفر البوت أيضًا نظامًا متطورًا للتحذير والحظر، مع إمكانية تخصيص كاملة لإعدادات الأمان حسب احتياجات كل سيرفر. بالإضافة إلى ذلك، يتميز البوت بلوحة تحكم سهلة الاستخدام تتيح للمشرفين إدارة جميع جوانب الأمان بكفاءة وفعالية.**',
      },
      {
        name: 'المميزات الرئيسية',
        value:
          '• **حماية متطورة ضد التهديدات الأمنية\n• نظام إدارة مرن وقابل للتخصيص\n• لوحة تحكم سهلة الاستخدام\n• تحديثات مستمرة وتطوير دائم\n• دعم فني على مدار الساعة**',
            },
             {
            name: '<:Safety:1413590713718935753> | **معلومات البوت**',
           value:
          '**[تابع قوانين ديسكورد](https://discord.gg/2KafzvkyF9)\n[بوت حماية لوحة التحكم](http://stafty-bot.my-board.org/)**',
      }
    )
    .setThumbnail(client.user.displayAvatarURL())
    .setFooter({ text: 'حماية متطورة لسيرفر الديسكورد الخاص بك' });

  // الإيمبد الإنجليزي
  infoEmbedEn = new EmbedBuilder()
    .setColor(0x4CAF50)
    .setTitle('<:Safety:1413590713718935753> Safety Bot Information')
    .setDescription(
      '**Safety Bot is the guardian of your Discord server. It provides advanced protection and effective management to ensure a safe and organized environment for your community**.'
    )
    .addFields(
      { name: 'Creation Date', value: creationDate, inline: true },
      { name: 'Developer', value: 'Safety Team', inline: true },
      { name: 'Version', value: '1.0.0', inline: true },
      {
        name: 'Description',
        value:
          '**Safety Bot is a comprehensive solution for protecting and managing Discord servers. It features a wide range of advanced security features, including protection against spam, harmful links, scams, and raid attacks. The bot also provides an advanced warning and ban system, with full customization of security settings to suit each server\'s needs. Additionally, the bot features an easy-to-use control panel that allows administrators to efficiently manage all aspects of security**.',
      },
      {
        name: 'Key Features',
        value:
          '• **Advanced protection against security threats\n• Flexible and customizable management system\n• User-friendly control panel\n• Continuous updates and ongoing development\n• 24/7 technical support**',
             },
             {
                  name: '<:Safety:1413590713718935753> | **Info Safety Bot**',
        value:
          '**[Follow Tos Discord](https://discord.gg/2KafzvkyF9)\n[Dashbord Safety bot](http://stafty-bot.my-board.org/)**',
      }
    )
    .setThumbnail(client.user.displayAvatarURL())
    .setFooter({ text: 'Advanced protection for your Discord server' });

  // زر الترجمة
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('translate')
      .setLabel('Translate / ترجمة')
      .setStyle(ButtonStyle.Primary)
  );

  // استرجاع اللغة المحفوظة لكل سيرفر
  let language = await db.get(`${message.guild.id}_language`) || 'en';
  let currentEmbed = language === 'ar' ? infoEmbedAr : infoEmbedEn;

  await message.channel.send({
    content: '**Stafety Bot**',
    embeds: [currentEmbed],
    components: [row],
  });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId !== 'translate') return;

  const now = Date.now();
  const cooldown = 30 * 1000; // 30 ثانية

  // التحقق من الـ cooldown لكل مستخدم
  if (buttonCooldowns.has(interaction.user.id)) {
    const expirationTime = buttonCooldowns.get(interaction.user.id) + cooldown;
    if (now < expirationTime) {
      return interaction.reply({ 
        content: `⏳ يرجى الانتظار 30 ثانية قبل استخدام الزر مرة أخرى.`, 
        ephemeral: true 
      });
    }
  }
  buttonCooldowns.set(interaction.user.id, now);

  // استرجاع اللغة الحالية وتبديلها
  let currentLang = await db.get(`${interaction.guild.id}_language`) || 'en';
  let newLang = currentLang === 'ar' ? 'en' : 'ar';
  await db.set(`${interaction.guild.id}_language`, newLang);

  // اختيار الإيمبد المناسب بناءً على اللغة الجديدة
  const newEmbed = newLang === 'ar' ? infoEmbedAr : infoEmbedEn;

  // تحديث الإيمبد فقط بدون رسالة إضافية
  await interaction.update({ embeds: [newEmbed] });
});
// Anti-link protection
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    
    const isAntiLinkEnabled = await db.get(`${message.guild.id}_antilink`);

    if (isAntiLinkEnabled === true) {
        // Check if the user is whitelisted
        const whitelistKey = `${message.guild.id}_antilink_whitelist`;
        const whitelist = await db.get(whitelistKey) || [];
        if (whitelist.includes(message.author.id)) return;

        if (message.member.permissions.has('Administrator')) return;
        const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(discord\.gg\/[^\s]+)|(discordapp\.com\/invite\/[^\s]+)|(facebook\.com\/[^\s]+)|(twitter\.com\/[^\s]+)|(instagram\.com\/[^\s]+)|(youtube\.com\/[^\s]+)|(tiktok\.com\/[^\s]+)|(discord\.gg\/\S+)/gi || 'discord.gg/';
        if (urlRegex.test(message.content)) {
            try {
                await message.delete();
                const language = await db.get(`${message.guild.id}_language`) || 'en';
                let warningMessage;
                if (language === 'ar') {
                    warningMessage = await message.channel.send(`${message.author}، إرسال الروابط غير مسموح به في هذا السيرفر.`);
                } else {
                    warningMessage = await message.channel.send(`${message.author}, sending links is not allowed in this server.`);
                }
                setTimeout(() => warningMessage.delete().catch(console.error), 5000);

                // Send log if logging is enabled
                const logChannelId = await db.get(`${message.guild.id}_logchannel`);
                if (logChannelId) {
                    const logChannel = message.guild.channels.cache.get(logChannelId);
                    if (logChannel) {
                        const { EmbedBuilder } = require('boda.js');
                        const logEmbed = new EmbedBuilder()
                            .setTitle('🔗 Anti-Link Detection')
                            .setColor(0xFF0000)
                            .setDescription(`A link was detected and removed.`)
                            .addFields(
                                { name: 'User', value: `${message.author.tag} (${message.author.id})`, inline: true },
                                { name: 'Channel', value: `${message.channel.name} (${message.channel.id})`, inline: true },
                                { name: 'Message Content', value: message.content.length > 1024 ? message.content.slice(0, 1021) + '...' : message.content }
                            )
                            .setTimestamp()
                            .setFooter({ text: `User ID: ${message.author.id}` });

                        logChannel.send({ embeds: [logEmbed] });
                    }
                }
            } catch (error) {
                console.error('Error in anti-link system:', error);
            }
        }
    }
});

// Anti-Raid protection
client.on('guildMemberAdd', async (member) => {
    
    const isAntiRaidEnabled = await db.get(`${member.guild.id}_antiraid`);

    if (isAntiRaidEnabled === true) {
        // Check if the user is whitelisted
        const whitelistKey = `${member.guild.id}_antiraid_whitelist`;
        const whitelist = await db.get(whitelistKey) || [];
        if (whitelist.includes(member.id)) return;

        const joinedAt = member.joinedAt;
        const recentMembers = member.guild.members.cache.filter(m => m.joinedAt > joinedAt - 10000);

        if (recentMembers.size > 10) {
            try {
                await member.kick('Anti-Raid protection');

                // Send log if logging is enabled
                const logChannelId = await db.get(`${member.guild.id}_logchannel`);
                if (logChannelId) {
                    const logChannel = member.guild.channels.cache.get(logChannelId);
                    if (logChannel) {
                        const { EmbedBuilder } = require('boda.js');
                        const language = await db.get(`${member.guild.id}_language`) || 'en';
                        const logEmbed = new EmbedBuilder()
                            .setTitle(language === 'ar' ? '🛑 تم تفعيل حماية ضد الغارات' : '🛑 Anti-Raid Protection Triggered')
                            .setColor(0xFF0000)
                            .setDescription(language === 'ar' ? 'تم اكتشاف غارة محتملة وتم طرد مستخدم.' : 'A potential raid was detected and a user was kicked.')
                            .addFields(
                                { name: language === 'ar' ? 'المستخدم' : 'User', value: `${member.user.tag} (${member.id})`, inline: true },
                                { name: language === 'ar' ? 'الإجراء' : 'Action', value: language === 'ar' ? 'تم الطرد' : 'Kicked', inline: true },
                                { name: language === 'ar' ? 'السبب' : 'Reason', value: language === 'ar' ? 'انضم أثناء غارة محتملة (أكثر من 10 انضمامات في 10 ثوانٍ)' : 'Joined during potential raid (10+ joins in 10 seconds)' }
                            )
                            .setTimestamp()
                            .setFooter({ text: `User ID: ${member.id}` });

                        logChannel.send({ embeds: [logEmbed] });
                    }
                }
            } catch (error) {
                console.error('Error in anti-raid system:', error);
            }
        }
    }
});


// Anti-Scam protection
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const isAntiScamEnabled = await db.get(`${message.guild.id}_antiscam`);

    if (isAntiScamEnabled === true) {
        // Check if the user is whitelisted
        const whitelistKey = `${message.guild.id}_antiscam_whitelist`;
        const whitelist = await db.get(whitelistKey) || [];
        if (whitelist.includes(message.author.id)) return;

        // List of common scam phrases or patterns
        const scamPatterns = [
            /free\s*nitro/i,
            /steam\s*gift/i,
            /discord\s*nitro\s*giveaway/i,
            /\b(?:https?:\/\/)?(?:discord\.(?:gg|io|me|li)|discordapp\.com\/invite)\/[a-z0-9]+\b/i,
            /claim\s*your\s*prize/i
        ];

        if (scamPatterns.some(pattern => pattern.test(message.content))) {
            try {
                await message.delete();
                await message.member.timeout(300000, 'Potential scam message detected');

                // Send log if logging is enabled
                const logChannelId = await db.get(`${message.guild.id}_logchannel`);
                if (logChannelId) {
                    const logChannel = message.guild.channels.cache.get(logChannelId);
                    if (logChannel) {
                        const { EmbedBuilder } = require('boda.js');
                        const language = await db.get(`${message.guild.id}_language`) || 'en';
                        const logEmbed = new EmbedBuilder()
                            .setTitle(language === 'ar' ? '🕵️ تم تفعيل الحماية ضد الاحتيال' : '🕵️ Anti-Scam Protection Triggered')
                            .setColor(0xFFFF00)
                            .setDescription(language === 'ar' ? 'تم اكتشاف رسالة احتيال محتملة وإزالتها.' : 'A potential scam message was detected and removed.')
                            .addFields(
                                { name: language === 'ar' ? 'المستخدم' : 'User', value: `${message.author.tag} (${message.author.id})`, inline: true },
                                { name: language === 'ar' ? 'الإجراء' : 'Action', value: language === 'ar' ? 'تم حذف الرسالة وإيقاف المستخدم مؤقتًا لمدة 5 دقائق' : 'Message deleted and user timed out for 5 minutes', inline: true },
                                { name: language === 'ar' ? 'محتوى الرسالة' : 'Message Content', value: message.content.slice(0, 1024) }
                            )
                            .setTimestamp()
                            .setFooter({ text: `User ID: ${message.author.id}` });

                        logChannel.send({ embeds: [logEmbed] });
                    }
                }
            } catch (error) {
                console.error('Error in anti-scam system:', error);
            }
        }
    }
});


// Anti-Spam System
const messageCount = {};

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    const guildId = message.guild.id;
    const isAntiSpamEnabled = await db.get(`${guildId}_antispam`);
    if (!isAntiSpamEnabled) return;
    if (message.member.permissions.has("Administrator")) return;

    const whitelist = (await db.get(`${guildId}_antispam_whitelist`)) || [];
    if (whitelist.includes(message.author.id)) return;

    const spamThreshold = (await db.get(`${guildId}_antispam_limit`)) || 5;
    const spamInterval = 5000;
    const timeoutDuration = 5 * 60 * 1000; // 5 دقائق

    // زيادة العداد
    if (!messageCount[message.author.id]) messageCount[message.author.id] = 0;
    messageCount[message.author.id]++;

    // بعد فترة معينة، نخفض العداد تلقائياً
    setTimeout(() => {
        messageCount[message.author.id]--;
        if (messageCount[message.author.id] <= 0) delete messageCount[message.author.id];
    }, spamInterval);

    // تجاوز الحد → تنفيذ الإجراء مباشرة
    if (messageCount[message.author.id] > spamThreshold) {
        try {
            // Timeout المستخدم
            await message.member.timeout(timeoutDuration, "Spamming detected").catch(err => {
                console.error("❌ Failed to timeout user:", err.message);
            });

            // حذف آخر الرسائل في القناة
            await message.channel.bulkDelete(spamThreshold + 1, true).catch(() => {});

            // سجل الحدث في قناة اللوج
            const language = (await db.get(`${guildId}_language`)) || "en";
            const logChannelId = await db.get(`${guildId}_logchannel`);
            if (logChannelId) {
                const logChannel = message.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle(language === "ar" ? "🚫 تم تفعيل الحماية ضد الرسائل المتكررة" : "🚫 Anti-Spam Protection Triggered")
                        .setColor(0xff0000)
                        .setDescription(
                            language === "ar"
                                ? "تم اكتشاف رسائل متكررة من مستخدم. تم اتخاذ إجراء."
                                : "Spam detected from a user. Action has been taken."
                        )
                        .addFields(
                            { name: language === "ar" ? "المستخدم" : "User", value: `${message.author.tag} (${message.author.id})`, inline: true },
                            { name: language === "ar" ? "الإجراء" : "Action", value: language === "ar" ? "تم حذف الرسائل وإيقاف المستخدم مؤقتًا لمدة 5 دقائق" : "Messages deleted and user timed out for 5 minutes", inline: true },
                            { name: language === "ar" ? "عدد الرسائل المتكررة" : "Spam Count", value: `${messageCount[message.author.id]} / ${spamThreshold}`, inline: true }
                        )
                        .setTimestamp()
                        .setFooter({ text: `User ID: ${message.author.id}` });

                    logChannel.send({ embeds: [logEmbed] });
                }
            }

            // إعادة ضبط العداد
            delete messageCount[message.author.id];
        } catch (error) {
            console.error("Error in anti-spam system:", error);
        }
    }
});

// Anti-Channel Delete Protection
client.on('channelDelete', async (channel) => {
    const isAntiChannelDeleteEnabled = await db.get(`${channel.guild.id}_antichandeldelete`);
    if (isAntiChannelDeleteEnabled === true) {
        const deleteLimit = await db.get(`${channel.guild.id}_antichanneldelete_limit`) || 1; // Default to 1 if not set
        const deletionCount = await db.get(`${channel.guild.id}_channel_deletions`) || 0;
        const language = await db.get(`${channel.guild.id}_language`) || 'en';

        if (deletionCount >= deleteLimit) {
            const auditLogs = await channel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelDelete, limit: 1 });
            const deletionLog = auditLogs.entries.first();

            if (!deletionLog) return;

            const { executor } = deletionLog;
            if (executor.id === client.user.id) return;
            if (channel.guild.ownerId === executor.id) return;

            // Check if the executor is whitelisted
            const whitelistKey = `${channel.guild.id}_antichanneldelete_whitelist`;
            const whitelist = await db.get(whitelistKey) || [];
            if (whitelist.includes(executor.id)) return;

            try {
                const newChannel = await channel.clone();
                await newChannel.setPosition(channel.position);

                // Get the punishment action
                const punishmentAction = await db.get(`${channel.guild.id}_punishment`) || 'removeroles';

                // Apply the punishment
                const member = await channel.guild.members.fetch(executor.id);
                switch (punishmentAction) {
                    case 'removeroles':
                        await member.roles.remove(member.roles.cache);
                        break;
                    case 'kick':
                        await member.kick('Anti-Channel Delete Protection');
                        break;
                    case 'ban':
                        await member.ban({ reason: 'Anti-Channel Delete Protection' });
                        break;
                }

                const logChannelId = await db.get(`${channel.guild.id}_logchannel`);
                if (logChannelId) {
                    const logChannel = channel.guild.channels.cache.get(logChannelId);
                    if (logChannel) {
                        const { EmbedBuilder } = require('boda.js');
                        const logEmbed = new EmbedBuilder()
                            .setTitle(language === 'ar' ? '🗑️ تم تفعيل حماية حذف القنوات' : '🗑️ Anti-Channel Delete Triggered')
                            .setColor(0x800080)
                            .setDescription(language === 'ar' ? 'تم حذف قناة وتمت استعادتها. تم تطبيق العقوبة على المنفذ.' : 'A channel was deleted and has been restored. Punishment applied to the executor.')
                            .addFields(
                                { name: language === 'ar' ? 'اسم القناة' : 'Channel Name', value: channel.name, inline: true },
                                { name: language === 'ar' ? 'تم الحذف بواسطة' : 'Deleted By', value: `${executor.tag} (${executor.id})`, inline: true },
                                { name: language === 'ar' ? 'الإجراء المتخذ' : 'Action Taken', value: language === 'ar' ? `تمت استعادة القناة وتطبيق ${punishmentAction} على المنفذ` : `Channel restored and ${punishmentAction} applied to executor` }
                            )
                            .setTimestamp()
                            .setFooter({ text: language === 'ar' ? `معرف القناة: ${channel.id}` : `Channel ID: ${channel.id}` });

                        logChannel.send({ embeds: [logEmbed] });
                    }
                }
            } catch (error) {
                console.error('Error in anti-channel delete system:', error);
            }
        }

        // Increment the deletion count
        await db.set(`${channel.guild.id}_channel_deletions`, deletionCount + 1);

        // Reset the count after 10 minutes
        setTimeout(async () => {
            await db.set(`${channel.guild.id}_channel_deletions`, 0);
        }, 600000);
    }
});

// Anti-Channel Create Protection
// =========================
// Anti-Role Create Protection
// =========================
// Anti-Role Create Protection
client.on('roleCreate', async (role) => {
    const isAntiRoleCreateEnabled = await db.get(`${role.guild.id}_antirolecreate`);
    if (isAntiRoleCreateEnabled === true) {
        const createLimit = await db.get(`${role.guild.id}_antirolecreate_limit`) || 1; // Default to 1 if not set
        const creationCount = await db.get(`${role.guild.id}_role_creations`) || 0;

        if (creationCount >= createLimit) {
            const auditLogs = await role.guild.fetchAuditLogs({ type: AuditLogEvent.RoleCreate, limit: 1 });
            const creationLog = auditLogs.entries.first();

            if (!creationLog) return;

            const { executor } = creationLog;
            if (executor.id === client.user.id) return;
            if (role.guild.ownerId === executor.id) return;

            // Check whitelist
            const whitelist = await db.get(`${role.guild.id}_whitelist`) || [];
            if (whitelist.includes(executor.id)) return;

            try {
                await role.delete();

                // Get the punishment action
                const punishmentAction = await db.get(`${role.guild.id}_punishment`) || 'removeroles';

                // Apply the punishment
                const member = await role.guild.members.fetch(executor.id);
                switch (punishmentAction) {
                    case 'removeroles':
                        await member.roles.remove(member.roles.cache);
                        break;
                    case 'kick':
                        await member.kick('Anti-Role Create Protection');
                        break;
                    case 'ban':
                        await member.ban({ reason: 'Anti-Role Create Protection' });
                        break;
                }

                const logChannelId = await db.get(`${role.guild.id}_logchannel`);
                if (logChannelId) {
                    const logChannel = role.guild.channels.cache.get(logChannelId);
                    if (logChannel) {
                        const { EmbedBuilder } = require('boda.js');
                        const language = await db.get(`${role.guild.id}_language`) || 'en';
                        const logEmbed = new EmbedBuilder()
                            .setTitle(language === 'ar' ? '🏷️ تم تفعيل حماية إنشاء الرتب' : '🏷️ Anti-Role Create Triggered')
                            .setColor(0x1E90FF)
                            .setDescription(language === 'ar' ? 'تم اكتشاف إنشاء رتبة غير مصرح به وتم إلغاؤه. تم تطبيق العقوبة على المنفذ.' : 'An unauthorized role creation was detected and reversed. Punishment applied to the executor.')
                            .addFields(
                                { name: language === 'ar' ? 'اسم الرتبة' : 'Role Name', value: role.name, inline: true },
                                { name: language === 'ar' ? 'تم الإنشاء بواسطة' : 'Created By', value: `${executor.tag} (${executor.id})`, inline: true },
                                { name: language === 'ar' ? 'الإجراء المتخذ' : 'Action Taken', value: language === 'ar' ? `تم حذف الرتبة وتطبيق ${punishmentAction} على المنفذ` : `Role deleted and ${punishmentAction} applied to executor` }
                            )
                            .setTimestamp()
                            .setFooter({ text: language === 'ar' ? `معرف الرتبة: ${role.id}` : `Role ID: ${role.id}` });

                        logChannel.send({ embeds: [logEmbed] });
                    }
                }
            } catch (error) {
                console.error('Error in anti-role create system:', error);
            }
        }

        // Increment the creation count
        await db.set(`${role.guild.id}_role_creations`, creationCount + 1);

        // Reset the count after 10 minutes
        setTimeout(async () => {
            await db.set(`${role.guild.id}_role_creations`, 0);
        }, 600000);
    }
});

// Anti-Role Delete Protection
client.on('roleDelete', async (role) => {
    const isAntiRoleDeleteEnabled = await db.get(`${role.guild.id}_antiroledelete`);
    if (isAntiRoleDeleteEnabled === true) {
        const deleteLimit = await db.get(`${role.guild.id}_antiroledelete_limit`) || 1; // Default to 1 if not set
        const deletionCount = await db.get(`${role.guild.id}_role_deletions`) || 0;

        if (deletionCount >= deleteLimit) {
            const auditLogs = await role.guild.fetchAuditLogs({ type: AuditLogEvent.RoleDelete, limit: 1 });
            const deletionLog = auditLogs.entries.first();

            if (!deletionLog) return;

            const { executor } = deletionLog;
            if (executor.id === client.user.id) return;
            if (role.guild.ownerId === executor.id) return;

            // Check whitelist
            const whitelist = await db.get(`${role.guild.id}_whitelist`) || [];
            if (whitelist.includes(executor.id)) return;

            try {
                const newRole = await role.guild.roles.create({
                    name: role.name,
                    color: role.color,
                    hoist: role.hoist,
                    permissions: role.permissions,
                    position: role.position,
                    mentionable: role.mentionable
                });

                // Get the punishment action
                const punishmentAction = await db.get(`${role.guild.id}_punishment`) || 'removeroles';

                // Apply the punishment
                const member = await role.guild.members.fetch(executor.id);
                switch (punishmentAction) {
                    case 'removeroles':
                        await member.roles.remove(member.roles.cache);
                        break;
                    case 'kick':
                        await member.kick('Anti-Role Delete Protection');
                        break;
                    case 'ban':
                        await member.ban({ reason: 'Anti-Role Delete Protection' });
                        break;
                }

                const logChannelId = await db.get(`${role.guild.id}_logchannel`);
                if (logChannelId) {
                    const logChannel = role.guild.channels.cache.get(logChannelId);
                    if (logChannel) {
                        const { EmbedBuilder } = require('boda.js');
                        const language = await db.get(`${role.guild.id}_language`) || 'en';
                        const logEmbed = new EmbedBuilder()
                            .setTitle(language === 'ar' ? '🗑️ تم تفعيل حماية حذف الرتب' : '🗑️ Anti-Role Delete Triggered')
                            .setColor(0xDC143C)
                            .setDescription(language === 'ar' ? 'تم حذف رتبة وتمت استعادتها. تم إزالة جميع الرتب من المنفذ.' : 'A role was deleted and has been restored. All roles removed from the executor.')
                            .addFields(
                                { name: language === 'ar' ? 'اسم الرتبة' : 'Role Name', value: role.name, inline: true },
                                { name: language === 'ar' ? 'تم الحذف بواسطة' : 'Deleted By', value: `${executor.tag} (${executor.id})`, inline: true },
                                { name: language === 'ar' ? 'الإجراء المتخذ' : 'Action Taken', value: language === 'ar' ? 'تمت استعادة الرتبة وإزالة جميع الرتب من المنفذ' : 'Role restored and all roles removed from executor' }
                            )
                            .setTimestamp()
                            .setFooter({ text: language === 'ar' ? `معرف الرتبة: ${newRole.id}` : `Role ID: ${newRole.id}` });

                        logChannel.send({ embeds: [logEmbed] });
                    }
                }
            } catch (error) {
                console.error('Error in anti-role delete system:', error);
            }
        }

        // Increment the deletion count
        await db.set(`${role.guild.id}_role_deletions`, deletionCount + 1);

        // Reset the count after 10 minutes
        setTimeout(async () => {
            await db.set(`${role.guild.id}_role_deletions`, 0);
        }, 600000);
    }
});

client.on('roleUpdate', async (oldRole, newRole) => {
    const isAntiRoleEditEnabled = await db.get(`${newRole.guild.id}_antiroleedit`);
    if (isAntiRoleEditEnabled === true) {
        const editLimit = await db.get(`${newRole.guild.id}_antiroleedit_limit`) || 3; // Default to 3 if not set
        const editCount = await db.get(`${newRole.guild.id}_role_edits`) || 0;

        if (editCount >= editLimit) {
            const auditLogs = await newRole.guild.fetchAuditLogs({ type: AuditLogEvent.RoleUpdate, limit: 1 });
            const updateLog = auditLogs.entries.first();

            if (!updateLog) return;

            const { executor } = updateLog;
            if (executor.id === client.user.id) return;
            if (newRole.guild.ownerId === executor.id) return;

            // Check whitelist
            const whitelist = await db.get(`${newRole.guild.id}_whitelist`) || [];
            if (whitelist.includes(executor.id)) return;

            try {
                await newRole.edit({
                    name: oldRole.name,
                    color: oldRole.color,
                    hoist: oldRole.hoist,
                    permissions: oldRole.permissions,
                    mentionable: oldRole.mentionable
                });

                // تحديد العقوبة
                const punishmentAction = await db.get(`${newRole.guild.id}_punishment`) || 'removeroles';

                // تطبيق العقوبة
                const member = await newRole.guild.members.fetch(executor.id);
                switch (punishmentAction) {
                    case 'removeroles':
                        await member.roles.remove(member.roles.cache);
                        break;
                    case 'kick':
                        await member.kick('Anti-Role Edit Protection');
                        break;
                    case 'ban':
                        await member.ban({ reason: 'Anti-Role Edit Protection' });
                        break;
                }

                const logChannelId = await db.get(`${newRole.guild.id}_logchannel`);
                if (logChannelId) {
                    const logChannel = newRole.guild.channels.cache.get(logChannelId);
                    if (logChannel) {
                        const { EmbedBuilder } = require('boda.js');
                        const language = await db.get(`${newRole.guild.id}_language`) || 'en';
                        const logEmbed = new EmbedBuilder()
                            .setTitle(language === 'ar' ? '✏️ تم تفعيل حماية تعديل الرتب' : '✏️ Anti-Role Edit Triggered')
                            .setColor(0x32CD32)
                            .setDescription(language === 'ar' ? 'تم اكتشاف تعديل غير مصرح به للرتبة وتم إلغاؤه. تم تطبيق العقوبة.' : 'An unauthorized role edit was detected and reversed. Punishment applied.')
                            .addFields(
                                { name: language === 'ar' ? 'اسم الرتبة' : 'Role Name', value: newRole.name, inline: true },
                                { name: language === 'ar' ? 'تم التعديل بواسطة' : 'Edited By', value: `${executor.tag} (${executor.id})`, inline: true },
                                { name: language === 'ar' ? 'الإجراء المتخذ' : 'Action Taken', value: language === 'ar' ? `تم إلغاء تعديل الرتبة وتطبيق ${punishmentAction}` : `Role edit reversed and ${punishmentAction} applied` }
                            )
                            .setTimestamp()
                            .setFooter({ text: language === 'ar' ? `معرف الرتبة: ${newRole.id}` : `Role ID: ${newRole.id}` });

                        logChannel.send({ embeds: [logEmbed] });
                    }
                }
            } catch (error) {
                console.error('Error in anti-role edit system:', error);
            }
        }
        await db.set(`${newRole.guild.id}_role_edits`, editCount + 1);
        setTimeout(async () => {
            await db.set(`${newRole.guild.id}_role_edits`, 0);
        }, 600000);
    }
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    if (addedRoles.size === 0) return; // No new roles added
    const antiAdminGrantEnabled = await db.get(`${newMember.guild.id}_antiadmingrant`);
    if (!antiAdminGrantEnabled) return;
    const adminRole = addedRoles.find(role => role.permissions.has(PermissionsBitField.Flags.Administrator));
    if (!adminRole) return;
    if (newMember.roles.cache.has(adminRole.id)) {
        console.log('Anti-Admin Grant triggered:', antiAdminGrantEnabled);
        const auditLogs = await newMember.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberRoleUpdate,
        });
        const log = auditLogs.entries.first();
        if (!log) return;

        const { executor } = log;
        if (executor.id === client.user.id || executor.id === newMember.guild.ownerId) return;

        const executorMember = await newMember.guild.members.fetch(executor.id);
        console.log(executorMember)
        if (!executorMember.permissions.has(PermissionsBitField.Flags.Administrator)) return;

        // Check whitelist
        const whitelist = await db.get(`${newMember.guild.id}_antiadmingrant_whitelist`) || [];
        if (whitelist.includes(executor.id)) return;

        try {
            await newMember.roles.remove(addedRoles);

            const punishmentAction = await db.get(`${newMember.guild.id}_punishment`) || 'removeroles';
            const member = await newMember.guild.members.fetch(executor.id);

            switch (punishmentAction) {
                case 'removeroles':
                    await member.roles.remove(member.roles.cache);
                    break;
                case 'kick':
                    await member.kick('Unauthorized Admin Role Grant');
                    break;
                case 'ban':
                    await member.ban({ reason: 'Unauthorized Admin Role Grant' });
                    break;
            }

            const logChannelId = await db.get(`${newMember.guild.id}_logchannel`);
            if (logChannelId) {
                const logChannel = newMember.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    const { EmbedBuilder } = require('boda.js');
                    const language = await db.get(`${newMember.guild.id}_language`) || 'en';
                    const logEmbed = new EmbedBuilder()
                        .setTitle(language === 'ar' ? '👑 تم اكتشاف منح غير مصرح به لرتبة الإدارة' : '👑 Unauthorized Admin Role Grant Detected')
                        .setColor(0xFF0000)
                        .setDescription(language === 'ar' ? 'حاول أحد المشرفين منح رتبة إدارية لمستخدم آخر. تم منع هذا الإجراء.' : 'An administrator attempted to grant admin role to another user. This action was prevented.')
                        .addFields(
                            { name: language === 'ar' ? 'المستخدم المستهدف' : 'Target User', value: `${newMember.user.tag} (${newMember.id})`, inline: true },
                            { name: language === 'ar' ? 'تم المنح بواسطة' : 'Granted By', value: `${executor.tag} (${executor.id})`, inline: true },
                            { name: language === 'ar' ? 'الإجراء المتخذ' : 'Action Taken', value: language === 'ar' ? `تمت إزالة الرتبة الإدارية وتطبيق ${punishmentAction} على المانح` : `Admin role removed and ${punishmentAction} applied to the granter` }
                        )
                        .setTimestamp();

                    logChannel.send({ embeds: [logEmbed] });
                }
            }
        } catch (error) {
            console.error('Error in preventing unauthorized admin role grant:', error);
        }
    }
});
//========================================================== role exite

// Anti-Kick Protection
client.on('guildMemberRemove', async (member) => {
    const antiKick = await db.get(`${member.guild.id}_antikick`);
    if (!antiKick) return;

    const auditLogs = await member.guild.fetchAuditLogs({ type: 20, limit: 1 });
    const kickLog = auditLogs.entries.first();

    if (!kickLog) return;

    const { executor } = kickLog;
    if (executor.id === client.user.id) return;

    const executorMember = await member.guild.members.fetch(executor.id);
    if (executorMember.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    // Check whitelist
    const whitelist = await db.get(`${member.guild.id}_antikick_whitelist`) || [];
    if (whitelist.includes(executor.id)) return;

    const kickLimit = await db.get(`${member.guild.id}_antikick_limit`) || 3;
    const kickCount = await db.get(`${member.guild.id}_${executor.id}_kickcount`) || 0;

    await db.set(`${member.guild.id}_${executor.id}_kickcount`, kickCount + 1);

    if (kickCount + 1 >= kickLimit) {
        const punishmentAction = await db.get(`${member.guild.id}_punishment`) || 'removeroles';

        switch (punishmentAction) {
            case 'removeroles':
                await executorMember.roles.remove(executorMember.roles.cache);
                break;
            case 'kick':
                await executorMember.kick('Exceeded kick limit');
                break;
            case 'ban':
                await executorMember.ban({ reason: 'Exceeded kick limit' });
                break;
        }

        await db.delete(`${member.guild.id}_${executor.id}_kickcount`);

        const logChannelId = await db.get(`${member.guild.id}_logchannel`);
        if (logChannelId) {
            const logChannel = member.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                const language = await db.get(`${member.guild.id}_language`) || 'en';
                const logEmbed = new EmbedBuilder()
                    .setTitle(language === 'ar' ? '👢 تم تفعيل حماية ضد الطرد' : '👢 Anti-Kick Protection Triggered')
                    .setColor(0xFF0000)
                    .setDescription(language === 'ar' ? 'تجاوز أحد المستخدمين الحد المسموح به للطرد. تم تطبيق العقوبة.' : 'A user has exceeded the kick limit. Punishment has been applied.')
                    .addFields(
                        { name: language === 'ar' ? 'المنفذ' : 'Executor', value: `${executor.tag} (${executor.id})`, inline: true },
                        { name: language === 'ar' ? 'الإجراء المتخذ' : 'Action Taken', value: punishmentAction, inline: true },
                        { name: language === 'ar' ? 'حد الطرد' : 'Kick Limit', value: kickLimit.toString(), inline: true }
                    )
                    .setTimestamp();

                logChannel.send({ embeds: [logEmbed] });
            }
        }
    }
});

// Anti-Ban Protection
client.on('guildBanAdd', async (ban) => {
    const antiBan = await db.get(`${ban.guild.id}_antiban`);
    if (!antiBan) return;

    const auditLogs = await ban.guild.fetchAuditLogs({ type: 22, limit: 1 });
    const banLog = auditLogs.entries.first();

    if (!banLog) return;

    const { executor } = banLog;
    if (executor.id === client.user.id) return;

    const executorMember = await ban.guild.members.fetch(executor.id);
    if (executorMember.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    // Check whitelist
    const whitelist = await db.get(`${ban.guild.id}_antiban_whitelist`) || [];
    if (whitelist.includes(executor.id)) return;

    const banLimit = await db.get(`${ban.guild.id}_antiban_limit`) || 3;
    const banCount = await db.get(`${ban.guild.id}_${executor.id}_bancount`) || 0;

    await db.set(`${ban.guild.id}_${executor.id}_bancount`, banCount + 1);

    if (banCount + 1 >= banLimit) {
        const punishmentAction = await db.get(`${ban.guild.id}_punishment`) || 'removeroles';

        switch (punishmentAction) {
            case 'removeroles':
                await executorMember.roles.remove(executorMember.roles.cache);
                break;
            case 'kick':
                await executorMember.kick('Exceeded ban limit');
                break;
            case 'ban':
                await executorMember.ban({ reason: 'Exceeded ban limit' });
                break;
        }

        await db.delete(`${ban.guild.id}_${executor.id}_bancount`);

        const logChannelId = await db.get(`${ban.guild.id}_logchannel`);
        if (logChannelId) {
            const logChannel = ban.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                const language = await db.get(`${ban.guild.id}_language`) || 'en';
                const logEmbed = new EmbedBuilder()
                    .setTitle(language === 'ar' ? '🔨 تم تفعيل حماية ضد الحظر' : '🔨 Anti-Ban Protection Triggered')
                    .setColor(0xFF0000)
                    .setDescription(language === 'ar' ? 'تجاوز أحد المستخدمين الحد المسموح به للحظر. تم تطبيق العقوبة.' : 'A user has exceeded the ban limit. Punishment has been applied.')
                    .addFields(
                        { name: language === 'ar' ? 'المنفذ' : 'Executor', value: `${executor.tag} (${executor.id})`, inline: true },
                        { name: language === 'ar' ? 'الإجراء المتخذ' : 'Action Taken', value: punishmentAction, inline: true },
                        { name: language === 'ar' ? 'حد الحظر' : 'Ban Limit', value: banLimit.toString(), inline: true }
                    )
                    .setTimestamp();

                logChannel.send({ embeds: [logEmbed] });
            }
        }
    }
});
////////-ANTI SPAM EXTERNAL APPSS


client.on('messageCreate', async (message) => {
    if (!message.guild || message.author.bot) return;
    const guildId = message.guild.id;
    const lang = await db.get(`${guildId}_language`) || 'en';

    // تحقق من تفعيل النظام
    const isEnabled = await db.get(`AntiExternalApps_${guildId}`) || false;
    if (!isEnabled) return;

    // إعدادات النظام
    const limit = await db.get(`AntiExternalApps_${guildId}_limit`) || 1;
    const interval = await db.get(`AntiExternalApps_${guildId}_interval`) || 10000; // ms
    const timeoutDuration = await db.get(`AntiExternalApps_${guildId}_timeout`) || 600000; // 10 دقائق

    // Whitelist للمستخدمين والبوتات
    const whitelist = await db.get(`AntiExternalApps_${guildId}_whitelist`) || [];
    if (whitelist.includes(message.author.id)) return;

    // تحقق من وجود روابط أو ملفات أو Webhook
    const linkRegex = /(https?:\/\/[^\s]+|\S+\.(?:jpg|png|gif|pdf|zip|rar|exe))/gi;
    if (!linkRegex.test(message.content) && !message.webhookId) return;

    // زيادة عداد المستخدم
    let userCounter = await db.get(`${guildId}_${message.author.id}_externalLinks`) || 0;
    userCounter++;
    await db.set(`${guildId}_${message.author.id}_externalLinks`, userCounter);

    // إذا تجاوز الحد
    if (userCounter > limit) {
        const member = await message.guild.members.fetch(message.author.id).catch(() => null);
        if (member && message.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            // تطبيق Timeout فقط
            await member.timeout(timeoutDuration, "Anti-External Apps/Links").catch(console.log);
        }

        // Logging
        const logChannelId = await db.get(`AntiExternalApps_${guildId}_logchannel`);
        if (logChannelId) {
            const logChannel = message.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setTitle(lang === 'ar' ? "🚨 محاولة غير مصرح بها" : "🚨 Unauthorized Attempt")
                    .setColor(0xFF0000)
                    .setDescription(lang === 'ar'
                        ? `المستخدم ${message.author.tag} حاول إرسال روابط أو ملفات أو Webhook/Bot.` 
                        : `${message.author.tag} attempted to send links, files, or via Webhook/Bot.`)
                    .addFields(
                        { name: lang === 'ar' ? "الرسالة" : "Message", value: message.content || 'N/A' },
                        { name: lang === 'ar' ? "المستخدم" : "User", value: `${message.author.tag} (${message.author.id})`, inline: true },
                        { name: lang === 'ar' ? "الإجراء المتخذ" : "Action Taken", value: `Timeout ${timeoutDuration / 60000} دقيقة`, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: lang === 'ar' ? 'بوت الحماية القوي' : 'Powerful Protection Bot' });

                logChannel.send({ embeds: [embed] }).catch(console.log);
            }
        }

        await message.delete().catch(console.log);
    }

    // إعادة ضبط العداد بعد الفترة المحددة
    setTimeout(async () => {
        await db.set(`${guildId}_${message.author.id}_externalLinks`, 0);
    }, interval);
});


///=======================================Antibugs================================================================================================
// 1. أي خطأ غير متوقع في أي Promise
process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled Rejection:", reason);
});

// 2. أي خطأ غير متوقع في الـ async/await
process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:", error);
});

// 3. أي خطأ غير متوقع في الـ exceptions
process.on("uncaughtExceptionMonitor", (error, origin) => {
    console.error("❌ Uncaught Exception Monitor:", origin, error);
});

// 4. أي تحذيرات عامة
process.on("warning", (warning) => {
    console.warn("⚠️ Warning:", warning.name, warning.message);
});
client.login(require('./Config.json').Token)