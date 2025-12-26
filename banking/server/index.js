import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });
const app = express();
const PORT = 3000;
const mongourl = process.env.MONGO_URL;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000,
    dbName: 'banking'
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error:', err));

mongoose.connection.on('error', err => {
    console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});
// Routes

// Register Endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, initialBalance } = req.body;

        // Simple validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            balance: initialBalance || 0
        });

        await newUser.save();

        res.status(201).json({
            message: 'User created successfully',
            userId: newUser._id
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('Login attempt for:', username);
        console.log('Current Mongoose State:', mongoose.connection.readyState);
        // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                balance: user.balance
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
