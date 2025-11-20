const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');

GlobalFonts.registerFromPath(
  path.join(__dirname, 'fonts/JetBrainsMono-Regular.ttf'),
  'JetBrainsMono'
);

GlobalFonts.registerFromPath(
  path.join(__dirname, 'fonts/JetBrainsMono-Bold.ttf'),
  'JetBrainsMonoBold'
);

async function createLetterImage(addressee, letter) {
  const width = 1080;
  const height = 1350;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // FONDO
  const texture = await loadImage(path.join(__dirname, 'yellow-texture.jpg'));
  ctx.drawImage(texture, 0, 0, width, height);

  // TÍTULO
  ctx.fillStyle = '#ffffff';
  ctx.font = '48px "JetBrainsMonoBold"';
  ctx.fillText('el mensaje que nunca envié:', 60, 120);

  // MENSAJE MULTILÍNEA
  ctx.fillStyle = '#000000';
  ctx.font = '32px "JetBrainsMono"';

  const maxWidth = width - 120;
  const lineHeight = 50;
  const words = letter.split(' ');

  let line = '';
  let y = 200;

  for (const word of words) {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > maxWidth) {
      ctx.fillText(line, 60, y);
      line = word + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 60, y);

  // FECHA
  ctx.font = '26px "JetBrainsMono"';
  ctx.fillText(`fecha: ${new Date().toLocaleDateString('es-MX')}`, 60, height - 100);

  // WATERMARK
  ctx.font = '16px "JetBrainsMono"';
  ctx.fillText(`import "{ YELLOW }" from './CVLTVRE'`, width / 2 - 150, height - 40);

  return canvas.toBuffer('image/png');
}

module.exports = createLetterImage;