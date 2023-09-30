const express = require('express');
const app = express();
const port = 3001;

const cors = require('cors');

app.use(cors()); 

const cities = require('./cities.json'); 

app.get('/city/:name', (req, res) => {
  const name = req.params.name;
  if (cities[name]) {
    res.json(cities[name]);
  } else {
    res.status(404).send('City not found!');
  }
});

module.exports = app;
