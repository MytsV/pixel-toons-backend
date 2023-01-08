const express = require('express');
const bodyParser = require('body-parser');
const {MongoClient} = require("mongodb");
const port = 8080;

const client = new MongoClient("mongodb://127.0.0.1:27017");

const app = express();
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const router = new express.Router();
router.get('/api', async (req, res) => {
  await client.connect();
  const result = await client.db('pixel-toons').collection('users').find({}).toArray();
  res.status(200).send(result);
});

app.use('/', router);

app.listen(port, () => {
  console.log(`Started on http://localhost:${port}`);
});
