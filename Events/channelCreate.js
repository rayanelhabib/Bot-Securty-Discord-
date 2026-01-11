const { EmbedBuilder, AuditLogEvent, ChannelType } = require('boda.js')
const db = require('pro.db')

/**
 * @param { import('discord.js').Client } Client 
 * @param { import('discord.js').GuildChannel } Channel 
 */

module.exports = async(Client, Channel) => {

    const ChannelId = db.get(`Channels_${Channel.guild.id}`)

    const Log = Channel.guild.channels.cache.get(ChannelId)

    if(!ChannelId || !Log) return;

    const Logs = await Channel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelCreate })

    const Embed = new EmbedBuilder()
        .setColor(0x77dd77)
        .addFields([
            { name: 'Channel', value: `#${Channel.name}`, inline: true },
            { name: 'Moderator', value: `@${Logs.entries.first().executor.username}`, inline: true }        
        ])
        .setFooter({ text: `Channel ID: ${Channel.id}` })
        .setTimestamp()

    switch(Channel.type) {
        case 0 :
            Embed.setAuthor({ name: 'Channel Created', iconURL: Channel.guild.iconURL() })
        break;
        case 2 :
            Embed.setAuthor({ name: 'Voice Channel Created', iconURL: Channel.guild.iconURL() })
        break;
        case 4 :
            Embed.setAuthor({ name: 'Category Created', iconURL: Channel.guild.iconURL() })
        break;
        case 5 :
            Embed.setAuthor({ name: 'Announcement Created', iconURL: Channel.guild.iconURL() })
        break;
        case 13 :
            Embed.setAuthor({ name: 'Stage Voice Created', iconURL: Channel.guild.iconURL() })
        break;
        default :
            Embed.setAuthor({ name: 'Channel Created', iconURL: Channel.guild.iconURL() })
    }

    Log.send({ embeds: [Embed] })

}