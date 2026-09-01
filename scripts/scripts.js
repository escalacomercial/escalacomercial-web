// ======================================================
// ESCALA COMERCIAL
// scripts.js
// ======================================================


// ======================================================
// CONFIGURACIÓN GENERAL
// ======================================================

window.dataLayer = window.dataLayer || [];


// ======================================================
// HELPERS DE TRACKING
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
      actual.hasAttribute("data-section")
    ) {
      return actual.getAttribute(
        "data-section"
      );
    }

    actual =
      actual.parentElement;
  }

  return "otros";
}


// ======================================================
// DOM READY
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {


    // ==================================================
    // AOS
    // ==================================================

    if (
      typeof AOS !== "undefined"
    ) {
      AOS.init({
        duration: 700,
        once: true,
        offset: 70
      });
    }


    // ==================================================
    // AÑO DEL FOOTER
    // ==================================================

    const year =
      document.getElementById(
        "year"
      );

    if (year) {
      year.textContent =
        new Date().getFullYear();
    }


    // ==================================================
    // HEADER: SOMBRA AL HACER SCROLL
    // ==================================================

    const siteHeader =
      document.getElementById(
        "site-header"
      );


    function actualizarHeader() {
      if (!siteHeader) {
        return;
      }

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


    // ==================================================
    // MENÚ MÓVIL
    // ==================================================

    const toggle =
      document.getElementById(
        "menu-toggle"
      );

    const menu =
      document.getElementById(
        "mobile-menu"
      );


    if (
      toggle &&
      menu
    ) {

      toggle.addEventListener(
        "click",
        function () {

          const estaAbierto =
            !menu.classList.contains(
              "hidden"
            );

          menu.classList.toggle(
            "hidden"
          );

          toggle.setAttribute(
            "aria-expanded",
            String(!estaAbierto)
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

    }


    // ==================================================
    // TRACKING GENERAL DE CLICS
    // ==================================================

    document
      .querySelectorAll(
        "a, button"
      )
      .forEach(
        function (el) {

          el.addEventListener(
            "click",
            function () {

              const textoElemento =
                el.innerText ||
                el.getAttribute(
                  "aria-label"
                ) ||
                el.value ||
                "sin-texto";


              const label =
                formatearTexto(
                  textoElemento
                );


              const section =
                detectarSeccion(el);


              window.dataLayer.push({
                event: "interaction",
                event_category: "home",
                event_action: "click",
                event_label: label,
                section: section,
                description: "-"
              });

            }
          );

        }
      );


    // ==================================================
    // CLICS EXTERNOS
    // ==================================================

    document
      .querySelectorAll(
        "a[href]"
      )
      .forEach(
        function (link) {

          link.addEventListener(
            "click",
            function () {

              try {

                const url =
                  new URL(
                    link.href,
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
                    event_label:
                      url.hostname,
                    section:
                      detectarSeccion(
                        link
                      ),
                    description:
                      url.href
                  });

                }

              } catch (error) {

                console.warn(
                  "No se pudo analizar la URL:",
                  link.href
                );

              }

            }
          );

        }
      );


    // ==================================================
    // SERVICIOS POR CATEGORÍAS
    // ==================================================

    const serviceTabs =
      document.querySelectorAll(
        "[data-service-tab]"
      );

    const servicePanels =
      document.querySelectorAll(
        "[data-service-panel]"
      );


    if (
      serviceTabs.length &&
      servicePanels.length
    ) {

      serviceTabs.forEach(
        function (tab) {

          tab.addEventListener(
            "click",
            function () {

              const target =
                tab.getAttribute(
                  "data-service-tab"
                );


              // ------------------------------
              // Desactivar categorías
              // ------------------------------

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


              // ------------------------------
              // Activar categoría
              // ------------------------------

              tab.classList.add(
                "service-tab-active"
              );

              tab.setAttribute(
                "aria-selected",
                "true"
              );


              // ------------------------------
              // Ocultar paneles
              // ------------------------------

              servicePanels.forEach(
                function (panel) {

                  panel.classList.add(
                    "hidden"
                  );

                }
              );


              // ------------------------------
              // Mostrar panel
              // ------------------------------

              const activePanel =
                document.querySelector(
                  `[data-service-panel="${target}"]`
                );


              if (activePanel) {

                activePanel.classList.remove(
                  "hidden"
                );

              }


              // ------------------------------
              // Tracking
              // ------------------------------

              window.dataLayer.push({
                event:
                  "service_category_view",
                event_category:
                  "home",
                event_action:
                  "click",
                event_label:
                  target,
                section:
                  "servicios",
                description:
                  "Cambio de categoría de servicios"
              });

            }
          );

        }
      );

    }


    // ==================================================
    // MODELO ESCALA / RUTA COMERCIAL
    // ==================================================

    const soluciones = {


      // ------------------------------------------------
      // 01 - DIRECCIÓN COMERCIAL
      // ------------------------------------------------

      estrategia: {

        number:
          "01 / 06",

        title:
          "Dirección comercial",

        description:
          "Definimos objetivos, prioridades, procesos e indicadores para que toda la operación comercial avance con una misma dirección.",

        tools: [
          "Objetivos comerciales",
          "KPIs",
          "Procesos"
        ],

        icon:
          "fa-compass"

      },


      // ------------------------------------------------
      // 02 - GENERACIÓN DE DEMANDA
      // ------------------------------------------------

      marketing: {

        number:
          "02 / 06",

        title:
          "Generación de demanda",

        description:
          "Conectamos estrategia, campañas y canales de adquisición para generar oportunidades alineadas con los objetivos comerciales.",

        tools: [
          "Meta Ads",
          "Google Ads",
          "Leads"
        ],

        icon:
          "fa-bullhorn"

      },


      // ------------------------------------------------
      // 03 - GESTIÓN COMERCIAL
      // ------------------------------------------------

      procesos: {

        number:
          "03 / 06",

        title:
          "Gestión comercial",

        description:
          "Ordenamos etapas, responsables, tiempos de atención y flujos de trabajo para mantener cada oportunidad avanzando dentro del proceso comercial.",

        tools: [
          "CRM",
          "Pipeline",
          "SLA"
        ],

        icon:
          "fa-diagram-project"

      },


      // ------------------------------------------------
      // 04 - VENTAS Y CIERRE
      // ------------------------------------------------

      ventas: {

        number:
          "04 / 06",

        title:
          "Ventas y cierre",

        description:
          "Gestionamos seguimiento, negociación y cierre para convertir oportunidades en resultados comerciales y mejorar la conversión.",

        tools: [
          "Seguimiento",
          "Outsourcing",
          "Cierre"
        ],

        icon:
          "fa-handshake"

      },


      // ------------------------------------------------
      // 05 - INTELIGENCIA COMERCIAL
      // ------------------------------------------------

      analitica: {

        number:
          "05 / 06",

        title:
          "Inteligencia comercial",

        description:
          "Convertimos los datos de marketing y ventas en indicadores claros para entender el rendimiento de la operación y detectar oportunidades.",

        tools: [
          "Dashboards",
          "GA4",
          "Looker Studio"
        ],

        icon:
          "fa-chart-column"

      },


      // ------------------------------------------------
      // 06 - OPTIMIZACIÓN CONTINUA
      // ------------------------------------------------

      optimizacion: {

        number:
          "06 / 06",

        title:
          "Optimización continua",

        description:
          "Analizamos resultados, identificamos fugas y priorizamos mejoras para aumentar eficiencia, productividad y conversión de manera continua.",

        tools: [
          "Optimización",
          "Automatización",
          "Mejora continua"
        ],

        icon:
          "fa-arrows-rotate"

      }

    };


    // ==================================================
    // ELEMENTOS MODELO - DESKTOP
    // ==================================================

    const numberDesktop =
      document.getElementById(
        "solution-number"
      );

    const titleDesktop =
      document.getElementById(
        "solution-title"
      );

    const descriptionDesktop =
      document.getElementById(
        "solution-description"
      );

    const toolsDesktop =
      document.getElementById(
        "solution-tools"
      );


    // ==================================================
    // ELEMENTOS MODELO - MOBILE
    // ==================================================

    const numberMobile =
      document.getElementById(
        "solution-number-mobile"
      );

    const titleMobile =
      document.getElementById(
        "solution-title-mobile"
      );

    const descriptionMobile =
      document.getElementById(
        "solution-description-mobile"
      );

    const toolsMobile =
      document.getElementById(
        "solution-tools-mobile"
      );


    // ==================================================
    // SELECTORES MODELO
    // ==================================================

    const journeySteps =
      document.querySelectorAll(
        ".journey-step[data-solution]"
      );

    const journeyMobileTabs =
      document.querySelectorAll(
        ".journey-mobile-tab[data-solution]"
      );


    // ==================================================
    // CREAR TAGS
    // ==================================================

    function crearHerramientas(lista) {

      return lista
        .map(
          function (tool) {

            return `
              <span class="journey-tool">
                ${tool}
              </span>
            `;

          }
        )
        .join("");

    }


    // ==================================================
    // ANIMAR CAMBIO DE PANEL
    // ==================================================

    function animarCambioModelo() {

      const elementos =
        [
          numberDesktop,
          titleDesktop,
          descriptionDesktop,
          toolsDesktop,
          numberMobile,
          titleMobile,
          descriptionMobile,
          toolsMobile
        ].filter(Boolean);


      elementos.forEach(
        function (elemento) {

          elemento.classList.add(
            "journey-changing"
          );

        }
      );


      window.setTimeout(
        function () {

          elementos.forEach(
            function (elemento) {

              elemento.classList.remove(
                "journey-changing"
              );

            }
          );

        },
        180
      );

    }


    // ==================================================
    // ACTUALIZAR MODELO
    // ==================================================

    function actualizarSolucion(
      tipo,
      registrarEvento = true
    ) {

      const solucion =
        soluciones[tipo];


      if (!solucion) {
        return;
      }


      animarCambioModelo();


      // ------------------------------------------------
      // Desktop
      // ------------------------------------------------

      if (numberDesktop) {
        numberDesktop.textContent =
          solucion.number;
      }


      if (titleDesktop) {
        titleDesktop.textContent =
          solucion.title;
      }


      if (descriptionDesktop) {
        descriptionDesktop.textContent =
          solucion.description;
      }


      if (toolsDesktop) {
        toolsDesktop.innerHTML =
          crearHerramientas(
            solucion.tools
          );
      }


      // ------------------------------------------------
      // Mobile
      // ------------------------------------------------

      if (numberMobile) {
        numberMobile.textContent =
          solucion.number;
      }


      if (titleMobile) {
        titleMobile.textContent =
          solucion.title;
      }


      if (descriptionMobile) {
        descriptionMobile.textContent =
          solucion.description;
      }


      if (toolsMobile) {
        toolsMobile.innerHTML =
          crearHerramientas(
            solucion.tools
          );
      }


      // ------------------------------------------------
      // Estado activo desktop
      // ------------------------------------------------

      journeySteps.forEach(
        function (trigger) {

          const activo =
            trigger.dataset.solution ===
            tipo;


          trigger.classList.toggle(
            "journey-step-active",
            activo
          );


          trigger.setAttribute(
            "aria-pressed",
            String(activo)
          );

        }
      );


      // ------------------------------------------------
      // Estado activo mobile
      // ------------------------------------------------

      journeyMobileTabs.forEach(
        function (trigger) {

          const activo =
            trigger.dataset.solution ===
            tipo;


          trigger.classList.toggle(
            "journey-mobile-tab-active",
            activo
          );


          trigger.setAttribute(
            "aria-selected",
            String(activo)
          );

        }
      );


      // ------------------------------------------------
      // Tracking
      // ------------------------------------------------

      if (registrarEvento) {

        window.dataLayer.push({
          event:
            "solution_view",
          event_category:
            "home",
          event_action:
            "click",
          event_label:
            tipo,
          section:
            "modelo",
          description:
            solucion.title
        });

      }

    }


    // ==================================================
    // LISTENERS MODELO DESKTOP
    // ==================================================

    journeySteps.forEach(
      function (trigger) {

        trigger.addEventListener(
          "click",
          function () {

            const tipo =
              trigger.dataset.solution;


            actualizarSolucion(
              tipo
            );

          }
        );

      }
    );


    // ==================================================
    // LISTENERS MODELO MOBILE
    // ==================================================

    journeyMobileTabs.forEach(
      function (trigger) {

        trigger.addEventListener(
          "click",
          function () {

            const tipo =
              trigger.dataset.solution;


            actualizarSolucion(
              tipo
            );


            // Mantener tab seleccionado visible
            trigger.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center"
            });

          }
        );

      }
    );


    // ==================================================
    // ESTADO INICIAL MODELO
    // ==================================================

    actualizarSolucion(
      "estrategia",
      false
    );


    // ==================================================
    // FORMULARIO
    // ==================================================

    const formulario =
      document.getElementById(
        "formulario-contacto"
      );

    const toastExito =
      document.getElementById(
        "toast-exito"
      );


    if (formulario) {

      formulario.addEventListener(
        "submit",
        async function (e) {

          e.preventDefault();


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
            datos.get(
              "empresa"
            ) || "-";


          const preferenciaContacto =
            datos.get(
              "preferencia_contacto"
            ) || "-";


          const asunto =
            datos.get(
              "asunto"
            ) || "-";


          try {

            // ----------------------------------------
            // Estado enviando
            // ----------------------------------------

            if (boton) {

              boton.disabled =
                true;


              boton.innerHTML = `
                <i
                  class="fa-solid fa-circle-notch fa-spin">
                </i>

                Enviando...
              `;

            }


            // ----------------------------------------
            // Envío Formspree
            // ----------------------------------------

            const respuesta =
              await fetch(
                formulario.action,
                {
                  method:
                    "POST",

                  body:
                    datos,

                  headers: {
                    Accept:
                      "application/json"
                  }
                }
              );


            if (!respuesta.ok) {

              throw new Error(
                "Formspree devolvió un error"
              );

            }


            // ----------------------------------------
            // Conversión GTM
            // ----------------------------------------

            window.dataLayer.push({
              event:
                "form_submitted",
              event_category:
                "home",
              event_action:
                "submit",
              event_label:
                "formulario-contacto",
              section:
                "contacto",
              description:
                `Empresa: ${empresa} | Contacto preferido: ${preferenciaContacto} | Asunto: ${asunto}`
            });


            // ----------------------------------------
            // Limpiar formulario
            // ----------------------------------------

            formulario.reset();


            // ----------------------------------------
            // Toast éxito
            // ----------------------------------------

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

              boton.disabled =
                false;


              boton.innerHTML =
                textoOriginal;

            }

          }

        }
      );

    }


    // ==================================================
    // TOAST
    // ==================================================

    function mostrarToast(
      mensaje,
      tipo
    ) {

      if (!toastExito) {
        return;
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


      window.setTimeout(
        function () {

          toastExito.classList.add(
            "hidden"
          );

        },
        4000
      );

    }

  }
);


// ======================================================
// SCROLL DEPTH
// ======================================================

const scrollMarcado = {
  25: false,
  50: false,
  75: false,
  100: false
};


window.addEventListener(
  "scroll",
  function () {

    const altoDocumento =
      document.documentElement
        .scrollHeight -
      window.innerHeight;


    if (
      altoDocumento <= 0
    ) {
      return;
    }


    const porcentaje =
      Math.floor(
        (
          window.scrollY /
          altoDocumento
        ) * 100
      );


    [
      25,
      50,
      75,
      100
    ].forEach(
      function (nivel) {

        if (
          porcentaje >= nivel &&
          !scrollMarcado[nivel]
        ) {

          scrollMarcado[nivel] =
            true;


          let descripcion =
            "-";


          if (
            nivel === 25
          ) {

            descripcion =
              "inicio de desplazamiento";

          } else if (
            nivel === 50
          ) {

            descripcion =
              "mitad de página";

          } else if (
            nivel === 75
          ) {

            descripcion =
              "casi al final";

          } else if (
            nivel === 100
          ) {

            descripcion =
              "llegó al footer";

          }


          window.dataLayer.push({
            event:
              "scroll_depth",
            event_category:
              "home",
            event_action:
              "scroll",
            event_label:
              `${nivel}%`,
            section:
              nivel === 100
                ? "footer"
                : "-",
            description:
              descripcion
          });

        }

      }
    );

  },
  {
    passive: true
  }
);


// ======================================================
// TIEMPO EN SITIO
// ======================================================

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
          event:
            "time_on_site",
          event_category:
            "home",
          event_action:
            "tiempo",
          event_label:
            `${segundos}s`,
          section:
            "-",
          description:
            "-"
        });

      },
      segundos * 1000
    );

  }
);

// ======================================================
// RADAR INMOBILIARIO
// ======================================================

let radarCarruselIntervalo = null;

const RADAR_AUTOPLAY_MS = 4500;

let radarProyectos = [];

let radarResultados = [];

let radarFiltroActual = "todos";


// ======================================================
// INICIALIZAR RADAR
// ======================================================

async function initRadarInmobiliario() {

  prepararRadar();

  prepararCarruselRadar();

  await cargarProyectosRadar();

}


// ======================================================
// CARGAR BASE DE PROYECTOS
// ======================================================

async function cargarProyectosRadar() {

  try {

    const response =
      await fetch(
        "/data/proyectos.json"
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
        "El archivo proyectos.json no contiene un array."
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


// ======================================================
// PREPARAR INTERACCIÓN
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


  // Formulario

  if (formulario) {

    formulario.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        buscarZonaRadar();

      }
    );

  }


  // Filtros

  filtros.forEach(
    function (boton) {

      boton.addEventListener(
        "click",
        function () {

          radarFiltroActual =
            boton.dataset.radarFilter;


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


          mostrarResultadosRadar();

        }
      );

    }
  );


  // Sugerencias

  sugerencias.forEach(
    function (boton) {

      boton.addEventListener(
        "click",
        function () {

          const consulta =
            boton.dataset.radarQuery;


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
// PREPARAR CARRUSEL
// ======================================================

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


  const shell =
    document.getElementById(
      "radar-carousel-shell"
    );


  if (
    !carrusel ||
    !anterior ||
    !siguiente
  ) {
    return;
  }


  function obtenerPaso() {

    const card =
      carrusel.querySelector(
        ".radar-result-card"
      );


    return card
      ? card.getBoundingClientRect().width + 16
      : 320;

  }


  function moverCarrusel(
    direccion
  ) {

    const paso =
      obtenerPaso();


    const maxScroll =
      carrusel.scrollWidth -
      carrusel.clientWidth;


    if (
      direccion > 0
      &&
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
      direccion < 0
      &&
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


  function detenerAutoplay() {

    if (
      radarCarruselIntervalo
    ) {

      clearInterval(
        radarCarruselIntervalo
      );


      radarCarruselIntervalo =
        null;

    }

  }


  function iniciarAutoplay() {

    detenerAutoplay();


    radarCarruselIntervalo =
      setInterval(
        function () {

          if (
            !document.hidden
          ) {

            moverCarrusel(
              1
            );

          }

        },
        RADAR_AUTOPLAY_MS
      );

  }


  anterior.addEventListener(
    "click",
    function () {

      moverCarrusel(
        -1
      );


      iniciarAutoplay();

    }
  );


  siguiente.addEventListener(
    "click",
    function () {

      moverCarrusel(
        1
      );


      iniciarAutoplay();

    }
  );


  if (shell) {

    shell.addEventListener(
      "mouseenter",
      detenerAutoplay
    );


    shell.addEventListener(
      "mouseleave",
      iniciarAutoplay
    );


    shell.addEventListener(
      "touchstart",
      detenerAutoplay,
      {
        passive: true
      }
    );


    shell.addEventListener(
      "touchend",
      iniciarAutoplay,
      {
        passive: true
      }
    );

  }


  document.addEventListener(
    "visibilitychange",
    function () {

      if (
        document.hidden
      ) {

        detenerAutoplay();

      } else {

        iniciarAutoplay();

      }

    }
  );


  iniciarAutoplay();

}

// ======================================================
// NORMALIZAR TEXTO
// ======================================================

function normalizarRadar(
  texto
) {

  return String(
    texto || ""
  )
    .normalize(
      "NFD"
    )
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


// ======================================================
// BUSCAR
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
    return;
  }


  mostrarEstadoRadar(
    true
  );


  const consultaNormalizada =
    normalizarRadar(
      consulta
    );


  radarResultados =
    radarProyectos.filter(
      function (proyecto) {

        const proyectoTexto =
          normalizarRadar(
            proyecto.proyecto
          );

        const inmobiliariaTexto =
          normalizarRadar(
            proyecto.inmobiliaria
          );

        const distritoTexto =
          normalizarRadar(
            proyecto.distrito
          );

        const zonaTexto =
          normalizarRadar(
            proyecto.zona
          );

        const direccionTexto =
          normalizarRadar(
            proyecto.direccion
          );


        return (
          proyectoTexto.includes(
            consultaNormalizada
          )
          ||
          inmobiliariaTexto.includes(
            consultaNormalizada
          )
          ||
          distritoTexto.includes(
            consultaNormalizada
          )
          ||
          zonaTexto.includes(
            consultaNormalizada
          )
          ||
          direccionTexto.includes(
            consultaNormalizada
          )
        );

      }
    );


  finalizarBusquedaRadar(
    consulta
  );

}


// ======================================================
// FINALIZAR BÚSQUEDA
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
// FILTRAR RESULTADOS
// ======================================================

function obtenerResultadosFiltrados() {

  if (
    radarFiltroActual ===
    "todos"
  ) {

    return radarResultados;

  }


  if (
    radarFiltroActual ===
    "proyectos"
  ) {

    return radarResultados;

  }


  if (
    radarFiltroActual ===
    "inmobiliarias"
  ) {

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


  return radarResultados;

}


// ======================================================
// MOSTRAR RESULTADOS
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


  const resultados =
    obtenerResultadosFiltrados();


  // Contador

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


  // Sin resultados

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


  // Crear tarjetas

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


  // Volver al inicio del carrusel

  container.scrollTo({
    left: 0,
    behavior: "smooth"
  });

}


// ======================================================
// CARD DE PROYECTO
// ======================================================

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


// ======================================================
// CARD DE INMOBILIARIA
// ======================================================

function crearCardInmobiliariaRadar(
  proyecto,
  index
) {

  const nombre =
    proyecto.inmobiliaria ||
    "Inmobiliaria";


  const proyectosEmpresa =
    radarResultados.filter(
      function (item) {

        return (
          normalizarRadar(
            item.inmobiliaria
          )
          ===
          normalizarRadar(
            nombre
          )
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
              class="radar-result-address"
              style="margin-top: 0.55rem;"
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
// FORMATEAR PEN
// ======================================================

function formatearPENRadar(
  valor
) {

  const numero =
    Number(
      valor
    );


  if (
    !Number.isFinite(
      numero
    )
  ) {

    return "";

  }


  return new Intl.NumberFormat(
    "es-PE",
    {
      style:
        "currency",

      currency:
        "PEN",

      maximumFractionDigits:
        0
    }
  ).format(
    numero
  );

}


// ======================================================
// FORMATEAR USD
// ======================================================

function formatearUSDRadar(
  valor
) {

  const numero =
    Number(
      valor
    );


  if (
    !Number.isFinite(
      numero
    )
  ) {

    return "";

  }


  return (
    "US$ " +
    numero.toLocaleString(
      "es-PE",
      {
        maximumFractionDigits:
          0
      }
    )
  );

}


// ======================================================
// PRECIO DEL PROYECTO
// ======================================================

function formatearPrecioRadar(
  proyecto
) {

  const precioPEN =
    Number(
      proyecto.precioDesdePEN
    );


  if (
    Number.isFinite(precioPEN)
    &&
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
    Number.isFinite(precioUSD)
    &&
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
// ESCAPAR HTML
// ======================================================

function escaparHTMLRadar(
  texto
) {

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


// ======================================================
// ESTADO CARGANDO
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
// ERROR
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
// ARRANCAR
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    initRadarInmobiliario();

  }
);
