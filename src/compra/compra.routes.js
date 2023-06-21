'use strict'

const express = require('express');

const api = express.Router();
const comprasController = require('./compras.comtroller');
const { ensureAuth} = require('../services/authenticated');

api.post('/add', [ensureAuth],comprasController.add);
api.get('/getBill', [ensureAuth],comprasController.getBill); 

module.exports = api;