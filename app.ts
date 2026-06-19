import { Book } from './types.js';

// DOM Elements
const formInput = document.getElementById('bookForm') as HTMLFormElement;
const titleInput = document.getElementById('titleInput') as HTMLInputElement; 
const authorInput = document.getElementById('authorInput') as HTMLInputElement;
const genreInput = document.getElementById('genreInput') as HTMLInputElement;
const yearInput = document.getElementById('yearInput') as HTMLInputElement;

const bookList = document.getElementById('bookList') as HTMLDivElement;
const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;

    // Global state
    let books: Book[] = [];

// API Base URL
const API_BASE = 'http://localhost:3000/api';

// ============ API FUNCTIONS ============

async function fetchBooks(): Promise<Book[]> {
    const response = await fetch(`${API_BASE}/books`);
    if (!response.ok) throw new Error('Failed to fetch books');
    return response.json();
}

async function addBookToBackend(bookData: Omit<Book, 'id'>): Promise<Book> {
    const response = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
    return response.json();
}

async function deleteBookFromBackend(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/books/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
}

async function borrowBookInBackend(id: number): Promise<Book> {
    const response = await fetch(`${API_BASE}/books/${id}/borrow`, {
        method: 'PATCH'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
    return response.json();
}

async function returnBookInBackend(id: number): Promise<Book> {
    const response = await fetch(`${API_BASE}/books/${id}/return`, {
        method: 'PATCH'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }
    return response.json();
}

// ============ LOAD & RENDER ============

async function loadAndRenderBooks() {
    try {
        books = await fetchBooks();
        renderBookList();
    } catch (error) {
        errorMessage.innerHTML = (error as Error).message;
    }
}

// ============ RENDER FUNCTION ============

function renderBookList() {
    bookList.innerHTML = '';

    if (books.length === 0) {
        bookList.innerHTML = '<p>No books in library. Add one above!</p>';
        return;
    }

    let htmlString = "";

    books.forEach((book, index) => {
        const statusText = book.isAvailable ? '✅ Available' : '❌ Borrowed';
        const statusClass = book.isAvailable ? 'available' : 'borrowed';

        htmlString += `
        <div class="book-card" data-id="${book.id}"> 
            <h2>Book ${index + 1}: ${book.title}</h2>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Genre:</strong> ${book.genre}</p>
            <p><strong>Year:</strong> ${book.year}</p>
            <p class="${statusClass}"><strong>Status:</strong> ${statusText}</p>
            <div class="button-group">
                <button class="borrow-btn" data-id="${book.id}">📖 Borrow</button>
                <button class="return-btn" data-id="${book.id}">🔄 Return</button>
                <button class="delete-btn" data-id="${book.id}">🗑️ Delete</button>
            </div>
        </div>
        <hr />
        `;
    });

    bookList.innerHTML = htmlString;
}

// ============ EVENT HANDLERS ============

async function handleSubmit(event: Event) {
    event.preventDefault();

    const title = titleInput.value;
    const author = authorInput.value;
    const genre = genreInput.value;
    const yearNum: number = Number(yearInput.value);

    errorMessage.innerHTML = '';
    const errors: string[] = [];

    // Validation
    if (title.trim() === "") { errors.push("Title is required"); }
    if (genre.trim() === "") { errors.push("Genre is required"); }
    if (author.trim() === "") { errors.push("Author is required"); }

    if (yearInput.value === "") {
        errors.push("Year is required");
    } else if (isNaN(yearNum)) {
        errors.push("Year must be a number");
    } else if (yearNum < 1800) {
        errors.push("Year must be 1800 or later");
    } else if (yearNum > new Date().getFullYear()) {
        errors.push("Year cannot exceed current year");
    }

    if (errors.length > 0) {
        errorMessage.innerHTML = errors.join('<br>');
        return;
    }

    try {
        await addBookToBackend({
            title: title.trim(),
            author: author.trim(),
            genre: genre.trim(),
            year: yearNum,
            isAvailable: true
        });

        // Clear form
        titleInput.value = '';
        authorInput.value = '';
        genreInput.value = '';
        yearInput.value = '';

        // Reload and re-render
        await loadAndRenderBooks();

    } catch (error) {
        errorMessage.innerHTML = (error as Error).message;
    }
}

// ============ EVENT DELEGATION FOR BUTTONS ============

bookList.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;
    const bookCard = target.closest('.book-card') as HTMLElement;

    if (!bookCard) return;

    const bookId = parseInt(bookCard.getAttribute('data-id') || '0');

    if (target.classList.contains('borrow-btn')) {
        try {
            await borrowBookInBackend(bookId);
            await loadAndRenderBooks();
            errorMessage.innerHTML = '<span style="color: green;">Book borrowed successfully!</span>';
            setTimeout(() => { errorMessage.innerHTML = ''; }, 2000);
        } catch (error) {
            errorMessage.innerHTML = (error as Error).message;
        }
    }
    else if (target.classList.contains('return-btn')) {
        try {
            await returnBookInBackend(bookId);
            await loadAndRenderBooks();
            errorMessage.innerHTML = '<span style="color: green;">Book returned successfully!</span>';
            setTimeout(() => { errorMessage.innerHTML = ''; }, 2000);
        } catch (error) {
            errorMessage.innerHTML = (error as Error).message;
        }
    }
    else if (target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this book?')) {
            try {
                await deleteBookFromBackend(bookId);
                await loadAndRenderBooks();
                errorMessage.innerHTML = '<span style="color: green;">Book deleted successfully!</span>';
                setTimeout(() => { errorMessage.innerHTML = ''; }, 2000);
            } catch (error) {
                errorMessage.innerHTML = (error as Error).message;
            }
        }
    }
});

// ============ INITIALIZATION ============

formInput.addEventListener('submit', handleSubmit);
loadAndRenderBooks();