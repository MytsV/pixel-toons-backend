const express = require('express');
const bodyParser = require('body-parser');
const port = 8080;

const app = express();
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const db = require('./models');

db.mongoose
    .connect(`mongodb://127.0.0.1:27017`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Successfully connect to MongoDB.');
    })
    .catch((err) => {
      console.error('Connection error', err);
      process.exit();
    });

app.use('/api', require('./routes/api.route'));

app.listen(port, () => {
  console.log(`Started on http://localhost:${port}`);
});
