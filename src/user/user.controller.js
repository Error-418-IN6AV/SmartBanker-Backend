'use strict'

const User = require('./user.model');
const { validateData, encrypt, checkPassword } = require('../utils/validate');
const { createToken } = require('../services/jwt');

exports.test = (req, res) => {
    res.send({ message: 'Test function is running' });
}

exports.userAdmin = async () => {
    try {
        let data = {
            name: 'jose',
            surname: 'cifuentes',
            username: 'admin',
            phone: '58554785',
            email: 'josecifuentes@gmail.com',
            password: 'admin',
            role: 'ADMIN'
        }
        data.password = await encrypt(data.password)
        let existAdmin = await User.findOne({ name: 'jose' });
        if (existAdmin) return console.log('Default admin already createad');
        let admin = new User(data);
        await admin.save();
        return console.log('Default admin created');
    } catch (err) {
        return console.error(err);
    }
}

exports.register = async (req, res) => {
    try {
        let data = req.body;
        let params = {
            password: data.password,
        }
        let validate = validateData(params);
        if (validate) return res.status(400).send(validate);
        data.role = 'WORKER';
        data.password = await encrypt(data.password)
        let user = new User(data);
        await user.save();
        return res.send({ message: 'Account created sucessfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating account', error: err.message })
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
                username: user.username,
                role: user.role
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


exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({
            $or: [
                { role: 'WORKER' },
                { role: 'CLIENT' }
            ]
        }, { password: 0 });

        return res.send({ message: 'Users found', users });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting users' });
    }
}

exports.getClient = async (req, res) => {
    try {
        let client = await User.find({ role: 'CLIENT' });
        return res.send({ message: 'Client found', client });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting client' });
    }
}

exports.getUser = async (req, res) => {
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

exports.update = async (req, res) => {
    try {
        let userId = req.params.id;
        let data = req.body;
        if (data.dpi || Object.entries(data).length === 0) return res.status(400).send({ message: 'Have submitted some data that cannot be updated' });
        let accountUpdate = await User.findOneAndUpdate(
            { _id: userId },
            data,
            { new: true }
        )
        if (!accountUpdate) return res.status(404).send({ message: 'User not found adn not updated' });
        return res.send({ message: 'Account updated', accountUpdate })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error not updated account' });
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