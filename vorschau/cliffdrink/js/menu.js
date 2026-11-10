(function () {
  var root = document.documentElement;
  var head = document.querySelector('.site-head');
  var btn = document.querySelector('.nav-toggle');
  var menu = document.getElementById('mnav');
  if (!head || !btn || !menu) return;

  var mobile = window.matchMedia('(max-width: 600px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var links = Array.prototype.slice.call(menu.querySelectorAll('a'));
  var outside = Array.prototype.slice.call(document.querySelectorAll('main, footer'));
  var isOpen = false;
  var savedY = 0;

  function syncScrolled() {
    if (isOpen) return;
    head.classList.toggle('is-scrolled', (window.scrollY || window.pageYOffset) > 24);
  }

  function jumpTo(y) {
    var prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, y);
    root.style.scrollBehavior = prev;
  }

  function lockScroll() {
    savedY = window.scrollY || window.pageYOffset;
    var b = document.body.style;
    b.position = 'fixed';
    b.top = -savedY + 'px';
    b.left = '0';
    b.right = '0';
    b.width = '100%';
    root.classList.add('menu-open');
  }

  function unlockScroll() {
    var b = document.body.style;
    b.position = b.top = b.left = b.right = b.width = '';
    root.classList.remove('menu-open');
    jumpTo(savedY);
  }

  function setInert(on) {
    outside.forEach(function (el) {
      if (on) el.setAttribute('inert', '');
      else el.removeAttribute('inert');
    });
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    lockScroll();
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Menü schliessen');
    menu.classList.add('is-open');
    setInert(true);
    if (links[0]) links[0].focus({ preventScroll: true });
  }

  function close(returnFocus) {
    if (!isOpen) return;
    isOpen = false;
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Menü öffnen');
    setInert(false);
    unlockScroll();
    syncScrolled();
    if (returnFocus) btn.focus({ preventScroll: true });
  }

  btn.addEventListener('click', function () {
    if (isOpen) close(true);
    else open();
  });

  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = (a.getAttribute('href') || '').slice(1);
      var target = id && document.getElementById(id);
      if (!target) return close(false);
      e.preventDefault();
      close(false);
      target.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
      if (history.replaceState) history.replaceState(null, '', '#' + id);
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  // Tippen neben die Links schliesst das Menü
  menu.addEventListener('click', function (e) {
    if (!e.target.closest('a')) close(true);
  });

  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      close(true);
      return;
    }
    if (e.key !== 'Tab') return;
    var items = [btn].concat(links);
    var i = items.indexOf(document.activeElement);
    var next = e.shiftKey ? i - 1 : i + 1;
    if (next < 0) next = items.length - 1;
    if (next >= items.length || i === -1) next = e.shiftKey ? items.length - 1 : 0;
    e.preventDefault();
    items[next].focus();
  });

  function onMq() {
    if (!mobile.matches) close(false);
  }
  if (mobile.addEventListener) mobile.addEventListener('change', onMq);
  else if (mobile.addListener) mobile.addListener(onMq);

  window.addEventListener('scroll', syncScrolled, { passive: true });
  syncScrolled();
})();
