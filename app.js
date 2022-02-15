var http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
let ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');

global.__basedir = __dirname;
const port = 4000;
const app = express();
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine','ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/')

const dataCrawler = require('./routes/dataCrawler/controller');
const defaultRoutes = require('./routes');

app.use('/crawl',dataCrawler);
app.use('/',defaultRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;

    // next(error);
    res.json({"message": "Not found"})
});

http.createServer(app).listen(port,console.log(`Http in ${port}`));