import NodeCouchDb from 'node-couchdb';
import dotenv from 'dotenv';

dotenv.config();

const couch = new NodeCouchDb({
    auth: {
        user: process.env.COUCHDB_USER,
        pass: process.env.COUCHDB_PASSWORD,
    },
});

const stateDbName = process.env.COUCHDB_STATE_DB;  // e.g. 'state_ims'
const ledgerDbName = process.env.COUCHDB_LEDGER_DB; // e.g. 'ledger_ims'

class Item {

    static async getItems() {
        try {
            const response = await couch.get(stateDbName, '_all_docs', { include_docs: true });
            return response.data.rows
                .map(row => row.doc)
                .filter(doc => doc.type === 'item'); // Only return documents with type 'item'
        } catch (error) {
            throw new Error(`Error fetching items: ${error.message}`);
        }
    }
    



    static async createItem(itemData) {
        try {
            // Ensure itemData fields are properly typed
            itemData.price = Number(itemData.price); // Convert price to a number
            itemData.quantity = Number(itemData.quantity); // Convert quantity to a number
            
            // Add the type field to itemData
            itemData.type = 'item'; // Set the type for the item
    
            // Insert the item into CouchDB
            const response = await couch.insert(stateDbName, itemData);
    
            return response.data; // Return the response data, which should include the new document
        } catch (error) {
            throw new Error(`Error saving item: ${error.message}`);
        }
    }
    
}

export default Item;
