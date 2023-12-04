const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let data = [];

app.get('/api/data', (req, res) => {
  res.json(data);
});

app.post('/api/data', (req, res) => {
  const newItem = req.body;
  data.push(newItem);
  res.json(newItem);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
