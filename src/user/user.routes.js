'use strict'

const express = require('express');
const api = express.Router();
const userController = require('./user.controller');
const { ensureAuth } = require('../services/authenticated');

api.post('/login', userController.login);
api.get('/getClient', ensureAuth, userController.getClient);
api.get('/getClientss', ensureAuth, userController.getClientss);
api.get('/get/:id', ensureAuth, userController.getClients);
api.get('/getWorker', ensureAuth, userController.getWorker);
api.get('/getW/:id', ensureAuth, userController.getWorkers);
api.put('/update/:id', ensureAuth, userController.update);
api.delete('/delete/:id', ensureAuth, userController.deleteUser);
api.get('/test', ensureAuth, userController.test);
api.post('/save', ensureAuth, userController.save);
api.post('/addWorker', ensureAuth, userController.addWorkers);

module.exports = api;