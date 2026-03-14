/**
 * sections.js
 * Carga dinámicamente los fragmentos HTML de cada sección
 * desde la carpeta html/ e inicializa AOS y los demás scripts
 * después de que todo el contenido esté en el DOM.
 */

const sections = [
  { id: "section-hero",         file: "html/hero.html" },
  { id: "section-sobre-mi",     file: "html/sobre-mi.html" },
  { id: "section-habilidades",  file: "html/habilidades.html" },
  { id: "section-certificados", file: "html/certificados.html" },
  { id: "section-proyectos",    file: "html/proyectos.html" },
  { id: "section-github",       file: "html/github.html" },
  { id: "section-testimonios",  file: "html/testimonios.html" },
  { id: "section-footer",       file: "html/footer.html" },
];

async function loadSection({ id, file }) {
  const container = document.getElementById(id);
  if (!container) return;
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`No se pudo cargar ${file}`);
    container.innerHTML = await response.text();
  } catch (err) {
    console.error(err);
  }
}

async function loadAllSections() {
  await Promise.all(sections.map(loadSection));

  // ── AOS ────────────────────────────────────────────────────────────────
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }

  // ── Testimonios slider ─────────────────────────────────────────────────
  const sliders     = [...document.querySelectorAll(".testimony_body")];
  const buttonNext  = document.querySelector("#next");
  const buttonBefore = document.querySelector("#before");

  if (buttonNext && buttonBefore && sliders.length) {
    const changePosition = (add) => {
      const current = document.querySelector(".testimony_body--show");
      if (!current) return;
      let value = Number(current.dataset.id) + add;
      current.classList.remove("testimony_body--show");
      if (value > sliders.length) value = 1;
      if (value === 0) value = sliders.length;
      sliders[value - 1].classList.add("testimony_body--show");
    };
    buttonNext.addEventListener("click",   () => changePosition(1));
    buttonBefore.addEventListener("click", () => changePosition(-1));
  }

  // ── Acordeón habilidades ───────────────────────────────────────────────
  const titleQuestions = [...document.querySelectorAll(".questions_title")];
  titleQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const addPadding = question.parentElement.parentElement;
      addPadding.classList.toggle("questions_padding--add");
      question.children[0].classList.toggle("questions_arrow--rotate");
    });
  });

  // ── Menú hamburguesa ───────────────────────────────────────────────────
  const openButton = document.querySelector(".nav_menu");
  const menu       = document.querySelector(".nav_link");
  const closeMenu  = document.querySelector(".nav_close");

  if (openButton && menu && closeMenu) {
    openButton.addEventListener("click", () => menu.classList.add("nav_link--show"));
    closeMenu.addEventListener("click",  () => menu.classList.remove("nav_link--show"));
    document.querySelectorAll(".nav_links").forEach((link) => {
      link.addEventListener("click", () => menu.classList.remove("nav_link--show"));
    });
  }

  // ── Dark mode ──────────────────────────────────────────────────────────
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    const body = document.body;
    const icon = themeToggle.querySelector("i");

    if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark-mode");
      icon.classList.replace("fa-moon", "fa-sun");
    }

    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      const isDark = body.classList.contains("dark-mode");
      icon.classList.replace(isDark ? "fa-moon" : "fa-sun", isDark ? "fa-sun" : "fa-moon");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // ── Evento personalizado (por si otros scripts lo escuchan) ────────────
  document.dispatchEvent(new Event("sectionsLoaded"));
}

loadAllSections();
