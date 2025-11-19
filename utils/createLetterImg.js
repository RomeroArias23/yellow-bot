const { createCanvas, loadImage } = require('canvas');
const path = require('path');

async function createLetterImage(addressee, letter) {
  const width = 1080;
  const height = 1350;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fondo color tipo { YELLOW }
  ctx.fillStyle = '#FFF9C4';
  ctx.fillRect(0, 0, width, height);

  // Marco
  ctx.strokeStyle = '#F5CD00';
  ctx.lineWidth = 15;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Título
  ctx.fillStyle = '#000';
  ctx.font = 'bold 60px Sans-serif';
  ctx.fillText(`Para: ${addressee}`, 80, 170);

  // Mensaje (multiline)
  ctx.font = '40px Sans-serif';
  const words = letter.split(' ');
  let line = '';
  let y = 250;

  for (const word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > width - 160) {
      ctx.fillText(line, 80, y);
      line = word + ' ';
      y += 60;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 80, y);

  // Firma
  ctx.font = 'bold 45px Sans-serif';
  ctx.fillText('💛 { YELLOW }', 80, height - 120);

  return canvas.toBuffer('image/png');
}

module.exports = createLetterImage;
