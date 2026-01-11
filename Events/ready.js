module.exports = async (Client) => {
    Client.user.setStatus('online');

    
    Client.user.setActivity({
        name: '/help | discord.gg/safety',
        type: 3 
    });

    console.log(`${Client.user.tag} is now online!`);
};
