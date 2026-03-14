/**
 * modal.js
 * Intercepta los clicks en los botones de certificados (.certificate_btn)
 * y muestra el PDF en un modal usando Google Docs Viewer,
 * lo que evita la descarga automática en móviles.
 */

function initPdfModal() {
  /* ── Crear el modal en el DOM ───────────────────────────────────────── */
  const modalHTML = `
    <div id="pdf-modal" class="pdf-modal" role="dialog" aria-modal="true" aria-label="Visor de documento">
      <div class="pdf-modal__overlay" id="pdf-modal-overlay"></div>
      <div class="pdf-modal__content">
        <div class="pdf-modal__header">
          <span class="pdf-modal__title" id="pdf-modal-title">Documento</span>
          <div class="pdf-modal__actions">
            <a id="pdf-modal-direct" class="pdf-modal__open-btn" href="#" target="_blank" rel="noopener">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Abrir
            </a>
            <button class="pdf-modal__close" id="pdf-modal-close" aria-label="Cerrar">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
        <div class="pdf-modal__body">
          <div class="pdf-modal__loading" id="pdf-modal-loading">
            <div class="pdf-modal__spinner"></div>
            <span>Cargando documento…</span>
          </div>
          <iframe
            id="pdf-modal-frame"
            class="pdf-modal__frame"
            src=""
            title="Visor de PDF"
            allow="fullscreen"
          ></iframe>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  /* ── Referencias ────────────────────────────────────────────────────── */
  const modal      = document.getElementById("pdf-modal");
  const frame      = document.getElementById("pdf-modal-frame");
  const titleEl    = document.getElementById("pdf-modal-title");
  const directLink = document.getElementById("pdf-modal-direct");
  const loading    = document.getElementById("pdf-modal-loading");
  const closeBtn   = document.getElementById("pdf-modal-close");
  const overlay    = document.getElementById("pdf-modal-overlay");

  /* ── Construir la URL base del sitio ────────────────────────────────── */
  function buildFullUrl(href) {
    // Si ya es una URL absoluta, la usamos directamente
    if (/^https?:\/\//i.test(href)) return href;

    // Calculamos la raíz del sitio
    const { origin, pathname } = window.location;
    const base = origin + pathname.replace(/\/[^/]*$/, "/");
    return new URL(href, base).href;
  }

  function googleDocsUrl(fullPdfUrl) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fullPdfUrl)}&embedded=true`;
  }

  /* ── Abrir modal ────────────────────────────────────────────────────── */
  function openModal(href, label) {
    const fullUrl    = buildFullUrl(href);
    const viewerUrl  = googleDocsUrl(fullUrl);

    // Actualizar título y enlace directo
    titleEl.textContent = label || "Documento";
    directLink.href     = fullUrl;

    // Mostrar spinner, limpiar frame
    loading.classList.remove("hidden");
    frame.src = "";

    // Mostrar modal
    modal.classList.add("pdf-modal--show");
    document.body.style.overflow = "hidden";

    // Cargar iframe (pequeño delay para que la animación sea visible)
    setTimeout(() => {
      frame.src = viewerUrl;
      frame.onload = () => loading.classList.add("hidden");
    }, 150);
  }

  /* ── Cerrar modal ───────────────────────────────────────────────────── */
  function closeModal() {
    modal.classList.remove("pdf-modal--show");
    document.body.style.overflow = "";
    // Detener la carga del iframe al cerrar
    setTimeout(() => { frame.src = ""; }, 300);
  }

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click",  closeModal);

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("pdf-modal--show")) {
      closeModal();
    }
  });

  /* ── Interceptar clicks en certificados ─────────────────────────────── */
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".certificate_btn");
    if (!btn) return;

    e.preventDefault();

    const href  = btn.getAttribute("href");
    const label = btn.closest(".certificate_card")
                     ?.querySelector(".certificate_title")
                     ?.textContent?.trim() || "Documento";

    openModal(href, label);
  });
}

// Exportar para que sections.js pueda llamarla
window.initPdfModal = initPdfModal;
