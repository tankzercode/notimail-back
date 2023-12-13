var Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://root:root@localhost:3305/notimail') // Example for postgres

//on exporte pour utiliser notre connexion depuis les autre fichiers.
module.exports = { sequelize };
