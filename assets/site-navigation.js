(() => {
  const menus = {
    '/trayectoria/': {
      label: 'Trayectoria',
      links: [
        ['Trayectoria artística', '/trayectoria/'],
        ['Registro histórico', '/registro-historico/']
      ]
    },
    '/las4estaciones/': {
      label: 'Las 4 Estaciones',
      links: [
        ['Concepto', '/las4estaciones/#concepto'],
        ['Quinteto', '/las4estaciones/#quinteto'],
        ['Repertorio', '/las4estaciones/#repertorio'],
        ['En vivo', '/las4estaciones/#envivo']
      ]
    },
    '/tangoparael3001/': {
      label: 'Tango para el 3001',
      links: [
        ['Sinopsis', '/tangoparael3001/#sinopsis'],
        ['Programa', '/tangoparael3001/#programa'],
        ['Videos', '/tangoparael3001/#videos']
      ]
    }
  };

  const normalizePath = (href) => {
    try {
      const url = new URL(href, window.location.origin);
      return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
    } catch (_) {
      return '';
    }
  };

  const enhanceNavigation = () => {
    document.querySelectorAll('.unified-nav .nav-primary').forEach((primary, navIndex) => {
      if (primary.dataset.submenusReady === 'true') return;
      primary.dataset.submenusReady = 'true';

      Array.from(primary.children).forEach((child) => {
        if (!(child instanceof HTMLAnchorElement)) return;
        const path = normalizePath(child.getAttribute('href') || '');
        const config = menus[path];
        if (!config) return;

        const item = document.createElement('div');
        item.className = 'nav-item nav-item-has-submenu';

        const row = document.createElement('div');
        row.className = 'nav-item-row';

        const toggle = document.createElement('button');
        toggle.className = 'nav-submenu-toggle';
        toggle.type = 'button';
        const submenuKey = path.includes('trayectoria') ? 'trayectoria' : (path.includes('las4') ? 'las4' : 'tango');
        const submenuId = `nav-submenu-${navIndex}-${submenuKey}`;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', submenuId);
        toggle.setAttribute('aria-label', `Mostrar submenú de ${config.label}`);
        toggle.innerHTML = '<span aria-hidden="true">⌄</span>';

        const submenu = document.createElement('div');
        submenu.className = 'nav-submenu';
        submenu.id = submenuId;
        config.links.forEach(([label, href]) => {
          const link = document.createElement('a');
          link.href = href;
          link.textContent = label;
          submenu.appendChild(link);
        });

        primary.insertBefore(item, child);
        row.appendChild(child);
        row.appendChild(toggle);
        item.appendChild(row);
        item.appendChild(submenu);

        toggle.addEventListener('click', () => {
          const willOpen = !item.classList.contains('submenu-open');
          primary.querySelectorAll('.nav-item.submenu-open').forEach((other) => {
            if (other !== item) {
              other.classList.remove('submenu-open');
              const otherToggle = other.querySelector('.nav-submenu-toggle');
              if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
            }
          });
          item.classList.toggle('submenu-open', willOpen);
          toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
          toggle.setAttribute('aria-label', `${willOpen ? 'Ocultar' : 'Mostrar'} submenú de ${config.label}`);
        });
      });
    });

    document.querySelectorAll('.unified-nav .nav-submenu a').forEach((link) => {
      link.addEventListener('click', () => {
        const nav = link.closest('.unified-nav');
        if (!nav) return;
        nav.classList.remove('open', 'menu-open', 'mobile-open');
        const mainToggle = nav.querySelector('.menu-toggle, .mobile-menu-toggle');
        if (mainToggle) mainToggle.setAttribute('aria-expanded', 'false');
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceNavigation, { once: true });
  } else {
    enhanceNavigation();
  }
})();
