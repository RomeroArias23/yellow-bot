const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function createLetterImage(addressee, letter) {
  // local route to the HTML to be rendered
  const htmlPath = path.join(__dirname, 'template.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Insert dynamic content
  html = html
    .replace('{{LETTER}}', letter)
    .replace('{{DATE}}', new Date().toLocaleDateString('es-MX'))
    .replace('{{ADDRESSEE}}', addressee);

  // launch Chrome Headless
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // launch html (serverless)
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // selects the main content
  const element = await page.$('#card');

  const imageBuffer = await element.screenshot({
    type: 'png'
  });

  await browser.close();
  return imageBuffer;
}

module.exports = createLetterImage;
