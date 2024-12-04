import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Render login form
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Handle login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email' });
        }
        if (!await User.validatePassword(user, password)) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        req.session.user = { email: user.email, role: user.role, type: user.type, id: user.id }; // Save type and id in session
        res.json({ role: user.role, type: user.type, id: user.id }); // Send role, type, and id as JSON response
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Render registration form
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' }); // Render your registration view
});

// Handle user registration
router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' }); // Conflict status code
        }

        const userData = {
            email,
            password,
            role,
        };

        await User.createUser(userData); // Create user
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error.message);
        return res.status(500).json({ error: 'Error creating user' });
    }
});


export default router;
