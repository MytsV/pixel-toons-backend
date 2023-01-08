const express = require('express');
const bodyParser = require('body-parser');
const port = 8080;

const app = express();
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, () => {
  console.log(`Started on http://localhost:${port}`);
});
