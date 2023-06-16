'use strict'

const mongoose = require('mongoose');

const transfersSchema = mongoose.Schema({
    nocuenta: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    dpi: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    monto: {
        type: Number,
        require: true
    },
    date: {
        type: Date,
        required: true,
        uppercase: true
    }
});

module.exports = mongoose.model('Transfers', transfersSchema);