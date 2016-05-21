/**
 * Created by Ivan on 17.05.2016.
 */
'use strict';
var express = require('express');
var jwt = require('jsonwebtoken');
var expresJWT = require('express-jwt');
var app = require('../../app');
//var controller = require('./account.controller');

var router = express.Router();
//app.use(expressJWT({secret:'verySecretWord'}).unless({path:['/addUsername']}))

router.post('/addUsername',expresJWT({secret: 'verySecretWord'}), function(req, res){
    console.log('$$$$$$$$$$$$', req.body, req.query, req.params);

  var db = req.app.get('db');
 /* db.sequelize.sync(*/
  res.send('ну добавили юзера ОК!')
  // в хидерах Authorization bearer
  /*
    db.User.create({
      firstName:'SWentus',
      lastName:'Jonson',
      email:'my21@email.com',
      password: 'ssdsd ds adsadsad a'
      }).then(function(result){
        console.log('^^^^^^^6', result);
        res.send(result)
    })/**/
});
//router.post('/createAccount', controller.createAccount);


router.post('/sigIn', function(req,res){
  if(!req.body.email){
    res.status(400).send('email required')
    return;
  }
  if(!req.body.password){
    res.status(400).send('password required')
    return;
  }
/**/
  var db = req.app.get('db');
  console.log('req.body.password--',req.body.password);
  db.User.findAll({ where: { password: req.body.password, email: req.body.email} }).then(
    function(result) {
      //console.log('email--',result[0].dataValues.email);
      var token= jwt.sign({payload: req.body.email},'verySecretWord');
      res.status(200).send(token);
//    })  .catch(error => { // ecmas 6
    })  .catch(function(error) {
    res.send('Пользователь с такими почтой/паролем  не найден!');
    //console.log(error); // Error: Not Found
});

  ;
    //console.log('____', db.User);
  //});

  //})/**/


});

module.exports = router;