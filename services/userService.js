// services/userService.js
import User from '../models/User.js';
import logger from '../logger.js'; // Import the custom logger

// Function to get all users
export const getAllUsers = async () => {
    try {
        const users = await User.find();
        logger.info('Successfully retrieved users'); // Log success
        return users;
    } catch (error) {
        logger.error('Error retrieving users: ' + error.message); // Log the error
        throw new Error('Error retrieving users'); // Rethrow or handle it as needed
    }
};

// Function to create a new user
export const createUser = async (userData) => {
    try {
        const newUser = new User(userData);
        const savedUser = await newUser.save();
        logger.info(`User created: ${JSON.stringify(savedUser)}`); // Log success
        return savedUser;
    } catch (error) {
        logger.error('Error creating user: ' + error.message); // Log the error
        throw new Error('Error creating user');
    }
};
