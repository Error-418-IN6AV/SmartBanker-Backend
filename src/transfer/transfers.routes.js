'use strict'

const express = require('express');
const api = express.Router();
const transfersController = require('./transfers.controller');
const { ensureAuth } = require('../services/authenticated');

api.get('/test', ensureAuth, transfersController.test);
api.post('/save', ensureAuth, transfersController.save);
api.get('/getTransfer', ensureAuth, transfersController.getTransfer);
api.get('/getTransfers/:id', ensureAuth, transfersController.getTransfers);
api.put('/update/:id', ensureAuth, transfersController.updatedTransfer);
api.delete('/delete/:id', ensureAuth, transfersController.delete);

module.exports = api;