'use strict'
const Product = require('./product.model');
/* const { validateData } = require('../utils/validate') */

exports.test = (req, res)=>{
    res.send({message: 'Test function is running'});
}

exports.addProduct = async(req, res)=>{
    try{
   
        let data = req.body;
        let existProduct= await Product.findOne({ name: data.name });
        if (existProduct) {
            return res.send({ message: 'Product already created' })
        }

     
        let product = new Product(data);
        await product.save();
        return res.send({message: 'Product saved sucessfully', product})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating product'});
    }
}



exports.getProducts = async(req, res)=>{
    try{
  
        let products = await Product.find()
        return res.send({message: 'Products found', products});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting products'});
    }
}

exports.getProduct = async(req, res)=>{
    try{
    
        let productId = req.params.id;
       
        let product = await Product.findOne({_id: productId})
        if(!product) return res.status(404).send({message: 'Product not found'});
        return res.send({message: 'Product found:', product});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting product'});
    }
}

exports.updateProduct = async(req, res)=>{
    try{
        let productId = req.params.id;
        let data = req.body;
        let existProduct= await Product.findOne({ name: data.name });
        if (existProduct) {
            return res.send({ message: 'Product already created' })
        }
     
        let updatedProduct = await Product.findOneAndUpdate(
            {_id: productId},
            data,
            {new: true}
        )
        if(!updatedProduct) return res.send({message: 'Product not found and not updated'});
        return res.send({message: 'Product updated:', updatedProduct});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating product'});
    }
}


exports.deleteProduct = async(req, res)=>{
    try{
        
        let productId = req.params.id;

        let deletedProduct = await Product.findOneAndDelete({_id: productId});
        if(!deletedProduct) return res.status(404).send({message: 'Product not found and not deleted'});
        return res.send({message: 'Product deleted sucessfuly'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error deleting Product'});
    }
}

exports.search = async(req, res)=>{
    try{
        let params = {
            name: req.body.name
        }
        let validate = validateData(params)
        if(validate) return res.status(400).send(validate);
        let products = await Product.find({
            name: {
                $regex: params.name,
                $options: 'i'
            }
        })
        return res.send({products})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error searching Product'});
    }
}


exports.sold_out = async (req, res) => {
    const productos = await Product.find(
        { stock: 0 }
    )
    return res.status(200).send(productos)
}

