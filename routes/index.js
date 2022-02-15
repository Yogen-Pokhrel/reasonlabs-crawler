var express = require('express');
var router = express.Router();
const models = require('../models');
var Sequelize = require('sequelize');


router.get('/', async function(req, res) {
    res.render('home',{title: 'Home View', layout: 'layouts/DEFAULT'});
})

module.exports = router;
