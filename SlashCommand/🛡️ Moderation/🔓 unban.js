const { EmbedBuilder, PermissionsBitField } = require('boda.js');
const db = require('pro.db');

module.exports = {
    name: 'unban',
    description: 'Unban a user from the server',
    options: [
        {
            name: 'user',
            description: 'The user ID to unban',
            type: 3,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for unbanning',
            type: 3,
            required: false
        }
    ],
    run: async (Client, Interaction) => {
        // Get the guild's language setting
        const guildLanguage = await db.get(`${Interaction.guild.id}_language`) || 'en';

        // Language strings
        const languageStrings = {
            en: {
                noPermission: '❌ You do not have permission to unban members.',
                userNotBanned: '❌ This user is not banned.',
                errorUnbanning: '❌ An error occurred while trying to unban the user. Make sure the user ID is valid.',
                unbanTitle: '🔓 User Unbanned',
                unbanDescription: 'has been unbanned from the server.',
                unbannedUser: 'Unbanned User',
                unbannedBy: 'Unbanned By',
                reason: 'Reason',
                noReasonProvided: 'No reason provided',
                userId: 'User ID'
            },
            ar: {
                noPermission: '❌ ليس لديك صلاحية لإلغاء حظر الأعضاء.',
                userNotBanned: '❌ هذا المستخدم غير محظور.',
                errorUnbanning: '❌ حدث خطأ أثناء محاولة إلغاء حظر المستخدم. تأكد من صحة معرف المستخدم.',
                unbanTitle: '🔓 تم إلغاء حظر المستخدم',
                unbanDescription: 'تم إلغاء الحظر عنه من السيرفر.',
                unbannedUser: 'المستخدم الملغى حظره',
                unbannedBy: 'تم إلغاء الحظر بواسطة',
                reason: 'السبب',
                noReasonProvided: 'لم يتم تقديم سبب',
                userId: 'معرف المستخدم'
            }
            // Add more languages as needed
        };

        const strings = languageStrings[guildLanguage] || languageStrings.en;

        // Check if the user has permission to unban
        if (!Interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return Interaction.reply({ content: strings.noPermission, ephemeral: true });
        }

        const userId = Interaction.options.getString('user');
        const reason = Interaction.options.getString('reason') || strings.noReasonProvided;

        try {
            // Fetch ban information
            const ban = await Interaction.guild.bans.fetch(userId);
            if (!ban) {
                return Interaction.reply({ content: strings.userNotBanned, ephemeral: true });
            }

            // Unban the user
            await Interaction.guild.members.unban(userId, reason);

            const unbanEmbed = new EmbedBuilder()
                .setTitle(strings.unbanTitle)
                .setColor(0x00FF00)
                .setDescription(`${ban.user.tag} ${strings.unbanDescription}`)
                .addFields(
                    { name: strings.unbannedUser, value: `${ban.user.tag} (${ban.user.id})`, inline: true },
                    { name: strings.unbannedBy, value: `${Interaction.user.tag} (${Interaction.user.id})`, inline: true },
                    { name: strings.reason, value: reason }
                )
                .setTimestamp()
                .setFooter({ text: `${strings.userId}: ${ban.user.id}` });

            await Interaction.reply({ embeds: [unbanEmbed] });

            // Log the unban if a log channel is set
            const logChannelId = await db.get(`${Interaction.guild.id}_logchannel`);
            if (logChannelId) {
                const logChannel = Interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    logChannel.send({ embeds: [unbanEmbed] });
                }
            }
        } catch (error) {
            console.error('Error unbanning user:', error);
            await Interaction.reply({ content: strings.errorUnbanning, ephemeral: true });
        }
    }
};
