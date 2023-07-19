'use strict'

const express = require('express');
const api = express.Router();
const productController = require('./product.controller');
const { ensureAuth } = require('../services/authenticated');
const connectMultiparty = require('connect-multiparty')
const upload = connectMultiparty({ uploadDir: './uploads/products' })

api.post('/add',  productController.addProduct);
api.get('/get', productController.getProducts);
api.delete('/delete/:id', productController.deleteProduct)
api.get('/getProduct/:id', productController.getProduct);
api.put('/update/:id', productController.updateProduct);
api.put('/addImage/:id', upload, productController.addImage)
api.get('/getImage/:fileName', upload, productController.getImage)

module.exports = api;