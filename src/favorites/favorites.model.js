'use strict'

const mongoose = require('mongoose');

const favoritesSchema = mongoose.Schema({
    noCuenta: {
        type: String,
        required: true
    },
    apodo:{
        type: String,
        required: true
    }

},{
    versionKey: false
});

module.exports = mongoose.model('Favorite',  favoritesSchema)