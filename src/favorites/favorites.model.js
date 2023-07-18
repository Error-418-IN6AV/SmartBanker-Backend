'use strict'

const mongoose = require('mongoose');

const favoritesSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    nocuenta: {
        type: String,
        required: true
    },
    dpi: {
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