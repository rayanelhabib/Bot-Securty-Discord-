const { EmbedBuilder, PermissionsBitField } = require('boda.js');
const db = require('pro.db');

module.exports = {
    name: 'kick',
    description: 'Kick a user from the server',
    options: [
        {
            name: 'user',
            description: 'The user to kick',
            type: 6,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for the kick',
            type: 3,
            required: false
        }
    ],
    run: async (Client, Interaction) => {
        // Get the language setting from the database, default to English if not set
        const lang = await db.get(`${Interaction.guild.id}_language`) || 'en';

        // Check if the user has permission to kick
        if (!Interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return Interaction.reply({ content: lang === 'ar' ? '❌ ليس لديك صلاحية لطرد الأعضاء.' : '❌ You do not have permission to kick members.', ephemeral: true });
        }

        const targetUser = Interaction.options.getUser('user');
        const reason = Interaction.options.getString('reason') || (lang === 'ar' ? 'لم يتم تقديم سبب' : 'No reason provided');

        const targetMember = await Interaction.guild.members.fetch(targetUser.id).catch(() => null);

        // Check if the target user is kickable
        if (targetMember && !targetMember.kickable) {
            return Interaction.reply({ content: lang === 'ar' ? '❌ لا يمكنني طرد هذا المستخدم. قد يكون لديه صلاحيات أعلى مني.' : '❌ I cannot kick this user. They may have higher permissions than me.', ephemeral: true });
        }

        // Check if the user is trying to kick themselves
        if (targetUser.id === Interaction.user.id) {
            return Interaction.reply({ content: lang === 'ar' ? '❌ لا يمكنك طرد نفسك.' : '❌ You cannot kick yourself.', ephemeral: true });
        }

        // Check kick limit
        const kickLimit = await db.get(`${Interaction.guild.id}_kick_limit`) || 5; // Default to 5 if not set
        const kickCount = await db.get(`${Interaction.guild.id}_kick_count`) || 0;

        if (kickCount >= kickLimit) {
            return Interaction.reply({ content: lang === 'ar' ? `❌ تم الوصول إلى حد الطرد (${kickLimit}). يرجى المحاولة مرة أخرى لاحقًا.` : `❌ Kick limit reached (${kickLimit}). Please try again later.`, ephemeral: true });
        }

        // Perform the kick
        try {
            await targetMember.kick(reason);

            // Increment the kick count
            await db.set(`${Interaction.guild.id}_kick_count`, kickCount + 1);

            // Reset the count after 10 minutes
            setTimeout(async () => {
                await db.set(`${Interaction.guild.id}_kick_count`, 0);
            }, 600000);

            const kickEmbed = new EmbedBuilder()
                .setTitle(lang === 'ar' ? '👢 تم طرد المستخدم' : '👢 User Kicked')
                .setColor(0xFFA500)
                .setDescription(lang === 'ar' ? `تم طرد ${targetUser.tag} من السيرفر.` : `${targetUser.tag} has been kicked from the server.`)
                .addFields(
                    { name: lang === 'ar' ? 'المستخدم المطرود' : 'Kicked User', value: `${targetUser.tag} (${targetUser.id})`, inline: true },
                    { name: lang === 'ar' ? 'تم الطرد بواسطة' : 'Kicked By', value: `${Interaction.user.tag} (${Interaction.user.id})`, inline: true },
                    { name: lang === 'ar' ? 'السبب' : 'Reason', value: reason }
                )
                .setTimestamp()
                .setFooter({ text: lang === 'ar' ? `معرف المستخدم: ${targetUser.id}` : `User ID: ${targetUser.id}` });

            await Interaction.reply({ embeds: [kickEmbed] });

            // Send a DM to the kicked user
            try {
                await targetUser.send(lang === 'ar' 
                    ? `لقد تم طردك من ${Interaction.guild.name} للسبب التالي: ${reason}`
                    : `You have been kicked from ${Interaction.guild.name} for the following reason: ${reason}`
                );
            } catch (error) {
                console.error('Failed to send DM to kicked user:', error);
            }

            // Log the kick if a log channel is set
            const logChannelId = await db.get(`${Interaction.guild.id}_logchannel`);
            if (logChannelId) {
                const logChannel = Interaction.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    logChannel.send({ embeds: [kickEmbed] });
                }
            }
        } catch (error) {
            console.error('Error kicking user:', error);
            await Interaction.reply({ content: lang === 'ar' ? '❌ حدث خطأ أثناء محاولة طرد المستخدم.' : '❌ An error occurred while trying to kick the user.', ephemeral: true });
        }
    }
};
