var express = require('express');
var router = express.Router();
const models = require('../models');
var Sequelize = require('sequelize');
const moduleModel  =require('./model');
const restaurantModel  =require('./restaurantModel');

router.get('/', async function(req, res) {
    res.render('index',{title: 'Home View', layout: 'layouts/DEFAULT'});
})

router.get('/list-uploaded-data', async function(req, res) {
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
    // let i = 0;
    // while(i < 100){
    // console.log("I am counter",i);
    //     if(i == 50){
    //     setTimeout(() => {
    //     console.log("I am here in timeout", i);
    //     }, 3000);
    // }
    // i++;
    // console.log("I am counter",i);
    // }

    // console.log("Loop ends");

    res.send({msg: "Please check for output in server console"});
})

router.get('/function-chain', function(req,res){

    var strConcatenation = {
        str: '',
      fn: function(newstr = ''){
        if(newstr === ''){
        let concatenatedString = this.str;
        this.str = "";
        return concatenatedString;
        }
        this.str = this.str + newstr + ' ';
        return this;
      }
    }
    
    function fn(str){
        strConcatenation.fn(str);
      return strConcatenation;
    }
    
    console.log(fn("hello").fn("world").fn())
        //Will print: hello world !!!
      
    console.log(fn("This").fn("is").fn("just").fn("a").fn("test").fn())
    //will print This is just a test
    res.send("Please Check Output on Server Console");

});

module.exports = router;
