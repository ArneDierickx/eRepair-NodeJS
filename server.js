"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const configs = require("./configs");
const db = require("./data");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.post("/login", function (req, res) {
    // TODO: make more secure... JWT and HTTPS?
    db.login(req.body.username, req.body.password).then(m => res.json({result: m}));
});

// temporary endpoint for testing db communication
app.post("/temptest", function (req, res) {
    db.writeMessage(req.body.message);
    res.end();
});

const server = app.listen(configs.portToListenOn, function () {
    console.log("Running on " + server.address().port);
});