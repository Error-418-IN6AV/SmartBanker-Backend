'use strict'

const express = require('express');
const api = express.Router();
const favoritesController = require('./favorites.controller');
const { ensureAuth } = require('../services/authenticated');

api.post('/add', ensureAuth, favoritesController.add);
api.get('/gets', ensureAuth, favoritesController.get);
api.get('/get/:id', ensureAuth, favoritesController.getById);
api.put('/update/:id', ensureAuth, favoritesController.update);
api.delete('/delete/:id', ensureAuth, favoritesController.deleteFavorite)
module.exports = api;