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

const paginate = (query, { page, pageSize }) => {
    if(page>0){
      page = page - 1;
    }
    const offset = page*pageSize;
    const limit = pageSize;
  
    return {
      ...query,
      offset,
      limit,
    };
  }

  const queryStringBuilder = (params) => {

        var qs = Object.keys(params).map(function (key) {
        return key + '=' + params[key]
    }).join('&');
    return qs;
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
    downloadFiles: downloadFiles,
    paginate: paginate,
    queryStringBuilder: queryStringBuilder
}

// module.export = {prepareArrayFromObject}