const { EmbedBuilder } = require("@discordjs/builders");
const db = require('pro.db')

/**
 * @param { import('discord.js').Client } Client 
 * @param { import('discord.js').Message } Message 
 */


module.exports = async(Client, Message) => {
    const ChannelId = db.get(`Messages_${Message.guildId}`);
    const Log = Message.guild.channels.cache.get(ChannelId);
    if(!ChannelId || !Log) return;

    const Embed = new EmbedBuilder()
        .setColor(0xe74d3c)
        .setAuthor({ name: 'Message Deleted', iconURL: Message.guild.iconURL() })
        .setDescription(`Message from ${Message.author} deleted in ${Message.channel}\nIt was sent on <t:${Math.floor(Message.createdAt / 1000)}:F>`)
        .addFields({ name: 'Message Content', value: `${Message.content}` })
        .setFooter({ text: `User ID: ${Message.author.id}`  })
        .setTimestamp()
    Log.send({ embeds: [Embed] })
}