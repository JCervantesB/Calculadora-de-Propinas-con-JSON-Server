let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

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
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('DIV');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$ ${platillo.precio}`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        // Función que detecta la cantidad y el platillo que se esta agregando.
        inputCantidad.onchange = function() {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo, cantidad });
        };

        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);
        contenido.appendChild(row);
    })
}

function agregarPlatillo(producto) {
    // Extrar el pedido actual
    let { pedido } = cliente;

    // Revisa que la cantidad sea mayor a 0
    if (producto.cantidad > 0) {
        // Comprueba si el elemento existe en el array
        if (pedido.some(articulo => articulo.id === producto.id)) {
            // El articulo ya existe, lo actualizamos en el array del pedido
            const pedidoActualizado = pedido.map(articulo => {
                if (articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            });
            // Se asigna el nuevo articulo a cliente.pedido
            cliente.pedido = [...pedidoActualizado];
        } else {
            // El articulo no existe, lo agregamos al array del pedido
            cliente.pedido = [...pedido, producto];
        }
    } else {
        // Eliminar el articulo del pedido si es = 0
        const resultado = pedido.filter(articulo => articulo.id !== producto.id)
        cliente.pedido = [...resultado];
    }
    // Limpiar el codigo html
    limpiarHTML();

    if (cliente.pedido.length) {
        // Mostrar el resumen
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

}

function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');

    const resument = document.createElement('DIV');
    resument.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    // Informacion de la Mesa
    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    // Informacion de la Hora
    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    // Agregar a elementos padres
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    // Iterar sobre el Array de pedido
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    const { pedido } = cliente;
    pedido.forEach(articulo => {
        const { nombre, cantidad, precio, id } = articulo;

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        const nombreElemento = document.createElement('H4');
        nombreElemento.classList.add('my-4');
        nombreElemento.textContent = nombre;

        // Cantidad del articulo
        const cantidadElemento = document.createElement('P');
        cantidadElemento.classList.add('my-4');
        cantidadElemento.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('SPAN');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        // Precio del articulo
        const precioElemento = document.createElement('P');
        precioElemento.classList.add('my-4');
        precioElemento.textContent = 'Precio: ';

        const precioValor = document.createElement('SPAN');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$ ${precio}`;

        // Subtotal del articulo
        const subtotalElemento = document.createElement('P');
        subtotalElemento.classList.add('my-4');
        subtotalElemento.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('SPAN');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);

        // Boton para eliminar
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar del pedido';

        // Funcion para elimianr del pedido
        btnEliminar.onclick = function() {
            eliminarProducto(id);
        }

        // Agregar valores a sus contenedores
        cantidadElemento.appendChild(cantidadValor);
        precioElemento.appendChild(precioValor);
        subtotalElemento.appendChild(subtotalValor);

        // Agregar elemenots al LI
        lista.appendChild(nombreElemento);
        lista.appendChild(cantidadElemento);
        lista.appendChild(precioElemento);
        lista.appendChild(subtotalElemento);
        lista.appendChild(btnEliminar);

        // Agregar lista al grupo principal
        grupo.appendChild(lista);
    })

    // Titulo de la sección
    const heading = document.createElement('H3');
    heading.textContent = 'Platillos consumidos';
    heading.classList.add('my-4', 'text-center');

    // Mostrar en el HTML
    resument.appendChild(heading);
    resument.appendChild(mesa);
    resument.appendChild(hora);
    resument.appendChild(grupo);

    contenido.appendChild(resument);

    // Mostrar formulario de Propinas
    formularioPropinas();
}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido');

    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}

function calcularSubtotal(precio, cantidad) {
    return `$ ${precio * cantidad}`;
}

function eliminarProducto(id) {
    const { pedido } = cliente;
    const resultado = pedido.filter(articulo => articulo.id !== id)
    cliente.pedido = [...resultado];

    // Limpiar el codigo html
    limpiarHTML();

    if (cliente.pedido.length) {
        // Mostrar el resumen
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

    // El producto se eliminó, por lo tanto regresamos la cantidad a 0 en el formulario
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}

function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido');
    const texto = document.createElement('P');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto);
}

function formularioPropinas() {
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');
    const divFormulario = document.createElement('DIV');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';



    formulario.appendChild(divFormulario)
    divFormulario.appendChild(heading);

    contenido.appendChild(formulario);
}