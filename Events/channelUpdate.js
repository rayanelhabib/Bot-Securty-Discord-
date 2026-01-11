const { EmbedBuilder, AuditLogEvent, ChannelType } = require('boda.js')
const db = require('pro.db')

/**
 * @param { import('discord.js').Client } Client 
 * @param { import('discord.js').GuildChannel } OldChannel 
 * @param { import('discord.js').GuildChannel } NewChannel 
 */

module.exports = async(Client, OldChannel, NewChannel) => {
    const ChannelId = db.get(`Channels_${NewChannel.guild.id}`);
    const Log = await OldChannel.guild.channels.cache.get(ChannelId);
    if(!ChannelId || !Log) return;

    const Logs = await OldChannel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelUpdate });

    if(OldChannel.name !== NewChannel.name) {

        const Embed = new EmbedBuilder()
            .setColor(0x77dd77)
            .setAuthor({ name: 'Channel Renamed', iconURL: NewChannel.guild.iconURL() })
            .setDescription(`The name of this channel was changed by **@${Logs.entries.first().executor.username}**.`)
            .addFields([
                { name: 'Before', value: `${OldChannel.name}`, inline: true },
                { name: 'After', value: `${NewChannel.name}`, inline: true }
            ])
            .setFooter({ text: `Channel ID: ${NewChannel.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })

    } else if(!OldChannel.topic && NewChannel.topic) {

        const Embed = new EmbedBuilder()
            .setColor(0x77dd77)
            .setAuthor({ name: 'Channel Topic Created', iconURL: NewChannel.guild.iconURL() })
            .setDescription(`The topic of the **#${NewChannel.name}** channel was changed by **@${Logs.entries.first().executor.username}**.`)
            .addFields({ name: 'The Topic', value: `${NewChannel.topic}` })
            .setFooter({ text: `Channel ID: ${NewChannel.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })

    } else if(OldChannel.topic !== NewChannel.topic) {

        const Embed = new EmbedBuilder()
            .setColor(0xffa600)
            .setAuthor({ name: 'Channel Topic Updated', iconURL: NewChannel.guild.iconURL() })
            .setDescription(`The topic of the **#${NewChannel.name}** channel was changed by **@${Logs.entries.first().executor.username}**.`)
            .addFields([
                { name: 'Before', value: `${OldChannel.topic}`, inline: true },
                { name: 'After', value: `${NewChannel.topic}`, inline: true }
            ])
            .setFooter({ text: `Channel ID: ${NewChannel.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })

    } else if(OldChannel.topic && !NewChannel.topic) {

        const Embed = new EmbedBuilder()
            .setColor(0xe74d3c)
            .setAuthor({ name: 'Channel Topic Deleted', iconURL: NewChannel.guild.iconURL() })
            .setDescription(`The topic of the **#${NewChannel.name}** channel was changed by **@${Logs.entries.first().executor.username}**.`)
            .addFields({ name: 'Old Topic', value: `${OldChannel.topic}`, inline: true })
            .setFooter({ text: `Channel ID: ${NewChannel.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })

    } else if(!OldChannel.parent && NewChannel.parent) {
        const Embed = new EmbedBuilder()
            .setColor(0x77dd77)
            .setAuthor({ name: 'Channel Category Changed', iconURL: NewChannel.guild.iconURL() })
            .setDescription(`The category of the **#${NewChannel.name}** channel was changed by **@${Logs.entries.first().executor.username}**.`)
            .addFields([
                { name: 'Category', value: `${NewChannel.parent}`, inline: true },
                { name: 'Moderator', value: `<@${Logs.entries.first().executor.id}>`, inline: true }
            ])
            .setFooter({ text: `User ID: ${Logs.entries.first().executor.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    } else if(OldChannel.parent !== NewChannel.parent) {
        const Embed = new EmbedBuilder()
            .setColor(0x77dd77)
            .setAuthor({ name: 'Channel Category Updated', iconURL: NewChannel.guild.iconURL() })
            .setDescription(`The category of the **#${NewChannel.name}** channel was updated by **@${Logs.entries.first().executor.username}**.`)
            .addFields([
                { name: 'Old Category', value: `${OldChannel.parent}`, inline: true },
                { name: 'New Category', value: `${NewChannel.parent ? NewChannel.parent : 'No Category'}`, inline: true },
                { name: 'Moderator', value: `<@${Logs.entries.first().executor.id}>`, inline: true }
            ])
            .setFooter({ text: `User ID: ${Logs.entries.first().executor.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    }
}
