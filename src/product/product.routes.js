'use strict'

const express = require('express');
const api = express.Router();
const productController = require('./product.controller');
/* const { ensureAuth, isAdmin } = require('../services/authenticated'); */


api.get('/soldOut',[ /* ensureAuth, isAdmin */ ],productController.sold_out);
api.post('/search',[ /* ensureAut */ ], productController.search)
api.post('/add', [ /* ensureAuth, isAdmin */ ]  ,productController.addProduct);
api.get('/get', [ /* ensureAuth */ ],productController.getProducts);
api.delete('/delete/:id',[ /* ensureAuth,isAdmin */ ], productController.deleteProduct)
api.get('/getProduct/:id', [ /* ensureAuth */ ],productController.getProduct);
api.put('/update/:id', [ /* ensureAuth, isAdmin  */] ,productController.updateProduct);

module.exports = api;