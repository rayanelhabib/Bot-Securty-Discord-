const { EmbedBuilder, PermissionsBitField } = require('boda.js');
const db = require('pro.db');

module.exports = {
    name: 'ban',
    description: 'Ban a user from the server',
    options: [
        {
            name: 'user',
            description: 'The user to ban',
            type: 6,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for the ban',
            type: 3,
            required: false
        },
        {
            name: 'delete_messages',
            description: 'Delete messages from the user (in days)',
            type: 4,
            required: false,
            choices: [
                { name: 'Don\'t delete any', value: 0 },
                { name: 'Previous 24 hours', value: 1 },
                { name: 'Previous 7 days', value: 7 }
            ]
        }
    ],
    run: async (Client, Interaction) => {
        const language = await db.get(`${Interaction.guild.id}_language`) || 'en';

        const messages = {
            en: {
                noBanPermission: '❌ You do not have permission to ban members.',
                cannotBanUser: '❌ I cannot ban this user. They may have higher permissions than me.',
                cannotBanSelf: '❌ You cannot ban yourself.',
                banLimitReached: (limit) => `❌ Ban limit reached (${limit}). Please try again later.`,
                userBanned: 'User Banned',
                bannedFromServer: 'has been banned from the server.',
                bannedUser: 'Banned User',
                bannedBy: 'Banned By',
                reason: 'Reason',
                messagesDeleted: 'Messages Deleted',
                dmBanMessage: (guildName, reason) => `You have been banned from ${guildName} for the following reason: ${reason}`,
                errorBanning: '❌ An error occurred while trying to ban the user.'
            },
            ar: {
                noBanPermission: '❌ ليس لديك صلاحية حظر الأعضاء.',
                cannotBanUser: '❌ لا يمكنني حظر هذا المستخدم. قد يكون لديه صلاحيات أعلى مني.',
                cannotBanSelf: '❌ لا يمكنك حظر نفسك.',
                banLimitReached: (limit) => `❌ تم الوصول إلى حد الحظر (${limit}). يرجى المحاولة مرة أخرى لاحقًا.`,
                userBanned: 'تم حظر المستخدم',
                bannedFromServer: 'تم حظره من السيرفر.',
                bannedUser: 'المستخدم المحظور',
                bannedBy: 'تم الحظر بواسطة',
                reason: 'السبب',
                messagesDeleted: 'الرسائل المحذوفة',
                dmBanMessage: (guildName, reason) => `لقد تم حظرك من ${guildName} للسبب التالي: ${reason}`,
                errorBanning: '❌ حدث خطأ أثناء محاولة حظر المستخدم.'
            }
        };

        // Check if the user has permission to ban
        if (!Interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return Interaction.reply({ content: messages[language].noBanPermission, ephemeral: true });
        }

        const targetUser = Interaction.options.getUser('user');
        const reason = Interaction.options.getString('reason') || messages[language].reason;
        const deleteMessageDays = Interaction.options.getInteger('delete_messages') || 0;

        const targetMember = await Interaction.guild.members.fetch(targetUser.id).catch(() => null);

        // Check if the target user is bannable
        if (targetMember && !targetMember.bannable) {
            return Interaction.reply({ content: messages[language].cannotBanUser, ephemeral: true });
        }

        // Check if the user is trying to ban themselves
        if (targetUser.id === Interaction.user.id) {
            return Interaction.reply({ content: messages[language].cannotBanSelf, ephemeral: true });
        }

        // Check ban limit
        const banLimit = await db.get(`${Interaction.guild.id}_ban_limit`) || 5; // Default to 5 if not set
        const banCount = await db.get(`${Interaction.guild.id}_ban_count`) || 0;

        if (banCount >= banLimit) {
            return Interaction.reply({ content: messages[language].banLimitReached(banLimit), ephemeral: true });
        }

        // Perform the ban
        try {
            await Interaction.guild.members.ban(targetUser, { reason: reason, deleteMessageDays: deleteMessageDays });

            // Increment the ban count
            await db.set(`${Interaction.guild.id}_ban_count`, banCount + 1);

            // Reset the count after 10 minutes
            setTimeout(async () => {
                await db.set(`${Interaction.guild.id}_ban_count`, 0);
            }, 600000);

            const banEmbed = new EmbedBuilder()
                .setTitle(`🔨 ${messages[language].userBanned}`)
                .setColor(0xFF0000)
                .setDescription(`${targetUser.tag} ${messages[language].bannedFromServer}`)
                .addFields(
                    { name: messages[language].bannedUser, value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                    { name: messages[language].bannedBy, value: `${Interaction.user.tag} (${Interaction.user.id})`, inline: true },
                    { name: messages[language].reason, value: reason },
                    { name: messages[language].messagesDeleted, value: `${deleteMessageDays} days` }
                )
                .setTimestamp()
                .setFooter({ text: `User ID: ${targetUser.id}` });

            await Interaction.reply({ embeds: [banEmbed] });

            // Send a DM to the banned user
            try {
                await targetUser.send(messages[language].dmBanMessage(Interaction.guild.name, reason));
            } catch (error) {
                console.error('Failed to send DM to banned user:', error);
            }

            // Log the ban if a log channel is set
            const logChannelId = await db.get(`${Interaction.guild.id}_logchannel`);
            if (logChannelId) {
                const logChannel = Interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    logChannel.send({ embeds: [banEmbed] });
                }
            }
        } catch (error) {
            console.error('Error banning user:', error);
            await Interaction.reply({ content: messages[language].errorBanning, ephemeral: true });
        }
    }
};
