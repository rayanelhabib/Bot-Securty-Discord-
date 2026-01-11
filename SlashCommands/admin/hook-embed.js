const webhook = await channel.createWebhook({
    name: server.name,
    avatar: server.iconURL({ dynamic: true }) || 'https://cdn.discordapp.com/embed/avatars/0.png',
});