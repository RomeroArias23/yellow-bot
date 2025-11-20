const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Función para convertir archivo a Base64
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
  // 1. Rutas de archivos (Asegúrate que las fuentes estén en utils/fonts/)
  const htmlPath = path.join(__dirname, 'template.html');
  const bgPath = path.join(__dirname, 'yellow-texture.jpg'); // Misma carpeta
  const fontRegPath = path.join(__dirname, 'fonts/JetBrainsMono-Regular.ttf');
  const fontBoldPath = path.join(__dirname, 'fonts/JetBrainsMono-Bold.ttf');

  // 2. Leer HTML base
  let html = fs.readFileSync(htmlPath, 'utf8');

  // 3. Cargar recursos en Base64 (Para evitar errores de carga local)
  try {
    const bgBase64 = getBase64(bgPath);
    const fontRegBase64 = getBase64(fontRegPath);
    const fontBoldBase64 = getBase64(fontBoldPath);

    // 4. Reemplazos en el HTML
    html = html
      .replace('{{BG_IMAGE}}', bgBase64)
      .replace('{{FONT_REGULAR}}', fontRegBase64)
      .replace('{{FONT_BOLD}}', fontBoldBase64)
      .replace('{{LETTER}}', escapeHtml(letter))
      .replace('{{DATE}}', new Date().toLocaleDateString('es-MX'))
      .replace('{{ADDRESSEE}}', escapeHtml(addressee));

  } catch (error) {
    console.error("❌ Error leyendo archivos de recursos:", error);
    throw new Error("Faltan archivos de fuente o imagen de fondo.");
  }

  // 5. Configurar Puppeteer
  const browser = await puppeteer.launch({
    headless: "new",
    // args vitales para entornos Docker/Railway con poca memoria
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // Importante para evitar crashes de memoria compartida
      '--disable-gpu',
      '--font-render-hinting=none' // Mejora renderizado de texto
    ]
  });

  const page = await browser.newPage();

  // Ajustar viewport al tamaño deseado de la imagen
  await page.setViewport({
    width: 1080,
    height: 1350, // Altura inicial, pero haremos screenshot del elemento
    deviceScaleFactor: 1,
  });

  // Cargar el HTML compilado
  await page.setContent(html, {
    waitUntil: 'networkidle0' // Espera a que no haya conexiones de red (seguridad extra)
  });

  // Esperar selector
  await page.waitForSelector('#card');

  // Seleccionar el elemento
  const element = await page.$('#card');
  
  // Tomar captura (omitBackground: true ayuda si hay transparencia, false si es jpg)
  const image = await element.screenshot({ type: 'png' });

  await browser.close();
  return image;
}

module.exports = createLetterImage;