const { EmbedBuilder, AuditLogEvent } = require('boda.js')
const db = require('pro.db')

/**
 * @param { import('discord.js').Client } Client 
 * @param { import('discord.js').GuildChannel } Channel 
 */

module.exports = async (Client, Channel) => {

    const ChannelId = db.get(`Channels_${Channel.guildId}`);
    const Log = Channel.guild.channels.cache.get(ChannelId);
    if(!ChannelId || !Log) return;

    const Logs = await Channel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelDelete });

    const Embed = new EmbedBuilder()
        .setColor(0xe74d3c)
        .setAuthor({ name: 'Channel Deleted', iconURL: Channel.guild.iconURL() })
        .addFields([
            { name: 'Channel', value: `#${Channel.name}`, inline: true },
            { name: 'Moderator', value: `@${Logs.entries.first().executor.username}`, inline: true }
        ])
        .setFooter({ text: `Channel ID: ${Channel.id}` })
        .setTimestamp()

    Log.send({ embeds: [Embed] })

}