'use strict'

const Favorites = require('./favorites.model')
const User = require('../user/user.model')

exports.test = (req, res)=>{
    res.send({message: 'Funcion de prueba'})
}

exports.add = async (req, res) => {
    try {
        let data = req.body;
        let user = req.user.sub 
        const userExists = await User.exists({ nocuenta: data.nocuenta });
        if (!userExists) {
            return res.send({ message: 'Invalid nocuenta. User does not exist' });
        }
        const dpiExists = await User.exists({ dpi: data.dpi });
        if (!dpiExists) {
            return res.send({ message: 'DPI does not exist' });
        }
        //validar duplicados
        const existingFavorite = await Favorites.findOne({ user, nocuenta: data.nocuenta });
        if (existingFavorite) {
        return res.send({ message: 'Favorite with the same nocuenta already exists' });
        }
        //validar que no me deje agregar a mi mimsmo a favorits
        const userFavorite = await User.findOne({ nocuenta: data.nocuenta });
        if (userFavorite._id.toString() === user) {
            return res.send({ message: 'You cannot add the favorite to yourself' });
        }
        data.user = req.user.sub
        let favorites = new Favorites(data);
        await favorites.save();
        return res.send({ message: 'Favorite created sucessfully' , favorites});
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating favorite', error: err.message })
    }
}

exports.getById = async(req, res)=>{
    try{
        //Obtener el Id 
        let favoriteId = req.params.id;
        //Buscarlo en BD
        let favorite = await Favorites.findOne({_id: favoriteId}).populate('nocuenta');
        //Valido que exista 
        if(!favorite) return res.status(404).send({message: 'Favorite not found'});
        //Si existe lo devuelvo
        return res.send({message: 'Favorite found:', favorite});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting favorite'});
    }
}

exports.get = async(req, res)=>{
    try{      
        const userId = req.user.sub;
        const favorites = await Favorites.find({ user: userId });
        if (!favorites) {
            return res.status(404).send({ message: 'Favorites not found' });
        }
        return res.send({ message: 'Favorites found', favorites });
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting favorites'});
    }
}

exports.update = async(req, res)=>{
    try{
        //obtener el Id del favorito
        let favoriteId = req.params.id;
        //obtener la data a actualizar
        let data = req.body;
        const user = req.user.sub;
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
        return res.send({message: 'Favorite deleted sucessfully',   });
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error removing favorite'})
    }
}