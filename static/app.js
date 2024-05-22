// ---> MANEJAR BOTONES ACORDEON
function toggleAccordion(id) {
    var panel = document.getElementById(id);
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }
}

//---> ERRORES 
function handleResponse(response) {
    if (response.status === 404) {
        throw new Error('Author not found');
    } else if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.status + ' ' + response.statusText);
    }
    return response.json();
}

function handleError(error) {
    console.error('Error:', error);
    document.getElementById('errorDisplay').textContent = 'Error: ' + error.message;
}


function toggleVisibility(id) {
    const element = document.getElementById(id);
    if (element.style.display === "none" || element.style.display === '') {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  }

  
// ---> CARGAR DATOS BD 
function loadData(id) {
    fetch('http://localhost:8000/seed', {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Data loaded:', data);
        alert('Datos iniciales cargados exitosamente!');
    })
    .catch(error => {
        console.error('Error loading data:', error);
        document.getElementById('errorDisplay').textContent = 'Error loading initial data: ' + error.message;
    });
}


// ---> QUERY 1
document.getElementById('showBookCopiesButton').addEventListener('click', function() {
    const container = document.getElementById('bookCopiesList');
    if (container.style.display === 'block') {
        container.style.display = 'none';
    } else {
        container.style.display = 'block';
        fetch('http://localhost:8000/query1')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch book copies');
                }
                return response.json();
            })
            .then(data => {
                console.log(data); 
                displayBookCopies(data);
            })
            .catch(error => {
                console.error('Error fetching book copies:', error);
                document.getElementById('errorDisplay').textContent = 'Error fetching book copies: ' + error.message;
            });
    }
});

function displayBookCopies(data) {
    const container = document.getElementById('bookCopiesList');
    container.innerHTML = ''; 
    data.forEach(copy => {
        const copyElement = document.createElement('div');
        copyElement.classList.add('copy-item'); 
        copyElement.innerHTML = `
            <div class="copy-detail"><strong>Autor:</strong> ${copy.autor || 'No especificado'}</div>
            <div class="copy-detail"><strong>Libro:</strong> ${copy.titulo || 'No especificado'}</div>
            <div class="copy-detail"><strong>Edición:</strong> ISBN ${copy.isbn || 'No especificado'}, Año ${copy.anyo || 'No especificado'}, Idioma ${copy.idioma || 'No especificado'}</div>
            <div class="copy-detail"><strong>Copia:</strong> Número ${copy.numero || 'No especificado'}</div>
        `;
        container.appendChild(copyElement);
    });
}


// ---> QUERY 2
let lastUserSearch = '';

document.getElementById('showLoansByUserButton').addEventListener('click', function() {
    const userName = document.getElementById('userNameUserInput').value.trim();
    const container = document.getElementById('loansList');
    const errorDisplay = document.getElementById('errorDisplay');

    if (!userName) {
        alert('Por favor ingrese el nombre del usuario');
        return;
    }

    if (container.style.display === 'block' && lastUserSearch === userName) {
        container.style.display = 'none';
        container.innerHTML = '';
        errorDisplay.textContent = '';
    } else {
        lastUserSearch = userName;
        container.style.display = 'block';
        fetchLoansByUser(userName);
    }
});

function fetchLoansByUser(userName) {
    fetch(`http://localhost:8000/query2/${encodeURIComponent(userName)}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Usuario no encontrado en la base de datos');
                } else {
                    throw new Error('Failed to fetch book copies');
                }
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos:", data);
            const container = document.getElementById('loansList');
            const errorDisplay = document.getElementById('errorDisplay');
            if (data.length > 0) {
                container.innerHTML = data.map(book => `<p>${book.libro} (prestamos: ${book.prestamos})</p>`).join('');
                errorDisplay.textContent = '';
            } else {
                container.innerHTML = '<p>No se encontraron préstamos para este usuario.</p>';
                errorDisplay.textContent = '';
            }
        })
        .catch(error => {
            console.error('Error fetching loans:', error);
            document.getElementById('errorDisplay').textContent = 'Error fetching loans: ' + error.message;
        });
}


function displayLoans(data) {
    const container = document.getElementById('loansList');
    container.innerHTML = ''; 
    if (data.length === 0) {
        container.innerHTML = '<p>No hay préstamos para mostrar.</p>';
    } else {
        data.forEach(loan => {
            const loanElement = document.createElement('div');
            loanElement.classList.add('loan-item');
            loanElement.innerHTML = `
                <div class="loan-detail"><strong>Usuario:</strong> ${loan.usuario}</div>
                <div class="loan-detail"><strong>Libro:</strong> ${loan.libro}
            `;
            container.appendChild(loanElement);
        });
    }



}


// <------------------------------> FUNCIONES AUTORES <------------------------------> 
// showAllAuthorsButton
// ---> MOSTRAR AUTORES

function showAllAuthors() {
    fetch('http://localhost:8000/authors')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching authors: ' + response.statusText);
            }
            return response.json();
        })
        .then(authors => {
            const authorsList = document.getElementById('authorsList');
            authorsList.innerHTML = '';
            authors.forEach(author => {
                const authorElement = document.createElement('div');
                authorElement.id = 'author-' + encodeURIComponent(author.nombre);
                authorElement.textContent = author.nombre;

                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.className = 'edit-author-btn';
                editButton.onclick = () => editAuthor(author._id, author.nombre);
                authorElement.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Borrar';
                deleteButton.className = 'delete-author-btn';
                deleteButton.onclick = () => deleteAuthor(author.nombre);
                authorElement.appendChild(deleteButton);

                authorsList.appendChild(authorElement);
            });
            authorsList.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching authors:', error);
            document.getElementById('errorDisplay').textContent = 'Error fetching authors: ' + error.message;
        });
}

function editAuthor(authorId, authorName) {
    currentAuthorId = authorId;
    document.getElementById('authorNameInput').value = authorName;
    document.getElementById('insertAuthorButton').style.display = 'none';
    document.getElementById('updateAuthorButton').style.display = 'inline-block';
}

document.getElementById('edit-author-btn').addEventListener('click', function() {
    const authorName = document.getElementById('authorNameInput').value.trim();

    if (!authorName) {
        console.error("Please fill in all fields.");
        document.getElementById('errorDisplay').textContent = "Please fill in all fields.";
        return;
    }

    const authorData = { nombre: authorName };
    fetch(`http://localhost:8000/authors/${encodeURIComponent(currentAuthorId)}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(authorData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update the author');
        }
        return response.json();
    })
    .then(data => {
        console.log('Author updated:', data);
        document.getElementById('statusDisplay').textContent = 'Author updated successfully';
        showAllAuthors();
    })
    .catch(error => {
        console.error('Error updating author:', error);
        document.getElementById('errorDisplay').textContent = 'Error updating author: ' + error.message;
    });

    document.getElementById('insertAuthorButton').style.display = 'inline-block';
    document.getElementById('updateAuthorButton').style.display = 'none';
    document.getElementById('authorNameInput').value = '';
});


document.getElementById('actualizarAutorBtn').addEventListener('click', function() {
    const authorName = document.getElementById('authorNameInput').value; 
    const newAuthorDetails = { nombre: authorName };
    updateAuthor(authorName, newAuthorDetails);
});


function deleteAuthor(authorName) {
    const url = `http://localhost:8000/authors/${encodeURIComponent(authorName)}`;
    fetch(url, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Autor borrado:', data);
        showAllAuthors();
    })
    .catch(error => {
        console.error('Error borrando autor:', error);
        document.getElementById('errorDisplay').textContent = 'Error borrando autor: ' + error.message;
    });
}

function insertAuthor() {
    const authorName = document.getElementById('authorNameInput').value;
    if (!authorName) {
        console.error("Author name input is empty.");
        return;
    }
    console.log("Inserting author:", authorName);
    const authorData = { nombre: authorName };
    fetch('http://localhost:8000/authors', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(authorData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Author inserted correctly:', data);
        showAllAuthors(); 
    })
    .catch(error => {
        console.error('Error inserting author:', error);
        document.getElementById('errorDisplay').textContent = 'Error inserting author: ' + error.message;
    });
}

document.getElementById('insertAuthorButton').addEventListener('click', insertAuthor);

// ---> EDITAR AUTOR
let currentAuthorId = null;



function toggleAllAuthorsDisplay() {
    const container = document.getElementById('authorList');
    if (container.style.display === 'block') {
        container.style.display = 'none';  
    } else {
        container.style.display = 'block'; 
        showAllAuthors(); 
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('showAllAuthorsButton').addEventListener('click', showAllAuthors);
});



// <------------------------------> FUNCIONES AUTORES <------------------------------> 
// showAllAuthorsButton
// ---> MOSTRAR AUTORES

function showAllAuthors() {
    fetch('http://localhost:8000/authors')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching authors: ' + response.statusText);
            }
            return response.json();
        })
        .then(authors => {
            const authorsList = document.getElementById('authorsList');
            authorsList.innerHTML = '';
            authors.forEach(author => {
                const authorElement = document.createElement('div');
                authorElement.id = 'author-' + encodeURIComponent(author.nombre);
                authorElement.textContent = author.nombre;

                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.className = 'edit-author-btn';
                editButton.onclick = () => editAuthor(author._id, author.nombre);
                authorElement.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Borrar';
                deleteButton.className = 'delete-author-btn';
                deleteButton.onclick = () => deleteAuthor(author.nombre);
                authorElement.appendChild(deleteButton);

                authorsList.appendChild(authorElement);
            });
            authorsList.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching authors:', error);
            document.getElementById('errorDisplay').textContent = 'Error fetching authors: ' + error.message;
        });
}

function editAuthor(authorId, authorName) {
    currentAuthorId = authorId;
    document.getElementById('authorNameInput').value = authorName;
    document.getElementById('insertAuthorButton').style.display = 'none';
    document.getElementById('updateAuthorButton').style.display = 'inline-block';
}

document.getElementById('updateAuthorButton').addEventListener('click', function() {
    const authorName = document.getElementById('authorNameInput').value.trim();

    if (!authorName) {
        console.error("Please fill in all fields.");
        document.getElementById('errorDisplay').textContent = "Please fill in all fields.";
        return;
    }

    const authorData = { nombre: authorName };
    fetch(`http://localhost:8000/authors/${encodeURIComponent(currentAuthorId)}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(authorData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update the author');
        }
        return response.json();
    })
    .then(data => {
        console.log('Author updated:', data);
        document.getElementById('statusDisplay').textContent = 'Author updated successfully';
        showAllAuthors();
    })
    .catch(error => {
        console.error('Error updating author:', error);
        document.getElementById('errorDisplay').textContent = 'Error updating author: ' + error.message;
    });

    document.getElementById('insertAuthorButton').style.display = 'inline-block';
    document.getElementById('updateAuthorButton').style.display = 'none';
    document.getElementById('authorNameInput').value = '';
});


document.getElementById('actualizarAutorBtn').addEventListener('click', function() {
    const authorName = document.getElementById('authorNameInput').value; 
    const newAuthorDetails = { nombre: authorName };
    updateAuthor(authorName, newAuthorDetails);
});


function deleteAuthor(authorName) {
    const url = `http://localhost:8000/authors/${encodeURIComponent(authorName)}`;
    fetch(url, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Autor borrado:', data);
        showAllAuthors();
    })
    .catch(error => {
        console.error('Error borrando autor:', error);
        document.getElementById('errorDisplay').textContent = 'Error borrando autor: ' + error.message;
    });
}

function insertAuthor() {
    const authorName = document.getElementById('authorNameInput').value;
    if (!authorName) {
        console.error("Author name input is empty.");
        return;
    }
    console.log("Inserting author:", authorName);
    const authorData = { nombre: authorName };
    fetch('http://localhost:8000/authors', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(authorData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Author inserted correctly:', data);
        showAllAuthors(); 
    })
    .catch(error => {
        console.error('Error inserting author:', error);
        document.getElementById('errorDisplay').textContent = 'Error inserting author: ' + error.message;
    });
}

document.getElementById('insertAuthorButton').addEventListener('click', insertAuthor);

// ---> EDITAR AUTOR
//let currentAuthorId = null;

// ---> MOSTRAR / OCULTAR LISTA DE AUTORES
function toggleAllAuthorsDisplay() {
    const container = document.getElementById('authorsList');
    if (container.style.display === 'block') {
        container.style.display = 'none';  
    } else {
        showAllAuthors(); 
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('showAllAuthorsButton').addEventListener('click', toggleAllAuthorsDisplay);
});


function toggleAllAuthorsDisplay() {
    const container = document.getElementById('authorsList'); // Cambiado a 'authorsList'
    if (container.style.display === 'block') {
        container.style.display = 'none';  
    } else {
        container.style.display = 'block'; 
        showAllAuthors(); 
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('showAllAuthorsButton').addEventListener('click', toggleAllAuthorsDisplay); // Cambiado a toggleAllAuthorsDisplay
});



// ---> MOSTRAR LIBROS
function showAllBooks() {
    fetch('http://localhost:8000/books')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching books: ' + response.statusText);
            }
            return response.json();
        })
        .then(books => {
            const booksList = document.getElementById('booksList');
            booksList.innerHTML = '';
            books.forEach(book => {
                const bookElement = document.createElement('div');
                bookElement.id = 'book-' + encodeURIComponent(book.isbn);
                bookElement.textContent = `${book.titulo} (ISBN: ${book.isbn})`;

                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.className = 'edit-book-btn';
                editButton.onclick = () => editBook(book._id, book.titulo, book.isbn);
                bookElement.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Borrar';
                deleteButton.className = 'delete-book-btn';
                deleteButton.onclick = () => deleteBook(book.isbn);
                bookElement.appendChild(deleteButton);

                booksList.appendChild(bookElement);
            });
            booksList.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            document.getElementById('errorDisplay').textContent = 'Error fetching books: ' + error.message;
        });
}

// ---> EDITAR LIBRO
let currentBookId = null; // Definir la variable antes de usarla

// Función para editar un libro
function editBook(bookId, bookTitle, bookIsbn) {
    currentBookId = bookId;
    document.getElementById('updateBookTitleInput').value = bookTitle;
    document.getElementById('updateBookIsbnInput').value = bookIsbn;
    document.getElementById('insertBookButton').style.display = 'none';
    document.getElementById('updateBookButton').style.display = 'inline-block';
}

// Función para guardar cambios de un libro
function saveBookChanges() {
    const newTitle = document.getElementById('updateBookTitleInput').value;
    const newIsbn = document.getElementById('updateBookIsbnInput').value;
    if (!newTitle || !newIsbn) {
        console.error("New book title or ISBN input is empty.");
        return;
    }
    const url = `http://localhost:8000/books/${encodeURIComponent(currentBookId)}`;
    const updatedData = { titulo: newTitle, isbn: newIsbn };
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Book updated successfully:', data);
        document.getElementById('statusDisplay').textContent = 'Book updated successfully';
        showAllBooks();
    })
    .catch(error => {
        console.error('Error updating book:', error);
        document.getElementById('errorDisplay').textContent = 'Error updating book: ' + error.message;
    });

    document.getElementById('insertBookButton').style.display = 'inline-block';
    document.getElementById('updateBookButton').style.display = 'none';
    document.getElementById('updateBookTitleInput').value = '';
    document.getElementById('updateBookIsbnInput').value = '';
}

document.getElementById('updateBookButton').addEventListener('click', saveBookChanges);

function toggleAllBooksDisplay() {
    const container = document.getElementById('booksList');
    if (container.style.display === 'block') {
        container.style.display = 'none';  
    } else {
        showAllBooks();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('showAllBooksButton').addEventListener('click', toggleAllBooksDisplay);
});

// --> INSERTAR LIBRO
document.addEventListener('DOMContentLoaded', function() {
    const insertBookButton = document.getElementById('insertBookButton');
    insertBookButton.addEventListener('click', insertBook);
    console.log("Boton se oprime")
});

function insertBook() {
    const titleInput = document.getElementById('bookTitleInput');
    const isbnInput = document.getElementById('bookIsbnInput');

    if (!titleInput || !isbnInput) {
        console.error('Input fields not found.');
        document.getElementById('errorDisplay').textContent = 'Input fields not found.';
        return;
    }

    const title = titleInput.value.trim();
    const isbn = isbnInput.value.trim();

    if (!title || !isbn) {
        console.error("Title or ISBN input is empty.");
        document.getElementById('errorDisplay').textContent = "Please fill in both title and ISBN.";
        return;
    }

    console.log("Inserting book:", title, "with ISBN:", isbn);
    const bookData = { titulo: title, isbn: isbn };

    fetch('http://localhost:8000/books', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(bookData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Book inserted correctly:', data);
        showAllBooks();
    })
    .catch(error => {
        console.error('Error inserting book:', error);
        document.getElementById('errorDisplay').textContent = 'Error inserting book: ' + error.message;
    });
}

// ---> ELIMINAR LIBRO
function deleteBook(bookIsbn) {
    const url = `http://localhost:8000/books/${encodeURIComponent(bookIsbn)}`;
    fetch(url, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error deleting book: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Book deleted:', data);
        removeBookFromUI(bookIsbn);
    })
    .catch(error => {
        console.error('Error deleting book:', error);
        document.getElementById('errorDisplay').textContent = 'Error deleting book: ' + error.message;
    });
}

function removeBookFromUI(bookIsbn) {
    const bookId = 'book-' + encodeURIComponent(bookIsbn);
    const bookElement = document.getElementById(bookId);
    if (bookElement) {
        bookElement.parentNode.removeChild(bookElement);
        console.log('Book element removed from UI:', bookId);
    } else {
        console.error('Failed to find the book element in UI:', bookId);
    }
}



// <------------------------------ FUNCIONES EDICIONES ------------------------------>
var lastEditionSearch = ''; 
// ---> MOSTRAR TODAS LAS EDICIONES
function toggleAllEditionsDisplay() {
    const container = document.getElementById('editionsList');
    if (container.style.display === 'block') {
        container.style.display = 'none';  
    } else {
        container.style.display = 'block'; 
        showAllEditions(); 
    }
}


// ---> MOSTRAR EDICIONES
function showAllEditions() {
    fetch('http://localhost:8000/editions')
        .then(response => response.json())
        .then(editions => {
            const editionsList = document.getElementById('editionsList');
            editionsList.innerHTML = '';
            editions.forEach(edition => {
                const editionElement = document.createElement('div');
                editionElement.id = 'edition-' + encodeURIComponent(edition.isbn);
                editionElement.textContent = `ISBN: ${edition.isbn}, Año: ${edition.anyo}, Idioma: ${edition.idioma}`;

                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.className = 'edit-edition-btn';
                editButton.onclick = () => editEdition(edition.isbn, edition.anyo, edition.idioma);
                editionElement.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Borrar';
                deleteButton.className = 'delete-edition-btn';
                deleteButton.onclick = () => deleteEdition(edition.isbn);
                editionElement.appendChild(deleteButton);

                editionsList.appendChild(editionElement);
            });
        })
        .catch(error => {
            console.error('Error fetching editions:', error);
            document.getElementById('errorDisplay').textContent = 'Error fetching editions: ' + error.message;
        });
}


// ---> EDITAR EDICIÓN
let currentEditionId = null;

function editEdition(isbn, year, language) {
    currentEditionId = isbn;
    document.getElementById('editionIsbnInput').value = isbn;
    document.getElementById('yearInput').value = year;
    document.getElementById('languageInput').value = language;
    document.getElementById('insertEditionButton').style.display = 'none';
    document.getElementById('updateEditionButton').style.display = 'inline-block';
}

document.getElementById('updateEditionButton').addEventListener('click', function() {
    const isbn = document.getElementById('editionIsbnInput').value.trim();
    const year = parseInt(document.getElementById('yearInput').value.trim(), 10);
    const language = document.getElementById('languageInput').value.trim();

    if (!isbn || isNaN(year) || !language) {
        console.error("Please fill in all fields correctly.");
        document.getElementById('errorDisplay').textContent = "Please fill in all fields correctly.";
        return;
    }

    const editionData = { isbn, anyo: year, idioma: language };

    fetch(`http://localhost:8000/editions/${encodeURIComponent(currentEditionId)}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(editionData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update the edition');
        }
        return response.json();
    })
    .then(data => {
        console.log('Edition updated:', data);
        document.getElementById('statusDisplay').textContent = 'Edition updated successfully';
        showAllEditions();
    })
    .catch(error => {
        console.error('Error updating edition:', error);
        document.getElementById('errorDisplay').textContent = 'Error updating edition: ' + error.message;
    });

    document.getElementById('insertEditionButton').style.display = 'inline-block';
    document.getElementById('updateEditionButton').style.display = 'none';
    document.getElementById('editionIsbnInput').value = '';
    document.getElementById('yearInput').value = '';
    document.getElementById('languageInput').value = '';
});

// --> BORRAR EDICION
function deleteEdition(isbn) {
    const url = `http://localhost:8000/editions/${encodeURIComponent(isbn)}`;
    fetch(url, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Edition borrada:', data);
        showAllEditions();
    })
    .catch(error => {
        console.error('Error borrando edición:', error);
        document.getElementById('errorDisplay').textContent = 'Error borrando edición: ' + error.message;
    });
}


// --> INSERTAR EDICION
document.getElementById('insertEditionButton').addEventListener('click', function() {
    insertEdition();
});

function insertEdition() {
    const isbn = document.getElementById('editionIsbnInput').value;
    const anyo = document.getElementById('yearInput').value;
    const idioma = document.getElementById('languageInput').value;
    if (!isbn || !anyo || !idioma) {
        console.error("All edition fields must be filled.");
        return;
    }
    console.log("Inserting edition:", isbn);
    const editionData = {
        isbn: isbn,
        anyo: anyo,
        idioma: idioma
    };

    fetch('http://localhost:8000/editions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editionData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Edition inserted:', data);
        showAllEditions();
    })
    .catch(error => {
        console.error('Error inserting edition:', error);
        document.getElementById('errorDisplay').textContent = 'Error inserting edition: ' + error.message;
    });
}

document.getElementById('updateEditionButton').addEventListener('click', function() {
    const isbn = document.getElementById('updateEditionIsbnInput').value.trim();
    const year = parseInt(document.getElementById('updateEditionYearInput').value.trim(), 10);
    const language = document.getElementById('updateEditionLanguageInput').value.trim();

    if (!isbn || isNaN(year) || !language) {
        console.error("Please fill in all fields correctly.");
        document.getElementById('errorDisplay').textContent = "Please fill in all fields correctly.";
        return;
    }

    const editionData = { isbn, year, language }; 

    fetch(`http://localhost:8000/editions/${encodeURIComponent(isbn)}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(editionData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update the edition');
        }
        return response.json();
    })
    .then(data => {
        console.log('Edition updated:', data);
    })
    .catch(error => {
        console.error('Error updating edition:', error);
        document.getElementById('errorDisplay').textContent = 'Error updating edition: ' + error.message;
    });
});



// <-------------------------------- FUNCIONES COPIA -------------------------------->

// Función para alternar la visualización de todas las copias
function toggleAllCopiesDisplay() {
    const container = document.getElementById('copyList');
    if (container.style.display === 'block') {
        container.style.display = 'none';  
    } else {
        container.style.display = 'block'; 
        showAllCopies(); 
    }
}

// ---> MOSTRAR COPIAS
function showAllCopies() {
    fetch('http://localhost:8000/copies')
        .then(response => response.json())
        .then(copies => {
            const copiesList = document.getElementById('copyList');
            copiesList.innerHTML = '';
            copies.forEach(copy => {
                const copyElement = document.createElement('div');
                copyElement.id = `copy-${copy.isbn}-${copy.numero}`;
                copyElement.textContent = `Copy No: ${copy.numero}, ISBN: ${copy.isbn}`;

                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.className = 'edit-copy-btn';
                editButton.onclick = () => editCopy(copy.isbn, copy.numero);
                copyElement.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Borrar';
                deleteButton.className = 'delete-copy-btn';
                deleteButton.onclick = () => deleteCopy(copy.isbn, copy.numero);
                copyElement.appendChild(deleteButton);

                copiesList.appendChild(copyElement);
            });
        })
        .catch(error => {
            console.error('Error fetching copies:', error);
            document.getElementById('errorDisplay').textContent = 'Error fetching copies: ' + error.message;
        });
}


// --> BORRAR COPIA
function deleteCopy(isbn, copyNumber) {
    const url = `http://localhost:8000/copies/${encodeURIComponent(isbn)}/${encodeURIComponent(copyNumber)}`;
    fetch(url, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete the copy: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Copy deleted:', data);
        removeCopyFromUI(isbn, copyNumber);
    })
    .catch(error => {
        console.error('Error deleting copy:', error);
        document.getElementById('errorDisplay').textContent = 'Error deleting copy: ' + error.message;
    });
}

function removeCopyFromUI(isbn, copyNumber) {
    const copyId = `copy-${encodeURIComponent(isbn)}-${encodeURIComponent(copyNumber)}`;
    const copyElement = document.getElementById(copyId);
    if (copyElement) {
        copyElement.parentNode.removeChild(copyElement);
        console.log('Copy element removed from UI:', copyId);
    } else {
        console.error('Failed to find the copy element in UI:', copyId);
    }
}


// ---> EDITAR COPIA
let currentCopyId = null;

function editCopy(isbn, number) {
    currentCopyId = { isbn, number };
    document.getElementById('copyIsbnInput').value = isbn;
    document.getElementById('copyNumberInput').value = number;
    document.getElementById('insertCopyButton').style.display = 'none';
    document.getElementById('updateCopyButton').style.display = 'inline-block';
}

document.getElementById('updateCopyButton').addEventListener('click', function() {
    const isbn = document.getElementById('copyIsbnInput').value.trim();
    const number = parseInt(document.getElementById('copyNumberInput').value.trim(), 10);

    if (!isbn || isNaN(number)) {
        console.error("Please fill in all fields.");
        document.getElementById('errorDisplay').textContent = "Please fill in all fields.";
        return;
    }

    const copyData = { isbn, numero: number };

    fetch(`http://localhost:8000/copies/${encodeURIComponent(currentCopyId.isbn)}/${encodeURIComponent(currentCopyId.number)}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(copyData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update the copy');
        }
        return response.json();
    })
    .then(data => {
        console.log('Copy updated:', data);
        document.getElementById('statusDisplay').textContent = 'Copy updated successfully';
        showAllCopies();
    })
    .catch(error => {
        console.error('Error updating copy:', error);
        document.getElementById('errorDisplay').textContent = 'Error updating copy: ' + error.message;
    });

    document.getElementById('insertCopyButton').style.display = 'inline-block';
    document.getElementById('updateCopyButton').style.display = 'none';
    document.getElementById('copyIsbnInput').value = '';
    document.getElementById('copyNumberInput').value = '';
});



// --> BORRAR COPIA DE LA PÁGINA WEB
function removeCopyFromUI(isbn, copyNumber) {
    var copyId = `copy-${isbn}-${copyNumber}`;
    var copyElement = document.getElementById(copyId);
    if (copyElement) {
        copyElement.parentNode.removeChild(copyElement);
    }
}


// --> INSERTAR COPIA
document.getElementById('insertCopyButton').addEventListener('click', function() {
    insertCopy();
});

function insertCopy() {
    const copyNumber = document.getElementById('copyNumberInput').value;
    const isbn = document.getElementById('copyIsbnInput').value;
    if (!copyNumber || !isbn) {
        console.error("Copy number or ISBN input is empty.");
        document.getElementById('errorDisplay').textContent = 'Please fill in all fields.';
        return;
    }
    console.log("Inserting copy:", copyNumber, "for ISBN:", isbn);
    const copyData = {
        numero: copyNumber,
        isbn: isbn
    };

    fetch('http://localhost:8000/copies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(copyData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Copy inserted:', data);
        showAllCopies();  
    })
    .catch(error => {
        console.error('Error inserting copy:', error);
        document.getElementById('errorDisplay').textContent = 'Error inserting copy: ' + error.message;
    });
}


// --> BORRAR COPIA
function deleteCopy(isbn, copyNumber) {
    const url = `http://localhost:8000/copies/${encodeURIComponent(isbn)}/${encodeURIComponent(copyNumber)}`;
    fetch(url, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete the copy: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Copy deleted:', data);
        removeCopyFromUI(isbn, copyNumber);
    })
    .catch(error => {
        console.error('Error deleting copy:', error);
        document.getElementById('errorDisplay').textContent = 'Error deleting copy: ' + error.message;
    });
}

function removeCopyFromUI(isbn, copyNumber) {
    const copyId = `copy-${encodeURIComponent(isbn)}-${encodeURIComponent(copyNumber)}`;
    const copyElement = document.getElementById(copyId);
    if (copyElement) {
        copyElement.parentNode.removeChild(copyElement);
        console.log('Copy element removed from UI:', copyId);
    } else {
        console.error('Failed to find the copy element in UI:', copyId);
    }
}


document.getElementById('updateCopyButton').addEventListener('click', function() {
    const isbn = document.getElementById('updateCopyIsbnInput').value.trim();
    const copyNumber = document.getElementById('updateCopyNumberInput').value;

    if (!isbn || !copyNumber) {
        console.error("Please fill in all fields.");
        document.getElementById('errorDisplay').textContent = "Please fill in all fields.";
        return;
    }

    const copyData = {
        isbn: isbn,
        numero: copyNumber
    };

    fetch(`http://localhost:8000/copies/${encodeURIComponent(isbn)}/${encodeURIComponent(copyNumber)}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(copyData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update the copy');
        }
        return response.json();
    })
    .then(data => {
        console.log('Copy updated:', data);
    })
    .catch(error => {
        console.error('Error updating copy:', error);
        document.getElementById('errorDisplay').textContent = 'Error updating copy: ' + error.message;
    });
});



// <-------------------------> FUNCIONES PRESTAMOS <----------------------->

// Función para alternar la visualización de todos los préstamos
function toggleAllLoansDisplay() {
    const container = document.getElementById('loanList');
    if (container.style.display === 'block') {
        container.style.display = 'none';
    } else {
        container.style.display = 'block';
        showAllLoans();
    }
}

// Mostrar todos los préstamos
function showAllLoans() {
    fetch('http://localhost:8000/loans')
        .then(response => response.json())
        .then(loans => {
            const loanList = document.getElementById('loanList');
            loanList.innerHTML = '';
            loans.forEach(loan => {
                const loanElement = document.createElement('div');
                loanElement.textContent = `ISBN: ${loan.isbn}, Copia: ${loan.numero}, Usuario: ${loan.rut}`;

                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.className = 'edit-loan-btn';
                editButton.onclick = () => editLoan(loan.isbn, loan.numero, loan.rut, loan.fecha_pres, loan.fecha_dev);
                loanElement.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Borrar';
                deleteButton.onclick = () => deleteLoan(loan.isbn, loan.numero, loan.rut, loanElement);

                loanElement.appendChild(deleteButton);
                loanList.appendChild(loanElement);
            });
        })
        .catch(error => {
            console.error('Error fetching loans:', error);
            document.getElementById('errorDisplay').textContent = 'Error fetching loans: ' + error.message;
        });
}


function deleteLoan(isbn, numero, rut, loanElement) {
    console.log(`Attempting to delete loan with ISBN: ${isbn}, number: ${numero}, RUT: ${rut}`);
    fetch(`http://localhost:8000/loans/${isbn}/${numero}/${rut}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {throw new Error('Failed to delete loan: ' + JSON.stringify(err));});
        }
        return response.json();
    })
    .then(data => {
        console.log('Loan deleted:', data);
        document.getElementById('statusDisplay').textContent = 'Loan deleted successfully';
        loanElement.remove();  
    })
    .catch(error => {
        console.error('Error deleting loan:', error);
        document.getElementById('errorDisplay').textContent = 'Error deleting loan: ' + error.message;
    });
}



// Insertar un préstamo
document.addEventListener('DOMContentLoaded', function() {
    const insertLoanButton = document.getElementById('insertLoanButton');
    if (insertLoanButton) {
        insertLoanButton.addEventListener('click', insertLoan);
    } else {
        console.error('Insert Loan button not found.');
    }
});


function insertLoan() {
    const loanUserRUTInput = document.getElementById('loanUserRUTInput');
    const loanBookTitleInput = document.getElementById('loanBookTitleInput');
    const loanStartDateInput = document.getElementById('loanStartDateInput');
    const loanEndDateInput = document.getElementById('loanEndDateInput');

    if (!loanUserRUTInput || !loanBookTitleInput || !loanStartDateInput || !loanEndDateInput) {
        console.error('One or more input fields are missing.');
        document.getElementById('errorDisplay').textContent = 'One or more input fields are missing.';
        return;
    }

    const userRUT = loanUserRUTInput.value.trim();
    const bookTitle = loanBookTitleInput.value.trim();
    const startDate = loanStartDateInput.value;
    const endDate = loanEndDateInput.value;

    if (!userRUT || !bookTitle || !startDate || !endDate) {
        console.error('One or more input fields are empty.');
        document.getElementById('errorDisplay').textContent = 'One or more input fields are empty.';
        return;
    }

    const loanData = {
        rut: userRUT,
        isbn: bookTitle,
        numero: 1,  // Proporciona el número de la copia, si es relevante
        fecha_pres: startDate,
        fecha_dev: endDate
    };

    console.log('Sending loan data:', loanData);

    fetch('http://localhost:8000/loans', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loanData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {throw new Error('Failed to insert loan: ' + JSON.stringify(err));});
        }
        return response.json();
    })
    .then(data => {
        console.log('Loan inserted:', data);
        document.getElementById('statusDisplay').textContent = 'Loan inserted successfully';
        showAllLoans();
    })
    .catch(error => {
        console.error('Error inserting loan:', error);
        document.getElementById('errorDisplay').textContent = 'Error inserting loan: ' + error.message;
    });
}





// <-------------------------> FUNCIONES USUARIOS <----------------------->

// Función para alternar la visualización de todos los usuarios
function toggleAllUsersDisplay() {
    const container = document.getElementById('userList');
    if (container.style.display === 'block') {
        container.style.display = 'none';  
    } else {
        container.style.display = 'block'; 
        showAllUsers(); 
    }
}


// Mostrar todos los usuarios
function showAllUsers() {
    fetch('http://localhost:8000/users')
        .then(response => response.json())
        .then(users => {
            const userList = document.getElementById('userList');
            userList.innerHTML = '';
            users.forEach(user => {
                const userElement = document.createElement('div');
                userElement.id = 'user-' + encodeURIComponent(user.rut);
                userElement.textContent = `RUT: ${user.rut}, Nombre: ${user.nombre}`;

                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.className = 'edit-user-btn';
                editButton.onclick = () => editUser(user.rut, user.nombre);
                userElement.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Borrar';
                deleteButton.className = 'delete-user-btn';
                deleteButton.onclick = () => deleteUser(user.rut);
                userElement.appendChild(deleteButton);

                userList.appendChild(userElement);
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            document.getElementById('errorDisplay').textContent = 'Error fetching users: ' + error.message;
        });
}


// ---> Insertar usuario
document.getElementById('insertUserButton').addEventListener('click', function() {
    insertUser();
});


function insertUser() {
    const userNameInput = document.getElementById('userNameInput');
    const userRutInput = document.getElementById('userRutInput');

    // Agregar logs para verificar los valores de los campos de entrada
    console.log('userNameInput:', userNameInput);
    console.log('userRutInput:', userRutInput);

    if (!userNameInput || !userRutInput) {
        console.error('Input fields not found.');
        document.getElementById('errorDisplay').textContent = 'Input fields not found.';
        return;
    }

    const userName = userNameInput.value.trim();
    const userRut = userRutInput.value.trim();

    console.log('userName:', userName);
    console.log('userRut:', userRut);

    if (!userName || !userRut) {
        console.error('User name or RUT input is empty.');
        document.getElementById('errorDisplay').textContent = 'User name or RUT input is empty.';
        return;
    }

    const userData = { nombre: userName, rut: userRut };

    fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to insert user: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('User inserted:', data);
        document.getElementById('statusDisplay').textContent = 'User inserted successfully';
        showAllUsers();
    })
    .catch(error => {
        console.error('Error inserting user:', error);
        document.getElementById('errorDisplay').textContent = 'Error inserting user: ' + error.message;
    });
}


// ---> EDITAR USUARIO
let currentUserId = null;

function editUser(userRut, userName) {
    currentUserId = userRut;
    document.getElementById('userRutInput').value = userRut;
    document.getElementById('userNameInput').value = userName;
    document.getElementById('insertUserButton').style.display = 'none';
    document.getElementById('updateUserButton').style.display = 'inline-block';
}

document.getElementById('updateUserButton').addEventListener('click', function() {
    const userRut = document.getElementById('userRutInput').value.trim();
    const userName = document.getElementById('userNameInput').value.trim();

    if (!userRut || !userName) {
        console.error("Please fill in all fields.");
        document.getElementById('errorDisplay').textContent = "Please fill in all fields.";
        return;
    }

    const userData = { nombre: userName };

    fetch(`http://localhost:8000/users/${encodeURIComponent(currentUserId)}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update the user');
        }
        return response.json();
    })
    .then(data => {
        console.log('User updated:', data);
        document.getElementById('statusDisplay').textContent = 'User updated successfully';
        showAllUsers();
    })
    .catch(error => {
        console.error('Error updating user:', error);
        document.getElementById('errorDisplay').textContent = 'Error updating user: ' + error.message;
    });

    document.getElementById('insertUserButton').style.display = 'inline-block';
    document.getElementById('updateUserButton').style.display = 'none';
    document.getElementById('userRutInput').value = '';
    document.getElementById('userNameInput').value = '';
});



// Borrar un usuario
function deleteUser(rut) {
    const url = `http://localhost:8000/users/${encodeURIComponent(rut)}`;
    fetch(url, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to delete the user: ${response.statusText}`);
        }
        return response.text();
    })
    .then(message => {
        console.log('User deleted:', message);
        showAllUsers();  
    })
    .catch(error => {
        console.error('Error deleting user:', error);
        document.getElementById('errorDisplay').textContent = `Error deleting user: ${error.message}`;
    });
}

function removeUserFromUI(userRut) {
    const userElement = document.getElementById(`user-${encodeURIComponent(userRut)}`);
    if (userElement) {
        userElement.parentNode.removeChild(userElement);
        console.log('User element removed from UI:', userRut);
    } else {
        console.error('Failed to find the user element in UI:', userRut);
    }
}

// ACTUALIZAR USUARIO
document.getElementById('updateUserButton').addEventListener('click', function() {
    const userName = document.getElementById('updateUserNameInput').value.trim();
    const userRut = document.getElementById('updateUserRutInput').value.trim();

    if (!userName || !userRut) {
        console.error("Please fill in all fields.");
        document.getElementById('errorDisplay').textContent = "Please fill in all fields.";
        return;
    }

    const userData = { nombre: userName };
    fetch(`http://localhost:8000/users/${encodeURIComponent(userRut)}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update the user');
        }
        return response.json();
    })
    .then(data => {
        console.log('User updated:', data);
    })
    .catch(error => {
        console.error('Error updating user:', error);
        document.getElementById('errorDisplay').textContent = 'Error updating user: ' + error.message;
    });
});
