const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const api = require('../utils/api');
const createLetterImage = require('../utils/createLetterImg');

module.exports = {
  name: 'carta',
  description: 'Crea una carta anónima 💌',
  async execute(message, args) {

    const content = args.join(' ').split(',');
    
    if (content.length < 2) {
      return message.reply('💛 **Uso:** `!carta Destinatario, tu mensaje (máx 300 caracteres)`');
    }

    // Destinatario = antes de la coma
    const addressee = content[0].trim();

    // Mensaje = todo lo demás después de la coma (une por si hay más comas)
    const letter = content.slice(1).join(',').trim();

    // Validar destinatario (solo primeras letras en mayúscula)
    if (!/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]*)*$/.test(addressee)) {
      return message.reply('❌ El destinatario debe empezar con mayúscula y solo contener letras (puede incluir espacios).');
    }

    // Validar longitud del mensaje
    if (letter.length > 300) {
      return message.reply(`❌ Tu mensaje tiene ${letter.length}/300 caracteres.`);
    }

    try {
      // Guardar en tu API
      const res = await api.post('/letters', { addressee, letter });

      // Generar imagen
      const imageBuffer = await createLetterImage(addressee, letter);
      const attachment = new AttachmentBuilder(imageBuffer, { name: 'carta.png' });

      // Crear embed
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