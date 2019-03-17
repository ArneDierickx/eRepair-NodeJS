"use strict";

// this is already the remote database the PWA and laravel are using
const mysqlConfig = {
    host: "ID286902_erepair.db.webhosting.be",
    port: 3306,
    database: "ID286902_erepair",
    user: "ID286902_erepair",
    password: "eRepair_password1",
};

// these users should already be in the database and are the only ones who can login through the NMA and NodeJS
const usersAllowedToLogin = [
    "eRepair"
];

const portToListenOn = 8080;

module.exports = {
    mysqlConfig: mysqlConfig,
    usersAllowedToLogin: usersAllowedToLogin,
    portToListenOn: portToListenOn
};