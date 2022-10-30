const express = require('express');
const mongoose = require('mongoose');
const config = require('./config')

const app = express();

mongoose.connect(config.db.uri)
.then(() => { console.log('Connection to MongoDB: Successful') })
.catch(() => { console.log('Connection to MongoDB: Failed') });

app.use(express.json());

module.exports = app;