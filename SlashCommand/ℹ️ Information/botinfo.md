const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('boda.js');
const db = require('pro.db');

module.exports = {
    name: 'help',
    description: '📚 Display information about all available commands',
    run: async (Client, Interaction) => {
        // Get the language setting from the database, default to English if not set
        const lang = db.get(`${Interaction.guild.id}_language`) || 'en';

        const commands = [
            { name: 'help', description: lang === 'ar' ? '📋 عرض هذه القائمة من الأوامر' : '📋 Display this list of commands' },
            { name: 'enable', description: lang === 'ar' ? '✅ تفعيل ميزات حماية السيرفر' : '✅ Enable server protection features' },
            { name: 'disable', description: lang === 'ar' ? '❌ تعطيل ميزات الحماية' : '❌ Disable protection features' },
            { name: 'setpunishment', description: lang === 'ar' ? '🔨 تعيين العقوبة لانتهاكات الحماية' : '🔨 Set punishment for protection violations' },
            { name: 'settings', description: lang === 'ar' ? '👀 عرض إعدادات الحماية الحالية' : '👀 View current protection settings' },
            { name: 'setlang', description: lang === 'ar' ? '🗣️ تغيير لغة البوت' : '🗣️ Change the bot language' },
            { name: 'antilink', description: lang === 'ar' ? '🚫 تفعيل أو تعطيل حماية ضد الروابط' : '🚫 Enable or disable anti-link protection' },
            { name: 'antispam', description: lang === 'ar' ? '🛑 تفعيل أو تعطيل حماية ضد السبام' : '🛑 Enable or disable anti-spam protection' },
            { name: 'antiscam', description: lang === 'ar' ? '🚨 تفعيل أو تعطيل حماية ضد الاحتيال' : '🚨 Enable or disable anti-scam protection' },
            { name: 'antiraid', description: lang === 'ar' ? '🔰 تفعيل أو تعطيل حماية ضد الريد' : '🔰 Enable or disable anti-raid protection' },
            { name: 'antichandeldelete', description: lang === 'ar' ? '🚫 تفعيل أو تعطيل حماية ضد حذف القنوات' : '🚫 Enable or disable anti-channel delete protection' },
            { name: 'antichanelcreate', description: lang === 'ar' ? '🛑 تفعيل أو تعطيل حماية ضد إنشاء القنوات' : '🛑 Enable or disable anti-channel create protection' },
            { name: 'antichanneledit', description: lang === 'ar' ? '🔒 تفعيل أو تعطيل حماية ضد تعديل القنوات' : '🔒 Enable or disable anti-channel edit protection' },
            { name: 'antirolecreate', description: lang === 'ar' ? '🚫 تفعيل أو تعطيل حماية ضد إنشاء الأدوار' : '🚫 Enable or disable anti-role create protection' },
            { name: 'antiroledelete', description: lang === 'ar' ? '🛑 تفعيل أو تعطيل حماية ضد حذف الأدوار' : '🛑 Enable or disable anti-role delete protection' },
            { name: 'antiroleedit', description: lang === 'ar' ? '🔒 تفعيل أو تعطيل حماية ضد تعديل الأدوار' : '🔒 Enable or disable anti-role edit protection' },
            { name: 'antiadmingrant', description: lang === 'ar' ? '🛡️ تفعيل أو تعطيل حماية ضد منح صلاحيات الإدارة' : '🛡️ Enable or disable anti-admin grant protection' },
            { name: 'antikick', description: lang === 'ar' ? '🚫 تفعيل أو تعطيل حماية ضد الطرد' : '🚫 Enable or disable anti-kick protection' },
            { name: 'antiban', description: lang === 'ar' ? '🛑 تفعيل أو تعطيل حماية ضد الحظر' : '🛑 Enable or disable anti-ban protection' },
            { name: 'ban', description: lang === 'ar' ? '🚫 حظر عضو من السيرفر' : '🚫 Ban a member from the server' },
            { name: 'kick', description: lang === 'ar' ? '🚪 طرد عضو من السيرفر' : '🚪 Kick a member from the server' },
            { name: 'server', description: lang === 'ar' ? '📊 عرض معلومات السيرفر' : '📊 Display server information' },
            { name: 'action', description: lang === 'ar' ? '🔧 تنفيذ إجراء على عضو' : '🔧 Perform an action on a member' },
            { name: 'setlmted', description: lang === 'ar' ? '📊 تعيين حد للإجراءات' : '📊 Set a limit for actions' },
            { name: 'status', description: lang === 'ar' ? '🤖 عرض حالة البوت' : '🤖 Display bot status' },
            { name: 'whitelist', description: lang === 'ar' ? '✅ إدارة القائمة البيضاء' : '✅ Manage the whitelist' },
            { name: 'unban', description: lang === 'ar' ? '✅ إلغاء حظر عضو من السيرفر' : '✅ Unban a member from the server' },
            { name: 'clear', description: lang === 'ar' ? '🗑️ حذف عدد محدد من الرسائل' : '🗑️ Delete a specified number of messages' },
            { name: 'ping', description: lang === 'ar' ? '📶 عرض زمن استجابة البوت' : '📶 Display bot response time' },
        ];

        const createEmbed = (page) => {
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(lang === 'ar' ? '🛡️ بوت الحماية القوي - المساعدة' : '🛡️ Powerful Protection Bot - Help')
                .setDescription(lang === 'ar' ? `هذه هي الأوامر المتاحة (الصفحة ${page + 1}):` : `Here are the available commands (Page ${page + 1}):`);

            const start = page * 10;
            const end = Math.min(start + 10, commands.length);

            for (let i = start; i < end; i++) {
                embed.addFields({ name: `/${commands[i].name}`, value: commands[i].description, inline: true });
            }

            return embed;
        };

        let currentPage = 0;

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel(lang === 'ar' ? 'السابق' : 'Previous')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel(lang === 'ar' ? 'التالي' : 'Next')
                    .setStyle(ButtonStyle.Primary)
            );

        const initialMessage = await Interaction.reply({
            embeds: [createEmbed(currentPage)],
            components: [row],
            fetchReply: true
        });

        const collector = initialMessage.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'previous') {
                currentPage = Math.max(0, currentPage - 1);
            } else if (i.customId === 'next') {
                currentPage = Math.min(Math.floor((commands.length - 1) / 10), currentPage + 1);
            }

            await i.update({
                embeds: [createEmbed(currentPage)],
                components: [row]
            });
        });

        collector.on('end', () => {
            initialMessage.edit({ components: [] });
        });
    }
};
