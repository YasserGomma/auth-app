const http = require('http');

const req = http.get('http://localhost:5000/auth/health', (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
});

req.on('error', () => process.exit(1));
req.setTimeout(5000, () => {
  req.abort();
  process.exit(1);
});
