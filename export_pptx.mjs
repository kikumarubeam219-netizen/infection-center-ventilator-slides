import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import puppeteer from 'puppeteer-core';
import PptxGenJS from 'pptxgenjs';

const require = createRequire(import.meta.url);
const { createSlideServer } = require('./server.js');

const rootDir = process.cwd();
const outPptx = path.join(rootDir, '感染症センター_人工呼吸器勉強会_スライド.pptx');

function findBrowserExecutable() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('Microsoft Edge または Google Chrome が見つかりませんでした。');
}

async function main() {
  const exePath = findBrowserExecutable();
  const server = createSlideServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}/index.html`;

  console.log('ブラウザを起動して全42スライドをPPTX化しています...');
  const browser = await puppeteer.launch({
    executablePath: exePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    page.on('pageerror', (err) => console.error('PageError:', err.message));
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1.5 });
    await page.goto(baseUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForFunction(() => typeof Reveal !== 'undefined' && typeof Reveal.getTotalSlides === 'function' && Reveal.getTotalSlides() > 0, { timeout: 30000 });

    // ツールバー・コントロール・プログレスバー等を非表示にしてスライド本体のみ撮影
    await page.addStyleTag({
      content: `
        .floating-toolbar, .reveal .controls, .reveal .progress, .chapter-jump-bar, .speaker-note-drawer {
          display: none !important;
        }
        .reveal .slides section .fragment {
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
        }
      `
    });

    const totalSlides = await page.evaluate(() => Reveal.getTotalSlides());
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 inches (16:9)
    pptx.title = '感染症センター 人工呼吸器勉強会';

    for (let i = 0; i < totalSlides; i++) {
      await page.evaluate((idx) => {
        Reveal.slide(idx, 0, 999);
      }, i);
      await new Promise((r) => setTimeout(r, 350));

      const noteText = await page.evaluate(() => {
        const cur = Reveal.getCurrentSlide();
        const aside = cur ? cur.querySelector('aside.notes') : null;
        return aside ? aside.innerText.trim() : '';
      });

      const imgBuf = await page.screenshot({ type: 'png' });
      const b64 = 'data:image/png;base64,' + imgBuf.toString('base64');

      const slide = pptx.addSlide();
      slide.addImage({ data: b64, x: 0, y: 0, w: '100%', h: '100%' });
      if (noteText) {
        slide.addNotes(noteText);
      }
      process.stdout.write(`\r進捗: ${i + 1} / ${totalSlides} 枚完了`);
    }

    console.log('\nPPTXファイルを保存しています...');
    await pptx.writeFile({ fileName: outPptx });
    console.log('完了しました！出力先:', outPptx);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error('PPTX書き出しエラー:', err);
  process.exit(1);
});
