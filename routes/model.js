const models = require(__basedir +'/models');
const chalk = require('chalk');
var fs = require('fs');
const axios = require('axios');
const {paginate,queryStringBuilder} = require(__basedir+"/middleware/commonFunctions");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class module_model {
    modelName = models.RemoteFiles;
    moduleName = "Default index file";
    moduleErrorPrefix = 'DEFAULT_INDEX_ERR_';
    filters = [];
    getAllData = async (req)=>{
        var response = {};
        var page = req.query.page ? req.query.page : 1;
        page = parseInt(page);
        var pageSize = req.query.limit ? req.query.limit : 25;
        pageSize = parseInt(pageSize);

        var queryCondition = await this.getQueryConditions(req);
        await this.modelName.findAndCountAll(
          paginate(
            { 
              where : {isDeleted : 0, [Op.and]: queryCondition}, 
              attributes: this.attributes
              
            },
            { page, pageSize },
          )).then(obj =>{
            response = {
              type: "success",
              msg : "Data Fetched Successfully",
              data : obj
            };
            var requestUrl = req.baseUrl;
            var queryString = req.query;
            if(page > 1){
              queryString['page'] = page - 1;
              if(queryString['page']*pageSize > obj.count){
                queryString['page'] = parseInt(obj.count/pageSize);
              }
              let previousPage = requestUrl+'/?'+queryStringBuilder(queryString);
              response['prevPage'] = previousPage;
            }
            if((page)*pageSize < obj.count){
              queryString['page'] = page + 1;
              let nextPage = requestUrl+'/?'+queryStringBuilder(queryString);
              response['nextPage'] = nextPage
            }
          }).catch(err => {
          console.log(chalk.red("Catch Error "+this.moduleName+".js 29", err.message));
          response = {
            type: "error",
            code : this.moduleErrorPrefix+'1131',
            msg : "Some Errors while Fetching "+this.moduleName,
            error : err
          };
          })

          return response;

    }

    getQueryConditions = async(req) => {
        var queryString = [];
       for(let filter of this.filters){
         if(req.query[filter.fieldName]){
            if(filter.type == 'like'){
              queryString.push({[filter.field] : {[Op.iLike]: '%'+req.query[filter.fieldName]+'%'}});
            }else{
              queryString.push({[filter.field] : req.query[filter.fieldName]});
            }
           
         }
       }
  
       return queryString;
  
      }
}

module.exports = new module_model();