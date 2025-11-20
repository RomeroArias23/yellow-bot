const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

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

  let html = fs.readFileSync(htmlPath, 'utf8');

  html = html
    .replace('{{LETTER}}', escapeHtml(letter))
    .replace('{{DATE}}', new Date().toLocaleDateString('es-MX'))
    .replace('{{ADDRESSEE}}', escapeHtml(addressee));

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: puppeteer.executablePath(),  // ← necesario en Railway
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--single-process',
      '--disable-dev-tools'
    ]
  });

  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: ['domcontentloaded', 'networkidle0']
  });

  await page.waitForSelector('#card');

  const element = await page.$('#card');
  const image = await element.screenshot({ type: 'png' });

  await browser.close();
  return image;
}

module.exports = createLetterImage;