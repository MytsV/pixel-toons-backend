const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const db = require('./models');

// TODO: move and error handling
db.mongoose.connect(process.env.DB_URL);

app.use('/api', require('./routes/api.route'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Started on http://localhost:${PORT}`);
});
