const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

function getBase64(filePath) {
  return fs.readFileSync(filePath, { encoding: 'base64' });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");
}

async function createLetterImage(addressee, letter) {
  const htmlPath = path.join(__dirname, 'template.html');
  // Asegúrate de que la imagen se llame igual que en tu carpeta
  const bgPath = path.join(__dirname, 'yellow-texture.jpg'); 
  const fontRegPath = path.join(__dirname, 'fonts/JetBrainsMono-Regular.ttf');
  const fontBoldPath = path.join(__dirname, 'fonts/JetBrainsMono-Bold.ttf');

  let html = fs.readFileSync(htmlPath, 'utf8');

  try {
    const bgBase64 = getBase64(bgPath);
    const fontRegBase64 = getBase64(fontRegPath);
    const fontBoldBase64 = getBase64(fontBoldPath);

    html = html
      .replace('{{BG_IMAGE}}', bgBase64)
      .replace('{{FONT_REGULAR}}', fontRegBase64)
      .replace('{{FONT_BOLD}}', fontBoldBase64)
      .replace('{{LETTER}}', escapeHtml(letter))
      .replace('{{DATE}}', new Date().toLocaleDateString('es-MX'))
      .replace('{{ADDRESSEE}}', escapeHtml(addressee));

  } catch (error) {
    console.error("❌ Error leyendo archivos (revisar ruta fonts o jpg):", error);
    throw error;
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none'
    ]
  });

  const page = await browser.newPage();

  // CONFIGURACIÓN CLAVE PARA IGUALAR TU CSS
  // 1. Viewport igual al tamaño de tu CSS (280x320)
  // 2. deviceScaleFactor: 3 -> Multiplica x3 la resolución (HD)
  await page.setViewport({
    width: 280,
    height: 320,
    deviceScaleFactor: 3 
  });

  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Esperamos al elemento
  const element = await page.waitForSelector('#card');

  // Tomamos la captura
  const image = await element.screenshot({ 
    type: 'png',
    omitBackground: true // Transparente fuera del borde radius si lo hubiera
  });

  await browser.close();
  return image;
}

module.exports = createLetterImage;