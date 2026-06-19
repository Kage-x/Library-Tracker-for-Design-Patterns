"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BookServices_1 = require("../services/BookServices");
const router = (0, express_1.Router)();
// GET /api/books - Get all books
router.get('/books', async (req, res) => {
    try {
        const bookService = BookServices_1.BookService.getInstance();
        const books = await bookService.getAllBooks();
        res.json(books);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET /api/books/:id - Get one book
router.get('/books/:id', async (req, res) => {
    try {
        const bookService = BookServices_1.BookService.getInstance();
        const id = parseInt(req.params.id);
        const book = await bookService.getBookById(id);
        if (!book) {
            res.status(404).json({ error: "Book not found" });
            return;
        }
        res.json(book);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST /api/books - Create book
router.post('/books', async (req, res) => {
    try {
        const bookService = BookServices_1.BookService.getInstance(); // ← ADD THIS
        const { title, author, genre, year } = req.body;
        const newBook = await bookService.createBook({ title, author, genre, year, isAvailable: true });
        res.status(201).json(newBook);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// PUT /api/books/:id - Update book
router.put('/books/:id', async (req, res) => {
    try {
        const bookService = BookServices_1.BookService.getInstance(); // ← ADD THIS
        const id = parseInt(req.params.id);
        const { title, author, genre, year, isAvailable } = req.body;
        const updated = await bookService.updateBook(id, { title, author, genre, year, isAvailable });
        if (!updated) {
            res.status(404).json({ error: "Book not found" });
            return;
        }
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// DELETE /api/books/:id - Delete book
router.delete('/books/:id', async (req, res) => {
    try {
        const bookService = BookServices_1.BookService.getInstance(); // ← ADD THIS
        const id = parseInt(req.params.id);
        const deleted = await bookService.deleteBook(id); // ← FIXED (instance, not class)
        if (!deleted) {
            res.status(404).json({ error: "Book not found" });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// PATCH /api/books/:id/borrow - Borrow book
router.patch('/books/:id/borrow', async (req, res) => {
    try {
        const bookService = BookServices_1.BookService.getInstance(); // ← ADD THIS
        const id = parseInt(req.params.id);
        const updated = await bookService.borrowBook(id); // ← FIXED
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// PATCH /api/books/:id/return - Return book
router.patch('/books/:id/return', async (req, res) => {
    try {
        const bookService = BookServices_1.BookService.getInstance(); // ← ADD THIS
        const id = parseInt(req.params.id);
        const updated = await bookService.returnBook(id); // ← FIXED
        res.json(updated);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
