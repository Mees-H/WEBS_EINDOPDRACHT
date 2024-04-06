const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendMessageToQueue } = require('../common-modules/messageQueueService');
const queueOptions = require('../common-modules/messageQueueNames');

async function register(req, res) {
    try {
        console.log('registering user' + req.body.username + ' ' + req.body.password);
        if (!req.body.password || typeof req.body.password !== 'string') {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
        });

        await user.save();

        sendMessageToQueue(queueOptions.userCreate, user.toObject());

        res.status(201).json({ user, message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            throw new Error('Incorrect password');
        }

        const expiresIn = process.env.JWT_EXPIRE_TIME || '1h';
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: expiresIn });

        sendMessageToQueue(queueOptions.userLogin, user.toObject());

        res.status(200).json({ token, message: 'User logged in successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    register,
    login,
};