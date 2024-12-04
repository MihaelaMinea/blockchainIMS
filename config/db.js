import NodeCouchDb from 'node-couchdb'; // Import the CouchDB client
import dotenv from 'dotenv';
import logger from '../logger.js'; // Adjust path as needed

dotenv.config();

// Initialize CouchDB
const couch = new NodeCouchDb({
    auth: {
        user: process.env.COUCHDB_USER,
        pass: process.env.COUCHDB_PASSWORD,
    },
});

// Function to check if a database exists
const databaseExists = async (dbName) => {
    logger.info(`Checking existence of database: ${dbName}`);
    try {
        // Attempt to fetch the database
        const response = await couch.get(dbName, '');
        logger.info(`Database ${dbName} exists.`);
        return true; // Database exists
    } catch (error) {
        if (error.statusCode === 404) {
            logger.warn(`Database ${dbName} does not exist.`);
            return false; // Database does not exist
        }
        logger.error(`Error checking existence of database ${dbName}: ${error.message}`);
        throw error; // Rethrow other errors
    }
};

// Function to connect to the database and verify that required databases exist
const connectDB = async () => {
    try {
        const stateDbExists = await databaseExists(process.env.COUCHDB_STATE_DB);
        const ledgerDbExists = await databaseExists(process.env.COUCHDB_LEDGER_DB);

        if (!stateDbExists || !ledgerDbExists) {
            logger.error('One or more required databases do not exist. Exiting.');
            process.exit(1); // Exit if any database does not exist
        }

        logger.info('Both databases verified successfully.');
        return couch; // Return the CouchDB instance for further use
    } catch (error) {
        logger.error('Error connecting to CouchDB: ' + error.message);
        process.exit(1); // Exit the process if connection fails
    }
};

// Export the function and CouchDB instance
export default connectDB;
export { couch as ledgerDB }; // Exporting ledgerDB if needed








// working but cannot fetch data from db ECONNREFUSED 127.0.0.1:5984
// import NodeCouchDb from 'node-couchdb'; // Import the CouchDB client
// import dotenv from 'dotenv';
// import logger from '../logger.js'; // Adjust path as needed

// dotenv.config();

// // Initialize CouchDB
// const couch = new NodeCouchDb({
//     auth: {
//         user: process.env.COUCHDB_USER,
//         pass: process.env.COUCHDB_PASSWORD,
//     },
//     host: process.env.COUCHDB_HOST || 'couchdb', // Default to 'couchdb' if not set
//     protocol: 'http', // Ensure the correct protocol (http or https)
//     port: process.env.COUCHDB_PORT || 5984, // Use the port from the environment or default to 5984
// });

// // Function to check if a database exists
// const databaseExists = async (dbName) => {
//     logger.info(`Checking existence of database: ${dbName}`);
//     try {
//         // Attempt to fetch the database
//         const response = await couch.get(dbName, '');
//         logger.info(`Database ${dbName} exists.`);
//         return true; // Database exists
//     } catch (error) {
//         if (error.statusCode === 404) {
//             logger.warn(`Database ${dbName} does not exist.`);
//             return false; // Database does not exist
//         }
//         logger.error(`Error checking existence of database ${dbName}: ${error.message}`);
//         throw error; // Rethrow other errors
//     }
// };

// // Function to connect to the database and verify that required databases exist
// const connectDB = async () => {
//     try {
//         const stateDbExists = await databaseExists(process.env.COUCHDB_STATE_DB);
//         const ledgerDbExists = await databaseExists(process.env.COUCHDB_LEDGER_DB);

//         if (!stateDbExists || !ledgerDbExists) {
//             logger.error('One or more required databases do not exist. Exiting.');
//             process.exit(1); // Exit if any database does not exist
//         }

//         logger.info('Both databases verified successfully.');
//         return couch; // Return the CouchDB instance for further use
//     } catch (error) {
//         logger.error('Error connecting to CouchDB: ' + error.message);
//         process.exit(1); // Exit the process if connection fails
//     }
// };

// // Export the function and CouchDB instance
// export default connectDB;
// export { couch as ledgerDB }; // Exporting ledgerDB if needed


// import NodeCouchDb from 'node-couchdb';
// import dotenv from 'dotenv';
// import logger from '../logger.js'; // Adjust path as needed

// // Load environment variables
// dotenv.config();

// // Log the CouchDB host to ensure the environment variable is loaded correctly
// logger.info('CouchDB Host:', process.env.COUCHDB_HOST);

// // Ensure the environment variables are available
// const COUCHDB_HOST = process.env.COUCHDB_HOST;
// const COUCHDB_PORT = process.env.COUCHDB_PORT || 5984; // Default to 5984 if not set

// // Check if required environment variables are set
// if (!COUCHDB_HOST || !process.env.COUCHDB_USER || !process.env.COUCHDB_PASSWORD) {
//     logger.error('Missing required CouchDB environment variables (COUCHDB_HOST, COUCHDB_USER, COUCHDB_PASSWORD). Exiting.');
//     process.exit(1); // Exit if required variables are missing
// }

// // Create the CouchDB URL
// const COUCHDB_URL = `http://${COUCHDB_HOST}:${COUCHDB_PORT}`;
// logger.info(`Connecting to CouchDB at: ${COUCHDB_URL}`);

// // Initialize CouchDB
// const couch = new NodeCouchDb({
    
//     auth: {
//         user: process.env.COUCHDB_USER,
//         pass: process.env.COUCHDB_PASSWORD,
//     },
//     host: COUCHDB_HOST, // Use environment variable directly here
//     protocol: 'http',
//     port: COUCHDB_PORT,
//     url: COUCHDB_URL, // Use the full URL for connection
// });

// // Function to check if a database exists
// const databaseExists = async (dbName) => {
//     logger.info(`Checking existence of database: ${dbName}`);
//     try {
//         // Attempt to fetch the database
//         const response = await couch.get(dbName, '');
//         logger.info(`Database ${dbName} exists.`);
//         return true; // Database exists
//     } catch (error) {
//         if (error.statusCode === 404) {
//             logger.warn(`Database ${dbName} does not exist.`);
//             return false; // Database does not exist
//         }
//         logger.error(`Error checking existence of database ${dbName}: ${error.message}`);
//         throw error; // Rethrow other errors
//     }
// };

// // Function to connect to the database and verify that required databases exist
// const connectDB = async () => {
//     try {
//         const stateDbExists = await databaseExists(process.env.COUCHDB_STATE_DB);
//         const ledgerDbExists = await databaseExists(process.env.COUCHDB_LEDGER_DB);

//         if (!stateDbExists || !ledgerDbExists) {
//             logger.error('One or more required databases do not exist. Exiting.');
//             process.exit(1); // Exit if any database does not exist
//         }

//         logger.info('Both databases verified successfully.');
//         return couch; // Return the CouchDB instance for further use
//     } catch (error) {
//         logger.error('Error connecting to CouchDB: ' + error.message);
//         process.exit(1); // Exit the process if connection fails
//     }
// };

// // Export the function and CouchDB instance
// export default connectDB;
// export { couch as ledgerDB }; // Exporting ledgerDB if needed


// import NodeCouchDb from 'node-couchdb';
// import dotenv from 'dotenv';
// import logger from '../logger.js'; // Adjust path as needed

// // Load environment variables as the very first thing in the code
// dotenv.config();

// // Ensure that the environment variables are loaded and log them
// const COUCHDB_HOST = process.env.COUCHDB_HOST;
// const COUCHDB_USER = process.env.COUCHDB_USER;
// const COUCHDB_PASSWORD = process.env.COUCHDB_PASSWORD;
// const COUCHDB_PORT = process.env.COUCHDB_PORT || 5984; // Default to 5984 if not set
// const COUCHDB_STATE_DB = process.env.COUCHDB_STATE_DB;
// const COUCHDB_LEDGER_DB = process.env.COUCHDB_LEDGER_DB;

// // Log environment variables to confirm they are loaded properly
// logger.info('Environment variables loaded:');
// logger.info(`COUCHDB_HOST: ${COUCHDB_HOST}`);
// logger.info(`COUCHDB_USER: ${COUCHDB_USER}`);
// logger.info(`COUCHDB_PASSWORD: ${COUCHDB_PASSWORD}`);
// logger.info(`COUCHDB_PORT: ${COUCHDB_PORT}`);
// logger.info(`COUCHDB_STATE_DB: ${COUCHDB_STATE_DB}`);
// logger.info(`COUCHDB_LEDGER_DB: ${COUCHDB_LEDGER_DB}`);

// // Check if required environment variables are set
// if (!COUCHDB_HOST || !COUCHDB_USER || !COUCHDB_PASSWORD || !COUCHDB_STATE_DB || !COUCHDB_LEDGER_DB) {
//     logger.error('Missing required CouchDB environment variables. Exiting.');
//     console.error('Missing required CouchDB environment variables.');
//     process.exit(1); // Exit if required variables are missing
// }

// // Create the CouchDB URL
// const COUCHDB_URL = `http://${COUCHDB_HOST}:${COUCHDB_PORT}`;
// logger.info(`Connecting to CouchDB at: ${COUCHDB_URL}`);

// // Initialize CouchDB
// const couch = new NodeCouchDb({
//     auth: {
//         user: COUCHDB_USER,
//         pass: COUCHDB_PASSWORD,
//     },
//     host: COUCHDB_HOST, // Use environment variable directly here
//     protocol: 'http',
//     port: COUCHDB_PORT,
//     url: COUCHDB_URL, // Use the full URL for connection
// });

// // Function to check if a database exists
// const databaseExists = async (dbName) => {
//     logger.info(`Checking existence of database: ${dbName}`);
//     try {
//         // Attempt to fetch the database
//         const response = await couch.get(dbName, '');
//         logger.info(`Database ${dbName} exists.`);
//         return true; // Database exists
//     } catch (error) {
//         if (error.statusCode === 404) {
//             logger.warn(`Database ${dbName} does not exist.`);
//             return false; // Database does not exist
//         }
//         logger.error(`Error checking existence of database ${dbName}: ${error.message}`);
//         throw error; // Rethrow other errors
//     }
// };

// // Function to connect to the database and verify that required databases exist
// const connectDB = async () => {
//     try {
//         const stateDbExists = await databaseExists(COUCHDB_STATE_DB);
//         const ledgerDbExists = await databaseExists(COUCHDB_LEDGER_DB);

//         if (!stateDbExists || !ledgerDbExists) {
//             logger.error('One or more required databases do not exist. Exiting.');
//             process.exit(1); // Exit if any database does not exist
//         }

//         logger.info('Both databases verified successfully.');
//         return couch; // Return the CouchDB instance for further use
//     } catch (error) {
//         logger.error('Error connecting to CouchDB: ' + error.message);
//         process.exit(1); // Exit the process if connection fails
//     }
// };

// // Export the function and CouchDB instance
// export default connectDB;
// export { couch as ledgerDB }; // Exporting ledgerDB if needed

// import NodeCouchDb from 'node-couchdb';
// import dotenv from 'dotenv';
// import logger from '../logger.js';
// import { promisify } from 'util';
// import delay from 'delay'; // You can use the 'delay' package for retries

// dotenv.config();

// const COUCHDB_HOST = process.env.COUCHDB_HOST;
// const COUCHDB_USER = process.env.COUCHDB_USER;
// const COUCHDB_PASSWORD = process.env.COUCHDB_PASSWORD;
// const COUCHDB_PORT = process.env.COUCHDB_PORT || 5984;
// const COUCHDB_STATE_DB = process.env.COUCHDB_STATE_DB;
// const COUCHDB_LEDGER_DB = process.env.COUCHDB_LEDGER_DB;

// logger.info('Environment variables loaded:');
// logger.info(`COUCHDB_HOST: ${COUCHDB_HOST}`);
// logger.info(`COUCHDB_USER: ${COUCHDB_USER}`);
// logger.info(`COUCHDB_PASSWORD: ${COUCHDB_PASSWORD}`);
// logger.info(`COUCHDB_PORT: ${COUCHDB_PORT}`);
// logger.info(`COUCHDB_STATE_DB: ${COUCHDB_STATE_DB}`);
// logger.info(`COUCHDB_LEDGER_DB: ${COUCHDB_LEDGER_DB}`);

// if (!COUCHDB_HOST || !COUCHDB_USER || !COUCHDB_PASSWORD || !COUCHDB_STATE_DB || !COUCHDB_LEDGER_DB) {
//     logger.error('Missing required CouchDB environment variables. Exiting.');
//     process.exit(1);
// }

// const COUCHDB_URL = `http://${COUCHDB_HOST}:${COUCHDB_PORT}`;
// logger.info(`Connecting to CouchDB at: ${COUCHDB_URL}`);

// const couch = new NodeCouchDb({
//     auth: {
//         user: COUCHDB_USER,
//         pass: COUCHDB_PASSWORD,
//     },
//     host: COUCHDB_HOST,
//     protocol: 'http',
//     port: COUCHDB_PORT,
//     url: COUCHDB_URL,
// });

// const databaseExists = async (dbName) => {
//     logger.info(`Checking existence of database: ${dbName}`);
//     try {
//         const response = await couch.get(dbName, '');
//         logger.info(`Database ${dbName} exists.`);
//         return true;
//     } catch (error) {
//         if (error.statusCode === 404) {
//             logger.warn(`Database ${dbName} does not exist.`);
//             return false;
//         }
//         logger.error(`Error checking existence of database ${dbName}: ${error.message}`);
//         throw error;
//     }
// };

// const retryConnectDB = async (maxRetries = 5, retryDelay = 5000) => {
//     let attempts = 0;
//     while (attempts < maxRetries) {
//         try {
//             const stateDbExists = await databaseExists(COUCHDB_STATE_DB);
//             const ledgerDbExists = await databaseExists(COUCHDB_LEDGER_DB);

//             if (stateDbExists && ledgerDbExists) {
//                 logger.info('Both databases verified successfully.');
//                 return couch;
//             }
//             throw new Error('Required databases not found.');
//         } catch (error) {
//             attempts++;
//             logger.error(`Attempt ${attempts} failed: ${error.message}`);
//             if (attempts < maxRetries) {
//                 logger.info(`Retrying in ${retryDelay / 1000} seconds...`);
//                 await delay(retryDelay);
//             } else {
//                 logger.error('Max retries reached, exiting.');
//                 process.exit(1);
//             }
//         }
//     }
// };

// export default retryConnectDB;
// export { couch as ledgerDB };
