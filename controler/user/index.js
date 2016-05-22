/**
 * Created by Ivan on 17.05.2016.
 */
'use strict';
var express = require('express');
var jwt = require('jsonwebtoken');
var expresJWT = require('express-jwt');
var bcrypt = require('bcryptjs');

//var controller = require('./account.controller');

var router = express.Router();
//app.use(expressJWT({secret:'verySecretWord'}).unless({path:['/addUsername']}))

//router.post('/addUsername',expresJWT({secret: 'verySecretWord'}), function(req, res){
router.post('/addUsername', function(req, res){
    console.log('$$$$$$$$$$$$', req.body);

  var db = req.app.get('db');
 /* db.sequelize.sync(*/

  // в хидерах Authorization bearer
  /**/
    db.User.create({
      firstName: req.body.FirstName,
      lastName:req.body.LastName,
      email:req.body.Email,
      password: req.body.Password
      }).then(function(result){
        console.log('^^^^^^^6', result);
        res.send(result)
    }).catch(function(error){
      console.log('error - ', error);
      res.send(error)
    })/**/
  //res.send({fsdfsdfsdf :'sну добавили юзера ОК!'})
});
//router.post('/createAccount', controller.createAccount);

router.post('/removeAll',expresJWT({secret: 'verySecretWord'}), function(req, res){
  console.log('//////////', req.body);
  res.send({msg: 'МЫ все удалили!!!'});
});

router.post('/sigIn', function(req,res){
  if(!req.body.email){
    res.status(400).send('email required')
    return;
  }
  if(!req.body.password){
    res.status(400).send('password required')
    return;
  }
  var db = req.app.get('db');
  db.User.findOne({where: {email: req.body.email}}
  ).then(function (user) {
      if (!user) {
        return res.send({err: 'Your email is incorrect. Please try again.'});
      }
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          var token= jwt.sign({payload: req.body.email},'verySecretWord');
          return res.send(200,{token : token, userId: user.id});
          } else {
          return res.send({err: 'Password is incorrect'});
        }
      } //cb
      ) //comparePassword
      }) //then

/*
    db.User.findAll({ where: { password: req.body.password, email: req.body.email} }).then(
    function(result) {
      //console.log('email--',result[0].dataValues.email);
      var token= jwt.sign({payload: req.body.email},'verySecretWord');
      res.status(200).send(token);
//    })  .catch(error => { // ecmas 6
    })  .catch(function(error) {
    res.send('Пользователь с такими почтой/паролем  не найден!');
    //console.log(error); // Error: Not Found
});*/

    //console.log('____', db.User);
  //});

  //})/**/


})//sigIn;

module.exports = router;