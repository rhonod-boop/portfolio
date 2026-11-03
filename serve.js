/* Tiny static server for local preview — serves the project folder,
   including audio/ and byte-range requests so the mp3 can seek.
   Run: node serve.js 8123 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const port = Number(process.argv[2] || 8123);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/' || p === '') p = '/index.html';
  const file = path.join(root, p);

  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }

  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('not found');
      return;
    }

    const base = {
      'content-type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'accept-ranges': 'bytes',
      'cache-control': 'no-store'
    };

    const range = req.headers.range;
    if (range && /^bytes=/.test(range)) {
      const m = range.match(/bytes=(\d*)-(\d*)/);
      const start = Number(m[1] || 0);
      const end = m[2] ? Number(m[2]) : st.size - 1;
      res.writeHead(206, {
        ...base,
        'content-length': end - start + 1,
        'content-range': 'bytes ' + start + '-' + end + '/' + st.size
      });
      fs.createReadStream(file, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, { ...base, 'content-length': st.size });
    if (req.method === 'HEAD') { res.end(); return; }
    fs.createReadStream(file).pipe(res);
  });
}).listen(port, '127.0.0.1', () => {
  fs.writeFileSync('.serve.pid', String(process.pid));
  console.log('serving ' + root + ' at http://127.0.0.1:' + port);
});
