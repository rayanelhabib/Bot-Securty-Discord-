"use strict";
const db = require('pro.db');

module.exports = async (Client, Interaction) => {
    if (Interaction.isChatInputCommand()) {
        const Cmd = Client.commands.get(Interaction.commandName);
        if (!Cmd) return;

        try {
            // Check if the command is enabled for this guild
            const isEnabled = await db.get(`${Interaction.guild.id}_command_${Interaction.commandName}`);
            
            if (isEnabled === false) {
                return Interaction.reply({ content: 'هذا الأمر معطل حاليًا في هذا السيرفر.', ephemeral: true });
            }

            // If the command is not explicitly disabled, or if it's enabled, run it
            await Cmd.run(Client, Interaction);
        } catch (Err) {
            console.log(Err);
            await Interaction.reply({ content: 'حدث خطأ أثناء تنفيذ الأمر.', ephemeral: true });
        }
    }
}