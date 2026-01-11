const { EmbedBuilder, AuditLogEvent } = require('boda.js')
const db = require('pro.db')

/**
 * @param { import('discord.js').Client } Client
 * @param { import('discord.js').GuildMember } Member 
 */

module.exports = async(Client, Member) => {
    const ChannelId = db.get(`GuildMembers_${Member.guild.id}`)
    const Log = Member.guild.channels.cache.find(Channel => Channel.id === ChannelId)
	if(!ChannelId || !Log) return;

    const Embed = new EmbedBuilder()
        .setColor(0xe74d3c)
        .setAuthor({ name: `@${Member.user.username}`, iconURL: Member.user.displayAvatarURL() })
        .setDescription(`${Member} has left the server!`)
        .addFields({ name: 'Member Count', value: `${Member.guild.memberCount}` })
        .setFooter({ text: `User ID: ${Member.id}` })
        .setTimestamp()
    Log.send({ embeds: [Embed] })
}