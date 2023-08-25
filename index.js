const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const EventEmitter = require('events');
const fs = require('fs');

const event = new EventEmitter();
event.on('iamcalled', () => {
  console.log(' About page was called');
});
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('pages/index.html'));
});
app.get('/read-data', (req, res) => {
  const dataStream = fs.createReadStream(
    path.resolve(__dirname, 'data', 'document.txt')
  );
  dataStream.pipe(res);
});
app.get('/send-data', (req, res) => {
  res.sendFile(path.resolve('pages/form.html'));
});
app.post('/send-data', (req, res) => {
  let chunk = ' ';
  req.on('data', (a) => {
    chunk += a.toString();
  });
  req.on('end', () => {
    console.log(chunk);
  });
  res.send('thanks for submitting data');
  res.end();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
