'use strict'

const express = require('express');
const api = express.Router();
const userController = require('./user.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.post('/register',  [ensureAuth, isAdmin], userController.register);
api.post('/login', userController.login);
api.get('/get/:id', userController.getUser);
api.get('/get', userController.getUsers);
api.get('/getClient', userController.getClient);
api.put('/update/:id', ensureAuth, userController.update);
api.delete('/delete/:id', ensureAuth, userController.deleteUser);
api.get('/test', [ensureAuth, isAdmin], userController.test);
api.post('/save', [ensureAuth, isAdmin], userController.save);

module.exports = api;