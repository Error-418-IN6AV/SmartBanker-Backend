const Product = require('../product/product.model')
const Compra = require('./compras.model')
const User = require('../user/user.model')



exports.add = async (req, res) => {
    try {
        let data = req.body;
        let user = req.user.sub

/*         let existCompra = await Compra.findOne({ user: user, product: data.product });
 */
        let existProducto = await Product.findOne({ _id: data.product })
   /*      if (existCompra) return res.send({ message: 'You have already bought this product in the past' }); */
//////////////////////////////////////////////////////////////
        data.user = req.user.sub
        data.producto = existProducto.name
        data.descuento = existProducto.descuento
        data.precioInicial = existProducto.price
 ///////////////////////////////////////////////////////////       
        if (data.nit.length == 0) {
            data.nit = 'C/F'

        } else if (data.nit.length <= 7 && data.nit.length >= 1) {

            return res.send({ message: 'You NIT is invalid' });
        }
////////////////////////////////////////////////////////
        var descuento = (100 - existProducto.descuento) / 100
        let price = existProducto.price * descuento
        if (isNaN(data.cantidad)) {
            data.cantidad = 1
        }else if (data.cantidad == 0){
            data.cantidad = 1
        }
        let precioFinal = price * data.cantidad
        data.total = precioFinal
////////////////////////////////////////////////////
        if (data.nit.length >= 9) return res.send({ message: 'You NIT is invalid' });

        if (existProducto.stock == 0) {
            return res.send({ message: 'We are sorry but this product is currently out of stock.' });
        } else if (data.cantidad > existProducto.stock) return res.send({ message: 'we are sorry but the quantity you are requesting exceeds what we have in our store' });
/////////////////////////////////////////////////////       
        let producto = await Product.findOneAndUpdate(
            { _id: data.product },
            { $inc: { stock: -data.cantidad } },
            { new: true }
        )
 ////////////////////////////////////////////////////       
        let balance = await User.findOne({ _id: user })
        if (balance.balance <= 0 || balance.balance < data.total) return res.send({ message: 'your balance is unquantifiable' });
        let userAcount = await User.findOneAndUpdate(
            { _id: user },
            { $inc: { balance: -data.total } },
            { new: true }
        )
        if (!producto) return res.send({ message: 'Product not found and not updated' });
 /////////////////////////////////////////////////////       
        let compra = new Compra(data);
        await compra.save();
        return res.send({ message: 'Compra added sucessfully', compra });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating Compra', error: err.message })
    }
}





exports.getBill = async (req, res) => {
    try {
        let user = req.user.sub
        let existUser = await Compra.findOne({ user: user });
        if (existUser) {
            if (existUser.user != user) return res.status(401).send({ message: 'Dont have permission to do this action' });
        }
        let compra = await Compra.find({ user: user })
        if (!compra) return res.status(404).send({ message: 'Bill not found' });
        return res.send({ message: 'Bill found:', compra });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting Bill' });
    }
}

exports.getProducts = async (req, res) => {
    try {
        let data = req.body;
        let user = req.user.sub

        let existCompra = await Compra.find({ user: user, product: data.product });
        return res.send({ message: 'Products found', existCompra });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting products' });
    }
}
