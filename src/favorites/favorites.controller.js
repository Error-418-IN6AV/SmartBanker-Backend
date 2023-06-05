'use strict'

const Favorites = require('./favorites.model')
const User = require('../user/user.model')

exports.test = (req, res)=>{
    res.send({message: 'Funcion de prueba'})
}

exports.add = async (req, res) => {
    try {
        let data = req.body;
        let noCuentaExists = await User.findOne({_id: data.noCuenta})
        if(!noCuentaExists) return res.status(404).send({message: 'No cuenta not found'})
        let favorites = new Favorites(data);
        await favorites.save();
        return res.send({ message: 'Favorite created sucessfully' , favorites});
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating favorite', error: err.message })
    }
}

exports.gets = async(req, res)=>{
    try{
        //Buscar datos
        let favorites = await Favorites.find().populate('noCuenta');
        return res.send({message: 'Favorites found', favorites});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting favorites'});
    }
}

exports.get = async(req, res)=>{
    try{
        //Obtener el Id 
        let favoriteId = req.params.id;
        //Buscarlo en BD
        let favorite = await Favorites.findOne({_id: favoriteId}).populate('noCuenta');
        //Valido que exista 
        if(!favorite) return res.status(404).send({message: 'Favorite not found'});
        //Si existe lo devuelvo
        return res.send({message: 'Favorite found:', favorite});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting favorite'});
    }
}

exports.update = async(req, res)=>{
    try{
        //obtener el Id del favorito
        let favoriteId = req.params.id;
        //obtener la data a actualizar
        let data = req.body;
        //Validar que exista el numero de cuenta
        let existNoCuenta = await User.findOne({_id: data.noCuenta});
        if(!existNoCuenta) return res.status(404).send({message: 'No Cuenta not found'});
        //Actualizar
        let updatedFavorite = await Favorites.findOneAndUpdate(
            {_id: favoriteId},
            data,
            {new: true}
        )
        if(!updatedFavorite) return res.send({message: 'Favorite not found and not updated'});
        return res.send({message: 'Favorite updated:', updatedFavorite});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating favorite'});
    }
}

exports.deleteFavorite = async(req, res)=>{
    try{
        let idfavorite = req.params.id;
        let deletedFavorite = await Favorites.findOneAndDelete({_id: idfavorite});
        if(!deletedFavorite) return res.status(404).send({message: 'Error removing favorite or already deleted'});
        return res.send({message: 'Favorite deleted sucessfully', deletedFavorite});
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error removing favorite'})
    }
}