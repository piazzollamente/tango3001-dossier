(() => {
  const nav = document.getElementById('nav');
  const menu = document.querySelector('#menu-toggle');
  if (nav && menu) {
    menu.addEventListener('click', () => {
      const next = !nav.classList.contains('open');
      nav.classList.toggle('open', next);
      menu.setAttribute('aria-expanded', String(next));
      menu.setAttribute('aria-label', next ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        nav.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
      }
    });
  }
  const dialog = document.getElementById('gallery-dialog');
  const image = dialog?.querySelector('img');
  const caption = dialog?.querySelector('.dialog-caption');
  if (dialog && image && caption) {
    document.querySelectorAll('.gallery-photo').forEach((button) => {
      button.addEventListener('click', () => {
        const source = button.querySelector('img');
        const figcaption = button.closest('figure')?.querySelector('figcaption');
        image.src = source.src;
        image.alt = source.alt;
        caption.textContent = figcaption?.innerText?.replace(/\s+/g, ' ') || source.alt;
        dialog.showModal();
      });
    });
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { image.removeAttribute('src'); });
  }
})();
