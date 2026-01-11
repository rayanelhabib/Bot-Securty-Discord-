const { EmbedBuilder, PermissionsBitField } = require('boda.js');
const db = require('pro.db');

module.exports = {
    name: 'status',
    description: ' Check the status of all protection features',
    run: async (Client, Interaction) => {
        if (!Interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return Interaction.reply({ content: '❌ Sorry, this command is only available to administrators.', ephemeral: true });
        }

        const features = [
            { name: 'Anti-Spam', key: 'antispam' },
            { name: 'Anti-Raid', key: 'antiraid' },
            { name: 'Anti-Scam', key: 'antiscam' },
            { name: 'Anti-Links', key: 'antilink' },
            { name: 'Anti-Channel Delete', key: 'antichandeldelete' },
            { name: 'Anti-Channel Create', key: 'antichanelcreate' },
            { name: 'Anti-Channel Edit', key: 'antichanneledit' },
            { name: 'Anti-Role Create', key: 'antirolecreate' },
            { name: 'Anti-Role Delete', key: 'antiroledelete' },
            { name: 'Anti-Role Edit', key: 'antiroleedit' },
            { name: 'Anti-Admin Grant', key: 'antiadmingrant' },
            { name: 'Anti-Kick', key: 'antikick' },
            { name: 'Anti-Ban', key: 'antiban' }
        ];

        const guildLanguage = await db.get(`${Interaction.guild.id}_language`) || 'en';

        const statusEmbed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTimestamp();

        if (guildLanguage === 'ar') {
            statusEmbed.setTitle('🛡️ حالة حماية السيرفر')
                .setDescription('الحالة الحالية لجميع ميزات الحماية:');
        } else {
            statusEmbed.setTitle('🛡️ Server Protection Status')
                .setDescription('Current status of all protection features:');
        }

        for (const feature of features) {
            const isEnabled = await db.get(`${Interaction.guild.id}_${feature.key}`);
            let status;
            if (guildLanguage === 'ar') {
                status = isEnabled ? '✅ مفعل' : '❌ معطل';
            } else {
                status = isEnabled ? '✅ Enabled' : '❌ Disabled';
            }
            statusEmbed.addFields({ name: feature.name, value: status, inline: true });
        }

        await Interaction.reply({ embeds: [statusEmbed] });
    }
};
