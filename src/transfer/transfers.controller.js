'use strict'

const Transfers = require('./transfers.model');
const User = require('../user/user.model');

exports.test = (req, res) => {
    res.send({ message: 'Test function is running' });
    console.log(Date())
}

exports.save = async (req, res) => {
    try {
        let data = req.body;
        let user = req.user.sub;
        data.date = Date.now()
        let existnocuenta = await User.findOne({ nocuenta: data.nocuenta });
        if (!existnocuenta) return res.status(400).send({ message: 'Account not found' });
        let existUser = await User.findOne({ _id: user });
        if (!existUser) return res.status(400).send({ message: 'User not found' });
        let existdpi = await User.findOne({ dpi: data.dpi });
        if (!existdpi) return res.status(400).send({ message: 'DPI not found' });
        //Transfiere los datos a la cuenta
        let saldo = existnocuenta.balance + Number(data.monto);
        let updateAcound = await User.findOneAndUpdate({ nocuenta: data.nocuenta }, { balance: saldo }, { new: true });
        //Debita lo transferido al cliente
        let desd = existUser.balance - Number(data.monto);
        let UpdateAcound = await User.findOneAndUpdate({ _id: user }, { balance: desd }, { new: true });
        data.user = req.user.sub
        let transfers = new Transfers(data);
        await transfers.save();
        return res.send({ message: 'Transfer sucessfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error saving Transfer', error: err.message });
    }
}

exports.getTransfer = async (req, res) => {
    try {
        const userId = req.user.sub;
        const transfers = await Transfers.find({ user: userId });
        if (!transfers) {
            return res.status(404).send({ message: 'Transfers not found' });
        }
        return res.send({ message: 'Transfers found', transfers });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting Transfers' });
    }
}

exports.getTransfers = async (req, res) => {
    try {
        let transfersId = req.params.id;
        let transfers = await Transfers.findOne({ _id: transfersId }).populate('user');
        if (!transfers) return res.status(404).send({ message: 'Transfer not found' });
        return res.send({ message: 'Transfer found:', transfers });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting transfer' });
    }
}

exports.updatedTransfer = async (req, res) => {
    try {
        let user = req.user.sub;
        let transferId = req.params.id;
        //Buscar la transferencia
        let transferencia = await Transfers.findOne({ _id: transferId })
        //Tiempo de la transferencia donde estara abierta
        let tiempo = Math.floor(transferencia.date + ((1000 * 60) * 1))
        //Buscar el dpi del que hizo la transferencia
        let user2 = await User.findOne({ dpi: transferencia.dpi })
        //Busca el usuario y sumarle o quitarle el monto
        let user1 = await User.findOne({ _id: user })
        if (Date.now() <= tiempo) {
            //Le resta el monto al cliente que se lo esta mandado
            let newTransferencia1 = Number(transferencia.monto) - Number(user1.monto)
            await User.updateOne({ dpi: transferencia.dpi }, {
                $inc: {
                    balance: (newTransferencia1 * -1),
                }
            })

            let newTransferencia2 = Number(transferencia.monto) + Number(user2.monto)
            await User.updateOne({ dpi: transferencia.dpi }, {
                $inc: {
                    balance: (newTransferencia2 * -1),
                }
            })

            let updatedTransfer = await Transfers.findOneAndUpdate(
                { _id: transferId },
                data,
                { new: true }
            )

            return res.send({ message: 'The transaction has been updated', updatedTransfer });

        }
        return res.send({ message: 'The transaction can only be edited in the first minute' });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating Deposit.' })
    }
}

exports.delete = async (req, res) => {
    try {
        let user = req.user.sub;
        let transferId = req.params.id;
        //Buscar la transferencia y traer el monto enviado
        let transferencia = await Transfers.findOne({ _id: transferId });
        //Tiempo de la transferencia donde estara abierta
        const tiempo = Math.floor(transferencia.date + ((1000 * 60) * 1))
        //Buscar al suuario y debitarle la trasnferencia cancelada
        let user2 = await User.findOne({ dpi: transferencia.dpi });
        //Buscar al usuario y enviarle su nuevo saldo
        let user1 = await User.findOne({ _id: user })
        //Hace la validacion del tiempo
        if (Date.now() <= tiempo) {
            //Le añade lo que le tranfirio al usuario al el mismo
            let newBalance = Number(transferencia.monto) + Number(user1.balance);
            let user1Update = await User.findOneAndUpdate(
                { _id: user },
                { balance: newBalance },
                { new: true }
            )
            //Le quita lo que le tranfirio al usuario
            let newBalanceRest = Number(user2.balance) - Number(transferencia.monto);
            let user2Update = await User.findOneAndUpdate(
                { dpi: transferencia.dpi },
                { balance: newBalanceRest },
                { new: true }
            )
            //Eliminar la transferencia realizada
            let transfer = await Transfers.findOneAndDelete(
                { _id: transferId }
            )
            return res.send({ message: 'The transfer was canceled' })
        }
        return res.send({ message: 'Cancellation time has expired' })

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error ocurred' })
    }
}