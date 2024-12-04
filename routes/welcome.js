import express from 'express';
const router = express.Router();

// Root route
router.get('/', (req, res) => {
    res.render('welcome', { title: 'BlockchainIMS', message: 'Welcome to the Inventory Management System' });
});

export default router;
