import { Collection, Db } from 'mongodb';
import { Book } from '../domain/Book';
import { IBookRepository } from './BookRepository';
import { connectToDatabase } from '../infrastructure/database/mongodb';

export class MongoBookRepository implements IBookRepository {
    private collection: Collection<Book> | null = null;

    private async getCollection(): Promise<Collection<Book>> {
        if (this.collection) {
            return this.collection;
        }

        const db: Db = await connectToDatabase();
        this.collection = db.collection<Book>('books');
        return this.collection;
    }

    async findAll(): Promise<Book[]> {
        const collection = await this.getCollection();
        const books = await collection.find().toArray();

        return books.map((doc: Book) => ({
            id: doc.id,
            title: doc.title,
            author: doc.author,
            genre: doc.genre,
            year: doc.year,
            isAvailable: doc.isAvailable
        }));
    }

    async findById(id: number): Promise<Book | undefined> {
        const collection = await this.getCollection();
        const book = await collection.findOne({ id: id });
        return book || undefined;
    }

    async create(bookData: Omit<Book, 'id'>): Promise<Book> {
        const collection = await this.getCollection();

        const allBooks = await collection.find({})
            .sort({ id: -1 })
            .limit(1)
            .toArray();
        const nextId = allBooks.length > 0 ? allBooks[0].id + 1 : 1;

        const newBook: Book = {
            id: nextId,
            ...bookData,
            isAvailable: bookData.isAvailable ?? true
        };

        await collection.insertOne(newBook);
        return newBook;
    }

    async update(id: number, bookData: Partial<Book>): Promise<Book | undefined> {
        const collection = await this.getCollection();

        const { id: _, ...updateData } = bookData;

        const result = await collection.findOneAndUpdate(
            { id: id },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result) {
            return undefined;
        }

        return {
            id: result.id,
            title: result.title,
            author: result.author,
            genre: result.genre,
            year: result.year,
            isAvailable: result.isAvailable
        };
    }

    async delete(id: number): Promise<boolean> {
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ id: id });
        return result.deletedCount > 0;
    }
}