const http = require('http');

const data = JSON.stringify({
  completed: [],
  profile: {name: "test"},
  streak: 5,
  completedToday: true
});

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/user/12345',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', d => process.stdout.write(d));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
