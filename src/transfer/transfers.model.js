'use strict'

const mongoose = require('mongoose');

const transfersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Transfers', transfersSchema);