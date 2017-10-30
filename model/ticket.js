var connection = require('../config/connection.js');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gabosoam621@gmail.com',
      pass: 'gaso621561'
    }
  });

module.exports = {
    read: function (user, callback) {
        connection.query({
            sql: 'SELECT * FROM v_ticket  ORDER BY id DESC'
        }, function (error, results, fields) {
            if (error) {
                callback(error, null);
            } else {
                callback(null, results)
            }
        });
    },

    readadmin: function (callback) {
        connection.query({
            sql: 'SELECT * FROM v_time WHERE statename=\'FINALIZADO\' ORDER BY open DESC'
        }, function (error, results, fields) {
            if (error) {
                callback(error, null);
            } else {
                callback(null, results)
            }
        });
    },

    pause: function(data,cb) {
        console.log(data.user)
        connection.query({
            sql: 'INSERT INTO `pause` (`ticket`) VALUES (?)',
            values: [data.data.ticket]
        }, function(err, results, fields) {
            if (err) {
                cb(false,null);
            } else {
                if (results.affectedRows==1) {
                    connection.query({
                        sql: 'INSERT INTO `incidence` (`user`, `ticket`, `description`) VALUES (?,?,?)',
                        values: [data.user, data.data.ticket,'Ha pausado el ticket']
                    }, function(err, results, fields){
                        if (err) {
                            cb(err, null)
                        } else {
                            console.log(results)
                            cb(null, true);
                        }

                    })

                } else {
                    cb(false,null);
                }
               
            }
        });
    },

    quitpause: function(data,cb) {
      
        connection.query({
            sql: 'SELECT * FROM pause WHERE datefinish IS NULL AND ticket =?',
            values: [data.data.ticket]
        }, function(err, results, fields) {
            if (err) {
                cb(err,null);
            } else {
            
                if (results[0]) {
                    var id= results[0].id;
          
                  connection.query({
                      sql:'UPDATE `pause` SET `datefinish`=now() WHERE (`id`=?)',
                      values: [id]
                  },function(err, results, fields) {
                      if (err) {
             
             
                        cb(err,null);
                      } else {
           
                        if (results.affectedRows==1) {

                            connection.query({
                                sql: 'INSERT INTO `incidence` (`user`, `ticket`, `description`) VALUES (?,?,?)',
                                values: [data.user, data.data.ticket,'Ha reiniciado el ticket']
                            }, function(err, results, fields){
                                if (err) {
                                    cb(err, null)
                                } else {
                                    console.log(results)
                                    cb(null, true);
                                }
        
                            })
     
                        } else {
                      
                            cb(err,null);
                        }
                      }
                  })
                } else {
                    cb('No hay nada',null);
                }
               
            }
        });
    },

    readOne: function (code, callback) {
        connection.query({
            sql: 'SELECT * FROM v_ticket WHERE id = ? ORDER BY id DESC',
            values: [code]
        }, function (error, results, fields) {
            if (error) {
                callback(error, null);
            } else {
                callback(null, results)
            }
        });
    },

    create: function (data, callback) {

        var myusers = "";
        for (var i = 0; i < data.users.length; i++) {
           
            
        }

        connection.query({
            sql: 'INSERT INTO `ticket` (`client`, `type`, `priority`, `subject`, `description`, `user`) VALUES (?,?,?,?,?,?)',
            values: [data.data.client, data.data.type, data.data.priority, data.data.subject.toUpperCase(), data.data.description, data.data.user]
        }, function (error, results, fields) {
            if (error) {
                callback(error, null);
            } else {
    

                if (results.affectedRows = 1) {

                    var idcreate=results.insertId;
                    connection.query({
                        sql: 'INSERT INTO `incidence` (`user`, `ticket`, `description`) VALUES (?, ?, \'Ha creado el ticket\')',
                        values: [data.data.user,results.insertId]
                    }, function (error, results, fields) {
                        if (error) {
                       
                        } else {
                          
                        }
                      
                    });

                    var sql = createQuery(results.insertId, data.users);
                    connection.query({
                        sql: sql
                    }, function (error, results, fields) {
                        if (error) {
                            callback(error, null);
                        } else {
                            connection.query({
                                sql: 'SELECT * from v_ticket2 where ids=?',
                                values: [idcreate]
                            },function(err, res,fields) {
                                sendEmail(res[0]);
                            });

                            callback(null, results)
                        }
                    });
                } else {

                }

            }
        });
    }
}


function createQuery(ticket, users) {

    var query = 'INSERT INTO `assignment` (`user`, `ticket`) VALUES';
    var data = '';
    for (var i = 0; i < users.length; i++) {
        data += ' (' + users[i] + ', ' + ticket + '),'

    }

    data = data.slice(0, -1);



    return query + ' ' + data + ';';

}


function sendEmail(data) {

    

      var mailOptions = {
        from: 'gabosoam621@gmail.com',
        to: data.responsables+','+data.clientemail,
        subject: 'Apertura de ticket # '+data.ids,
        html: '<div style="font-family: \'Arial Narrow\';  max-width: 600px">'+
        '<h2 style="text-align: center;">Cineto Telecomunicaciones S.A</h2>'+
        '<h3 style="text-align: center;">Apertura de ticket # '+data.ids+'</h3>'+
        '<center><div style="border-radius: 25px;padding: 20px;border: 2px solid black; ">'+
        '<table style="text-align: left;">'+
        '   <tr>'+
        '       <td><strong>Asunto: </strong></td>'+
        '       <td>'+data.subject+'</td>'+
        '   </tr>'+
        '    <tr>'+
        '        <td><strong>Cliente: </strong></td>'+
        '        <td>'+data.client+'</td>'+
        '    </tr>'+
        '    <tr>'+
        '        <td><strong>Fecha y hora: </strong></td>'+
        '        <td>'+data.date+'  '+data.time+'</td>'+
        '    </tr>'+
        '</table>'+
        '</div></center> <br><br><br><br><br><br><hr>'+
        '<p>La Pinta 236 y Rábida. Quito Ecuador, Edficio Alcatel Teléfono: (593-2) 5100 528 - Email: info@cineto.net </p>'+
        '</div>'
      }



   

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
    
        } else {
         
        }
      });
    
}