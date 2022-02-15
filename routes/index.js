var express = require('express');
var router = express.Router();
const models = require('../models');
var Sequelize = require('sequelize');
const moduleModel  =require('./model');
const restaurantModel  =require('./restaurantModel');

router.get('/', async function(req, res) {
    res.render('home',{title: 'Home View', layout: 'layouts/DEFAULT'});
})

router.post('/fetchUploadedData', async function(req, res) {
    // res.render('home',{title: 'Home View', layout: 'layouts/DEFAULT'});

    let data = await moduleModel.getAllData(req);

    // $output = array(
    //     "draw" => $_POST['draw'],
    //     "recordsTotal" => $this->model->countAll(),
    //     "recordsFiltered" => $this->model->countFiltered($_POST),
    //     "data" => $data,
    // );
    data = data.data;

    let tableData = [], rowData = {};
    data.rows.forEach(function(ele){
        rowData = [
            ele.id,
            ele.fileName,
            ele.isDeleted,
            ele.isPublished,
            ele.createdAt
        ]
        tableData.push(rowData);
    })

    let responseData = {
        "draw" : req.body.draw,
        "recordsTotal" : data.count,
        "recordsFiltered" : data.count,
        "data" : tableData,
    }
    res.send(responseData);
    
})


router.get('/restaurant',async function(req,res) {
    // let newOrder = { name: "David", status : 0};
    // restaurantModel.orders.push(newOrder);
    restaurantModel.handleOrder();
    res.send({data: "This is a restaurant"});
})

module.exports = router;
