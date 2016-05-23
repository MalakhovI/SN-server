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

router.put('/updateUserProf', function(req, res) {
  var db = req.app.get('db');
  console.log("ffffffffffffff__", req.body);


 /**/ db.User.findOne({where: {id: req.body.UserId}}
  ).then(function (user) {
    var data;
    if (user) { // user fins
      user.comparePassword(req.body.OldPassword, function (err, isMatch) {
          if (isMatch && !err) {
            res.send(200, data);
            db.User.update({
              firstName: req.body.FirstName,
              lastName: req.body.LastName,
              password: req.body.NewPassword
              },{where: {id: req.body.UserId}})
              .then(function(result){
              console.log('############', result)
               });
          }else {
            res.send(400,'Old password wrong');
          }
      })//comparePassword
    }else{res.send(400,'Update fail');}

    })//then
    .catch(function (error) {
      console.log('error - ', error);
      res.status(400).send('Upd$$$$$$$ate fail');
    });/**/
})//updateUserProf

//router.post('/addUsername',expresJWT({secret: 'verySecretWord'}), function(req, res){
router.post('/addUsername', function(req, res){
    console.log('$$$$$$$$$$$$', req.body);

  var db = req.app.get('db');

  // в хидерах Authorization bearer

  db.User.findOne({where: {email: req.body.Email}}
  ).then(function (user) {
    if (user) {
      return res.status(400).send('This email already used. Please enter another or SignIn.');
    }
  })//then

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
      res.status(400).send('Your email is incorrect. Please use format username@mail.com')
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
    res.status(400).send('email required');
    return;
  }
  if(!req.body.password){
    res.status(400).send('password required');
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
          return res.send(200,{token : token, userId: user.id, lastName: user.lastName, firstName: user.firstName});
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