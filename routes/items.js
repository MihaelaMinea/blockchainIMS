import express from 'express';
import Joi from 'joi';
import Item from '../models/Item.js';

const router = express.Router();

// Render the form for adding a new item
router.get('/new', (req, res) => {
    res.render('newItemForm', { title: 'BlockchainIMS app', message: 'Inventory Form' });
});

// Route to render the dashboard with items and their index

router.get('/', async (req, res) => {
    
    try {
        const items = await Item.getItems();
        console.log(items)
        res.render('items', { items });
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).send('Server Error');
    }
});


// Post request to add a new item
router.post('/', async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(25).required(),
        description: Joi.string().min(5).required(),
        supplier: Joi.string().min(3).required(),
        price: Joi.number().min(0).required(),
        quantity: Joi.number().min(1).required(),
        category: Joi.string().required(),
        dateReceived: Joi.date().required()
    });

    const itemRequest = schema.validate(req.body);
    if (itemRequest.error) {
        return res.status(400).send(itemRequest.error.details[0].message);
    }

    const itemData = {
        name: req.body.name,
        description: req.body.description,
        supplier: req.body.supplier,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category,
        dateReceived: req.body.dateReceived
    };

    try {
        await Item.createItem(itemData); // Save item to CouchDB
        res.redirect('/api/items'); // Redirect to dashboard after saving
    } catch (err) {
        res.status(500).send('Error saving item to the database');
    }
});

export default router;
