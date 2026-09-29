// ======================================================
// ESCALA COMERCIAL
// scripts.js
// Radar general + Proyectos Escala
// ======================================================


// ======================================================
// 1. CONFIGURACIÓN GENERAL
// ======================================================

window.dataLayer = window.dataLayer || [];

const RADAR_AUTOPLAY_MS = 4200;
const RADAR_FEATURED_AUTOPLAY_MS = 5200;
const TEAM_AUTOPLAY_MS = 3800;

const RADAR_DATA_URL = "/data/proyectos.json";
const RADAR_ESCALA_DATA_URL = "/data/proyectos-escala.json";


// ======================================================
// 2. ESTADO GLOBAL
// ======================================================

let radarProyectos = [];
let radarProyectosEscala = [];
let radarResultados = [];

let radarFiltroActual = "todos";
let radarConsultaActual = "";

let radarCarruselIntervalo = null;
let radarFeaturedIntervalo = null;
let teamCarruselIntervalo = null;

const scrollMarcado = {
  25: false,
  50: false,
  75: false,
  100: false
};


// ======================================================
// 3. HELPERS GENERALES
// ======================================================

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
// 8. TRACKING GENERAL
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


      window.dataLayer.push({
        event: "interaction",
        event_category: "home",
        event_action: "click",
        event_label: label,
        section: section,
        description: "-"
      });


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


          servicePanels.forEach(
            function (panel) {

              panel.classList.add(
                "hidden"
              );
            }
          );


          tab.classList.add(
            "service-tab-active"
          );

          tab.setAttribute(
            "aria-selected",
            "true"
          );


          const activePanel =
            document.querySelector(
              `[data-service-panel="${target}"]`
            );


          if (activePanel) {

            activePanel.classList.remove(
              "hidden"
            );
          }


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
// 10. FORMULARIO CONTACTO
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


        if (!respuesta.ok) {

          throw new Error(
            `Formspree respondió HTTP ${respuesta.status}`
          );
        }


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


        if (nivel === 25) {

          descripcion =
            "inicio de desplazamiento";
        }


        if (nivel === 50) {

          descripcion =
            "mitad de página";
        }


        if (nivel === 75) {

          descripcion =
            "casi al final";
        }


        if (nivel === 100) {

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

      if (scrollTicking) {
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

  const tiempos = [
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
// 13. CARRUSEL EQUIPO
// ======================================================

function detenerAutoplayEquipo() {

  if (!teamCarruselIntervalo) {
    return;
  }


  window.clearInterval(
    teamCarruselIntervalo
  );


  teamCarruselIntervalo =
    null;
}


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


  if (paso <= 0) {
    return;
  }


  const maxScroll =
    Math.max(
      0,
      carrusel.scrollWidth -
      carrusel.clientWidth
    );


  if (maxScroll <= 5) {
    return;
  }


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


  carrusel.scrollBy({
    left:
      direccion * paso,

    behavior:
      "smooth"
  });
}


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


  if (cards.length <= 1) {
    return;
  }


  const maxScroll =
    carrusel.scrollWidth -
    carrusel.clientWidth;


  if (maxScroll <= 5) {
    return;
  }


  teamCarruselIntervalo =
    window.setInterval(
      function () {

        if (document.hidden) {
          return;
        }

        moverCarruselEquipo(
          1
        );
      },
      TEAM_AUTOPLAY_MS
    );
}


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


  window.setTimeout(
    iniciarAutoplayEquipo,
    700
  );
}


// ======================================================
// 14. RADAR — HELPERS
// ======================================================

function normalizarRadar(texto) {

  return String(texto || "")
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


function escaparHTMLRadar(texto) {

  return String(texto || "")
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


function escaparAtributoRadar(texto) {

  return escaparHTMLRadar(
    texto
  );
}


function esValorActivoRadar(valor) {

  if (
    valor === undefined ||
    valor === null ||
    valor === ""
  ) {
    return true;
  }


  if (valor === true) {
    return true;
  }


  if (valor === false) {
    return false;
  }


  const normalizado =
    normalizarRadar(
      valor
    );


  return ![
    "false",
    "0",
    "no",
    "inactivo"
  ].includes(
    normalizado
  );
}


// ------------------------------------------------------
// SANITIZAR ICONOS FONT AWESOME DEL JSON
// ------------------------------------------------------

function sanitizarIconoRadar(icono) {

  const valor =
    String(icono || "")
      .trim();


  if (
    !valor ||
    !/^[a-z0-9\-\s]+$/i.test(valor)
  ) {

    return "fa-circle";
  }


  const clases =
    valor
      .split(/\s+/)
      .filter(Boolean)
      .filter(
        function (clase) {

          return (
            clase === "fa-solid" ||
            clase === "fa-regular" ||
            clase.startsWith("fa-")
          );
        }
      );


  if (
    !clases.some(
      function (clase) {

        return (
          clase === "fa-solid" ||
          clase === "fa-regular"
        );
      }
    )
  ) {

    clases.unshift(
      "fa-solid"
    );
  }


  if (
    !clases.some(
      function (clase) {

        return (
          clase.startsWith("fa-") &&
          clase !== "fa-solid" &&
          clase !== "fa-regular"
        );
      }
    )
  ) {

    clases.push(
      "fa-circle"
    );
  }


  return clases.join(" ");
}


// ======================================================
// 15. RADAR — PRECIOS
// ======================================================

function formatearPENRadar(
  valor
) {

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


function formatearUSDRadar(
  valor
) {

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


// ======================================================
// 16. RADAR — PROYECTOS ESCALA
// ======================================================

function obtenerProyectoEscala(
  proyecto
) {

  if (!proyecto) {
    return null;
  }


  const idProyecto =
    normalizarRadar(
      proyecto.id
    );


  const nombreProyecto =
    normalizarRadar(
      proyecto.proyecto
    );


  const inmobiliariaProyecto =
    normalizarRadar(
      proyecto.inmobiliaria
    );


  return (
    radarProyectosEscala.find(
      function (destacado) {

        const idDestacado =
          normalizarRadar(
            destacado.id
          );


        const nombreDestacado =
          normalizarRadar(
            destacado.proyecto
          );


        const inmobiliariaDestacada =
          normalizarRadar(
            destacado.inmobiliaria
          );


        // ----------------------------------------------
        // PRIORIDAD 1: ID EXACTO
        // ----------------------------------------------

        if (
          idProyecto &&
          idDestacado &&
          idProyecto === idDestacado
        ) {
          return true;
        }


        // ----------------------------------------------
        // PRIORIDAD 2: NOMBRE DE PROYECTO
        // ----------------------------------------------

        if (
          nombreProyecto &&
          nombreDestacado &&
          nombreProyecto ===
            nombreDestacado
        ) {

          if (
            inmobiliariaProyecto &&
            inmobiliariaDestacada
          ) {

            return (
              inmobiliariaProyecto ===
              inmobiliariaDestacada
            );
          }


          return true;
        }


        return false;
      }
    ) ||
    null
  );
}


function esProyectoClienteEscala(
  proyecto
) {

  return Boolean(
    obtenerProyectoEscala(
      proyecto
    )
  );
}


function obtenerUrlProyectoClienteEscala(
  proyecto
) {

  const proyectoEscala =
    obtenerProyectoEscala(
      proyecto
    );


  const url =
    (
      proyectoEscala &&
      (
        proyectoEscala.url ||
        proyectoEscala.urlProyecto ||
        proyectoEscala.enlace
      )
    ) ||
    proyecto.url ||
    proyecto.urlProyecto ||
    proyecto.enlace ||
    "";


  return String(
    url
  ).trim();
}


// ======================================================
// 17. UNIFICAR RADAR GENERAL + ESCALA
// ======================================================

function obtenerClaveProyectoRadar(
  proyecto
) {

  const id =
    normalizarRadar(
      proyecto.id
    );


  if (id) {

    return `id:${id}`;
  }


  const nombre =
    normalizarRadar(
      proyecto.proyecto
    );


  const inmobiliaria =
    normalizarRadar(
      proyecto.inmobiliaria
    );


  return (
    `proyecto:${nombre}|${inmobiliaria}`
  );
}


function buscarProyectoEquivalenteEnMapa(
  mapa,
  proyectoBuscado
) {

  const idBuscado =
    normalizarRadar(
      proyectoBuscado.id
    );


  const nombreBuscado =
    normalizarRadar(
      proyectoBuscado.proyecto
    );


  const inmobiliariaBuscada =
    normalizarRadar(
      proyectoBuscado.inmobiliaria
    );


  for (
    const [clave, proyecto]
    of mapa.entries()
  ) {

    const idProyecto =
      normalizarRadar(
        proyecto.id
      );


    const nombreProyecto =
      normalizarRadar(
        proyecto.proyecto
      );


    const inmobiliariaProyecto =
      normalizarRadar(
        proyecto.inmobiliaria
      );


    if (
      idBuscado &&
      idProyecto &&
      idBuscado === idProyecto
    ) {

      return {
        clave,
        proyecto
      };
    }


    if (
      nombreBuscado &&
      nombreProyecto &&
      nombreBuscado ===
        nombreProyecto
    ) {

      if (
        inmobiliariaBuscada &&
        inmobiliariaProyecto &&
        inmobiliariaBuscada !==
          inmobiliariaProyecto
      ) {

        continue;
      }


      return {
        clave,
        proyecto
      };
    }
  }


  return null;
}


function construirBaseRadar() {

  const mapa =
    new Map();


  // ----------------------------------------------------
  // PRIMERO: RADAR GENERAL
  // ----------------------------------------------------

  radarProyectos.forEach(
    function (proyecto) {

      mapa.set(
        obtenerClaveProyectoRadar(
          proyecto
        ),
        {
          ...proyecto,
          clienteEscala: false
        }
      );
    }
  );


  // ----------------------------------------------------
  // SEGUNDO: PROYECTOS ESCALA
  // ----------------------------------------------------

  radarProyectosEscala.forEach(
    function (proyectoEscala) {

      const coincidencia =
        buscarProyectoEquivalenteEnMapa(
          mapa,
          proyectoEscala
        );


      if (coincidencia) {

        const datosEscala =
          Object.fromEntries(
            Object.entries(
              proyectoEscala
            ).filter(
              function ([, valor]) {

                return (
                  valor !== undefined &&
                  valor !== null &&
                  valor !== ""
                );
              }
            )
          );


        mapa.set(
          coincidencia.clave,
          {
            ...coincidencia.proyecto,
            ...datosEscala,
            clienteEscala: true
          }
        );


        return;
      }


      const nuevoProyecto = {
        ...proyectoEscala,
        clienteEscala: true
      };


      mapa.set(
        obtenerClaveProyectoRadar(
          nuevoProyecto
        ),
        nuevoProyecto
      );
    }
  );


  radarProyectos =
    Array.from(
      mapa.values()
    );
}


function ordenarResultadosRadar(
  resultados
) {

  return [
    ...resultados
  ].sort(
    function (a, b) {

      const aCliente =
        esProyectoClienteEscala(a)
          ? 1
          : 0;


      const bCliente =
        esProyectoClienteEscala(b)
          ? 1
          : 0;


      return (
        bCliente -
        aCliente
      );
    }
  );
}


// ======================================================
// 18. CARGAR PROYECTOS ESCALA
// ======================================================

async function cargarProyectosEscalaRadar() {

  try {

    const response =
      await fetch(
        RADAR_ESCALA_DATA_URL,
        {
          cache: "no-cache"
        }
      );


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );
    }


    const data =
      await response.json();


    if (!Array.isArray(data)) {

      throw new Error(
        "proyectos-escala.json no contiene un array."
      );
    }


    radarProyectosEscala =
      data.filter(
        function (proyecto) {

          return (
            proyecto &&
            proyecto.proyecto &&
            esValorActivoRadar(
              proyecto.activo
            )
          );
        }
      );


    console.log(
      `⭐ Proyectos Escala cargados: ${radarProyectosEscala.length}`
    );

  } catch (error) {

    radarProyectosEscala = [];


    console.error(
      "❌ Error cargando proyectos-escala.json:",
      error
    );


    ocultarBloqueProyectosEscala();
  }
}


// ======================================================
// 19. RENDER PROYECTOS ESCALA
// ======================================================

function renderizarProyectosEscala() {

  const track =
    document.getElementById(
      "radar-featured-track"
    );


  if (!track) {
    return;
  }


  if (
    !radarProyectosEscala.length
  ) {

    track.innerHTML = "";

    ocultarBloqueProyectosEscala();

    actualizarControlesRadarFeatured();

    return;
  }


  mostrarBloqueProyectosEscala();


  track.innerHTML =
    radarProyectosEscala
      .map(
        function (
          proyecto,
          index
        ) {

          return crearCardProyectoEscala(
            proyecto,
            index
          );
        }
      )
      .join("");


  track.scrollLeft =
    0;


  actualizarControlesRadarFeatured();


  window.setTimeout(
    iniciarAutoplayRadarFeatured,
    350
  );
}


// ======================================================
// 20. CARD PROYECTO ESCALA
// ======================================================

function crearCardProyectoEscala(
  proyecto,
  index
) {

  const nombre =
    proyecto.proyecto ||
    "Proyecto inmobiliario";


  const inmobiliaria =
    proyecto.inmobiliaria ||
    "Cliente Escala";


  const distrito =
    proyecto.distrito ||
    proyecto.zona ||
    "";


  const tipo =
    proyecto.tipo ||
    "";


  const imagen =
    String(
      proyecto.imagen ||
      ""
    ).trim();


  const url =
    String(
      proyecto.url ||
      proyecto.urlProyecto ||
      proyecto.enlace ||
      ""
    ).trim();


  const descripcion =
    proyecto.descripcion ||
    "";


  const etiqueta =
    proyecto.etiqueta ||
    (
      proyecto.destacado === true
        ? "Cliente destacado"
        : ""
    );



  // ----------------------------------------------------
  // CARACTERÍSTICAS
  //
  // Si vienen en JSON, usamos esas.
  // Si todavía no existen, construimos únicamente
  // información derivada de campos que ya tenemos.
  // ----------------------------------------------------

  let caracteristicas =
    Array.isArray(
      proyecto.caracteristicas
    )
      ? proyecto.caracteristicas
          .filter(
            function (item) {

              return (
                item &&
                (
                  item.titulo ||
                  item.detalle
                )
              );
            }
          )
          .slice(
            0,
            3
          )
      : [];


  if (
    !caracteristicas.length
  ) {

    caracteristicas = [];


    if (tipo) {

      caracteristicas.push({
        icono:
          "fa-building",

        titulo:
          tipo,

        detalle:
          "Proyecto inmobiliario"
      });
    }


    if (distrito) {

      caracteristicas.push({
        icono:
          "fa-location-dot",

        titulo:
          "Ubicación",

        detalle:
          distrito
      });
    }


    caracteristicas.push({
      icono:
        "fa-star",

      titulo:
        "Proyecto destacado",

      detalle:
        "Comercializado por Escala"
    });
  }


  // ----------------------------------------------------
  // IMAGEN
  // ----------------------------------------------------

  const contenidoMedia =
    imagen
      ? `
          <img
            src="${escaparAtributoRadar(
              imagen
            )}"
            alt="${escaparAtributoRadar(
              nombre
            )} - ${escaparAtributoRadar(
              inmobiliaria
            )}"
            loading="${
              index === 0
                ? "eager"
                : "lazy"
            }"
          >
        `
      : `
          <div
            class="w-full h-full min-h-[250px] flex items-center justify-center text-blue-700"
            aria-hidden="true"
          >

            <i
              class="fa-solid fa-building text-4xl"
            ></i>

          </div>
        `;


  // ----------------------------------------------------
  // UBICACIÓN SOBRE FOTO
  // ----------------------------------------------------

  const ubicacionMedia =
    distrito
      ? `
          <span
            class="radar-featured-location"
          >

            <i
              class="fa-solid fa-location-dot"
              aria-hidden="true"
            ></i>

            ${escaparHTMLRadar(
              distrito
            )}

          </span>
        `
      : "";


  // ----------------------------------------------------
  // BADGE SOBRE IMAGEN
  // ----------------------------------------------------

  const badgeImagen =
    etiqueta
      ? `
          <span
            class="radar-featured-badge"
          >

            <i
              class="fa-solid fa-star"
              aria-hidden="true"
            ></i>

            ${escaparHTMLRadar(
              etiqueta
            )}

          </span>
        `
      : "";


  // ----------------------------------------------------
  // ETIQUETA PRINCIPAL
  // ----------------------------------------------------

  const highlight =
    etiqueta
      ? `
          <span
            class="radar-featured-highlight"
          >

            <i
              class="fa-solid fa-star"
              aria-hidden="true"
            ></i>

            ${escaparHTMLRadar(
              etiqueta
            )}

          </span>
        `
      : "";


  // ----------------------------------------------------
  // CARACTERÍSTICAS
  // ----------------------------------------------------

  const featuresHTML =
    caracteristicas.length
      ? `
          <div
            class="radar-featured-features"
            aria-label="Características del proyecto"
          >

            ${caracteristicas
              .map(
                function (
                  item
                ) {

                  const icono =
                    sanitizarIconoRadar(
                      item.icono ||
                      "fa-circle"
                    );


                  const titulo =
                    item.titulo ||
                    "";


                  const detalle =
                    item.detalle ||
                    "";


                  return `
                    <div
                      class="radar-featured-feature"
                    >

                      <div
                        class="radar-featured-feature-icon"
                        aria-hidden="true"
                      >

                        <i
                          class="${escaparAtributoRadar(
                            icono
                          )}"
                        ></i>

                      </div>


                      <div
                        class="radar-featured-feature-copy"
                      >

                        ${
                          titulo
                            ? `
                              <strong
                                class="radar-featured-feature-title"
                              >
                                ${escaparHTMLRadar(
                                  titulo
                                )}
                              </strong>
                            `
                            : ""
                        }


                        ${
                          detalle
                            ? `
                              <span
                                class="radar-featured-feature-detail"
                              >
                                ${escaparHTMLRadar(
                                  detalle
                                )}
                              </span>
                            `
                            : ""
                        }

                      </div>

                    </div>
                  `;
                }
              )
              .join("")}

          </div>
        `
      : "";


  // ----------------------------------------------------
  // BOTÓN
  // ----------------------------------------------------

  const accion =
    url
      ? `
          <div
            class="radar-featured-actions"
          >

            <span
              class="radar-featured-action"
            >

              <span>
                Ver proyecto
              </span>

              <i
                class="fa-solid fa-arrow-right"
                aria-hidden="true"
              ></i>

            </span>

          </div>
        `
      : "";


  // ----------------------------------------------------
  // CONTENIDO COMPLETO
  // ----------------------------------------------------

  const contenido = `

    <!-- ================================================
         1. IMAGEN
    ================================================= -->

    <div
      class="radar-featured-media"
    >

      ${contenidoMedia}

      ${badgeImagen}

      ${ubicacionMedia}

    </div>


    <!-- ================================================
         2. INFORMACIÓN PRINCIPAL
    ================================================= -->

    <div
  class="radar-featured-content"
>

  <span
    class="radar-featured-highlight"
  >

    <i
      class="fa-solid fa-star"
      aria-hidden="true"
    ></i>

    Cliente Escala

  </span>


  <h4
    class="radar-featured-name"
  >
    ${escaparHTMLRadar(
      nombre
    )}
  </h4>


  <span
    class="radar-featured-company"
  >
    ${escaparHTMLRadar(
      inmobiliaria
    )}
  </span>


  ${
    descripcion
      ? `
        <p
          class="radar-featured-copy"
        >
          ${escaparHTMLRadar(
            descripcion
          )}
        </p>
      `
      : ""
  }


  ${accion}

</div>


    <!-- ================================================
         3. CARACTERÍSTICAS
    ================================================= -->

    ${featuresHTML}
  `;


  // ----------------------------------------------------
  // CON URL:
  // TODA LA FICHA ES CLICKEABLE
  // ----------------------------------------------------

  if (url) {

    return `
      <article
        class="radar-featured-card"
        data-featured-project="true"
        data-featured-index="${index}"
        data-featured-project-id="${escaparAtributoRadar(
          proyecto.id ||
          ""
        )}"
      >

        <a
          href="${escaparAtributoRadar(
            url
          )}"
          class="radar-featured-link"
          aria-label="Ver proyecto ${escaparAtributoRadar(
            nombre
          )}"
          data-featured-project-link="true"
          data-featured-project-name="${escaparAtributoRadar(
            nombre
          )}"
        >

          ${contenido}

        </a>

      </article>
    `;
  }


  // ----------------------------------------------------
  // SIN URL
  // ----------------------------------------------------

  return `
    <article
      class="radar-featured-card"
      data-featured-project="true"
      data-featured-index="${index}"
      data-featured-project-id="${escaparAtributoRadar(
        proyecto.id ||
        ""
      )}"
    >

      <div
        class="radar-featured-link"
        aria-label="${escaparAtributoRadar(
          nombre
        )}"
      >

        ${contenido}

      </div>

    </article>
  `;
}


// ======================================================
// 21. MOSTRAR / OCULTAR PROYECTOS ESCALA
// ======================================================

function ocultarBloqueProyectosEscala() {

  const track =
    document.getElementById(
      "radar-featured-track"
    );


  if (!track) {
    return;
  }


  const shell =
    track.closest(
      ".radar-featured-shell"
    );


  if (shell) {

    shell.classList.add(
      "hidden"
    );
  }
}


function mostrarBloqueProyectosEscala() {

  const track =
    document.getElementById(
      "radar-featured-track"
    );


  if (!track) {
    return;
  }


  const shell =
    track.closest(
      ".radar-featured-shell"
    );


  if (shell) {

    shell.classList.remove(
      "hidden"
    );
  }
}


// ======================================================
// 22. CARRUSEL PROYECTOS ESCALA
// ======================================================

function actualizarControlesRadarFeatured() {

  const anterior =
    document.getElementById(
      "radar-featured-prev"
    );


  const siguiente =
    document.getElementById(
      "radar-featured-next"
    );


  const track =
    document.getElementById(
      "radar-featured-track"
    );


  if (!track) {
    return;
  }


  const cantidad =
    track.querySelectorAll(
      ".radar-featured-card"
    ).length;


  const ocultar =
    cantidad <= 1;


  if (anterior) {

    anterior.classList.toggle(
      "hidden",
      ocultar
    );
  }


  if (siguiente) {

    siguiente.classList.toggle(
      "hidden",
      ocultar
    );
  }
}


function detenerAutoplayRadarFeatured() {

  if (!radarFeaturedIntervalo) {
    return;
  }


  window.clearInterval(
    radarFeaturedIntervalo
  );


  radarFeaturedIntervalo =
    null;
}


function obtenerPasoRadarFeatured() {

  const track =
    document.getElementById(
      "radar-featured-track"
    );


  if (!track) {
    return 0;
  }


  const card =
    track.querySelector(
      ".radar-featured-card"
    );


  if (!card) {
    return 0;
  }


  const estilos =
    window.getComputedStyle(
      track
    );


  const gap =
    parseFloat(
      estilos.columnGap ||
      estilos.gap ||
      "13"
    ) || 13;


  return (
    card
      .getBoundingClientRect()
      .width +
    gap
  );
}


function moverRadarFeatured(
  direccion
) {

  const track =
    document.getElementById(
      "radar-featured-track"
    );


  if (!track) {
    return;
  }


  const paso =
    obtenerPasoRadarFeatured();


  if (paso <= 0) {
    return;
  }


  const maxScroll =
    Math.max(
      0,
      track.scrollWidth -
      track.clientWidth
    );


  if (maxScroll <= 5) {
    return;
  }


  if (
    direccion > 0 &&
    track.scrollLeft >=
      maxScroll - 10
  ) {

    track.scrollTo({
      left: 0,
      behavior: "smooth"
    });

    return;
  }


  if (
    direccion < 0 &&
    track.scrollLeft <= 10
  ) {

    track.scrollTo({
      left: maxScroll,
      behavior: "smooth"
    });

    return;
  }


  track.scrollBy({
    left:
      direccion * paso,

    behavior:
      "smooth"
  });
}


function iniciarAutoplayRadarFeatured() {

  detenerAutoplayRadarFeatured();


  const track =
    document.getElementById(
      "radar-featured-track"
    );


  if (!track) {
    return;
  }


  const cards =
    track.querySelectorAll(
      ".radar-featured-card"
    );


  if (cards.length <= 1) {
    return;
  }


  const maxScroll =
    track.scrollWidth -
    track.clientWidth;


  if (maxScroll <= 5) {
    return;
  }


  radarFeaturedIntervalo =
    window.setInterval(
      function () {

        if (document.hidden) {
          return;
        }


        moverRadarFeatured(
          1
        );
      },
      RADAR_FEATURED_AUTOPLAY_MS
    );
}


function iniciarCarruselRadarFeatured() {

  const track =
    document.getElementById(
      "radar-featured-track"
    );


  const anterior =
    document.getElementById(
      "radar-featured-prev"
    );


  const siguiente =
    document.getElementById(
      "radar-featured-next"
    );


  if (!track) {
    return;
  }


  if (anterior) {

    anterior.addEventListener(
      "click",
      function () {

        moverRadarFeatured(
          -1
        );

        iniciarAutoplayRadarFeatured();
      }
    );
  }


  if (siguiente) {

    siguiente.addEventListener(
      "click",
      function () {

        moverRadarFeatured(
          1
        );

        iniciarAutoplayRadarFeatured();
      }
    );
  }


  track.addEventListener(
    "mouseenter",
    detenerAutoplayRadarFeatured
  );


  track.addEventListener(
    "mouseleave",
    iniciarAutoplayRadarFeatured
  );


  track.addEventListener(
    "touchstart",
    detenerAutoplayRadarFeatured,
    {
      passive: true
    }
  );


  track.addEventListener(
    "touchend",
    function () {

      window.setTimeout(
        iniciarAutoplayRadarFeatured,
        1000
      );
    },
    {
      passive: true
    }
  );


  // ----------------------------------------------------
  // TRACKING PROYECTOS ESCALA
  // ----------------------------------------------------

  track.addEventListener(
    "click",
    function (event) {

      const link =
        event.target.closest(
          "[data-featured-project-link]"
        );


      if (!link) {
        return;
      }


      const proyecto =
        link.getAttribute(
          "data-featured-project-name"
        ) ||
        "proyecto-destacado";


      window.dataLayer.push({
        event:
          "featured_project_click",

        event_category:
          "radar",

        event_action:
          "click",

        event_label:
          formatearTexto(
            proyecto
          ),

        section:
          "radar-inmobiliario",

        description:
          "Cliente Escala"
      });
    }
  );
}


// ======================================================
// 23. CARGAR PROYECTOS GENERALES
// ======================================================

async function cargarProyectosRadar() {

  try {

    const response =
      await fetch(
        RADAR_DATA_URL,
        {
          cache: "no-cache"
        }
      );


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );
    }


    const data =
      await response.json();


    if (!Array.isArray(data)) {

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
      `✅ Radar general cargado: ${radarProyectos.length} proyectos`
    );

  } catch (error) {

    radarProyectos = [];


    console.error(
      "❌ Error cargando proyectos.json:",
      error
    );


    mostrarErrorRadar(
      "No pudimos cargar la información inmobiliaria."
    );
  }
}


// ======================================================
// 24. PREPARAR BUSCADOR RADAR
// ======================================================

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


  if (formulario) {

    formulario.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        buscarZonaRadar();
      }
    );
  }


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


// ======================================================
// 25. BUSCAR RADAR
// ======================================================

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


  if (!radarProyectos.length) {

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

        const campos = [
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


  radarResultados =
    ordenarResultadosRadar(
      radarResultados
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


// ======================================================
// 26. FINALIZAR BÚSQUEDA
// ======================================================

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


// ======================================================
// 27. FILTRAR RESULTADOS
// ======================================================

function obtenerResultadosFiltrados() {

  if (
    radarFiltroActual === "todos" ||
    radarFiltroActual === "proyectos"
  ) {

    return ordenarResultadosRadar(
      radarResultados
    );
  }


  if (
    radarFiltroActual !==
    "inmobiliarias"
  ) {

    return ordenarResultadosRadar(
      radarResultados
    );
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


  return ordenarResultadosRadar(
    Array.from(
      inmobiliarias.values()
    )
  );
}


// ======================================================
// 28. MOSTRAR RESULTADOS
// ======================================================

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

  if (!resultados.length) {

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
  // MOSTRAR RESULTADOS
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


  prepararLinksClientesRadar(
    container
  );


  window.setTimeout(
    iniciarAutoplayRadar,
    350
  );
}


// ======================================================
// 29. CARD RESULTADO PROYECTO
// ======================================================

function crearCardProyectoRadar(
  proyecto,
  index
) {

  const precio =
    formatearPrecioRadar(
      proyecto
    );


  const proyectoEscala =
    obtenerProyectoEscala(
      proyecto
    );


  const esCliente =
    Boolean(
      proyectoEscala
    );


  const urlCliente =
    obtenerUrlProyectoClienteEscala(
      proyecto
    );


  const clases =
    esCliente
      ? "radar-result-card radar-result-client"
      : "radar-result-card";


  return `
    <article
      class="${clases}"
      data-radar-index="${index}"
      data-radar-project-id="${escaparAtributoRadar(
        proyecto.id ||
        ""
      )}"
      data-radar-client="${
        esCliente
          ? "true"
          : "false"
      }"
    >

      <span
        class="radar-result-type"
      >
        ${
          esCliente
            ? "Proyecto destacado"
            : "Proyecto"
        }
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
                ${escaparHTMLRadar(
                  precio
                )}
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


      ${
        esCliente &&
        urlCliente
          ? `
            <a
              href="${escaparAtributoRadar(
                urlCliente
              )}"
              class="radar-result-client-link"
              data-radar-client-link="true"
              data-radar-client-project="${escaparAtributoRadar(
                proyecto.proyecto ||
                ""
              )}"
            >

              Ver proyecto

              <i
                class="fa-solid fa-arrow-right"
                aria-hidden="true"
              ></i>

            </a>
          `
          : ""
      }

    </article>
  `;
}


// ======================================================
// 30. CARD RESULTADO INMOBILIARIA
// ======================================================

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


  const tieneClienteEscala =
    proyectosEmpresa.some(
      esProyectoClienteEscala
    );


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


  const clases =
    tieneClienteEscala
      ? "radar-result-card radar-result-client"
      : "radar-result-card";


  return `
    <article
      class="${clases}"
      data-radar-index="${index}"
      data-radar-client="${
        tieneClienteEscala
          ? "true"
          : "false"
      }"
    >

      <span
        class="radar-result-type"
      >
        ${
          tieneClienteEscala
            ? "Cliente Escala"
            : "Inmobiliaria"
        }
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


// ======================================================
// 31. TRACKING LINKS CLIENTES ESCALA
// ======================================================

function prepararLinksClientesRadar(
  container
) {

  if (!container) {
    return;
  }


  container
    .querySelectorAll(
      "[data-radar-client-link]"
    )
    .forEach(
      function (link) {

        link.addEventListener(
          "click",
          function () {

            const proyecto =
              link.getAttribute(
                "data-radar-client-project"
              ) ||
              "proyecto-cliente";


            window.dataLayer.push({
              event:
                "radar_client_project_click",

              event_category:
                "radar",

              event_action:
                "click",

              event_label:
                formatearTexto(
                  proyecto
                ),

              section:
                "radar-inmobiliario",

              description:
                "Cliente Escala"
            });
          }
        );
      }
    );
}


// ======================================================
// 32. ESTADO RADAR
// ======================================================

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


// ======================================================
// 33. ERROR RADAR
// ======================================================

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


// ======================================================
// 34. CARRUSEL RESULTADOS RADAR
// ======================================================

function detenerAutoplayRadar() {

  if (!radarCarruselIntervalo) {
    return;
  }


  window.clearInterval(
    radarCarruselIntervalo
  );


  radarCarruselIntervalo =
    null;
}


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


  if (paso <= 0) {
    return;
  }


  const maxScroll =
    Math.max(
      0,
      carrusel.scrollWidth -
      carrusel.clientWidth
    );


  if (maxScroll <= 5) {
    return;
  }


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


  carrusel.scrollBy({
    left:
      direccion * paso,

    behavior:
      "smooth"
  });
}


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


  if (cards.length <= 1) {
    return;
  }


  const maxScroll =
    carrusel.scrollWidth -
    carrusel.clientWidth;


  if (maxScroll <= 5) {
    return;
  }


  radarCarruselIntervalo =
    window.setInterval(
      function () {

        if (document.hidden) {
          return;
        }


        moverCarruselRadar(
          1
        );
      },
      RADAR_AUTOPLAY_MS
    );
}


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


  carrusel.addEventListener(
    "mouseenter",
    detenerAutoplayRadar
  );


  carrusel.addEventListener(
    "mouseleave",
    iniciarAutoplayRadar
  );


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


// ======================================================
// 35. INICIALIZAR RADAR
// ======================================================

async function initRadarInmobiliario() {

  const radar =
    document.getElementById(
      "radar-inmobiliario"
    );


  if (!radar) {
    return;
  }


  // ----------------------------------------------------
  // PREPARAR INTERACCIONES
  // ----------------------------------------------------

  prepararRadar();

  prepararCarruselRadar();

  iniciarCarruselRadarFeatured();


  // ----------------------------------------------------
  // CARGAR AMBOS JSON
  // ----------------------------------------------------

  await Promise.all([
    cargarProyectosRadar(),
    cargarProyectosEscalaRadar()
  ]);


  // ----------------------------------------------------
  // UNIFICAR BASE
  // ----------------------------------------------------

  construirBaseRadar();


  console.log(
    `🏢 Base final Radar: ${radarProyectos.length} proyectos`
  );


  console.log(
    `⭐ Clientes Escala activos: ${radarProyectosEscala.length}`
  );


  // ----------------------------------------------------
  // MOSTRAR PROYECTOS ESCALA
  // ----------------------------------------------------

  if (
    radarProyectosEscala.length
  ) {

    renderizarProyectosEscala();

  } else {

    ocultarBloqueProyectosEscala();
  }
}


// ======================================================
// 36. VISIBILIDAD PESTAÑA
// ======================================================

function iniciarControlVisibilidad() {

  document.addEventListener(
    "visibilitychange",
    function () {

      if (document.hidden) {

        detenerAutoplayRadar();

        detenerAutoplayRadarFeatured();

        detenerAutoplayEquipo();

        return;
      }


      iniciarAutoplayEquipo();

      iniciarAutoplayRadarFeatured();


      if (
        radarResultados.length
      ) {

        iniciarAutoplayRadar();
      }
    }
  );
}


// ======================================================
// 37. RESIZE
// ======================================================

function iniciarControlResize() {

  let resizeTimer =
    null;


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

            iniciarAutoplayRadarFeatured();


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
// 38. INICIALIZAR TODO
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
    // GLOBAL
    // --------------------------------------------------

    iniciarControlVisibilidad();

    iniciarControlResize();

  }
);
