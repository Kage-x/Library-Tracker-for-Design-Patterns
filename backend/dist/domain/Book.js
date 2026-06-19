"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookEntity = void 0;
class BookEntity {
    constructor(id, title, author, genre, year, isAvailable = true) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.year = year;
        this.isAvailable = isAvailable;
    }
    borrow() {
        if (!this.isAvailable) {
            throw new Error("Book is already borrowed");
        }
        this.isAvailable = false;
    }
    return() {
        if (this.isAvailable) {
            throw new Error("Book is already available");
        }
        this.isAvailable = true;
    }
}
exports.BookEntity = BookEntity;
