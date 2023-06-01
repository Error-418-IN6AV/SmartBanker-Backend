'use strict'

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3500;
const depositRoutes = require('../src/Deposit/deposit.routes')

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/deposit', depositRoutes);

exports.initServer = ()=>{
    app.listen(port);
    console.log(`Server http running in port ${port}`);
} 