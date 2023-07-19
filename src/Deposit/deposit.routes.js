'use strict'
const express = require('express');
const api = express.Router()
const depositController = require('./deposit.controller')
const { ensureAuth } = require('../services/authenticated');


api.get('/test', depositController.test);
api.post('/add',  ensureAuth, depositController.addDeposito);
api.get('/getDeposits', ensureAuth,  depositController.getDeposits);
api.get('/getDeposit/:id', ensureAuth, depositController.getDeposit);
api.put('/updateDeposit/:id', ensureAuth, depositController.updateDeposit)
api.delete('/cancel/:id', ensureAuth, depositController.cancelDeposit)
module.exports = api;