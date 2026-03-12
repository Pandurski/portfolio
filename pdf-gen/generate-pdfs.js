const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, 'templates');
const OUTPUT_DIR = path.join(__dirname, '..', 'files');
const IMG_DIR = path.join(__dirname, '..', 'img');

async function generatePDFs() {
  // Read headshot and convert to base64 data URI
  const headshot = fs.readFileSync(path.join(IMG_DIR, 'igor.png'));
  const photoDataUri = `data:image/png;base64,${headshot.toString('base64')}`;

  const browser = await puppeteer.launch({ headless: true });

  try {
    // ---- Career Journey (2 pages, letter) ----
    console.log('Generating career-journey.pdf ...');
    const careerHTML = fs.readFileSync(
      path.join(TEMPLATES_DIR, 'career-journey.html'),
      'utf-8'
    );

    const careerPage = await browser.newPage();
    await careerPage.setContent(careerHTML, { waitUntil: 'networkidle0' });
    await careerPage.pdf({
      path: path.join(OUTPUT_DIR, 'career-journey.pdf'),
      format: 'Letter',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    await careerPage.close();
    console.log('  -> career-journey.pdf created');

    // ---- One-Pager (1 page, letter) ----
    console.log('Generating Igor-Pandurski-1-pager.pdf ...');
    let onePagerHTML = fs.readFileSync(
      path.join(TEMPLATES_DIR, 'one-pager.html'),
      'utf-8'
    );
    onePagerHTML = onePagerHTML.replace('{{PHOTO_DATA_URI}}', photoDataUri);

    const onePagerPage = await browser.newPage();
    await onePagerPage.setContent(onePagerHTML, { waitUntil: 'networkidle0' });
    await onePagerPage.pdf({
      path: path.join(OUTPUT_DIR, 'Igor-Pandurski-1-pager.pdf'),
      format: 'Letter',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    await onePagerPage.close();
    console.log('  -> Igor-Pandurski-1-pager.pdf created');

    console.log('\nDone! Both PDFs generated in files/');
  } finally {
    await browser.close();
  }
}

generatePDFs().catch((err) => {
  console.error('PDF generation failed:', err);
  process.exit(1);
});
