"use strict";

const configs = require("./configs");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const config = configs.mysqlConfig;
const allowedUsers = configs.usersAllowedToLogin;

function login(username, password) {
    // only this specific user is allowed to log in
    if (allowedUsers.includes(username)) {
        const query = "SELECT password FROM users WHERE username = ?";
        const connection = mysql.createConnection(config);
        connection.connect();
        return new Promise(function (resolve) {
            connection.query(query, username, function (err, rows) {
                const dbPassword = rows[0].password;
                bcrypt.compare(password, dbPassword, function (err, match) {
                    resolve(match);
                });
            });
        });
    }
}

// temporary function for testing db communication
function writeMessage(message) {
    const query = "INSERT INTO test_messages(message) VALUES(?)";
    const  connection = mysql.createConnection(config);
    connection.connect();
    connection.query(query, message, function (err) {});
}

module.exports = {
    login: login,
    writeMessage: writeMessage
};