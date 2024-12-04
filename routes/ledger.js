import express from 'express';
import { createLedgerEntry, getAllLedgerEntries, getLedgerEntryById, updateLedgerEntry, deleteLedgerEntry } from '../models/ledgerModel.js';

const router = express.Router();

// Get all ledger entries
router.get('/', async (req, res) => {
    try {
        const entries = await getAllLedgerEntries();
        res.json(entries);
    } catch (err) {
        console.error('Error fetching ledger entries:', err);
        res.status(500).send('Server Error');
    }
});

// Create a new ledger entry
router.post('/', async (req, res) => {
    const ledgerData = req.body;

    try {
        await createLedgerEntry(ledgerData);
        res.status(201).send('Ledger entry created');
    } catch (err) {
        console.error('Error creating ledger entry:', err);
        res.status(500).send('Error creating ledger entry');
    }
});

// Other routes for update, delete, and retrieving a single ledger entry

export default router;
