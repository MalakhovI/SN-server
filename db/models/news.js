/**
 * Created by Ivan on 17.05.2016.
 */
var Sequelize = require('Sequelize');

module.exports = function (sequelize, DataTypes) {
    var News = sequelize.define('News', {
        title: {
            type: Sequelize.STRING
        },
        text: {
            type: Sequelize.TEXT
        },
        imgURL: {
            type: Sequelize.STRING
        }
    }, {
      classMethods: {
        associate: function (models) {
          News.belongsTo(models.User);
        }
      },
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return News;
};

/*
connection.sync(
{force: true},/* - для удаления и создание БД заново */
