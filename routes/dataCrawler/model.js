const models = require(__basedir +'/models');
const chalk = require('chalk');
var fs = require('fs');
const axios = require('axios');
const {prepareArrayFromObject,downloadFiles} = require(__basedir+"/middleware/commonFunctions");

class module_model {

    fetchDataFromAPI = async () => {

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
        //No need to wait for the execution to act like the response is quick. If the user wants to check the files uploaded then we can await for the execution of the function. The logs can also be maintained in some file or in a db.
        this.uploadFiles(parsedData);

        return {parsedData:parsedData, apiData:apiData};
    }

    uploadFiles = async (allFiles) =>{
        if(allFiles.length > 0){
            let filename = '';
            let that = this;
            let filesUploaded = [];
            allFiles.forEach(function(uri){
                if(uri){
                    filename = uri.split('/').pop();
                    if(fs.existsSync(__basedir+'/public/uploads/'+filename)){
                        console.log(chalk.yellow("File already exists creating new file"));
                        filename = filename + '_'+ Date.now();
                    }
                    downloadFiles(uri,filename, function(filename){ that.saveAndSendFileUploaded(filename); });
                    filesUploaded.push(filename);
                }
            })
        }
    }
    
    saveAndSendFileUploaded = async(filename) => {
        console.log("File uploaded successfully!", filename);
        let insertData = {
            fileName:filename,
            isPublished:1, // 1 -> Published, 0 -> Unpublished
            isDeleted:0, // 0 -> Not Deleted, 1 -> Deleted
        }
        models.RemoteFiles.create(insertData).then(obj => {
            // console.log(obj);
        }).catch(err => {
            console.log(err);
        })
    }

}

module.exports = new module_model();