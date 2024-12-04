import { stateIMSDB } from '../config/couchdb.js';
import { v4 as uuidv4 } from 'uuid'; // UUID for document IDs

// Create a new item
export const createItem = async (itemData) => {
    try {
        const newItem = {
            _id: uuidv4(), // Generate a unique ID
            ...itemData,   // Merge item data
            createdAt: new Date(),
        };
        const response = await stateIMSDB.insert(newItem);
        return response;
    } catch (error) {
        throw new Error(`Error creating item: ${error.message}`);
    }
};

// Fetch all items
export const getAllItems = async () => {
    try {
        const response = await stateIMSDB.list({ include_docs: true });
        return response.rows.map(row => row.doc);
    } catch (error) {
        throw new Error(`Error fetching items: ${error.message}`);
    }
};

// Fetch a single item by ID
export const getItemById = async (id) => {
    try {
        const item = await stateIMSDB.get(id);
        return item;
    } catch (error) {
        throw new Error(`Error fetching item by ID: ${error.message}`);
    }
};

// Update an item by ID
export const updateItem = async (id, updatedData) => {
    try {
        const existingItem = await stateIMSDB.get(id);
        const updatedItem = {
            ...existingItem,
            ...updatedData,
            updatedAt: new Date(),
        };
        const response = await stateIMSDB.insert(updatedItem);
        return response;
    } catch (error) {
        throw new Error(`Error updating item: ${error.message}`);
    }
};

// Delete an item by ID
export const deleteItem = async (id) => {
    try {
        const item = await stateIMSDB.get(id);
        const response = await stateIMSDB.destroy(id, item._rev); // Deleting by ID and revision
        return response;
    } catch (error) {
        throw new Error(`Error deleting item: ${error.message}`);
    }
};
