const { EmbedBuilder, AuditLogEvent } = require('boda.js')
const db = require('pro.db')

/**
 * @param { import('discord.js').Client } Client
 * @param { import('discord.js').Guild } OldGuild 
 * @param { import('discord.js').Guild } NewGuild 
 */

module.exports = async (Client, OldGuild, NewGuild) => {
    const ChannelId = db.get(`GuildUpdates_${NewGuild.id}`)
    const Log = OldGuild.channels.cache.get(ChannelId);
	if(!ChannelId || !Log) return;
    OldGuild.fetchAuditLogs({ type: AuditLogEvent.GuildUpdate }).then(async Logs => {
        if(!OldGuild.afkChannel && NewGuild.afkChannel) {
            const Embed = new EmbedBuilder()
                .setColor(0xffa600)
                .setAuthor({ name: 'AFK Channel Changed', iconURL: NewGuild.iconURL() })
                .addFields([
                    { name: 'The Channel', value: `${NewGuild.afkChannel}`, inline: true },
                    { name: 'Moderator', value: `<@${Logs.entries.first().executor.id}>`, inline: true }
                ])
                .setTimestamp()
            Log.send({ embeds: [Embed] })
        } else if(!NewGuild.afkChannel && OldGuild.afkChannel) {
            const Embed = new EmbedBuilder()
                .setAuthor({ name: 'AFK Channel Removed', iconURL: NewGuild.iconURL() })
                .addFields([
                    { name: 'Old AFK', value: `${OldGuild.afkChannel}`, inline: true },
                    { name: 'Responsible Moderator', value: `<@${Logs.entries.first().executor.id}>`, inline: true }
                ])
                .setTimestamp()
            Log.send({ embeds: [Embed] })
        } else if(OldGuild.afkChannel && NewGuild.afkChannel) {
            const Embed = new EmbedBuilder()
                .setAuthor({ name: 'AFK Channel Updated', iconURL: NewGuild.iconURL() })
                .setDescription(`AFK Channel has been updated.`)
                .addFields([
                    { name: 'Old AFK', value: `${OldGuild.afkChannel}`, inline: true },
                    { name: 'New AFK', value: `${NewGuild.afkChannel}`, inline: true },
                    { name: 'Moderator', value: `<@${Logs.entries.first().executor.id}>`, inline: true }
                ])
                .setTimestamp()
            Log.send({ embeds: [Embed] })
        } else if(!OldGuild.description && NewGuild.description) {
            const Embed = new EmbedBuilder()
                .setAuthor({ name: 'Guild Description Changed', iconURL: NewGuild.iconURL() })
                .addFields([
                    { name: 'The Description', value: `${NewGuild.description}`, inline: false },
                    { name: 'Moderator', value: `<@${Logs.entries.first().executor.id}>`, inline: false }
                ])
                .setTimestamp()
            Log.send({ embeds: [Embed] })
        } else if(OldGuild.description && NewGuild.description) {
            const Embed = new EmbedBuilder()
                .setAuthor({ name: 'Guild Description Updated', iconURL: NewGuild.iconURL() })
                .addFields([
                    { name: 'Old Description', value: `\`\`\`${OldGuild.description}\`\`\``, inline: true },
                    { name: 'New Description', value: `\`\`\`${NewGuild.description}\`\`\``, inline: true },
                    { name: 'Moderator', value: `<@${Logs.entries.first().executor.id}>`, inline: true }
                ])
                .setTimestamp()
            Log.send({ embeds: [Embed] })
        } else if(OldGuild.description && !NewGuild.description == null) {
            const Embed = new EmbedBuilder()
                .setAuthor({ name: 'Guild Description Removed', iconURL: NewGuild.iconURL() })
                .addFields([
                    { name: 'Old Description', value: `${OldGuild.description}`, inline: false },
                    { name: 'Moderator', value: `<@${Logs.entries.first().executor.id}>`, inline: false }
                ])
                .setTimestamp()
            Log.send({ embeds: [Embed] })
        } else if(NewGuild.name && OldGuild.name) {
            const Embed = new EmbedBuilder()
                .setAuthor({ name: 'Guild Name Updated', iconURL: NewGuild.iconURL() })
                .setDescription(`Guild Name has been updated.`)
                .addFields([
                    { name: 'Old Name', value: `\`${OldGuild.name}\``, inline: true },
                    { name: 'New Name', value: `\`${NewGuild.name}\``, inline: true },
                    { name: 'Moderator', value: `<@${Logs.entries.first().executor.id}>`, inline: true }
                ])
                .setTimestamp()
            Log.send({ embeds: [Embed] })
        } 
    }) 
}