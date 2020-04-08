'use strict';
module.exports = (sequelize, DataTypes) => {
  const Entreprise = sequelize.define('Entreprise', {
    name: DataTypes.STRING
  }, {});
  Entreprise.associate = function(models) {
    // associations can be defined here
    Entreprise.hasMany(models.Client)
  };
  return Entreprise;
};