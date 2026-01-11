
const { EmbedBuilder } = require('boda.js');
const db = require('pro.db');

module.exports = {
    name: 'whitelist-list',
    description: 'Display the list of users allowed in the whitelist',
    options: [
        {
            name: 'feature',
            description: 'The protection feature to display its whitelist',
            type: 3,
            required: true,
            choices: [
                { name: '🔗 Anti-Links', value: 'antilink' },
                { name: '🗑️ Anti-Channel Delete', value: 'antichanneldelete' },
                { name: '➕ Anti-Channel Create', value: 'antichannelcreate' },
                { name: '✏️ Anti-Channel Edit', value: 'antichanneledit' },
                { name: '➕ Anti-Role Create', value: 'antirolecreate' },
                { name: '🗑️ Anti-Role Delete', value: 'antiroledelete' },
                { name: '✏️ Anti-Role Edit', value: 'antiroleedit' },
                { name: '👑 Anti-Admin Grant', value: 'antiadmingrant' },
                { name: '👢 Anti-Kick', value: 'antikick' },
                { name: '🔨 Anti-Ban', value: 'antiban' },
                { name: '🚫 Anti-Spam', value: 'antispam' },
                { name: '🛡️ Anti-Raid', value: 'antiraid' },
                { name: '🔒 Anti-Scam', value: 'antiscam' }
            ]
        }
    ],
    run: async(client, interaction) => {
        const feature = interaction.options.getString('feature');
        const guildId = interaction.guild.id;

        const whitelistKey = `${guildId}_${feature}_whitelist`;
        const whitelist = await db.get(whitelistKey) || [];

        const language = await db.get(`${guildId}_language`) || 'en';

        const embed = new EmbedBuilder()
            .setTitle(language === 'ar' ? `القائمة البيضاء لـ ${feature}` : `${feature} Whitelist`)
            .setColor(0x00FF00)
            .setDescription(whitelist.length > 0 
                ? (language === 'ar' ? 'قائمة المستخدمين المسموح لهم:' : 'List of whitelisted users:')
                : (language === 'ar' ? 'لا يوجد مستخدمين في القائمة البيضاء.' : 'No users in the whitelist.'))
            .setTimestamp();

        if (whitelist.length > 0) {
            const userList = await Promise.all(whitelist.map(async (userId) => {
                try {
                    const user = await client.users.fetch(userId);
                    return `${user} (${userId})`;
                } catch (error) {
                    console.error(`Error fetching user ${userId}:`, error);
                    return language === 'ar' ? `مستخدم غير معروف (${userId})` : `Unknown User (${userId})`;
                }
            }));

            embed.addFields({ name: language === 'ar' ? 'المستخدمون' : 'Users', value: userList.join('\n') });
        }

        await interaction.reply({ embeds: [embed] });
    }
};
