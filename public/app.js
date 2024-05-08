function mostrarFormulario(coleccion) {
  const formulario = document.getElementById('formulario');
  formulario.innerHTML = `
    <h2>Gestionar ${coleccion}</h2>
    <form>
      <label for="accion">Acción:</label>
      <select id="accion">
        <option value="insertar">Insertar</option>
        <option value="actualizar">Actualizar</option>
        <option value="borrar">Borrar</option>
      </select>
      <br>
      <label for="datos">Datos:</label>
      <textarea id="datos" rows="4"></textarea>
      <br>
      <button type="button" onclick="realizarAccion('${coleccion}')">Realizar acción</button>
    </form>
    <div id="resultado"></div>
  `;
}

function toggleAccordion(id) {
  var panel = document.getElementById(id);
  if (panel.style.display === "block") {
      panel.style.display = "none";
  } else {
      panel.style.display = "block";
  }
}

function realizarAccion(coleccion, accion) {
  // Obtener los valores de los campos del formulario según la colección
  let datos;
  if (coleccion === 'autor') {
    datos = {
      nombre: document.getElementById('autorNombre').value,
      nacionalidad: document.getElementById('autorNacionalidad').value,
      fechaNacimiento: document.getElementById('autorFechaNacimiento').value
    };
  } else if (coleccion === 'libro') {
    datos = {
      titulo: document.getElementById('libroTitulo').value,
      autor: document.getElementById('libroAutor').value,
      isbn: document.getElementById('libroISBN').value,
      fechaPublicacion: document.getElementById('libroFechaPublicacion').value
    };
  } else if (coleccion === 'usuario') {
    datos = {
      nombre: document.getElementById('usuarioNombre').value,
      email: document.getElementById('usuarioEmail').value,
      telefono: document.getElementById('usuarioTelefono').value
    };
  } else if (coleccion === 'prestamo') {
    datos = {
      usuario: document.getElementById('prestamoUsuario').value,
      libro: document.getElementById('prestamoLibro').value,
      fechaPrestamo: document.getElementById('prestamoFechaPrestamo').value,
      fechaDevolucion: document.getElementById('prestamoFechaDevolucion').value
    };
  }}

    // Realizar la acción correspondiente (insertar, actualizar o borrar)
    function realizarAccion(coleccion, accion, datos) {
      if (accion === 'insertar') {
        // Lógica para insertar datos en la colección
        fetch(`/api/${coleccion}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(result => {
          console.log('Datos insertados correctamente', result);
          // Actualizar la interfaz de usuario si es necesario
        })
        .catch(error => {
          console.error('Error al insertar datos', error);
        });
      } else if (accion === 'actualizar') {
        // Lógica para actualizar datos en la colección
        const id = datos._id; // Suponiendo que el ID del documento se encuentra en datos._id
        delete datos._id; // Eliminar el campo _id de los datos a actualizar
    
        fetch(`/api/${coleccion}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(result => {
          console.log('Datos actualizados correctamente', result);
          // Actualizar la interfaz de usuario si es necesario
        })
        .catch(error => {
          console.error('Error al actualizar datos', error);
        });
      } else if (accion === 'borrar') {
        // Lógica para borrar datos de la colección
        const id = datos._id; // Suponiendo que el ID del documento se encuentra en datos._id
    
        fetch(`/api/${coleccion}/${id}`, {
          method: 'DELETE'
        })
        .then(response => response.json())
        .then(result => {
          console.log('Datos borrados correctamente', result);
          // Actualizar la interfaz de usuario si es necesario
        })
        .catch(error => {
          console.error('Error al borrar datos', error);
        });
      }
    }
    


// Función para mostrar el menú desplegable correspondiente
function mostrarSubMenu(coleccion) {
  // Ocultar todos los menús desplegables
  const dropdowns = document.querySelectorAll('.dropdown-content');
  dropdowns.forEach(dropdown => dropdown.style.display = 'none');
  // Mostrar el menú desplegable correspondiente
  const subMenu = document.getElementById(`${coleccion}SubMenu`);
  subMenu.style.display = 'block';
}

// Función para cerrar todos los menús desplegables
function cerrarMenusDesplegables() {
  const dropdowns = document.querySelectorAll('.dropdown-content');
  dropdowns.forEach(dropdown => dropdown.style.display = 'none');
}

// Manejar el clic en cualquier parte del documento para cerrar los menús desplegables
document.addEventListener('click', function(event) {
  const target = event.target;
  if (!target.matches('.dropbtn')) {
    cerrarMenusDesplegables();
  }
});

// Manejar el envío del formulario de búsqueda
document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const searchTerm = document.getElementById('searchInput').value;
  const selectedCollection = document.getElementById('searchCollection').value;
  searchData(selectedCollection, searchTerm);
});

// Obtener referencias a los elementos del DOM
const toggleSearchButton = document.getElementById('toggleSearchButton');
const searchFormContainer = document.getElementById('searchFormContainer');

// Manejar el clic en el botón de búsqueda en la barra de navegación
toggleSearchButton.addEventListener('click', function() {
  // Alternar la visibilidad del contenedor del formulario de búsqueda
  if (searchFormContainer.style.display === 'none' || !searchFormContainer.style.display) {
    searchFormContainer.style.display = 'block';
  } else {
    searchFormContainer.style.display = 'none';
  }
});

// Obtener referencia al botón de búsqueda
const searchButton = document.getElementById('searchButton');

// Manejar el clic en el botón de búsqueda
searchButton.addEventListener('click', function(event) {
  // Evitar el comportamiento por defecto del botón (enviar el formulario)
  event.preventDefault();

  // Obtener los valores de búsqueda y colección
  const searchTerm = document.getElementById('searchInput').value;
  const selectedCollection = document.getElementById('searchCollection').value;

  // Realizar la búsqueda
  searchData(selectedCollection, searchTerm);
});

function searchData() {
  const collection = document.getElementById('searchCollection').value;
  const searchTerm = document.getElementById('searchInput').value;
  const url = `/api/search/${collection}?term=${encodeURIComponent(searchTerm)}`;

  fetch(url)
    .then(response => {
      console.log('Response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Data:', data);
      displaySearchResults(data, collection);
      // Mostrar el título de los resultados de búsqueda
      document.getElementById('searchResultsTitle').style.display = 'block';
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function borrarElemento(coleccion, id) {
  fetch(`/api/${coleccion}/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      return response.text(); // Cambio aquí
    } else {
      throw new Error('Error en la respuesta del servidor');
    }
  })
  .then(result => {
    console.log('Elemento borrado correctamente', result);
    // Eliminar el elemento del DOM
    const elementoDOM = document.querySelector(`.card[data-id="${id}"]`);
    if (elementoDOM) {
      elementoDOM.remove();
    }
  })
  .catch(error => {
    console.error('Error al borrar el elemento', error);
  });
}


function displaySearchResults(results, collection) {
  const searchResults = document.getElementById('searchResults');
  
  if (results.length === 0) {
    searchResults.innerHTML = '<p>No se encontraron resultados.</p>';
  } else {
    let html = '<h3></h3>';
    html += '<div class="card-container">';
    results.forEach(item => {
      html += `<div class="card" data-id="${item.id}">`;
      if (collection === 'autor') {
        html += '<h4>' + item.nombre + '</h4>';
      } else if (collection === 'libro') {
        html += '<h4>' + item.titulo + '</h4>';  
      } else if (collection === 'usuario') {
        html += '<h4>' + item.nombre + '</h4>';
      } else if (collection === 'prestamo') {
        html += '<h4>' + item.usuario + '</h4>';
        html += '<p><strong>Fecha de Préstamo:</strong> ' + item.fechaPrestamo + '</p>';
        html += '<p><strong>Fecha de Devolución:</strong> ' + item.fechaDevolucion + '</p>';
      }
      html += '<button onclick="borrarElemento(\'' + collection + '\', ' + String(item.id) + ')">Borrar</button>';
      html += '</div>'; // Cerrar div de tarjeta
    });
    html += '</div>'; // Cerrar div de contenedor de tarjetas
    
    searchResults.innerHTML = html;
  }
}

// Manejar el envío del formulario de búsqueda
document.getElementById('searchForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const searchTerm = document.getElementById('searchInput').value;
  const selectedCollection = document.getElementById('searchCollection').value;
  searchData(selectedCollection, searchTerm);
});



// Función para mostrar el menú desplegable correspondiente
function mostrarSubMenu(coleccion) {
  // Ocultar todos los menús desplegables
  const dropdowns = document.querySelectorAll('.dropdown-content');
  dropdowns.forEach(dropdown => dropdown.style.display = 'none');
  // Mostrar el menú desplegable correspondiente
  const subMenu = document.getElementById(`${coleccion}SubMenu`);
  subMenu.style.display = 'block';
}

// Función para cerrar todos los menús desplegables
function cerrarMenusDesplegables() {
  const dropdowns = document.querySelectorAll('.dropdown-content');
  dropdowns.forEach(dropdown => dropdown.style.display = 'none');
}

// Manejar el clic en cualquier parte del documento para cerrar los menús desplegables
document.addEventListener('click', function(event) {
  const target = event.target;
  if (!target.matches('.dropbtn')) {
    cerrarMenusDesplegables();
  }
});
