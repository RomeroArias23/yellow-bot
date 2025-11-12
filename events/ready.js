module.exports = (client) => {
  console.log(`✅ Bot { YELLOW } conectado como ${client.user.tag}`);
  client.user.setActivity('import { YELLOW } from ./CVLTVRE', { type: 'LISTENING' });
};
