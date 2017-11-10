'use strict';
let mysql = require('mysql'),
    db_config = {
        host: 'localhost',
        user: 'root',
        password: '12345',
        database: 'ticketing',
        port: '3307'
    },
    myConn = mysql.createConnection(db_config);

    myConn.connect(function(err){
      return (err)? console.log(`conexión fallida ${err}`) : console.log(`conectado a la base de datos` );
    });

module.exports = myConn;