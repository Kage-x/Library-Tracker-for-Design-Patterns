"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryBookRepository = void 0;
class InMemoryBookRepository {
    constructor(initialBooks) {
        this.books = [];
        this.nextId = 1;
        console.log('Repository constructor START');
        console.log('initialBooks received:', initialBooks);
        console.log('initialBooks length:', initialBooks?.length);
        if (initialBooks) {
            this.books = initialBooks;
            this.nextId = Math.max(...initialBooks.map(b => b.id), 0) + 1;
            console.log('Books assigned, this.books length:', this.books.length);
        }
        else {
            console.log('No initial books provided, using empty array');
            this.books = [];
        }
        console.log('Repository constructor END, final books count:', this.books.length);
    }
    async findAll() {
        console.log('findAll called, this.books length:', this.books.length);
        return [...this.books];
    }
    async findById(id) {
        return this.books.find(book => book.id === id);
    }
    async create(bookData) {
        const newBook = {
            id: this.nextId++,
            ...bookData
        };
        this.books.push(newBook);
        return newBook;
    }
    async update(id, bookData) {
        const index = this.books.findIndex(book => book.id === id);
        if (index === -1)
            return undefined;
        this.books[index] = { ...this.books[index], ...bookData };
        return this.books[index];
    }
    async delete(id) {
        const index = this.books.findIndex(book => book.id === id);
        if (index === -1)
            return false;
        this.books.splice(index, 1);
        return true;
    }
}
exports.InMemoryBookRepository = InMemoryBookRepository;
