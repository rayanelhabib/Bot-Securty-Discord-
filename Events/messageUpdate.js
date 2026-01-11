const { EmbedBuilder } = require('boda.js');
const db = require('pro.db');

/**
 * @param { import('discord.js').Client } Client 
 * @param { import('discord.js').Message } OldMessage 
 * @param { import('discord.js').Message } NewMessage 
 */

module.exports = async (Client, OldMessage, NewMessage) => {
    if (OldMessage.content === NewMessage.content) return;

    const ChannelId = db.get(`Messages_${OldMessage.guild.id}`);
    const LogChannel = OldMessage.guild.channels.cache.get(ChannelId);
    if (!ChannelId || !LogChannel) return;

    const Embed = new EmbedBuilder()
        .setColor(0xFFA500)
        .setAuthor({ name: 'Message Edited', iconURL: OldMessage.author.displayAvatarURL() })
        .addFields([
            { name: 'Author', value: `<@${OldMessage.author.id}>`, inline: true },
            { name: 'Channel', value: `<#${OldMessage.channel.id}>`, inline: true },
            { name: 'Old Content', value: OldMessage.content.substring(0, 1024) || 'None', inline: false },
            { name: 'New Content', value: NewMessage.content.substring(0, 1024) || 'None', inline: false }
        ])
        .setFooter({ text: `Message ID: ${OldMessage.id}` })
        .setTimestamp();

    LogChannel.send({ embeds: [Embed] });
};
