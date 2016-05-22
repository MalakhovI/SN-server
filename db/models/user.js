/**
 * Created by Ivan on 17.05.2016.
 */
var Sequelize = require('Sequelize');
var bcrypt = require('bcryptjs');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        firstName: {
            type: Sequelize.STRING,
            field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
        },
        lastName: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: {
                    args: true,
                    msg: 'Please enter a email address'
                }
            }
        },
        approved: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }

    }, {
        hooks: {
            beforeValidate: function () {
            },

            afterValidate: function (user) {
                if (user.password) {
                    user.password = bcrypt.hashSync(user.password, 8);
                }
            }
        },
      instanceMethods: {
        comparePassword: function (passw, cb) {
          bcrypt.compare(passw, this.password, function (err, isMatch) {
            if (err) {
              return cb(err);
            }
            cb(null, isMatch);
          });
        }
       },
      classMethods: {
        associate: function (models) {
          User.hasMany(models.News);
        }
      },
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return User;
};

/*
connection.sync(
{force: true},/* - для удаления и создание БД заново */
