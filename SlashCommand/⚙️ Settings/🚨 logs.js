const { EmbedBuilder } = require('boda.js');
const db = require('pro.db');

module.exports = {
    name: 'setlog',
    description: 'Enable or disable logging for the server',
    options: [
        {
            name: 'action',
            description: 'Enable or disable logging',
            type: 3,
            required: true,
            choices: [
                {
                    name: '✅ Enable',
                    value: 'enable'
                },
                {
                    name: '❌ Disable',
                    value: 'disable'
                }
            ]
        },
        {
            name: 'channel',
            description: 'The channel to send logs to (required when enabling)',
            type: 7,
            required: false
        }
    ],
    run: async (Client, Interaction) => {
        const action = Interaction.options.getString('action');
        const channel = Interaction.options.getChannel('channel');

        let title, description, color, emoji;

        // Get the language from the database, default to English if not set
        const lang = db.get(`${Interaction.guild.id}_language`) || 'en';

        if (action === 'enable') {
            if (!channel) {
                return Interaction.reply({ content: lang === 'ar' ? '❌ يجب عليك تحديد قناة عند تفعيل التسجيل.' : '❌ You must specify a channel when enabling logging.', ephemeral: true });
            }
            if (channel.type !== 0) {
                return Interaction.reply({ content: lang === 'ar' ? '❌ يجب أن تكون القناة المحددة قناة نصية.' : '❌ The specified channel must be a text channel.', ephemeral: true });
            }
            db.set(`${Interaction.guild.id}_logchannel`, channel.id);
            title = lang === 'ar' ? '📝 تم تفعيل التسجيل' : '📝 Logging Enabled';
            description = lang === 'ar' ? `تم تفعيل التسجيل. سيتم إرسال السجلات إلى ${channel}.` : `Logging has been enabled. Logs will be sent to ${channel}.`;
            color = 0x00FF00;
            emoji = '✅';
        } else {
            db.delete(`${Interaction.guild.id}_logchannel`);
            title = lang === 'ar' ? '📝 تم تعطيل التسجيل' : '📝 Logging Disabled';
            description = lang === 'ar' ? 'تم تعطيل التسجيل لهذا الخادم.' : 'Logging has been disabled for this server.';
            color = 0xFF0000;
            emoji = '❌';
        }

        const embed = new EmbedBuilder()
            .setTitle(`${emoji} ${title}`)
            .setDescription(description)
            .setColor(color)
            .setTimestamp()
            .setFooter({ text: lang === 'ar' ? `تم الطلب بواسطة ${Interaction.user.tag}` : `Requested by ${Interaction.user.tag}`, iconURL: Interaction.user.displayAvatarURL() });

        await Interaction.reply({ embeds: [embed] });
    }
};
