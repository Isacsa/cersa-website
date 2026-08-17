(function () {
  'use strict';

  /* Só o parallax da grelha vive aqui. Os reveals são feitos em CSS, com
     animation-timeline: view().

     A regra que isto respeita: JavaScript nunca esconde conteúdo. Se este
     ficheiro não correr, falhar ou vier de uma cache antiga, o pior que
     acontece é a grelha ficar quieta. Nenhum texto desaparece. */

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var FACTOR = 0.15;
  var root = document.documentElement;
  var ticking = false;

  /* O deslocamento dá a volta a cada célula. Sem isto cresce sem limite e,
     ao fim da página, empurra a camada inteira para fora do sítio. Como o
     padrão se repete, mover 170px ou 10px é indistinguível, e assim fica
     sempre coberto. */
  var cell = parseFloat(getComputedStyle(root).getPropertyValue('--grid-cell')) || 160;

  function update() {
    root.style.setProperty('--grid-shift', ((window.scrollY * FACTOR) % cell).toFixed(1) + 'px');
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update();
})();
