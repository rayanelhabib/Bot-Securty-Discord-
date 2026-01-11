const { EmbedBuilder, AuditLogEvent } = require('boda.js')
const db = require('pro.db')

/**
 * @param { import('discord.js').Client } Client 
 * @param { import('discord.js').Role } Role 
 */

module.exports = async(Client, Role) => {
    const ChannelId = db.get(`RolesUpdate_${Role.guild.id}`);
    const Log = Role.guild.channels.cache.get(ChannelId);
    if(!ChannelId || !Log) return;
    
    Role.guild.fetchAuditLogs({ type: AuditLogEvent.RoleUpdate }).then(async Logs => {
        const Username = Logs.entries.first().executor.username;

        const Embed = new EmbedBuilder()
            .setColor(0xe74d3c)
            .setAuthor({ name: 'Role Deleted', iconURL: Role.guild.iconURL() })
            .addFields([
                { name: 'Role', value: `${Role.name}`, inline: true },
                { name: 'Moderator', value: `@${Username}`, inline: true }
            ])
            .setFooter({ text: `Role ID: ${Role.id}` })
            .setFooter({ text: Role.guild.name })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    })
}