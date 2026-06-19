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
    let htmlString = "";
    books.forEach((book, index) => {
        htmlString += `<div> 
        <h2>Book ${index + 1} :</h2>
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <p>${book.genre}</p>
        <p>${book.year}</p>
        </div>`;
    });
    bookList.innerHTML = htmlString;
    console.log('Rendering Books:', books);
}
