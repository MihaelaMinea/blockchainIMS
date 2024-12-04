// routes/dashboard.js

import express from 'express';

const router = express.Router();

// CEO Dashboard
router.get('/ceo', (req, res) => {
    res.render('dashboard', { title: 'CEO Dashboard', role: 'CEO' });
});

// Manager Dashboard
router.get('/manager', (req, res) => {
    res.render('dashboard', { title: 'Manager Dashboard', role: 'Manager' });
});

// Assistant Dashboard
router.get('/assistant', (req, res) => {
    res.render('dashboard', { title: 'Assistant Dashboard', role: 'Assistant' });
});

export default router;
