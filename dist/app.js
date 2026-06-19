import sampleBooks from './data.js';
let books = sampleBooks;
const formInput = document.getElementById('bookForm');
const titleInput = document.getElementById('titleInput');
const authorInput = document.getElementById('authorInput');
const genreInput = document.getElementById('genreInput');
const yearInput = document.getElementById('yearInput');
const bookList = document.getElementById('bookList');
const errorMessage = document.getElementById('errorMessage');
const button = document.getElementById('bookButton');
formInput.addEventListener('submit', handleSubmit);
renderBookList();
function handleSubmit(event) {
    event.preventDefault();
    const title = titleInput.value;
    const author = authorInput.value;
    const genre = genreInput.value;
    const yearNum = Number(yearInput.value);
    errorMessage.innerHTML = '';
    const errors = [];
    if (title.trim() === "") {
        errors.push("Title is reuqired");
    }
    if (genre.trim() === "") {
        errors.push("Genre is reuqired");
    }
    if (author.trim() === "") {
        errors.push("Author is required");
    }
    if (yearNum === null) {
        errors.push("Year is reuqired");
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
        //Display errors
        errorMessage.innerHTML = errors.join('<br>');
        return;
    }
    const newBook = {
        id: Date.now(),
        title: title,
        author: author,
        genre: genre,
        year: yearNum,
        isAvailable: true
    };
    books.push(newBook);
    titleInput.value = "";
    authorInput.value = "";
    genreInput.value = "";
    yearInput.value = "";
    renderBookList();
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
    console.log('Rendering Books:', books);
}
bookList.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-action]');
    if (!btn)
        return;
    const book = books.find((b) => String(b.id) === btn.dataset.id);
    if (!book)
        return;
    book.isAvailable = btn.dataset.action === 'return';
    renderBookList();
});
