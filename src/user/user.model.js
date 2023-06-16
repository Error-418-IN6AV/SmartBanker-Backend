'use strict'

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    nocuenta: {
        type: Number,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    namework: {
        type: String,
        require: true
    },
    monthlyincome: {
        type: Number,
        require: true
    },
    balance: {
        type: Number,
        require: true
    },
    role: {
        type: String,
        required: true,
        uppercase: true
    }
});

module.exports = mongoose.model('User', userSchema);