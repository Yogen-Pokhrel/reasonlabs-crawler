'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RestaurantLogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RestaurantLogs.init({
    customerName: DataTypes.STRING,
    orderId: DataTypes.STRING,
    message: DataTypes.STRING,
    isPublished: DataTypes.INTEGER,
    isDeleted: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RestaurantLogs',
  });
  return RestaurantLogs;
};