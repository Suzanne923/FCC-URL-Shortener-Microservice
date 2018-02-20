const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const app = express();
//shortened_urls

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(process.cwd() + '/views'));

function handleUrl(url) {
  return {
    original_url: '',
    short_url: ''
  }
}

app.get('/new', (req, res) => {
  res.send("Error: You need to add a proper url");
});
app.get('/new/:url', (req, res) => {
  res.json(handleUrl(req.params.query));
});

app.listen(process.env.PORT, () => {
  console.log('Node.js listening ...');
});

const mongoUrl = process.env.MONGOLAB_URI;
mongo.connect(

