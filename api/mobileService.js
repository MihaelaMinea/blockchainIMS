

import QRCode from 'qrcode';  // Import the QRCode library
import Item from '../models/Item.js';  // Import your Item model
import logger from '../logger.js';  // Logger for debugging purposes
import NodeCouchDb from 'node-couchdb';

const couch = new NodeCouchDb({
    host: process.env.COUCHDB_HOST,
    port: process.env.COUCHDB_PORT,
    auth: {
        user: process.env.COUCHDB_USER,
        pass: process.env.COUCHDB_PASSWORD,
    },
});

const ledgerDbName = process.env.COUCHDB_LEDGER_DB; // Database for ledger/history

/**
 * Reassemble the ledger history into a state JSON format
 * @param {string} itemId - The unique identifier for the item.
 * @returns {Promise<Object>} - The reassembled state JSON for the item.
 */
export const getItemHistory = async (itemId) => {
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
        return stateItem;
    } catch (error) {
        logger.error(`Error retrieving item history: ${error.message}`);
        throw error; 
    }
};























































// Function to generate base64 encoded QR code for each item in the database
export const generateItemQR = async () => {
    try {
        const items = await Item.getItems();  // Fetch items from the database

        // Create a QR code for each item and store the base64 encoded image
        const qrCodes = await Promise.all(
            items.map(async (item) => {
                const qrCodeData = {
                    _id: item._id,  // Unique identifier for the item
                    _rev: item._rev,  // Revision ID for history tracking in CouchDB
                    name: item.name,  // Item name
                    description: item.description,  // Item description
                    price: item.price,  // Item price
                    quantity: item.quantity,  // Item quantity
                    category: item.category,  // Item category
                    dateReceived: item.dateReceived,  // Date item was received
                    type:item.type
                };

                // Convert the item data into a base64-encoded QR code
                const qrCodeBase64 = await QRCode.toDataURL(JSON.stringify(qrCodeData));

                return {
                    itemId: item._id,
                    itemName:item.name,
                    qrCodeBase64,  // Store the base64 QR code for each item
                };
            })
        );

        return qrCodes;  // Return the array of QR codes
    } catch (error) {
        logger.error('Error generating QR codes: ' + error.message);
        throw error;  // Rethrow the error to be handled elsewhere
    }
};
