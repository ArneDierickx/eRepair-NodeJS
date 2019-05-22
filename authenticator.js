// used for creating and verifying tokens using JWT (json web token), uses private.key and public.key files

"use strict";

const fs = require('fs');
const jwt = require('jsonwebtoken');

// sync reading because this is only done once to load keys into memory, async loading would make this unnecessarily complex
const privateKey = fs.readFileSync('./private.key', 'utf8');
const publicKey = fs.readFileSync('./public.key', 'utf8');

// two separate but similar sets of options: allows for easy customization in the future and verify expects an array with algorithms, sign only a string value

const signOptions = {
    expiresIn: '1h',
    algorithm: "RS256"
};

const verifyOptions = {
    expiresIn:  '1h',
    algorithm:  ["RS256"]
};

function createToken(user) {
    return new Promise(function (resolve, reject) {
        // create token: payload contains username: allows for later identification of user (not used currently)
        jwt.sign({user: user}, privateKey, signOptions, function (err, token) {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
}

function verifyToken(token) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, publicKey, verifyOptions, function (err, decoded) {
            if (err) {
                reject(err);
            } else {
                // decoded contains username and other relevant token information (not used currently, but still passed as a result)
                resolve(decoded);
            }
        });
    });
}

module.exports = {
    createToken: createToken,
    verifyToken: verifyToken
};