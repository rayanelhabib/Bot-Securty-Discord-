const { EmbedBuilder, PermissionsBitField } = require('boda.js');
const db = require('pro.db');

module.exports = {
    name: 'setpunishment',
    description: 'Set punishment for protection violations',
    options: [
        {
            name: 'action',
            description: 'Select the punishment action',
            type: 3,
            required: true,
            choices: [
                { name: '🎭 Remove Roles', value: 'removeroles' },
                { name: '👢 Kick', value: 'kick' },
                { name: '🔨 Ban', value: 'ban' }
            ]
        }
    ],
    run: async (Client, Interaction) => {
        const language = await db.get(`${Interaction.guild.id}_language`) || 'en';
        
        if (!Interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const noPermissionMessage = {
                en: '❌ Sorry, this command is only available to administrators.',
                ar: '❌ عذرًا، هذا الأمر متاح فقط للمسؤولين.'
            };
            return Interaction.reply({ content: noPermissionMessage[language], ephemeral: true });
        }

        const action = Interaction.options.getString('action');
        await db.set(`${Interaction.guild.id}_punishment`, action);

        const actionDescriptions = {
            en: {
                removeroles: 'Remove all roles',
                kick: 'Kick from the server',
                ban: 'Ban from the server'
            },
            ar: {
                removeroles: 'إزالة جميع الأدوار',
                kick: 'الطرد من السيرفر',
                ban: 'الحظر من السيرفر'
            }
        };

        const actionDescription = actionDescriptions[language][action];

        const embedTitles = {
            en: '🛡️ Punishment Set',
            ar: '🛡️ تم تعيين العقوبة'
        };

        const embedDescriptions = {
            en: `The punishment for protection violations has been set to: **${actionDescription}**`,
            ar: `تم تعيين العقوبة لانتهاكات الحماية إلى: **${actionDescription}**`
        };

        const embed = new EmbedBuilder()
            .setTitle(embedTitles[language])
            .setColor(0x3498DB)
            .setDescription(embedDescriptions[language])
            .setTimestamp();

        await Interaction.reply({ embeds: [embed] });
    }
};
