const http = require('http');

// Try POST to shutdown actuator endpoint
const options = {
  hostname: '127.0.0.1',
  port: 48080,
  path: '/actuator/shutdown',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
};

const req = http.request(options, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', d));
});
req.on('error', e => console.error(e.message));
req.write('{}');
req.end();
