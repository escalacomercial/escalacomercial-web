
// Año automático
document.getElementById("year").textContent =
  new Date().getFullYear();


// Menú móvil
const menuToggle =
  document.getElementById("menu-toggle");

const mobileMenu =
  document.getElementById("mobile-menu");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});


// Cerrar menú al seleccionar una opción
document
  .querySelectorAll("#mobile-menu a")
  .forEach((link) => {

    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });

  });


// Animaciones
AOS.init({
  duration: 700,
  once: true,
  offset: 70
});
