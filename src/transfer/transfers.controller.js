'use strict'

const Transfers = require('./transfers.model');
const User = require('../user/user.model');

exports.test = (req, res) => {
    res.send({ message: 'Test function is running' });
}

exports.save = async (req, res) => {
    try {
        let data = req.body;
        data.date = new Date();
        let transfers = new Transfers(data);
        await transfers.save();
        return res.send({ message: 'Transfer created sucessfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error saving Transfer', error: err.message });
    }
}

exports.getTransfer = async (req, res) => {
    try {
        let transfer = await Transfers.find();
        return res.send({ message: 'Transfer found', transfer });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting transfer' });
    }
}


exports.getTransfers = async (req, res) => {
    try {
        let transfersId = req.params.id;
        let transfer = await Transfers.findOne({ _id: transfersId })
        if (!transfer) return res.status(404).send({ message: 'Transfer not found' })
        return res.send({ message: 'Transfer found ', transfer })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting transfer' })
    }
}

exports.getTransfers = async (req, res) => {
    try {
        let transfersId = req.params.id;
        let transfer = await Transfers.findOne({ _id: transfersId }).populate('user');
        if (!transfer) return res.status(404).send({ message: 'Transfer not found' });
        return res.send({ message: 'Transfer found:', transfer });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting transfer' });
    }
}

exports.updatedTransfer = async (req, res) => {
    try {
        let transferId = req.params.id;
        let data = req.body;
        let existUser = await User.findOne({ _id: data.user });
        if (!existUser) return res.status(404).send({ message: 'transfer not found' });
        let updatedTransfer = await Transfers.findOneAndUpdate(
            { _id: transferId },
            data,
            { new: true }
        )
        if (!updatedTransfer) return res.send({ message: 'Transfer not found and not updated' });
        return res.send({ message: 'Transfer updated:', updatedTransfer });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating transfer' });
    }
}

exports.delete = async (req, res) => {
    try {
        const transferId = req.params.id;
        const deletedTransfers = await Transfers.findByIdAndDelete(transferId);
        if (!deletedTransfers) {
            return res.status(404).send({ message: 'transfer not found' });
        }
        return res.send({ message: 'transfer deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Could not delete transfer' });
    }
}
