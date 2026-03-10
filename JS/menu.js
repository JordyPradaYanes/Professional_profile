(function () {
  const openButton = document.querySelector(".nav_menu");
  const menu = document.querySelector(".nav_link");
  const closeMenu = document.querySelector(".nav_close");

  openButton.addEventListener("click", () => {
    menu.classList.add("nav_link--show");
  });

  closeMenu.addEventListener("click", () => {
    menu.classList.remove("nav_link--show");
  });

  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav_links");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("nav_link--show");
    });
  });
})();
