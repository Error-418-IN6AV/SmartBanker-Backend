'use strict'

const mongoose = require('mongoose');

const transfersSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    nocuenta: {
        type: Number,
        required: true
    },
    dpi: {
        type: Number,
        required: true
    },
    monto: {
        type: Number,
        required: true
    },
    date: {
        type: Number
    }

}, {
    versionKey: false
});

module.exports = mongoose.model('Transfers', transfersSchema);