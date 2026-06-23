// ==== ESTADO DE LA APLICACIÓN (Persistencia en LocalStorage) ====
let mangas = JSON.parse(localStorage.getItem('mangas')) || [];

// ==== ELEMENTOS DEL DOM ====
const mangaForm = document.getElementById('mangaForm');
const titulo = document.getElementById('titulo');
const autor = document.getElementById('autor');
const genero = document.getElementById('genero');
const estado = document.getElementById('estado');
const tomos = document.getElementById('tomos');

const buscar = document.getElementById('buscar');
const filtroGenero = document.getElementById('filtroGenero');
const filtroEstado = document.getElementById('filtroEstado');

const totalMangas = document.getElementById('totalMangas');
const leyendo = document.getElementById('leyendo');
const pendiente = document.getElementById('pendiente');
const completado = document.getElementById('completado');
const abandonado = document.getElementById('abandonado');

const contenedorMangas = document.getElementById('contenedorMangas');

// ==== FUNCIONES DE CONTROL PRINCIPAL ====

function actualizarApp() {
    localStorage.setItem('mangas', JSON.stringify(mangas));
    mostrarMangas();
    actualizarEstadisticas();
    llenarFiltrosDinamicos();
}

function mostrarMangas() {
    if (!contenedorMangas) return;
    contenedorMangas.innerHTML = '';

    const terminoBusqueda = buscar ? buscar.value.toLowerCase() : '';
    const genFiltrado = filtroGenero ? filtroGenero.value : '';
    const estFiltrado = filtroEstado ? filtroEstado.value : '';

    const mangasFiltrados = mangas.filter(manga => {
        const coincideBusqueda = manga.titulo.toLowerCase().includes(terminoBusqueda) || 
                                 manga.autor.toLowerCase().includes(terminoBusqueda);
        const coincideGenero = genFiltrado === "" || manga.genero === genFiltrado;
        const coincideEstado = estFiltrado === "" || manga.estado === estFiltrado;
        
        return coincideBusqueda && coincideGenero && coincideEstado;
    });

    mangasFiltrados.forEach((manga, index) => {
        const card = document.createElement('div');
        card.classList.add('manga-card');

        card.innerHTML = `
            <h3>${manga.titulo}</h3>
            <p><strong>Autor:</strong> ${manga.autor}</p>
            <p><strong>Género:</strong> ${manga.genero}</p>
            <p><strong>Estado:</strong> ${manga.estado}</p>
            <p><strong>Tomos:</strong> ${manga.tomos}</p>
            <div class="card-buttons">
                <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            </div>
        `;
        contenedorMangas.appendChild(card);
    });
}

function actualizarEstadisticas() {
    if (totalMangas) totalMangas.textContent = mangas.length;
    if (leyendo) leyendo.textContent = mangas.filter(m => m.estado === 'Leyendo').length;
    if (pendiente) pendiente.textContent = mangas.filter(m => m.estado === 'Pendiente').length;
    if (completado) completado.textContent = mangas.filter(m => m.estado === 'Completado').length;
    if (abandonado) abandonado.textContent = mangas.filter(m => m.estado === 'Abandonado').length;
}

function llenarFiltrosDinamicos() {
    if (!filtroGenero || !filtroEstado) return;

    const generosExistentes = [...new Set(mangas.map(m => m.genero))];
    const opcionGeneroActual = filtroGenero.value;
    
    filtroGenero.innerHTML = '<option value="">Todos los géneros</option>';
    generosExistentes.forEach(gen => {
        if(gen) {
            const option = document.createElement('option');
            option.value = gen;
            option.textContent = gen;
            filtroGenero.appendChild(option);
        }
    });
    filtroGenero.value = opcionGeneroActual;

    const estadosFijos = ['Leyendo', 'Pendiente', 'Completado', 'Abandonado'];
    const opcionEstadoActual = filtroEstado.value;

    filtroEstado.innerHTML = '<option value="">Todos los estados</option>';
    estadosFijos.forEach(est => {
        const option = document.createElement('option');
        option.value = est;
        option.textContent = est;
        filtroEstado.appendChild(option);
    });
    filtroEstado.value = opcionEstadoActual;
}

// ==== SISTEMA DE VALIDACIÓN SEGURO ====

function mostrarError(inputElement, mensaje) {
    if (!inputElement) return;
    // Busca la etiqueta error que está dentro del mismo div contenedor
    const errorSmall = inputElement.parentElement.querySelector('.error');
    if (errorSmall) {
        if (mensaje) {
            errorSmall.textContent = mensaje;
            inputElement.style.borderColor = "#FF6B6B"; 
        } else {
            errorSmall.textContent = "";
            inputElement.style.borderColor = "#9b5cff"; 
        }
    }
}

function validarFormulario() {
    let esValido = true;

    // Regla 1: Verificación de campos requeridos (No vacíos)
    const campos = [titulo, autor, genero, estado, tomos];
    campos.forEach(campo => {
        if (campo && !campo.value.trim()) {
            mostrarError(campo, "Este campo es obligatorio.");
            esValido = false;
        } else if (campo) {
            mostrarError(campo, "");
        }
    });

    // Si ya falló la regla de campos vacíos, frenamos aquí para no acumular errores
    if (!esValido) return false;

    // Regla 2: Formato específico (Regex para autor - SOLO LETRAS Y ESPACIOS)
    // Esta expresión regular permite letras mayúsculas, minúsculas, espacios, tildes y la eñe.
    const regexLetras = /^[a-zA-ZÀ-ÿ\s]+$/;
    
    if (autor) {
        const valorAutor = autor.value.trim();
        if (!regexLetras.test(valorAutor)) {
            mostrarError(autor, "El nombre del autor solo debe contener letras y espacios.");
            esValido = false;
        } else {
            mostrarError(autor, ""); // Si está correcto, limpia el error
        }
    }

    // Regla 3: Longitud mínima de caracteres para el Título
    if (titulo) {
        if (titulo.value.trim().length < 3) {
            mostrarError(titulo, "El título debe tener al menos 3 caracteres.");
            esValido = false;
        }
    }

    // Regla 4: Validación de coincidencia cruzada (Dependencia de estado/tomos)
    if (estado && tomos && estado.value === "Completado" && parseInt(tomos.value) < 1) {
        mostrarError(tomos, "Un manga completado debe tener al menos 1 tomo.");
        esValido = false;
    }

    // Regla 5: Valor único no repetido (Regla de negocio)
    const existeManga = mangas.some(m => m.titulo.toLowerCase() === (titulo ? titulo.value.trim().toLowerCase() : ''));
    if (existeManga && titulo) {
        mostrarError(titulo, "Este manga ya está registrado en tu biblioteca.");
        esValido = false;
    }

    return esValido;
}

// ==== MANEJO DE EVENTOS ====

if (mangaForm) {
    mangaForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!validarFormulario()) return; 

        const nuevoManga = {
            titulo: titulo.value.trim(),
            autor: autor.value.trim(),
            genero: genero.value,
            estado: estado.value,
            tomos: parseInt(tomos.value)
        };

        mangas.push(nuevoManga);
        actualizarApp();
        mangaForm.reset();
        
        [titulo, autor, genero, estado, tomos].forEach(campo => {
            if(campo) campo.style.borderColor = "transparent";
        });
    });
}

if (buscar) buscar.addEventListener('input', mostrarMangas);
if (filtroGenero) filtroGenero.addEventListener('change', mostrarMangas);
if (filtroEstado) filtroEstado.addEventListener('change', mostrarMangas);

if (contenedorMangas) {
    contenedorMangas.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-eliminar')) {
            const index = event.target.getAttribute('data-index');
            mangas.splice(index, 1);
            actualizarApp();
        }
    });
}

// ==== INICIALIZACIÓN ====
actualizarApp();