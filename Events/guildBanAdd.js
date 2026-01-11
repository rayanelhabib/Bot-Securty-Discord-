const { EmbedBuilder, AuditLogEvent } = require('boda.js')
const db = require('pro.db')

/**
 * @param { import('discord.js').Client } Client 
 * @param { import('discord.js').GuildMember } Member 
 */

module.exports = async(Client, Member) => {
    const ChannelId = db.get(`GuildMembers_$${Member.guild.id}`);
    const Log = Member.guild.channels.cache.get(ChannelId);
    if(!ChannelId || !Log) return;

    const Logs = await Member.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd });
    const Embed = new EmbedBuilder()
        .setColor(0xe74d3c)
        .setAuthor({ name: 'Member Banned', iconURL: Member.user.displayAvatarURL() })
        .addFields([
            { name: 'User', value: `@${Member.user.username}`, inline: true },
            { name: 'Moderator', value: `@${Logs.entries.first().executor.id}`}
        ])
        .setFooter({ text: `User ID: ${Member.id}` })
        .setTimestamp()
    Log.send({ embeds: [Embed] })
}