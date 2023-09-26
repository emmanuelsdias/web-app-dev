const express = require('express');
const app = express();
const path = require('path');

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up static file serving
app.use("/public", express.static(__dirname + "/public"));
app.use("/uploads", express.static(__dirname + "/uploads"));

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
const galleryRoutes = require('./routes/gallery');
const creationRoutes = require('./routes/creation');

app.use('/creation', creationRoutes);
app.use('/gallery', galleryRoutes);

module.exports = app