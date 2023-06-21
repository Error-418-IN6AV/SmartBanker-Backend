'use strict'
const express = require('express');
const api = express.Router()
const depositController = require('./deposit.controller')
const { ensureAuth, isAdmin } = require('../services/authenticated');


api.get('/test', depositController.test);
api.post('/add'  /* [ensureAuth, isAdmin]*/, depositController.addDeposito);
api.get('/getDeposits', /* [ensureAuth, isAdmin] */ depositController.getDeposits);
api.get('/getDeposit/:id', /* [ensureAuth, isAdmin], */depositController.getDeposit);
api.put('/updateDeposit/:id', depositController.updateDeposit)
api.delete('/cancel/:id', depositController.cancelDeposit)
module.exports = api;