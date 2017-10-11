var connection = require('../config/connection.js');

module.exports = {
    read: function (ticket, callback) {
        connection.query({
            sql: 'SELECT * FROM v_incidence WHERE `ticket` = ? ORDER BY id ASC',
            values: [ticket]
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


        if (!data.isClosed) {
            connection.query({
                sql: 'INSERT INTO incidence SET ?',
                values: [data]
            }, function (error, results, fields) {
                if (error) {
                    callback(error, null);
                } else {
                    callback(null, results);
                }
            });
        } else {
            data.isClosed = 1;
            connection.query({
                sql: 'INSERT INTO incidence SET ?',
                values: [data]
            }, function (error, results, fields) {
                if (error) {
                    callback(error, null);
                } else {
                    data.description = 'Ha finalizado el ticket';
                    connection.query({
                        sql: 'INSERT INTO incidence SET ?',
                        values: [data]
                    }, function (error, results, fields) {
                        if (error) {

                        } else {

                        }

                    });

                    connection.query({
                        sql: 'UPDATE ticket SET state= \'primary\' WHERE id =?',
                        values: [data.ticket]
                    }, function (error, results, fields) {
                        if (error) {
                            callback(error, null);
                        } else {
                            callback(null, results)
                        }

                    });



                }
            });
        }



    }
}