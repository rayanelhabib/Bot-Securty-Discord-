const { EmbedBuilder } = require('boda.js');
const db = require('pro.db');

module.exports = {
    name: 'ping',
    description: 'Check the bot\'s latency and API response time',
    run: async (Client, Interaction) => {
        const language = await db.get(`${Interaction.guild.id}_language`) || 'en';

        const messages = {
            en: {
                title: '🏓 Pong!',
                botLatency: 'Bot Latency',
                apiLatency: 'API Latency',
                ms: 'ms',
                footer: 'Powerful Protection Bot'
            },
            ar: {
                title: '🏓 بونج!',
                botLatency: 'تأخير البوت',
                apiLatency: 'تأخير الAPI',
                ms: 'مللي ثانية',
                footer: 'بوت الحماية القوي'
            }
        };

        const msg = await Interaction.deferReply({ fetchReply: true });
        
        const botLatency = msg.createdTimestamp - Interaction.createdTimestamp;
        const apiLatency = Math.round(Client.ws.ping);

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle(messages[language].title)
            .addFields(
                { name: messages[language].botLatency, value: `\`${botLatency}\` ${messages[language].ms}`, inline: true },
                { name: messages[language].apiLatency, value: `\`${apiLatency}\` ${messages[language].ms}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: messages[language].footer });

        // Add a fun visual representation of the latency
        const latencyBar = (latency) => {
            const maxBars = 20;
            const filledBars = Math.min(Math.floor(latency / 10), maxBars);
            return '█'.repeat(filledBars) + '░'.repeat(maxBars - filledBars);
        };

        embed.addFields(
            { name: '\u200B', value: `Bot: ${latencyBar(botLatency)}`, inline: false },
            { name: '\u200B', value: `API: ${latencyBar(apiLatency)}`, inline: false }
        );

        await Interaction.editReply({ embeds: [embed] });
    }
};
