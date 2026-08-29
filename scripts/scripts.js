// ======================================================
// AOS
// ======================================================

if (typeof AOS !== "undefined") {
  AOS.init({
    duration: 700,
    once: true,
    offset: 70
  });
}


// ======================================================
// HELPERS DE TRACKING
// ======================================================

window.dataLayer = window.dataLayer || [];

function formatearTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

function detectarSeccion(elemento) {
  let actual = elemento;

  while (actual && actual !== document.body) {
    if (actual.hasAttribute("data-section")) {
      return actual.getAttribute("data-section");
    }

    actual = actual.parentElement;
  }

  return "otros";
}


// ======================================================
// DOM READY
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

  // Año footer
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  // ====================================================
  // MENÚ MÓVIL
  // ====================================================

  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");

  if (toggle && menu) {

    toggle.addEventListener("click", function () {
      menu.classList.toggle("hidden");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.add("hidden");
      });
    });

  }


  // ====================================================
  // TRACKING DE CLICS
  // ====================================================

  document.querySelectorAll("a, button").forEach(function (el) {

    el.addEventListener("click", function () {

      const label = formatearTexto(
        el.innerText ||
        el.getAttribute("aria-label") ||
        el.value ||
        "sin-texto"
      );

      const section = detectarSeccion(el);

      window.dataLayer.push({
        event: "interaction",
        event_category: "home",
        event_action: "click",
        event_label: label,
        section: section,
        description: "-"
      });

    });

  });


  // ====================================================
  // CLICS EXTERNOS
  // ====================================================

  document.querySelectorAll("a[href]").forEach(function (link) {

    link.addEventListener("click", function () {

      try {

        const url = new URL(
          link.href,
          window.location.origin
        );

        if (
          url.hostname &&
          url.hostname !== window.location.hostname
        ) {

          window.dataLayer.push({
            event: "external_click",
            event_category: "home",
            event_action: "click",
            event_label: url.hostname,
            section: detectarSeccion(link),
            description: url.href
          });

        }

      } catch (error) {
        console.warn("No se pudo analizar la URL:", link.href);
      }

    });

  });


  // ====================================================
  // FORMULARIO
  // ====================================================

  const formulario =
    document.getElementById("formulario-contacto");

  const toastExito =
    document.getElementById("toast-exito");

  if (formulario) {

    formulario.addEventListener("submit", async function (e) {

      e.preventDefault();

      const boton =
        formulario.querySelector('button[type="submit"]');

      const textoOriginal =
        boton ? boton.innerHTML : "";

      const datos =
        new FormData(formulario);

      const empresa =
        datos.get("empresa") || "-";

      try {

        if (boton) {
          boton.disabled = true;
          boton.textContent = "Enviando...";
        }

        const respuesta = await fetch(
          formulario.action,
          {
            method: "POST",
            body: datos,
            headers: {
              Accept: "application/json"
            }
          }
        );

        if (!respuesta.ok) {
          throw new Error("Formspree devolvió un error");
        }

        // Evento de conversión
        window.dataLayer.push({
          event: "form_submitted",
          event_category: "home",
          event_action: "submit",
          event_label: "formulario-contacto",
          section: "contacto",
          description: `Empresa: ${empresa}`
        });

        formulario.reset();

        mostrarToast(
          "¡Gracias! Tu mensaje fue enviado correctamente.",
          "success"
        );

      } catch (error) {

        console.error(
          "Error al enviar el formulario:",
          error
        );

        mostrarToast(
          "No pudimos enviar el mensaje. Intenta nuevamente.",
          "error"
        );

      } finally {

        if (boton) {
          boton.disabled = false;
          boton.innerHTML = textoOriginal;
        }

      }

    });

  }


  function mostrarToast(mensaje, tipo) {

    if (!toastExito) {
      return;
    }

    toastExito.textContent = mensaje;

    toastExito.classList.remove(
      "hidden",
      "bg-green-100",
      "border-green-300",
      "text-green-800",
      "bg-red-100",
      "border-red-300",
      "text-red-800"
    );

    if (tipo === "error") {

      toastExito.classList.add(
        "bg-red-100",
        "border-red-300",
        "text-red-800"
      );

    } else {

      toastExito.classList.add(
        "bg-green-100",
        "border-green-300",
        "text-green-800"
      );

    }

    setTimeout(function () {
      toastExito.classList.add("hidden");
    }, 4000);

  }

});


// ======================================================
// SCROLL DEPTH
// ======================================================

const scrollMarcado = {
  25: false,
  50: false,
  75: false,
  100: false
};

window.addEventListener("scroll", function () {

  const altoDocumento =
    document.documentElement.scrollHeight -
    window.innerHeight;

  if (altoDocumento <= 0) {
    return;
  }

  const porcentaje =
    Math.floor(
      (window.scrollY / altoDocumento) * 100
    );

  [25, 50, 75, 100].forEach(function (nivel) {

    if (
      porcentaje >= nivel &&
      !scrollMarcado[nivel]
    ) {

      scrollMarcado[nivel] = true;

      window.dataLayer.push({
        event: "scroll_depth",
        event_category: "home",
        event_action: "scroll",
        event_label: `${nivel}%`,
        section:
          nivel === 100
            ? "footer"
            : "-",
        description:
          nivel === 25
            ? "inicio de desplazamiento"
            : nivel === 50
            ? "mitad de página"
            : nivel === 75
            ? "casi al final"
            : "llegó al footer"
      });

    }

  });

});


// ======================================================
// TIEMPO EN SITIO
// ======================================================

const tiempos = [30, 60, 120];

tiempos.forEach(function (segundos) {

  setTimeout(function () {

    window.dataLayer.push({
      event: "time_on_site",
      event_category: "home",
      event_action: "tiempo",
      event_label: `${segundos}s`,
      section: "-",
      description: "-"
    });

  }, segundos * 1000);

});
