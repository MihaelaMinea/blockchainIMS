import express from 'express';
import Joi from 'joi';
import Item from '../models/Item.js';
import NodeCouchDb from 'node-couchdb';
import logger from '../logger.js';


const router = express.Router();
const couch = new NodeCouchDb({
    host: process.env.COUCHDB_HOST,
    port: process.env.COUCHDB_PORT,
    auth: {
        user: process.env.COUCHDB_USER,
        pass: process.env.COUCHDB_PASSWORD,
    },
});
const ledgerDbName = process.env.COUCHDB_LEDGER_DB; // Database for ledger/history


// Route to get item history by itemId 
router.get('/:itemId/history', async (req, res) => {
    const { itemId } = req.params; // Extract itemId from the URL parameters

    try {
        if (!itemId) {
            throw new Error('Invalid request: Missing item ID');
        }

        // Query the ledger database for the item's history based on its stateId
        const response = await couch.get(ledgerDbName, '_all_docs', {
            include_docs: true,
            startkey: `${itemId}_`,  // Start from the first ledger entry for this item
            endkey: `${itemId}_\ufff0`,  // End at the last ledger entry for this item
        });

        // Extract the ledger entries from the response
        const ledgerEntries = response.data.rows.map(row => row.doc);

        if (ledgerEntries.length === 0) {
            throw new Error(`No history found for item: ${itemId}`);
        }

        // Reassemble the state format
        let stateItem = {
            _id: itemId,
            _rev: null,  // Initialize _rev, this will be updated with the first create action
            name: '',
            description: '',
            supplier: '',
            price: 0,
            quantity: 0,
            category: '',
            dateReceived: '',
            updates: [],
        };

        // Apply each ledger entry to the stateItem, starting with the initial state
        let isInitialStateSet = false;  // Flag to track if we have set the initial state with the first 'create' action

        ledgerEntries.forEach(entry => {
            const { stateId, stateRev, name, description, supplier, price, quantity, category, dateReceived, action } = entry;

            if (action === 'create' && !isInitialStateSet) {
                // This is the initial state, so set the state properties
                stateItem._rev = stateRev;  // Set the revision for the state item
                stateItem.name = name;
                stateItem.description = description;
                stateItem.supplier = supplier;
                stateItem.price = price;
                stateItem.quantity = quantity;
                stateItem.category = category;
                stateItem.dateReceived = dateReceived;

                isInitialStateSet = true;  // Mark the initial state as set
            }

            // Add an entry for each update
            if (action === 'update') {
                stateItem.updates.push({
                    _rev: stateRev,  // Use the _rev from the update action
                    timestamp: entry.timestamp,
                    changes: {
                        name,
                        description,
                        supplier,
                        price,
                        quantity,
                        category,
                        dateReceived,
                    },
                });

                // Update the state item with the latest changes (important to keep it consistent)
                stateItem.name = name;
                stateItem.description = description;
                stateItem.supplier = supplier;
                stateItem.price = price;
                stateItem.quantity = quantity;
                stateItem.category = category;
                stateItem.dateReceived = dateReceived;
            }
        });

        // Remove any fields that might still be `null` (this is just a cleanup step)
        Object.keys(stateItem).forEach(key => {
            if (stateItem[key] === null || stateItem[key] === undefined) {
                delete stateItem[key];
            }
        });

        // Return the reassembled state JSON with the updates
        logger.info(`Successfully reassembled history for item: ${itemId}. State: ${JSON.stringify(stateItem)}`);
        res.json({ history: stateItem });

    } catch (error) {
        logger.error(`Failed to load history for item ${itemId}: ${error.message}`);
        res.status(500).json({ error: 'Error retrieving item history' });
    }
});



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

// Render the form for scrapping an item
router.get('/scrap', async (req, res) => {
    try {
        const items = await Item.getItems();
        res.render('scrapAssetForm', { title: 'Scrap Asset', message: 'Scrapped', items });
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


// Scrap an existing item
router.post('/scrap', async (req, res) => {
    const { itemId, dateScrapped } = req.body;

    // Validate input
    if (!itemId || !dateScrapped) {
        return res.status(400).send('Item ID and scrapped date are required');
    }

    try {
        const scrapDetails = { dateScrapped }; // Create the scrap details object
        const result = await Item.scrapItem(itemId, scrapDetails);

        console.log('Scrap result:', result);

        // Redirect to the dashboard after successful scrapping
        res.redirect('/api/items');
    } catch (err) {
        console.error('Error scrapping item:', err);

        // Return an error response
        res.status(500).send('Error scrapping item in the database');
    }
});

































export default router;
