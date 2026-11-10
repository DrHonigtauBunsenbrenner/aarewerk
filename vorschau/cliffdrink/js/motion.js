(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function syncReduce() {
    root.classList.toggle('reduced-motion', reduce.matches);
  }
  syncReduce();
  if (reduce.addEventListener) reduce.addEventListener('change', syncReduce);
  else if (reduce.addListener) reduce.addListener(syncReduce);

  var mobile = window.matchMedia('(max-width: 600px)');
  var hero = document.querySelector('.hero');
  var heroBg = document.querySelector('.hero-bg');
  if (hero) {
    requestAnimationFrame(function () {
      hero.classList.add('is-ready');
    });
  }

  var reveals = document.querySelectorAll('.reveal');
  if (!reduce.matches && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add('is-in');
    });
  }

  var timeline = document.getElementById('timeline');
  var progress = timeline && timeline.querySelector('.timeline-progress');
  var tip = timeline && timeline.querySelector('.timeline-tip');
  var items = timeline
    ? Array.prototype.slice.call(timeline.querySelectorAll('.tl-item'))
    : [];
  var ticking = false;
  var parallaxReady = false;
  var litOnce = {};
  var syncLog = [];
  var NEAR = 40;
  window.__cliffTimelineLog = syncLog;

  function measureDots(tRect) {
    return items.map(function (item, i) {
      var dot = item.querySelector('.tl-dot');
      var r = (dot || item).getBoundingClientRect();
      var offset = r.top - tRect.top + r.height / 2;
      return {
        item: item,
        index: i,
        offset: Math.max(0, offset),
        title: ((item.querySelector('h3') || {}).textContent || '').trim(),
      };
    });
  }

  function update() {
    ticking = false;
    var scrollY = window.scrollY || window.pageYOffset;
    var vh = window.innerHeight || 1;

    if (parallaxReady && heroBg && hero && !reduce.matches) {
      if (mobile.matches) {
        heroBg.style.transform = 'none';
      } else {
        var heroH = hero.offsetHeight || 1;
        var y = Math.min(Math.max(scrollY, 0), heroH) * 0.28;
        heroBg.style.transform = 'translate3d(0,' + y + 'px,0)';
      }
    }

    if (!timeline || !progress) return;

    if (reduce.matches) {
      progress.style.transform = 'scaleY(1)';
      items.forEach(function (item) {
        item.classList.add('is-lit');
      });
      if (tip) {
        tip.classList.remove('is-on');
        tip.classList.remove('is-near');
      }
      return;
    }

    var tRect = timeline.getBoundingClientRect();
    var total = tRect.height || 1;
    var dots = measureDots(tRect);
    var progressPx = Math.min(total, Math.max(0, vh * 0.6 - tRect.top));
    var i;

    progress.style.transform = 'scaleY(' + progressPx / total + ')';

    if (tip) {
      var show = progressPx > 2 && progressPx < total - 2;
      var near = false;
      for (i = 0; i < dots.length; i++) {
        if (Math.abs(progressPx - dots[i].offset) <= NEAR) {
          near = true;
          break;
        }
      }
      tip.classList.toggle('is-on', show && !near);
      tip.classList.toggle('is-near', show && near);
      tip.style.transform = 'translate3d(0,' + (progressPx - 3.5) + 'px,0)';
    }

    dots.forEach(function (d) {
      var lit = progressPx >= d.offset;
      var wasLit = d.item.classList.contains('is-lit');
      d.item.classList.toggle('is-lit', lit);
      if (lit && !wasLit && !litOnce[d.index]) {
        litOnce[d.index] = true;
        var pulse = d.item.querySelector('.tl-pulse');
        if (pulse) {
          pulse.style.animation = 'none';
          void pulse.offsetWidth;
          pulse.style.animation = '';
        }
        var entry = {
          index: d.index,
          title: d.title,
          progressPx: Math.round(progressPx),
          displayPx: Math.round(progressPx),
          dotOffset: Math.round(d.offset),
          delta: Math.round(progressPx - d.offset),
        };
        syncLog.push(entry);
        if (window.console && console.debug) {
          console.debug('[timeline-sync]', entry);
        }
      }
    });
  }

  setTimeout(function () {
    if (heroBg && !reduce.matches) {
      heroBg.style.animation = 'none';
      heroBg.style.opacity = '1';
      heroBg.style.transform = 'none';
    }
    parallaxReady = !reduce.matches;
    update();
  }, 1700);

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();
