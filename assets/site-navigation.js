(() => {
  const primaryLinks = [
    ['Home', '/'],
    ['Trayectoria', '/trayectoria/'],
    ['Prensa y difusión', '/prensa-y-difusion/'],
    ['Las 4 Estaciones', '/las4estaciones/'],
    ['Tango para el 3001', '/tangoparael3001/'],
    ['Dirección artística', '/direccion-artistica/']
  ];

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
      if (url.pathname === '/') return '/';
      return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
    } catch (_) {
      return '';
    }
  };

  const syncPrimaryNavigation = () => {
    const currentPath = normalizePath(window.location.pathname);
    document.querySelectorAll('.unified-nav .nav-primary').forEach((primary) => {
      primary.innerHTML = '';
      primaryLinks.forEach(([label, href]) => {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = label;
        if (normalizePath(href) === currentPath) link.setAttribute('aria-current', 'page');
        primary.appendChild(link);
      });
    });
  };

  const improvePressSpecializedCards = () => {
    if (!document.querySelector('.press-specialized')) return;
    if (document.getElementById('press-specialized-contrast-fix')) return;

    const style = document.createElement('style');
    style.id = 'press-specialized-contrast-fix';
    style.textContent = `
      .press-specialized{
        background:#f5ede0!important;
      }
      .press-specialized-grid{
        gap:18px!important;
      }
      .press-specialized-card{
        position:relative!important;
        overflow:hidden!important;
        min-height:250px!important;
        padding:31px 32px 30px!important;
        border:1px solid rgba(127,33,28,.16)!important;
        border-radius:24px!important;
        background:linear-gradient(145deg,#fffaf3 0%,#f3e7d8 100%)!important;
        color:#211915!important;
        box-shadow:0 16px 44px rgba(60,40,28,.08)!important;
      }
      .press-specialized-card:nth-child(2),
      .press-specialized-card:nth-child(3){
        background:linear-gradient(145deg,#fbf4ea 0%,#eadbca 100%)!important;
      }
      .press-specialized-card::before{
        content:"";
        position:absolute;
        top:0;
        left:0;
        right:0;
        height:4px;
        background:linear-gradient(90deg,#7f211c 0%,#b5352a 52%,#d0ad72 100%);
      }
      .press-specialized-card .year{
        color:#8c2b27!important;
        font-size:9px!important;
        font-weight:600!important;
        letter-spacing:.17em!important;
      }
      .press-specialized-card h3{
        color:#241b17!important;
        margin:15px 0 13px!important;
        font-size:clamp(31px,3.4vw,46px)!important;
        line-height:.96!important;
      }
      .press-specialized-card p{
        color:#675a53!important;
        font-size:13.5px!important;
        line-height:1.7!important;
      }
      .press-specialized-links{
        padding-top:17px!important;
        border-top:1px solid rgba(127,33,28,.12)!important;
      }
      .press-specialized-links a{
        color:#7f211c!important;
        font-weight:600!important;
      }
      .press-specialized-links a::after{
        content:"";
        display:inline-block;
        width:18px;
        height:1px;
        margin-left:7px;
        vertical-align:middle;
        background:rgba(127,33,28,.45);
      }
      @media(max-width:680px){
        .press-specialized-card{
          min-height:0!important;
          padding:27px 24px 25px!important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const enhanceNavigation = () => {
    syncPrimaryNavigation();
    improvePressSpecializedCards();

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
