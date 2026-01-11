const { EmbedBuilder, AuditLogEvent } = require('boda.js')
const db = require('pro.db')
const ms = require('ms');

/**
 * @param { import('discord.js').Client } Client
 * @param { import('discord.js').GuildMember } Member 
 */

module.exports = async(Client, Member) => {
    const ChannelId = db.get(`GuildMembers_${Member.guild.id}`);
    const Log = Member.guild.channels.cache.get(ChannelId);

    if(!ChannelId || !Log) return;

    if(Member.user.bot) {
        Member.guild.fetchAuditLogs({ type: AuditLogEvent.BotAdd }).then(async Logs => {
            const Embed = new EmbedBuilder()
                .setColor(0x77dd77)
                .setAuthor({ name: Member.user.username, iconURL: Member.user.avatarURL() })
                .setDescription(`${Member} has been invited to the server by **@${Logs.entries.first().executor.username}**! The role linked with this bot is \`${Member.roles.botRole.name}\`!`)
                .addFields([
                    { name: 'Account Created', value: `<t:${Math.floor(Member.user.createdAt / 1000)}:F>`, inline: true },
                    { name: 'Member Count', value: `${Member.guild.memberCount}`, inline: true }
                ])
                .setFooter({ text: `User ID: ${Member.user.id}` })
                .setTimestamp()
            Log.send({ embeds: [Embed] })
        })
    } else {
        const Invite = (await Member.guild.invites.fetch()).find((Invite) => Invite.uses > Client.GuildsInvites.get(Invite.code));
        const Embed = new EmbedBuilder() 
            .setColor(0x77dd77)
            .setAuthor({ name: Member.user.username, iconURL: Member.user.avatarURL() })
            .setDescription(`${Member} has joined the server!`)
            .addFields([
                { name: 'Account Created', value: `<t:${Math.floor(Member.user.createdAt / 1000 )}:F>`, inline: true },
                { name: 'Member Count', value: `${Member.guild.memberCount}`, inline: true },
                { name: 'Inviter', value: `${Invite.inviter}`, inline: true }
            ])
            .setFooter({ text: `User ID: ${Member.id}` })
            .setTimestamp()
    
        Log.send({ embeds: [Embed] })
    }
}