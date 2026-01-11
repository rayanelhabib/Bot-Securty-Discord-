const { 
    TextDisplayBuilder,
    ContainerBuilder,
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    MessageFlags
} = require('discord.js');
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

        const createComponents = (page) => {
            const start = page * 10;
            const end = Math.min(start + 10, commands.length);
            const totalPages = Math.ceil(commands.length / 10);
            
            // Créer le titre et la description
            const title = lang === 'ar' ? '🛡️ بوت الحماية القوي - المساعدة' : '🛡️ Powerful Protection Bot - Help';
            const description = lang === 'ar' ? `هذه هي الأوامر المتاحة (الصفحة ${page + 1} من ${totalPages}):` : `Here are the available commands (Page ${page + 1} of ${totalPages}):`;
            
            // Créer le titre principal
            const titleComponent = new TextDisplayBuilder()
                .setContent(`# ${title}`);
            
            // Créer la description
            const descriptionComponent = new TextDisplayBuilder()
                .setContent(description);

            // Grouper les commandes par catégories pour une meilleure organisation
            const protectionCommands = commands.slice(start, end).filter(cmd => 
                cmd.name.startsWith('anti') || cmd.name === 'enable' || cmd.name === 'disable' || 
                cmd.name === 'setpunishment' || cmd.name === 'settings'
            );
            
            const moderationCommands = commands.slice(start, end).filter(cmd => 
                cmd.name === 'ban' || cmd.name === 'kick' || cmd.name === 'unban' || 
                cmd.name === 'clear' || cmd.name === 'whitelist'
            );
            
            const utilityCommands = commands.slice(start, end).filter(cmd => 
                cmd.name === 'help' || cmd.name === 'server' || cmd.name === 'status' || 
                cmd.name === 'ping' || cmd.name === 'setlang'
            );

            // Créer les composants de texte pour chaque catégorie
            const textComponents = [titleComponent, descriptionComponent];

            // Ajouter les commandes de protection
            if (protectionCommands.length > 0) {
                let protectionText = `## ${lang === 'ar' ? '🛡️ أوامر الحماية' : '🛡️ Protection Commands'}\n`;
                protectionCommands.forEach(cmd => {
                    protectionText += `**/${cmd.name}** - ${cmd.description}\n`;
                });
                
                const protectionComponent = new TextDisplayBuilder()
                    .setContent(protectionText);
                textComponents.push(protectionComponent);
            }
            
            // Ajouter les commandes de modération
            if (moderationCommands.length > 0) {
                let moderationText = `## ${lang === 'ar' ? '🔨 أوامر الإشراف' : '🔨 Moderation Commands'}\n`;
                moderationCommands.forEach(cmd => {
                    moderationText += `**/${cmd.name}** - ${cmd.description}\n`;
                });
                
                const moderationComponent = new TextDisplayBuilder()
                    .setContent(moderationText);
                textComponents.push(moderationComponent);
            }
            
            // Ajouter les commandes utilitaires
            if (utilityCommands.length > 0) {
                let utilityText = `## ${lang === 'ar' ? '⚙️ أوامر المساعدة' : '⚙️ Utility Commands'}\n`;
                utilityCommands.forEach(cmd => {
                    utilityText += `**/${cmd.name}** - ${cmd.description}\n`;
                });
                
                const utilityComponent = new TextDisplayBuilder()
                    .setContent(utilityText);
                textComponents.push(utilityComponent);
            }

            // Si aucune commande de cette page n'est dans les catégories, afficher toutes les commandes
            if (protectionCommands.length === 0 && moderationCommands.length === 0 && utilityCommands.length === 0) {
                let allCommandsText = `## ${lang === 'ar' ? '📋 جميع الأوامر' : '📋 All Commands'}\n`;
                for (let i = start; i < end; i++) {
                    allCommandsText += `**/${commands[i].name}** - ${commands[i].description}\n`;
                }
                
                const allCommandsComponent = new TextDisplayBuilder()
                    .setContent(allCommandsText);
                textComponents.push(allCommandsComponent);
            }

            // Ajouter le footer avec conseil
            const footerText = lang === 'ar' ? '💡 **نصيحة:** استخدم الأزرار أدناه للتنقل بين الصفحات' : '💡 **Tip:** Use the buttons below to navigate between pages';
            const footerComponent = new TextDisplayBuilder()
                .setContent(`> ${footerText}`);
            textComponents.push(footerComponent);

            // Créer le container principal avec tous les composants de texte
            const container = new ContainerBuilder()
                .setAccentColor(0x0099FF)
                .addTextDisplayComponents(...textComponents);

            return container;
        };

        let currentPage = 0;

        // Créer les boutons de pagination avec des styles améliorés
        const createPaginationButtons = (currentPage, totalPages) => {
            const buttons = [];
            
            // Bouton Previous
            buttons.push(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel(lang === 'ar' ? '◀️ السابق' : '◀️ Previous')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(currentPage === 0)
            );
            
            // Bouton d'information de page
            buttons.push(
                new ButtonBuilder()
                    .setCustomId('page_info')
                    .setLabel(`${currentPage + 1}/${totalPages}`)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true)
            );
            
            // Bouton Next
            buttons.push(
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel(lang === 'ar' ? 'التالي ▶️' : 'Next ▶️')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(currentPage === totalPages - 1)
            );
            
            // Bouton de rafraîchissement
            buttons.push(
                new ButtonBuilder()
                    .setCustomId('refresh')
                    .setLabel(lang === 'ar' ? '🔄 تحديث' : '🔄 Refresh')
                    .setStyle(ButtonStyle.Success)
            );
            
            return new ActionRowBuilder().addComponents(...buttons);
        };

        const totalPages = Math.ceil(commands.length / 10);
        const initialMessage = await Interaction.reply({
            components: [createComponents(currentPage), createPaginationButtons(currentPage, totalPages)],
            flags: MessageFlags.IsComponentsV2,
            fetchReply: true
        });

        const collector = initialMessage.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'previous') {
                currentPage = Math.max(0, currentPage - 1);
            } else if (i.customId === 'next') {
                currentPage = Math.min(Math.floor((commands.length - 1) / 10), currentPage + 1);
            } else if (i.customId === 'refresh') {
                // Rafraîchir la page actuelle
                currentPage = currentPage; // Pas de changement, juste un refresh
            } else if (i.customId === 'page_info') {
                // Ne rien faire pour le bouton d'information
                return;
            }

            await i.update({
                components: [createComponents(currentPage), createPaginationButtons(currentPage, totalPages)],
                flags: MessageFlags.IsComponentsV2
            });
        });

        collector.on('end', () => {
            initialMessage.edit({ 
                components: [],
                flags: MessageFlags.IsComponentsV2
            });
        });
    }
};
