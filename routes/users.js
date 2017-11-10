var express = require('express');
var router = express.Router();
router.io = require('socket.io')();
var ticket = require('../model/ticket');
var fs = require('fs');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.io.on('connection', function (socket) {

  

socket.on('prueba', function(data, callback) {
  console.log(data);

  ticket.create(data, function (error, data) {
    if (error) {
      console.log(error);
      callback(error,null);
    } else {
      console.log("DATAAAAAAAAAAAAAAAAAAAAA");
      console.log(data);
      var dir = './public/images/tickets/'+data.insertId;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir,function(err) {
          if (err) {
            console.log(err)
          } else {
            
          }
        });
      }
      
      callback(null,data);
    }
  });

})


  socket.on('getDates', function (callback) {
    category.read2(function (error, category) {
      if (error) {
      } else {
        brand.read2(function (error, brand) {
          if (error) {
          } else {
            unit.read2(function (error, unit) {
              if (error) {
              } else {
                callback(category, brand, unit);
              }
            })
          }
        });
      }
    });
  });


  socket.on('disconnect', function () {

  });
});


module.exports = router;
