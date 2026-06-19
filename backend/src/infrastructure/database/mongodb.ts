import { MongoClient, Db } from 'mongodb';

// Connection string for local MongoDB
// Default: mongodb://localhost:27017
const MONGODB_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'library';

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Connect to MongoDB and return database instance
 */
export async function connectToDatabase(): Promise<Db> {
    if (db) {
        console.log('Using existing database connection');
        return db;
    }

    try {
        console.log('Connecting to MongoDB...');
        client = new MongoClient(MONGODB_URI);
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
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}

/**
 * Close MongoDB connection
 */
export async function closeDatabaseConnection(): Promise<void> {
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
export function getDatabase(): Db {
    if (!db) {
        throw new Error('Database not connected. Call connectToDatabase() first.');
    }
    return db;
}

/**
 * Get the books collection
 */
export async function getBooksCollection() {
    const database = await connectToDatabase();
    return database.collection('books');
}

/**
 * Check database health
 */
export async function checkDatabaseHealth(): Promise<boolean> {
    try {
        const database = await connectToDatabase();
        await database.command({ ping: 1 });
        return true;
    } catch (error) {
        console.error('Health check failed:', error);
        return false;
    }
}