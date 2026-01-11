const { EmbedBuilder, AuditLogEvent } = require('boda.js')
const db = require('pro.db')

/**
 * 
 * @param { import('discord.js').Client } Client 
 * @param { import('discord.js').Role } Role 
 */

module.exports = async(Client, Role) => {
    const ChannelId = db.get(`RolesUpdate_${Role.guild.id}`);
    const Log = Role.guild.channels.cache.get(ChannelId);
    if(!ChannelId || !Log) return;
    
    Role.guild.fetchAuditLogs({ type: AuditLogEvent.RoleCreate }).then(async Logs => {
        const Username = Logs.entries.first().executor.username;

        const Embed = new EmbedBuilder()
            .setColor(0x77dd77)
            .setAuthor({ name: 'Role Created', iconURL: Role.guild.iconURL() })
            .addFields([
                { name: 'Role', value: `${Role.name}`, inline: true },
                { name: 'Moderator', value: `@${Username}`, inline: true }
            ])
            .setFooter({ text: `Role ID: ${Role.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    })
}