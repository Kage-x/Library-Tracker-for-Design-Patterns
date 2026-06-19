"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoBookRepository = void 0;
const mongodb_1 = require("../infrastructure/database/mongodb");
class MongoBookRepository {
    constructor() {
        this.collection = null;
    }
    async getCollection() {
        if (this.collection) {
            return this.collection;
        }
        const db = await (0, mongodb_1.connectToDatabase)();
        this.collection = db.collection('books');
        return this.collection;
    }
    async findAll() {
        const collection = await this.getCollection();
        const books = await collection.find().toArray();
        return books.map((doc) => ({
            id: doc.id,
            title: doc.title,
            author: doc.author,
            genre: doc.genre,
            year: doc.year,
            isAvailable: doc.isAvailable
        }));
    }
    async findById(id) {
        const collection = await this.getCollection();
        const book = await collection.findOne({ id: id });
        return book || undefined;
    }
    async create(bookData) {
        const collection = await this.getCollection();
        const allBooks = await collection.find({})
            .sort({ id: -1 })
            .limit(1)
            .toArray();
        const nextId = allBooks.length > 0 ? allBooks[0].id + 1 : 1;
        const newBook = {
            id: nextId,
            ...bookData,
            isAvailable: bookData.isAvailable ?? true
        };
        await collection.insertOne(newBook);
        return newBook;
    }
    async update(id, bookData) {
        const collection = await this.getCollection();
        const { id: _, ...updateData } = bookData;
        const result = await collection.findOneAndUpdate({ id: id }, { $set: updateData }, { returnDocument: 'after' });
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
    async delete(id) {
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ id: id });
        return result.deletedCount > 0;
    }
}
exports.MongoBookRepository = MongoBookRepository;
