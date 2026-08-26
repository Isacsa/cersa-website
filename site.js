(() => {
  const products = [
    {
      number: '01',
      title: 'Website funcional',
      description: 'Uma presença profissional que explica, transmite confiança e facilita o contacto.',
      image: '/assets/produtos-menu/website.webp',
      href: '/produtos/website/'
    },
    {
      number: '02',
      title: 'Recuperação de chamadas',
      description: 'Resposta por SMS ou assistente de voz, conforme a empresa preferir.',
      image: '/assets/produtos-menu/recuperacao-chamadas.webp',
      href: '/produtos/recuperacao-de-chamadas/'
    },
    {
      number: '03',
      title: 'Caixa de entrada única',
      description: 'Facebook, Instagram, SMS e email reunidos no mesmo lugar.',
      image: '/assets/produtos-menu/caixa-entrada.webp',
      href: '/produtos/caixa-de-entrada/'
    },
    {
      number: '04',
      title: 'SEO local',
      description: 'Website e perfil Google tecnicamente preparados para serem encontrados.',
      image: '/assets/produtos-menu/seo-local.webp',
      href: '/produtos/seo-local/'
    },
    {
      number: '05',
      title: 'Reviews no Google',
      description: 'Pedidos simples e consistentes de avaliações reais após o serviço.',
      image: '/assets/produtos-menu/reviews-google.webp',
      href: '/produtos/reviews-google/'
    },
    {
      number: '06',
      title: 'Campanhas por mensagem',
      description: 'Voltar a falar com clientes e contactos que aceitaram receber comunicações.',
      image: '/assets/produtos-menu/campanhas.webp',
      href: '/produtos/campanhas/'
    },
    {
      number: '07',
      title: 'Acompanhamento por SMS',
      description: 'Confirmações e follow-up para pedidos vindos de vários canais.',
      image: '/assets/produtos-menu/acompanhamento-sms.webp',
      href: '/produtos/acompanhamento-sms/'
    }
  ];

  const productMarkup = products.map((product) => `
    <a class="mega-product" href="${product.href}">
      <span class="mega-thumb" aria-hidden="true">
        <img src="${product.image}" alt="" width="240" height="240" decoding="async" />
        <span class="mega-number mono">${product.number}</span>
      </span>
      <span class="mega-copy">
        <strong>${product.title}</strong>
        <small>${product.description}</small>
      </span>
    </a>
  `).join('');

  document.querySelectorAll('[data-products-menu]').forEach((menu) => {
    menu.innerHTML = `
      <div class="mega-heading">
        <span class="mono">Sistemas e funcionalidades</span>
        <a href="/produtos/">Ver todos <span aria-hidden="true">→</span></a>
      </div>
      <div class="mega-grid">${productMarkup}</div>
      <noscript><a href="/produtos/">Ver todos os produtos</a></noscript>
    `;
  });

  const productMenus = Array.from(document.querySelectorAll('[data-products-nav]'));
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

  productMenus.forEach((details) => {
    let closeTimer;
    const menu = details.querySelector('.products-mega');

    details.addEventListener('pointerenter', () => {
      if (!canHover.matches) return;
      window.clearTimeout(closeTimer);
      details.open = true;
    });

    details.addEventListener('pointerleave', () => {
      if (!canHover.matches) return;
      closeTimer = window.setTimeout(() => details.removeAttribute('open'), 160);
    });

    details.addEventListener('toggle', () => {
      menu?.classList.remove('is-entering');
      if (!details.open) return;

      if (menu) {
        void menu.offsetWidth;
        menu.classList.add('is-entering');
      }

      productMenus.forEach((other) => {
        if (other !== details) other.removeAttribute('open');
      });
    });

    details.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => details.removeAttribute('open'));
    });
  });

  document.addEventListener('pointerdown', (event) => {
    productMenus.forEach((details) => {
      if (!details.contains(event.target)) details.removeAttribute('open');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    productMenus.forEach((details) => {
      if (!details.open) return;
      details.removeAttribute('open');
      details.querySelector('summary')?.focus();
    });
  });

  const header = document.querySelector('.site-header');

  if (header && typeof document.elementsFromPoint === 'function') {
    const darkSurfaceSelector = '.dark-section, .sectors-section, .cta-section, .product-cta';
    let headerThemeFrame = 0;

    const updateHeaderTheme = () => {
      headerThemeFrame = 0;

      const headerRect = header.getBoundingClientRect();
      const probeX = Math.max(0, Math.min(window.innerWidth - 1, window.innerWidth / 2));
      const probeY = Math.max(0, Math.min(window.innerHeight - 1, headerRect.top + (headerRect.height / 2)));
      const surfaceUnderHeader = document.elementsFromPoint(probeX, probeY)
        .find((element) => element !== header && !header.contains(element));
      const isOnDarkSurface = Boolean(surfaceUnderHeader?.closest(darkSurfaceSelector));

      header.classList.toggle('is-on-dark', isOnDarkSurface);
    };

    const requestHeaderThemeUpdate = () => {
      if (headerThemeFrame) return;
      headerThemeFrame = window.requestAnimationFrame(updateHeaderTheme);
    };

    window.addEventListener('scroll', requestHeaderThemeUpdate, { passive: true });
    window.addEventListener('resize', requestHeaderThemeUpdate);
    requestHeaderThemeUpdate();
  }

  const contactForm = document.querySelector('form[name="contacto"]');

  if (contactForm) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formStatus = contactForm.querySelector('[data-form-status]');
    let isSubmitting = false;

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (isSubmitting) return;

      isSubmitting = true;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalLabel = submitButton.textContent;
        submitButton.textContent = 'A enviar…';
      }
      if (formStatus) formStatus.textContent = 'Estamos a enviar o seu pedido.';

      const encodedForm = new URLSearchParams();
      new FormData(contactForm).forEach((value, key) => {
        if (typeof value === 'string') encodedForm.append(key, value);
      });

      try {
        const [response] = await Promise.all([
          fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: encodedForm.toString()
          }),
          // O tracking externo envia a submissão em paralelo. Este pequeno
          // intervalo evita que a navegação cancele o pedido ao HighLevel.
          new Promise((resolve) => window.setTimeout(resolve, 1200))
        ]);

        if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);
        window.location.assign('/obrigado.html');
      } catch (error) {
        isSubmitting = false;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.originalLabel || 'Marcar uma conversa';
        }
        if (formStatus) {
          formStatus.textContent = 'Não foi possível enviar. Tente novamente ou ligue para +351 968 170 798.';
          formStatus.classList.add('is-error');
        }
      }
    });
  }

  const revealElements = Array.from(document.querySelectorAll('[data-reveal]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!revealElements.length || reducedMotion || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('reveal-ready');

  revealElements.forEach((element, index) => {
    const delay = Math.min(index % 3, 2) * 70;
    element.style.setProperty('--reveal-delay', `${delay}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -7% 0px'
  });

  revealElements.forEach((element) => observer.observe(element));
})();
