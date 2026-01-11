const { EmbedBuilder, PermissionsBitField } = require("boda.js");
const db = require("pro.db");

module.exports = {
    name: 'enable',
    description: 'Enable server protection features',
    options: [
        {
            name: 'choice',
            description: 'Select the protection type to enable',
            type: 3,
            required: true,
            choices: [
                { name: '🚫 Anti-Spam', value: 'antispam' },
                { name: '🛑 Anti-Raid', value: 'antiraid' },
                { name: '🕵️ Anti-Scam', value: 'antiscam' },
                { name: '🔗 Anti-Links', value: 'antilink' },
                { name: '🗑️ Anti-Channel Delete', value: 'antichandeldelete' },
                { name: '➕ Anti-Channel Create', value: 'antichanelcreate' },
                { name: '✏️ Anti-Channel Edit', value: 'antichanneledit' },
                { name: '🏷️ Anti-Role Create', value: 'antirolecreate' },
                { name: '🗑️ Anti-Role Delete', value: 'antiroledelete' },
                { name: '✏️ Anti-Role Edit', value: 'antiroleedit' },
                { name: '🛡️ Anti-Admin Grant', value: 'antiadmingrant' },
                { name: '🔨 Anti-Ban', value: 'antiban' },
                { name: '👢 Anti-Kick', value: 'antikick' },
                { name: '📱 Anti-External Apps/Links', value: 'antiexternalapps' }
            ]
        }
    ],
    run: async (Client, Interaction) => {
        if (!Interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return Interaction.reply({ content: '❌ You must be an administrator to use this command.', ephemeral: true });
        }

        const choice = Interaction.options.getString('choice');
        const lang = db.get(`${Interaction.guild.id}_language`) || 'en';
        let title, description, color, emoji;

        switch (choice) {
            case 'antispam':
                title = lang === 'ar' ? '🚫 تم تفعيل مكافحة السبام' : '🚫 Anti-Spam Enabled';
                description = lang === 'ar' ? 'تم تفعيل حماية السبام لهذا السيرفر.' : 'Spam protection has been activated for this server.';
                color = 0x00FF00; emoji = '🚫';
                db.set(`${Interaction.guild.id}_antispam`, true);
                break;
            case 'antiraid':
                title = lang === 'ar' ? '🛑 تم تفعيل مكافحة الريد' : '🛑 Anti-Raid Enabled';
                description = lang === 'ar' ? 'تم تفعيل حماية الريد لهذا السيرفر.' : 'Raid protection has been activated for this server.';
                color = 0xFF0000; emoji = '🛑';
                db.set(`${Interaction.guild.id}_antiraid`, true);
                break;
            case 'antiscam':
                title = lang === 'ar' ? '🕵️ تم تفعيل مكافحة الاحتيال' : '🕵️ Anti-Scam Enabled';
                description = lang === 'ar' ? 'تم تفعيل حماية الاحتيال لهذا السيرفر.' : 'Scam protection has been activated for this server.';
                color = 0xFFFF00; emoji = '🕵️';
                db.set(`${Interaction.guild.id}_antiscam`, true);
                break;
            case 'antilink':
                title = lang === 'ar' ? '🔗 تم تفعيل مكافحة الروابط' : '🔗 Anti-Links Enabled';
                description = lang === 'ar' ? 'تم تفعيل حماية الروابط لهذا السيرفر.' : 'Link protection has been activated for this server.';
                color = 0x0000FF; emoji = '🔗';
                db.set(`${Interaction.guild.id}_antilink`, true);
                break;
            case 'antichandeldelete':
                title = lang === 'ar' ? '🗑️ تم تفعيل مكافحة حذف القنوات' : '🗑️ Anti-Channel Delete Enabled';
                description = lang === 'ar' ? 'تم تفعيل الحماية ضد حذف القنوات.' : 'Protection against channel deletion has been activated.';
                color = 0x800080; emoji = '🗑️';
                db.set(`${Interaction.guild.id}_antichandeldelete`, true);
                break;
            case 'antichanelcreate':
                title = lang === 'ar' ? '➕ تم تفعيل مكافحة إنشاء القنوات' : '➕ Anti-Channel Create Enabled';
                description = lang === 'ar' ? 'تم تفعيل الحماية ضد إنشاء القنوات غير المصرح به.' : 'Protection against unauthorized channel creation has been activated.';
                color = 0xFFA500; emoji = '➕';
                db.set(`${Interaction.guild.id}_antichanelcreate`, true);
                break;
            case 'antichanneledit':
                title = lang === 'ar' ? '✏️ تم تفعيل مكافحة تعديل القنوات' : '✏️ Anti-Channel Edit Enabled';
                description = lang === 'ar' ? 'تم تفعيل الحماية ضد تعديلات القنوات غير المصرح بها.' : 'Protection against unauthorized channel edits has been activated.';
                color = 0x008080; emoji = '✏️';
                db.set(`${Interaction.guild.id}_antichanneledit`, true);
                break;
            case 'antirolecreate':
                title = lang === 'ar' ? '🏷️ تم تفعيل مكافحة إنشاء الأدوار' : '🏷️ Anti-Role Create Enabled';
                description = lang === 'ar' ? 'تم تفعيل الحماية ضد إنشاء الأدوار غير المصرح به.' : 'Protection against unauthorized role creation has been activated.';
                color = 0x1E90FF; emoji = '🏷️';
                db.set(`${Interaction.guild.id}_antirolecreate`, true);
                break;
            case 'antiroledelete':
                title = lang === 'ar' ? '🗑️ تم تفعيل مكافحة حذف الأدوار' : '🗑️ Anti-Role Delete Enabled';
                description = lang === 'ar' ? 'تم تفعيل الحماية ضد حذف الأدوار.' : 'Protection against role deletion has been activated.';
                color = 0xDC143C; emoji = '🗑️';
                db.set(`${Interaction.guild.id}_antiroledelete`, true);
                break;
            case 'antiroleedit':
                title = lang === 'ar' ? '✏️ تم تفعيل مكافحة تعديل الأدوار' : '✏️ Anti-Role Edit Enabled';
                description = lang === 'ar' ? 'تم تفعيل الحماية ضد تعديلات الأدوار غير المصرح بها.' : 'Protection against unauthorized role edits has been activated.';
                color = 0x32CD32; emoji = '✏️';
                db.set(`${Interaction.guild.id}_antiroleedit`, true);
                break;
            case 'antiadmingrant':
                title = lang === 'ar' ? '🛡️ تم تفعيل مكافحة منح صلاحيات الإدارة' : '🛡️ Anti-Admin Grant Enabled';
                description = lang === 'ar' ? 'تم تفعيل الحماية ضد منح أدوار الإدارة غير المصرح به.' : 'Protection against unauthorized granting of administrator roles has been activated.';
                color = 0x8B0000; emoji = '🛡️';
                db.set(`${Interaction.guild.id}_antiadmingrant`, true);
                break;
            case 'antiban':
                title = lang === 'ar' ? '🔨 تم تفعيل مكافحة الحظر' : '🔨 Anti-Ban Enabled';
                description = lang === 'ar' ? 'تم تفعيل الحماية ضد الحظر غير المصرح به.' : 'Protection against unauthorized bans has been activated.';
                color = 0x4B0082; emoji = '🔨';
                db.set(`${Interaction.guild.id}_antiban`, true);
                break;
            case 'antikick':
                title = lang === 'ar' ? '👢 تم تفعيل مكافحة الطرد' : '👢 Anti-Kick Enabled';
                description = lang === 'ar' ? 'تم تفعيل الحماية ضد الطرد غير المصرح به.' : 'Protection against unauthorized kicks has been activated.';
                color = 0xFFD700; emoji = '👢';
                db.set(`${Interaction.guild.id}_antikick`, true);
                break;
            case 'antiexternalapps':
                title = lang === 'ar' ? '📱 تم تفعيل مكافحة التطبيقات الخارجية/الروابط' : '📱 Anti-External Apps/Links Enabled';
                description = lang === 'ar' ? 'تم تفعيل الحماية ضد التطبيقات الخارجية والروابط.' : 'Protection against external apps/links has been activated.';
                color = 0xFF4500; emoji = '📱';
                db.set(`${Interaction.guild.id}_antispam_external`, true);
                db.set(`${Interaction.guild.id}_antispam_external_limit`, 1);
                db.set(`${Interaction.guild.id}_antispam_external_interval`, 10000);
                db.set(`${Interaction.guild.id}_antispam_external_timeout`, 600000);
                break;
            default:
                title = lang === 'ar' ? '❌ اختيار غير صالح' : '❌ Invalid Choice';
                description = lang === 'ar' ? 'الرجاء اختيار نوع حماية صالح.' : 'Please select a valid protection type.';
                color = 0xFF0000; emoji = '❌';
        }

        const embed = new EmbedBuilder()
            .setTitle(`${emoji} ${title}`)
            .setDescription(description)
            .setColor(color)
            .setTimestamp()
            .setFooter({ text: lang === 'ar' ? `تم الطلب بواسطة ${Interaction.user.tag}` : `Requested by ${Interaction.user.tag}`, iconURL: Interaction.user.displayAvatarURL() });

        await Interaction.reply({ embeds: [embed] });
    }
}
