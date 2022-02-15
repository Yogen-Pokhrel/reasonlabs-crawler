const axios = require('axios');
var fs = require('fs');

const prepareArrayFromObject = (data) => {
    let parsedData = [], str = '';
    
    if(typeof data == "string"){
        return [data];
    }

    data.forEach(function(ele){
        str = '';
        if(typeof ele === "string"){
            parsedData.push(ele);
        }else{
            str = extractStringFromObject(ele);
            parsedData.push(str);
        }
    })
    return parsedData;
}

const extractStringFromObject = (data) => {

    if(data == null){
        return '';
    }

    if(typeof data == "string"){
        return data;
    }
    return extractStringFromObject(Object.values(data)[0]);
}

 const downloadFiles = function(uri, filename, callback){

    axios({
        method: 'get',
        url: uri,
        responseType: 'stream',
    }).then(response => {

        return new Promise((resolve, reject) => {

            var writer = fs.createWriteStream(__basedir+'/public/uploads/'+filename);

            response.data.pipe(writer);
            let error = null;
            writer.on('error', err => {
              error = err;
              writer.close();
              reject(err);
            });
            writer.on('close', () => {
              if (!error) {
                callback(filename);
                resolve(true);
              }
              //no need to call the reject here, as it will have been called in the
              //'error' stream;
            });
        })



    }).catch(err => {
        console.log(err)
    })
  };


module.exports = {
    prepareArrayFromObject : prepareArrayFromObject,
    extractStringFromObject: extractStringFromObject,
    downloadFiles: downloadFiles
}

// module.export = {prepareArrayFromObject}