'use strict'

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
   
    },
    price: {
        type: Number,
        required: true,
    },
    descuento:{
        type:Number,
    },
    total:{
        type:Number,
    },
    stock: {
        type: Number,
        required: true
    },
   

});

module.exports = mongoose.model('Product', productSchema);