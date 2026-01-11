const db = require('pro.db');
const { PermissionsBitField, EmbedBuilder } = require('boda.js');

module.exports = {
    name: 'auditlog',
    type: 1,
    description: '🛠️ Set up server logs for various events',
    options: [
        {
            name: 'log_type',
            type: 3,
            description: 'Select the type of log to set up',
            required: true,
            choices: [
                { name: '💬 Messages', value: 'messages' },
                { name: '📺 Channels', value: 'channels' },
                { name: '🎙️ Voice', value: 'voice' },
                { name: '👥 Members', value: 'members' },
                { name: '🏠 Server', value: 'guild' },
                { name: '🎭 Roles', value: 'roles' },
                { name: '✅ Verification', value: 'verification' },
                { name: '📱 Anti-External Apps/Link', value: 'antiexternalapps' } // تم إضافة الخيار الجديد
            ]
        },
        {
            name: 'log_channel',
            type: 7,
            description: 'Select the channel for logs',
            required: true,
            channel_types: [0] // Only text channels
        }
    ],

    run: async (Client, Interaction) => {
        const language = await db.get(`${Interaction.guild.id}_language`) || 'en';

        if (!Interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return Interaction.reply({
                content: language === 'ar' ? '**ليس لديك صلاحيات لاستخدام هذا الأمر**' : '**You do not have permission to use this command**',
                ephemeral: true
            });
        }

        const logType = Interaction.options.getString('log_type');
        const channel = Interaction.options.getChannel('log_channel');
        let dbKey, logTypeName;

        switch (logType) {
            case 'messages':
                logTypeName = language === 'ar' ? 'الرسائل' : 'Messages';
                dbKey = `Messages_${Interaction.guild.id}`;
                break;
            case 'channels':
                logTypeName = language === 'ar' ? 'القنوات' : 'Channels';
                dbKey = `Channels_${Interaction.guild.id}`;
                break;
            case 'voice':
                logTypeName = language === 'ar' ? 'الصوت' : 'Voice';
                dbKey = `VoiceState_${Interaction.guild.id}`;
                break;
            case 'members':
                logTypeName = language === 'ar' ? 'الأعضاء' : 'Members';
                dbKey = `GuildMembers_${Interaction.guild.id}`;
                break;
            case 'guild':
                logTypeName = language === 'ar' ? 'السيرفر' : 'Server';
                dbKey = `GuildUpdates_${Interaction.guild.id}`;
                break;
            case 'roles':
                logTypeName = language === 'ar' ? 'الأدوار' : 'Roles';
                dbKey = `RolesUpdate_${Interaction.guild.id}`;
                break;
            case 'verification':
                logTypeName = language === 'ar' ? 'التحقق' : 'Verification';
                dbKey = `ChannelsVER_${Interaction.guild.id}`;
                break;
            case 'antiexternalapps':
                logTypeName = language === 'ar' ? 'Anti-External Apps/Link' : 'Anti-External Apps/Link';
                dbKey = `AntiExternalApps_${Interaction.guild.id}`;
                break;
            default:
                return Interaction.reply({ content: '❌ Invalid log type', ephemeral: true });
        }

        db.set(dbKey, channel.id);

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle(language === 'ar' ? '✅ تم تعيين سجل بنجاح' : '✅ Log Set Successfully')
            .setDescription(language === 'ar'
                ? `تم تعيين سجل ${logTypeName} في القناة ${channel}`
                : `${logTypeName} log has been set to ${channel}`)
            .setTimestamp()
            .setFooter({ text: language === 'ar' ? 'بوت الحماية القوي' : 'Powerful Protection Bot' });

        await Interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
