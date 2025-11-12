const { EmbedBuilder } = require('discord.js');
const api = require('../utils/api');

module.exports = {
  name: 'carta',
  description: 'Crea una carta anónima 💌',
  async execute(message, args) {
    const content = args.join(' ').split('|');
    if (content.length < 2) {
      return message.reply('💛 **Uso:** `!carta Destinatario | Tu mensaje (máx 300 caracteres)`');
    }

    const addressee = content[0].trim();
    const letter = content[1].trim();

    if (!/^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(addressee)) {
      return message.reply('❌ El destinatario debe empezar con mayúscula y solo contener letras.');
    }

    if (letter.length > 300) {
      return message.reply(`❌ Tu mensaje tiene ${letter.length}/300 caracteres.`);
    }

    try {
      const res = await api.post('/letters', { addressee, letter });

      const embed = new EmbedBuilder()
        .setColor('#FDEA6B')
        .setTitle('💌 Carta creada en { YELLOW }')
        .setDescription(`**Para:** ${addressee}\n**Mensaje:** ${letter}`)
        .setFooter({ text: 'Tu carta ha sido guardada en el archivo de { YELLOW }' })
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('❌ No pude guardar la carta. Inténtalo más tarde.');
    }
  }
};
