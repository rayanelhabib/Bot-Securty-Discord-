const { EmbedBuilder, PermissionsBitField } = require('boda.js');
const db = require('pro.db');

module.exports = {
    name: 'disable',
    description: 'Disable protection features',
    options: [
        {
            name: 'feature',
            description: 'Select the protection feature to disable',
            type: 3,
            required: true,
            choices: [
                { name: '🔗 Anti-Link', value: 'antilink' },
                { name: '🚫 Anti-Spam', value: 'antispam' },
                { name: '🕵️ Anti-Scam', value: 'antiscam' },
                { name: '🛡️ Anti-Raid', value: 'antiraid' },
                { name: '🗑️ Anti-Channel Delete', value: 'antichandeldelete' },
                { name: '➕ Anti-Channel Create', value: 'antichanelcreate' },
                { name: '✏️ Anti-Channel Edit', value: 'antichanneledit' },
                { name: '🏷️ Anti-Role Create', value: 'antirolecreate' },
                { name: '🗑️ Anti-Role Delete', value: 'antiroledelete' },
                { name: '✏️ Anti-Role Edit', value: 'antiroleedit' },
                { name: '👑 Anti-Admin Grant', value: 'antiadmingrant' },
                { name: '🦶 Anti-Kick', value: 'antikick' },
                { name: '🔨 Anti-Ban', value: 'antiban' }
            ]
        }
    ],
    run: async (Client, Interaction) => {
        if (!Interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return Interaction.reply({ content: '❌ Sorry, this command is only available to administrators.', ephemeral: true });
        }

        const feature = Interaction.options.getString('feature');
        let title, description, color, emoji;

        // Get the language from the database, default to English if not set
        const guildLanguage = db.get(`${Interaction.guild.id}_language`) || 'en';

        switch (feature) {
            case 'antilink':
                title = guildLanguage === 'ar' ? '🔗 تم تعطيل مكافحة الروابط' : '🔗 Anti-Link Disabled';
                description = guildLanguage === 'ar' ? 'تم إلغاء تنشيط حماية الروابط.' : 'Link protection has been deactivated.';
                color = 0xFF0000;
                emoji = '🔗';
                db.delete(`${Interaction.guild.id}_antilink`);
                break;
            case 'antispam':
                title = guildLanguage === 'ar' ? '🚫 تم تعطيل مكافحة السبام' : '🚫 Anti-Spam Disabled';
                description = guildLanguage === 'ar' ? 'تم إلغاء تنشيط الحماية من الرسائل المزعجة.' : 'Spam protection has been deactivated.';
                color = 0xFF4500;
                emoji = '🚫';
                db.delete(`${Interaction.guild.id}_antispam`);
                break;
            case 'antiscam':
                title = guildLanguage === 'ar' ? '🕵️ تم تعطيل مكافحة الاحتيال' : '🕵️ Anti-Scam Disabled';
                description = guildLanguage === 'ar' ? 'تم إلغاء تنشيط الحماية من الاحتيال.' : 'Scam protection has been deactivated.';
                color = 0xFFFF00;
                emoji = '🕵️';
                db.delete(`${Interaction.guild.id}_antiscam`);
                break;
            case 'antiraid':
                title = guildLanguage === 'ar' ? '🛡️ تم تعطيل مكافحة الغارات' : '🛡️ Anti-Raid Disabled';
                description = guildLanguage === 'ar' ? 'تم إلغاء تنشيط الحماية من الغارات.' : 'Raid protection has been deactivated.';
                color = 0x0000FF;
                emoji = '🛡️';
                db.delete(`${Interaction.guild.id}_antiraid`);
                break;
            case 'antichandeldelete':
                title = guildLanguage === 'ar' ? '🗑️ تم تعطيل مكافحة حذف القنوات' : '🗑️ Anti-Channel Delete Disabled';
                description = guildLanguage === 'ar' ? 'تم إلغاء تنشيط الحماية ضد حذف القنوات.' : 'Protection against channel deletion has been deactivated.';
                color = 0x800080;
                emoji = '🗑️';
                db.delete(`${Interaction.guild.id}_antichandeldelete`);
                break;
            case 'antichanelcreate':
                title = guildLanguage === 'ar' ? '➕ تم تعطيل مكافحة إنشاء القنوات' : '➕ Anti-Channel Create Disabled';
                description = guildLanguage === 'ar' ? 'تم إلغاء تنشيط الحماية ضد إنشاء القنوات غير المصرح به.' : 'Protection against unauthorized channel creation has been deactivated.';
                color = 0xFFA500;
                emoji = '➕';
                db.delete(`${Interaction.guild.id}_antichanelcreate`);
                break;
            case 'antichanneledit':
                title = guildLanguage === 'ar' ? '✏️ تم تعطيل مكافحة تعديل القنوات' : '✏️ Anti-Channel Edit Disabled';
                description = guildLanguage === 'ar' ? 'تم إلغاء تنشيط الحماية ضد تعديلات القنوات غير المصرح بها.' : 'Protection against unauthorized channel edits has been deactivated.';
                color = 0x008080;
                emoji = '✏️';
                db.delete(`${Interaction.guild.id}_antichanneledit`);
                break;
            case 'antirolecreate':
                title = guildLanguage === 'ar' ? '🏷️ تم تعطيل مكافحة إنشاء الأدوار' : '🏷️ Anti-Role Create Disabled';
                description = guildLanguage === 'ar' ? 'تم إلغاء تنشيط الحماية ضد إنشاء الأدوار غير المصرح به.' : 'Protection against unauthorized role creation has been deactivated.';
                color = 0x1E90FF;
                emoji = '🏷️';
                db.delete(`${Interaction.guild.id}_antirolecreate`);
                break;
            case 'antiroledelete':
                title = guildLanguage === 'ar' ? '🗑️ تم تعطيل مكافحة حذف الأدوار' : '🗑️ Anti-Role Delete Disabled';
                description = guildLanguage === 'ar' ? 'تم إلغاء تنشيط الحماية ضد حذف الأدوار.' : 'Protection against role deletion has been deactivated.';
                color = 0xDC143C;
                emoji = '🗑️';
                db.delete(`${Interaction.guild.id}_antiroledelete`);
                break;
            case 'antiroleedit':
                title = guildLanguage === 'ar' ? '✏️ تم تعطيل مكافحة تعديل الأدوار' : '✏️ Anti-Role Edit Disabled';
                description = guildLanguage === 'ar' ? 'تم إلغاء تنشيط الحماية ضد تعديلات الأدوار غير المصرح بها.' : 'Protection against unauthorized role edits has been deactivated.';
                color = 0x32CD32;
                emoji = '✏️';
                db.delete(`${Interaction.guild.id}_antiroleedit`);
                break;
            case 'antiadmingrant':
                title = guildLanguage === 'ar' ? '👑 تم تعطيل مكافحة منح صلاحيات الإدارة' : '👑 Anti-Admin Grant Disabled';
                description = guildLanguage === 'ar' ? 'تم إلغاء تنشيط الحماية ضد منح أدوار المسؤول غير المصرح بها.' : 'Protection against unauthorized administrator role grants has been deactivated.';
                color = 0xFFD700;
                emoji = '👑';
                db.delete(`${Interaction.guild.id}_antiadmingrant`);
                break;
            case 'antikick':
                title = guildLanguage === 'ar' ? '🦶 تم تعطيل مكافحة الطرد' : '🦶 Anti-Kick Disabled';
                description = guildLanguage === 'ar' ? 'تم إلغاء تنشيط الحماية ضد عمليات الطرد غير المصرح بها.' : 'Protection against unauthorized kicks has been deactivated.';
                color = 0xA52A2A;
                emoji = '🦶';
                db.delete(`${Interaction.guild.id}_antikick`);
                break;
            case 'antiban':
                title = guildLanguage === 'ar' ? '🔨 تم تعطيل مكافحة الحظر' : '🔨 Anti-Ban Disabled';
                description = guildLanguage === 'ar' ? 'تم إلغاء تنشيط الحماية ضد عمليات الحظر غير المصرح بها.' : 'Protection against unauthorized bans has been deactivated.';
                color = 0x8B0000;
                emoji = '🔨';
                db.delete(`${Interaction.guild.id}_antiban`);
                break;
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setTimestamp();

        await Interaction.reply({ embeds: [embed] });
    }
};
