const { EmbedBuilder, PermissionsBitField } = require('boda.js');
const db = require('pro.db');

module.exports = {
    name: 'setlimted',
    description: 'Set limits for protection features',
    options: [
        {
            name: 'feature',
            description: 'Select the protection feature to set limits for',
            type: 3,
            required: true,
            choices: [
                { name: '🚫 Anti-Spam', value: 'antispam' },
                { name: '✏️ Anti-Channel Edit', value: 'antichanneledit' },
                { name: '➕ Anti-Channel Create', value: 'antichannelcreate' },
                { name: '🗑️ Anti-Channel Delete', value: 'antichanneldelete' },
                { name: '✏️ Anti-Role Edit', value: 'antiroleedit' },
                { name: '➕ Anti-Role Create', value: 'antirolecreate' },
                { name: '🗑️ Anti-Role Delete', value: 'antiroledelete' },
                { name: '👢 Anti-Kick', value: 'antikick' },
                { name: '🔨 Anti-Ban', value: 'antiban' }
            ]
        },
        {
            name: 'limit',
            description: 'Set the limit (number of actions before triggering)',
            type: 4,
            required: true,
            min_value: 1,
            max_value: 100
        }
    ],
    run: async (Client, Interaction) => {
        if (!Interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return Interaction.reply({ content: '❌ Sorry, this command is only available to administrators.', ephemeral: true });
        }

        const feature = Interaction.options.getString('feature');
        const limit = Interaction.options.getInteger('limit');

        let title, description, dbKey;
        const guildId = Interaction.guild.id;
        const language = await db.get(`${guildId}_language`) || 'en';

        switch (feature) {
            case 'antispam':
                title = language === 'ar' ? '🚫 تم تعيين حد مكافحة السبام' : '🚫 Anti-Spam Limit Set';
                description = language === 'ar' ? `ستتم تفعيل حماية السبام بعد ${limit} رسائل.` : `Spam protection will now trigger after ${limit} messages.`;
                dbKey = `${guildId}_antispam_limit`;
                break;
            case 'antichanneledit':
                title = language === 'ar' ? '✏️ تم تعيين حد مكافحة تعديل القنوات' : '✏️ Anti-Channel Edit Limit Set';
                description = language === 'ar' ? `ستتم تفعيل حماية تعديل القنوات بعد ${limit} تعديلات.` : `Channel edit protection will now trigger after ${limit} edits.`;
                dbKey = `${guildId}_antichanneledit_limit`;
                break;
            case 'antichannelcreate':
                title = language === 'ar' ? '➕ تم تعيين حد مكافحة إنشاء القنوات' : '➕ Anti-Channel Create Limit Set';
                description = language === 'ar' ? `ستتم تفعيل حماية إنشاء القنوات بعد ${limit} إنشاءات.` : `Channel creation protection will now trigger after ${limit} creations.`;
                dbKey = `${guildId}_antichannelcreate_limit`;
                break;
            case 'antichanneldelete':
                title = language === 'ar' ? '🗑️ تم تعيين حد مكافحة حذف القنوات' : '🗑️ Anti-Channel Delete Limit Set';
                description = language === 'ar' ? `ستتم تفعيل حماية حذف القنوات بعد ${limit} عمليات حذف.` : `Channel deletion protection will now trigger after ${limit} deletions.`;
                dbKey = `${guildId}_antichanneldelete_limit`;
                break;
            case 'antiroleedit':
                title = language === 'ar' ? '✏️ تم تعيين حد مكافحة تعديل الأدوار' : '✏️ Anti-Role Edit Limit Set';
                description = language === 'ar' ? `ستتم تفعيل حماية تعديل الأدوار بعد ${limit} تعديلات.` : `Role edit protection will now trigger after ${limit} edits.`;
                dbKey = `${guildId}_antiroleedit_limit`;
                break;
            case 'antirolecreate':
                title = language === 'ar' ? '➕ تم تعيين حد مكافحة إنشاء الأدوار' : '➕ Anti-Role Create Limit Set';
                description = language === 'ar' ? `ستتم تفعيل حماية إنشاء الأدوار بعد ${limit} إنشاءات.` : `Role creation protection will now trigger after ${limit} creations.`;
                dbKey = `${guildId}_antirolecreate_limit`;
                break;
            case 'antiroledelete':
                title = language === 'ar' ? '🗑️ تم تعيين حد مكافحة حذف الأدوار' : '🗑️ Anti-Role Delete Limit Set';
                description = language === 'ar' ? `ستتم تفعيل حماية حذف الأدوار بعد ${limit} عمليات حذف.` : `Role deletion protection will now trigger after ${limit} deletions.`;
                dbKey = `${guildId}_antiroledelete_limit`;
                break;
            case 'antikick':
                title = language === 'ar' ? '👢 تم تعيين حد مكافحة الطرد' : '👢 Anti-Kick Limit Set';
                description = language === 'ar' ? `ستتم تفعيل حماية الطرد بعد ${limit} عمليات طرد.` : `Kick protection will now trigger after ${limit} kicks.`;
                dbKey = `${guildId}_antikick_limit`;
                break;
            case 'antiban':
                title = language === 'ar' ? '🔨 تم تعيين حد مكافحة الحظر' : '🔨 Anti-Ban Limit Set';
                description = language === 'ar' ? `ستتم تفعيل حماية الحظر بعد ${limit} عمليات حظر.` : `Ban protection will now trigger after ${limit} bans.`;
                dbKey = `${guildId}_antiban_limit`;
                break;
        }

        await db.set(dbKey, limit);

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(0x00FF00)
            .setTimestamp();

        await Interaction.reply({ embeds: [embed] });
    }
};
