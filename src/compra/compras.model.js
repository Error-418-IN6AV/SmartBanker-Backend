'use strict'

const mongoose = require('mongoose');

const comprasSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    name:{
        type: String,
   
    },
    lastname:{
        type: String,
    
    },
    nit: {
        type: String,
  
    },
    ciudad:{
        type:String,
        deafult:' .'
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true

    },
    producto: {
        type: String,
    },
    descuento:{
        type:Number,
        require:true
    },
    precioInicial:{
        type:Number,
        require:true

    },
    total: {
        type: String,
     
    },
    cantidad:{
      type:Number,
      default:1
    },
    fecha:{
        type:Date,
        default:Date.now()
    },

},

{
    versionKey: false

});


module.exports = mongoose.model('Compras', comprasSchema);