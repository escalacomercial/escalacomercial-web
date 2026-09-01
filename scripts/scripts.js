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
