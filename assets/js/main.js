/* ============================================================
   WEBSITESPIXEL — interactions & motion (main.js)
   ------------------------------------------------------------
   Stack: vanilla JS + GSAP/ScrollTrigger (vendored in ./vendor).
   Native scroll, no smooth-scroll library, no framework.

   Contents
     01 Boot & fail-safe          06 Set-piece fallback (no CSS
     02 Native smooth anchors        scroll-timeline support)
     03 Nav + mobile menu         07 Stat counters · marquee clones
     04 Storefront reel           08 Case-study data + modal
     05 Set-piece card clicks     09 Bento/process spotlight
                                  10 Process pan · FAB · newsletter

   Motion degrades fully: prefers-reduced-motion gets a static page.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isDesktop = window.matchMedia('(min-width: 900px)').matches;

  function revealAllFallback() {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.style.opacity = 1;
      el.style.clipPath = 'none';
      el.style.transform = 'none';
    });
    document.querySelectorAll('.split-words .wi').forEach(function (el) {
      el.style.transform = 'none';
    });
    var pre = document.getElementById('preloader');
    if (pre) pre.style.display = 'none';
  }

  function init() {
    try { main(); }
    catch (err) {
      console.error('[wp] init failed, falling back to static page:', err);
      revealAllFallback();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function main() {
    if (typeof gsap === 'undefined') { revealAllFallback(); return; }
    gsap.registerPlugin(ScrollTrigger);

    /* ---------- Native scroll (no smooth-scroll library) ---------- */
    var lenis = null;

    function scrollToTarget(target) {
      var el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return;
      var top = el.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
    }

    /* Anchor links */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        closeMenu();
        scrollToTarget(el);
      });
    });

    /* No preloader, no entrance reveals, no split-text intro:
       the page paints instantly; the motion budget lives in the set-piece. */

    /* ---------- Nav: hide on scroll down ---------- */
    var nav = document.getElementById('nav');
    if (nav) {
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: function (self) {
          if (self.scroll() > 140 && self.direction === 1) nav.classList.add('is-hidden');
          else nav.classList.remove('is-hidden');
          nav.classList.toggle('is-scrolled', self.scroll() > 90);
        }
      });
    }

    /* ---------- Mobile menu ---------- */
    var burger = document.getElementById('nav-burger');
    var overlay = document.getElementById('menu-overlay');
    function closeMenu() {
      if (!overlay || !overlay.classList.contains('is-open')) return;
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      if (lenis) lenis.start();
    }
    if (burger && overlay) {
      burger.addEventListener('click', function () {
        var open = overlay.classList.toggle('is-open');
        overlay.setAttribute('aria-hidden', String(!open));
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        if (lenis) { open ? lenis.stop() : lenis.start(); }
      });
    }

    /* No pointer parallax, no particle canvas: atmosphere is static
       blurred blooms; the system cursor and native scroll do the rest. */

    /* ---------- Showcase reel ---------- */
    var stage = document.getElementById('store-stage');
    var media = document.getElementById('showcase-media');
    if (stage) {
      var slides = stage.querySelectorAll('.store-slide');
      var dots = document.querySelectorAll('.store-dot');
      var chromeUrl = document.getElementById('chrome-url');
      var current = 0, timer = null, visible = true;

      function goTo(idx) {
        slides[current].classList.remove('is-active');
        dots[current] && dots[current].classList.remove('is-active');
        current = idx % slides.length;
        slides[current].classList.add('is-active');
        if (dots[current]) {
          /* restart the fill animation */
          dots[current].classList.remove('is-active');
          void dots[current].offsetWidth;
          dots[current].classList.add('is-active');
        }
        if (chromeUrl) chromeUrl.textContent = slides[current].getAttribute('data-url') || '';
      }
      function play() {
        stop();
        timer = setInterval(function () {
          if (!visible || document.hidden) return;
          goTo(current + 1);
        }, 7000);
      }
      function stop() { if (timer) clearInterval(timer); }
      dots.forEach(function (d, i) {
        d.addEventListener('click', function () { goTo(i); play(); });
      });
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }, { threshold: 0.2 }).observe(stage);
      play();

      /* Set-piece: native CSS scroll-driven animations do the work on modern
         browsers. GSAP ScrollTrigger fallback mirrors the same keyframes and
         holds (media waits 10%, tiles scale from ~30%, fade from ~55%). */
      var scTrack = document.getElementById('sc-track');
      var supportsSDA = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
      if (media && scTrack && !reduced && isDesktop && !supportsSDA) {
        var sc = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: scTrack,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true
          }
        });
        sc.fromTo(media, { scale: 1, borderRadius: 22 },
          { scale: 0.36, borderRadius: 46, ease: 'power2.out', duration: 0.9 }, 0.1)
          .fromTo('.sc-tile.l1', { scale: 0 }, { scale: 1, ease: 'power3.out', duration: 0.72 }, 0.28)
          .fromTo('.sc-tile.l2', { scale: 0 }, { scale: 1, ease: 'power2.out', duration: 0.66 }, 0.34)
          .fromTo('.sc-tile.l3', { scale: 0 }, { scale: 1, ease: 'power1.out', duration: 0.6 }, 0.4)
          .fromTo('.sc-tile.l1', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.5)
          .fromTo('.sc-tile.l2', { opacity: 0 }, { opacity: 1, duration: 0.31 }, 0.55)
          .fromTo('.sc-tile.l3', { opacity: 0 }, { opacity: 1, duration: 0.32 }, 0.6);
      }
    }

    /* ---------- Stat counters ---------- */
    document.querySelectorAll('.count').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (reduced) { el.textContent = target; return; }
      var obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: function () {
          gsap.to(obj, {
            v: target, duration: 1.8, ease: 'power3.out',
            onUpdate: function () { el.textContent = Math.round(obj.v); }
          });
        }
      });
    });

    /* ---------- Marquees: duplicate groups for seamless loops ---------- */
    var mtrack = document.getElementById('marquee-track');
    if (mtrack) {
      var group = mtrack.querySelector('.marquee-group');
      if (group) {
        var clone = group.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        mtrack.appendChild(clone);
      }
    }
    document.querySelectorAll('.v-track').forEach(function (t) {
      var g = t.querySelector('.v-group');
      if (g) {
        var c = g.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        t.appendChild(c);
      }
    });

    /* ---------- Set-piece cards open the case studies ---------- */
    var scStage = document.getElementById('sc-track');
    if (scStage) {
      scStage.addEventListener('click', function (e) {
        var card = e.target.closest('.sc-tile[data-project]');
        if (card) openCase(card.getAttribute('data-project'), card);
      });
    }

    /* ---------- Case study modal ---------- */
    var CASES = {
      velle: {
        tag: 'Skincare · Replatform', title: 'Velle Skin', loc: 'London, United Kingdom',
        imgs: ['velle-skincare-studio', 'velle-lab-detail'],
        overview: 'Velle outgrew a patchwork WooCommerce build that buckled on every launch day. We replatformed to Shopify, redesigned the funnel around their hero serum and rebuilt email from scratch. Six months later the store had done £1.2M.',
        services: ['Shopify build', 'UX & UI design', 'Platform migration', 'CRO', 'Klaviyo'],
        metrics: [['+38%', 'conversion rate'], ['0.9s', 'LCP on mobile'], ['£1.2M', 'revenue, first 6 months']],
        before: '3.8s mobile loads, 1.1% conversion and a checkout that leaked at the shipping step.',
        after: 'Sub-second loads, 1.5% conversion and bundles quietly lifting order value 19%.',
        quote: 'Conversion is up 38% and the site finally feels like the brand we charge premium prices for.',
        by: 'Priya Nair, Ecommerce Director'
      },
      aurelo: {
        tag: 'Fine jewelry · Custom build', title: 'Aurelo', loc: 'Dubai, UAE',
        imgs: ['aurelo-fine-jewelry', 'aurelo-atelier-gold'],
        overview: 'Aurelo sells pieces that start at four figures, and their template store undersold every one of them. We built an editorial storefront with storytelling product pages, localized currencies and a concierge flow for high-intent buyers.',
        services: ['Custom theme', 'PDP storytelling', 'Localization', 'Speed optimization'],
        metrics: [['+27%', 'conversion rate'], ['+52%', 'time on site'], ['$860K', 'influenced revenue']],
        before: 'A generic theme that made four-figure pieces look like fast fashion.',
        after: 'An editorial experience where the product photography finally does the selling.',
        quote: 'The store now feels like walking into our flagship. Clients mention it on calls.',
        by: 'Rania Al-Masri, Founder'
      },
      fjord: {
        tag: 'Outdoor apparel · Migration', title: 'Fjord Supply Co.', loc: 'Oslo, Norway',
        imgs: ['fjord-nordic-outdoors', 'fjord-mountain-gear'],
        overview: 'A decade of Magento SEO equity and a platform bill that kept climbing. We migrated Fjord to Shopify with a full URL and content map, so rankings arrived intact, then rebuilt the theme for speed.',
        services: ['Magento migration', 'SEO migration', 'Theme development', 'Analytics'],
        metrics: [['+140%', 'organic traffic YoY'], ['0', 'rankings lost'], ['1.1s', 'LCP on mobile']],
        before: 'Magento maintenance eating a developer week every month, 3.5s loads.',
        after: 'Zero-downtime cutover, three times faster and organic traffic more than doubled.',
        quote: 'The migration was the thing I dreaded most. We lost zero rankings and the site is three times faster.',
        by: 'Jonas Viken, CEO'
      },
      casa: {
        tag: 'Home & living · Shopify Plus', title: 'Casa Márlo', loc: 'Valencia, Spain',
        imgs: ['casa-marlo-interiors', 'casa-marlo-terrace'],
        overview: 'Casa Márlo sells to homeowners and to 200 interior studios, and the two channels fought each other constantly. We moved them to Shopify Plus with a wholesale storefront, then ran CRO sprints on retail.',
        services: ['Shopify Plus', 'B2B wholesale', 'CRO sprints', 'ERP integration'],
        metrics: [['3.4x', 'blended ROAS'], ['+31%', 'retail conversion'], ['200+', 'B2B accounts served']],
        before: 'One storefront straining to serve two very different buyers.',
        after: 'Retail and wholesale on one stack, each with its own funnel and pricing.',
        quote: 'Their CRO sprints paid for the whole build inside a quarter.',
        by: 'Lucía Ferrán, Co-founder'
      },
      kanso: {
        tag: 'Coffee · Subscriptions', title: 'Kanso Coffee', loc: 'Kyoto, Japan',
        imgs: ['kanso-coffee-craft', 'kanso-roastery-morning'],
        overview: 'Kanso had a beautiful product and a subscription program bleeding 12% of members a month. We rebuilt subscriptions with flexible skips, gifting and dunning flows, and gave the brand a store that matches the roastery.',
        services: ['Subscription build', 'Retention flows', 'Custom Shopify app', 'Store design'],
        metrics: [['71%', 'retention at month 6'], ['4%', 'monthly churn, from 12%'], ['+33%', 'subscriber LTV']],
        before: 'Rigid subscriptions people cancelled instead of pausing.',
        after: 'Skip, swap and gift in two taps. Cancellations became pauses.',
        quote: 'Subscriptions were churning at 12% a month. They got us to 4% with flows I didn’t know were possible.',
        by: 'Kenji Watanabe, Founder'
      },
      bloomfield: {
        tag: 'Wellness · Retention', title: 'Bloomfield Botanics', loc: 'Portland, United States',
        imgs: ['bloomfield-botanic-glow', 'bloomfield-greenhouse'],
        overview: 'Paid traffic was getting expensive and email was an afterthought. We rebuilt the store for speed, then built a Klaviyo program around first-purchase education. Email now carries almost a third of revenue.',
        services: ['Klaviyo program', 'Speed optimization', 'CRO', 'Analytics & tracking'],
        metrics: [['31%', 'of revenue from email'], ['96', 'mobile Lighthouse score'], ['+22%', 'repeat purchase rate']],
        before: 'Two campaign emails a month and a 5-second mobile load.',
        after: 'Eleven automated flows and a store that loads before doubt sets in.',
        quote: 'They rebuilt our store in six weeks and email went from an afterthought to 31% of revenue.',
        by: 'Amara Okafor, Founder'
      },
      nou: {
        tag: 'Design goods · New build', title: 'Nou Studio', loc: 'Copenhagen, Denmark',
        imgs: ['nou-studio-objects', 'nou-studio-editorial'],
        overview: 'Nou sells small-batch objects from Danish designers and needed a store as considered as the products. We built a catalogue-style Shopify theme with editorial collections and a checkout that stays out of the way.',
        services: ['Store design', 'Theme development', 'Editorial collections', 'Analytics'],
        metrics: [['+41%', 'conversion rate'], ['2.1x', 'AOV on collections'], ['1.0s', 'LCP on mobile']],
        before: 'A generic grid theme that flattened every product into a thumbnail.',
        after: 'A catalogue people browse like a magazine, with checkout two taps away.',
        quote: 'The store finally feels like our studio. Sales followed.',
        by: 'Mette Andersen, Founder'
      },
      oro: {
        tag: 'Watches · Replatform', title: 'Oro Fino', loc: 'Milan, Italy',
        imgs: ['oro-fino-atelier', 'oro-fino-detail'],
        overview: 'Oro Fino sells restored vintage watches with four-figure price tags. We replatformed them to Shopify with a provenance page for every piece, concierge checkout and localized duties for EU and US collectors.',
        services: ['Replatform', 'PDP storytelling', 'Localization', 'CRO'],
        metrics: [['+33%', 'conversion rate'], ['+58%', 'time on site'], ['€940K', 'influenced revenue']],
        before: 'A marketplace-listing feel that undercut four-figure trust.',
        after: 'Provenance-first product pages that sell the story before the price.',
        quote: 'Collectors now email us about the website before the watches.',
        by: 'Luca Ferretti, Founder'
      }
    };

    var CASE_META = {
      velle: { url: 'velleskin.co.uk', pal: ['#f2eee7', '#2b2b26', '#5c7050'] },
      aurelo: { url: 'aurelo.com', pal: ['#15100b', '#f3ecdf', '#d6b87e'] },
      fjord: { url: 'fjordsupply.no', pal: ['#0c1116', '#e8eef2', '#7fb6d9'] },
      casa: { url: 'casamarlo.es', pal: ['#141210', '#f1ece4', '#c8a06a'] },
      kanso: { url: 'kansocoffee.jp', pal: ['#101210', '#ece9e2', '#9db08a'] },
      bloomfield: { url: 'bloomfieldbotanics.com', pal: ['#0f1410', '#eef2ec', '#7fbf9a'] },
      nou: { url: 'noustudio.dk', pal: ['#f4f2ee', '#22221f', '#8a8f76'] },
      oro: { url: 'orofino.it', pal: ['#120f0a', '#f2ead9', '#c9a35a'] }
    };
    var caseOrder = ['velle', 'aurelo', 'fjord', 'casa', 'kanso', 'bloomfield', 'nou', 'oro'];
    var currentCase = null;

    var modal = document.getElementById('case-modal');
    var modalBody = document.getElementById('modal-body');
    var modalClose = document.getElementById('modal-close');
    var lastFocus = null;

    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

    function populateCase(key) {
      var c = CASES[key];
      if (!c) return false;
      currentCase = key;
      var meta = CASE_META[key] || {};
      var pal = meta.pal || ['#101012', '#eeeeee', '#ffffff'];
      modalBody.innerHTML =
        '<span class="m-tag">' + esc(c.tag) + '</span>' +
        '<h3 class="m-title" id="modal-title">' + esc(c.title) + '</h3>' +
        '<p class="m-loc">' + esc(c.loc) + '</p>' +
        '<div class="m-preview"><div class="m-chrome"><i></i><i></i><i></i><span>' + esc(meta.url || '') + '</span></div>' +
          '<div class="m-page-vp"><div class="m-page" style="background:' + pal[0] + ';color:' + pal[1] + ';--pv-bg:' + pal[0] + ';--pv-ink:' + pal[1] + ';--pv-ac:' + pal[2] + ';--pv-tint:' + pal[0] + 'd9">' +
            '<div class="mp-nav"><b>' + esc(c.title).toUpperCase() + '</b><span>Shop&ensp;Collections&ensp;Journal</span><span>Cart · 1</span></div>' +
            '<div class="mp-hero"><img src="https://picsum.photos/seed/' + c.imgs[0] + '-page/900/620" alt="">' +
              '<div class="mp-hero-copy"><b>' + esc(c.title) + '</b><span>Shop now</span></div></div>' +
            '<div class="mp-row"><figure><img src="https://picsum.photos/seed/' + c.imgs[1] + '/440/330" alt=""></figure>' +
            '<figure><img src="https://picsum.photos/seed/' + c.imgs[0] + '-detail/440/330" alt=""></figure></div>' +
            '<p class="mp-quote">' + esc(c.after) + '</p>' +
          '</div></div></div>' +
        '<div class="m-section"><h4>Overview</h4><p>' + esc(c.overview) + '</p></div>' +
        '<div class="m-section"><h4>What we delivered</h4><div class="m-chips">' +
          c.services.map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') +
        '</div></div>' +
        '<div class="m-section"><h4>Results</h4><div class="m-metrics">' +
          c.metrics.map(function (m) { return '<div class="m-metric"><b>' + esc(m[0]) + '</b><span>' + esc(m[1]) + '</span></div>'; }).join('') +
        '</div></div>' +
        '<div class="m-section"><div class="m-ba">' +
          '<div class="m-ba-col"><h5>Before</h5><p>' + esc(c.before) + '</p></div>' +
          '<div class="m-ba-col is-after"><h5>After</h5><p>' + esc(c.after) + '</p></div>' +
        '</div></div>' +
        '<div class="m-section"><blockquote class="m-quote"><div class="m-stars" aria-label="Five star review">★★★★★</div>“' + esc(c.quote) + '”<footer>' + esc(c.by) + '</footer></blockquote></div>' +
        '<div class="m-cta"><a class="btn btn-primary btn-lg btn-arrow" href="mailto:teamwebsitepixle@gmail.com?subject=Strategy%20Call%20Request">Book a Strategy Call<span class="arr2" aria-hidden="true">→</span></a></div>' +
        '<div class="m-switch"><button type="button" id="m-prev">← Previous project</button><button type="button" id="m-next">Next project →</button></div>';
      return true;
    }

    function switchCase(dir) {
      var i = caseOrder.indexOf(currentCase);
      if (i < 0) return;
      populateCase(caseOrder[(i + dir + caseOrder.length) % caseOrder.length]);
      var panel = document.querySelector('.modal-panel');
      if (panel) panel.scrollTop = 0;
      if (!reduced) gsap.fromTo(modalBody, { opacity: 0.25, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
    }

    function openCase(key, sourceEl) {
      if (!modal || !populateCase(key)) return;
      lastFocus = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      if (lenis) lenis.stop();
      document.body.style.overflow = 'hidden';
      if (!reduced) {
        var panel = document.querySelector('.modal-panel');
        if (sourceEl && sourceEl.getBoundingClientRect) {
          /* cinematic FLIP: the card travels from its wall position to center */
          var r = sourceEl.getBoundingClientRect();
          var pw = Math.min(880, window.innerWidth * 0.94);
          gsap.fromTo(panel,
            {
              xPercent: -50, yPercent: -50,
              x: (r.left + r.width / 2) - window.innerWidth / 2,
              y: (r.top + r.height / 2) - window.innerHeight / 2,
              scale: Math.max(r.width / pw, 0.12), opacity: 0.35
            },
            { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'expo.out', clearProps: 'transform' });
        } else {
          gsap.fromTo(panel,
            { y: 46, scale: 0.96, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'expo.out' });
        }
      }
      modalClose.focus();
    }

    function closeCase() {
      if (!modal || !modal.classList.contains('is-open')) return;
      function done() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        if (lenis) lenis.start();
        document.body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
      }
      if (reduced) { done(); }
      else {
        gsap.to('.modal-panel', {
          y: 30, opacity: 0, duration: 0.3, ease: 'power2.in',
          onComplete: function () { gsap.set('.modal-panel', { clearProps: 'all' }); done(); }
        });
      }
    }

    if (modalClose) modalClose.addEventListener('click', closeCase);
    if (modal) {
      modal.querySelector('.modal-backdrop').addEventListener('click', closeCase);
      modalBody.addEventListener('click', function (e) {
        if (e.target.id === 'm-prev') switchCase(-1);
        if (e.target.id === 'm-next') switchCase(1);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeCase(); closeMenu(); }
        if (modal.classList.contains('is-open')) {
          if (e.key === 'ArrowRight') switchCase(1);
          if (e.key === 'ArrowLeft') switchCase(-1);
        }
      });
    }

    /* ---------- Bento spotlight ---------- */
    if (isDesktop && !reduced) {
      document.querySelectorAll('.bento-card, .p-step').forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
          card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
        });
      });
    }

    /* ---------- Process: horizontal pan (desktop) ---------- */
    var pin = document.getElementById('process-pin');
    var track = document.getElementById('process-track');
    var barFill = document.getElementById('process-bar-fill');
    if (pin && track && isDesktop && !reduced) {
      var getDistance = function () { return Math.max(track.scrollWidth - window.innerWidth, 0); };
      gsap.to(track, {
        x: function () { return -getDistance(); },
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: function () { return '+=' + getDistance(); },
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            if (barFill) barFill.style.transform = 'scaleX(' + self.progress + ')';
          }
        }
      });
    }

    /* ---------- FAB visibility ---------- */
    var fab = document.getElementById('fab');
    if (fab) {
      fab.classList.add('is-hidden');
      ScrollTrigger.create({
        start: function () { return window.innerHeight * 0.7; },
        end: 'max',
        onToggle: function (self) { fab.classList.toggle('is-hidden', !self.isActive); }
      });
      var contact = document.getElementById('contact');
      if (contact) {
        ScrollTrigger.create({
          trigger: contact, start: 'top 75%', end: 'bottom top',
          onToggle: function (self) { if (self.isActive) fab.classList.add('is-hidden'); }
        });
      }
    }

    /* ---------- Newsletter ---------- */
    var nlForm = document.getElementById('nl-form');
    var nlMsg = document.getElementById('nl-msg');
    if (nlForm && nlMsg) {
      nlForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = document.getElementById('nl-email');
        var btn = nlForm.querySelector('button');
        var val = (input.value || '').trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
          nlMsg.textContent = 'Enter a valid email address.';
          nlMsg.classList.add('is-error');
          input.focus();
          return;
        }
        nlMsg.classList.remove('is-error');
        btn.disabled = true;
        var label = btn.textContent;
        btn.textContent = 'Subscribing…';
        setTimeout(function () {
          btn.disabled = false;
          btn.textContent = label;
          nlForm.reset();
          nlMsg.textContent = 'You’re on the list. Talk soon.';
        }, 700);
      });
    }

    /* ---------- Footer year ---------- */
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    /* ---------- Refresh triggers after images settle ---------- */
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
})();
