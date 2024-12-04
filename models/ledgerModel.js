import { ledgerDB } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid'; // UUID for document IDs

// Create a new ledger entry
export const createLedgerEntry = async (ledgerData) => {
    try {
        const newEntry = {
            _id: uuidv4(), // Generate unique ID
            ...ledgerData, // Merge ledger data
            createdAt: new Date(),
        };
        const response = await ledgerDB.insert(newEntry);
        return response;
    } catch (error) {
        throw new Error(`Error creating ledger entry: ${error.message}`);
    }
};

// Fetch all ledger entries
export const getAllLedgerEntries = async () => {
    try {
        const response = await ledgerDB.list({ include_docs: true });
        return response.rows.map(row => row.doc);
    } catch (error) {
        throw new Error(`Error fetching ledger entries: ${error.message}`);
    }
};

// Fetch a single ledger entry by ID
export const getLedgerEntryById = async (id) => {
    try {
        const entry = await ledgerDB.get(id);
        return entry;
    } catch (error) {
        throw new Error(`Error fetching ledger entry by ID: ${error.message}`);
    }
};

// Update a ledger entry by ID
export const updateLedgerEntry = async (id, updatedData) => {
    try {
        const existingEntry = await ledgerDB.get(id);
        const updatedEntry = {
            ...existingEntry,
            ...updatedData,
            updatedAt: new Date(),
        };
        const response = await ledgerDB.insert(updatedEntry);
        return response;
    } catch (error) {
        throw new Error(`Error updating ledger entry: ${error.message}`);
    }
};

// Delete a ledger entry by ID
export const deleteLedgerEntry = async (id) => {
    try {
        const entry = await ledgerDB.get(id);
        const response = await ledgerDB.destroy(id, entry._rev); // Deleting by ID and revision
        return response;
    } catch (error) {
        throw new Error(`Error deleting ledger entry: ${error.message}`);
    }
};
