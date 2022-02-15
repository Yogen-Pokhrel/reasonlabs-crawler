const models = require(__basedir +'/models');
var fs = require('fs');
const {downloadFiles} = require(__basedir+"/middleware/commonFunctions");

class module_model {
    uploadFiles = async (allFiles) =>{
        if(allFiles.length > 0){
            let filename = '';
            allFiles.forEach(function(uri){
                if(uri){
                    filename = uri.split('/').pop();
                    if(fs.existsSync(__basedir+'/public/uploads/'+filename)){
                        filename = filename + '_'+ Date.now();
                    }
                    downloadFiles(uri,filename, function(){ console.log("File uploaded successfully!")});
                }
            })
        }
    }
     

}

module.exports = new module_model();