const { EmbedBuilder, PermissionsBitField } = require('boda.js');
const db = require('pro.db');

module.exports = {
    name: 'clear',
    description: 'Clear messages from the channel',
    options: [
        {
            name: 'amount',
            description: 'Number of messages to delete (1-100)',
            type: 4,
            required: true,
            min_value: 1,
            max_value: 100
        }
    ],
    run: async (Client, Interaction) => {
        const amount = Interaction.options.getInteger('amount');
        const language = await db.get(`${Interaction.guild.id}_language`) || 'en';

        const messages = {
            en: {
                success: '🧹 Successfully deleted {count} messages.',
                error: 'An error occurred while trying to delete messages.',
                noPermission: 'You do not have permission to use this command.',
                footer: 'Powerful Protection Bot'
            },
            ar: {
                success: '🧹 تم حذف {count} رسالة بنجاح.',
                error: 'حدث خطأ أثناء محاولة حذف الرسائل.',
                noPermission: 'ليس لديك صلاحية لاستخدام هذا الأمر.',
                footer: 'بوت الحماية القوي'
            }
        };

        if (!Interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return Interaction.reply({ content: messages[language].noPermission, ephemeral: true });
        }

        try {
            const { size } = await Interaction.channel.bulkDelete(amount, true);

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setDescription(messages[language].success.replace('{count}', size))
                .setTimestamp()
                .setFooter({ text: messages[language].footer });

            await Interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error in clear command:', error);
            await Interaction.reply({ content: messages[language].error, ephemeral: true });
        }
    }
};

