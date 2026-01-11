
const { EmbedBuilder, PermissionsBitField } = require('boda.js');
const db = require('pro.db');

module.exports = {
    name: 'setlang',
    description: 'Set the bot language (English/Arabic)',
    options: [
        {
            name: 'language',
            type: 3,
            description: 'Choose the language (en/ar)',
            required: true,
            choices: [
                { name: 'English', value: 'en' },
                { name: 'Arabic', value: 'ar' }
            ]
        }
    ],
    run: async (Client, Interaction) => {
        // Check if the user has administrator permissions
        if (!Interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return Interaction.reply({ content: '❌ You need Administrator permissions to use this command.', ephemeral: true });
        }

        const language = Interaction.options.getString('language');
        
        // Set the language in the database
        await db.set(`${Interaction.guild.id}_language`, language);

        const languageNames = {
            en: 'English',
            ar: 'العربية'
        };

        const successMessages = {
            en: '✅ Bot language has been set to English.',
            ar: '✅ تم تعيين لغة البوت إلى العربية.'
        };

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle(language === 'en' ? '🌐 Language Set' : '🌐 تم تعيين اللغة')
            .setDescription(successMessages[language])
            .addFields(
                { name: language === 'en' ? 'New Language' : 'اللغة الجديدة', value: languageNames[language] }
            )
            .setTimestamp()
            .setFooter({ text: `${Interaction.user.tag}`, iconURL: Interaction.user.displayAvatarURL() });

        await Interaction.reply({ embeds: [embed] });

        // Log the language change if a log channel is set
        const logChannelId = await db.get(`${Interaction.guild.id}_logchannel`);
        if (logChannelId) {
            const logChannel = Interaction.guild.channels.cache.get(logChannelId);
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle('🌐 Bot Language Changed')
                    .setDescription(`The bot language has been changed to ${languageNames[language]}.`)
                    .addFields(
                        { name: 'Changed By', value: `${Interaction.user.tag} (${Interaction.user.id})` },
                        { name: 'New Language', value: languageNames[language] }
                    )
                    .setTimestamp();
                logChannel.send({ embeds: [logEmbed] });
            }
        }
    }
};
