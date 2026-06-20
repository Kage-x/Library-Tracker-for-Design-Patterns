"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const mongodb_1 = require("./infrastructure/database/mongodb");
const sampleBooks = [
    { id: 1, title: 'Robinson Crusoe', author: 'Kangaroo', genre: 'Adventure', year: 1876, isAvailable: true },
    { id: 2, title: 'Art of War', author: 'monkye', genre: 'Action', year: 1876, isAvailable: false },
    { id: 3, title: 'Daffy Duck', author: 'Bandar', genre: 'Drama', year: 1656, isAvailable: true },
    { id: 4, title: 'Mickey', author: 'banan', genre: 'Adventure', year: 1455, isAvailable: false }
];
async function seedDatabase() {
    try {
        const db = await (0, mongodb_1.connectToDatabase)();
        const collection = db.collection('books');
        // Check if data exists
        const count = await collection.countDocuments();
        if (count > 0) {
            console.log(`📚 Database already has ${count} books, skipping seed`);
            return;
        }
        await collection.insertMany(sampleBooks);
        console.log(`✅ Seeded ${sampleBooks.length} books into MongoDB`);
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    }
}
