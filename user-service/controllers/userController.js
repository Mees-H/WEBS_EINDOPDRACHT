const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        });

        await user.save();

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

        console.log('User logged in successfully');
        console.log('User ID: ' + user._id);
        console.log('JWT Secret: ' + process.env.JWT_SECRET);

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JTW_EXPIRE_TIME });

        res.status(200).json({ token, message: 'User logged in successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    register,
    login,
};