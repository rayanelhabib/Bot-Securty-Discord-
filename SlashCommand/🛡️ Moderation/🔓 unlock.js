const { EmbedBuilder, PermissionsBitField, ChannelType } = require('boda.js');
const db = require('pro.db');

const cooldowns = new Map();

module.exports = {
    name: 'unlock',
    description: 'Unlock a channel',
    options: [
        {
            name: 'channel',
            description: 'The channel to unlock (default is current channel)',
            type: 7,
            required: false,
            channel_types: [ChannelType.GuildText]
        }
    ],
    run: async (Client, Interaction) => {
        const userId = Interaction.user.id;
        const lang = await db.get(`${Interaction.guild.id}_language`) || 'en';

        const messages = {
            en: {
                noPermission: '❌ You do not have permission to unlock channels.',
                cooldown: (time) => `⏳ Please wait ${time}s before using this command again.`,
                success: (ch) => `:unlock: ${ch} has been unlocked.`,
                alreadyUnlocked: (ch) => `:x: Channel is already unlocked ${ch}.`
            },
            ar: {
                noPermission: '❌ ليس لديك صلاحية لفتح القنوات.',
                cooldown: (time) => `⏳ يرجى الانتظار ${time}s قبل استخدام هذا الأمر مرة أخرى.`,
                success: (ch) => `🔓 تم فتح القناة ${ch}.`,
                alreadyUnlocked: (ch) => `❌ القناة مفتوحة مسبقاً ${ch}.`
            }
        };

        // Cooldown check
        if (cooldowns.has(userId)) {
            const remaining = ((cooldowns.get(userId) - Date.now()) / 1000).toFixed(1);
            return Interaction.reply({ content: messages[lang].cooldown(remaining), ephemeral: true });
        }

        if (!Interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return Interaction.reply({ content: messages[lang].noPermission, ephemeral: true });
        }

        const targetChannel = Interaction.options.getChannel('channel') || Interaction.channel;
        if (!targetChannel) return Interaction.reply({ content: 'Channel not found.', ephemeral: true });

        const everyonePerm = targetChannel.permissionOverwrites.cache.get(Interaction.guild.roles.everyone.id);
        if (everyonePerm && everyonePerm.allow.has('SendMessages')) {
            return Interaction.reply({ content: messages[lang].alreadyUnlocked(`<#${targetChannel.id}>`), ephemeral: true });
        }

        try {
            // Unlock the channel
            await targetChannel.permissionOverwrites.edit(Interaction.guild.roles.everyone, { SendMessages: true });

            // Reply to user
            await Interaction.reply({ content: messages[lang].success(`<#${targetChannel.id}>`) });

            cooldowns.set(userId, Date.now() + 5000);
            setTimeout(() => cooldowns.delete(userId), 5000);

            // Log embed
            const logChannelId = await db.get(`Channels_${Interaction.guild.id}`);
            if (logChannelId) {
                const logChannel = Interaction.guild.channels.cache.get(logChannelId);
                if (logChannel && logChannel.isTextBased()) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('🔓 Channel Unlocked')
                        .setColor(0x00FF00)
                        .setThumbnail(Interaction.guild.iconURL({ dynamic: true }))
                        .setDescription(`**Channel:** <#${targetChannel.id}>\n**Unlocked by:** <@${Interaction.user.id}>\n**Time:** <t:${Math.floor(Date.now() / 1000)}:F>`)
                        .setTimestamp();
                    logChannel.send({ embeds: [logEmbed] });
                }
            }

        } catch (error) {
            console.error(error);
            Interaction.reply({ content: '❌ An error occurred while trying to unlock the channel.', ephemeral: true });
        }
    }
};
