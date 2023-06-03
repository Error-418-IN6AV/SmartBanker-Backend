'use strict'

const transfers = require('./transfers.model');

exports.test = (req, res) => {
    res.send({ message: 'Test function is running' });
}