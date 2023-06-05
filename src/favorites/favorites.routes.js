'use strict'

const express = require('express');
const api = express.Router();
const favoritesController = require('./favorites.controller');

api.post('/add', favoritesController.add);
api.get('/gets', favoritesController.gets);
api.get('/get/:id', favoritesController.get);
api.put('/update/:id', favoritesController.update);
api.delete('/delete/:id', favoritesController.deleteFavorite)
module.exports = api;