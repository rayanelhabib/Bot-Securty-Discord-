module.exports = async(Client, Invite) => {
    Client.GuildsInvite.delete(Invite.code);
}