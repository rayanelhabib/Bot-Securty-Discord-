const { EmbedBuilder, PermissionsBitField } = require('boda.js');
const db = require('pro.db');

module.exports = {
    name: 'whitelist',
    description: 'Manage whitelist for protection features',
    options: [
        {
            name: 'action',
            description: 'Add or remove from whitelist',
            type: 3,
            required: true,
            choices: [
                { name: '➕ Add', value: 'add' },
                { name: '➖ Remove', value: 'remove' }
            ]
        },
        {
            name: 'feature',
            description: 'The protection feature to whitelist for',
            type: 3,
            required: true,
            choices: [
                { name: '🚫 Anti-Spam', value: 'antispam' },
                { name: '🛡️ Anti-Raid', value: 'antiraid' },
                { name: '🔒 Anti-Scam', value: 'antiscam' },
                { name: '🔗 Anti-Links', value: 'antilink' },
                { name: '🗑️ Anti-Channel Delete', value: 'antichanneldelete' },
                { name: '➕ Anti-Channel Create', value: 'antichannelcreate' },
                { name: '✏️ Anti-Channel Edit', value: 'antichanneledit' },
                { name: '➕ Anti-Role Create', value: 'antirolecreate' },
                { name: '🗑️ Anti-Role Delete', value: 'antiroledelete' },
                { name: '✏️ Anti-Role Edit', value: 'antiroleedit' },
                { name: '👑 Anti-Admin Grant', value: 'antiadmingrant' },
                { name: '👢 Anti-Kick', value: 'antikick' },
                { name: '🔨 Anti-Ban', value: 'antiban' }
            ]
        },
        {
            name: 'user',
            description: 'The user to whitelist/unwhitelist',
            type: 6,
            required: true
        }
    ],
    run: async (Client, Interaction) => {
        if (!Interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return Interaction.reply({ content: '❌ Sorry, this command is only available to administrators.', ephemeral: true });
        }

        const action = Interaction.options.getString('action');
        const feature = Interaction.options.getString('feature');
        const user = Interaction.options.getUser('user');
        const guildId = Interaction.guild.id;

        const whitelistKey = `${guildId}_${feature}_whitelist`;
        let whitelist = await db.get(whitelistKey) || [];

        // Fetch the language setting from the database
        const languageKey = `${guildId}_language`;
        const language = await db.get(languageKey) || 'en'; // Default to English if no language is set

        if (action === 'add') {
            if (whitelist.includes(user.id)) {
                const errorMessage = language === 'ar' 
                    ? `❌ هذا المستخدم مدرج بالفعل في القائمة البيضاء لـ ${feature}.`
                    : `❌ This user is already whitelisted for ${feature}.`;
                return Interaction.reply({ content: errorMessage, ephemeral: true });
            }
            whitelist.push(user.id);
            await db.set(whitelistKey, whitelist);

            const embed = new EmbedBuilder()
                .setTitle(language === 'ar' ? `⚪ تم تحديث القائمة البيضاء لـ ${feature}` : `⚪ ${feature} Whitelist Updated`)
                .setColor(0x00FF00)
                .setDescription(language === 'ar' 
                    ? `تمت إضافة ${user.tag} إلى القائمة البيضاء لـ ${feature}.`
                    : `${user.tag} has been added to the ${feature} whitelist.`)
                .setTimestamp();

            await Interaction.reply({ embeds: [embed] });
        } else if (action === 'remove') {
            if (!whitelist.includes(user.id)) {
                const errorMessage = language === 'ar'
                    ? `❌ هذا المستخدم غير موجود في القائمة البيضاء لـ ${feature}.`
                    : `❌ This user is not in the ${feature} whitelist.`;
                return Interaction.reply({ content: errorMessage, ephemeral: true });
            }
            whitelist = whitelist.filter(id => id !== user.id);
            await db.set(whitelistKey, whitelist);

            const embed = new EmbedBuilder()
                .setTitle(language === 'ar' ? `⚪ تم تحديث القائمة البيضاء لـ ${feature}` : `⚪ ${feature} Whitelist Updated`)
                .setColor(0xFF0000)
                .setDescription(language === 'ar'
                    ? `تمت إزالة ${user.tag} من القائمة البيضاء لـ ${feature}.`
                    : `${user.tag} has been removed from the ${feature} whitelist.`)
                .setTimestamp();

            await Interaction.reply({ embeds: [embed] });
        }
    }
};
