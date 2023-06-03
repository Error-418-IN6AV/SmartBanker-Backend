'use strict'

const express = require('express');
const api = express.Router();
const transfersController = require('./transfers.controller');

api.get('/test', transfersController.test);

module.exports = api;