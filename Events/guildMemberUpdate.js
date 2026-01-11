const { EmbedBuilder, AuditLogEvent } = require('boda.js')
const db = require('pro.db')

/**
 * @param { import('discord.js').Client } Client
 * @param { import('discord.js').GuildMember } OldMember 
 * @param { import('discord.js').GuildMember } NewMember 
 */

module.exports = async(Client, OldMember, NewMember) => {
    const ChannelId = db.get(`GuildMembers_${OldMember.guild.id}`);
    const Log = OldMember.guild.channels.cache.get(ChannelId);
    if(!ChannelId || !Log) return;
    const Logs = await OldMember.guild.fetchAuditLogs({ type: AuditLogEvent.MemberUpdate });

    if(OldMember.roles.cache.size < NewMember.roles.cache.size) {
        const Role = NewMember.roles.cache.filter((role) => !OldMember.roles.cache.has(role.id)).first();
        const Embed = new EmbedBuilder()
            .setColor(0xffa600)
            .setAuthor({ name: 'Member Role Changed', iconURL: OldMember.guild.iconURL() })
            .setDescription(`${NewMember.user} was given the **${Role.name}** role.`)
            .addFields({ name: 'Moderator', value: `<@${Logs.entries.first().executor.id}>`, inline: true })
            .setFooter({ text: `User ID: ${NewMember.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    } else if(OldMember.roles.cache.size > NewMember.roles.cache.size) {
        const Role = OldMember.roles.cache.filter((role) => !NewMember.roles.cache.has(role.id)).first();
        const Embed = new EmbedBuilder()
            .setColor(0xffa600)
            .setAuthor({ name: 'Member Role Changed', iconURL: OldMember.guild.iconURL() })
            .setDescription(`${NewMember.user} was removed from the **${Role.name}** role.`)
            .addFields({ name: 'Moderator', value: `<@${Logs.entries.first().executor.id}>`, inline: true })
            .setFooter({ text: `User ID: ${NewMember.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    } else if(OldMember.guild.ownerId !== NewMember.guild.ownerId) {
        const Embed = new EmbedBuilder()
            .setColor(0xffa600)
            .setAuthor({ name: 'Guild Ownership Updated', iconURL: NewMember.guild.iconURL() })
            .setDescription(`**:writing_hand: ${OldMember.user} has been updated.**`)
            .addFields([
                { name: 'Old Ownership', value: `<@${OldMember.guild.ownerId}>`, inline: true },
                { name: 'New Ownership', value: `<@${NewMember.guild.ownerId}>`, inline: true }
            ])
            .setFooter({ text: `User ID: ${NewMember.guild.ownerId}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    } else if(OldMember.nickname !== NewMember.nickname) {
        const Embed = new EmbedBuilder()
            .setColor(0xffa600)
            .setAuthor({ name: 'Member Nickname Changed', iconURL: NewMember.guild.iconURL() })
            .setDescription(`The nickname for ${NewMember.user} was changed by **${NewMember.user.username}**.`)
            .addFields([
                { name: 'Before', value: `${OldMember.nickname}`, inline: true },
                { name: 'After', value: `${NewMember.nickname ? NewMember.nickname : NewMember.user.username}`, inline: true }
            ])
            .setFooter({ text: `User ID: ${NewMember.user.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    }
}