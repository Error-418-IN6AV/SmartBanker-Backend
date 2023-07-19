'use strict'

const User = require('./user.model');
const Transfers = require('../transfer/transfers.model');
const { validateData, encrypt, checkPassword } = require('../utils/validate');
const { createToken } = require('../services/jwt');

exports.test = (req, res) => {
    res.send({ message: 'Test function is running' });
}

exports.userAdmin = async () => {
    try {
        let data = {
            name: 'admin',
            surname: 'ADMINB',
            username: 'ADMINB',
            phone: '58554785',
            dpi: '1252525632522',
            balance: '99999',
            nocuenta: '12522548',
            location: 'Guatemala',
            email: 'ADMINB@gmail.com',
            password: 'ADMINB',
            role: 'ADMIN'
        }
        data.password = await encrypt(data.password);
        let existAdmin = await User.findOne({ name: 'admin' });
        if (existAdmin) return console.log('Default admin already createad');
        let admin = new User(data);
        await admin.save();
        return console.log('Default admin created');
    } catch (err) {
        return console.error(err);
    }
}

exports.addWorkers = async (req, res) => {
    try {
        let data = req.body;
        let existUser = await User.findOne({ username: data.username });
        if (existUser) return res.status(404).send({ message: 'Worker already exists' })
        let existphone = await User.findOne({ phone: data.phone });
        if (existphone) return res.status(404).send({ message: 'Client Phone already exists' })
        let params = {
            password: data.password,
        }
        let validate = validateData(params);
        if (validate) return res.status(400).send(validate);
        data.role = 'WORKER';
        data.password = await encrypt(data.password);
        let user = new User(data);
        await user.save();
        return res.send({ message: 'Account created sucessfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error saving worker', error: err.message });
    }
}

exports.save = async (req, res) => {
    try {
        let data = req.body;
        let existUser = await User.findOne({ username: data.username });
        if (existUser) return res.status(404).send({ message: 'Client already exists' })
        let params = {
            password: data.password,
        }
        let validate = validateData(params);
        if (validate) return res.status(400).send(validate);
        data.role = 'CLIENT';
        let existDPI = await User.findOne({ dpi: data.dpi });
        if (existDPI) return res.status(404).send({ message: 'Client DPI already exists' })
        if (data.dpi.length > 13 || data.dpi.length < 13) return res.status(400).send({ message: 'Error DPI' });
        let existphone = await User.findOne({ phone: data.phone });
        if (existphone) return res.status(404).send({ message: 'Client Phone already exists' })
        if (data.phone.length > 8 || data.phone.length < 8) return res.status(400).send({ message: 'Error phone' });
        data.nocuenta = Math.floor(Math.random() * 999999999);
        if (data.monthlyincome < 100) return res.status(400).send({ message: 'Error Mont' });
        if (data.balance < 150) return res.status(400).send({ message: 'Error Balance' });
        data.movements = 1;
        data.password = await encrypt(data.password);
        let user = new User(data);
        await user.save();
        return res.send({ message: 'Account created sucessfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error saving client', error: err.message });
    }
}

exports.login = async (req, res) => {
    try {
        let data = req.body;
        let credentials = {
            username: data.username,
            password: data.password
        }
        let msg = validateData(credentials);
        if (msg) return res.status(400).send(msg)
        let user = await User.findOne({ username: data.username });
        if (user && await checkPassword(data.password, user.password)) {
            let userLogged = {
                name: user.name,
                surname: user.surname,
                username: user.username,
                nocuenta: user.nocuenta,
                dpi: user.dpi,
                location: user.location,
                phone: user.phone,
                email: user.email,
                namework: user.namework,
                balance: user.balance,
                movements: user.movements,
                role: user.role,
                id: user._id
            }
            let token = await createToken(user)
            return res.send({ message: 'User logged sucessfully', token, userLogged });
        }
        return res.status(401).send({ message: 'Invalid credentials' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error, not logged' });
    }
}

exports.getClient = async (req, res) => {
    try {
        let client = await User.find({ role: 'CLIENT' }).sort({ balance: 1 });
        return res.send({ message: 'Client found', client });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting client' });
    }
}

exports.getClientss = async (req, res) => {
    try {
        let client = await User.find({ role: 'CLIENT' }).sort({ balance: -1 });
        return res.send({ message: 'Client found', client });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting client' });
    }
}

exports.getClients = async (req, res) => {
    try {
        let userId = req.params.id;
        let user = await User.findOne({ _id: userId })
        if (!user) return res.status(404).send({ message: 'User not found' })
        return res.send({ message: 'User found ', user })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting user' })
    }
}

exports.getWorker = async (req, res) => {
    try {
        let worker = await User.find({ role: 'WORKER' });
        return res.send({ message: 'Client found', worker });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting worker' });
    }
}

exports.getWorkers = async (req, res) => {
    try {
        let workerId = req.params.id;
        let worker = await User.findOne({ _id: workerId })
        if (!worker) return res.status(404).send({ message: 'Worker not found' })
        return res.send({ message: 'Worker found ', worker })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting worker' })
    }
}

exports.update = async (req, res) => {
    try {
        let userid = req.params.id;
        let data = req.body;
        let existUser = await User.findOne({ name: data.name });
        if (existUser) { return res.send({ message: 'User already created' }) }
        let updatedUser = await User.findOneAndUpdate(
            { _id: userid },
            data,
            { new: true }
        )
        if (!updatedUser) return res.send({ message: 'User not found and not updated' });
        return res.send({ message: 'User updated:', updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating User' });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).send({ message: 'User not found' });
        }
        return res.send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Could not delete user' });
    }
}