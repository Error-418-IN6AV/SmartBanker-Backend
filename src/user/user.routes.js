'use strict'

const express = require('express');
const api = express.Router();
const userController = require('./user.controller');
const { ensureAuth } = require('../services/authenticated');

api.post('/login', userController.login);
api.get('/getClient', userController.getClient);
api.get('/get/:id', userController.getClients);
api.get('/getWorker', userController.getWorker);
api.get('/getW/:id', userController.getWorkers);
api.put('/update/:id', ensureAuth, userController.update);
api.delete('/delete/:id', ensureAuth, userController.deleteUser);
api.get('/test', ensureAuth, userController.test);
api.post('/save', ensureAuth, userController.save);
api.post('/addWorker', ensureAuth, userController.addWorkers);

module.exports = api;