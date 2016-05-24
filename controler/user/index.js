/**
 * Created by Ivan on 17.05.2016.
 */
'use strict';
var express = require('express');
var jwt = require('jsonwebtoken');
var expresJWT = require('express-jwt');
var bcrypt = require('bcryptjs');

var router = express.Router();

router.put('/updateUserProf', function(req, res) {
  var db = req.app.get('db');



 /**/ db.User.findOne({where: {id: req.body.UserId}}
  ).then(function (user) {
    var data;
    if (user) { // user fins
      user.comparePassword(req.body.OldPassword, function (err, isMatch) {
          if (isMatch && !err) {
            //res.send(200, data);
            db.User.update({
              firstName: req.body.FirstName,
              lastName: req.body.LastName,
              password: req.body.NewPassword
              },{where: {id: req.body.UserId}})
              .then(function(result){
                res.status(200).send({lastName: req.body.LastName, firstName: req.body.FirstName});
               });
          }else {
            res.send(400,'Old password wrong');
          }
      })//comparePassword
    }else{res.send(400,'Update fail');}

    })//then
    .catch(function (error) {

      res.status(400).send('Update fail');
    });/**/
})//updateUserProf

router.post('/addUsername', function(req, res){
  var db = req.app.get('db');

  db.User.findOne({where: {email: req.body.Email}}
  ).then(function (user) {
    if (user) {
      return res.status(400).send('This email already used. Please enter another or SignIn.');
    }
  })

    db.User.create({
      firstName: req.body.FirstName,
      lastName:req.body.LastName,
      email:req.body.Email,
      password: req.body.Password
      }).then(function(result){
        res.send(result)
    }).catch(function(error){
      res.status(400).send('Your email is incorrect. Please use format username@mail.com')
    })

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

})//sigIn;

module.exports = router;