"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
class BookService {
    constructor(repository) {
        this.repository = repository;
    }
    static getInstance(repository) {
        console.log('getInstance called, has instance:', !!BookService.instance, 'has repository param:', !!repository);
        if (!BookService.instance) {
            if (!repository) {
                throw new Error('First call to getInstance must provide a repository');
            }
            console.log('Creating new instance with repository');
            BookService.instance = new BookService(repository);
        }
        else {
            console.log('Returning existing instance');
            if (repository) {
                console.warn('Repository parameter ignored - instance already exists');
            }
        }
        return BookService.instance;
    }
    // Rest of your methods remain the same
    async getAllBooks() {
        return this.repository.findAll();
    }
    async getBookById(id) {
        return this.repository.findById(id);
    }
    async createBook(bookData) {
        if (!bookData.title?.trim())
            throw new Error("Title required");
        if (!bookData.author?.trim())
            throw new Error("Author required");
        if (bookData.year < 1800 || bookData.year > new Date().getFullYear()) {
            throw new Error("Invalid year");
        }
        return this.repository.create(bookData);
    }
    async updateBook(id, bookData) {
        const existing = this.repository.findById(id);
        if (!existing)
            throw new Error("Book not found");
        return this.repository.update(id, bookData);
    }
    async deleteBook(id) {
        const existing = this.repository.findById(id);
        if (!existing)
            throw new Error("Book not found");
        return this.repository.delete(id);
    }
    async borrowBook(id) {
        const book = await this.repository.findById(id);
        if (!book)
            throw new Error("Book not found");
        if (!book.isAvailable)
            throw new Error("Book already borrowed");
        return await this.repository.update(id, { isAvailable: false });
    }
    async returnBook(id) {
        const book = await this.repository.findById(id);
        if (!book)
            throw new Error("Book not found");
        if (book.isAvailable)
            throw new Error("Book already available");
        return await this.repository.update(id, { isAvailable: true });
    }
}
exports.BookService = BookService;
