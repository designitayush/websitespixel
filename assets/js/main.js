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
    var slides = stage ? stage.querySelectorAll('.store-slide') : [];
    /* The stage holds a looping video now, so there are no slides to cycle.
       A bare `return` used to sit here, which did not skip the reel: it left
       main() outright and took every feature defined below it with it - the
       case-study modal, the bento spotlight, the floating call button and
       the newsletter form all silently stopped being wired up. Gate the
       block instead of leaving the function. */
    if (stage && slides.length) {
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
    document.querySelectorAll('.count--legacy').forEach(function (el) {
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
        '<div class="m-cta">' +
          '<a class="btn btn-primary btn-lg btn-arrow" href="/work/' + key + '/">View full case study<span class="arr2" aria-hidden="true">&rarr;</span></a>' +
          '<a class="btn btn-ghost btn-lg m-cta-2" href="#contact">Book a strategy call</a>' +
        '</div>' +
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
    /* This used to fake it: a 700ms timer, a cheerful message, and the
       address dropped on the floor. Now it posts to /api/subscribe, which
       stores the reader before it thanks them. */
    var nlForm = document.getElementById('nl-form');
    var nlMsg = document.getElementById('nl-msg');
    if (nlForm && nlMsg) {
      nlForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = document.getElementById('nl-email');
        var btn = nlForm.querySelector('button');
        var val = (input.value || '').trim();

        /* Spam-clicking the button should do nothing, not queue five signups. */
        if (btn.disabled) return;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
          nlMsg.textContent = 'Enter a valid email address.';
          nlMsg.classList.add('is-error');
          input.focus();
          return;
        }

        nlMsg.classList.remove('is-error');
        nlMsg.textContent = '';
        btn.disabled = true;
        var label = btn.textContent;
        btn.textContent = 'Subscribing…';
        if (window.wpTrack) window.wpTrack('newsletter_submitted');

        var ctx = window.WPCTX || {};
        fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: val,
            utm: ctx.utm || '',
            referrer: ctx.referrer || '',
            landing: ctx.landing || '',
            timezone: ctx.tz || ''
          })
        }).then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (b) {
            return { ok: res.ok, body: b };
          });
        }).then(function (r) {
          if (!r.ok) throw new Error(r.body.error || 'That did not go through.');
          nlForm.reset();
          nlMsg.textContent = 'You\u2019re on the list. A confirmation is on its way.';
          if (window.wpTrack) window.wpTrack('newsletter_subscribed');
        }).catch(function (err) {
          /* Say what happened and leave a door open. */
          nlMsg.textContent = err.message +
            ' Email teamwebsitespixel@gmail.com and we will add you by hand.';
          nlMsg.classList.add('is-error');
        }).then(function () {
          btn.disabled = false;
          btn.textContent = label;
        });
      });
    }

    /* ---------- Footer year ---------- */
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    /* ---------- Refresh triggers after images settle ---------- */
    window.addEventListener('load', function () {
      ScrollTrigger.refresh();
    });
  }
})();

/* Scroll story runs on its own: it must not depend on the GSAP branch above. */
(function () {
  var REDUCED = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* ---------- Scroll story: lerped collage + progress rail ---------- */
  var story = document.querySelector('.story');
  if (story) {
    var rows = [].slice.call(story.querySelectorAll('.story-row'));
    var fill = story.querySelector('.story-rail-fill');
    var target = 0, current = 0, frame = null;

    function storyProgress() {
      var r = story.getBoundingClientRect();
      var span = r.height - window.innerHeight;
      if (span <= 0) return 0;
      return Math.min(1, Math.max(0, -r.top / span));
    }

    function paint(p) {
      for (var i = 0; i < rows.length; i++) {
        /* Neighbouring rows always travel opposite ways: that counter-motion
           is what reads as depth. */
        var dir = i % 2 === 0 ? -1 : 1;
        var travel = parseFloat(rows[i].getAttribute('data-travel')) || 200;
        rows[i].style.transform =
          'translate3d(' + (dir * (p - 0.5) * 2 * travel).toFixed(2) + 'px,0,0)';
      }
      if (fill) fill.style.transform = 'scaleY(' + p.toFixed(4) + ')';
    }

    function tick() {
      current += (target - current) * 0.09;      /* weight, not a 1:1 bind */
      if (Math.abs(target - current) < 0.0002) {
        current = target; paint(current); frame = null; return;
      }
      paint(current);
      frame = requestAnimationFrame(tick);
    }

    function onStoryScroll() {
      target = storyProgress();
      if (REDUCED) { current = target; paint(current); return; }
      if (!frame) frame = requestAnimationFrame(tick);
    }

    /* Exactly one reason is active: the block whose middle sits closest to the
     middle of the viewport. */
  var blocks = [].slice.call(story.querySelectorAll('.story-block'));
  function markActive() {
    var mid = window.innerHeight / 2, best = -1, bestD = Infinity;
    for (var i = 0; i < blocks.length; i++) {
      var r = blocks[i].getBoundingClientRect();
      var d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestD) { bestD = d; best = i; }
    }
    for (var k = 0; k < blocks.length; k++) {
      blocks[k].classList.toggle('is-active', k === best);
    }
  }
  window.addEventListener('scroll', markActive, { passive: true });
  window.addEventListener('resize', markActive);
  markActive();

  window.addEventListener('scroll', onStoryScroll, { passive: true });
    window.addEventListener('resize', onStoryScroll);
    onStoryScroll();
    paint(target);
  }

})();

/* Hero wall + showreel: independent of GSAP, so the loop always starts. */
window.addEventListener('load', function () {
  /* Start every hero-wall column on the same frame. */
  var wall = document.querySelector('.hwall');
  if (!wall) return;
  wall.classList.add('hwall-ready');

  /* Stop animating once the hero is off-screen: no point burning frames
     on a background nobody can see. */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      wall.classList.toggle('hwall-paused', !entries[0].isIntersecting);
    }, { rootMargin: '120px' }).observe(document.querySelector('.hero'));

    /* Decoding 1080p costs real CPU, so the showreel only runs while it is
       actually on screen. Playback state only; the scroll animation on the
       container is untouched. */
    var reel = document.querySelector('.store-video');
    if (reel) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          var play = reel.play();
          if (play && play.catch) play.catch(function () {});
        } else {
          reel.pause();
        }
      }, { rootMargin: '0px' }).observe(reel);
    }
  }
});

/* Review rows fill themselves. This is plain DOM work with no GSAP in it,
   so it must not sit behind the scroll-driven-animation branch: modern
   Chrome skips that branch and the rows were left half empty. */
(function () {
  document.querySelectorAll('.v-track').forEach(function (t) {
    var g = t.querySelector('.v-group');
    if (!g) return;
    /* One clone is not enough on a wide screen: keep copying until the track
       is at least twice the viewport, so the loop never runs out of cards. */
    var need = Math.max(2, Math.ceil((window.innerWidth * 2) / Math.max(g.scrollWidth, 1)));
    for (var i = 1; i < need; i++) {
      var c = g.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      t.appendChild(c);
    }
  });
})();

/* Attribution + funnel events. A tiny shim so the booking flow can report to
   whatever analytics happens to be on the page without knowing which one. */
(function () {
  var KEY = 'wp_ctx';
  var ctx = null;
  try { ctx = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { ctx = null; }
  if (!ctx) {
    var q = new URLSearchParams(location.search);
    var utm = [];
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'gclid', 'fbclid'].forEach(function (k) {
      if (q.get(k)) utm.push(k + '=' + q.get(k));
    });
    ctx = {
      utm: utm.join('&'),
      referrer: document.referrer || '',
      landing: location.origin + location.pathname
    };
    try { sessionStorage.setItem(KEY, JSON.stringify(ctx)); } catch (e) {}
  }
  try { ctx.tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; }
  catch (e) { ctx.tz = ''; }
  window.WPCTX = ctx;

  /* Fire and forget: every sink is optional and none of them may throw. */
  window.wpTrack = function (name, props) {
    var data = props || {};
    try { if (window.dataLayer) window.dataLayer.push({ event: name }); } catch (e) {}
    try { if (window.clarity) window.clarity('event', name); } catch (e) {}
    try { if (window.va) window.va('event', { name: name, data: data }); } catch (e) {}
    try { if (window.gtag) window.gtag('event', name, data); } catch (e) {}
  };
})();

/* Booking: three guided steps, then one POST to /api/book.
   Its own scope so it never depends on the animation branches above. */
(function () {
  var form = document.getElementById('book-form');
  if (!form) return;

  var SLOTS = ['09:30', '10:00', '10:30', '11:00', '11:30',
               '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  var MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
  var HORIZON = 56;                       /* bookable days ahead */
  var opened = Date.now();
  var picked = { date: null, label: '', time: null };

  /* Our slots are availability in Asia/Kolkata (fixed +05:30, no DST). We render
     them on the visitor's own clock — making a UK or US buyer do timezone
     arithmetic at the moment of commitment is a documented conversion killer —
     but still submit the canonical IST string, so the inbox stays in one zone. */
  var IST_OFFSET_MIN = 330;
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function visitorZone() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; }
    catch (e) { return ''; }
  }
  function baseDate() {
    if (picked.date) { var p = String(picked.date).split('-'); return { y: +p[0], m: +p[1] - 1, d: +p[2] }; }
    var n = new Date();
    return { y: n.getFullYear(), m: n.getMonth(), d: n.getDate() };
  }
  function shiftsClock() {
    var b = baseDate();
    return -(new Date(b.y, b.m, b.d, 12, 0)).getTimezoneOffset() !== IST_OFFSET_MIN;
  }
  function localLabel(t) {
    if (!shiftsClock()) return t;
    var b = baseDate(), hm = t.split(':');
    var local = new Date(Date.UTC(b.y, b.m, b.d, +hm[0], +hm[1]) - IST_OFFSET_MIN * 60000);
    return pad2(local.getHours()) + ':' + pad2(local.getMinutes());
  }

  var grid = document.getElementById('cal-grid');
  var monthLabel = document.getElementById('cal-month');
  var prev = document.getElementById('cal-prev');
  var next = document.getElementById('cal-next');
  var slotGrid = document.getElementById('slot-grid');
  var status = document.getElementById('book-status');
  var submit = document.getElementById('book-submit');

  var today = new Date(); today.setHours(0, 0, 0, 0);
  var last = new Date(today); last.setDate(last.getDate() + HORIZON);
  var view = new Date(today.getFullYear(), today.getMonth(), 1);

  var bookable = function (d) {
    var day = d.getDay();
    return d >= today && d <= last && day !== 0 && day !== 6;
  };
  var iso = function (d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
           '-' + String(d.getDate()).padStart(2, '0');
  };
  var pretty = function (d) {
    return d.toLocaleDateString(undefined,
      { weekday: 'long', day: 'numeric', month: 'long' });
  };

  function step(n) {
    form.querySelectorAll('.book-pane').forEach(function (p) {
      p.classList.toggle('is-active', p.getAttribute('data-pane') === String(n));
    });
    document.querySelectorAll('.book-steps li').forEach(function (li) {
      var i = Number(li.getAttribute('data-step'));
      li.classList.toggle('is-current', i === n);
      li.classList.toggle('is-done', i < n);
    });
  }

  function drawMonth() {
    monthLabel.textContent = MONTHS[view.getMonth()] + ' ' + view.getFullYear();
    grid.textContent = '';
    var first = new Date(view.getFullYear(), view.getMonth(), 1);
    var lead = (first.getDay() + 6) % 7;                 /* weeks start Monday */
    var days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();

    for (var i = 0; i < lead; i++) {
      var pad = document.createElement('span');
      pad.className = 'cal-day is-empty';
      grid.appendChild(pad);
    }
    for (var d = 1; d <= days; d++) {
      var date = new Date(view.getFullYear(), view.getMonth(), d);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cal-day';
      btn.textContent = d;
      btn.disabled = !bookable(date);
      if (!btn.disabled) {
        btn.setAttribute('aria-label', pretty(date));
        if (picked.date === iso(date)) btn.classList.add('is-picked');
        btn.addEventListener('click', pick.bind(null, date));
      }
      grid.appendChild(btn);
    }
    prev.disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
    next.disabled = view >= new Date(last.getFullYear(), last.getMonth(), 1);
  }

  var nextBtn = document.getElementById('book-next');
  function syncNext() { nextBtn.disabled = !(picked.date && picked.time); }

  function pick(date) {
    picked.date = iso(date);
    picked.label = pretty(date);
    picked.time = null;                      /* a new day means a new time */
    var lbl = document.getElementById('sel-date');
    lbl.textContent = picked.label;
    lbl.classList.add('is-set');
    drawMonth();
    drawSlots();
    syncNext();
    wpTrack('booking_date_selected');
  }

  function drawSlots() {
    slotGrid.textContent = '';
    SLOTS.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'slot' + (picked.time === t ? ' is-picked' : '');
      b.textContent = localLabel(t);
      b.addEventListener('click', function () {
        picked.time = t;
        document.getElementById('sel-when').textContent = picked.label + ', ' + localLabel(t);
        drawSlots();
        syncNext();
      wpTrack('booking_time_selected');
      });
      slotGrid.appendChild(b);
    });

    var note = document.getElementById('slot-tz');
    if (!note) {
      note = document.createElement('p');
      note.id = 'slot-tz';
      note.className = 'slot-tz';
      slotGrid.parentNode.insertBefore(note, slotGrid.nextSibling);
    }
    var z = visitorZone();
    note.textContent = 'Times shown in your local timezone' + (z ? ' (' + z + ')' : '') + '.';
  }

  nextBtn.addEventListener('click', function () {
    if (!picked.date || !picked.time) return;
    wpTrack('booking_details_opened');
    step(2);
  });

  prev.addEventListener('click', function () { view.setMonth(view.getMonth() - 1); drawMonth(); });
  next.addEventListener('click', function () { view.setMonth(view.getMonth() + 1); drawMonth(); });
  form.querySelectorAll('[data-back]').forEach(function (b) {
    b.addEventListener('click', function () { step(Number(b.getAttribute('data-back'))); });
  });

  function showErrors(errors) {
    form.querySelectorAll('.bf').forEach(function (f) { f.classList.remove('has-error'); });
    form.querySelectorAll('.bf-err').forEach(function (e) { e.textContent = ''; });
    var firstField = null;
    Object.keys(errors).forEach(function (k) {
      var slot = form.querySelector('[data-err="' + k + '"]');
      if (slot) {
        slot.textContent = errors[k];
        slot.closest('.bf').classList.add('has-error');
        if (!firstField) firstField = slot.closest('.bf').querySelector('input,textarea,select');
      }
    });
    if (firstField) firstField.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    status.classList.remove('is-bad');

    var data = {
      date: picked.label, dateISO: picked.date, time: picked.time,
      utm: WPCTX.utm,
      referrer: WPCTX.referrer, landing: WPCTX.landing,
      name: form.name.value, email: form.email.value, phone: form.phone ? form.phone.value : '',
      company: form.company ? form.company.value : '', website: form.website.value,
      service: form.service.value, project: form.project.value,
      timezone: visitorZone(),
      company_url: form.company_url.value, elapsed: Date.now() - opened
    };

    /* Client-side first so an obvious slip never costs a round trip. */
    var errs = {};
    if (!data.name || data.name.trim().length < 2) errs.name = 'Tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errs.email = 'That email address does not look right.';
    if (Object.keys(errs).length) { showErrors(errs); return; }
    if (!picked.date || !picked.time) { step(1); return; }

    wpTrack('booking_submitted');


    submit.disabled = true;
    submit.classList.add('is-sending');
    submit.querySelector('.bs-label').textContent = 'Sending';

    fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (body) {
        return { ok: res.ok, status: res.status, body: body };
      });
    }).then(function (r) {
      /* A 200 is not proof of anything. The server reports booked:true only
         when the record is really stored, so require it explicitly: an empty
         or unexpected body now falls through to the error path, not the tick. */
      if (r.ok && r.body && r.body.booked === true) {
        form.querySelectorAll('.book-pane').forEach(function (p) { p.classList.remove('is-active'); });
        var done = form.querySelector('[data-pane="done"]');
        done.hidden = false;
        /* Truthful about the email. The slot is confirmed either way, but if
           the confirmation did not send we say so, instead of implying an
           inbox already has it. */
        var mailNote = document.getElementById('done-mail-note');
        if (!mailNote) {
          mailNote = document.createElement('p');
          mailNote.id = 'done-mail-note';
          mailNote.style.cssText = 'margin:10px 0 0;font-size:13px;line-height:1.5;opacity:.75';
          var whenEl = document.getElementById('done-when');
          if (whenEl && whenEl.parentNode) {
            whenEl.parentNode.insertBefore(mailNote, whenEl.nextSibling);
          }
        }
        if (mailNote) {
          mailNote.hidden = r.body.confirmationSent !== false;
          mailNote.textContent = r.body.confirmationSent === false
            ? 'Your slot is confirmed. The confirmation email is running late — if nothing arrives shortly, email teamwebsitespixel@gmail.com and we will resend it.'
            : '';
        }

        wpTrack('booking_confirmed');
        document.getElementById('done-when').textContent = picked.label + ' at ' + picked.time;
        document.querySelectorAll('.book-steps li').forEach(function (li) {
          li.classList.remove('is-current'); li.classList.add('is-done');
        });
        done.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return;
      }
      if (r.status === 422 && r.body.errors) { showErrors(r.body.errors); return; }
      throw new Error(r.body.error || 'Something went wrong.');
    }).catch(function (err) {
      /* Never fail silently: say what happened and give a way through. */
      status.textContent = err.message +
        ' You can also email teamwebsitespixel@gmail.com directly.';
      status.classList.add('is-bad');
    }).then(function () {
      submit.disabled = false;
      submit.classList.remove('is-sending');
      submit.querySelector('.bs-label').textContent = 'Confirm booking';
    });
  });
  /* Slots are published in our working hours, not the visitor's. Saying so out
     loud is the difference between a kept call and a missed one. */
  (function () {
    if (!slotGrid || !slotGrid.parentNode) return;
    var tzNote = document.createElement('p');
    tzNote.className = 'slot-note';
    tzNote.style.cssText = 'margin:10px 0 0;font-size:12px;line-height:1.5;opacity:.6';
    tzNote.textContent = 'All times are India Standard Time. Your confirmation'
      + ' email shows the same slot in your own timezone.';
    slotGrid.parentNode.appendChild(tzNote);
  })();

  drawMonth();
})();

/* Process pan lives on its own. It was inside the branch that only runs when a
   browser LACKS CSS scroll-driven animations, so in current Chrome it never
   started and the section simply did not pan. */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  var isDesktop = window.matchMedia('(min-width: 900px)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);
  /* ---------- Process: horizontal pan (desktop) ---------- */
  var pin = document.getElementById('process-pin');
  var track = document.getElementById('process-track');
  var barFill = document.getElementById('process-bar-fill');
  if (pin && track && isDesktop && !reduced) {
    var getDistance = function () { return Math.max(track.scrollWidth - window.innerWidth, 0); };
    /* Scroll length is stretched well past the travel distance so each card
       gets real dwell time instead of flicking past. */
    var getScroll = function () { return getDistance() * 2.4; };
    gsap.to(track, {
      x: function () { return -getDistance(); },
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: function () { return '+=' + getScroll(); },
        pin: true,
        scrub: 1.35,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          if (barFill) barFill.style.transform = 'scaleX(' + self.progress + ')';
        }
      }
    });
  }


})();

/* Free audit form. Isolated from the booking flow on purpose: that path is live
   and must not be affected by anything here. */
(function () {
  var form = document.getElementById('audit-form');
  if (!form) return;
  var opened = Date.now();
  var submit = document.getElementById('audit-submit');
  var status = document.getElementById('audit-status');
  var done = document.getElementById('audit-done');

  function showErrors(errors) {
    form.querySelectorAll('.bf').forEach(function (f) { f.classList.remove('has-error'); });
    form.querySelectorAll('.bf-err').forEach(function (e) { e.textContent = ''; });
    var first = null;
    Object.keys(errors).forEach(function (k) {
      var slot = form.querySelector('[data-err="' + k + '"]');
      if (!slot) return;
      slot.textContent = errors[k];
      slot.closest('.bf').classList.add('has-error');
      if (!first) first = slot.closest('.bf').querySelector('input,select,textarea');
    });
    if (first) first.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    status.classList.remove('is-bad');

    var data = {
      store: form.store.value, email: form.email.value, name: form.name.value,
      revenue: form.revenue.value, goal: form.goal.value,
      company_url: form.company_url.value, elapsed: Date.now() - opened
    };
    var errs = {};
    if (!data.store || data.store.trim().length < 4) errs.store = 'Which store should we look at?';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errs.email = 'That email address does not look right.';
    if (Object.keys(errs).length) { showErrors(errs); return; }

    submit.disabled = true;
    submit.classList.add('is-sending');
    submit.querySelector('.bs-label').textContent = 'Sending';

    fetch('/api/audit', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (b) {
        return { ok: res.ok, status: res.status, body: b };
      });
    }).then(function (r) {
      /* Same rule as the booking form: a bare 200 is not success. */
      if (r.ok && r.body && r.body.submitted === true) {
        form.querySelectorAll('.bf, .fa-form-h, .fa-submit').forEach(function (n) { n.hidden = true; });
        done.hidden = false;
        return;
      }
      if (r.status === 422 && r.body.errors) { showErrors(r.body.errors); return; }
      throw new Error(r.body.error || 'Something went wrong.');
    }).catch(function (err) {
      status.textContent = err.message + ' You can also email teamwebsitespixel@gmail.com directly.';
      status.classList.add('is-bad');
    }).then(function () {
      submit.disabled = false;
      submit.classList.remove('is-sending');
      submit.querySelector('.bs-label').textContent = 'Send my audit request';
    });
  });
})();

/* Stat counters. Deliberately standalone and GSAP-free: the original lived
   inside a branch that only runs when the browser LACKS CSS scroll-driven
   animations, so on every modern browser it never fired and the band showed
   zeros. IntersectionObserver + rAF has no such dependency. */
(function () {
  var band = document.getElementById('stats');
  if (!band) return;
  var els = [].slice.call(band.querySelectorAll('.count'));
  if (!els.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DUR = 1150;   // fast — the number should land, not crawl
  var STAGGER = 110;

  function count(el, delay) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (!isFinite(target)) return;
    if (reduced) { el.textContent = target; return; }
    var t0 = null;
    function frame(now) {
      if (t0 === null) t0 = now;
      var p = Math.min(1, (now - t0) / DUR);
      // Cubic ease-out: quick off the mark, decelerating onto the real figure.
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) { requestAnimationFrame(frame); }
      else { el.textContent = target; }
    }
    window.setTimeout(function () { requestAnimationFrame(frame); }, delay);
  }

  function start() { els.forEach(function (el, i) { count(el, i * STAGGER); }); }

  if (!('IntersectionObserver' in window)) { start(); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.disconnect();
      start();
    });
  }, { threshold: 0.3 });
  io.observe(band);
})();

/* Landing-page showcase: only pan while the frame is actually on screen, so a
   long case study page is not animating three tall images out of view. */
(function () {
  var frames = [].slice.call(document.querySelectorAll('[data-lp-legacy]'));
  if (!frames.length) return;
  if (!('IntersectionObserver' in window)) {
    frames.forEach(function (f) { f.classList.add('is-live'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { e.target.classList.toggle('is-live', e.isIntersecting); });
  }, { threshold: 0.15 });
  frames.forEach(function (f) { io.observe(f); });
})();

/* ------------------------------------------------------------------
   Scrolling landing-page preview.

   Idle   : drifts down slowly, reverses at each end so it never cuts.
   Hover  : pauses instantly and holds position.
   Manual : the visitor's wheel, thumb or keyboard takes over completely.
   Resume : 2.5s after they stop, we continue from where they left it.

   Position is tracked in a variable rather than read back from
   scrollTop each frame: at this speed each frame moves a fraction of a
   pixel, and reading back a rounded value would cancel every increment.
------------------------------------------------------------------- */
(function () {
  var frames = [].slice.call(document.querySelectorAll('[data-scrollpreview]'));
  if (!frames.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SPEED = 16;        /* px per second — slow enough to read */
  var RESUME_MS = 2500;

  frames.forEach(function (frame) {
    var port = frame.querySelector('.pv-port, .lp-port');
    if (!port) return;

    var pos = 0, dir = 1;
    var hovering = false, manual = false, visible = false;
    var resumeTimer = null, last = 0;

    function paint() {
      frame.classList.toggle('is-paused', hovering && !manual);
      frame.classList.toggle('is-manual', manual);
    }

    function takeOver() {
      manual = true; paint();
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(function () {
        manual = false;
        pos = port.scrollTop;                       /* carry on from here */
        var max = port.scrollHeight - port.clientHeight;
        dir = (max > 0 && pos > max - 8) ? -1 : 1;  /* do not bounce off the end */
        paint();
      }, RESUME_MS);
    }

    ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (evt) {
      port.addEventListener(evt, takeOver, { passive: true });
    });

    frame.addEventListener('mouseenter', function () { hovering = true; paint(); });
    frame.addEventListener('mouseleave', function () { hovering = false; paint(); });
    port.addEventListener('focusin',  function () { hovering = true; paint(); });
    port.addEventListener('focusout', function () { hovering = false; paint(); });

    function step(now) {
      requestAnimationFrame(step);
      if (!last) { last = now; pos = port.scrollTop; return; }
      var dt = Math.min(64, now - last);
      last = now;

      if (!visible || hovering || manual) { pos = port.scrollTop; return; }

      var max = port.scrollHeight - port.clientHeight;
      if (max <= 0) return;

      pos += dir * SPEED * (dt / 1000);
      if (pos <= 0)        { pos = 0;   dir = 1; }
      else if (pos >= max) { pos = max; dir = -1; }
      port.scrollTop = pos;
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { visible = e.isIntersecting; });
      }, { threshold: 0.2 }).observe(frame);
    } else { visible = true; }

    requestAnimationFrame(step);
  });
})();

/* Showcase tiles open their case study.

   The original modal wiring sits inside the same branch that only runs when a
   browser LACKS CSS scroll-driven animations, so on every modern browser these
   eight tiles have been inert — clicking one did nothing at all. Rather than
   revive a modal we cannot reach from here, each tile now navigates to its own
   case study page, which is richer, linkable and indexable. The markup is
   untouched, so hover states and the wall layout are exactly as they were. */
(function () {
  var stage = document.getElementById('sc-track');
  if (!stage) return;
  if (typeof window.openCase === 'function') return;   /* modal alive? leave it alone */

  stage.addEventListener('click', function (e) {
    var tile = e.target.closest('.sc-tile[data-project]');
    if (!tile) return;
    var slug = tile.getAttribute('data-project');
    if (!slug) return;
    e.preventDefault();
    window.location.href = '/work/' + slug + '/';
  });

  /* Make the affordance honest for keyboard and assistive tech. */
  [].slice.call(stage.querySelectorAll('.sc-tile[data-project]')).forEach(function (t) {
    var name = t.getAttribute('data-project');
    if (!t.getAttribute('aria-label')) {
      t.setAttribute('aria-label', 'View the ' + name + ' case study');
    }
    t.style.cursor = 'pointer';
  });
})();
