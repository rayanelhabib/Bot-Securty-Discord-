const { EmbedBuilder, PermissionsBitField } = require('boda.js');

module.exports = {
    name: 'server',
    description: ' Display server information',
    run: async (Client, Interaction) => {
        const guild = Interaction.guild;
        
        const owner = await guild.fetchOwner();
        const createdAt = Math.floor(guild.createdTimestamp / 1000);
        const boostLevel = guild.premiumTier;
        const boostCount = guild.premiumSubscriptionCount;

        const totalMembers = guild.memberCount;
        const botCount = guild.members.cache.filter(member => member.user.bot).size;
        const humanCount = totalMembers - botCount;

        const channelCount = guild.channels.cache.size;
        const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
        const categoryChannels = guild.channels.cache.filter(c => c.type === 4).size;

        const roleCount = guild.roles.cache.size;
        const emojiCount = guild.emojis.cache.size;

        const language = guild.preferredLocale || 'en'; // Get the server's preferred language, default to English if not set

        const embed = new EmbedBuilder()
            .setTitle(`📊 ${language === 'ar' ? 'معلومات السيرفر' : 'Server Information'}: ${guild.name}`)
            .setColor(0x3498DB)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: language === 'ar' ? '👑 المالك' : '👑 Owner', value: `${owner.user.tag}`, inline: true },
                { name: language === 'ar' ? '🆔 معرف السيرفر' : '🆔 Server ID', value: guild.id, inline: true },
                { name: language === 'ar' ? '📅 تم الإنشاء في' : '📅 Created At', value: `<t:${createdAt}:R>`, inline: true },
                { name: language === 'ar' ? '👥 إجمالي الأعضاء' : '👥 Total Members', value: `${totalMembers}`, inline: true },
                { name: language === 'ar' ? '🧑 البشر' : '🧑 Humans', value: `${humanCount}`, inline: true },
                { name: language === 'ar' ? '🤖 البوتات' : '🤖 Bots', value: `${botCount}`, inline: true },
                { name: language === 'ar' ? '💬 القنوات النصية' : '💬 Text Channels', value: `${textChannels}`, inline: true },
                { name: language === 'ar' ? '🔊 القنوات الصوتية' : '🔊 Voice Channels', value: `${voiceChannels}`, inline: true },
                { name: language === 'ar' ? '📁 الفئات' : '📁 Categories', value: `${categoryChannels}`, inline: true },
                { name: language === 'ar' ? '🏷️ الرتب' : '🏷️ Roles', value: `${roleCount}`, inline: true },
                { name: language === 'ar' ? '😀 الإيموجي' : '😀 Emojis', value: `${emojiCount}`, inline: true },
                { name: language === 'ar' ? '🚀 مستوى التعزيز' : '🚀 Boost Level', value: `${boostLevel}`, inline: true },
                { name: language === 'ar' ? '💎 عدد التعزيزات' : '💎 Boost Count', value: `${boostCount}`, inline: true }
            )
            .setFooter({ text: language === 'ar' ? `تم الطلب بواسطة ${Interaction.user.tag}` : `Requested by ${Interaction.user.tag}`, iconURL: Interaction.user.displayAvatarURL() })
            .setTimestamp();

        await Interaction.reply({ embeds: [embed] });
    }
};
