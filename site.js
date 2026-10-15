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
      title: 'Resposta e acompanhamento',
      description: 'Resposta a pedidos e contacto com clientes depois do serviço.',
      image: '/assets/produtos-menu/acompanhamento-sms.webp',
      href: '/produtos/acompanhamento-sms/'
    },
    {
      number: '08',
      title: 'Google Search Ads',
      description: 'Anúncios para pesquisas relevantes, depois de preparar a base.',
      image: '/assets/produtos-menu/google-search-ads.svg',
      href: '/produtos/google-search-ads/'
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
      if (formStatus) {
        formStatus.classList.remove('is-error');
        formStatus.textContent = 'Estamos a enviar o seu pedido.';
      }

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

})();

// The story is progressive enhancement. Text and examples are complete in HTML.
// Moving only the decorative figures keeps one source for desktop and mobile.
(() => {
  const story = document.querySelector('[data-cersa-story]');
  if (!story || !('IntersectionObserver' in window)) return;

  const steps = Array.from(story.querySelectorAll('[data-story-step]'));
  const stage = story.querySelector('[data-story-stage]');
  const sceneContainer = story.querySelector('[data-story-scenes]');
  const trails = Array.from(story.querySelectorAll('[data-story-trail]'));
  const desktop = window.matchMedia('(min-width: 1024px) and (min-height: 700px)');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = steps.map((step) => step.querySelector('[data-story-scene]'));
  if (!stage || !sceneContainer || scenes.some((scene) => !scene)) return;

  const anchors = scenes.map((scene) => {
    const anchor = document.createComment('story illustration');
    scene.before(anchor);
    return anchor;
  });
  let observer;
  let enhanced = false;
  let current = -1;

  const activate = (index) => {
    if (index === current) return;
    current = index;
    steps.forEach((step, i) => step.classList.toggle('is-current', i === index));
    scenes.forEach((scene, i) => {
      scene.classList.toggle('is-active', i === index);
      scene.classList.toggle('is-before', i < index);
    });
    trails.forEach((trail, i) => {
      trail.classList.toggle('is-current', i === index);
      trail.classList.toggle('is-reached', i <= index);
    });
    stage.style.setProperty('--story-progress', String(index / (steps.length - 1)));
    stage.dataset.storyActive = steps[index].dataset.storyStep;
  };

  const nearestStep = () => {
    const target = window.innerHeight * .45;
    let nearest = 0;
    let distance = Infinity;
    steps.forEach((step, index) => {
      const bounds = step.getBoundingClientRect();
      const nextDistance = Math.abs(bounds.top + bounds.height / 2 - target);
      if (nextDistance < distance) {
        distance = nextDistance;
        nearest = index;
      }
    });
    activate(nearest);
  };

  const setOffset = () => {
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 64;
    story.style.setProperty('--story-offset', `${Math.ceil(headerHeight + 16)}px`);
  };

  const restore = () => {
    observer?.disconnect();
    observer = undefined;
    enhanced = false;
    stage.hidden = true;
    story.classList.remove('story-enhanced');
    scenes.forEach((scene, i) => {
      anchors[i].after(scene);
      scene.classList.remove('is-active', 'is-before');
      steps[i].classList.remove('is-current');
    });
    current = -1;
  };

  const updateMode = () => {
    if (!desktop.matches || motion.matches) {
      if (enhanced) restore();
      return;
    }
    if (enhanced) {
      setOffset();
      nearestStep();
      return;
    }
    try {
      scenes.forEach((scene) => sceneContainer.append(scene));
      setOffset();
      stage.hidden = false;
      story.classList.add('story-enhanced');
      enhanced = true;
      nearestStep();
      // Select from actual geometry, including fast jumps and reverse scrolling.
      observer = new IntersectionObserver(nearestStep, {
        rootMargin: '-35% 0px -45% 0px',
        threshold: 0
      });
      steps.forEach((step) => observer.observe(step));
    } catch (error) {
      restore();
      console.warn('Cersa story uses its static layout.', error);
    }
  };

  desktop.addEventListener('change', updateMode);
  motion.addEventListener('change', updateMode);
  window.addEventListener('resize', () => {
    if (enhanced) { setOffset(); nearestStep(); }
  }, { passive: true });
  window.addEventListener('pageshow', () => { if (enhanced) nearestStep(); });
  updateMode();
})();

// A short handoff cue in product examples; the illustration is always visible.
(() => {
  const examples = document.querySelectorAll('[data-product-visual]');
  if (!examples.length || !('IntersectionObserver' in window)) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (!motion.matches) entry.target.classList.add('is-shown');
      observer.unobserve(entry.target);
    });
  }, { threshold: .15 });
  examples.forEach((example) => observer.observe(example));
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    examples.forEach((example) => example.classList.remove('is-shown'));
    observer.disconnect();
  });
})();
