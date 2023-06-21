const Product = require('../product/product.model')
const Compra = require('./compras.model')
const Carrito = require('../carrito/carrito.model')
const User = require('../user/user.model')



exports.add = async(req, res)=>{
    try{
        let data = req.body;
        let user = req.user.sub 

        let existCompra = await Compra.findOne({user:user});
        if(existCompra) return res.status(404).send({message: 'you have already made a purchase in the past'});
        let existProducto = await Product.findOne({_id:data.product}) 
        data.user = req.user.sub
        data.producto = existProducto.name
        data.descuento = existProducto.descuento
        data.precioInicial = existProducto.price
        if(data.nit.length == 0){
            data.nit = 'C/F'
           
        }else if(data.nit.length <= 7 && data.nit.length >= 1){
            
            return res.send({message: 'You NIT is invalid'});
    }

        var descuento = (100 - existProducto.descuento)/100
        let price = existProducto.price*descuento
        data.total = price
        if(data.nit.length >= 9)return res.send({message: 'You NIT is invalid'});
        let producto = await Product.findOneAndUpdate(
            {_id:data.product},
            {$inc : {stock:-1}},
            {new: true} 
            )
        let background = await User.findOne({_id:user})
        if(background.background <= 0 || background.background < data.total ) return res.send({message: 'your balance is unquantifiable'});
        let userAcount = await User.findOneAndUpdate(
                {_id:user},
                {$inc : {background:-data.total}},
                {new: true} 
         )    
        if(!producto) return res.send({message: 'Product not found and not updated'});
       
        let compra = new Compra(data);
        await compra.save();
        return res.send({message: 'Compra added sucessfully',compra});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating Compra', error: err.message})
    }
}

exports.getBill = async(req, res)=>{
    try{      
        let user = req.user.sub
        let existUser = await Compra.findOne({user:user});
        if(existUser) {
            if(existUser.user != user) return res.status(401).send({message: 'Dont have permission to do this action'});
        }
        let compra = await Compra.find({user: user})
        if(!compra) return res.status(404).send({message: 'Bill not found'});
        return res.send({message: 'Bill found:', compra});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting Bill'});
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
