
const { EmbedBuilder, PermissionsBitField } = require('boda.js');
const db = require('pro.db');

module.exports = {
    name: 'untimeout',
    type: 1,
    description: '⏱Remove timeout from a member',
    options: [
        {
            name: 'user',
            type: 6,
            description: 'The user to remove timeout from',
            required: true
        },
        {
            name: 'reason',
            type: 3,
            description: 'The reason for removing the timeout',
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
        const reason = Interaction.options.getString('reason') || (language === 'ar' ? 'لم يتم تحديد سبب' : 'No reason specified');

        const targetMember = await Interaction.guild.members.fetch(targetUser.id);

        if (!targetMember.moderatable) {
            return Interaction.reply({
                content: language === 'ar' ? '❌ لا يمكنني إزالة التايم اوت عن هذا العضو' : '❌ I cannot remove timeout from this member',
                ephemeral: true
            });
        }

        try {
            await targetMember.timeout(null, reason);

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle(language === 'ar' ? '⏱️ تم إزالة التايم اوت' : '⏱️ Timeout Removed')
                .addFields([
                    { name: language === 'ar' ? 'العضو' : 'Member', value: `<@${targetUser.id}>`, inline: true },
                    { name: language === 'ar' ? 'السبب' : 'Reason', value: reason }
                ])
                .setTimestamp()
                .setFooter({ text: language === 'ar' ? `تم التنفيذ بواسطة ${Interaction.user.tag}` : `Executed by ${Interaction.user.tag}` });

            await Interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await Interaction.reply({
                content: language === 'ar' ? '❌ حدث خطأ أثناء محاولة إزالة التايم اوت عن العضو' : '❌ An error occurred while trying to remove timeout from the member',
                ephemeral: true
            });
        }
    }
};
