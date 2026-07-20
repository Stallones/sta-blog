const http = require('http');

function get(port, path) {
  return new Promise(resolve => {
    http.get({ hostname: '127.0.0.1', port, path }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const j = JSON.parse(d);
        console.log(`  /${path.split('?')[0].split('/').pop()} => code:${j.code} msg:${j.msg}`);
        resolve();
      });
    }).on('error', e => { console.error(e.message); resolve(); });
  });
}

(async () => {
  console.log('Port 48082:');
  await get(48082, '/app-api/blog/other/yiyan');
  await get(48082, '/app-api/blog/other/snapshot?key=sta-blog-snapshot-2026');
  await get(48082, '/app-api/blog/article/page?pageNo=1&pageSize=1');
})();
