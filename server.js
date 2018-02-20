const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const shortid = require('shortid');
const app = express();

const mongoUrl = process.env.MONGOLAB_URI;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(process.cwd() + '/views'));

app.listen(process.env.PORT, () => {
  console.log('Node.js listening ...');
});

function validateUrl(url) {
    const regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
}

function handleUrl(url) {  
  const shortUrl = 'https://mesquite-novel.glitch.me/' + shortid.generate();
  storeUrl(url, shortUrl);
  return {
    original_url: url,
    short_url: shortUrl
  };  
}

function storeUrl(url, shortUrl) {
  mongo.connect(mongoUrl, (err, client) => {
    if (err) {
      console.log("Unable to connect to database", err);
    } else {
      const db = client.db('url_shortener_microservice');
      let urls = db.collection('shortened_urls');
      urls.insert({
        url: url,
        shortUrl: shortUrl
      });
    }
  });
}

const fetchUrl = (req, res) => {
  const url = "https://mesquite-novel.glitch.me/" + req.params.url;
  mongo.connect(mongoUrl, (err, client) => {
    if (err) {
      console.log("Unable to connect to database", err);
    } else {
      const db = client.db('url_shortener_microservice');
      let urls = db.collection('shortened_urls');
      urls.findOne({
        "shortUrl": url
      }, (err, data) => {
        if (err) {
          console.log('error: ', err);
        }
        if (data) { 
          res.redirect(data.url);
        };
      });
    }
  });
}

// routes
app.get('/new', (req, res) => {
  res.send("Error: You need to add a proper url");
});
app.get('/new/:url(*)', (req, res) => {
  const url = req.params.url;
  if (validateUrl(url)) {
    res.json(handleUrl(req.params.url));
  } else {
    res.json({error: "Incorrect url format"});
  }
});
app.get('/:url', fetchUrl);