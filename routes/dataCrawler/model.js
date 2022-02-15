const models = require(__basedir +'/models');

class module_model {
    getAllServices = () =>{
        return {"msg": "In model"};
    }
}

module.exports = new module_model();