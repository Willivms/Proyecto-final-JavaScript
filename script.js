
const proyectos = [
  {
    id: 1,
    titulo: "Landing Page Emprendimiento",
    categoria: "HTML/CSS",
    resumen: "Pagina de mi Barberia, con diseño adaptable a celulares y paleta de colores personalizada.",
    descripcion:
      "Sitio web institucional creado en el módulo anterior. Incluye diseño adaptable a celulares, paleta de colores personalizada y navegación semántica.",
    tecnologias: "HTML5, CSS3, Flexbox, CSS Grid",
    url: "https://locobarber-web.onrender.com/"
  },
 
  {
    id: 4,
    titulo: "Cotizador Dólar en Vivo",
    categoria: "APIs",
    resumen: "Consulta en tiempo real de cotizaciones oficiales y blue en Argentina.",
    descripcion:
      "Consumo de DolarAPI utilizando fetch y async/await, con indicadores visuales de carga y manejo de errores de red.",
    tecnologias: "JavaScript, Fetch API, Async/Await",
    url: "https://dolarapi.com/"
  }
];


let categoriaActiva = "todos";
let textoBusqueda = "";


const grillaProyectos = document.querySelector("#grilla-proyectos");
const sinResultados = document.querySelector("#sin-resultados");
const contenedorFiltros = document.querySelector("#filtros");
const inputBuscador = document.querySelector("#buscador");

const modal = document.querySelector("#modal-proyecto");
const velo = document.querySelector("#velo");
const btnCerrarModal = document.querySelector("#cerrar-modal");

const btnTema = document.querySelector("#btn-tema");
const climaElemento = document.querySelector("#clima-rafaela");

const formContacto = document.querySelector("#form-contacto");
const inputNombre = document.querySelector("#nombre");
const inputEmail = document.querySelector("#email");
const inputMensaje = document.querySelector("#mensaje");
const btnLimpiarBorrador = document.querySelector("#btn-limpiar-borrador");
const mensajeExito = document.querySelector("#mensaje-exito");


function mostrarProyectos(lista) {
  grillaProyectos.innerHTML = "";

  if (lista.length === 0) {
    sinResultados.classList.remove("oculto");
    return;
  }

  sinResultados.classList.add("oculto");

  lista.forEach((proyecto) => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta-proyecto");

    tarjeta.innerHTML = `
      <div>
        <span class="etiqueta">${proyecto.categoria}</span>
        <h3 style="margin-top: 0.5rem;">${proyecto.titulo}</h3>
        <p>${proyecto.resumen}</p>
      </div>
      <button class="btn-secundario btn-detalle" data-id="${proyecto.id}" type="button">
        Ver detalle
      </button>
    `;

    grillaProyectos.appendChild(tarjeta);
  });
}

function filtrarProyectos() {
  const filtrados = proyectos.filter((proyecto) => {
    const coincideCategoria =
      categoriaActiva === "todos" || proyecto.categoria === categoriaActiva;
    const coincideTexto =
      proyecto.titulo.toLowerCase().includes(textoBusqueda.toLowerCase()) ||
      proyecto.resumen.toLowerCase().includes(textoBusqueda.toLowerCase());

    return coincideCategoria && coincideTexto;
  });

  mostrarProyectos(filtrados);
}


function abrirModal(proyecto) {
  document.querySelector("#modal-categoria").textContent = proyecto.categoria;
  document.querySelector("#modal-titulo").textContent = proyecto.titulo;
  document.querySelector("#modal-descripcion").textContent = proyecto.descripcion;
  document.querySelector("#modal-tecnologias").textContent = proyecto.tecnologias;
  document.querySelector("#modal-link").href = proyecto.url;

  velo.classList.remove("oculto");
  modal.classList.remove("oculto");
  modal.setAttribute("open", "");
}

function cerrarModal() {
  velo.classList.add("oculto");
  modal.classList.add("oculto");
  modal.removeAttribute("open");
}


function cargarPreferencias() {
  try {
    const temaGuardado = localStorage.getItem("portfolio_tema");
    if (temaGuardado === "oscuro") {
      document.body.classList.add("oscuro");
      btnTema.textContent = "☀️ Modo claro";
    }

    const borradorGuardado = localStorage.getItem("portfolio_borrador");
    if (borradorGuardado) {
      const datos = JSON.parse(borradorGuardado);
      inputNombre.value = datos.nombre || "";
      inputEmail.value = datos.email || "";
      inputMensaje.value = datos.mensaje || "";
    }
  } catch (error) {
    console.error("No se pudo leer localStorage:", error);
  }
}

function guardarBorrador() {
  try {
    const borrador = {
      nombre: inputNombre.value,
      email: inputEmail.value,
      mensaje: inputMensaje.value
    };
    localStorage.setItem("portfolio_borrador", JSON.stringify(borrador));
  } catch (error) {
    console.error("No se pudo guardar el borrador:", error);
  }
}


function mostrarError(input, idError, mensaje) {
  const elementoError = document.querySelector(`#${idError}`);
  elementoError.textContent = mensaje;
  if (mensaje) {
    input.classList.add("invalido");
  } else {
    input.classList.remove("invalido");
  }
}

function validarFormulario() {
  let esValido = true;

  const nombre = inputNombre.value.trim();
  const email = inputEmail.value.trim();
  const mensaje = inputMensaje.value.trim();

  if (nombre.length < 3) {
    mostrarError(inputNombre, "error-nombre", "Ingresá al menos 3 letras.");
    esValido = false;
  } else {
    mostrarError(inputNombre, "error-nombre", "");
  }

  if (!email.includes("@") || !email.includes(".")) {
    mostrarError(inputEmail, "error-email", "Ingresá un correo electrónico válido.");
    esValido = false;
  } else {
    mostrarError(inputEmail, "error-email", "");
  }

  if (mensaje.length < 10) {
    mostrarError(inputMensaje, "error-mensaje", "El mensaje debe tener al menos 10 caracteres.");
    esValido = false;
  } else {
    mostrarError(inputMensaje, "error-mensaje", "");
  }

  return esValido;
}


async function cargarClimaRafaela() {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=-31.25&longitude=-61.49&current=temperature_2m";

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error("Respuesta no válida de la API");
    }

    const datos = await respuesta.json();
    const temperatura = Math.round(datos.current.temperature_2m);

    climaElemento.classList.remove("cargando", "error");
    climaElemento.textContent = `🌤️ Rafaela: ${temperatura}°C`;
  } catch (error) {
    climaElemento.classList.remove("cargando");
    climaElemento.classList.add("error");
    climaElemento.textContent = "Clima no disponible";
    console.error("Error al consultar Open-Meteo:", error);
  }
}


contenedorFiltros.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".chip");
  if (!boton) return;

  document.querySelectorAll(".chip").forEach((chip) => chip.classList.remove("activo"));
  boton.classList.add("activo");

  categoriaActiva = boton.dataset.categoria;
  filtrarProyectos();
});

inputBuscador.addEventListener("input", (evento) => {
  textoBusqueda = evento.target.value;
  filtrarProyectos();
});

grillaProyectos.addEventListener("click", (evento) => {
  const botonDetalle = evento.target.closest(".btn-detalle");
  if (!botonDetalle) return;

  const idProyecto = Number(botonDetalle.dataset.id);
  const proyectoEncontrado = proyectos.find((p) => p.id === idProyecto);

  if (proyectoEncontrado) {
    abrirModal(proyectoEncontrado);
  }
});

btnCerrarModal.addEventListener("click", cerrarModal);
velo.addEventListener("click", cerrarModal);
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") {
    cerrarModal();
  }
});

btnTema.addEventListener("click", () => {
  document.body.classList.toggle("oscuro");
  const esOscuro = document.body.classList.contains("oscuro");
  btnTema.textContent = esOscuro ? "☀️ Modo claro" : "🌙 Modo oscuro";

  try {
    localStorage.setItem("portfolio_tema", esOscuro ? "oscuro" : "claro");
  } catch (error) {
    console.error("No se pudo guardar el tema:", error);
  }
});

[inputNombre, inputEmail, inputMensaje].forEach((campo) => {
  campo.addEventListener("input", () => {
    guardarBorrador();
    if (campo.classList.contains("invalido")) {
      validarFormulario();
    }
  });
});

btnLimpiarBorrador.addEventListener("click", () => {
  formContacto.reset();
  localStorage.removeItem("portfolio_borrador");
  mensajeExito.classList.add("oculto");
  [inputNombre, inputEmail, inputMensaje].forEach((campo) => campo.classList.remove("invalido"));
  document.querySelectorAll(".error-texto").forEach((p) => (p.textContent = ""));
});

formContacto.addEventListener("submit", (evento) => {
  evento.preventDefault();
  mensajeExito.classList.add("oculto");

  if (!validarFormulario()) return;

  const nombreUsuario = inputNombre.value.trim();
  mensajeExito.textContent = `¡Gracias, ${nombreUsuario}! Tu mensaje fue enviado correctamente.`;
  mensajeExito.classList.remove("oculto");

  formContacto.reset();
  localStorage.removeItem("portfolio_borrador");
});


cargarPreferencias();
mostrarProyectos(proyectos);
cargarClimaRafaela();