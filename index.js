const express = require('express');
const { Readable } = require('stream');
const app = express();
const port = 3000;
const path = require('path');
const EventEmitter = require('events');
const fs = require('fs');

// Usecase of event emitter
const event = new EventEmitter();
event.on('iamcalled', () => {
  console.log(' streaming document.txt from data ');
});

// To view the static Items
app.use(express.static('static'));

// To read  the data from  file that was present in serever ;
app.get('/', (req, res) => {
  res.sendFile(path.resolve('pages/index.html'));
});
app.get('/read-data', (req, res) => {
  event.emit('iamcalled');

  const dataStream = fs.createReadStream(
    path.resolve(__dirname, 'data', 'document.txt')
  );
  // ---------------------------------------------->>>>>>>If let the sytem handle the stream then we can use pipe()

  // dataStream.pipe(res);

  //----------------------------------------------->>>>>>If we manually want to handle the stream
  dataStream.on('data', (chunk) => {
    // Here we can manipulate the chunk of data if needed before writing it to the response.

    // For example, we could convert the chunk to uppercase:
    const modifiedChunk = chunk.toString().toUpperCase();

    // Write the modified chunk to the response
    res.write(modifiedChunk);
  });

  dataStream.on('end', () => {
    // All data has been read, close the response
    res.end();
  });

  dataStream.on('error', (err) => {
    // Handle errors, e.g., file not found
    console.error('Error reading file:', err);

    res.statusCode = 500;
    res.end('Internal Server Error');
  });
});

// To received the data in stream from user
app.get('/send-data', (req, res) => {
  res.sendFile(path.resolve('pages/form.html'));
});

app.post('/send-data', (req, res) => {
  let chunk = ' ';

  req.on('data', (a) => {
    chunk += a.toString();
  });

  req.on('end', () => {
    const decodedData = decodeURIComponent(chunk.replace(/\+/g, ' '));
    console.log(decodedData);
    res.json({ Message: ' Thanks for Submitting ' });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
