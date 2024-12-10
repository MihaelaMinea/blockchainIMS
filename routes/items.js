import express from 'express';
import Joi from 'joi';
import Item from '../models/Item.js';

const router = express.Router();

// Render the form for adding a new item
router.get('/new', (req, res) => {
    res.render('newItemForm', { title: 'BlockchainIMS app', message: 'Inventory Form' });
});

// Render the form for updating an item
router.get('/update', async (req, res) => {
    try {
        const items = await Item.getItems();
        res.render('updateItemForm', { title: 'Update Item', message: 'Update Form', items });
    } catch (err) {
        console.error('Error fetching items:', err);
        res.status(500).send('Server Error');
    }
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

//  Route to fetch item data for populating the form
// Fetch item data by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.getItemById(req.params.id);
        if (!item) return res.status(404).send('Item not found');
        res.json(item);
    } catch (err) {
        console.error('Error fetching item:', err);
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

// Update an existing item
router.post('/update', async (req, res) => {
    const { itemId, name, description, supplier, price, quantity, category, dateReceived } = req.body;

    if (!itemId) {
        return res.status(400).send('Item ID is required');
    }

    const updatedItem = {
        name,
        description,
        supplier,
        price: Number(price),
        quantity: Number(quantity),
        category,
        dateReceived,
    };

    try {
        await Item.updateItem(itemId, updatedItem);
        res.redirect('/api/items'); // Redirect to dashboard after update
    } catch (err) {
        console.error('Error updating item:', err);
        res.status(500).send('Error updating item in the database');
    }
});

// Route to delete an item
router.post('/delete/:id', async (req, res) => {
    try {
        await Item.deleteItem(req.params.id);
        res.redirect('/api/items'); // Redirect to dashboard after deletion
    } catch (err) {
        console.error('Error deleting item:', err);
        res.status(500).send('Error deleting item from the database');
    }
});

export default router;
