const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('boda.js');
const db = require('pro.db');

module.exports = {
    name: "verfiy",
    description: "Set up the verification system for the server",
    options: [
        {
            name: 'channel',
            description: 'The channel to send the verification message',
            type: 7,
            required: true
        },
        {
            name: 'role',
            description: 'The role to give to verified members',
            type: 8,
            required: true
        }
    ],

    run: async(client, interaction) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({ content: 'You do not have sufficient permissions to use this command.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');
        const guildId = interaction.guild.id;

        const verifyEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Member Verification')
            .setDescription('**To verify that you are human, please click the button below and proceed to the verification page in the dashboard.**');

        const userId = interaction.user.id;    
        const verifyButton = new ButtonBuilder()
            .setCustomId('ver')
            .setLabel('Verify')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder()
            .addComponents(verifyButton);

        const message = await channel.send({ embeds: [verifyEmbed], components: [row] });

        await db.set(`${guildId}_verify_message`, message.id);
        await db.set(`${guildId}_verify_channel`, channel.id);
        await db.set(`${guildId}_verify_role`, role.id);

        interaction.reply({ content: `Verification system has been set up successfully! Verified members will receive the ${role.name} role.`, ephemeral: true });
    },
};
