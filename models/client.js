'use strict';
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    name: DataTypes.STRING,
    firstname: DataTypes.STRING,
    email: DataTypes.STRING,
    contact: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {});
  Client.associate = function(models) {
    // associations can be defined here
    Client.belongsTo(models.Entreprise, {
      foreignKey: {
        allowNull: false
      }
    })
  };
  return Client;
};