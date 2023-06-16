'use strict'

const express = require('express');
const api = express.Router();
const transfersController = require('./transfers.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.get('/test', transfersController.test);
api.post('/save', transfersController.save);
api.get('/getTransfer', transfersController.getTransfer);
api.get('/getTransfers/:id', transfersController.getTransfers);
api.put('/update/:id', ensureAuth, transfersController.updatedTransfer);
api.delete('/delete/:id', transfersController.delete);

module.exports = api;