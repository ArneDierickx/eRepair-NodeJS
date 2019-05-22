// does some basic user input validation, now only checks empty fields, can be easily extended in the future

"use strict";

function validateCreate(username, name, type, status) {
    return checkNotEmpty(username) && checkNotEmpty(name) && checkNotEmpty(type) && checkNotEmpty(status);
}

function validateUpdate(status) {
    return checkNotEmpty(status);
}

function validateConfirmation(confirmationDesc) {
    return checkNotEmpty(confirmationDesc);
}

function checkNotEmpty(x) {
    return x !== null && x !== "";
}

module.exports = {
    validateCreate: validateCreate,
    validateUpdate: validateUpdate,
    validateConfirmation: validateConfirmation
};