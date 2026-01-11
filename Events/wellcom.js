const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("boda.js");

module.exports = (client) => {
  client.on("guildMemberAdd", async (member) => {
    try {
      // Embed
      const welcomeEmbed = new EmbedBuilder()
        .setTitle("Safety Bot")
        .setColor(0x4caf50)
        .setDescription(
          "**All Bot Slash Commands** ``\n" +
          "**A basic bot with commands that you will need**\n\n" +
          "**Looking for Support?\nClick Join Support**"
        )
        .setFooter({ text: `Welcome ${member.user.tag}!`, iconURL: member.user.displayAvatarURL() })
        .setTimestamp();

      // Buttons
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Add Bot")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.com/api/oauth2/authorize?client_id=1413605227675910194&permissions=8&scope=bot%20applications.commands"),

        new ButtonBuilder()
          .setLabel("Dashbord")
          .setStyle(ButtonStyle.Link)
          .setURL("http://stafty-bot.my-board.org/"),

        new ButtonBuilder()
          .setLabel("Join Server Support")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.gg/2KafzvkyF9")
      );

      // Send DM
      await member.send({ embeds: [welcomeEmbed], components: [row] }).catch(() => {
        console.log(`❌ Cannot send DM to ${member.user.tag}`);
      });

    } catch (error) {
      console.error("❌ Error in wellcom event:", error);
    }
  });
};
