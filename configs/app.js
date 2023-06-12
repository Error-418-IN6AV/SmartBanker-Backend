'use strict'

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

const userRoutes = require('../src/user/user.routes');

app.use('/user',userRoutes)

exports.initServer = ()=>{
    app.listen(port);
    console.log(`Server http running in port ${port}`);
} 