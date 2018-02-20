const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const shortUrl = require('short-url');
const app = express();
//shortened_urls

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(process.cwd() + '/views'));

function validateUrl(url) {
    const regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
}

function handleUrl(url) {  
  shortUrl.shorten(url, (err, data) => {
  console.log(data);
    return {
      original_url: url,
      short_url: data
    }
  }); 
}

app.get('/new', (req, res) => {
  res.send("Error: You need to add a proper url");
});
app.get('/new/:url(*)', (req, res) => {
  const url = req.params.url;
  if (validateUrl(url)) {
    console.log('looks like a valid url');
    res.json(handleUrl(req.params.url));
  } else {
    res.json({error: "Incorrect url format"});
  }
});

app.listen(process.env.PORT, () => {
  console.log('Node.js listening ...');
});

const mongoUrl = process.env.MONGOLAB_URI;
mongo.connect(mongoUrl, (err, db) => {
  if (err) throw err;
  //let urls = db.getCollection('shortened_urls');
  console.log('Connected to MongoDB');
});