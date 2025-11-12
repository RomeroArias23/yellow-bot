const { EmbedBuilder } = require('discord.js');
const api = require('../utils/api');

module.exports = {
  name: 'buscar',
  description: 'Busca cartas por destinatario 🔍',
  async execute(message, args) {
    const query = args.join(' ');
    if (!query) return message.reply('💛 **Uso:** `!buscar NombreDelDestinatario`');

    try {
      const res = await api.get('/letters');
      const letters = res.data.filter(l => l.addressee.toLowerCase().includes(query.toLowerCase()));

      if (!letters.length) return message.reply(`No hay cartas para **${query}** 😢`);

      const embed = new EmbedBuilder()
        .setColor('#FDEA6B')
        .setTitle(`💛 Cartas encontradas para ${query}`)
        .setDescription(`Se encontraron ${letters.length} resultados:`);

      letters.slice(0, 3).forEach((l, i) => {
        embed.addFields({
          name: `Carta ${i + 1} - ${l.date}`,
          value: `"${l.letter.substring(0, 100)}${l.letter.length > 100 ? '...' : ''}"`
        });
      });

      message.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply('❌ Error al buscar cartas.');
    }
  }
};
