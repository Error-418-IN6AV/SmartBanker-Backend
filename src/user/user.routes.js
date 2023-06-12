'use strict'

const express = require('express');
const api = express.Router();
const userController = require('./user.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.post('/register', userController.register);
api.post('/login', userController.login);
api.get('/get', [ensureAuth, isAdmin], userController.getUsers )
api.get('/getManager', [ensureAuth, isAdmin], userController.getManagers)
api.put('/update/:id',   ensureAuth,  userController.update);
api.delete('/delete/:id',  ensureAuth,  userController.deleteUser);
api.get('/test', [ensureAuth, isAdmin],  userController.test);
api.post('/save',   [ ensureAuth , isAdmin], userController.save);

module.exports = api;