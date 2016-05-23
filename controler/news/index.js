/**
 * Created by Ivan on 17.05.2016.
 */
'use strict';
var express = require('express');
//var jwt = require('jsonwebtoken');
var expresJWT = require('express-jwt');
//var bcrypt = require('bcryptjs');
var fs = require('fs');
//var os = require('os');
var path = require('path');

//var controller = require('./account.controller');

var router = express.Router();

//////app.use(expressJWT({secret:'verySecretWord'}).unless({path:['/addUsername']}))
router.get('/getNews', function(req, res) {
  var db = req.app.get('db');
  console.log('/______--', req.body,req.query.userId);
  db.News.findAll({where: {UserId: req.query.userId}}).then(
    function (result) {
      res.send(result)
    }); //then
});
      ///res.end('hello,world\nkeesun,hi', 'UTF-8');
      //res.status(200).send({qqz:'dada'});
      /*var token= jwt.sign({payload: req.body.email},'verySecretWord');
       res.status(200).send(token);*/
//    })  .catch(error => { // ecmas 6

      /*
       db.News.create({
       title:req.body.title,
       text: req.body.text,
       imgURL: 'http://127.0.0.1:9000/uploads/' + req.body.link,
       UserId: req.body.userId
       })
       .then(function(insertObj){
       res.send(insertObj)
       });
       */


//router.post('/addUsername',expresJWT({secret: 'verySecretWord'}), function(req, res){
router.post('/createNews',expresJWT({secret: 'verySecretWord'}), function(req, res){
    console.log('&&&&&&&&&&&&&', req.body);
  var db = req.app.get('db');

  db.News.create({
    title:req.body.title,
    text: req.body.text,
    imgURL: 'http://127.0.0.1:9000/uploads/' + req.body.link,
    UserId: req.body.userId
  })
    .then(function(insertObj){
      res.send(insertObj)
    });

});

router.post('/createFile', function(req, res){
    console.log('$$$$$$$$$$$$');
  if (req.busboy) {
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
      console.log("Uploading: ",  fieldname, file, filename);
      var saveTo = path.join(__dirname + '/../../uploads', path.basename(filename));
      file.pipe(fs.createWriteStream(saveTo));
      res.send({fileName: filename})
    })
  }

});


module.exports = router;