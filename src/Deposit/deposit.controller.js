'use strict'

const Deposit = require('./deposit.model')
const User = require('../user/user.model')

exports.test = (req, res) => {
    res.send({ message: 'Funcion de prueba' })
    console.log(Date())
}

exports.addDeposito = async (req, res) => {
    try {
        let data = req.body;
        
        data.date = Date.now()
        let existNoCuenta = await User.findOne({ nocuenta: data.noCuenta });
        if (!existNoCuenta) return res.status(400).send({ message: 'Cuenta no encontrada volver a intentar' });
        //Creo mi varible que almacenara la suma de mi balance con el monto 
        let newSaldo = existNoCuenta.balance + Number(data.amount);
        let updateAcound = await User.findOneAndUpdate({ nocuenta: data.noCuenta }, { balance: newSaldo }, { new: true });
        let deposito = new Deposit(data);
        await deposito.save();
        return res.send({ message: 'Deposito exitoso' })
    

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'No se puede completar el deposito' })
    }
};

exports.getDeposits = async (req, res) => {
    //Buscar
    try {
        let deposit = await Deposit.find();
        return res.send({ message: 'Deposit found', deposit })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting Deposits' })
    }
}

exports.getDeposit = async (req, res) => {
    try {
        let depositId = req.params.id;
        let deposit = await Deposit.findOne({ _id: depositId });
        if (!deposit) return res.status(404).send({ message: 'Deposit not found' })
        return res.send({ message: 'Deposit found', deposit });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting Deposit' })
    }
}
       /* const tiempoActual = Math.floor(Date.now() / 1000) //Obtener fecha actual
        const tiempoTransaccion = Math.floor(Date.parse(deposito.date) / 1000) //Obtener fecha que se hizo el deposito
        const diferenciaTiempo = tiempoActual - tiempoTransaccion
        console.log(tiempoActual)
        console.log(tiempoTransaccion)*/

exports.updateDeposit = async (req, res) => {
    try {
        const depositId = req.params.id;
        let data = req.body;
        const deposito = await Deposit.findOne({ _id: depositId }) //Buscar deposito
        const user = await User.findOne({nocuenta: deposito.noCuenta }) //Buscar el usuario por el numero de cuenta
        const tiempo = Math.floor(deposito.date + ((1000*60)*1))
        console.log( new Date(deposito.date))
        console.log(Date.now() <= tiempo)
        if (Date.now() <= tiempo) {

            const newDeposito = deposito.amount - Number(data.amount)
                await User.updateOne({nocuenta: deposito.noCuenta},{
                    $inc:{ // Es una propiedad para aumentar o disminuir  si es negativo disminulle y si es positivo aumenta 
                       balance:(newDeposito * -1),
                    }
                })
            
            const updatedDeposit = await Deposit.findOneAndUpdate(
                { _id: req.params.id },
                data,
                { new: true }
            )

            return res.send({ message: 'La transacción ha sido actualizada.', updatedDeposit });

        }
        return res.send({ message: 'La transacción solo puede ser editada en el primer minuto' });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating Deposit.' })
    }
}




exports.cancelDeposit = async (req, res) => {
    try {
        const depositId = req.params.id;

        const deposito = await Deposit.findOne({ _id: depositId })
        if(!deposito) return res.status(404).send({message: 'No se encuentra el numero del deposito'})
        const tiempo = Math.floor(deposito.date + ((1000*60)*1))
        const user = await User.findOne({nocuenta: deposito.noCuenta})
        if(!user) return res.status(404).send({message: 'Cuenta no encontrada'})
        if(Date.now() <= tiempo){
            let newSaldo = user.balance - deposito.amount;
            const salUpdate = await User.findOneAndUpdate(
                {_id: user._id},
                {balance: newSaldo},
                {new: true}   
            )
            const cancelar = await Deposit.findOneAndDelete(
                {_id: req.params.id}
            )
            return res.send({message: 'El despito se ha cancelado'})
        }
            return res.send({message: 'El tiempo de cancelacion ha expirado'})
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred' });
    }
};