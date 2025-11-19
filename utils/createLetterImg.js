const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');

async function createLetterImage(addressee, letter) {
  const width = 1080;
  const height = 1350;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fondo suave tipo { YELLOW }
  ctx.fillStyle = '#FFF9C4';
  ctx.fillRect(0, 0, width, height);

  // Marco
  ctx.strokeStyle = '#F5CD00';
  ctx.lineWidth = 18;
  ctx.strokeRect(35, 35, width - 70, height - 70);

  // Título
  ctx.fillStyle = '#000';
  ctx.font = '700 64px Sans-serif';
  ctx.fillText(`Para: ${addressee}`, 80, 170);

  // Texto del mensaje
  ctx.font = '400 44px Sans-serif';

  const maxWidth = width - 160;
  const lineHeight = 58;

  const lines = [];
  const words = letter.replace(/\n/g, ' \n ').split(/\s+/);
  let line = '';

  for (const word of words) {
    if (word === '\n') {
      lines.push(line);
      line = '';
      continue;
    }
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth) {
      lines.push(line);
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);

  // Renderizar líneas
  let y = 260;
  for (const l of lines) {
    ctx.fillText(l.trim(), 80, y);
    y += lineHeight;
  }

  // Firma
  ctx.font = '700 48px Sans-serif';
  ctx.fillText('💛 { YELLOW }', 80, height - 120);

  return canvas.toBuffer('image/png');
}

module.exports = createLetterImage;