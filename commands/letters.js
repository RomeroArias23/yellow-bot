const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const api = require('../utils/api');
const createLetterImage = require('../utils/createLetterImage');

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

      // 1. Generar la imagen
      const imageBuffer = await createLetterImage(addressee, letter);
      const attachment = new AttachmentBuilder(imageBuffer, { name: 'carta.png' });

      // 2. Crear embed
      const embed = new EmbedBuilder()
        .setColor('#FDEA6B')
        .setTitle('💌 Carta creada en { YELLOW }')
        .setDescription(`**Para:** ${addressee}\n**Mensaje:** ${letter}`)
        .setImage('attachment://carta.png')
        .setFooter({ text: 'Tu carta ha sido guardada en el archivo de { YELLOW }' })
        .setTimestamp();

      // 3. Enviar mensaje con la imagen
      await message.reply({ embeds: [embed], files: [attachment] });

    } catch (error) {
      console.error(error);
      message.reply('❌ No pude guardar la carta. Inténtalo más tarde.');
    }
  }
};
