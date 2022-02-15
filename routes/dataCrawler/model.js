const models = require(__basedir +'/models');
const chalk = require('chalk');
var fs = require('fs');
const {downloadFiles} = require(__basedir+"/middleware/commonFunctions");

class module_model {
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