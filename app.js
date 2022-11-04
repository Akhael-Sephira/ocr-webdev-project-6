const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const config = require('./config')

const authRoute = require('./routes/auth');
const saucesRoute = require('./routes/sauces');
const authorize = require('./middleware/auth');

const app = express();

mongoose.connect(config.db.uri)
.then(() => { console.log('Connection to MongoDB: Successful') })
.catch(() => { console.log('Connection to MongoDB: Failed') });

app.use(cors());

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', authRoute);
app.use('/api/sauces', authorize, saucesRoute);

module.exports = app;