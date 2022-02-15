'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RemoteFiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RemoteFiles.init({
    fileName: DataTypes.STRING,
    isPublished: DataTypes.INTEGER,
    isDeleted: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RemoteFiles',
  });
  return RemoteFiles;
};