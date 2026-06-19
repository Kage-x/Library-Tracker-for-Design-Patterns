"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
exports.closeDatabaseConnection = closeDatabaseConnection;
exports.getDatabase = getDatabase;
exports.getBooksCollection = getBooksCollection;
exports.checkDatabaseHealth = checkDatabaseHealth;
const mongodb_1 = require("mongodb");
// Connection string for local MongoDB
// Default: mongodb://localhost:27017
const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'library';
let client = null;
let db = null;
/**
 * Connect to MongoDB and return database instance
 */
async function connectToDatabase() {
    if (db) {
        console.log('Using existing database connection');
        return db;
    }
    try {
        console.log('Connecting to MongoDB...');
        client = new mongodb_1.MongoClient(MONGODB_URI);
        await client.connect();
        console.log('✅ Connected to MongoDB successfully');
        db = client.db(DATABASE_NAME);
        console.log(`✅ Using database: ${DATABASE_NAME}`);
        // Create collection if it doesn't exist
        const collections = await db.listCollections().toArray();
        const collectionExists = collections.some(c => c.name === 'books');
        if (!collectionExists) {
            await db.createCollection('books');
            console.log('✅ Created "books" collection');
        }
        return db;
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}
/**
 * Close MongoDB connection
 */
async function closeDatabaseConnection() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('MongoDB connection closed');
    }
}
/**
 * Get the database instance (must call connectToDatabase first)
 */
function getDatabase() {
    if (!db) {
        throw new Error('Database not connected. Call connectToDatabase() first.');
    }
    return db;
}
/**
 * Get the books collection
 */
async function getBooksCollection() {
    const database = await connectToDatabase();
    return database.collection('books');
}
/**
 * Check database health
 */
async function checkDatabaseHealth() {
    try {
        const database = await connectToDatabase();
        await database.command({ ping: 1 });
        return true;
    }
    catch (error) {
        console.error('Health check failed:', error);
        return false;
    }
}
