const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');
const fs = require('fs');

const fontRegularPath = path.join(__dirname, 'fonts', 'JetBrainsMono-Regular.ttf');
const fontBoldPath = path.join(__dirname, 'fonts', 'JetBrainsMono-Bold.ttf');

// 2. DIAGNÓSTICO (Para saber si Node ve los archivos)
if (!fs.existsSync(fontRegularPath)) {
    console.error(`⚠️ ERROR: No encuentro el archivo en: ${fontRegularPath}`);
}

// 3. REGISTRO LIMPIO
GlobalFonts.registerFromPath(fontRegularPath, 'JetBrainsMono');
GlobalFonts.registerFromPath(fontBoldPath, 'JetBrainsMonoBold');

async function createLetterImage(addressee, letter) {
  const width = 1080;
  const height = 1350;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // FONDO
  try {
      const texture = await loadImage(path.join(__dirname, 'yellow-texture.jpg'));
      ctx.drawImage(texture, 0, 0, width, height);
  } catch (error) {
      // Fondo de respaldo por si falla la imagen
      ctx.fillStyle = '#FDEA6B';
      ctx.fillRect(0, 0, width, height);
  }

  // TÍTULO
  ctx.fillStyle = '#ffffff';
  // CORRECCIÓN CLAVE: Sin comillas en el nombre de la fuente
  ctx.font = '48px JetBrainsMonoBold'; 
  ctx.fillText('el mensaje que nunca envié:', 60, 120);

  // MENSAJE
  ctx.fillStyle = '#000000';
  // CORRECCIÓN CLAVE: Sin comillas en el nombre de la fuente
  ctx.font = '32px JetBrainsMono'; 

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
  ctx.font = '26px JetBrainsMono';
  ctx.fillText(`fecha: ${new Date().toLocaleDateString('es-MX')}`, 60, height - 100);

  // WATERMARK
  ctx.font = '16px JetBrainsMono';
  // Centramos el texto para que se vea mejor
  ctx.textAlign = 'center';
  ctx.fillText(`import "{ YELLOW }" from './CVLTVRE'`, width / 2, height - 40);

  return canvas.toBuffer('image/png');
}

module.exports = createLetterImage;