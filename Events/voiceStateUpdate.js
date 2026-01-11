const { EmbedBuilder, Embed } = require('boda.js');
const db = require('pro.db')

/**
 * 
 * @param { import('discord.js').Client } Client 
 * @param { import('discord.js').VoiceState } OldVoice 
 * @param { import('discord.js').VoiceState } NewVoice 
 */

module.exports = async(Client, OldVoice, NewVoice) => {
    const ChannelId = db.get(`VoiceState_${OldVoice.guild.id}`)
    const Log = OldVoice.guild.channels.cache.get(ChannelId);
    if(!ChannelId || !Log) return;

    if(!OldVoice.channel && NewVoice.channel) {
        const Embed = new EmbedBuilder()
            .setColor(0x77dd77)
            .setAuthor({ name: `@${NewVoice.member.user.username}`, iconURL: NewVoice.member.user.displayAvatarURL() })
            .setDescription(`${NewVoice.member} has joined a voice channel.`)
            .addFields([
                { name: 'Channel', value: `${NewVoice.channel.name}`, inline: true },
                { name: 'Member Count', value: `${NewVoice.channel.members.size}`, inline: true }
            ])
            .setFooter({ text: `User ID: ${NewVoice.member.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    } else if(!NewVoice.channel && OldVoice.channel) {
        const Embed = new EmbedBuilder()
            .setColor(0xe74d3c)
            .setAuthor({ name: `@${OldVoice.member.user.username}`, iconURL: OldVoice.member.user.displayAvatarURL() })
            .setDescription(`${OldVoice.member} has left a voice channel.`)
            .addFields([
                { name: 'Channel', value: `${OldVoice.channel.name}`, inline: true },
                { name: 'Member Count', value: `${OldVoice.channel.members.size}`, inline: true }
            ])
            .setFooter({ text: `User ID: ${OldVoice.member.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    } else if(!OldVoice.serverMute && NewVoice.serverMute) {
        const Embed = new EmbedBuilder()
            .setColor(0xe74d3c)
            .setAuthor({ name: `@${OldVoice.member.user.username}`, iconURL: OldVoice.member.user.displayAvatarURL() })
            .setDescription(`Voice state of ${NewVoice.member} has been updated.`)
            .addFields({ name: ':microphone2: Server Mute', value: `**True**` })
            .setFooter({ text: `User ID: ${OldVoice.member.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    } else if(!NewVoice.serverMute && OldVoice.serverMute) {
        const Embed = new EmbedBuilder()
            .setColor(0xe74d3c)
            .setAuthor({ name: `@${OldVoice.member.user.username}`, iconURL: OldVoice.member.user.displayAvatarURL() })
            .setDescription(`Voice state of ${NewVoice.member} has been updated.`)
            .addFields({ name: ':microphone2: Server Mute', value: `**False**` })
            .setFooter({ text: `User ID: ${OldVoice.member.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    } else if(!OldVoice.serverDeaf && NewVoice.serverDeaf) {
        const Embed = new EmbedBuilder()
            .setColor(0xe74d3c)
            .setAuthor({ name: `@${OldVoice.member.user.username}`, iconURL: OldVoice.member.user.displayAvatarURL() })
            .setDescription(`Voice state of ${NewVoice.member} has been updated.`)
            .addFields({ name: ':speaker: Server Deafen', value: `**True**` })
            .setFooter({ text: `User ID: ${OldVoice.member.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    } else if(!NewVoice.serverDeaf && OldVoice.serverDeaf) {
        const Embed = new EmbedBuilder()
            .setColor(0xe74d3c)
            .setAuthor({ name: `@${OldVoice.member.user.username}`, iconURL: OldVoice.member.user.displayAvatarURL() })
            .setDescription(`Voice state of ${NewVoice.member} has been updated.`)
            .addFields({ name: ':speaker: Server Deafen', value: `**False**` })
            .setFooter({ text: `User ID: ${OldVoice.member.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    } else if(!OldVoice.streaming && NewVoice.streaming) {
        const Embed = new EmbedBuilder()
            .setColor(0xe74d3c)
            .setAuthor({ name: `@${OldVoice.member.user.username}`, iconURL: OldVoice.member.user.displayAvatarURL() })
            .setDescription(`Voice state of ${NewVoice.member} has been updated.`)
            .addFields({ name: ':tv: Streaming', value: `**True**` })
            .setFooter({ text: `User ID: ${OldVoice.member.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    } else if(!NewVoice.streaming && OldVoice.streaming) {
        const Embed = new EmbedBuilder()
            .setColor(0xe74d3c)
            .setAuthor({ name: `@${OldVoice.member.user.username}`, iconURL: OldVoice.member.user.displayAvatarURL() })
            .setDescription(`Voice state of ${NewVoice.member} has been updated.`)
            .addFields({ name: ':tv: Streaming', value: `**False**` })
            .setFooter({ text: `User ID: ${OldVoice.member.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    } else if(!OldVoice.selfVideo && NewVoice.selfVideo) {
        const Embed = new EmbedBuilder()
            .setColor(0xe74d3c)
            .setAuthor({ name: `@${OldVoice.member.user.username}`, iconURL: OldVoice.member.user.displayAvatarURL() })
            .setDescription(`Voice state of ${NewVoice.member} has been updated.`)
            .addFields({ name: ':movie_camera: Video Camera', value: `**True**` })
            .setFooter({ text: `User ID: ${OldVoice.member.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    } else if(OldVoice.selfVideo && !NewVoice.selfVideo) {
        const Embed = new EmbedBuilder()
            .setColor(0xe74d3c)
            .setAuthor({ name: `@${OldVoice.member.user.username}`, iconURL: OldVoice.member.user.displayAvatarURL() })
            .setDescription(`Voice state of ${NewVoice.member} has been updated.`)
            .addFields({ name: ':movie_camera: Video Camera', value: `**False**` })
            .setFooter({ text: `User ID: ${OldVoice.member.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    } else if(OldVoice.channel && NewVoice.channel && OldVoice.channelId !== NewVoice.channelId) {
        const Embed = new EmbedBuilder()
            .setColor(0xffff00)
            .setAuthor({ name: `@${NewVoice.member.user.username}`, iconURL: NewVoice.member.user.displayAvatarURL() })
            .setDescription(`${NewVoice.channel} has moved to a different voice channel.`)
            .addFields([
                { name: 'Previous Channel', value: `${OldVoice.channel.name} (${OldVoice.channel.members.size} Members)` },
                { name: 'New Channel', value: `${NewVoice.channel.name} (${NewVoice.channel.members.size} Members)` }
            ])
            .setFooter({ text: `User ID: ${NewVoice.member.id}` })
            .setTimestamp()
        Log.send({ embeds: [Embed] })
    }
}