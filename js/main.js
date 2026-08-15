(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  /* ============ Project portfolio modal ============ */
  const projectData = {
    trancapro: { kicker: '01 · Sistema de gestão', title: 'TrançaPro', image: 'assets/projects/trancapro.png', description: 'Sistema responsivo pensado para trancistas administrarem agenda, clientes, faturamento, estoque e relatórios em um único lugar.', solution: 'Gestão para trancistas', focus: 'Agenda e financeiro', tags: ['Dashboard', 'Sistema responsivo', 'Gestão'] },
    beautyloja: { kicker: '02 · Landing page', title: 'Beauty Loja', image: 'assets/projects/beauty-loja.png', description: 'Landing page elegante para salão de beleza, criada para apresentar serviços, gerar confiança e facilitar ligações e agendamentos.', solution: 'Presença digital', focus: 'Conversão e agendamento', tags: ['HTML', 'CSS', 'Landing page'] },
    aliciabraids: { kicker: '03 · Site comercial', title: 'Alicia Braids', image: 'assets/projects/alicia-braids.png', description: 'Experiência digital vibrante para uma profissional de tranças divulgar serviços, trabalhos, cursos e atendimento pelo WhatsApp.', solution: 'Site para trancista', focus: 'Marca e captação', tags: ['Design responsivo', 'WhatsApp', 'Experiência visual'] },
    novacheck: { kicker: '04 · Sistema de Self-Checkout', title: 'Nova Check', image: 'assets/projects/nova-check.png', description: 'Terminal de autoatendimento intuitivo para escanear produtos, ajustar quantidades, acompanhar o total da compra e avançar com segurança para o pagamento.', solution: 'Autoatendimento no varejo', focus: 'Compra rápida e acessível', tags: ['Self-checkout', 'Fluxo de pagamento', 'Acessibilidade', 'Interface touch'] }
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

  /* Seed visible dust even when the GSAP CDN is unavailable. */
  function seedStaticCometDust() {
    const cometPath = document.querySelector('.constellation .comet');
    const dustGroup = document.querySelector('.comet-dust');
    if (!cometPath || !dustGroup || dustGroup.childElementCount) return;
    const svgNS = 'http://www.w3.org/2000/svg';
    const len = cometPath.getTotalLength();
    const offsets = [-12, 8, -6, 14, -10, 6, -15, 10, -4, 12, -8, 5, -11, 7, -5, 10, -7, 4];
    offsets.forEach((offset, i) => {
      const t = 0.04 + (i / (offsets.length - 1)) * 0.88;
      const point = cometPath.getPointAtLength(t * len);
      const next = cometPath.getPointAtLength(Math.min(len, t * len + 1));
      const dx = next.x - point.x;
      const dy = next.y - point.y;
      const mag = Math.hypot(dx, dy) || 1;
      const dot = document.createElementNS(svgNS, 'circle');
      dot.setAttribute('cx', (point.x + (-dy / mag) * offset).toFixed(2));
      dot.setAttribute('cy', (point.y + (dx / mag) * offset).toFixed(2));
      dot.setAttribute('r', (0.8 + (i % 4) * 0.42).toFixed(2));
      dot.setAttribute('opacity', (0.45 + (i % 3) * 0.2).toFixed(2));
      dustGroup.appendChild(dot);
    });
  }

  seedStaticCometDust();

  /* ============ Interactive project laboratory ============ */
  const labProjects = {
    app: {
      index: '01',
      image: 'assets/projects/focusflow.png',
      imageFit: 'cover',
      imagePosition: 'center',
      animation: 'anim-focus',
      title: 'Primeiro app',
      text: 'O começo de tudo: prática, lógica e coragem para construir.',
      kicker: 'PRIMEIRO PROTÓTIPO',
      description: 'Organização, foco e aprendizado em cada detalhe.',
      code: '<main class="focus-flow">\n  <TaskList firstProject />\n  <Progress value={72} />\n</main>',
      tags: ['HTML', 'CSS', 'React', 'UX'],
      icon: 'ph-cube'
    },
    landing: {
      index: '02',
      image: 'assets/projects/beauty-loja.png',
      imageFit: 'cover',
      imagePosition: 'center top',
      animation: 'anim-landing',
      title: 'Landing pages',
      text: 'Páginas que comunicam valor e transformam atenção em ação.',
      kicker: 'DESIGN QUE CONVERTE',
      description: 'Narrativa, hierarquia e performance trabalhando juntas.',
      code: '<LandingPage>\n  <Hero promise="clara" />\n  <CTA intent="conversão" />\n</LandingPage>',
      tags: ['Copy', 'SEO', 'CSS', 'A11y'],
      icon: 'ph-stack'
    },
    interfaces: {
      index: '03',
      image: 'assets/projects/alicia-braids.png',
      imageFit: 'cover',
      imagePosition: 'center',
      animation: 'anim-interfaces',
      title: 'Interfaces interativas',
      text: 'Experiências que engajam e transformam ideias em movimento.',
      kicker: 'DESIGN + CÓDIGO',
      description: 'Interfaces que despertam emoção e geram valor real.',
      code: '<section class="experience">\n  <h1>Ideias em movimento</h1>\n  <Interaction delight="true" />\n</section>',
      tags: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
      icon: 'ph-browser'
    },
    platform: {
      index: '04',
      image: 'assets/projects/trancapro.png',
      imageFit: 'cover',
      imagePosition: 'center',
      animation: 'anim-platform',
      title: 'Plataformas completas',
      text: 'Soluções robustas pensadas para crescer com o seu negócio.',
      kicker: 'PRODUTO ESCALÁVEL',
      description: 'Arquitetura, dados e experiência conectados com propósito.',
      code: '<Platform scalable>\n  <Dashboard liveData />\n  <DesignSystem />\n</Platform>',
      tags: ['React', 'API', 'Dados', 'Design System'],
      icon: 'ph-database'
    },
    next: {
      index: '05',
      image: 'assets/projects/nova-check.png',
      imageFit: 'cover',
      imagePosition: 'center',
      animation: 'anim-next',
      title: 'Próximo experimento',
      text: 'Novas tecnologias, novas perguntas e muito espaço para criar.',
      kicker: 'EM DESCOBERTA',
      description: 'Um laboratório aberto para projetos que ainda não existem.',
      code: 'experiment.start({\n  curiosity: true,\n  possibilities: Infinity\n});',
      tags: ['IA', 'WebGL', 'Motion', 'Futuro'],
      icon: 'ph-flask'
    }
  };

  const labButtons = document.querySelectorAll('.lab-option');
  const labDisplay = document.querySelector('.lab-display');
  const labPreviewVisual = document.getElementById('labPreviewVisual');
  const labPreviewImage = document.getElementById('labPreviewImage');
  const labPreviewIcon = document.getElementById('labPreviewIcon');

  // Preload images to avoid black frames on swap
  function preloadLabImages() {
    Object.values(labProjects).forEach((p) => {
      const img = new Image();
      img.src = p.image;
    });
  }
  preloadLabImages();

  const animClasses = Object.values(labProjects).map((p) => p.animation);

  function selectLabProject(key) {
    const project = labProjects[key];
    if (!project || !labDisplay) return;
    labButtons.forEach((button) => {
      const active = button.dataset.lab === key;
      button.classList.toggle('is-active', active);
      button.classList.remove('is-selecting');
      if (active) { void button.offsetWidth; button.classList.add('is-selecting'); }
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });

    // textual & metadata updates
    document.querySelector('.display-index').textContent = project.index;
    document.getElementById('labDisplayTitle').textContent = project.title;
    document.getElementById('labDisplayText').textContent = project.text;
    document.getElementById('labDisplayIcon').className = `ph ${project.icon}`;
    document.getElementById('previewKicker').textContent = project.kicker;
    document.getElementById('previewTitle').textContent = project.title;
    document.getElementById('previewDescription').textContent = project.description;
    document.getElementById('labCode').textContent = project.code;
    document.getElementById('labTags').innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join('');

    // visual preview: show loader while swapping image
    if (labPreviewVisual && labPreviewImage) {
      // reset animation classes
      animClasses.forEach((c) => labPreviewVisual.classList.remove(c));
      labPreviewVisual.classList.add('is-loading');
      labPreviewImage.style.opacity = '0';
      labPreviewImage.alt = `Prévia do projeto ${project.title}`;
      labPreviewImage.style.objectFit = project.imageFit || 'cover';
      labPreviewImage.style.objectPosition = project.imagePosition || 'center';

      const finishSwap = () => {
        labPreviewVisual.classList.remove('is-loading');
        labPreviewImage.style.opacity = '1';
        if (!reduceMotion) {
          void labPreviewVisual.offsetWidth;
          labPreviewVisual.classList.add(project.animation);
        }
      };

      // set up load/error handlers then set src
      const onLoad = () => { finishSwap(); labPreviewImage.removeEventListener('load', onLoad); labPreviewImage.removeEventListener('error', onError); };
      const onError = () => { finishSwap(); labPreviewImage.removeEventListener('load', onLoad); labPreviewImage.removeEventListener('error', onError); };
      labPreviewImage.addEventListener('load', onLoad);
      labPreviewImage.addEventListener('error', onError);
      // assign src (may be cached)
      labPreviewImage.src = project.image;
      // update preview icon
      if (labPreviewIcon) labPreviewIcon.className = `ph ${project.icon}`;
    }

    labDisplay.classList.remove('is-changing');
    void labDisplay.offsetWidth;
    labDisplay.classList.add('is-changing');
  }

  labButtons.forEach((button) => button.addEventListener('click', () => selectLabProject(button.dataset.lab)));
  labButtons.forEach((button, index) => button.addEventListener('keydown', (event) => {
    if (!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = labButtons.length - 1;
    else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % labButtons.length;
    else next = (index - 1 + labButtons.length) % labButtons.length;
    labButtons[next].focus();
    selectLabProject(labButtons[next].dataset.lab);
  }));

  // initialize preview based on the active option in the markup
  const initialLab = document.querySelector('.lab-option.is-active')?.dataset.lab || 'interfaces';
  selectLabProject(initialLab);

  /* ============ FocusFlow interactive preview ============ */
  const mockTasks = document.querySelectorAll('.mock-task');
  const mockProgress = document.getElementById('mockProgress');
  const mockRing = document.querySelector('.mock-ring');
  const mockRingFill = document.querySelector('.mock-ring .ring-fill');
  const mockTaskStatus = document.getElementById('mockTaskStatus');
  const ringLength = 213;

  function updateMockProgress() {
    if (!mockProgress || !mockRingFill || !mockRing) return;
    const completed = document.querySelectorAll('.mock-task.done').length;
    const progress = Math.min(100, 44 + completed * 14);
    mockProgress.textContent = `${progress}%`;
    mockRing.setAttribute('aria-label', `Progresso atual: ${progress} por cento`);
    mockRingFill.style.strokeDashoffset = String(ringLength * (1 - progress / 100));
  }

  mockTasks.forEach((task) => {
    task.addEventListener('click', () => {
      const done = task.classList.toggle('done');
      task.setAttribute('aria-pressed', String(done));
      task.classList.remove('is-popping');
      void task.offsetWidth;
      task.classList.add('is-popping');
      if (mockTaskStatus) mockTaskStatus.textContent = `${task.textContent.trim()} ${done ? 'concluída' : 'reaberta'}.`;
      updateMockProgress();
    });
  });
  updateMockProgress();

  const mockBars = document.querySelectorAll('.mock-bar');
  const mockChartNote = document.getElementById('mockChartNote');
  const evolutionDay = document.getElementById('evolutionDay');
  const evolutionFocus = document.getElementById('evolutionFocus');
  const evolutionGrowth = document.getElementById('evolutionGrowth');
  const evolutionMessage = document.getElementById('evolutionMessage');
  mockBars.forEach((bar) => {
    bar.addEventListener('click', () => {
      mockBars.forEach((item) => item.classList.remove('is-active'));
      bar.classList.add('is-active');
      if (mockChartNote) mockChartNote.textContent = bar.dataset.label;
      const [day, value] = bar.dataset.label.split(' · ');
      // mock-insight removed: no insight panel to update
      const numericValue = Number.parseInt(value, 10);
      if (evolutionDay) evolutionDay.textContent = bar.dataset.label;
      if (evolutionFocus) evolutionFocus.textContent = value;
      if (evolutionGrowth) evolutionGrowth.textContent = `${numericValue >= 70 ? '+' : ''}${Math.max(4, numericValue - 58)}%`;
      if (evolutionMessage) evolutionMessage.textContent = numericValue >= 70 ? 'Ótimo ritmo: este dia fortaleceu sua evolução. Preserve esse bloco de foco.' : 'Esse marco mostra onde ajustar o ritmo. Um pequeno avanço já movimenta toda a rota.';
    });
  });

  const focusMetrics = document.querySelector('.feature-mock');
  if (focusMetrics) {
    const playMetricAnimation = () => {
      focusMetrics.classList.remove('is-metric-animated');
      void focusMetrics.offsetWidth;
      focusMetrics.classList.add('is-metric-animated');
    };
    const metricObserver = new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) return;
      playMetricAnimation();
      observer.disconnect();
    }, { threshold: 0.42 });
    metricObserver.observe(focusMetrics);
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

    /* Keep the hero and constellation immediately visible. The original
       entrance timeline could leave the main visual dim or at scale zero
       when external animation timing was interrupted. Ambient motion below
       remains progressive enhancement only. */

    /* Comet dust (static scattered glints) + traveling sparks along the arrow path */
    const cometPath = document.querySelector('.constellation .comet');
    if (cometPath) {
      const len = cometPath.getTotalLength();
      const dustGroup = document.querySelector('.comet-dust');
      const trailGroup = document.querySelector('.comet-trail');
      const svgNS = 'http://www.w3.org/2000/svg';

      if (dustGroup) {
        const dustCount = 7;
        for (let i = 0; i < dustCount; i++) {
          const t = 0.08 + (i / (dustCount - 1)) * 0.84;
          const pt = cometPath.getPointAtLength(t * len);
          const dot = document.createElementNS(svgNS, 'circle');
          dot.setAttribute('cx', pt.x);
          dot.setAttribute('cy', pt.y);
          dot.setAttribute('r', (1.1 + Math.random() * 1.3).toFixed(2));
          dustGroup.appendChild(dot);
          gsap.to(dot, {
            opacity: 0.25, duration: 1.6 + Math.random(), repeat: -1, yoyo: true,
            ease: 'sine.inOut', delay: Math.random() * 2,
          });
        }
      }

      if (trailGroup && !reduceMotion) {
        const sparkCount = 4;
        for (let i = 0; i < sparkCount; i++) {
          const spark = document.createElementNS(svgNS, 'circle');
          spark.setAttribute('r', '2.4');
          spark.setAttribute('class', 'comet-spark');
          trailGroup.appendChild(spark);
          const proxy = { t: i / sparkCount };
          gsap.to(proxy, {
            t: proxy.t + 1, duration: 3.4, repeat: -1, ease: 'none', delay: i * 0.5,
            onUpdate: () => {
              const progress = proxy.t % 1;
              const pt = cometPath.getPointAtLength(progress * len);
              spark.setAttribute('cx', pt.x);
              spark.setAttribute('cy', pt.y);
              spark.setAttribute('opacity', Math.sin(progress * Math.PI).toFixed(2));
            },
          });
        }
      }
    }

    /* Hero background ambience: bokeh drift + orbit breathing */
    gsap.to('.hero-orbits .bokeh', {
      y: '+=16', duration: 9, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 1.6,
    });
    gsap.to('.hero-orbits .orbit', {
      opacity: '+=0.06', duration: 7, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 2,
    });

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
        gsap.from('.mock-frame', {
          opacity: 0, y: d(30), duration: t(1), ease: 'power2.out',
          scrollTrigger: { trigger: '.feature-mock', start: 'top 82%' },
        });
        gsap.from('.quote-card', {
          opacity: 0, y: d(30), duration: t(0.8), ease: 'power2.out',
          scrollTrigger: { trigger: '.quote-card', start: 'top 85%' },
        });

        gsap.from('.portrait-frame', {
          opacity: 0, scale: isMobile ? 0.92 : 0.8, duration: t(0.8), ease: 'back.out(1.6)',
          scrollTrigger: { trigger: '.about', start: 'top 78%' },
        });

        /* Projects surging in on scroll */
        gsap.utils.toArray('.project-card').forEach((card, i) => {
          gsap.from(card, {
            opacity: 0, y: d(44), scale: isMobile ? 0.99 : 0.96, duration: t(0.7), ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 88%' },
            delay: (i % 2) * 0.08,
          });
        });

        gsap.utils.toArray('.tech-grid li').forEach((chip, i) => {
          gsap.from(chip, {
            opacity: 0, y: d(16), duration: t(0.5), ease: 'power2.out',
            scrollTrigger: { trigger: chip, start: 'top 92%' },
            delay: (i % 4) * 0.05,
          });
        });

        gsap.utils.toArray('.lab-card').forEach((card, i) => {
          gsap.from(card, {
            opacity: 0, y: d(36), duration: t(0.7), ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 85%' },
            delay: i * 0.1,
          });
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
    document.querySelectorAll('.constellation .link, .constellation .comet, .constellation .comet-glow-trail').forEach((el) => {
      el.style.removeProperty('stroke-dasharray');
      el.style.removeProperty('stroke-dashoffset');
    });
    document.querySelectorAll('.constellation .node').forEach((el) => {
      el.style.removeProperty('scale');
      el.style.removeProperty('transform');
      el.style.opacity = '1';
    });
    document.querySelectorAll('.section-head, .feature-card, .quote-card, .project-card, .lab-card').forEach((el) => {
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
