const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sanitize = require('express-mongo-sanitize');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');

const authRoute = require('./routes/auth');
const saucesRoute = require('./routes/sauces');
const authorize = require('./middleware/auth');
const { env } = require('process');

const app = express();

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => { console.log('Connection to MongoDB: Successful') })
.catch(() => { console.log('Connection to MongoDB: Failed') });

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET, POST, PUT, DELETE',
}));

app.use(express.json());

app.use(sanitize({
    replaceWith: '_'
}));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), {flags: 'a'});
app.use(morgan('combined', { stream: accessLogStream }));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', authRoute);
app.use('/api/sauces', authorize, saucesRoute);

module.exports = app;