const { EmbedBuilder, AuditLogEvent } = require('boda.js')
const db = require('pro.db')

/**
 * @param { import('discord.js').Client } Client
 * @param { import('discord.js').Role } OldRole 
 * @param { import('discord.js').Role } NewRole  
 */


module.exports = async (Client, OldRole, NewRole) => {
    const ChannelId = db.get(`RolesUpdate_${OldRole.guild.id}`);
    const Log = OldRole.guild.channels.cache.get(ChannelId);
    if(!ChannelId || !Log) return;

    OldRole.guild.fetchAuditLogs({ type: AuditLogEvent.RoleUpdate }).then(async Logs => {

        if(!OldRole.icon && NewRole.icon) {
            const Embed = new EmbedBuilder()
                .setAuthor({ name: 'Role Updated', iconURL: Logs.entries.first().executor.displayAvatarURL() })
                .setDescription(`The icon of the **${NewRole.name}** role was changed by **@${Logs.entries.first().executor.username}**`)
                .addFields([{ name: 'Role Icon', value:  `[Icon URL](${NewRole.iconURL({ size: 4096 })})` }])
                .setFooter({ text: `Role ID: ${NewRole.id}` })
                .setTimestamp()
            Log.send({ embeds: [Embed] })
        } else if(OldRole.icon && !NewRole.icon) {
            const Embed = new EmbedBuilder()
                .setAuthor({ name: 'Role Updated', iconURL: Logs.entries.first().executor.displayAvatarURL() })
                .setDescription(`The icon of the **${NewRole.name}** role was removed by **@${Logs.entries.first().executor.username}**`)
                .setThumbnail(NewRole.iconURL())
                .addFields([{ name: '**Old Icon**', value:  `[Icon URL](${OldRole.iconURL({ size: 4096 })})` }])
                .setTimestamp()
            Log.send({ embeds: [Embed] })
        } else if(OldRole.icon && NewRole.icon) {
            const Embed = new EmbedBuilder()
                .setAuthor({ name: 'Role Updated', iconURL: Logs.entries.first().executor.displayAvatarURL() })
                .setDescription(`The icon of the **${NewRole.name}** role was updated by **@${Logs.entries.first().executor.username}**`)
                .setThumbnail(NewRole.iconURL())
                .addFields([
                    { name: '**Old Icon**', value:  `[Icon URL](${OldRole.iconURL({ size: 4096 })})` },
                    { name: '**New Icon**', value:  `[Icon URL](${NewRole.iconURL({ size: 4096 })})` }
                ])
                .setTimestamp()
            Log.send({ embeds: [Embed] })
        } else if(!OldRole.color && NewRole.color) {
            const Embed = new EmbedBuilder()
                .setColor(NewRole.color)
                .setAuthor({ name: 'Role Updated', iconURL: Logs.entries.first().executor.displayAvatarURL() })
                .setDescription(`The color of the **${NewRole.name}** role was changed by **@${Logs.entries.first().executor.username}**`)
                .addFields([
                    { name: '**New Color**', value:  `${NewRole.hexColor}` }
                ])
                .setTimestamp()
            Log.send({ embeds: [Embed] })
        } else if(OldRole.color && !NewRole.color) {
            const Embed = new EmbedBuilder()
                .setColor(OldRole.color)
                .setAuthor({ name: 'Role Updated', iconURL: Logs.entries.first().executor.displayAvatarURL() })
                .setDescription(`The color of the **${NewRole.name}** role was removed by **@${Logs.entries.first().executor.username}**`)
                .addFields([{ name: '**Old Color**', value:  `${OldRole.hexColor}` }])
                .setTimestamp()
            Log.send({ embeds: [Embed] })
        } else if(OldRole.color && NewRole.color) {
            const Embed = new EmbedBuilder()
                .setColor(NewRole.color)
                .setAuthor({ name: 'Role Updated', iconURL: Logs.entries.first().executor.displayAvatarURL() })
                .setDescription(`The color of the **${NewRole.name}** role was updated by **@${Logs.entries.first().executor.username}**`)
                .addFields([
                    { name: '**Old Color**', value:  `${OldRole.hexColor}` },
                    { name: '**New Color**', value:  `${NewRole.hexColor}` }
                ])
                .setTimestamp()
            Log.send({ embeds: [Embed] })
        } else if(OldRole.name && NewRole.name) {
            const Embed = new EmbedBuilder()
                .setAuthor({ name: Logs.entries.first().executor.username, iconURL: Logs.entries.first().executor.displayAvatarURL() })
                .setDescription(`The name of this role was changed by **@${Logs.entries.first().executor.username}**.`)
                .addFields([
                    { name: '**Old Name**', value:  `${OldRole.name}` },
                    { name: '**New Name**', value:  `${NewRole.name}` }
                ])
                .setTimestamp()
            Log.send({ embeds: [Embed] })
        } else if(OldRole.permissions && NewRole.permissions) {
            const Embed = new EmbedBuilder()
                .setAuthor({ name: Logs.entries.first().executor.username, iconURL: Logs.entries.first().executor.displayAvatarURL() })
                .setDescription(`**:family_mmb: Role permissions has been updated \`${OldRole.name}\`.**`)
                .addFields([
                    { name: '**Old Permissions**', value:  `${OldRole.permissions.bitfield}` },
                    { name: '**New Permissions**', value:  `${NewRole.permissions.bitfield}` },
                    { name: '**Responsible Moderator**', value:  `<@${Logs.entries.first().executor.id}>` }
                ])
                .setTimestamp()
            Log.send({ embeds: [Embed] })
        }
    })
}