// server.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('./db');
const { User, Assignment } = require('./models/models');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Middleware to authenticate user
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied.');

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = user;
        next();
    });
};

// User Registration
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });

    try {
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('Invalid credentials.');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid credentials.');

    const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret');
    res.json({ token });
});

// Upload Assignment
app.post('/upload', authenticate, async (req, res) => {
    const { task, admin } = req.body;
    const assignment = new Assignment({
        userId: req.user.id,
        task,
        admin,
    });

    try {
        await assignment.save();
        res.status(201).send('Assignment uploaded successfully');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Fetch all Admins
app.get('/admins', authenticate, async (req, res) => {
    const admins = await User.find({ role: 'admin' });
    res.json(admins);
});

// Admin Login
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await User.findOne({ username, role: 'admin' });
    if (!admin) return res.status(400).send('Invalid credentials.');

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(400).send('Invalid credentials.');

    const token = jwt.sign({ id: admin._id, role: admin.role }, 'your_jwt_secret');
    res.json({ token });
});

// View Assignments
app.get('/assignments', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied.');

    const assignments = await Assignment.find({ admin: req.user.username });
    res.json(assignments);
});

// Accept Assignment
app.post('/assignments/:id/accept', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied.');

    try {
        const assignment = await Assignment.findByIdAndUpdate(req.params.id, { status: 'accepted' }, { new: true });
        res.json(assignment);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Reject Assignment
app.post('/assignments/:id/reject', authenticate, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied.');

    try {
        const assignment = await Assignment.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
        res.json(assignment);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
