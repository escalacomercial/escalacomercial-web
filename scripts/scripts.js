// ======================================================
// ESCALA COMERCIAL
// scripts.js
// Versión limpia y actualizada
// ======================================================


// ======================================================
// 1. CONFIGURACIÓN GENERAL
// ======================================================

window.dataLayer = window.dataLayer || [];

const RADAR_AUTOPLAY_MS = 4200;
const TEAM_AUTOPLAY_MS = 3800;


// ======================================================
// 2. ESTADO GLOBAL
// ======================================================


// ------------------------------------------------------
// RADAR
// ------------------------------------------------------

let radarProyectos = [];
let radarResultados = [];

let radarFiltroActual = "todos";
let radarConsultaActual = "";

let radarCarruselIntervalo = null;


// ------------------------------------------------------
// EQUIPO
// ------------------------------------------------------

let teamCarruselIntervalo = null;


// ------------------------------------------------------
// SCROLL DEPTH
// ------------------------------------------------------

const scrollMarcado = {
  25: false,
  50: false,
  75: false,
  100: false
};


// ======================================================
// 3. HELPERS GENERALES
// ======================================================


// ------------------------------------------------------
// FORMATEAR TEXTO PARA TRACKING
// ------------------------------------------------------

function formatearTexto(texto) {

  const resultado = String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");


  return resultado || "sin-texto";

}


// ------------------------------------------------------
// DETECTAR SECCIÓN
// ------------------------------------------------------

function detectarSeccion(elemento) {

  let actual = elemento;


  while (
    actual &&
    actual !== document.body
  ) {

    if (
      actual.hasAttribute &&
      actual.hasAttribute("data-section")
    ) {

      return (
        actual.getAttribute("data-section") ||
        "otros"
      );

    }


    actual = actual.parentElement;

  }


  return "otros";

}


// ======================================================
// 4. AOS
// ======================================================

function iniciarAOS() {

  if (
    typeof AOS === "undefined"
  ) {
    return;
  }


  AOS.init({
    duration: 700,
    once: true,
    offset: 70,
    easing: "ease-out"
  });

}


// ======================================================
// 5. AÑO FOOTER
// ======================================================

function iniciarAnioFooter() {

  const year =
    document.getElementById("year");


  if (!year) {
    return;
  }


  year.textContent =
    new Date().getFullYear();

}


// ======================================================
// 6. HEADER
// ======================================================

function iniciarHeader() {

  const siteHeader =
    document.getElementById(
      "site-header"
    );


  if (!siteHeader) {
    return;
  }


  function actualizarHeader() {

    siteHeader.classList.toggle(
      "shadow-sm",
      window.scrollY > 20
    );

  }


  actualizarHeader();


  window.addEventListener(
    "scroll",
    actualizarHeader,
    {
      passive: true
    }
  );

}


// ======================================================
// 7. MENÚ MÓVIL
// ======================================================

function iniciarMenuMovil() {

  const toggle =
    document.getElementById(
      "menu-toggle"
    );


  const menu =
    document.getElementById(
      "mobile-menu"
    );


  if (
    !toggle ||
    !menu
  ) {
    return;
  }


  // ----------------------------------------------------
  // ABRIR / CERRAR
  // ----------------------------------------------------

  toggle.addEventListener(
    "click",
    function () {

      const estabaAbierto =
        !menu.classList.contains(
          "hidden"
        );


      menu.classList.toggle(
        "hidden"
      );


      toggle.setAttribute(
        "aria-expanded",
        String(!estabaAbierto)
      );

    }
  );


  // ----------------------------------------------------
  // CERRAR AL HACER CLIC EN UN LINK
  // ----------------------------------------------------

  menu
    .querySelectorAll("a")
    .forEach(
      function (link) {

        link.addEventListener(
          "click",
          function () {

            menu.classList.add(
              "hidden"
            );


            toggle.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );

      }
    );


  // ----------------------------------------------------
  // CERRAR AL PASAR A DESKTOP
  // ----------------------------------------------------

  window.addEventListener(
    "resize",
    function () {

      if (
        window.innerWidth >= 1024
      ) {

        menu.classList.add(
          "hidden"
        );


        toggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    },
    {
      passive: true
    }
  );

}


// ======================================================
// 8. TRACKING GENERAL DE CLICS
// ======================================================

function iniciarTrackingClicks() {

  document.addEventListener(
    "click",
    function (event) {

      const elemento =
        event.target.closest(
          "a, button"
        );


      if (!elemento) {
        return;
      }


      const textoElemento =
        elemento.innerText ||
        elemento.getAttribute(
          "aria-label"
        ) ||
        elemento.value ||
        "sin-texto";


      const label =
        formatearTexto(
          textoElemento
        );


      const section =
        detectarSeccion(
          elemento
        );


      // ------------------------------------------------
      // INTERACCIÓN GENERAL
      // ------------------------------------------------

      window.dataLayer.push({
        event: "interaction",
        event_category: "home",
        event_action: "click",
        event_label: label,
        section: section,
        description: "-"
      });


      // ------------------------------------------------
      // CLIC EXTERNO
      // ------------------------------------------------

      if (
        elemento.tagName === "A" &&
        elemento.href
      ) {

        try {

          const url =
            new URL(
              elemento.href,
              window.location.origin
            );


          if (
            url.hostname &&
            url.hostname !==
              window.location.hostname
          ) {

            window.dataLayer.push({
              event: "external_click",
              event_category: "home",
              event_action: "click",
              event_label: url.hostname,
              section: section,
              description: url.href
            });

          }

        } catch (error) {

          console.warn(
            "No se pudo analizar la URL:",
            elemento.href
          );

        }

      }

    }
  );

}


// ======================================================
// 9. SERVICIOS
// ======================================================

function iniciarServicios() {

  const serviceTabs =
    document.querySelectorAll(
      "[data-service-tab]"
    );


  const servicePanels =
    document.querySelectorAll(
      "[data-service-panel]"
    );


  if (
    !serviceTabs.length ||
    !servicePanels.length
  ) {
    return;
  }


  serviceTabs.forEach(
    function (tab) {

      tab.addEventListener(
        "click",
        function () {

          const target =
            tab.getAttribute(
              "data-service-tab"
            );


          if (!target) {
            return;
          }


          // --------------------------------------------
          // DESACTIVAR TABS
          // --------------------------------------------

          serviceTabs.forEach(
            function (item) {

              item.classList.remove(
                "service-tab-active"
              );


              item.setAttribute(
                "aria-selected",
                "false"
              );

            }
          );


          // --------------------------------------------
          // ACTIVAR TAB
          // --------------------------------------------

          tab.classList.add(
            "service-tab-active"
          );


          tab.setAttribute(
            "aria-selected",
            "true"
          );


          // --------------------------------------------
          // OCULTAR PANELES
          // --------------------------------------------

          servicePanels.forEach(
            function (panel) {

              panel.classList.add(
                "hidden"
              );

            }
          );


          // --------------------------------------------
          // MOSTRAR PANEL SELECCIONADO
          // --------------------------------------------

          const activePanel =
            document.querySelector(
              `[data-service-panel="${target}"]`
            );


          if (activePanel) {

            activePanel.classList.remove(
              "hidden"
            );

          }


          // --------------------------------------------
          // TRACKING
          // --------------------------------------------

          window.dataLayer.push({
            event: "service_category_view",
            event_category: "home",
            event_action: "click",
            event_label: target,
            section: "servicios",
            description:
              "Cambio de categoría de servicios"
          });

        }
      );

    }
  );

}


// ======================================================
// 10. FORMULARIO DE CONTACTO
// ======================================================

function iniciarFormularioContacto() {

  const formulario =
    document.getElementById(
      "formulario-contacto"
    );


  const toastExito =
    document.getElementById(
      "toast-exito"
    );


  if (!formulario) {
    return;
  }


  let toastTimer = null;


  // ----------------------------------------------------
  // MOSTRAR TOAST
  // ----------------------------------------------------

  function mostrarToast(
    mensaje,
    tipo
  ) {

    if (!toastExito) {
      return;
    }


    if (toastTimer) {

      window.clearTimeout(
        toastTimer
      );

    }


    toastExito.textContent =
      mensaje;


    toastExito.classList.remove(
      "hidden",

      "bg-green-100",
      "border-green-300",
      "text-green-800",

      "bg-red-100",
      "border-red-300",
      "text-red-800"
    );


    if (
      tipo === "error"
    ) {

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


    toastTimer =
      window.setTimeout(
        function () {

          toastExito.classList.add(
            "hidden"
          );

        },
        4000
      );

  }


  // ----------------------------------------------------
  // ENVÍO
  // ----------------------------------------------------

  formulario.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      const boton =
        formulario.querySelector(
          'button[type="submit"]'
        );


      const textoOriginal =
        boton
          ? boton.innerHTML
          : "";


      const datos =
        new FormData(
          formulario
        );


      const empresa =
        datos.get("empresa") ||
        "-";


      const preferenciaContacto =
        datos.get(
          "preferencia_contacto"
        ) ||
        "-";


      const asunto =
        datos.get("asunto") ||
        "-";


      try {

        // ----------------------------------------------
        // ESTADO ENVIANDO
        // ----------------------------------------------

        if (boton) {

          boton.disabled = true;


          boton.innerHTML = `
            <i
              class="fa-solid fa-circle-notch fa-spin"
              aria-hidden="true"
            ></i>

            Enviando...
          `;

        }


        // ----------------------------------------------
        // FORMSPREE
        // ----------------------------------------------

        const respuesta =
          await fetch(
            formulario.action,
            {
              method: "POST",
              body: datos,

              headers: {
                Accept: "application/json"
              }
            }
          );


        if (
          !respuesta.ok
        ) {

          throw new Error(
            `Formspree respondió HTTP ${respuesta.status}`
          );

        }


        // ----------------------------------------------
        // TRACKING
        // ----------------------------------------------

        window.dataLayer.push({
          event: "form_submitted",
          event_category: "home",
          event_action: "submit",
          event_label:
            "formulario-contacto",
          section: "contacto",

          description:
            `Empresa: ${empresa} | ` +
            `Contacto preferido: ${preferenciaContacto} | ` +
            `Asunto: ${asunto}`
        });


        // ----------------------------------------------
        // RESET
        // ----------------------------------------------

        formulario.reset();


        // Volvemos a dejar seleccionada
        // la opción Llamada.

        const llamada =
          formulario.querySelector(
            'input[name="preferencia_contacto"][value="Llamada"]'
          );


        if (llamada) {

          llamada.checked = true;

        }


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

          boton.innerHTML =
            textoOriginal;

        }

      }

    }
  );

}


// ======================================================
// 11. SCROLL DEPTH
// ======================================================

function iniciarScrollDepth() {

  let scrollTicking = false;


  function revisarScrollDepth() {

    const altoDocumento =
      document.documentElement
        .scrollHeight -
      window.innerHeight;


    if (
      altoDocumento <= 0
    ) {

      scrollTicking = false;

      return;

    }


    const porcentaje =
      Math.min(
        100,
        Math.round(
          (
            window.scrollY /
            altoDocumento
          ) * 100
        )
      );


    [
      25,
      50,
      75,
      100
    ].forEach(
      function (nivel) {

        if (
          porcentaje < nivel ||
          scrollMarcado[nivel]
        ) {
          return;
        }


        scrollMarcado[nivel] =
          true;


        let descripcion =
          "-";


        if (
          nivel === 25
        ) {

          descripcion =
            "inicio de desplazamiento";

        }


        if (
          nivel === 50
        ) {

          descripcion =
            "mitad de página";

        }


        if (
          nivel === 75
        ) {

          descripcion =
            "casi al final";

        }


        if (
          nivel === 100
        ) {

          descripcion =
            "llegó al footer";

        }


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
            descripcion
        });

      }
    );


    scrollTicking = false;

  }


  window.addEventListener(
    "scroll",
    function () {

      if (
        scrollTicking
      ) {
        return;
      }


      scrollTicking = true;


      window.requestAnimationFrame(
        revisarScrollDepth
      );

    },
    {
      passive: true
    }
  );

}


// ======================================================
// 12. TIEMPO EN SITIO
// ======================================================

function iniciarTiempoEnSitio() {

  const tiempos =
    [
      30,
      60,
      120
    ];


  tiempos.forEach(
    function (segundos) {

      window.setTimeout(
        function () {

          window.dataLayer.push({
            event: "time_on_site",
            event_category: "home",
            event_action: "tiempo",
            event_label:
              `${segundos}s`,
            section: "-",
            description: "-"
          });

        },
        segundos * 1000
      );

    }
  );

}


// ======================================================
// 13. EQUIPO ESCALA
// ======================================================


// ------------------------------------------------------
// DETENER AUTOPLAY
// ------------------------------------------------------

function detenerAutoplayEquipo() {

  if (
    !teamCarruselIntervalo
  ) {
    return;
  }


  window.clearInterval(
    teamCarruselIntervalo
  );


  teamCarruselIntervalo =
    null;

}


// ------------------------------------------------------
// OBTENER DISTANCIA DE MOVIMIENTO
// ------------------------------------------------------

function obtenerPasoCarruselEquipo() {

  const carrusel =
    document.getElementById(
      "team-roles-track"
    );


  if (!carrusel) {
    return 0;
  }


  const card =
    carrusel.querySelector(
      ".team-role-card"
    );


  if (!card) {
    return 0;
  }


  const estilos =
    window.getComputedStyle(
      carrusel
    );


  const gap =
    parseFloat(
      estilos.columnGap ||
      estilos.gap ||
      "14"
    ) || 14;


  return (
    card
      .getBoundingClientRect()
      .width +
    gap
  );

}


// ------------------------------------------------------
// MOVER CARRUSEL
// ------------------------------------------------------

function moverCarruselEquipo(
  direccion
) {

  const carrusel =
    document.getElementById(
      "team-roles-track"
    );


  if (!carrusel) {
    return;
  }


  const paso =
    obtenerPasoCarruselEquipo();


  if (
    paso <= 0
  ) {
    return;
  }


  const maxScroll =
    Math.max(
      0,

      carrusel.scrollWidth -
      carrusel.clientWidth
    );


  if (
    maxScroll <= 5
  ) {
    return;
  }


  // ----------------------------------------------------
  // FINAL → PRINCIPIO
  // ----------------------------------------------------

  if (
    direccion > 0 &&
    carrusel.scrollLeft >=
      maxScroll - 10
  ) {

    carrusel.scrollTo({
      left: 0,
      behavior: "smooth"
    });


    return;

  }


  // ----------------------------------------------------
  // PRINCIPIO → FINAL
  // ----------------------------------------------------

  if (
    direccion < 0 &&
    carrusel.scrollLeft <= 10
  ) {

    carrusel.scrollTo({
      left: maxScroll,
      behavior: "smooth"
    });


    return;

  }


  // ----------------------------------------------------
  // MOVIMIENTO NORMAL
  // ----------------------------------------------------

  carrusel.scrollBy({
    left:
      direccion * paso,

    behavior:
      "smooth"
  });

}


// ------------------------------------------------------
// INICIAR AUTOPLAY
// ------------------------------------------------------

function iniciarAutoplayEquipo() {

  detenerAutoplayEquipo();


  const carrusel =
    document.getElementById(
      "team-roles-track"
    );


  if (!carrusel) {
    return;
  }


  const cards =
    carrusel.querySelectorAll(
      ".team-role-card"
    );


  if (
    cards.length <= 1
  ) {
    return;
  }


  const maxScroll =
    carrusel.scrollWidth -
    carrusel.clientWidth;


  if (
    maxScroll <= 5
  ) {
    return;
  }


  teamCarruselIntervalo =
    window.setInterval(
      function () {

        if (
          document.hidden
        ) {
          return;
        }


        moverCarruselEquipo(
          1
        );

      },
      TEAM_AUTOPLAY_MS
    );

}


// ------------------------------------------------------
// INICIALIZAR CARRUSEL
// ------------------------------------------------------

function iniciarCarruselEquipo() {

  const carrusel =
    document.getElementById(
      "team-roles-track"
    );


  const anterior =
    document.getElementById(
      "team-roles-prev"
    );


  const siguiente =
    document.getElementById(
      "team-roles-next"
    );


  const shell =
    document.getElementById(
      "team-roles-shell"
    );


  if (!carrusel) {
    return;
  }


  // ----------------------------------------------------
  // ANTERIOR
  // ----------------------------------------------------

  if (anterior) {

    anterior.addEventListener(
      "click",
      function () {

        moverCarruselEquipo(
          -1
        );


        iniciarAutoplayEquipo();

      }
    );

  }


  // ----------------------------------------------------
  // SIGUIENTE
  // ----------------------------------------------------

  if (siguiente) {

    siguiente.addEventListener(
      "click",
      function () {

        moverCarruselEquipo(
          1
        );


        iniciarAutoplayEquipo();

      }
    );

  }


  // ----------------------------------------------------
  // DETENER AL INTERACTUAR
  // ----------------------------------------------------

  if (shell) {

    shell.addEventListener(
      "mouseenter",
      detenerAutoplayEquipo
    );


    shell.addEventListener(
      "mouseleave",
      iniciarAutoplayEquipo
    );


    shell.addEventListener(
      "touchstart",
      detenerAutoplayEquipo,
      {
        passive: true
      }
    );


    shell.addEventListener(
      "touchend",
      function () {

        window.setTimeout(
          iniciarAutoplayEquipo,
          1000
        );

      },
      {
        passive: true
      }
    );

  }


  // ----------------------------------------------------
  // INICIO
  // ----------------------------------------------------

  window.setTimeout(
    iniciarAutoplayEquipo,
    700
  );

}


// ======================================================
// 14. RADAR INMOBILIARIO
// ======================================================


// ------------------------------------------------------
// NORMALIZAR TEXTO
// ------------------------------------------------------

function normalizarRadar(texto) {

  return String(
    texto || ""
  )
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .replace(
      /\s+/g,
      " "
    )
    .trim();

}


// ------------------------------------------------------
// ESCAPAR HTML
// ------------------------------------------------------

function escaparHTMLRadar(texto) {

  return String(
    texto || ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


// ------------------------------------------------------
// FORMATEAR PEN
// ------------------------------------------------------

function formatearPENRadar(valor) {

  const numero =
    Number(valor);


  if (
    !Number.isFinite(numero) ||
    numero <= 0
  ) {
    return "";
  }


  return new Intl.NumberFormat(
    "es-PE",
    {
      style: "currency",
      currency: "PEN",
      maximumFractionDigits: 0
    }
  ).format(numero);

}


// ------------------------------------------------------
// FORMATEAR USD
// ------------------------------------------------------

function formatearUSDRadar(valor) {

  const numero =
    Number(valor);


  if (
    !Number.isFinite(numero) ||
    numero <= 0
  ) {
    return "";
  }


  return (
    "US$ " +
    numero.toLocaleString(
      "es-PE",
      {
        maximumFractionDigits: 0
      }
    )
  );

}


// ------------------------------------------------------
// PRECIO
// ------------------------------------------------------

function formatearPrecioRadar(
  proyecto
) {

  const precioPEN =
    Number(
      proyecto.precioDesdePEN
    );


  if (
    Number.isFinite(precioPEN) &&
    precioPEN > 0
  ) {

    return (
      "Desde " +
      formatearPENRadar(
        precioPEN
      )
    );

  }


  const precioUSD =
    Number(
      proyecto.precioDesdeUSD
    );


  if (
    Number.isFinite(precioUSD) &&
    precioUSD > 0
  ) {

    return (
      "Desde " +
      formatearUSDRadar(
        precioUSD
      )
    );

  }


  return "";

}


// ------------------------------------------------------
// CARGAR JSON
// ------------------------------------------------------

async function cargarProyectosRadar() {

  try {

    const response =
      await fetch(
        "/data/proyectos.json",
        {
          cache: "no-cache"
        }
      );


    if (
      !response.ok
    ) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    const data =
      await response.json();


    if (
      !Array.isArray(data)
    ) {

      throw new Error(
        "proyectos.json no contiene un array."
      );

    }


    radarProyectos =
      data.filter(
        function (proyecto) {

          return (
            proyecto &&
            proyecto.proyecto
          );

        }
      );


    console.log(
      `✅ Radar cargado: ${radarProyectos.length} proyectos`
    );

  } catch (error) {

    console.error(
      "❌ Error cargando proyectos.json:",
      error
    );


    mostrarErrorRadar(
      "No pudimos cargar la información inmobiliaria."
    );

  }

}


// ------------------------------------------------------
// PREPARAR RADAR
// ------------------------------------------------------

function prepararRadar() {

  const formulario =
    document.getElementById(
      "radar-form"
    );


  const filtros =
    document.querySelectorAll(
      "[data-radar-filter]"
    );


  const sugerencias =
    document.querySelectorAll(
      "[data-radar-query]"
    );


  // ----------------------------------------------------
  // FORMULARIO
  // ----------------------------------------------------

  if (formulario) {

    formulario.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        buscarZonaRadar();

      }
    );

  }


  // ----------------------------------------------------
  // FILTROS
  // ----------------------------------------------------

  filtros.forEach(
    function (boton) {

      boton.addEventListener(
        "click",
        function () {

          radarFiltroActual =
            boton.dataset.radarFilter ||
            "todos";


          filtros.forEach(
            function (item) {

              item.classList.remove(
                "radar-filter-active"
              );


              item.setAttribute(
                "aria-pressed",
                "false"
              );

            }
          );


          boton.classList.add(
            "radar-filter-active"
          );


          boton.setAttribute(
            "aria-pressed",
            "true"
          );


          if (
            radarConsultaActual
          ) {

            mostrarResultadosRadar();

          }


          window.dataLayer.push({
            event: "radar_filter",
            event_category: "home",
            event_action: "click",
            event_label:
              radarFiltroActual,
            section:
              "radar-inmobiliario",
            description:
              "Cambio de filtro del radar"
          });

        }
      );

    }
  );


  // ----------------------------------------------------
  // SUGERENCIAS
  // ----------------------------------------------------

  sugerencias.forEach(
    function (boton) {

      boton.addEventListener(
        "click",
        function () {

          const consulta =
            boton.dataset.radarQuery;


          if (!consulta) {
            return;
          }


          const input =
            document.getElementById(
              "radar-query"
            );


          if (input) {

            input.value =
              consulta;

          }


          buscarZonaRadar();

        }
      );

    }
  );

}


// ------------------------------------------------------
// BUSCAR
// ------------------------------------------------------

function buscarZonaRadar() {

  const input =
    document.getElementById(
      "radar-query"
    );


  if (!input) {
    return;
  }


  const consulta =
    input.value.trim();


  if (!consulta) {

    input.focus();

    return;

  }


  if (
    !radarProyectos.length
  ) {

    mostrarErrorRadar(
      "La base de proyectos todavía se está cargando. Intenta nuevamente en unos segundos."
    );

    return;

  }


  mostrarEstadoRadar(
    true
  );


  detenerAutoplayRadar();


  const consultaNormalizada =
    normalizarRadar(
      consulta
    );


  radarConsultaActual =
    consulta;


  radarResultados =
    radarProyectos.filter(
      function (proyecto) {

        const campos =
          [
            proyecto.proyecto,
            proyecto.inmobiliaria,
            proyecto.distrito,
            proyecto.zona,
            proyecto.direccion
          ];


        return campos.some(
          function (campo) {

            return normalizarRadar(
              campo
            ).includes(
              consultaNormalizada
            );

          }
        );

      }
    );


  finalizarBusquedaRadar(
    consulta
  );


  window.dataLayer.push({
    event: "radar_search",
    event_category: "home",
    event_action: "search",

    event_label:
      formatearTexto(
        consulta
      ),

    section:
      "radar-inmobiliario",

    description:
      `${radarResultados.length} resultados`
  });

}


// ------------------------------------------------------
// FINALIZAR BÚSQUEDA
// ------------------------------------------------------

function finalizarBusquedaRadar(
  consulta
) {

  const titulo =
    document.getElementById(
      "radar-result-title"
    );


  if (titulo) {

    titulo.textContent =
      `Resultados para ${consulta}`;

  }


  mostrarEstadoRadar(
    false
  );


  mostrarResultadosRadar();

}


// ------------------------------------------------------
// FILTRAR RESULTADOS
// ------------------------------------------------------

function obtenerResultadosFiltrados() {

  if (
    radarFiltroActual === "todos" ||
    radarFiltroActual === "proyectos"
  ) {

    return radarResultados;

  }


  if (
    radarFiltroActual !==
    "inmobiliarias"
  ) {

    return radarResultados;

  }


  const inmobiliarias =
    new Map();


  radarResultados.forEach(
    function (proyecto) {

      const nombre =
        proyecto.inmobiliaria;


      if (!nombre) {
        return;
      }


      const clave =
        normalizarRadar(
          nombre
        );


      if (
        !inmobiliarias.has(
          clave
        )
      ) {

        inmobiliarias.set(
          clave,
          proyecto
        );

      }

    }
  );


  return Array.from(
    inmobiliarias.values()
  );

}


// ------------------------------------------------------
// MOSTRAR RESULTADOS
// ------------------------------------------------------

function mostrarResultadosRadar() {

  const container =
    document.getElementById(
      "radar-results"
    );


  const contador =
    document.getElementById(
      "radar-result-count"
    );


  const noResults =
    document.getElementById(
      "radar-no-results"
    );


  const carouselShell =
    document.getElementById(
      "radar-carousel-shell"
    );


  if (!container) {
    return;
  }


  detenerAutoplayRadar();


  const resultados =
    obtenerResultadosFiltrados();


  // ----------------------------------------------------
  // CONTADOR
  // ----------------------------------------------------

  if (contador) {

    if (
      radarFiltroActual ===
      "inmobiliarias"
    ) {

      contador.textContent =
        `${resultados.length} ${
          resultados.length === 1
            ? "inmobiliaria"
            : "inmobiliarias"
        }`;

    } else {

      contador.textContent =
        `${resultados.length} ${
          resultados.length === 1
            ? "proyecto"
            : "proyectos"
        }`;

    }

  }


  // ----------------------------------------------------
  // SIN RESULTADOS
  // ----------------------------------------------------

  if (
    !resultados.length
  ) {

    container.innerHTML =
      "";


    if (carouselShell) {

      carouselShell.classList.add(
        "hidden"
      );

    }


    if (noResults) {

      noResults.classList.remove(
        "hidden"
      );

    }


    return;

  }


  // ----------------------------------------------------
  // MOSTRAR CARRUSEL
  // ----------------------------------------------------

  if (carouselShell) {

    carouselShell.classList.remove(
      "hidden"
    );

  }


  if (noResults) {

    noResults.classList.add(
      "hidden"
    );

  }


  // ----------------------------------------------------
  // CREAR TARJETAS
  // ----------------------------------------------------

  container.innerHTML =
    resultados
      .map(
        function (
          proyecto,
          index
        ) {

          if (
            radarFiltroActual ===
            "inmobiliarias"
          ) {

            return crearCardInmobiliariaRadar(
              proyecto,
              index
            );

          }


          return crearCardProyectoRadar(
            proyecto,
            index
          );

        }
      )
      .join("");


  container.scrollLeft =
    0;


  window.setTimeout(
    iniciarAutoplayRadar,
    350
  );

}


// ------------------------------------------------------
// CARD PROYECTO
// ------------------------------------------------------

function crearCardProyectoRadar(
  proyecto,
  index
) {

  const precio =
    formatearPrecioRadar(
      proyecto
    );


  return `
    <article
      class="radar-result-card"
      data-radar-index="${index}"
      data-radar-project-id="${escaparHTMLRadar(
        proyecto.id || ""
      )}"
    >

      <span
        class="radar-result-type"
      >
        Proyecto
      </span>


      <h4>
        ${escaparHTMLRadar(
          proyecto.proyecto ||
          "Proyecto inmobiliario"
        )}
      </h4>


      ${
        proyecto.inmobiliaria
          ? `
            <p
              class="radar-result-builder"
            >
              ${escaparHTMLRadar(
                proyecto.inmobiliaria
              )}
            </p>
          `
          : ""
      }


      <p
        class="radar-result-address"
      >

        <i
          class="fa-solid fa-location-dot"
          aria-hidden="true"
        ></i>

        <span>
          ${escaparHTMLRadar(
            proyecto.direccion ||
            proyecto.distrito ||
            "Ubicación no disponible"
          )}
        </span>

      </p>


      ${
        precio
          ? `
            <div
              class="radar-result-price"
            >

              <i
                class="fa-solid fa-tag"
                aria-hidden="true"
              ></i>

              <span>
                ${precio}
              </span>

            </div>
          `
          : ""
      }


      ${
        proyecto.estado
          ? `
            <span
              class="radar-result-status"
            >
              ${escaparHTMLRadar(
                proyecto.estado
              )}
            </span>
          `
          : ""
      }

    </article>
  `;

}


// ------------------------------------------------------
// CARD INMOBILIARIA
// ------------------------------------------------------

function crearCardInmobiliariaRadar(
  proyecto,
  index
) {

  const nombre =
    proyecto.inmobiliaria ||
    "Inmobiliaria";


  const nombreNormalizado =
    normalizarRadar(
      nombre
    );


  const proyectosEmpresa =
    radarResultados.filter(
      function (item) {

        return (
          normalizarRadar(
            item.inmobiliaria
          ) ===
          nombreNormalizado
        );

      }
    );


  const cantidad =
    proyectosEmpresa.length;


  const distritos =
    [
      ...new Set(
        proyectosEmpresa
          .map(
            function (item) {

              return item.distrito;

            }
          )
          .filter(Boolean)
      )
    ];


  const ubicacion =
    distritos
      .slice(
        0,
        3
      )
      .join(", ");


  return `
    <article
      class="radar-result-card"
      data-radar-index="${index}"
    >

      <span
        class="radar-result-type"
      >
        Inmobiliaria
      </span>


      <h4>
        ${escaparHTMLRadar(
          nombre
        )}
      </h4>


      <p
        class="radar-result-address"
      >

        <i
          class="fa-solid fa-building"
          aria-hidden="true"
        ></i>

        <span>
          ${cantidad} ${
            cantidad === 1
              ? "proyecto"
              : "proyectos"
          }
          en los resultados
        </span>

      </p>


      ${
        ubicacion
          ? `
            <p
              class="radar-result-address radar-result-address-secondary"
            >

              <i
                class="fa-solid fa-location-dot"
                aria-hidden="true"
              ></i>

              <span>
                ${escaparHTMLRadar(
                  ubicacion
                )}
              </span>

            </p>
          `
          : ""
      }

    </article>
  `;

}


// ------------------------------------------------------
// ESTADO RADAR
// ------------------------------------------------------

function mostrarEstadoRadar(
  cargando
) {

  const empty =
    document.getElementById(
      "radar-empty"
    );


  const content =
    document.getElementById(
      "radar-content"
    );


  const loading =
    document.getElementById(
      "radar-loading"
    );


  const carouselShell =
    document.getElementById(
      "radar-carousel-shell"
    );


  if (empty) {

    empty.classList.add(
      "hidden"
    );

  }


  if (content) {

    content.classList.remove(
      "hidden"
    );

  }


  if (loading) {

    loading.classList.toggle(
      "hidden",
      !cargando
    );

  }


  if (
    cargando &&
    carouselShell
  ) {

    carouselShell.classList.add(
      "hidden"
    );

  }

}


// ------------------------------------------------------
// ERROR RADAR
// ------------------------------------------------------

function mostrarErrorRadar(
  mensaje
) {

  const container =
    document.getElementById(
      "radar-results"
    );


  const noResults =
    document.getElementById(
      "radar-no-results"
    );


  const carouselShell =
    document.getElementById(
      "radar-carousel-shell"
    );


  detenerAutoplayRadar();


  mostrarEstadoRadar(
    false
  );


  if (container) {

    container.innerHTML =
      "";

  }


  if (carouselShell) {

    carouselShell.classList.add(
      "hidden"
    );

  }


  if (noResults) {

    noResults.classList.remove(
      "hidden"
    );


    const texto =
      noResults.querySelector(
        "p"
      );


    if (texto) {

      texto.textContent =
        mensaje;

    }

  }

}


// ------------------------------------------------------
// DETENER AUTOPLAY
// ------------------------------------------------------

function detenerAutoplayRadar() {

  if (
    !radarCarruselIntervalo
  ) {
    return;
  }


  window.clearInterval(
    radarCarruselIntervalo
  );


  radarCarruselIntervalo =
    null;

}


// ------------------------------------------------------
// OBTENER PASO CARRUSEL
// ------------------------------------------------------

function obtenerPasoCarruselRadar() {

  const carrusel =
    document.getElementById(
      "radar-results"
    );


  if (!carrusel) {
    return 0;
  }


  const card =
    carrusel.querySelector(
      ".radar-result-card"
    );


  if (!card) {
    return 0;
  }


  const estilos =
    window.getComputedStyle(
      carrusel
    );


  const gap =
    parseFloat(
      estilos.columnGap ||
      estilos.gap ||
      "16"
    ) || 16;


  return (
    card
      .getBoundingClientRect()
      .width +
    gap
  );

}


// ------------------------------------------------------
// MOVER CARRUSEL
// ------------------------------------------------------

function moverCarruselRadar(
  direccion
) {

  const carrusel =
    document.getElementById(
      "radar-results"
    );


  if (!carrusel) {
    return;
  }


  const paso =
    obtenerPasoCarruselRadar();


  if (
    paso <= 0
  ) {
    return;
  }


  const maxScroll =
    Math.max(
      0,

      carrusel.scrollWidth -
      carrusel.clientWidth
    );


  if (
    maxScroll <= 5
  ) {
    return;
  }


  // ----------------------------------------------------
  // FINAL → PRINCIPIO
  // ----------------------------------------------------

  if (
    direccion > 0 &&
    carrusel.scrollLeft >=
      maxScroll - 12
  ) {

    carrusel.scrollTo({
      left: 0,
      behavior: "smooth"
    });


    return;

  }


  // ----------------------------------------------------
  // PRINCIPIO → FINAL
  // ----------------------------------------------------

  if (
    direccion < 0 &&
    carrusel.scrollLeft <= 12
  ) {

    carrusel.scrollTo({
      left: maxScroll,
      behavior: "smooth"
    });


    return;

  }


  // ----------------------------------------------------
  // MOVIMIENTO NORMAL
  // ----------------------------------------------------

  carrusel.scrollBy({
    left:
      direccion * paso,

    behavior:
      "smooth"
  });

}


// ------------------------------------------------------
// INICIAR AUTOPLAY
// ------------------------------------------------------

function iniciarAutoplayRadar() {

  detenerAutoplayRadar();


  const carrusel =
    document.getElementById(
      "radar-results"
    );


  if (!carrusel) {
    return;
  }


  const cards =
    carrusel.querySelectorAll(
      ".radar-result-card"
    );


  if (
    cards.length <= 1
  ) {
    return;
  }


  const maxScroll =
    carrusel.scrollWidth -
    carrusel.clientWidth;


  if (
    maxScroll <= 5
  ) {
    return;
  }


  radarCarruselIntervalo =
    window.setInterval(
      function () {

        if (
          document.hidden
        ) {
          return;
        }


        moverCarruselRadar(
          1
        );

      },
      RADAR_AUTOPLAY_MS
    );

}


// ------------------------------------------------------
// PREPARAR CARRUSEL
// ------------------------------------------------------

function prepararCarruselRadar() {

  const carrusel =
    document.getElementById(
      "radar-results"
    );


  const anterior =
    document.getElementById(
      "radar-prev"
    );


  const siguiente =
    document.getElementById(
      "radar-next"
    );


  if (!carrusel) {
    return;
  }


  // ----------------------------------------------------
  // ANTERIOR
  // ----------------------------------------------------

  if (anterior) {

    anterior.addEventListener(
      "click",
      function () {

        moverCarruselRadar(
          -1
        );


        iniciarAutoplayRadar();

      }
    );

  }


  // ----------------------------------------------------
  // SIGUIENTE
  // ----------------------------------------------------

  if (siguiente) {

    siguiente.addEventListener(
      "click",
      function () {

        moverCarruselRadar(
          1
        );


        iniciarAutoplayRadar();

      }
    );

  }


  // ----------------------------------------------------
  // PAUSA CON MOUSE
  // ----------------------------------------------------

  carrusel.addEventListener(
    "mouseenter",
    detenerAutoplayRadar
  );


  carrusel.addEventListener(
    "mouseleave",
    iniciarAutoplayRadar
  );


  // ----------------------------------------------------
  // PAUSA TOUCH
  // ----------------------------------------------------

  carrusel.addEventListener(
    "touchstart",
    detenerAutoplayRadar,
    {
      passive: true
    }
  );


  carrusel.addEventListener(
    "touchend",
    function () {

      window.setTimeout(
        iniciarAutoplayRadar,
        1000
      );

    },
    {
      passive: true
    }
  );

}


// ------------------------------------------------------
// INICIALIZAR RADAR
// ------------------------------------------------------

async function initRadarInmobiliario() {

  const radar =
    document.getElementById(
      "radar-inmobiliario"
    );


  if (!radar) {
    return;
  }


  prepararRadar();

  prepararCarruselRadar();


  await cargarProyectosRadar();

}


// ======================================================
// 15. CONTROL DE VISIBILIDAD
// ======================================================

function iniciarControlVisibilidad() {

  document.addEventListener(
    "visibilitychange",
    function () {

      if (
        document.hidden
      ) {

        detenerAutoplayRadar();

        detenerAutoplayEquipo();

        return;

      }


      iniciarAutoplayEquipo();


      if (
        radarResultados.length
      ) {

        iniciarAutoplayRadar();

      }

    }
  );

}


// ======================================================
// 16. CONTROL DE RESIZE
// ======================================================

function iniciarControlResize() {

  let resizeTimer = null;


  window.addEventListener(
    "resize",
    function () {

      window.clearTimeout(
        resizeTimer
      );


      resizeTimer =
        window.setTimeout(
          function () {

            iniciarAutoplayEquipo();


            if (
              radarResultados.length
            ) {

              iniciarAutoplayRadar();

            }

          },
          250
        );

    },
    {
      passive: true
    }
  );

}


// ======================================================
// 17. INICIALIZAR TODO
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    // --------------------------------------------------
    // GENERAL
    // --------------------------------------------------

    iniciarAOS();

    iniciarAnioFooter();

    iniciarHeader();

    iniciarMenuMovil();

    iniciarTrackingClicks();


    // --------------------------------------------------
    // SECCIONES
    // --------------------------------------------------

    iniciarServicios();

    iniciarCarruselEquipo();

    iniciarFormularioContacto();


    // --------------------------------------------------
    // TRACKING
    // --------------------------------------------------

    iniciarScrollDepth();

    iniciarTiempoEnSitio();


    // --------------------------------------------------
    // RADAR
    // --------------------------------------------------

    initRadarInmobiliario();


    // --------------------------------------------------
    // COMPORTAMIENTO GLOBAL
    // --------------------------------------------------

    iniciarControlVisibilidad();

    iniciarControlResize();

  }
);
