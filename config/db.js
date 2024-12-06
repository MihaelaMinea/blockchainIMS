// //running well without containers
// import axios from 'axios'; // Import axios to send HTTP requests
// import dotenv from 'dotenv';
// import logger from '../logger.js'; // Adjust path if needed

// dotenv.config();


// // Log the environment variables to verify they are loaded
// logger.info(`CouchDB Host: ${process.env.COUCHDB_HOST}`);
// logger.info(`CouchDB User: ${process.env.COUCHDB_USER}`);
// logger.info(`CouchDB Password: ${process.env.COUCHDB_PASSWORD}`);
// logger.info(`CouchDB Port: ${process.env.COUCHDB_PORT}`);

// // Set up CouchDB connection details
// const couchDbUrl = `http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@${process.env.COUCHDB_HOST}:${process.env.COUCHDB_PORT}`;

// // Function to check if a database exists
// const databaseExists = async (dbName) => {
//     logger.info(`Checking existence of database: ${dbName}`);
//     try {
//         // Perform an HTTP HEAD request to check if the database exists
//         const response = await axios.head(`${couchDbUrl}/${dbName}`);
//         if (response.status === 200) {
//             logger.info(`Database ${dbName} exists.`);
//             return true; // Database exists
//         }
//     } catch (error) {
//         if (error.response && error.response.status === 404) {
//             logger.warn(`Database ${dbName} does not exist.`);
//             return false; // Database doesn't exist
//         }
//         logger.error(`Error checking existence of database ${dbName}: ${error.message}`);
//         throw error; // Rethrow other errors
//     }
// };

// // Function to create a database if it doesn't exist
// const createDatabaseIfNeeded = async (dbName) => {
//     const exists = await databaseExists(dbName);
    
//     if (!exists) {
//         try {
//             // Create the database if it doesn't exist (non-partitioned by default)
//             const response = await axios.put(`${couchDbUrl}/${dbName}`);
//             if (response.status === 201) {
//                 logger.info(`Database ${dbName} created successfully.`);
//             }
//         } catch (error) {
//             logger.error(`Failed to create database ${dbName}: ${error.message}`);
//             throw error; // Handle error or fail gracefully
//         }
//     } else {
//         logger.info(`Database ${dbName} already exists.`);
//     }
// };

// // Function to connect to CouchDB and verify that required databases exist
// const connectDB = async () => {
//     try {
//         // Ensure that the required databases (state_ims and ledger_ims) exist
//         await createDatabaseIfNeeded(process.env.COUCHDB_STATE_DB); // state_ims
//         await createDatabaseIfNeeded(process.env.COUCHDB_LEDGER_DB); // ledger_ims

//         logger.info('Both databases verified and created successfully.');
//         return true; // Return true indicating that the connection is successful
//     } catch (error) {
//         logger.error('Error connecting to CouchDB: ' + error.message);
//         process.exit(1); // Exit the process if connection fails
//     }
// };

// // Export the connectDB function so it can be used elsewhere in your app
// export default connectDB;

import axios from 'axios'; // Import axios to send HTTP requests
import dotenv from 'dotenv';
import logger from '../logger.js'; // Adjust path if needed

dotenv.config();

// Log the environment variables to verify they are loaded
logger.info(`CouchDB Host: ${process.env.COUCHDB_HOST}`);
logger.info(`CouchDB User: ${process.env.COUCHDB_USER}`);
logger.info(`CouchDB Password: ${process.env.COUCHDB_PASSWORD}`);
logger.info(`CouchDB Port: ${process.env.COUCHDB_PORT}`);

// Set up CouchDB connection details
const couchDbUrl = `http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@${process.env.COUCHDB_HOST}:${process.env.COUCHDB_PORT}`;

// Function to check if a database exists
const databaseExists = async (dbName) => {
    logger.info(`Checking existence of database: ${dbName}`);
    try {
        const response = await axios.head(`${couchDbUrl}/${dbName}`);
        if (response.status === 200) {
            logger.info(`Database ${dbName} exists.`);
            return true;
        }
    } catch (error) {
        if (error.response?.status === 404) {
            logger.warn(`Database ${dbName} does not exist.`);
            return false;
        }
        logger.error(`Error checking existence of database ${dbName}: ${error.message}`);
        throw error;
    }
};

// Function to create a database if it doesn't exist
const createDatabaseIfNeeded = async (dbName) => {
    const exists = await databaseExists(dbName);
    if (!exists) {
        try {
            const response = await axios.put(`${couchDbUrl}/${dbName}`);
            if (response.status === 201) {
                logger.info(`Database ${dbName} created successfully.`);
            }
        } catch (error) {
            logger.error(`Failed to create database ${dbName}: ${error.message}`);
            throw error;
        }
    } else {
        logger.info(`Database ${dbName} already exists.`);
    }
};

// Function to create the _users database if it doesn't exist
const createUsersDatabase = async () => {
    try {
        const response = await axios.put(`${couchDbUrl}/_users`);
        if (response.status === 201) {
            logger.info('Database _users created successfully.');
        }
    } catch (error) {
        if (error.response?.status === 412) {
            logger.info('_users database already exists.');
        } else {
            logger.error('Error creating _users database:', error.message);
        }
    }
};

// Function to create a user document if it doesn't exist
const createUserIfNotExists = async (username, password) => {
    const userId = `org.couchdb.user:${username}`;
    const userDoc = {
        _id: userId,
        name: username,
        roles: [],
        type: 'user',
        password,
    };

    try {
        await axios.put(`${couchDbUrl}/_users/${userId}`, userDoc);
        logger.info(`User ${username} created successfully.`);
    } catch (error) {
        if (error.response?.status === 409) {
            logger.info(`User ${username} already exists.`);
        } else {
            logger.error(`Failed to create user ${username}: ${error.message}`);
            throw error;
        }
    }
};

// Function to connect to CouchDB and ensure databases and users are created
const connectDB = async () => {
    try {
        await createUsersDatabase(); // Create the _users database if needed
        await createDatabaseIfNeeded(process.env.COUCHDB_STATE_DB); // state_ims
        await createDatabaseIfNeeded(process.env.COUCHDB_LEDGER_DB); // ledger_ims

        // Example: Ensure a default admin user exists
        await createUserIfNotExists(process.env.DEFAULT_ADMIN_USER, process.env.DEFAULT_ADMIN_PASSWORD);

        logger.info('CouchDB setup complete. Databases and default users verified.');
        return true;
    } catch (error) {
        logger.error('Error connecting to CouchDB:', error.message);
        process.exit(1); // Exit process if connection fails
    }
};

export default connectDB;
