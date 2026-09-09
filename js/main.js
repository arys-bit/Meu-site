(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  /* ============ Project portfolio modal ============ */
  const projectData = {
    trancapro: { kicker: '01 · Sistema de gestão', title: 'TrançaPro', image: 'assets/projects/trancapro.webp', description: 'Sistema responsivo pensado para trancistas administrarem agenda, clientes, faturamento, estoque e relatórios em um único lugar.', solution: 'Gestão para trancistas', focus: 'Agenda e financeiro', tags: ['Dashboard', 'Sistema responsivo', 'Gestão'] },
    beautyloja: { kicker: '02 · Landing page', title: 'Beauty Loja', image: 'assets/projects/beauty-loja.webp', description: 'Landing page elegante para salão de beleza, criada para apresentar serviços, gerar confiança e facilitar ligações e agendamentos.', solution: 'Presença digital', focus: 'Conversão e agendamento', tags: ['HTML', 'CSS', 'Landing page'] },
    aliciabraids: { kicker: '03 · Site comercial', title: 'Alicia Braids', image: 'assets/projects/alicia-braids.webp', description: 'Experiência digital vibrante para uma profissional de tranças divulgar serviços, trabalhos, cursos e atendimento pelo WhatsApp.', solution: 'Site para trancista', focus: 'Marca e captação', tags: ['Design responsivo', 'WhatsApp', 'Experiência visual'] },
    novacheck: { kicker: '04 · Sistema de Self-Checkout', title: 'Nova Check', image: 'assets/projects/nova-check.webp', description: 'Terminal de autoatendimento intuitivo para escanear produtos, ajustar quantidades, acompanhar o total da compra e avançar com segurança para o pagamento.', solution: 'Autoatendimento no varejo', focus: 'Compra rápida e acessível', tags: ['Self-checkout', 'Fluxo de pagamento', 'Acessibilidade', 'Interface touch'] }
  };

  const projectModal = document.getElementById('projectModal');
  const projectModalImage = document.getElementById('projectModalImage');
  const projectModalKicker = document.getElementById('projectModalKicker');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalDescription = document.getElementById('projectModalDescription');
  const projectModalSolution = document.getElementById('projectModalSolution');
  const projectModalFocus = document.getElementById('projectModalFocus');
  const projectModalTags = document.getElementById('projectModalTags');

  function openProjectModal(key) {
    const project = projectData[key];
    if (!project || !projectModal) return;
    const visual = projectModalImage.closest('.project-modal__visual');
    visual?.classList.add('is-loading');
    projectModalImage.onload = () => visual?.classList.remove('is-loading');
    projectModalImage.onerror = () => visual?.classList.remove('is-loading');
    projectModalImage.src = project.image;
    projectModalImage.alt = `Prévia do projeto ${project.title}`;
    projectModalKicker.textContent = project.kicker;
    projectModalTitle.textContent = project.title;
    projectModalDescription.textContent = project.description;
    projectModalSolution.textContent = project.solution;
    projectModalFocus.textContent = project.focus;
    projectModalTags.innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join('');
    projectModal.showModal();
    document.body.classList.add('modal-open');
  }

  document.querySelectorAll('.project-open').forEach((button) => button.addEventListener('click', () => openProjectModal(button.dataset.project)));
  projectModal?.querySelector('.project-modal__close')?.addEventListener('click', () => projectModal.close());
  projectModal?.addEventListener('click', (event) => { if (event.target === projectModal) projectModal.close(); });
  projectModal?.addEventListener('close', () => document.body.classList.remove('modal-open'));

  /* ============ Starfield background ============ */
  const starCanvas = document.getElementById('starfield');
  const starCtx = starCanvas.getContext('2d');
  let stars = [];
  let sw = 0, sh = 0;
  let pointer = { x: 0, y: 0, active: false };

  function resizeStarfield() {
    sw = starCanvas.width = window.innerWidth;
    sh = starCanvas.height = window.innerHeight;
    const density = Math.min(160, Math.floor((sw * sh) / 9000));
    stars = Array.from({ length: density }, () => ({
      x: Math.random() * sw,
      y: Math.random() * sh,
      r: Math.random() * 1.3 + 0.3,
      big: Math.random() > 0.94,
      speed: Math.random() * 0.4 + 0.15,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function drawStarfield(time) {
    starCtx.clearRect(0, 0, sw, sh);
    const parallaxX = pointer.active ? (pointer.x - sw / 2) / sw : 0;
    const parallaxY = pointer.active ? (pointer.y - sh / 2) / sh : 0;

    for (const s of stars) {
      const twinkle = reduceMotion ? 0.8 : 0.55 + Math.sin(time * 0.001 * s.speed + s.phase) * 0.45;
      const px = s.x - parallaxX * 14 * (s.big ? 2 : 1);
      const py = s.y - parallaxY * 14 * (s.big ? 2 : 1);
      starCtx.beginPath();
      starCtx.fillStyle = `rgba(${s.big ? '196,163,255' : '246,244,251'}, ${Math.max(0.08, twinkle)})`;
      starCtx.arc(px, py, s.big ? s.r * 2.4 : s.r, 0, Math.PI * 2);
      starCtx.fill();
      if (s.big) {
        starCtx.beginPath();
        const grad = starCtx.createRadialGradient(px, py, 0, px, py, s.r * 10);
        grad.addColorStop(0, `rgba(155,107,255,${0.25 * twinkle})`);
        grad.addColorStop(1, 'rgba(155,107,255,0)');
        starCtx.fillStyle = grad;
        starCtx.arc(px, py, s.r * 10, 0, Math.PI * 2);
        starCtx.fill();
      }
    }
    if (!reduceMotion) requestAnimationFrame(drawStarfield);
  }

  resizeStarfield();
  window.addEventListener('resize', resizeStarfield);
  requestAnimationFrame(drawStarfield);
  if (reduceMotion) drawStarfield(0);

  /* ============ Hero-local cinematic cosmos ============ */
  const hero = document.querySelector('.hero');
  const heroCosmos = document.getElementById('hero-cosmos');
  const heroCosmosCtx = heroCosmos && heroCosmos.getContext('2d');
  let heroStars = [];
  let heroW = 0;
  let heroH = 0;
  let heroDpr = 1;

  function resizeHeroCosmos() {
    if (!hero || !heroCosmosCtx) return;
    const rect = hero.getBoundingClientRect();
    heroDpr = Math.min(window.devicePixelRatio || 1, 2);
    heroW = Math.max(1, Math.round(rect.width));
    heroH = Math.max(1, Math.round(rect.height));
    heroCosmos.width = Math.round(heroW * heroDpr);
    heroCosmos.height = Math.round(heroH * heroDpr);
    heroCosmosCtx.setTransform(heroDpr, 0, 0, heroDpr, 0, 0);

    const count = Math.min(330, Math.max(180, Math.floor((heroW * heroH) / 5200)));
    heroStars = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * heroW,
      y: Math.random() * heroH,
      r: Math.random() < 0.026 ? Math.random() * 1.25 + 1 : Math.random() * 0.78 + 0.22,
      alpha: Math.random() * 0.62 + 0.16,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.001 + 0.00035,
      violet: i % 9 === 0,
    }));
  }

  function drawHeroCosmos(time = 0) {
    if (!heroCosmosCtx) return;
    heroCosmosCtx.clearRect(0, 0, heroW, heroH);

    const glowX = heroW * 0.76;
    const glowY = heroH * 0.34;
    const nebula = heroCosmosCtx.createRadialGradient(glowX, glowY, 0, glowX, glowY, heroW * 0.38);
    nebula.addColorStop(0, 'rgba(155,107,255,0.065)');
    nebula.addColorStop(0.38, 'rgba(106,63,196,0.038)');
    nebula.addColorStop(1, 'rgba(6,3,11,0)');
    heroCosmosCtx.fillStyle = nebula;
    heroCosmosCtx.fillRect(0, 0, heroW, heroH);

    for (const star of heroStars) {
      const pulse = reduceMotion ? 1 : 0.68 + Math.sin(time * star.speed + star.phase) * 0.32;
      const alpha = Math.max(0.08, star.alpha * pulse);
      if (star.r > 1.15) {
        const halo = heroCosmosCtx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 8);
        halo.addColorStop(0, star.violet ? `rgba(196,163,255,${alpha * 0.45})` : `rgba(255,255,255,${alpha * 0.42})`);
        halo.addColorStop(1, 'rgba(155,107,255,0)');
        heroCosmosCtx.fillStyle = halo;
        heroCosmosCtx.beginPath();
        heroCosmosCtx.arc(star.x, star.y, star.r * 8, 0, Math.PI * 2);
        heroCosmosCtx.fill();
      }
      heroCosmosCtx.fillStyle = star.violet
        ? `rgba(196,163,255,${alpha})`
        : `rgba(246,244,251,${alpha})`;
      heroCosmosCtx.beginPath();
      heroCosmosCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      heroCosmosCtx.fill();
    }

    if (!reduceMotion) requestAnimationFrame(drawHeroCosmos);
  }

  if (heroCosmosCtx) {
    resizeHeroCosmos();
    window.addEventListener('resize', resizeHeroCosmos);
    requestAnimationFrame(drawHeroCosmos);
    if (reduceMotion) drawHeroCosmos(0);
  }

  const heroWorkspace = document.querySelector('.hero-workspace');
  const heroWorkspaceVideo = document.querySelector('.hero-workspace__media');
  if (heroWorkspaceVideo) {
    // The native `autoplay` attribute can silently fail to start playback
    // (browser quirks, extensions, some embedded contexts) even when muted;
    // request play explicitly as a fallback, same as the experience video.
    const startHeroVideo = () => heroWorkspaceVideo.play().catch(() => {});
    if (heroWorkspaceVideo.readyState >= 2) startHeroVideo();
    else heroWorkspaceVideo.addEventListener('canplay', startHeroVideo, { once: true });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && heroWorkspaceVideo.paused) startHeroVideo();
    });
  }
  if (heroWorkspace && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    heroWorkspace.addEventListener('pointermove', (event) => {
      const rect = heroWorkspace.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroWorkspace.style.setProperty('--workspace-rotate-y', `${(x * 5).toFixed(2)}deg`);
      heroWorkspace.style.setProperty('--workspace-rotate-x', `${(-y * 4).toFixed(2)}deg`);
    });
    heroWorkspace.addEventListener('pointerleave', () => {
      heroWorkspace.style.setProperty('--workspace-rotate-y', '0deg');
      heroWorkspace.style.setProperty('--workspace-rotate-x', '0deg');
    });
  }

  /* The experience video is click-to-play (no autoplay/muted/loop): the
     native <video controls> element handles play/pause/volume/replay on its
     own, so no JS is needed here. */

  /* ============ Tech facades: staggered activation on scroll ============ */
  const techNodes = document.querySelectorAll('.tech-node');
  if (techNodes.length) {
    const techGrid = document.querySelector('.tech-grid');
    const lightTechGrid = () => techNodes.forEach((node) => node.classList.add('is-lit'));
    if (reduceMotion) {
      lightTechGrid();
    } else {
      const techObserver = new IntersectionObserver((entries, observer) => {
        if (!entries[0].isIntersecting) return;
        lightTechGrid();
        observer.disconnect();
      }, { threshold: 0.2 });
      if (techGrid) techObserver.observe(techGrid);
      else lightTechGrid();
    }
  }

  /* ============ About: progressive number count-up ============ */
  const aboutFacts = document.querySelectorAll('.about-facts strong');
  if (aboutFacts.length) {
    const animateCount = (el) => {
      const raw = el.textContent.trim();
      const match = raw.match(/^([^\d]*)(\d+)([^\d]*)$/);
      if (!match) return;
      const [, prefix, digits, suffix] = match;
      const target = Number.parseInt(digits, 10);
      if (reduceMotion || !target) return;
      const duration = 1400;
      const start = performance.now();
      el.textContent = `${prefix}0${suffix}`;
      function tick(now) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };
    const factsObserver = new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) return;
      aboutFacts.forEach((el, i) => setTimeout(() => animateCount(el), i * 160));
      observer.disconnect();
    }, { threshold: 0.5 });
    const aboutFactsEl = document.querySelector('.about-facts');
    if (aboutFactsEl) factsObserver.observe(aboutFactsEl);
  }

  /* ============ Business solutions toggle: Landing page vs Sistema ============ */
  const bizData = {
    landing: {
      title: 'Landing page',
      icon: 'ph-rocket-launch',
      image: 'assets/projects/beauty-loja.webp',
      imagePosition: 'center top',
      imageAlt: 'Prévia real de uma landing page criada pela Ary Labs Studio',
      benefits: [
        'Apresenta um serviço ou produto com clareza',
        'Direciona o visitante para uma ação específica',
        'Aumenta contatos e pedidos de orçamento',
        'Facilita o atendimento pelo WhatsApp',
        'Fortalece a credibilidade do negócio',
        'Funciona perfeitamente no celular',
        'Apoia campanhas e anúncios',
      ],
    },
    system: {
      title: 'Sistema personalizado',
      icon: 'ph-gear-six',
      image: 'assets/projects/trancapro.webp',
      imagePosition: 'left top',
      imageAlt: 'Prévia real de um painel de sistema criado pela Ary Labs Studio',
      benefits: [
        'Organiza clientes e informações',
        'Automatiza tarefas repetitivas',
        'Controla agendamentos, pedidos ou estoque',
        'Reduz erros e retrabalho',
        'Economiza tempo no dia a dia',
        'Centraliza processos importantes',
        'Cresce junto com o negócio',
      ],
    },
  };

  const bizButtons = document.querySelectorAll('.biz-option');
  const bizPanel = document.querySelector('.biz-panel');
  const bizImage = document.getElementById('bizImage');
  const bizTitle = document.getElementById('bizTitle');
  const bizIcon = document.getElementById('bizIcon');
  const bizList = document.getElementById('bizBenefits');

  function selectBiz(key) {
    const data = bizData[key];
    if (!data || !bizPanel) return;
    bizButtons.forEach((btn) => {
      const active = btn.dataset.biz === key;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
      btn.tabIndex = active ? 0 : -1;
    });
    if (bizTitle) bizTitle.textContent = data.title;
    if (bizIcon) bizIcon.className = `ph ${data.icon}`;
    if (bizList) {
      bizList.innerHTML = data.benefits
        .map((b) => `<li><i class="ph ph-check-circle" aria-hidden="true"></i><span>${b}</span></li>`)
        .join('');
    }
    if (bizImage) {
      bizImage.closest('.biz-visual')?.classList.add('is-loading');
      bizImage.onload = () => bizImage.closest('.biz-visual')?.classList.remove('is-loading');
      bizImage.onerror = () => bizImage.closest('.biz-visual')?.classList.remove('is-loading');
      bizImage.src = data.image;
      bizImage.alt = data.imageAlt;
      bizImage.style.objectPosition = data.imagePosition || 'center';
    }
    bizPanel.classList.remove('is-changing');
    void bizPanel.offsetWidth;
    bizPanel.classList.add('is-changing');
  }

  if (bizButtons.length) {
    bizButtons.forEach((btn) => btn.addEventListener('click', () => selectBiz(btn.dataset.biz)));
    bizButtons.forEach((btn, index) => btn.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = bizButtons.length - 1;
      else if (event.key === 'ArrowRight') next = (index + 1) % bizButtons.length;
      else next = (index - 1 + bizButtons.length) % bizButtons.length;
      bizButtons[next].focus();
      selectBiz(bizButtons[next].dataset.biz);
    }));
    const initialBiz = document.querySelector('.biz-option.is-active')?.dataset.biz || 'landing';
    selectBiz(initialBiz);
  }

  /* ============ Cursor particle trail ============ */
  if (!isCoarsePointer && !reduceMotion) {
    const trailCanvas = document.getElementById('cursor-trail');
    const trailCtx = trailCanvas.getContext('2d');
    let particles = [];

    function resizeTrail() {
      trailCanvas.width = window.innerWidth;
      trailCanvas.height = window.innerHeight;
    }
    resizeTrail();
    window.addEventListener('resize', resizeTrail);

    window.addEventListener('pointermove', (e) => {
      pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
      particles.push({ x: e.clientX, y: e.clientY, life: 1, r: Math.random() * 2 + 1.5 });
      if (particles.length > 60) particles.shift();
    });

    function drawTrail() {
      trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      particles.forEach((p) => {
        p.life -= 0.025;
        p.y -= 0.15;
        trailCtx.beginPath();
        trailCtx.fillStyle = `rgba(155,107,255,${Math.max(p.life * 0.5, 0)})`;
        trailCtx.arc(p.x, p.y, Math.max(0, p.r * p.life), 0, Math.PI * 2);
        trailCtx.fill();
      });
      particles = particles.filter((p) => p.life > 0);
      requestAnimationFrame(drawTrail);
    }
    requestAnimationFrame(drawTrail);
  } else {
    window.addEventListener('pointermove', (e) => {
      pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
    }, { passive: true });
  }

  /* ============ Mobile nav toggle ============ */
  const mobileToggle = document.getElementById('mobileToggle');
  const sideNav = document.querySelector('.side-nav');
  if (window.matchMedia('(max-width: 860px)').matches) {
    mobileToggle.style.display = 'none';
  }

  /* ============ Scrollspy for side nav ============ */
  const navItems = document.querySelectorAll('.nav-item');
  const navMap = { inicio: 0, jornada: 1, projetos: 2, laboratorio: 3, contato: 4 };
  const spySections = Object.keys(navMap).map((id) => document.getElementById(id)).filter(Boolean);

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = navMap[entry.target.id];
          navItems.forEach((item, i) => item.classList.toggle('is-active', i === idx));
          navItems.forEach((item) => item.removeAttribute('aria-current'));
          if (navItems[idx]) navItems[idx].setAttribute('aria-current', 'page');
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );
  spySections.forEach((s) => spyObserver.observe(s));

  /* ============ GSAP animations ============ */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (reduceMotion) gsap.globalTimeline.timeScale(50);

    /* Hero background ambience: bokeh drift + orbit breathing */
    gsap.to('.hero-orbits .bokeh', {
      y: '+=16', duration: 9, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 1.6,
    });
    if (document.querySelector('.hero-orbits .orbit')) {
      gsap.to('.hero-orbits .orbit', {
        opacity: '+=0.06', duration: 7, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 2,
      });
    }

    /* Scroll reveals: distances/durations scale down on narrow viewports so
       motion stays subtle on mobile instead of shifting layout dramatically. */
    const mm = gsap.matchMedia();
    mm.add(
      { isMobile: '(max-width: 640px)', isDesktop: '(min-width: 641px)' },
      (context) => {
        const { isMobile } = context.conditions;
        const d = (dist) => (isMobile ? Math.round(dist * 0.5) : dist);
        const t = (dur) => (isMobile ? Math.max(0.35, +(dur * 0.85).toFixed(2)) : dur);

        gsap.utils.toArray('.section-head, .cta, .about-copy, .contact-form').forEach((el) => {
          gsap.from(el, {
            opacity: 0, y: d(30), duration: t(0.8), ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 82%' },
          });
        });

        gsap.utils.toArray('.timeline-item').forEach((item) => {
          gsap.from(item, {
            opacity: 0, x: isMobile ? -10 : -20, duration: t(0.6), ease: 'power2.out',
            scrollTrigger: {
              trigger: item, start: 'top 82%',
              onEnter: () => item.classList.add('is-seen'),
            },
          });
        });

        gsap.from('.feature-card', {
          opacity: 0, y: d(40), duration: t(0.9), ease: 'power2.out',
          scrollTrigger: { trigger: '.feature-card', start: 'top 80%' },
        });
        gsap.from('.feature-video-slot', {
          opacity: 0, y: d(30), duration: t(1), ease: 'power2.out',
          scrollTrigger: { trigger: '.feature-video-slot', start: 'top 82%' },
        });
        gsap.from('.quote-card', {
          opacity: 0, y: d(30), duration: t(0.8), ease: 'power2.out',
          scrollTrigger: { trigger: '.quote-card', start: 'top 85%' },
        });

        gsap.from('.portrait-frame', {
          opacity: 0, scale: isMobile ? 0.92 : 0.8, duration: t(0.8), ease: 'back.out(1.6)',
          scrollTrigger: { trigger: '.about', start: 'top 78%' },
        });

        gsap.from('.about-facts > div', {
          opacity: 0,
          y: d(24),
          scale: isMobile ? 0.98 : 0.9,
          duration: t(0.65),
          ease: 'back.out(1.45)',
          stagger: 0.14,
          scrollTrigger: { trigger: '.about-facts', start: 'top 88%' },
        });

        /* Solution cards lifting in on scroll, with a light depth stagger */
        gsap.utils.toArray('.solution-card').forEach((card, i) => {
          gsap.from(card, {
            opacity: 0, y: d(36), scale: isMobile ? 0.98 : 0.94, duration: t(0.65), ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 90%' },
            delay: (i % 2) * 0.09,
          });
        });

        /* Projects surging in on scroll */
        gsap.utils.toArray('.project-card').forEach((card, i) => {
          gsap.from(card, {
            opacity: 0, y: d(44), scale: isMobile ? 0.99 : 0.96, duration: t(0.7), ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 88%' },
            delay: (i % 2) * 0.08,
          });
        });

        gsap.from('.biz-window', {
          opacity: 0, y: d(36), duration: t(0.75), ease: 'power2.out',
          scrollTrigger: { trigger: '.biz-window', start: 'top 85%' },
        });

        gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
          gsap.from(card, {
            opacity: 0, y: d(30), duration: t(0.7), ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 88%' },
            delay: (i % 3) * 0.08,
          });
        });

        gsap.from('.contact-side', {
          opacity: 0, y: d(24), duration: t(0.7), ease: 'power2.out',
          scrollTrigger: { trigger: '.contact-side', start: 'top 88%' },
        });

        return () => {
          /* gsap.matchMedia auto-reverts tweens/ScrollTriggers created in this
             context when the breakpoint no longer matches (e.g. rotation). */
        };
      }
    );
  } else {
    document.querySelectorAll('.section-head, .feature-card, .quote-card, .solution-card, .project-card, .biz-window').forEach((el) => {
      el.style.opacity = 1;
    });
  }

  /* ============ Keep ScrollTrigger positions in sync with layout ============ */
  if (window.ScrollTrigger) {
    let refreshTimer;
    window.addEventListener('resize', () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
    }, { passive: true });
    window.addEventListener('orientationchange', () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
    });
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  /* ============ Timeline fill line (CSS var driven, no GSAP CSS-var-on-pseudo support) ============ */
  const timelineEl = document.querySelector('.timeline');
  if (timelineEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const rect = timelineEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.75;
      const total = rect.height + vh * 0.1;
      let progress = (start - rect.top) / total;
      progress = Math.min(1, Math.max(0, progress));
      timelineEl.style.setProperty('--tl-h', `${progress * 100}%`);
    }, { passive: true });
  }

  /* ============ Lab card tilt (subtle, desktop only) ============ */
  if (!isCoarsePointer && !reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap && window.gsap
          ? gsap.to(card, { rotateY: x * 8, rotateX: -y * 8, duration: 0.4, ease: 'power2.out' })
          : (card.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`);
      });
      card.addEventListener('pointerleave', () => {
        window.gsap
          ? gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' })
          : (card.style.transform = '');
      });
    });
  }

  /* Contact form removed — replaced by WhatsApp contact button in markup */

  /* ============ Smooth-scroll offset for fixed layout ============ */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();
