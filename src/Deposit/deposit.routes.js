'use strict'
const express = require('express');
const api = express.Router()
const depositController = require('./deposit.controller')

api.get('/test', depositController.test);
module.exports = api;