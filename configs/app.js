'use strict'

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3500;
const productRoutes = require('../src/product/product.routes');
const compraRoutes = require ('../src/compra/compra.routes')


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/product', productRoutes);
app.use('/compra',compraRoutes)
exports.initServer = ()=>{
    app.listen(port);
    console.log(`Server http running in port ${port}`);
} 