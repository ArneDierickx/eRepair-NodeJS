// main file containing express app and api endpoints

"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const configs = require("./configs");
const db = require("./data");
const validator = require("./validator");
const authenticator = require("./authenticator");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

// middleware for the specified routes that gets the token and checks if it is valid. if valid: execute actual endpoint logic (next), otherwise returns a 401
app.use(["/devices", "/devices/delete", "/devices/confirmation", "/devices/update", "/devices/types"], function (req, res, next) {
    authenticator.verifyToken(req.query.token)
        .then(decoded => next())
        .catch(err => {
            console.log(err);
            res.statusCode = 401;
            res.json("Unauthorized");
        });
});

app.post("/login", function (req, res) {
    db.login(req.body.username, req.body.password)
        .then(match => {
            // if valid password: create token and send in response
            if (match) {
                return authenticator.createToken(req.body.username);
            } else {
                return Promise.reject("Invalid login credentials");
            }
        })
        .then(token => res.json(token))
        .catch(err => {
            console.log(err);
            res.statusCode = 401;
            // if error is string: own custom error, otherwise it is an object containing an error from a module such as mysql containing some critical information
            if (typeof err === "string") {
                res.json(err);
            } else {
                res.json("Failed to login");
            }
        });
});

app.get("/devices", function (req, res) {
    db.getDevices()
        .then(devices => res.json(devices))
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.json("Failed to get devices");
        });
});

app.post("/devices", function (req, res) {
    if (validator.validateCreate(req.body.username, req.body.name, req.body.type, req.body.status)) {
        db.createDevice(req.body.username, req.body.name, req.body.type, req.body.status)
            .then(ready => {
                res.statusCode = 201;
                res.json("Device created");
            })
            .catch(err => {
                console.log(err);
                res.statusCode = 400;
                // if error is string: own custom error, otherwise it is an object containing an error from a module such as mysql containing some critical information
                if (typeof err === "string") {
                    res.json(err);
                } else {
                    res.json("Failed to create device");
                }
            });
    } else {
        res.statusCode = 400;
        res.json("Not all fields contain a value");
    }
});

app.post("/devices/delete", function (req, res) {
    db.deleteDevice(req.body.id)
        .then(ready => res.json("Device deleted"))
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.json("Device deletion failed");
        });
});

app.post("/devices/update", function (req, res) {
    if (validator.validateUpdate(req.body.status)) {
        db.updateDevice(req.body.id, req.body.status)
            .then(ready => res.json("Device updated"))
            .catch(err => {
                console.log(err);
                res.statusCode = 500;
                res.json("Device update failed");
            });
    } else {
        res.statusCode = 400;
        res.json("Status is required");
    }
});

app.post("/devices/confirmation", function (req, res) {
    if (validator.validateConfirmation(req.body.confirmationDesc)) {
        db.askConfirmation(req.body.id, req.body.confirmationDesc)
            .then(ready => res.json("Device confirmation set"))
            .catch(err => {
                console.log(err);
                res.statusCode = 500;
                res.json("Device confirmation setting failed");
            });
    } else {
        res.statusCode = 400;
        res.json("Confirmation description is required");
    }
});

app.get("/devices/types", function (req, res) {
    db.getTypes()
        .then(types => res.json(types))
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.json("Failed to get device types");
        });
});

const server = app.listen(configs.portToListenOn, function () {
    console.log("Running on " + server.address().port);
});