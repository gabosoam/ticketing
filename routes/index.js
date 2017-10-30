var express = require('express');
var router = express.Router();
var user = require('../model/user');
var ticket = require('../model/ticket');
var client = require('../model/client');
var incidence = require('../model/incidence');


/* GET home page. */
router.get('/', isLoggedIn, function (req, res, next) {
  res.render('index', { user: sess.usuarioDatos, message: 'null' });
});

router.get('/admin', isLoggedInAdmin, function (req, res, next) {
  res.render('admin', { user: sess.adminDatos });
});

/* GET home page. */
router.get('/clients', isLoggedIn, function (req, res, next) {
  res.render('client', { user: sess.usuarioDatos });
});

/* GET home page. */
router.get('/users', isLoggedInAdmin, function (req, res, next) {
  res.render('user', { user: sess.adminDatos });
});

router.get('/tickets/:user', isLoggedIn, function (req, res, next) {
  var userTicket = req.params.user;
  ticket.read(userTicket, function (error, results) {
    if (error) {
      console.log(error);
      res.send(500);
    } else {
      res.send(results);
    }
  })
});

router.get('/ticket/:code', isLoggedIn, function (req, res, next) {
  var code = req.params.code;
  ticket.readOne(code, function (error, results) {
    if (error) {
      console.log(error);
      res.send(500);
    } else {
      res.send(results);
    }
  })
});

router.get('/incidence/:ticket', isLoggedIn, function (req, res, next) {
  var ticket = req.params.ticket;
  incidence.read(ticket, function (error, results) {
    if (error) {
      console.log(error);
      res.send(500);
    } else {
      res.send(results);
    }
  })
});

router.post('/ticket', isLoggedIn, function (req, res, next) {
  console.log('Ya llegué');
  var data = req.body;


  ticket.create(data, function (error, data) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      res.send(data)
    }
  });
});

router.post('/incidence', isLoggedIn, function (req, res, next) {
  var data = req.body;

  incidence.create(data, function (error, data) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      res.send(data)
    }
  });
});

router.get('/client', isLoggedIn, function (req, res, next) {
  client.read(function (error, results) {
    if (error) {
      console.log(error);
      res.send(500);
    } else {
      res.send(results);
    }
  })
});

router.post('/client/update', isLoggedIn, function (req, res, next) {
  var datos = req.body;
  client.update(datos, function (error, datos) {
    if (error) {

      res.sendStatus(500);
    } else {

      if (datos.affectedRows > 0) {
        res.send(true);
      } else {
        res.sendStatus(500);
      }
    }
  })
});

router.post('/pause', isLoggedIn, function (req, res, next) {
  var data = {
    data: req.body,
    user: req.session.usuarioDatos.id
  }
  ticket.pause(data, function (err, results) {
    if (err) {
      res.send(false);
    } else {
      res.send(true);
    }
  })

})

router.post('/quitpause', isLoggedIn, function (req, res, next) {
  var data = {
    data: req.body,
    user: req.session.usuarioDatos.id
  }
  ticket.quitpause(data, function (err, results) {
    if (err) {
      res.send(false);
    } else {
      console.log(results)
      res.send(true);
    }
  })

})

router.post('/client/delete', isLoggedIn, function (req, res, next) {
  var datos = req.body;
  client.delete(datos, function (error, datos) {
    if (error) {

      res.sendStatus(500);
    } else {

      if (datos.affectedRows > 0) {
        res.send(true);
      } else {
        res.sendStatus(500);
      }
    }
  })
})


router.post('/client/create', isLoggedIn, function (req, res, next) {
  var datos = req.body;
  client.create(datos, function (error, datos) {
    if (error) {

      res.status(500).send(error);
    } else {

      if (datos.affectedRows > 0) {
        res.send(true);
      } else {
        res.sendStatus(500);
      }
    }
  })
})




router.get('/user', isLoggedIn, function (req, res, next) {
  user.read(function (error, results) {
    if (error) {
      console.log(error);
      res.send(500);
    } else {
      res.send(results);
    }
  })
});

router.post('/user/update', isLoggedIn, function (req, res, next) {
  var datos = req.body;
  user.update(datos, function (error, datos) {
    if (error) {
      res.sendStatus(500);
    } else {

      if (datos.affectedRows > 0) {
        res.send(true);
      } else {
        res.sendStatus(500);
      }
    }
  })
})

router.post('/user/editPassword', function (req, res, next) {

  var datos = req.body;
  user.updatePass(datos, function (error, datos) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      res.send(datos);

    }
  })
})

router.post('/user/delete', isLoggedInAdmin, function (req, res, next) {
  var datos = req.body;
  user.delete(datos, function (error, datos) {
    if (error) {

      res.sendStatus(500);
    } else {

      if (datos.affectedRows > 0) {
        res.send(true);
      } else {
        res.sendStatus(500);
      }
    }
  })
})


router.post('/user/create', isLoggedInAdmin, function (req, res, next) {
  var datos = req.body;
  user.create(datos, function (error, datos) {
    if (error) {

      res.sendStatus(500);
    } else {

      if (datos.affectedRows > 0) {

        res.send(true);
      } else {
        res.sendStatus(500);
      }
    }
  })
});

router.get('/readadmin', isLoggedInAdmin, function (req, res, next) {
  ticket.readadmin(function (err, data) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.send(data);
    }
  })
})




router.get('/login', function (req, res, next) {
  res.render('login', { message: null });
});

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
    } else {
      res.redirect('/login');
    }
  });
});



router.post('/login', function (req, res, next) {
  var sess = req.session;
  user.login(req.body, function (err, dates) {
    if (err) {
      res.render('login', { message: err })
    } else {

      if (dates.rol == 1) {
        sess.usuarioDatos = dates;
        res.redirect('/');

      } else {
        sess.adminDatos = dates;
        res.redirect('/admin');

      }


    }

  });
});

function isLoggedIn(req, res, next) {
  sess = req.session;
  if (sess.usuarioDatos)
    return next();
  sess.originalUrl = req.originalUrl;
  res.redirect('/login');
}

function isLoggedInAdmin(req, res, next) {
  sess = req.session;
  if (sess.adminDatos)
    return next();
  sess.originalUrl = req.originalUrl;
  res.redirect('/login');
}




module.exports = router;
