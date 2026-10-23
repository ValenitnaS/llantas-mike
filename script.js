"use strict";

// MENÚ PARA CELULARES
const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");
const menuPrincipal = document.getElementById("menuPrincipal");

if (navbar && menuToggle && menuPrincipal) {
  navbar.classList.add("menu-ready");

  function cerrarMenu() {
    menuPrincipal.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    menuToggle.textContent = "☰";
  }

  menuToggle.addEventListener("click", () => {
    const abierto = menuToggle.getAttribute("aria-expanded") === "true";

    menuPrincipal.classList.toggle("open", !abierto);
    menuToggle.setAttribute("aria-expanded", String(!abierto));
    menuToggle.setAttribute(
      "aria-label",
      abierto ? "Abrir menú" : "Cerrar menú"
    );

    menuToggle.textContent = abierto ? "☰" : "✕";
  });

  menuPrincipal.querySelectorAll("a").forEach((enlace) => {
    enlace.addEventListener("click", cerrarMenu);
  });

  document.addEventListener("keydown", (evento) => {
    if (
      evento.key === "Escape" &&
      menuToggle.getAttribute("aria-expanded") === "true"
    ) {
      cerrarMenu();
      menuToggle.focus();
    }
  });

  document.addEventListener("click", (evento) => {
    if (!navbar.contains(evento.target)) {
      cerrarMenu();
    }
  });

  window.matchMedia("(min-width: 761px)").addEventListener(
    "change",
    cerrarMenu
  );
}


// CARRUSEL DE LA PORTADA
const slides = document.querySelectorAll(".slide");
const botonPausa = document.querySelector(".slider-pause");
const movimientoReducido = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

let slideActual = 0;
let intervalo = null;
let pausado = movimientoReducido.matches;

function actualizarBotonCarrusel() {
  if (!botonPausa) return;

  botonPausa.textContent = pausado
    ? "Reanudar imágenes"
    : "Pausar imágenes";

  botonPausa.setAttribute(
    "aria-label",
    pausado ? "Reanudar carrusel" : "Pausar carrusel"
  );
}

function detenerCarrusel() {
  window.clearInterval(intervalo);
  intervalo = null;
}

function iniciarCarrusel() {
  detenerCarrusel();

  if (pausado || document.hidden || slides.length < 2) return;

  intervalo = window.setInterval(() => {
    slides[slideActual].classList.remove("active");

    slideActual = (slideActual + 1) % slides.length;

    slides[slideActual].classList.add("active");
  }, 5000);
}

if (slides.length > 0) {
  slides.forEach((slide, indice) => {
    slide.classList.toggle("active", indice === 0);
  });

  actualizarBotonCarrusel();
  iniciarCarrusel();

  if (botonPausa) {
    botonPausa.hidden = slides.length < 2;

    botonPausa.addEventListener("click", () => {
      pausado = !pausado;
      actualizarBotonCarrusel();
      iniciarCarrusel();
    });
  }

  // Evita cambiar imágenes mientras la pestaña está oculta.
  document.addEventListener("visibilitychange", iniciarCarrusel);

  movimientoReducido.addEventListener("change", (evento) => {
    pausado = evento.matches;
    actualizarBotonCarrusel();
    iniciarCarrusel();
  });
} else if (botonPausa) {
  botonPausa.hidden = true;
}


// SELECCIONAR SERVICIO DESDE LAS TARJETAS
const selectorServicio = document.getElementById("servicio");

document.querySelectorAll("[data-service]").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    if (selectorServicio) {
      selectorServicio.value = enlace.dataset.service;
    }
  });
});


// FORMULARIO HACIA WHATSAPP
const formulario = document.getElementById("formCita");
const estadoFormulario = document.getElementById("estadoFormulario");

if (formulario && estadoFormulario) {
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!formulario.reportValidity()) return;

    const campoNombre = document.getElementById("nombre");
    const campoTelefono = document.getElementById("telefono");
    const campoDescripcion = document.getElementById("descripcion");

    const nombre = campoNombre.value.trim();
    const telefono = campoTelefono.value.trim();
    const descripcion = campoDescripcion.value.trim();
    const servicio = selectorServicio
      ? selectorServicio.value
      : "Necesito orientación";

    if (!nombre) {
      estadoFormulario.textContent = "Por favor, escribe tu nombre.";
      campoNombre.focus();
      return;
    }

    const digitosTelefono = telefono.replace(/\D/g, "");

    if (digitosTelefono.length < 8 || digitosTelefono.length > 15) {
      estadoFormulario.textContent =
        "Revisa tu teléfono: debe contener entre 8 y 15 números.";
      campoTelefono.focus();
      return;
    }

    if (!descripcion) {
      estadoFormulario.textContent =
        "Cuéntanos brevemente qué necesitas para preparar tu consulta.";
      campoDescripcion.focus();
      return;
    }

    const mensaje = [
      "Hola, Llantas Mike. Quisiera solicitar una evaluación.",
      "",
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono}`,
      `Servicio: ${servicio}`,
      "",
      "Mi consulta:",
      descripcion,
      "",
      "¿Me pueden orientar sobre el valor y la disponibilidad?"
    ].join("\n");

    const url = new URL("https://wa.me/56974206765");
    url.searchParams.set("text", mensaje);

    // Deja un enlace disponible si el navegador bloquea la pestaña.
    const enlaceAlternativo = document.createElement("a");
    enlaceAlternativo.href = url.toString();
    enlaceAlternativo.target = "_blank";
    enlaceAlternativo.rel = "noopener noreferrer";
    enlaceAlternativo.textContent = "Abrir mi consulta en WhatsApp ↗";

    estadoFormulario.replaceChildren(
      document.createTextNode(
        "Tu mensaje está preparado. Envíalo por WhatsApp y adjunta allí " +
        "tus fotografías. Si no se abrió la conversación, usa este enlace: "
      ),
      enlaceAlternativo
    );

    window.open(url.toString(), "_blank", "noopener,noreferrer");

    // Conservamos los datos para que puedas revisarlos o reintentar.
  });
}


// AÑO AUTOMÁTICO DEL PIE DE PÁGINA
const anio = document.getElementById("anio");

if (anio) {
  anio.textContent = new Date().getFullYear();
}

// ABRIR Y CERRAR FOTOGRAFÍAS
const visorFotos = document.getElementById("visorFotos");
const fotoAmpliada = document.getElementById("fotoAmpliada");
const cerrarFoto = document.querySelector(".visor-cerrar");

if (visorFotos && fotoAmpliada && cerrarFoto) {
  document.querySelectorAll(".gallery a").forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
      // Conserva la apertura en otra pestaña si se solicita.
      if (
        evento.ctrlKey ||
        evento.metaKey ||
        evento.shiftKey ||
        evento.altKey
      ) {
        return;
      }

      evento.preventDefault();

      const imagen = enlace.querySelector("img");

      fotoAmpliada.src = enlace.href;
      fotoAmpliada.alt = imagen
        ? imagen.alt
        : "Fotografía ampliada de Llantas Mike";

      visorFotos.showModal();
      document.documentElement.classList.add("visor-abierto");
    });
  });

  cerrarFoto.addEventListener("click", () => {
    visorFotos.close();
  });

  // Cerrar al pulsar en el espacio alrededor de la imagen.
  visorFotos.addEventListener("click", (evento) => {
    if (evento.target === visorFotos) {
      visorFotos.close();
    }
  });

  // También se ejecuta al cerrar con la tecla Escape.
  visorFotos.addEventListener("close", () => {
    document.documentElement.classList.remove("visor-abierto");
    fotoAmpliada.removeAttribute("src");
  });
}