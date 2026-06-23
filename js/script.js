// ==== Formulario ==== 

const mangaForm = document.getElementById('mangaForm');

const titulo = document.getElementById('titulo');
const autor = document.getElementById('autor');
const genero = document.getElementById('genero');
const estado = document.getElementById('estado');
const tomos = document.getElementById('tomos');

// ==== Buscador ====

const buscar = document.getElementById('buscar');

// ==== Filtros ====

const filtroGenero = document.getElementById('filtroGenero');
const filtroEstado = document.getElementById('filtroEstado');

// ==== Estadísticas ====

const totalMangas = document.getElementById('totalMangas');
const leyendo = document.getElementById('leyendo');
const pendientes = document.getElementById('pendientes');
const completados = document.getElementById('completados');
const abandonados = document.getElementById('abandonados');

// ===== Contenedor de mangas =====

const contenedorMangas = document.getElementById('contenedorMangas');

// ==== Escuchadores de eventos ==== 
mangaForm.addEventListener("submit", function(event){

    event.preventDefault();

    console.log("Formulario enviado");

});

mangaForm.addEventListener("submit", function(event){

    event.preventDefault();

    const nuevoManga = {

        titulo: titulo.value,
        autor: autor.value,
        genero: genero.value,
        estado: estado.value,
        tomos: tomos.value

    };

    console.log(nuevoManga);

});