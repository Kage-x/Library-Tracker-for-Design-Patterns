import { Book } from '../domain/Book';

export interface IBookRepository {
    findAll(): Promise<Book[]>;
    findById(id: number): Promise<Book | undefined>;
    create(book: Omit<Book, 'id'>): Promise<Book>;
    update(id: number, book: Partial<Book>): Promise<Book | undefined>;
    delete(id: number):Promise<boolean>;
}

export class InMemoryBookRepository implements IBookRepository {
    private books: Book[] = [];
    private nextId: number = 1;

    constructor(initialBooks?: Book[]) {
        console.log('Repository constructor START');
        console.log('initialBooks received:', initialBooks);
        console.log('initialBooks length:', initialBooks?.length);

        if (initialBooks) {
            this.books = initialBooks;
            this.nextId = Math.max(...initialBooks.map(b => b.id), 0) + 1;
            console.log('Books assigned, this.books length:', this.books.length);
        } else {
            console.log('No initial books provided, using empty array');
            this.books = [];
        }

        console.log('Repository constructor END, final books count:', this.books.length);
    }

    async findAll(): Promise<Book[]> {
        console.log('findAll called, this.books length:', this.books.length);
        return [...this.books];
    }

    async findById(id: number): Promise<Book | undefined> {
        return this.books.find(book => book.id === id);
    }

    async create(bookData: Omit<Book, 'id'>): Promise< Book> {
        const newBook: Book = {
            id: this.nextId++,
            ...bookData
        };
        this.books.push(newBook);
        return newBook;
    }

    async update(id: number, bookData: Partial<Book>): Promise<Book | undefined> {
        const index = this.books.findIndex(book => book.id === id);
        if (index === -1) return undefined;

        this.books[index] = { ...this.books[index], ...bookData };
        return this.books[index];
    }

    async delete(id: number): Promise<boolean> {
        const index = this.books.findIndex(book => book.id === id);
        if (index === -1) return false;

        this.books.splice(index, 1);
        return true;
    }
}