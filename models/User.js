import NodeCouchDb from 'node-couchdb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'; // For password hashing

dotenv.config();

const couch = new NodeCouchDb({
    host: process.env.COUCHDB_HOST,
    port: process.env.COUCHDB_PORT,
    auth: {
        user: process.env.COUCHDB_USER,
        pass: process.env.COUCHDB_PASSWORD,
    },
});


const stateDbName = process.env.COUCHDB_STATE_DB; // Use the state database

class User {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
        this.role = data.role; // CEO, Manager, Assistant
        this.type = 'user'; // Add type field
    }

    // Create a new user with hashed password
    static async createUser(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10); // Hash password
        const newUser = { 
            ...userData, 
            password: hashedPassword, 
            type: 'user', // Add type field
            // id: userData.email // Use email or a generated ID; you may change this logic as needed
        };
        try {
            await couch.insert(stateDbName, newUser);
        } catch (error) {
            throw new Error(`Error saving user: ${error.message}`);
        }
    }

    // Find user by email
    static async findUserByEmail(email) {
        try {
            const response = await couch.get(stateDbName, '_all_docs', { include_docs: true });
            const users = response.data.rows.map(row => row.doc);
            const user = users.find(user => user.email === email);
            return user || null; // Return null if no user found
        } catch (error) {
            throw new Error(`Error fetching user by email: ${error.message}`);
        }
    }

    // Validate the password for a given user
    static async validatePassword(user, password) {
        if (!user || !user.password) {
            throw new Error("User not found or password not set");
        }
        return await bcrypt.compare(password, user.password);
    }

    // Fetch all users
    static async getAllUsers() {
        try {
            const response = await couch.get(stateDbName, '_all_docs', { include_docs: true });
            const users = response.data.rows.map(row => row.doc); // Extract users from docs
            return users.map(user => {
                // Return only the necessary fields (avoid exposing passwords)
                return {
                    email: user.email,
                    role: user.role,
                    type: user.type, // Include type field
                    id: user.id // Include id field
                };
            });
        } catch (error) {
            throw new Error(`Error fetching all users: ${error.message}`);
        }
    }
}

export default User;
