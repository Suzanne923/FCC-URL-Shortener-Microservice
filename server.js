const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(process.cwd() + '/views'));

app.listen(process.env.PORT, () => {
  console.log('Node.js listening ...');
});

