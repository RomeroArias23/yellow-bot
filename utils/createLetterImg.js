const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');

async function createLetterImage(addressee, letter, date) {
  const width = 1080;
  const height = 1350;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Cargar textura de fondo
  const texturePath = path.join(__dirname, 'yellow-texture.jpg');
  const texture = await loadImage(texturePath);
  ctx.drawImage(texture, 0, 0, width, height);

  // CONFIG TEXTO
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';

  // 2. Título
  ctx.font = 'bold 55px Sans-serif';
  ctx.fillText('el mensaje que nunca envié:', 80, 160);

  // 3. Mensaje multiline
  ctx.font = '45px Sans-serif';

  const maxWidth = width - 160;
  const lineHeight = 60;
  const words = letter.split(' ');
  let line = '';
  let y = 260;

  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxWidth) {
      ctx.fillText(line, 80, y);
      line = word + ' ';
      y += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, 80, y);

  // 4. Fecha en esquina inferior derecha
  ctx.font = 'italic 40px Sans-serif';
  ctx.fillText(`fecha: ${date}`, width - 350, height - 120);

  // 5. Watermark tipo código (abajo centrado)
  ctx.font = '20px Monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.textAlign = 'center';
  ctx.fillText(`import "YELLOW" from './CVLTVRE'`, width / 2, height - 60);

  return canvas.toBuffer('image/png');
}

module.exports = createLetterImage;
