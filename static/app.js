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
    container.innerHTML = ''; // Clear previous entries
    data.forEach(copy => {
        const copyElement = document.createElement('div');
        copyElement.classList.add('copy-item'); // Agregar clase para estilización
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
let lastUserSearch = ''; // Variable para almacenar el último usuario buscado

document.getElementById('showLoansByUserButton').addEventListener('click', function() {
    const userName = document.getElementById('userNameInput').value.trim();
    const container = document.getElementById('loansList');
    
    // Toggle visibility if the same user is searched again
    if (container.style.display === 'block' && lastUserSearch === userName) {
        container.style.display = 'none';
        container.innerHTML = ''; // Clear the previous content
    } else {
        lastUserSearch = userName; // Update last search
        container.style.display = 'block';
        fetchLoansByUser(userName);
    }
});

function fetchLoansByUser(userName) {
    fetch(`http://localhost:8000/query2/${encodeURIComponent(userName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch book copies');
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos:", data);  // Esto te ayudará a ver lo que recibes del servidor
            displayLoans(data);
        })
        .catch(error => {
            console.error('Error fetching loans:', error);
            document.getElementById('errorDisplay').textContent = 'Error fetching loans: ' + error.message;
        });
}

function displayLoans(data) {
    const container = document.getElementById('loansList');
    container.innerHTML = ''; // Clear previous entries
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

// ---> MOSTRAR AUTORES
function showAllAuthors() {
    fetch('http://localhost:8000/authors')
        .then(response => response.json())
        .then(authors => {
            const authorsList = document.getElementById('authorsList');
            authorsList.innerHTML = '';
            authors.forEach(author => {
                const authorElement = document.createElement('div');
                authorElement.id = 'author-' + encodeURIComponent(author.nombre);
                authorElement.textContent = author.nombre;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Borrar';
                deleteButton.className = 'delete-author-btn'
                deleteButton.onclick = () => deleteAuthor(author.nombre);
                authorElement.appendChild(deleteButton);
                authorsList.appendChild(authorElement);
            });
        })
        .catch(error => {
            console.error('Error fetching authors:', error);
            document.getElementById('errorDisplay').textContent = 'Error fetching authors: ' + error.message;
        });
}


function displayAuthorsDetails(authors) {
    const authorsList = document.getElementById('authorsList');
    authorsList.innerHTML = ''; 
    authors.forEach(author => {
        const authorElement = document.createElement('div');
        authorElement.textContent = `Nombre: ${author.nombre}`;
        authorsList.appendChild(authorElement);
    });
}


function toggleAllAuthorsDisplay() {
    const container = document.getElementById('authorsList');
    if (container.style.display === 'block') {
        container.style.display = 'none';  
    } else {
        container.style.display = 'block'; 
        showAllAuthors(); 
    }
}


// --> BORRAR AUTOR
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

// --> BORRAR AUTOR DE LA PAGINA WEB
function removeAuthorFromUI(authorName) {
    var authorId = 'author-' + encodeURIComponent(authorName);
    var authorElement = document.getElementById(authorId);
    if (authorElement) {
        authorElement.parentNode.removeChild(authorElement);
    }
}

// --> MANEJAR ERRORES - AUTORES
function handleResponse(response) {
    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.status + ' ' + response.statusText);
    }
    return response.json();
}


// --> INSERTAR AUTOR
document.getElementById('insertAuthorButton').addEventListener('click', function() {
    insertAuthor();
});


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
        showAllAuthors(); // To refresh the list
    })
    .catch(error => {
        console.error('Error inserting author:', error);
        document.getElementById('errorDisplay').textContent = 'Error inserting author: ' + error.message;
    });
}


// Event listener para el botón de actualizar autor
document.getElementById('actualizarAutorBtn').addEventListener('click', function() {
    const authorName = document.getElementById('authorNameInput').value; // Asume que hay un campo de entrada con ID 'authorNameInput'
    const newAuthorDetails = {
        nombre: authorName,
        // Aquí podrías añadir otros detalles que necesites actualizar
    };

    updateAuthor(authorName, newAuthorDetails);
});

function updateAuthor(name, details) {
    fetch(`http://localhost:8000/authors/${encodeURIComponent(name)}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(details)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(updatedAuthor => {
        console.log('Author updated:', updatedAuthor);
        document.getElementById('statusDisplay').textContent = 'Author updated successfully';
        // Actualizar la UI según sea necesario
    })
    .catch(error => {
        console.error('Error updating author:', error);
        document.getElementById('errorDisplay').textContent = 'Error updating author: ' + error.message;
    });
}




// <----------------------------------> FUNCIONES LIBROS <----------------------------------> 

// Función para alternar la visualización de todos los libros
function toggleAllBooksDisplay() {
    const container = document.getElementById('booksList');
    if (container.style.display === 'block') {
        container.style.display = 'none';  
    } else {
        container.style.display = 'block'; 
        showAllBooks(); 
    }
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('showAllBooksButton').addEventListener('click', showAllBooks);
});


// ---> MOSTRAR LIBROS
function showAllBooks() {
    fetch('http://localhost:8000/books')
        .then(response => response.json())
        .then(books => {
            const booksList = document.getElementById('booksList');
            booksList.innerHTML = ''; // Limpiar lista antes de mostrar nuevos resultados
            books.forEach(book => {
                const bookElement = document.createElement('div');
                bookElement.className = 'book-entry';
                bookElement.setAttribute('data-title', book.titulo); // Agregar atributo data-title
                bookElement.innerHTML = `
                    <div><strong>Título:</strong> ${book.titulo}</div>
                    <div><strong>ISBN:</strong> ${book.isbn}</div>
                    <button onclick="deleteBook('${book.isbn}', '${book.titulo}')">Borrar</button>
                `;
                booksList.appendChild(bookElement);
            });
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            document.getElementById('errorDisplay').textContent = 'Error fetching books: ' + error.message;
        });
}



// Función para eliminar un libro de la interfaz de usuario usando el ISBN
function removeBookFromUI(isbn) {
    var bookId = 'book-' + encodeURIComponent(isbn); // Construye el ID del libro basado en el ISBN
    var bookElement = document.getElementById(bookId);
    if (bookElement) {
        bookElement.parentNode.removeChild(bookElement); // Elimina el libro de la UI
    } else {
        console.error('Failed to find the book element in UI:', isbn);
    }
}

// Función para eliminar un libro haciendo una petición al servidor
function deleteBook(isbn) {
    fetch(`http://localhost:8000/books/${encodeURIComponent(isbn)}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete the book: ' + response.statusText);
        }
        return response.text();
    })
    .then(message => {
        console.log('Book deleted:', message);
        removeBookFromUI(isbn); // Llama a la función para eliminar el libro de la UI
    })
    .catch(error => {
        console.error('Error deleting book:', error);
        document.getElementById('errorDisplay').textContent = 'Error deleting book: ' + error.message;
    });
}





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
        // Aquí puedes llamar a cualquier función para refrescar la lista de libros o actualizar la UI
    })
    .catch(error => {
        console.error('Error inserting book:', error);
        document.getElementById('errorDisplay').textContent = 'Error inserting book: ' + error.message;
    });
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
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Borrar';
                deleteButton.className = 'delete-edition-btn'
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
            throw new Error(`Failed to delete the copy: ${response.statusText}`);
        }
        return response.text();
    })
    .then(message => {
        console.log('Copy deleted:', message);
        removeCopyFromUI(copyNumber);  // Actualiza la lista de copias en la interfaz de usuario tras borrar
    })
    .catch(error => {
        console.error('Error deleting copy:', error);
        document.getElementById('errorDisplay').textContent = `Error deleting copy: ${error.message}`;
    });
}

function removeCopyFromUI(copyNumber) {
    var copyId = 'copy-' + encodeURIComponent(copyNumber);
    var copyElement = document.getElementById(copyId);
    if (copyElement) {
        copyElement.parentNode.removeChild(copyElement);
    }
}

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
            throw new Error(`Failed to delete the copy: ${response.statusText}`);
        }
        return response.text();
    })
    .then(message => {
        console.log('Copy deleted:', message);
        showAllCopies();  // Actualiza la lista de copias en la interfaz de usuario tras borrar
    })
    .catch(error => {
        console.error('Error deleting copy:', error);
        document.getElementById('errorDisplay').textContent = `Error deleting copy: ${error.message}`;
    });
}

// --> BORRAR COPIA DE LA PÁGINA WEB
function removeCopyFromUI(copyNumber) {
    var copyId = 'copy-' + encodeURIComponent(copyNumber);
    var copyElement = document.getElementById(copyId);
    if (copyElement) {
        copyElement.parentNode.removeChild(copyElement);
    }
}

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
            const loansList = document.getElementById('loanList');
            loansList.innerHTML = '';
            loans.forEach(loan => {
                const loanElement = document.createElement('div');
                loanElement.id = `loan-${loan.isbn}-${loan.numero}-${loan.rut}`;
                loanElement.textContent = `ISBN: ${loan.isbn}, Copia: ${loan.numero}, Usuario: ${loan.rut}`;
                loansList.appendChild(loanElement);
            });
        })
        .catch(error => {
            console.error('Error fetching loans:', error);
            document.getElementById('errorDisplay').textContent = 'Error fetching loans: ' + error.message;
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

document.addEventListener('DOMContentLoaded', function() {
    const insertLoanButton = document.getElementById('insertLoanButton');
    insertLoanButton.addEventListener('click', insertLoan);
});

function insertLoan() {
    const isbnInput = document.getElementById('loanIsbnInput');
    const numberInput = document.getElementById('loanNumberInput');
    const userRutInput = document.getElementById('loanUserRUTInput');
    const startDateInput = document.getElementById('loanStartDateInput');
    const endDateInput = document.getElementById('loanEndDateInput');

    if (!isbnInput || !numberInput || !userRutInput || !startDateInput || !endDateInput) {
        console.error("One or more input fields are missing.");
        document.getElementById('errorDisplay').textContent = "All input fields are required.";
        return;
    }

    const isbn = isbnInput.value.trim();
    const number = parseInt(numberInput.value, 10);
    const userRut = userRutInput.value.trim();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!isbn || isNaN(number) || !userRut || !startDate || !endDate) {
        console.error("Please fill in all fields correctly.");
        document.getElementById('errorDisplay').textContent = "Please fill in all fields correctly.";
        return;
    }

    const loanData = {
        isbn,
        numero: number,
        rut: userRut,
        fechaInicio: startDate,
        fechaFin: endDate
    };

    fetch('http://localhost:8000/loans', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(loanData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Loan inserted successfully:', data);
        // Actualiza la UI aquí si es necesario
    })
    .catch(error => {
        console.error('Error inserting loan:', error);
        document.getElementById('errorDisplay').textContent = `Error inserting loan: ${error.message}`;
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
    const userNameInput = document.getElementById('userNameInput').value; 
    const userRUTInput = document.getElementById('userRUTInput').value; 

    if (!userNameInput || !userRUTInput) {
        console.error('Input fields not found.');
        document.getElementById('errorDisplay').textContent = 'Input fields not found.';
        return;
    }

    console.log("Debug: userNameInput found", userNameInput); 

    const userName = userNameInput.value.trim();
    const userRut = userRutInput.value.trim();

    if (!userName || !userRut) {
        console.error("User name or RUT input is empty.");
        document.getElementById('errorDisplay').textContent = "Please fill in all fields.";
        return;
    }

    console.log("Inserting user:", userName, "with RUT:", userRut);
    const userData = { name: userName, rut: userRut };

    fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('User inserted correctly:', data);
        // Aquí puedes llamar a cualquier función para refrescar la lista de usuarios o actualizar la UI
    })
    .catch(error => {
        console.error('Error inserting user:', error);
        document.getElementById('errorDisplay').textContent = 'Error inserting user: ' + error.message;
    });
}




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
