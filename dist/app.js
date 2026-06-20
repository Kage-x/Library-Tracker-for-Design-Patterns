const API_BASE = 'http://localhost:3000/api';
let books = [];
const formInput = document.getElementById('bookForm');
const titleInput = document.getElementById('titleInput');
const authorInput = document.getElementById('authorInput');
const genreInput = document.getElementById('genreInput');
const yearInput = document.getElementById('yearInput');
const bookList = document.getElementById('bookList');
const errorMessage = document.getElementById('errorMessage');
formInput.addEventListener('submit', handleSubmit);
loadBooks();
async function loadBooks() {
    try {
        const response = await fetch(`${API_BASE}/books`);
        if (!response.ok)
            throw new Error('Failed to load books');
        books = await response.json();
        renderBookList();
    }
    catch (error) {
        errorMessage.innerHTML = error.message;
    }
}
async function handleSubmit(event) {
    event.preventDefault();
    const title = titleInput.value;
    const author = authorInput.value;
    const genre = genreInput.value;
    const yearNum = Number(yearInput.value);
    errorMessage.innerHTML = '';
    const errors = [];
    if (title.trim() === "") {
        errors.push("Title is required");
    }
    if (genre.trim() === "") {
        errors.push("Genre is required");
    }
    if (author.trim() === "") {
        errors.push("Author is required");
    }
    if (yearInput.value === "") {
        errors.push("Year is required");
    }
    else if (isNaN(yearNum)) {
        errors.push("Year must be a number");
    }
    else if (yearNum < 1800) {
        errors.push("Year must be more than 1800");
    }
    else if (yearNum > new Date().getFullYear()) {
        errors.push("Year cannot exceed current year");
    }
    if (errors.length > 0) {
        errorMessage.innerHTML = errors.join('<br>');
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title.trim(), author: author.trim(), genre: genre.trim(), year: yearNum })
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to add book');
        }
        titleInput.value = "";
        authorInput.value = "";
        genreInput.value = "";
        yearInput.value = "";
        await loadBooks();
    }
    catch (error) {
        errorMessage.innerHTML = error.message;
    }
}
function renderBookList() {
    bookList.innerHTML = '';
    if (books.length === 0) {
        bookList.innerHTML = '<p class="empty-state">No books in the library yet.</p>';
        return;
    }
    let htmlString = "";
    books.forEach((book, index) => {
        const statusClass = book.isAvailable ? 'available' : 'borrowed';
        const statusText = book.isAvailable ? 'Available' : 'Borrowed';
        htmlString += `<article class="book-card">
        <h2>${index + 1}. ${book.title}</h2>
        <div class="book-details">
            <p class="book-row"><span class="book-label">Author</span><strong>${book.author}</strong></p>
            <p class="book-row"><span class="book-label">Genre</span><strong>${book.genre}</strong></p>
            <p class="book-row"><span class="book-label">Year</span><strong>${book.year}</strong></p>
        </div>
        <p class="book-status ${statusClass}">Status: ${statusText}</p>
        <div class="book-actions">
            <button class="borrow-btn" data-id="${book.id}" data-action="borrow" ${book.isAvailable ? '' : 'disabled'}>Borrow</button>
            <button class="return-btn" data-id="${book.id}" data-action="return" ${book.isAvailable ? 'disabled' : ''}>Return</button>
        </div>
        </article>`;
    });
    bookList.innerHTML = htmlString;
}
bookList.addEventListener('click', async (event) => {
    const btn = event.target.closest('[data-action]');
    if (!btn)
        return;
    errorMessage.innerHTML = '';
    try {
        const response = await fetch(`${API_BASE}/books/${btn.dataset.id}/${btn.dataset.action}`, { method: 'PATCH' });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Action failed');
        }
        await loadBooks();
    }
    catch (error) {
        errorMessage.innerHTML = error.message;
    }
});
