var connection = require('../config/connection.js');

module.exports = {
    read: function (user, callback) {
        connection.query({
            sql: 'SELECT * FROM v_ticket WHERE state = 0 ORDER BY id DESC'
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
            sql: 'INSERT INTO ticket SET ?',
            values: [data]
        }, function (error, results, fields) {
            if (error) {
                callback(error, null);
            } else {
                callback(null, results)
            }
        });
    }
}