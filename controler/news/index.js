/**
 * Created by Ivan on 17.05.2016.
 */
'use strict';
var express = require('express');
var expresJWT = require('express-jwt');
var fs = require('fs');
var path = require('path');
var router = express.Router();

router.get('/getNews', function(req, res) {
  var db = req.app.get('db');
  db.News.findAll({where: {UserId: req.query.userId}, order: [['updatedAt', 'DESC']]}).then(
    function (result) {
      res.send(result)
    }); //then
});

router.post('/createNews',expresJWT({secret: 'verySecretWord'}), function(req, res){
  var db = req.app.get('db');
  var link;
  if(req.body.link!='')
    {link ='http://127.0.0.1:9000/uploads/' + req.body.link}
    else{link =''}
    db.News.create({
    title:req.body.title,
    text: req.body.text,
    imgURL: link,
    UserId: req.body.userId
  })
    .then(function(insertObj){
      res.send(insertObj)
    });

});

router.post('/createFile', function(req, res){
  if (req.busboy) {
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {

      var saveTo = path.join(__dirname + '/../../uploads', path.basename(filename));
      file.pipe(fs.createWriteStream(saveTo));
      res.send({fileName: filename})
    })
  }

});

router.delete('/removeNews', function(req, res){

  /**/var db = req.app.get('db');
  db.News.findOne({where: {id: req.query.id}}
  ).then(function (user) {

      if(user.imgURL){
        var fileLocation=  path.join(__dirname + '/../../uploads');
        var url=user.imgURL;
        var filename=url.split('/uploads/')[1];
        fs.unlinkSync(fileLocation+'\\'+filename);
      }

      db.News.destroy({where: {id: req.query.id}}
      ).then(function (news) {
          res.status(200).send("News removed success");
        });
    });

});

module.exports = router;