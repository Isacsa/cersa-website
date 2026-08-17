(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Sem animação nenhuma para quem a dispensou. Não é só não animar: é
     garantir que o conteúdo fica visível, porque os reveals começam a
     opacidade zero. */
  if (reduced.matches) return;

  /* ---- Reveals ---------------------------------------------------------
     A direção sai da estrutura em vez de estar marcada no HTML: itens de
     lista sobem em cascata, colunas de grelha entram de lados opostos, o
     resto sobe. Assim o HTML fica limpo e secções novas herdam o
     comportamento sem marcação extra. */

  var STAGGER = 0.075;   // segundos entre irmãos
  var MAX_DELAY = 0.45;  // teto, para listas longas não ficarem à espera

  /* A direção sai da posição real do elemento, não da contagem de colunas
     da grelha: com auto-fit as pistas vazias colapsam e a contagem mente.
     Se houver um irmão na mesma linha, os dois entram de lados opostos;
     caso contrário sobe. */
  function directionOf(el, siblings) {
    if (el.tagName === 'LI') return 'up';

    var r = el.getBoundingClientRect();
    if (!r.width) return 'up';

    var sameRow = siblings.some(function (s) {
      if (s === el) return false;
      var sr = s.getBoundingClientRect();
      return sr.width && Math.abs(sr.top - r.top) < 24 && Math.abs(sr.left - r.left) > 8;
    });
    if (!sameRow) return 'up';

    var parent = el.parentElement.getBoundingClientRect();
    var middle = parent.left + parent.width / 2;
    return (r.left + r.width / 2) < middle ? 'left' : 'right';
  }

  var items = Array.prototype.slice.call(
    document.querySelectorAll('[data-reveal], [data-step]')
  );

  var groups = new Map();
  items.forEach(function (el) {
    var parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });

  function show(el, animate) {
    var siblings = groups.get(el.parentElement) || [el];
    var i = siblings.indexOf(el);

    if (!animate) {
      // Já passou pelo ecrã sem ser visto — mostra sem cerimónia.
      el.style.opacity = '';
      el.style.animation = '';
      return;
    }
    el.style.animation =
      'reveal-' + directionOf(el, siblings) + ' .75s cubic-bezier(.16,.84,.3,1) ' +
      Math.min(i * STAGGER, MAX_DELAY).toFixed(3) + 's both';
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var el = entry.target;
      if (entry.isIntersecting) {
        show(el, true);
      } else if (entry.boundingClientRect.top < 0) {
        /* Ficou acima do ecrã sem nunca ter entrado: acontece com os links
           de âncora do header, que saltam secções inteiras de uma vez. Sem
           isto, o visitante que voltasse a subir encontrava espaços em
           branco. */
        show(el, false);
      } else {
        return;
      }
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

  items.forEach(function (el) {
    // O que já está visível ao carregar não se anima: animar por baixo do
    // olho do visitante lê-se como atraso, não como polimento.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.style.opacity = '0';
    io.observe(el);
  });

  /* ---- Parallax da grelha ----------------------------------------------
     A grelha desloca-se a uma fração da velocidade do scroll. Escreve-se
     uma custom property e o CSS trata do transform, para o trabalho ficar
     no compositor em vez de forçar layout. */

  var FACTOR = 0.15;
  var root = document.documentElement;
  var ticking = false;

  /* O deslocamento dá a volta a cada célula. Sem isto cresce sem limite e,
     ao fim da página, empurra a camada inteira para fora do sítio -- a
     grelha desaparecia de metade do ecrã. Como o padrão se repete, mover
     170px ou 10px é visualmente indistinguível, e assim fica sempre
     coberto. */
  var cell = parseFloat(getComputedStyle(root).getPropertyValue('--grid-cell')) || 160;

  function update() {
    var shift = (window.scrollY * FACTOR) % cell;
    root.style.setProperty('--grid-shift', shift.toFixed(1) + 'px');
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update();
})();
