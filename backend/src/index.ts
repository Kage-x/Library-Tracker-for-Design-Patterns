import express from 'express';
import bookRoutes from './routes/BookRoutes';
import { InMemoryBookRepository } from './repositories/BookRepository';
import { BookService } from './services/BookServices';
import { MongoBookRepository } from './repositories/MongoBookRepository';
import { connectToDatabase, closeDatabaseConnection } from './infrastructure/database/mongodb';
import { seedDatabase } from './seed'

const app = express();
const PORT = 3000;

app.use(express.json());

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

// Sample data
const sampleBooks = [
    { id: 1, title: 'Robinson Crusoe', author: 'Kangaroo', genre: 'Adventure', year: 1876, isAvailable: true },
    { id: 2, title: 'Art of War', author: 'monkye', genre: 'Action', year: 1876, isAvailable: false },
    { id: 3, title: 'Daffy Duck', author: 'Bandar', genre: 'Drama', year: 1656, isAvailable: true },
    { id: 4, title: 'Mickey', author: 'banan', genre: 'Adventure', year: 1455, isAvailable: false }
];

// Debug route - MUST be before app.listen
app.get('/debug/repo', (req, res) => {
    const service = BookService.getInstance();
    service.getAllBooks().then(books => {
        res.json({
            count: books.length,
            books: books,
            message: 'Debug endpoint works'
        });
    });
});

// Routes
app.use('/api', bookRoutes);

// Initialize MongoDB and start server
async function startServer() {
    try {
        // Connect to MongoDB
        await connectToDatabase();
        console.log('✅ Database connection established');

        await seedDatabase();
        
        // Create repository and initialize singleton
        const repository = new MongoBookRepository();
        BookService.getInstance(repository);
        console.log('✅ BookService initialized with MongoDB');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📚 Books API: http://localhost:${PORT}/api/books`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    await closeDatabaseConnection();
    process.exit(0);
});

startServer();








