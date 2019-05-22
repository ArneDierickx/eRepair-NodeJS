// all database communication happens here
"use strict";

const configs = require("./configs");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const config = configs.mysqlConfig;
const allowedUsers = configs.usersAllowedToLogin;
const pool = mysql.createPool(config);

async function login(username, password) {
    // only this specific user is allowed to log in
    if (allowedUsers.includes(username)) {
        const query = "SELECT password FROM users WHERE username = ?";
        try {
            const rows = await queryAsync(query, [username]);
            const dbPassword = rows[0].password;
            return await compareAsync(password, dbPassword);
        } catch (e) {
            return Promise.reject(e);
        }
    } else {
        return Promise.reject("Not allowed to log in");
    }
}

async function getDevices() {
    const query = "SELECT devices.id, name, type, status, username FROM devices JOIN users ON users.id = devices.user_id";
    try {
        return await queryAsync(query, []);
    } catch (e) {
        return Promise.reject(e);
    }
}

async function createDevice(username, name, type, status) {
    let user_id;
    try {
        user_id = await getUser(username);
    } catch (e) {
        return Promise.reject(e);
    }
    const query = "INSERT INTO devices(name, type, status, user_id) VALUES (?, ?, ?, ?)";
    try {
        return await queryAsync(query, [name, type, status, user_id]);
    } catch (e) {
        return Promise.reject(e);
    }
}

async function getUser(username) {
    const query = "SELECT id FROM users WHERE username = ?";
    try {
        const result = await queryAsync(query, [username]);
        if (result.length !== 0) {
            return result[0].id;
        } else {
            return Promise.reject("User not found");
        }
    } catch (e) {
        return Promise.reject(e);
    }
}

async function deleteDevice(id) {
    const query = "DELETE FROM devices WHERE id = ?";
    try {
        return await queryAsync(query, [id]);
    } catch (e) {
        return Promise.reject();
    }
}

async function updateDevice(id, status) {
    const query = "UPDATE devices SET status = ? WHERE id = ?";
    try {
        return await queryAsync(query, [status, id]);
    } catch (e) {
        return Promise.reject(e);
    }
}

async function askConfirmation(id, confirmationDesc) {
    const status = "confirmation required";
    const query = "UPDATE devices SET status = ?, confirmation_desc = ? WHERE id = ?";
    try {
        return await queryAsync(query, [status, confirmationDesc, id]);
    } catch (e) {
        return Promise.reject(e);
    }
}

async function getTypes() {
    const query = "SELECT type FROM types";
    try {
        return await queryAsync(query, []);
    } catch (e) {
        return Promise.reject(e);
    }
}

// used to verify password using bcrypt
function compareAsync(password, dbPassword) {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(password, dbPassword, function (err, match) {
            if (err) {
                reject(err);
            } else {
                resolve(match);
            }
        });
    });
}

// used by most functions above to query the database, hides some complexity from the functions above, has also been promisified
function queryAsync(query, params) {
    return new Promise(function (resolve, reject) {
        // https://codeforgeek.com/nodejs-mysql-tutorial/
        // this internally gets a connection from te pool, queries it and releases it when results are received
        pool.query(query, params, function (err, rows) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

module.exports = {
    login: login,
    getDevices: getDevices,
    createDevice: createDevice,
    deleteDevice: deleteDevice,
    updateDevice: updateDevice,
    askConfirmation: askConfirmation,
    getTypes: getTypes
};