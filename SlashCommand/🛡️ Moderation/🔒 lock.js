const { EmbedBuilder, PermissionsBitField, ChannelType } = require('boda.js');
const db = require('pro.db');

const cooldowns = new Map();

module.exports = {
    name: 'lock',
    description: 'Lock a channel temporarily or permanently',
    options: [
        {
            name: 'channel',
            description: 'The channel to lock (default is current channel)',
            type: 7,
            required: false,
            channel_types: [ChannelType.GuildText]
        },
        {
            name: 'time',
            description: 'Duration in seconds to lock (optional)',
            type: 4,
            required: false
        }
    ],
    run: async (Client, Interaction) => {
        const userId = Interaction.user.id;
        const lang = await db.get(`${Interaction.guild.id}_language`) || 'en';

        const messages = {
            en: {
                noPermission: '❌ You do not have permission to lock channels.',
                cooldown: (time) => `⏳ Please wait ${time}s before using this command again.`,
                success: (ch) => `:lock: ${ch} has been locked.`,
                alreadyLocked: (ch) => `:x: Channel is already locked ${ch}.`
            },
            ar: {
                noPermission: '❌ ليس لديك صلاحية لقفل القنوات.',
                cooldown: (time) => `⏳ يرجى الانتظار ${time}s قبل استخدام هذا الأمر مرة أخرى.`,
                success: (ch) => `🔒 تم قفل القناة ${ch}.`,
                alreadyLocked: (ch) => `❌ القناة مقفلة مسبقاً ${ch}.`
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
        if (everyonePerm && everyonePerm.deny.has('SendMessages')) {
            return Interaction.reply({ content: messages[lang].alreadyLocked(`<#${targetChannel.id}>`), ephemeral: true });
        }

        const time = Interaction.options.getInteger('time');

        try {
            // Lock the channel
            await targetChannel.permissionOverwrites.edit(Interaction.guild.roles.everyone, { SendMessages: false });

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
                        .setTitle('🔒 Channel Locked')
                        .setColor(0xFF0000)
                        .setThumbnail(Interaction.guild.iconURL({ dynamic: true }))
                        .setDescription(`**Channel:** <#${targetChannel.id}>\n**Locked by:** <@${Interaction.user.id}>\n**Time:** <t:${Math.floor(Date.now() / 1000)}:F>`)
                        .setTimestamp();
                    logChannel.send({ embeds: [logEmbed] });
                }
            }

            // Temporary unlock
            if (time && time > 0) {
                setTimeout(async () => {
                    await targetChannel.permissionOverwrites.edit(Interaction.guild.roles.everyone, { SendMessages: true });

                    // Log auto-unlock
                    if (logChannelId) {
                        const logChannel = Interaction.guild.channels.cache.get(logChannelId);
                        if (logChannel && logChannel.isTextBased()) {
                            const unlockEmbed = new EmbedBuilder()
                                .setTitle('🔓 Channel Unlocked')
                                .setColor(0x00FF00)
                                .setThumbnail(Interaction.guild.iconURL({ dynamic: true }))
                                .setDescription(`**Channel:** <#${targetChannel.id}>\n**Time:** <t:${Math.floor(Date.now() / 1000)}:F>`)
                                .setTimestamp();
                            logChannel.send({ embeds: [unlockEmbed] });
                        }
                    }
                }, time * 1000);
            }

        } catch (error) {
            console.error(error);
            Interaction.reply({ content: '❌ An error occurred while trying to lock the channel.', ephemeral: true });
        }
    }
};
