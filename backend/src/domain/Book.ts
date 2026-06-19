export interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    year: number;
    isAvailable: boolean;
}

export class BookEntity implements Book {
    constructor(
        public id: number,
        public title: string,
        public author: string,
        public genre: string,
        public year: number,
        public isAvailable: boolean = true
    ) { }

    borrow(): void {
        if (!this.isAvailable) {
            throw new Error("Book is already borrowed");
        }
        this.isAvailable = false;
    }

    return(): void {
        if (this.isAvailable) {
            throw new Error("Book is already available");
        }
        this.isAvailable = true;
    }
}