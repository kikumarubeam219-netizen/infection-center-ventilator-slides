const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const rootDir = __dirname;
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2'
};

function createSlideServer() {
  return http.createServer((req, res) => {
    const reqUrl = (req.url || '/').split('?')[0];
    const relPath = decodeURIComponent(reqUrl === '/' ? '/index.html' : reqUrl).replace(/^\/+/, '');
    const filePath = path.resolve(rootDir, relPath);

    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      if (ext === '.mp4' && req.headers.range) {
        const parts = req.headers.range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stats.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': end - start + 1,
          'Content-Type': contentType
        });
        fs.createReadStream(filePath, { start, end }).pipe(res);
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });
}

if (require.main === module) {
  const port = parseInt(process.env.PORT || '8080', 10);
  const server = createSlideServer();
  server.listen(port, '127.0.0.1', () => {
    const url = `http://127.0.0.1:${port}/index.html`;
    console.log('==================================================');
    console.log(' 感染症センター 人工呼吸器勉強会 発表サーバー起動中');
    console.log(' URL: ' + url);
    console.log(' 発表者ビュー: スライド画面で [S] キーを押してください');
    console.log(' 終了するにはこのウィンドウを閉じてください');
    console.log('==================================================');
    exec(`start "" "${url}"`);
  });
}

module.exports = { createSlideServer };
