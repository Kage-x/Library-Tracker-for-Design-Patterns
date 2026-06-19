"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BookRoutes_1 = __importDefault(require("./routes/BookRoutes"));
const BookRepository_1 = require("./repositories/BookRepository");
const BookServices_1 = require("./services/BookServices");
const MongoBookRepository_1 = require("./repositories/MongoBookRepository");
const mongodb_1 = require("./infrastructure/database/mongodb");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
//Health Check 
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
// Initialize MongoDB and start server
async function startServer() {
    try {
        // Connect to MongoDB
        await (0, mongodb_1.connectToDatabase)();
        console.log('✅ Database connection established');
        // Create repository and initialize singleton
        const repository = new MongoBookRepository_1.MongoBookRepository();
        BookServices_1.BookService.getInstance(repository);
        console.log('✅ BookService initialized with MongoDB');
        // Routes
        app.use('/api', BookRoutes_1.default);
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📚 Books API: http://localhost:${PORT}/api/books`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
// Handle shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    await (0, mongodb_1.closeDatabaseConnection)();
    process.exit(0);
});
startServer();
// Sample data
const sampleBooks = [
    { id: 1, title: 'Robinson Crusoe', author: 'Kangaroo', genre: 'Adventure', year: 1876, isAvailable: true },
    { id: 2, title: 'Art of War', author: 'monkye', genre: 'Action', year: 1876, isAvailable: false },
    { id: 3, title: 'Daffy Duck', author: 'Bandar', genre: 'Drama', year: 1656, isAvailable: true },
    { id: 4, title: 'Mickey', author: 'banan', genre: 'Adventure', year: 1455, isAvailable: false }
];
console.log('Sample books count:', sampleBooks.length);
// Create repository
const repository = new BookRepository_1.InMemoryBookRepository(sampleBooks);
repository.findAll().then(books => {
    console.log('Repository created, books in repo:', books.length);
});
// Initialize singleton
BookServices_1.BookService.getInstance(repository);
console.log('Singleton initialized');
// Debug route - MUST be before app.listen
app.get('/debug/repo', (req, res) => {
    const service = BookServices_1.BookService.getInstance();
    service.getAllBooks().then(books => {
        res.json({
            count: books.length,
            books: books,
            message: 'Debug endpoint works'
        });
    });
});
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
// API routes
app.use('/api', BookRoutes_1.default);
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Test: http://localhost:${PORT}/health`);
    console.log(`Test: http://localhost:${PORT}/debug/repo`);
    console.log(`Test: http://localhost:${PORT}/api/books`);
});
