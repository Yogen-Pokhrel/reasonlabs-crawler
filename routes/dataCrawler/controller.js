const express = require('express');
const router = express.Router();
var CronJob = require('cron').CronJob;
const moduleModel  =require('./model');

router.get('/',async (req,res) => {

    let apiData = await moduleModel.fetchDataFromAPI();
    res.send({msg: "API Data", data: apiData.parsedData, apiData: (apiData.apiData) ? apiData.apiData.data : '' });
   
  })

  var job = new CronJob('*/5 * * * *', function() {
    moduleModel.fetchDataFromAPI();
  }, null, true, 'Asia/Dubai');
  job.start();

module.exports = router;