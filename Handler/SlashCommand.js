"use strict";
const { glob } = require('glob');
const { promisify } = require('util');
const Glob = promisify(glob);

module.exports = async Client => {
    const commandFiles = await Glob(`${process.cwd()}/SlashCommand/**/*.js`);
    const commands = [];
    const commandStatus = {}; // Track command statuses

    for (const commandFile of commandFiles) {
        try {
            const command = require(commandFile);
            if (!command.name || !command.description) {
                throw new Error('Missing required fields (name or description)');
            }
            Client.commands.set(command.name, command);
            commands.push(command);
            commandStatus[command.name] = { status: true };
        } catch (error) {
            commandStatus[commandFile] = { status: false, error: error.message };
        }
    }

    Client.commandStatus = commandStatus;
    console.log('\n==================================');
    console.log('🛡️  POWERFUL PROTECTION BOT  🛡️');
    console.log('==================================\n');
    console.log('--------------------');
    const maxCommandLength = Math.max(...Object.keys(commandStatus).map(cmd => cmd.length));
    
    Object.entries(commandStatus).forEach(([command, status]) => {
        const paddedCommand = command.padEnd(maxCommandLength + 2);
        const statusIcon = status.status ? '✅' : '❌';
        const statusColor = status.status ? '\x1b[32m' : '\x1b[31m';
        const statusText = status.status ? 'Working' : `Error - ${status.error}`;
        
        console.log(`${statusColor}${statusIcon} ${paddedCommand}${statusText}\x1b[0m`);
    });
    
    console.log('--------------------\n');
    console.log('\n');

    Client.on('ready', async () => {
        try {
            await Client.application.commands.set(commands);
            console.log('\n🚀 Commands loaded and set successfully!');
            console.log('🔒 Protection features are now active.');
            console.log('💪 Your server is now fortified against threats!\n');
        } catch (error) {
            console.error('❌ Failed to set commands:', error);
        }
    });
};
