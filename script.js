(function () {
  var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-reveal], [data-step]'));

  var groups = new Map();
  reveals.forEach(function (el) {
    var parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var siblings = groups.get(el.parentElement) || [el];
      var i = siblings.indexOf(el);
      el.style.animation = 'fadeUp .8s cubic-bezier(.16,.84,.3,1) ' + (i * 0.09).toFixed(2) + 's both';
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

  reveals.forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9) return;
    el.style.opacity = '0';
    io.observe(el);
  });
})();
