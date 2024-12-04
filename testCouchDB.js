import NodeCouchDb from 'node-couchdb';
import dotenv from 'dotenv';

dotenv.config();

const couch = new NodeCouchDb({
    auth: {
        user: process.env.COUCHDB_USER,
        pass: process.env.COUCHDB_PASSWORD
    }
});

// Function to check if a database exists
const checkDatabase = async (dbName) => {
    try {
        const databases = await couch.listDatabases();
        const dbExists = databases.includes(dbName); // Check if the database is in the list
        if (dbExists) {
            console.log(`Database ${dbName} exists.`);
            return true;
        } else {
            console.log(`Database ${dbName} does not exist.`);
            return false;
        }
    } catch (error) {
        console.error(`Error checking database ${dbName}:`, error);
        throw error; // Rethrow other errors
    }
};

// Main function to execute checks
const main = async () => {
    await checkDatabase(process.env.COUCHDB_STATE_DB);
    await checkDatabase(process.env.COUCHDB_LEDGER_DB);
};

// Run the main function
main().catch(err => console.error(err));
