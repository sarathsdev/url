const express = require('express');
const http = require('http');
const https = require('https');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/ping', (req, res) => {
  const { url } = req.body;
  const start = Date.now();

  const protocol = url.startsWith('https') ? https : http;
  protocol.get(url, (response) => {
    const responseTime = Date.now() - start;

    res.json({
      url,
      status: response.statusCode === 200 || 302 ? 'UP' : 'DOWN',
      responseTime: `${responseTime} ms`,
      lastRefreshedTime: new Date().toLocaleString(),
    });
  }).on('error', (error) => {
    res.json({
      url,
      status: 'DOWN',
      responseTime: 'N/A',
      lastRefreshedTime: new Date().toLocaleString(),
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
