const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(process.cwd() + '/views'));

app.get('/new/:url', (req, res) => {
  res.json({
    original_url: '',
    short_url: ''
  });
});

app.listen(process.env.PORT, () => {
  console.log('Node.js listening ...');
});

