const express = require('express');
const app = express();
const port = 3000;

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

app.use(allowCrossDomain);
app.use(express.static('public'));

app.listen(port, () => console.log(`CapsulaHUB external modules listening on port ${port}!`));
