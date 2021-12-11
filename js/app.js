let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //Revisar si hay campos vacios
    const camposVacios = [mesa, hora].some(campo => campo === '');

    if (camposVacios) {
        // Verificar si existe una alerta
        const existeAlerta = document.querySelector('.invalid-feedback');

        if (!existeAlerta) {
            // Crear la alarta
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center'); //Utilizando clases de Boostrap
            alerta.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(() => {
                alerta.remove();
            }, 3000);
        }
        return;
    }

    // Asignar los datos del formulario al objeto cliente
    cliente = {...cliente, mesa, hora };

    // Ocultar modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBoostrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBoostrap.hide();

    // Mostrar la secciones
    mostrarSecciones();

    // Obtener Platillos de la API de JSON-Server
    obtenerPlatillos();
}

function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
}

function obtenerPlatillos() {
    const url = 'http://127.0.0.1:4000/platillos';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPlatillos(resultado))
        .catch(err => console.log(err));
}

function mostrarPlatillos(platillos) {
    const contenido = document.querySelector('#platillos .contenido');
    platillos.forEach(platillo => {
        const row = document.createElement('DIV');
        row.classList.add('row');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        row.appendChild(nombre);
        contenido.appendChild(row);
    })
}