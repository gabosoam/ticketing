var connection = require('../config/connection.js');

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

        connection.query({
            sql: 'INSERT INTO `ticket` (`client`, `type`, `priority`, `subject`, `description`, `user`) VALUES (?,?,?,?,?,?)',
            values: [data.data.client, data.data.type, data.data.priority, data.data.subject.toUpperCase(), data.data.description, data.data.user]
        }, function (error, results, fields) {
            if (error) {
                callback(error, null);
            } else {
                console.log(results);

                if (results.affectedRows = 1) {
                    connection.query({
                        sql: 'INSERT INTO `incidence` (`user`, `ticket`, `description`) VALUES (?, ?, \'Ha creado el ticket\')',
                        values: [data.data.user,results.insertId]
                    }, function (error, results, fields) {
                        if (error) {
                            console.log(error)
                        } else {
                            console.log(results);
                        }
                      
                    });


                    var sql = createQuery(results.insertId, data.users);
                    connection.query({
                        sql: sql
                    }, function (error, results, fields) {
                        if (error) {
                            callback(error, null);
                        } else {
                            console.log(results);

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
    console.log('creacion de query');
    var query = 'INSERT INTO `assignment` (`user`, `ticket`) VALUES';
    var data = '';
    for (var i = 0; i < users.length; i++) {
        data += ' (' + users[i] + ', ' + ticket + '),'

    }

    data = data.slice(0, -1);

    console.log(' el query es: ' + query + ' ' + data + ';')

    return query + ' ' + data + ';';

}