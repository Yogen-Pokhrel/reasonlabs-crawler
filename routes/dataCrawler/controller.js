const express = require('express');
const router = express.Router();
const moduleModel  =require('./model');
const axios = require('axios');
const {prepareArrayFromObject} = require(__basedir+"/middleware/commonFunctions");

router.get('/',async (req,res) => {

    let parsedData = [];
    let apiData;
    try{
        apiData = await axios({
            method: 'get',
            url: 'https://cfrkftig71.execute-api.us-east-1.amazonaws.com/prod?expert=true',
        })
        parsedData = prepareArrayFromObject(apiData.data);
    }catch(err){
        console.log("error on data crawler controller");
    }

    //No need to wait for the execution.
    moduleModel.uploadFiles(parsedData);

    res.send({msg: "API Data", data: parsedData, apiData: (apiData) ? apiData.data : '' });
   
  })

  router.get('/fetch-data',async (req,res) => {

    let filename = uri.split('/').pop();
    download("https://cdn.reasonsecurity.com/exam-public-file/kiPUbWJY",filename, function(){ console.log("I am uploaded")});
    res.send({msg: "I am fetching data"});
   
  })

module.exports = router;