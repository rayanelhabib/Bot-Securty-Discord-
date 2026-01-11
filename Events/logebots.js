const { WebhookClient, EmbedBuilder } = require("boda.js");
const config = require("../Config.json");

module.exports = (client) => {
  // 🔹 Bot joins a server
  client.on("guildCreate", async (guild) => {
    try {
      const owner = await guild.fetchOwner();
      const embed = new EmbedBuilder()
        .setTitle("Bot Added to a Server")
        .setColor("Green")
        .setDescription(
          `<:arrowjoin6:1413603067588251711> **Server Name:** ${guild.name || "Unknown"}\n` +
          `<:arrowjoin6:1413603067588251711> **Server ID:** ${guild.id}\n` +
          `<:arrowjoin6:1413603067588251711> **Owner:** ${owner.user.tag} (${owner.id})\n` +
          `<:arrowjoin6:1413603067588251711> **Members:** ${guild.memberCount || "Unknown"}\n` +
          `<:arrowjoin6:1413603067588251711> **Total Guilds:** ${client.guilds.cache.size}`
        )
        .setThumbnail(guild.iconURL({ size: 1024 }) || null)
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

      await new WebhookClient({ url: config.webhookJoin }).send({ embeds: [embed] });
    } catch (err) {
      console.error("Error sending join log:", err);
    }
  });

  // 🔹 Bot leaves a server
  client.on("guildDelete", async (guild) => {
    try {
      let ownerTag = "Unknown";
      try {
        const owner = await guild.fetchOwner();
        ownerTag = `${owner.user.tag} (${owner.id})`;
      } catch {}

      const embed = new EmbedBuilder()
        .setTitle("Bot Removed from a Server")
        .setColor("Red")
           .setDescription(
          `<:arrowjoin6:1413603067588251711> **Server Name:** ${guild.name || "Unknown"}\n` +
          `<:arrowjoin6:1413603067588251711> **Server ID:** ${guild.id}\n` +
          `<:arrowjoin6:1413603067588251711> **Owner:** ${ownerTag}\n` +
          `<:arrowjoin6:1413603067588251711> **Members:** ${guild.memberCount || "Unknown"}\n` +
          `<:arrowjoin6:1413603067588251711> **Total Guilds:** ${client.guilds.cache.size}`
        )
        .setThumbnail(guild.iconURL({ size: 1024 }) || null)
        .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

      await new WebhookClient({ url: config.webhookLeft }).send({ embeds: [embed] });
    } catch (err) {
      console.error("Error sending leave log:", err);
    }
  });
};
