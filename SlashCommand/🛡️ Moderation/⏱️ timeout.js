const { PermissionsBitField, EmbedBuilder } = require('boda.js');
const ms = require('ms');
const db = require('pro.db');

module.exports = {
    name: 'timeout',
    type: 1,
    description: 'Timeout a member',
    options: [
        {
            name: 'user',
            type: 6,
            description: 'The user to timeout',
            required: true
        },
        {
            name: 'duration',
            type: 3,
            description: 'The duration of the timeout (e.g. 1h, 30m, 1d)',
            required: true
        },
        {
            name: 'reason',
            type: 3,
            description: 'The reason for the timeout',
            required: false
        }
    ],

    run: async (Client, Interaction) => {
        const language = await db.get(`${Interaction.guild.id}_language`) || 'en';
        
        if (!Interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return Interaction.reply({
                content: language === 'ar' ? '**ليس لديك صلاحيات لاستخدام هذا الأمر**' : '**You do not have permission to use this command**',
                ephemeral: true
            });
        }

        const targetUser = Interaction.options.getUser('user');
        const duration = Interaction.options.getString('duration');
        const reason = Interaction.options.getString('reason') || (language === 'ar' ? 'لم يتم تحديد سبب' : 'No reason specified');

        const targetMember = await Interaction.guild.members.fetch(targetUser.id);

        if (!targetMember.moderatable) {
            return Interaction.reply({
                content: language === 'ar' ? '❌ لا يمكنني إعطاء تايم اوت لهذا العضو' : '❌ I cannot timeout this member',
                ephemeral: true
            });
        }

        const durationMs = ms(duration);
        if (isNaN(durationMs)) {
            return Interaction.reply({
                content: language === 'ar' ? '❌ الرجاء تحديد مدة صالحة (مثال: 1h, 30m, 1d)' : '❌ Please specify a valid duration (e.g. 1h, 30m, 1d)',
                ephemeral: true
            });
        }

        try {
            await targetMember.timeout(durationMs, reason);

            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(language === 'ar' ? '⏱️ تم إعطاء تايم اوت' : '⏱️ Timeout Applied')
                .addFields([
                    { name: language === 'ar' ? 'العضو' : 'Member', value: `<@${targetUser.id}>`, inline: true },
                    { name: language === 'ar' ? 'المدة' : 'Duration', value: duration, inline: true },
                    { name: language === 'ar' ? 'السبب' : 'Reason', value: reason }
                ])
                .setTimestamp()
                .setFooter({ text: language === 'ar' ? `تم التنفيذ بواسطة ${Interaction.user.tag}` : `Executed by ${Interaction.user.tag}` });

            await Interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await Interaction.reply({
                content: language === 'ar' ? '❌ حدث خطأ أثناء محاولة إعطاء تايم اوت للعضو' : '❌ An error occurred while trying to timeout the member',
                ephemeral: true
            });
        }
    }
};

