const express = require('express');
const router = express.Router();
const moduleModel  =require('./model');
const axios = require('axios');

router.get('/',async (req,res) => {

    // var response = await moduleModel.getAllServices(req);
    // res.send(response);
    const apiData = await axios({
        method: 'get',
        url: 'https://cfrkftig71.execute-api.us-east-1.amazonaws.com/prod?expert=true',
      })

      res.send({msg: "API Data", data: apiData.data});
   
  })

  router.get('/fetch-data',async (req,res) => {

    var response = await moduleModel.getAllServices(req);
    res.send({msg: "I am fetching data"});
   
  })

module.exports = router;