import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { spawn } from 'child_process';
import { createRequire } from 'module';
import puppeteer from 'puppeteer-core';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

const require = createRequire(import.meta.url);
const ffmpegPath = require('ffmpeg-static');
process.env.PATH = `${path.dirname(ffmpegPath)}${path.delimiter}${process.env.PATH || ''}`;
const { createSlideServer } = require('./server.js');

const rootDir = process.cwd();
const buildDir = path.join(rootDir, '_video_build');
const audioDir = path.join(buildDir, 'audio');
const rawDir = path.join(buildDir, 'raw');
const clipDir = path.join(buildDir, 'clips');
const outVideo = path.join(rootDir, '感染症センター_人工呼吸器勉強会_動画.mp4');

// コマンドライン引数の解析
const args = process.argv.slice(2);
function getArg(name, defaultVal = null) {
  const idx = args.indexOf(name);
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
  return defaultVal;
}
const hasFlag = (name) => args.includes(name);

const limitCount = getArg('--limit') ? parseInt(getArg('--limit'), 10) : null;
const targetSlidesArg = getArg('--slides')
  ? getArg('--slides').split(',').map((s) => parseInt(s.trim(), 10) - 1).filter((n) => !Number.isNaN(n))
  : null;
const voiceArg = (getArg('--voice', 'keita') || 'keita').toLowerCase();
const voiceName = voiceArg === 'nanami' ? 'ja-JP-NanamiNeural' : 'ja-JP-KeitaNeural';
const speechRate = getArg('--rate', '+5%');
const forceTts = hasFlag('--force-tts');

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

// スピーカーノートHTMLから読み上げ用の自然な日本語テキストを抽出・整形
function cleanNoteForSpeech(rawHtml) {
  if (!rawHtml) return '';
  let text = rawHtml
    // <strong>【スライド1：...】</strong> などの見出しタグごと除去
    .replace(/<strong>[\s\S]*?<\/strong>/gi, ' ')
    // その他のHTMLタグを改行/スペースに置換
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    // HTMLエンティティ復元
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    // 【...】形式の残存見出しを除去
    .replace(/【[^】]*】/g, ' ')
    // ト書き（クリック）などを除去
    .replace(/[（(](?:クリック|想定[^）)]*|原本[^）)]*)[）)]/g, '')
    // 鍵カッコを自然な間（読点・空白）に整理
    .replace(/[「」『』]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // 医学略語・英語の読み間違い防止辞書
  const pronunciations = [
    [/\bA\/C\b/gi, 'アシストコントロール'],
    [/\bVCV\b/gi, 'ブイシーブイ'],
    [/\bPCV\b/gi, 'ピーシーブイ'],
    [/\bCPAP\b/gi, 'シーパップ'],
    [/\bSIMV\b/gi, 'エスアイエムブイ'],
    [/\bPSV\b/gi, 'ピーエスブイ'],
    [/\bAPRV\b/gi, 'エーピーアールブイ'],
    [/\bPEEP\b/gi, 'ピープ'],
    [/\bAuto-?PEEP\b/gi, 'オートピープ'],
    [/\bFiO2\b/gi, 'エフアイオーツー'],
    [/\bSpO2\b/gi, 'エスピーオーツー'],
    [/\bPaO2\b/gi, 'ピーエーオーツー'],
    [/\bPaCO2\b/gi, 'ピーエーシーオーツー'],
    [/\bEtCO2\b/gi, 'イーティーシーオーツー'],
    [/\bHCO3-/gi, 'エイチシーオースリーマイナス'],
    [/\bP\/F比\b/gi, 'ピーエフひ'],
    [/\bI:E比\b/gi, 'アイイーひ'],
    [/\bARDS\b/gi, 'エーアールディーエス'],
    [/\bCOPD\b/gi, 'シーオーピーディー'],
    [/\bVALI\b/gi, 'バリ'],
    [/\bVILI\b/gi, 'ビリ'],
    [/\bPBW\b/gi, 'ピービーダブリュー'],
    [/\bRSBI?\b/gi, 'アールエスビー'],
    [/\bSVC\b/gi, '上大静脈'],
    [/\bIVC\b/gi, '下大静脈'],
    [/\bDOPE\b/gi, 'ドープ'],
    [/\bCMV\b/gi, 'シーエムブイ'],
    [/\bAV\b/gi, 'エーブイ'],
    [/\bVT\b/g, 'ブイティー'],
    [/\bMV\b/g, 'エムブイ'],
    [/\bRR\b/g, 'アールアール'],
    [/\bCE\b/g, 'シーイー'],
    [/\bpH\b/g, 'ペーハー'],
    [/cmH2O/gi, 'センチメートル水柱'],
    [/mmHg/gi, 'ミリメートル水銀柱'],
    [/mL\/kg/gi, 'ミリリットルパーキログラム']
  ];

  for (const [pattern, replacement] of pronunciations) {
    text = text.replace(pattern, replacement);
  }

  return text;
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function runFfmpeg(ffmpegArgs) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, ffmpegArgs, { windowsHide: true });
    let stderr = '';
    proc.stderr.on('data', (d) => {
      stderr += d.toString();
    });
    proc.on('close', (code) => {
      if (code === 0) resolve(stderr);
      else reject(new Error(`ffmpeg exited with code ${code}\n${stderr.slice(-800)}`));
    });
    proc.on('error', reject);
  });
}

async function getAudioDuration(filePath) {
  return new Promise((resolve) => {
    const proc = spawn(ffmpegPath, ['-i', filePath], { windowsHide: true });
    let stderr = '';
    proc.stderr.on('data', (d) => {
      stderr += d.toString();
    });
    proc.on('close', () => {
      const m = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
      if (m) {
        const sec = parseInt(m[1], 10) * 3600 + parseInt(m[2], 10) * 60 + parseFloat(m[3]);
        resolve(sec);
      } else {
        resolve(3.0);
      }
    });
  });
}

async function generateTtsAudio(text, outMp3Path) {
  const hash = crypto.createHash('md5').update(`${voiceName}|${speechRate}|${text}`).digest('hex');
  const hashPath = `${outMp3Path}.hash`;

  if (!forceTts && fs.existsSync(outMp3Path) && fs.existsSync(hashPath)) {
    if (fs.readFileSync(hashPath, 'utf8').trim() === hash && fs.statSync(outMp3Path).size > 500) {
      return false; // キャッシュヒット
    }
  }

  const tts = new MsEdgeTTS({ connectionTimeoutMs: 15000, synthesisTimeoutMs: 60000 });
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const safeText = escapeXml(text);
  const { audioStream } = tts.toStream(safeText, { rate: speechRate });

  await new Promise((resolve, reject) => {
    const out = fs.createWriteStream(outMp3Path);
    audioStream.on('error', reject);
    out.on('error', reject);
    out.on('finish', resolve);
    audioStream.pipe(out);
  });

  fs.writeFileSync(hashPath, hash, 'utf8');
  return true;
}

async function main() {
  fs.mkdirSync(audioDir, { recursive: true });
  fs.mkdirSync(rawDir, { recursive: true });
  fs.mkdirSync(clipDir, { recursive: true });

  const exePath = findBrowserExecutable();
  const server = createSlideServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}/index.html`;

  console.log('==========================================================');
  console.log(' 🎬 人工呼吸器勉強会スライド → ナレーション付きMP4動画生成');
  console.log(` 音声モデル: ${voiceName} (速度: ${speechRate})`);
  console.log('==========================================================');

  const browser = await puppeteer.launch({
    executablePath: exePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });

  try {
    const page = await browser.newPage();
    page.on('pageerror', (err) => console.error('PageError:', err.message));
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1.5 });
    await page.goto(baseUrl, { waitUntil: 'load', timeout: 60000 });
    await page.waitForFunction(
      () => typeof Reveal !== 'undefined' && typeof Reveal.getTotalSlides === 'function' && Reveal.getTotalSlides() > 0,
      { timeout: 30000 }
    );

    // 録画に不要なUI（ツールバー・操作矢印・ページ番号等）を非表示
    await page.addStyleTag({
      content: `
        .floating-toolbar, .reveal .controls, .reveal .progress, .reveal .slide-number,
        .chapter-jump-bar, .speaker-note-drawer, .part-asset-hint {
          display: none !important;
        }
      `
    });

    const totalSlides = await page.evaluate(() => Reveal.getTotalSlides());
    let indices = Array.from({ length: totalSlides }, (_, i) => i);
    if (targetSlidesArg && targetSlidesArg.length > 0) {
      indices = indices.filter((i) => targetSlidesArg.includes(i));
    } else if (limitCount && limitCount > 0) {
      indices = indices.slice(0, limitCount);
    }

    console.log(`対象スライド数: ${indices.length}枚 / 全${totalSlides}枚\n`);

    const clipPaths = [];

    for (const idx of indices) {
      const slideNum = String(idx + 1).padStart(2, '0');
      const mp3Path = path.join(audioDir, `slide_${slideNum}.mp3`);
      const rawWebmPath = path.join(rawDir, `slide_${slideNum}.webm`);
      const clipMp4Path = path.join(clipDir, `slide_${slideNum}.mp4`);

      // スライドへ移動（fragmentは初期状態）
      await page.evaluate((i) => {
        Reveal.slide(i, 0, -1);
      }, idx);
      await new Promise((r) => setTimeout(r, 350));

      // ノートとfragment数を取得
      const slideInfo = await page.evaluate(() => {
        const cur = Reveal.getCurrentSlide();
        const aside = cur ? cur.querySelector('aside.notes') : null;
        const frags = cur ? cur.querySelectorAll('.fragment') : [];
        // data-fragment-index を考慮したステップ数を算出
        const stepSet = new Set();
        let autoIdx = 0;
        frags.forEach((el) => {
          const attr = el.getAttribute('data-fragment-index');
          if (attr !== null && attr !== '') stepSet.add(attr);
          else {
            stepSet.add(`auto_${autoIdx++}`);
          }
        });
        return {
          rawNote: aside ? aside.innerHTML : '',
          stepCount: stepSet.size
        };
      });

      const speechText = cleanNoteForSpeech(slideInfo.rawNote) || `スライド${idx + 1}です。`;
      process.stdout.write(`[Slide ${slideNum}/${totalSlides}] 音声生成中... `);

      const generated = await generateTtsAudio(speechText, mp3Path);
      const audioDur = await getAudioDuration(mp3Path);
      const prePad = 0.4;
      const postPad = 0.8;
      const totalDur = Number((audioDur + prePad + postPad).toFixed(2));

      console.log(`${generated ? '新規生成' : 'キャッシュ'} (${audioDur.toFixed(1)}秒, ステップ:${slideInfo.stepCount})`);

      // 録画開始
      process.stdout.write(`              画面録画中 (${totalDur.toFixed(1)}秒)... `);
      const recorder = await page.screencast({
        path: rawWebmPath,
        ffmpegPath,
        format: 'webm',
        fps: 24
      });

      // fragmentを音声時間に合わせて等間隔で進める
      const stepCount = slideInfo.stepCount;
      const startTime = Date.now();
      if (stepCount > 0) {
        const activeSpan = Math.max(audioDur - 1.0, 1.0);
        const intervalMs = (activeSpan / (stepCount + 1)) * 1000;
        for (let s = 1; s <= stepCount; s++) {
          const targetElapsed = prePad * 1000 + intervalMs * s;
          const waitMs = targetElapsed - (Date.now() - startTime);
          if (waitMs > 0) await new Promise((r) => setTimeout(r, waitMs));
          await page.evaluate(() => Reveal.next());
        }
      }

      const remainingMs = totalDur * 1000 - (Date.now() - startTime);
      if (remainingMs > 0) {
        await new Promise((r) => setTimeout(r, remainingMs));
      }

      await recorder.stop();
      console.log('完了 -> MP4合成中...');

      // 映像（最後のフレームを延長して尺を完全一致）＋ 音声（前0.4秒・後0.8秒無音）を合成
      await runFfmpeg([
        '-y',
        '-i', rawWebmPath,
        '-i', mp3Path,
        '-filter_complex',
        `[0:v]fps=30,scale=1920:1080:flags=lanczos,tpad=stop_mode=clone:stop_duration=180[v];[1:a]adelay=400|400,apad=pad_dur=0.8[a]`,
        '-map', '[v]',
        '-map', '[a]',
        '-t', String(totalDur),
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '20',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-ar', '44100',
        '-ac', '2',
        clipMp4Path
      ]);

      clipPaths.push(clipMp4Path);
    }

    // 全クリップをロスレス結合
    console.log('\n全スライドを1本のMP4動画に結合しています...');
    const concatListPath = path.join(buildDir, 'concat_list.txt');
    const listContent = clipPaths.map((p) => `file '${p.replace(/\\/g, '/').replace(/'/g, "'\\''")}'`).join('\n');
    fs.writeFileSync(concatListPath, listContent, 'utf8');

    const finalOut = (limitCount || targetSlidesArg)
      ? path.join(rootDir, '感染症センター_人工呼吸器勉強会_動画_テスト.mp4')
      : outVideo;

    await runFfmpeg([
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', concatListPath,
      '-c', 'copy',
      '-movflags', '+faststart',
      finalOut
    ]);

    const finalSec = await getAudioDuration(finalOut);
    const min = Math.floor(finalSec / 60);
    const sec = Math.round(finalSec % 60);
    console.log('\n==========================================================');
    console.log(` ✅ 動画書き出し完了！`);
    console.log(` 出力先: ${finalOut}`);
    console.log(` 再生時間: ${min}分${String(sec).padStart(2, '0')}秒`);
    console.log('==========================================================');
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error('❌ 動画書き出しエラー:', err);
  process.exit(1);
});
