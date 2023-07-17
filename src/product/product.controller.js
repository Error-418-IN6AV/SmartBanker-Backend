'use strict'
const Product = require('./product.model');
const { validateData } = require('../utils/validate')
const fs = require('fs')
const path = require('path')


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
        var descuento = (100 - data.descuento)/100
        let price = data.price*descuento
        data.total = price
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
       
        let products = await Product.findOne({_id: productId})
        if(!products) return res.status(404).send({message: 'Product not found'});
        return res.send({message: 'Product found:', products});
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
        var descuento = (100 - data.descuento)/100
        let price = data.price*descuento
        data.total = price
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

exports.sold_out = async (req, res) => {
    const productos = await Product.find(
        { stock: 0 }
    )
    return res.status(200).send(productos)
}



exports.addImage = async(req, res)=>{
    try{

        //obtener el id del producto al cual se va a vincular
        const productId = req.params.id; //si es un usuario, y está logeado se puede jalar del token
        const alreadyImage = await Product.findOne({_id: productId})
        let pathFile = './uploads/products/'
        if(alreadyImage.image) fs.unlinkSync(`${pathFile}${alreadyImage.image}`) //./uploads/products/nombreImage.png
        if(!req.files.image || !req.files.image.type) return res.status(400).send({message: 'Havent sent image'})
        //crear la ruta para guardar la imagen
        const filePath = req.files.image.path; // \uploads\products\productName.png
        //Separar en jerarqu´+ia la ruta de imagen (linux o MAC ('\'))
        const fileSplit = filePath.split('\\') //fileSplit = ['uploads', 'products', 'productName.png']
        const fileName = fileSplit[2];

        const extension = fileName.split('\.'); //extension = ['productName', 'png']
        const fileExt = extension[1] // fileExt = 'png'
        console.log(fileExt)
        if(
            fileExt == 'png' || 
            fileExt == 'jpg' || 
            fileExt == 'jpeg'|| 
            fileExt == 'JPG' ||
            fileExt == 'JPG' ||
            fileExt == 'gif'
        ){
            const updatedProduct = await Product.findOneAndUpdate(
                {_id: productId}, 
                {image: fileName}, 
                {new: true}
            )
            if(!updatedProduct) return res.status(404).send({message: 'Product not found and not updated'});
            return res.send({message: 'Product updated', updatedProduct})
        }
        fs.unlinkSync(filePath)
        return res.status(404).send({message: 'File extension cannot admited'});
        

    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error adding image', err})
    }
}

exports.getImage = async (req, res) => {
    try {
      let fileName = req.params.fileName;
  
      if (!fileName || fileName === 'undefined'||fileName === '') {
        // Si el nombre de archivo es undefined, asigna una ruta a una imagen predeterminada
        fileName = 'Cesta.jpg';
      }
  
      let pathFile = `./uploads/products/${fileName}`;
  
      if (!fs.existsSync(pathFile)) {
        // Si la imagen no existe, asigna una ruta a una imagen predeterminada
        pathFile = `./uploads/products/Cesta.jpg`;
      }
  
      return res.sendFile(path.resolve(pathFile));
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error getting image' });
    }
  };
  