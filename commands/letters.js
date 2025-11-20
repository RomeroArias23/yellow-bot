const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const api = require('../utils/api');
const createLetterImage = require('../utils/createLetterImg');

module.exports = {
  name: 'carta',
  description: 'Crea una carta anónima 💌',

  async execute(message, { addressee, letter }) {

    // ===========================
    // validations
    // ============================

    // validate addressee
    if (
      !/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*)*$/.test(addressee)
    ) {
      return message.reply(
        '❌ El destinatario debe empezar con mayúscula y solo contener letras (puede incluir espacios).'
      );
    }

    // Validate length of the message
    if (letter.length > 300) {
      return message.reply(`❌ Tu mensaje tiene ${letter.length}/300 caracteres.`);
    }

    try {
      // save in the API
      const res = await api.post('/letters', { addressee, letter });

      // generate image
      const imageBuffer = await createLetterImage(addressee, letter);
      const attachment = new AttachmentBuilder(imageBuffer, { name: 'carta.png' });

      // create embed
      const embed = new EmbedBuilder()
        .setColor('#FDEA6B')
        .setTitle('💌 Carta creada en { YELLOW }')
        .setDescription(`**Para:** ${addressee}\n**Mensaje:** ${letter}`)
        .setImage('attachment://carta.png')
        .setFooter({ text: 'Tu carta ha sido guardada en el archivo de { YELLOW }' })
        .setTimestamp();

      await message.reply({ embeds: [embed], files: [attachment] });

    } catch (error) {
      console.error(error);
      message.reply('❌ No pude guardar la carta. Inténtalo más tarde.');
    }
  }
};
