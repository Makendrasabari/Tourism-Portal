/**
 * STACKLY TOURISM & TRAVEL PORTAL - MAIN SCRIPT
 * Handles GSAP Preloader Animation, Sticky Navigation, Mobile Drawer,
 * Interactive Filtering, FAQ Accordions, and Form Interactions.
 */

// Strictly suppress native browser alert popups throughout the entire website
window.alert = function() { /* Browser popups disabled */ };

function initMainApp() {
  initPreloader();
  initStickyHeader();
  initMobileDrawer();
  initHeroSlideshow();
  initDestinationFilters();
  initTourFilters();
  initCustomDropdowns();
  initFaqAccordion();
  initContactForm();
  initNewsletterForm();
  initCounters();
  initTestimonialsMarquee();
  initGalleryShuffle();
  initAdventureShuffle();
  initPopularDestinationsSequentialArrange();
  initFeaturedToursShuffle();
  initWhyChooseSequentialArrange();
  initLatestJournalReverseAnimation();
  initPrinciplesReverseAnimation();
  initGalleryEnlightenment();
  initCtaScrollAnimation();
  initHeroTextAnimations();
  initSectionHeadingsAnimation();
  initFootprintGridAnimation();
  initDirectionalScrollAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMainApp);
} else {
  initMainApp();
}

/* ===================================================================
   1. PREMIUM ANIMATED PRELOADER (GSAP + BUILDING REVEAL + FLIGHT PATH)
   =================================================================== */
function initPreloader() {
  const preloader = document.getElementById('stacklyPreloader');
  if (!preloader) return;

  const skipBtn = document.getElementById('skipPreloader');
  const progressBar = document.getElementById('preloaderProgressBar');
  const buildingPaths = document.querySelectorAll('.arch-line, .arch-fill');
  const airplane = document.getElementById('preloaderPlane');
  const logoWrap = document.getElementById('preloaderLogoWrap');
  const brandText = document.getElementById('preloaderBrandText');

  // Check prefers-reduced-motion or return from 404
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isNavReturn = false;
  try {
    isNavReturn = sessionStorage.getItem('stackly_should_restore_scroll') === 'true';
  } catch (e) {}

  if (prefersReduced || isNavReturn) {
    preloader.style.display = 'none';
    window.__stacklyPreloaderDone = true;
    window.dispatchEvent(new CustomEvent('stacklyPreloaderDone'));
    return;
  }

  // Dismiss function
  function closePreloader() {
    if (preloader.classList.contains('fade-out')) return;
    preloader.classList.add('fade-out');
    window.__stacklyPreloaderDone = true;
    window.dispatchEvent(new CustomEvent('stacklyPreloaderDone'));
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 350);
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', closePreloader);
  }
  preloader.addEventListener('click', closePreloader);

  // Absolute failsafe to guarantee preloader closes
  const failsafeTimer = setTimeout(closePreloader, 2100);

  // Check if GSAP is available (calibrated for exactly 2 seconds total preloader)
  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(failsafeTimer);
        closePreloader();
      }
    });

    // 1. Initial State
    gsap.set(buildingPaths, { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' });
    gsap.set(logoWrap, { opacity: 0, scale: 0.75 });
    gsap.set(brandText, { opacity: 0, y: 15 });
    gsap.set(progressBar, { width: '0%' });

    // 2. Timeline Sequence (Total ~1.7s animation + 0.3s fade-out = 2.0s)
    tl.to(progressBar, { width: '45%', duration: 0.45, ease: 'power2.out' })
      .to(buildingPaths, {
        opacity: 1,
        scaleY: 1,
        stagger: 0.03,
        duration: 0.4,
        ease: 'back.out(1.2)'
      }, '-=0.3')
      .to(progressBar, { width: '80%', duration: 0.35, ease: 'power1.inOut' }, '-=0.15')
      .to(logoWrap, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(1.5)'
      }, '-=0.2')
      .to(brandText, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, '-=0.15')
      .to(progressBar, { width: '100%', duration: 0.25, ease: 'power2.out' })
      .to({}, { duration: 0.15 }); // hold briefly at 100%

  } else {
    // Fallback if GSAP is not yet loaded (Total 1.7s)
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      if (progressBar) progressBar.style.width = p + '%';
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(closePreloader, 150);
      }
    }, 150);
  }
}

/* ===================================================================
   2. STICKY HEADER & NAVBAR
   =================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Active page link detection
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu-link, .drawer-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ===================================================================
   3. MOBILE DRAWER NAVIGATION
   =================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerCloseBtn');

  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Automatically close drawer and restore page scrolling when moving to desktop view
  function handleResizeToDesktop() {
    if (window.innerWidth >= 992) {
      if (drawer.classList.contains('open') || (backdrop && backdrop.classList.contains('open'))) {
        closeDrawer();
      } else if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = '';
      }
    }
  }

  window.addEventListener('resize', handleResizeToDesktop, { passive: true });

  const desktopMq = window.matchMedia('(min-width: 992px)');
  if (desktopMq.addEventListener) {
    desktopMq.addEventListener('change', (e) => {
      if (e.matches) closeDrawer();
    });
  } else if (desktopMq.addListener) {
    desktopMq.addListener((e) => {
      if (e.matches) closeDrawer();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ===================================================================
   4. DESTINATION FILTERING & SEARCH
   =================================================================== */
function initDestinationFilters() {
  const filterBtns = document.querySelectorAll('.dest-filter-btn');
  const cards = document.querySelectorAll('.destination-card');
  const searchInput = document.getElementById('destSearchInput');

  if (!filterBtns.length && !cards.length) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    cards.forEach(card => {
      const category = card.dataset.category || '';
      const name = (card.dataset.name || card.querySelector('.destination-name')?.textContent || '').toLowerCase();
      const region = (card.dataset.region || '').toLowerCase();

      const matchesCat = currentCategory === 'all' || category.includes(currentCategory);
      const matchesSearch = !searchQuery || name.includes(searchQuery) || region.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.filter || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // Parse URL search parameters if any (e.g., ?category=india)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  if (catParam) {
    const targetBtn = document.querySelector(`.dest-filter-btn[data-filter="${catParam}"]`);
    if (targetBtn) targetBtn.click();
  }
}

/* ===================================================================
   5. TOUR PACKAGES FILTERING & SORTING
   =================================================================== */
function initTourFilters() {
  const tourCards = document.querySelectorAll('.tour-card');
  const categoryBtns = document.querySelectorAll('.tour-category-btn');
  const sortSelect = document.getElementById('tourSortSelect');
  const searchInput = document.getElementById('tourSearchInput');
  const toursGrid = document.querySelector('.tours-grid');

  if (!tourCards.length) return;

  let activeCat = 'all';
  let searchTerm = '';

  function filterTours() {
    tourCards.forEach(card => {
      const cat = (card.dataset.category || '').toLowerCase();
      const title = (card.querySelector('.tour-title')?.textContent || '').toLowerCase();
      const loc = (card.querySelector('.tour-location')?.textContent || '').toLowerCase();

      const matchesCat = activeCat === 'all' || cat.includes(activeCat);
      const matchesSearch = !searchTerm || title.includes(searchTerm) || loc.includes(searchTerm);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = (btn.dataset.category || 'all').toLowerCase();
      filterTours();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      filterTours();
    });
  }

  if (sortSelect && toursGrid) {
    sortSelect.addEventListener('change', () => {
      const cardsArr = Array.from(tourCards);
      const val = sortSelect.value;

      cardsArr.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price || 0);
        const priceB = parseFloat(b.dataset.price || 0);
        const ratingA = parseFloat(a.dataset.rating || 0);
        const ratingB = parseFloat(b.dataset.rating || 0);

        if (val === 'price-low') return priceA - priceB;
        if (val === 'price-high') return priceB - priceA;
        if (val === 'rating') return ratingB - ratingA;
        return 0;
      });

      cardsArr.forEach(card => toursGrid.appendChild(card));
    });
  }
}

/* ===================================================================
   6. FAQ ACCORDION
   =================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-question-btn');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = item.classList.contains('active');
      faqItems.forEach(i => {
        i.classList.remove('active');
        const btn = i.querySelector('.faq-question-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ===================================================================
   7. CONTACT FORM SUBMISSION
   =================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactUsForm');
  if (!contactForm) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');

  const nameError = document.getElementById('contactNameError');
  const emailError = document.getElementById('contactEmailError');
  const subjectError = document.getElementById('contactSubjectError');
  const messageError = document.getElementById('contactMessageError');
  const successMsg = document.getElementById('contactSuccessMsg');

  function clearError(input, errorEl) {
    if (input) input.classList.remove('is-invalid');
    if (errorEl) {
      errorEl.style.display = 'none';
      errorEl.innerHTML = '';
    }
  }

  function setError(input, errorEl, msg) {
    if (input) input.classList.add('is-invalid');
    if (errorEl) {
      errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`;
      errorEl.style.display = 'flex';
    }
  }

  [nameInput, emailInput, subjectInput, messageInput].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', () => {
        const err = document.getElementById(inp.id + 'Error');
        if (inp.value.trim()) clearError(inp, err);
      });
    }
  });

  // Quick inquiry destination chips toggle & populate
  const chips = document.querySelectorAll('.quick-inquiry-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => {
        c.classList.remove('btn-primary');
        c.classList.add('btn-outline');
      });
      chip.classList.remove('btn-outline');
      chip.classList.add('btn-primary');

      const dest = chip.dataset.dest;
      const sub = chip.dataset.sub;
      const destSelect = document.getElementById('contactDest');
      if (destSelect && dest) {
        destSelect.value = dest;
        const customWrapper = document.getElementById('customDestSelect');
        if (customWrapper) {
          const placeholder = customWrapper.querySelector('.custom-select-placeholder');
          const matchedOpt = customWrapper.querySelector(`.custom-select-option[data-value="${dest}"]`);
          if (placeholder && matchedOpt) {
            placeholder.textContent = matchedOpt.textContent.trim();
            customWrapper.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selected'));
            matchedOpt.classList.add('selected');
          }
        }
      }
      if (subjectInput && sub) {
        subjectInput.value = sub;
        clearError(subjectInput, subjectError);
      }
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (successMsg) successMsg.style.display = 'none';

    let hasError = false;
    let firstInvalid = null;

    if (!nameInput.value.trim()) {
      setError(nameInput, nameError, 'Please enter your full name');
      hasError = true;
      if (!firstInvalid) firstInvalid = nameInput;
    }

    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      setError(emailInput, emailError, 'Please enter the email');
      hasError = true;
      if (!firstInvalid) firstInvalid = emailInput;
    } else if (!emailVal.includes('@') || !emailVal.includes('.')) {
      setError(emailInput, emailError, 'Please enter a valid email address');
      hasError = true;
      if (!firstInvalid) firstInvalid = emailInput;
    }

    if (!subjectInput.value.trim()) {
      setError(subjectInput, subjectError, 'Please enter inquiry subject');
      hasError = true;
      if (!firstInvalid) firstInvalid = subjectInput;
    }

    if (!messageInput.value.trim()) {
      setError(messageInput, messageError, 'Please enter your message');
      hasError = true;
      if (!firstInvalid) firstInvalid = messageInput;
    }

    if (hasError) {
      if (firstInvalid) firstInvalid.focus();
      // Strictly NO toast popup, inline red text only
      return;
    }

    // Success - All required details valid: Navigate to 404 page as requested
    captureNavigationReturnState(contactForm);
    window.location.href = '404.html';
  });
}

/* ===================================================================
   8. NEWSLETTER SUBSCRIPTION & VALIDATION
   - If empty/invalid: show red notification below box "Kindly enter the email"
   - If valid: navigate to 404 page
   =================================================================== */
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form-row');
  forms.forEach(form => {
    form.setAttribute('novalidate', 'true');
    const input = form.querySelector('.newsletter-input');
    const wrapper = form.closest('.newsletter-form-wrapper') || form.parentElement;
    let errorMsg = wrapper ? wrapper.querySelector('.newsletter-error-msg') : null;

    if (!errorMsg && wrapper) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'newsletter-error-msg';
      errorMsg.style.display = 'none';
      errorMsg.setAttribute('role', 'alert');
      wrapper.appendChild(errorMsg);
    }

    // Clear error as user types
    if (input) {
      input.addEventListener('input', () => {
        form.classList.remove('is-invalid');
        if (errorMsg) {
          errorMsg.style.display = 'none';
        }
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input ? input.value.trim() : '';

      // If empty
      if (!val) {
        form.classList.add('is-invalid');
        if (errorMsg) {
          errorMsg.innerHTML = '<i class="fas fa-exclamation-circle" style="color:#ef4444;"></i> <span>Please enter the email</span>';
          errorMsg.style.display = 'inline-flex';
        }
        if (input) input.focus();
        return;
      }

      // If missing email symbols
      if (!val.includes('@') || !val.includes('.')) {
        form.classList.add('is-invalid');
        if (errorMsg) {
          errorMsg.innerHTML = '<i class="fas fa-exclamation-circle" style="color:#ef4444;"></i> <span>Please enter a valid email address</span>';
          errorMsg.style.display = 'inline-flex';
        }
        if (input) input.focus();
        return;
      }

      // Valid email entered: Clear errors and navigate to 404 page
      form.classList.remove('is-invalid');
      if (errorMsg) {
        errorMsg.style.display = 'none';
      }
      captureNavigationReturnState(form);
      window.location.href = '404.html';
      setTimeout(() => {
        window.location.assign('404.html');
      }, 50);
    });
  });
}

/* ===================================================================
   NEWSLETTER CTA SCROLL REVEAL (FROM RIGHT SIDE)
   =================================================================== */
function initCtaScrollAnimation() {
  const ctaBanners = document.querySelectorAll('.cta-banner-enter-right, .cta-banner-enter-down');
  if (!ctaBanners.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    ctaBanners.forEach(banner => observer.observe(banner));
  } else {
    ctaBanners.forEach(banner => banner.classList.add('in-view'));
  }
}

/* ===================================================================
   9. ANIMATED NUMBER COUNTERS (LIVE RUNNING ANIMATION + LIVE TICKER)
   =================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function runCounter(el, onComplete) {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1600; // 1.6s energetic roll-up
    const startTime = performance.now();

    function easeOutExpo(x) {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = Math.floor(eased * target);

      el.innerHTML = `${prefix}${current.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.innerHTML = `${prefix}${target.toLocaleString()}${suffix}`;
        if (onComplete) onComplete();
      }
    }

    requestAnimationFrame(frame);
  }

  // Live real-time runner for all numbers
  function startContinuousLiveRunning(countersList) {
    countersList.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';

      if (el.dataset.liveActive === 'true') return;
      el.dataset.liveActive = 'true';

      // 1. Primary Traveller Counter (24,500+) -> Live booking ticker every 1.5 - 2.8s
      if (target >= 20000) {
        let count = target + 1;
        el.innerHTML = `${prefix}${count.toLocaleString()}${suffix} <span class="stat-live-dot" title="Live Booking Activity Active"></span>`;

        function liveTravellerTick() {
          const delay = Math.floor(Math.random() * 1400) + 1500; // 1.5s - 2.9s
          setTimeout(() => {
            count += 1;
            el.classList.add('stat-number-tick');
            el.innerHTML = `${prefix}${count.toLocaleString()}${suffix} <span class="stat-live-dot" title="Live Booking Activity Active"></span>`;
            setTimeout(() => el.classList.remove('stat-number-tick'), 650);
            liveTravellerTick();
          }, delay);
        }
        liveTravellerTick();
      }

      // 2. Destinations Counter (150+) -> Live Active Expeditions
      else if (target === 150) {
        let base = 150;
        let activeTours = 52;
        el.innerHTML = `${prefix}${base}${suffix} <span class="stat-live-dot" style="background:#3b82f6;" title="Active Global Expeditions"></span>`;

        function liveDestinationsTick() {
          const delay = Math.floor(Math.random() * 2000) + 3000;
          setTimeout(() => {
            activeTours = (activeTours >= 58) ? 48 : activeTours + 1;
            el.classList.add('stat-number-tick');
            el.innerHTML = `${prefix}${base}${suffix} <span class="stat-live-dot" style="background:#3b82f6;" title="${activeTours} Tours Active Right Now"></span>`;
            setTimeout(() => el.classList.remove('stat-number-tick'), 600);
            liveDestinationsTick();
          }, delay);
        }
        liveDestinationsTick();
      }

      // 3. Repeat & Referral Rate / Satisfaction (98% / 99%) -> Live Satisfaction Pulse
      else if (target >= 95 && target <= 100) {
        const rates = [98.6, 98.9, 99.1, 99.4, 98.8];
        let rIndex = 0;
        el.innerHTML = `${target}% <span class="stat-live-dot" style="background:#10b981;" title="Real-time Traveler Satisfaction"></span>`;

        function liveSatisfactionTick() {
          const delay = Math.floor(Math.random() * 2500) + 3500;
          setTimeout(() => {
            rIndex = (rIndex + 1) % rates.length;
            const currentVal = rates[rIndex];
            el.classList.add('stat-number-tick');
            el.innerHTML = `${currentVal}% <span class="stat-live-dot" style="background:#10b981;" title="Real-time Verified Score: ${currentVal}%"></span>`;
            setTimeout(() => el.classList.remove('stat-number-tick'), 600);
            liveSatisfactionTick();
          }, delay);
        }
        liveSatisfactionTick();
      }

      // 4. Operator Hubs (12+) -> Live 24/7 Operations Ping
      else if (target <= 20) {
        el.innerHTML = `${prefix}${target}${suffix} <span class="stat-live-dot" style="background:#8b5cf6;" title="12 Hubs Active 24/7"></span>`;
        function liveHubsTick() {
          const delay = Math.floor(Math.random() * 3000) + 4000;
          setTimeout(() => {
            el.classList.add('stat-number-tick');
            setTimeout(() => el.classList.remove('stat-number-tick'), 600);
            liveHubsTick();
          }, delay);
        }
        liveHubsTick();
      }
    });
  }

  // Trigger running sequence
  let hasRun = false;
  function triggerAllCounters() {
    let completed = 0;
    counters.forEach(c => {
      runCounter(c, () => {
        completed++;
        if (completed === counters.length && !hasRun) {
          hasRun = true;
          startContinuousLiveRunning(counters);
        }
      });
    });
  }

  // Preloader awareness
  const preloader = document.getElementById('stacklyPreloader');
  const isPreloaderActive = preloader && preloader.style.display !== 'none' && !window.__stacklyPreloaderDone;

  if (isPreloaderActive) {
    window.addEventListener('stacklyPreloaderDone', () => {
      triggerAllCounters();
    }, { once: true });
    setTimeout(triggerAllCounters, 2200);
  } else {
    // Observe stats strip
    if ('IntersectionObserver' in window) {
      const statsStrip = document.querySelector('.stats-strip') || counters[0];
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            triggerAllCounters();
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      if (statsStrip) observer.observe(statsStrip);
    } else {
      triggerAllCounters();
    }
  }

  // Interactive re-run on hover or click
  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    statsGrid.style.cursor = 'pointer';
    statsGrid.setAttribute('title', 'Click to re-run live analytics metrics');
    statsGrid.addEventListener('click', () => {
      counters.forEach(c => runCounter(c));
    });
  }
}

/* Notification Toast Helper - Strictly disabled per user request */
function showNotificationToast(msg, type = 'info') {
  // Suppressed: Toast notifications disabled throughout the entire website
  const existingToast = document.getElementById('stacklyToast');
  if (existingToast && existingToast.parentNode) {
    existingToast.parentNode.removeChild(existingToast);
  }
  return;
}
window.showNotificationToast = showNotificationToast;

/* ===================================================================
   10. HOMEPAGE HERO 5-IMAGE CONTINUOUS SLIDESHOW
   =================================================================== */
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slide-indicator-dot');
  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 4500; // 4.5 seconds per slide transition

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function startAutoplay() {
    stopAutoplay();
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function stopAutoplay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startAutoplay();
    });
  });

  const heroWrapper = document.getElementById('homeHeroSection');
  if (heroWrapper) {
    heroWrapper.addEventListener('mouseenter', stopAutoplay);
    heroWrapper.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
}

/* ===================================================================
   CONTINUOUS LIVE RUNNING MARQUEES (TESTIMONIALS & TEAM SHOWCASE)
   =================================================================== */
function initTestimonialsMarquee() {
  const marquees = [
    { wrapper: document.getElementById('testimonialsMarqueeWrapper'), track: document.getElementById('testimonialsMarqueeTrack') },
    { wrapper: document.getElementById('teamMarqueeWrapper'), track: document.getElementById('teamMarqueeTrack') }
  ];

  marquees.forEach(({ wrapper, track }) => {
    if (!wrapper || !track) return;

    // Touch and pointer events for mobile pause
    wrapper.addEventListener('touchstart', () => {
      track.classList.add('is-paused');
    }, { passive: true });

    wrapper.addEventListener('touchend', () => {
      track.classList.remove('is-paused');
    }, { passive: true });
  });
}

/* ===================================================================
   STACKLY TRAVEL GALLERY SHUFFLE & ARRANGE ANIMATION
   When the gallery section enters viewport, the 6 cards dynamically
   shuffle their positions with 3D elevations and rotations, then
   smoothly glide back and arrange into their respective places.
   =================================================================== */
function initGalleryShuffle() {
  const gallerySection = document.getElementById('stacklyTravelGallerySection');
  const grid = document.getElementById('stacklyGalleryGrid') || document.querySelector('.gallery-grid');
  if (!gallerySection || !grid) return;

  const shuffleBtn = document.getElementById('reShuffleGalleryBtn');
  let hasAnimatedOnScroll = false;
  let isShuffling = false;

  function runShuffle() {
    if (isShuffling) return;
    const cards = Array.from(grid.querySelectorAll('.gallery-item'));
    if (!cards.length) return;

    isShuffling = true;
    if (shuffleBtn) {
      shuffleBtn.disabled = true;
      const icon = shuffleBtn.querySelector('i');
      if (icon) icon.classList.add('fa-spin');
    }

    // Kill any active GSAP tweens
    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(cards);
    }

    // Capture resting pixel coordinates relative to the container
    const gridRect = grid.getBoundingClientRect();
    const positions = cards.map(c => {
      const r = c.getBoundingClientRect();
      return {
        x: r.left - gridRect.left,
        y: r.top - gridRect.top
      };
    });

    // Permutation 1: Cards swap across opposite quadrants
    // 0 <-> 4, 1 <-> 3, 2 <-> 5
    const perm1 = [4, 3, 5, 1, 0, 2];

    // Permutation 2: Fast cross-cut before settling
    // 0 <-> 2, 1 <-> 4, 3 <-> 5
    const perm2 = [2, 4, 0, 5, 1, 3];

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({
        onComplete: () => {
          isShuffling = false;
          if (shuffleBtn) {
            shuffleBtn.disabled = false;
            const icon = shuffleBtn.querySelector('i');
            if (icon) icon.classList.remove('fa-spin');
          }
          // Clear transforms so CSS hover works seamlessly
          gsap.set(cards, { clearProps: "transform,zIndex,boxShadow" });
        }
      });

      // Phase 1: Lift & Shuffle into Swapped Slots (0s -> 0.65s)
      cards.forEach((card, i) => {
        const target1 = perm1[i];
        const dx1 = positions[target1].x - positions[i].x;
        const dy1 = positions[target1].y - positions[i].y;
        const rot1 = (i % 2 === 0 ? 1 : -1) * (5 + (i * 1.8));

        tl.to(card, {
          x: dx1,
          y: dy1,
          rotation: rot1,
          scale: 1.05,
          zIndex: 15 + i,
          boxShadow: '0 24px 44px rgba(14, 21, 56, 0.35)',
          duration: 0.65,
          ease: 'power2.out'
        }, 0);
      });

      // Phase 2: Dynamic Mid-Air Shuffle Pass (0.68s -> 1.28s)
      cards.forEach((card, i) => {
        const target2 = perm2[i];
        const dx2 = positions[target2].x - positions[i].x;
        const dy2 = positions[target2].y - positions[i].y;
        const rot2 = (i % 2 === 0 ? -1 : 1) * (4 + (i * 1.5));

        tl.to(card, {
          x: dx2,
          y: dy2,
          rotation: rot2,
          scale: 1.07,
          zIndex: 25 - i,
          boxShadow: '0 30px 54px rgba(14, 21, 56, 0.42)',
          duration: 0.6,
          ease: 'power2.inOut'
        }, 0.68);
      });

      // Phase 3: "Arranged to their respective places" (1.32s -> 2.15s)
      cards.forEach((card, i) => {
        tl.to(card, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          zIndex: 1,
          boxShadow: '0 10px 28px rgba(14, 21, 56, 0.08)',
          duration: 0.75,
          ease: 'back.out(1.5)'
        }, 1.32 + (i * 0.07));
      });

    } else {
      // Fallback if GSAP is unavailable
      setTimeout(() => {
        isShuffling = false;
        if (shuffleBtn) shuffleBtn.disabled = false;
      }, 1500);
    }
  }

  // Trigger automatically when scrolled into view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimatedOnScroll) {
          hasAnimatedOnScroll = true;
          // Small delay so user visually sees the shuffle sequence start
          setTimeout(runShuffle, 350);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -15px 0px' });

    observer.observe(gallerySection);
  } else {
    // Immediate fallback
    setTimeout(runShuffle, 800);
  }

  // Manual trigger button
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      runShuffle();
    });
  }
}

/* ===================================================================
   ADVENTURE & EXPERIENCES - DYNAMIC 4-CARD SHUFFLE & ARRANGE ANIMATION
   When scrolled into view (or triggered via button), the 4 cards
   (Alpine Trekking, Deep Sea Scuba, Sky Paragliding, Starlit Camping)
   dynamically shuffle places across the row/grid with 3D elevations,
   crossover swaps and rotations, and then smoothly glide back into
   their respective places with a fluid spring curve.
   =================================================================== */
function initAdventureShuffle() {
  const section = document.getElementById('adventureExpeditionsSection') || (document.querySelector('.adventure-grid') ? document.querySelector('.adventure-grid').closest('section') : null);
  const grid = document.getElementById('adventureExpeditionsGrid') || document.querySelector('.adventure-grid');
  if (!section || !grid) return;

  const shuffleBtn = document.getElementById('reShuffleAdventureBtn');
  let hasAnimatedOnScroll = false;
  let isShuffling = false;

  function runShuffle() {
    if (isShuffling) return;
    const cards = Array.from(grid.querySelectorAll('.adventure-card'));
    if (!cards.length) return;

    isShuffling = true;
    if (shuffleBtn) {
      shuffleBtn.disabled = true;
      const icon = shuffleBtn.querySelector('i');
      if (icon) icon.classList.add('fa-spin');
    }

    // Kill any active GSAP tweens on cards
    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(cards);
    }

    // Measure dynamic resting coordinates relative to the container
    const gridRect = grid.getBoundingClientRect();
    const positions = cards.map(c => {
      const r = c.getBoundingClientRect();
      return {
        x: r.left - gridRect.left,
        y: r.top - gridRect.top
      };
    });

    // Permutation 1: Cards criss-cross across opposite slots
    // 0 -> 2, 1 -> 3, 2 -> 1, 3 -> 0
    const perm1 = [2, 3, 1, 0];
    const rot1List = [6, -5, 5, -6];

    // Permutation 2: Fast dynamic mid-air swap pass
    // 0 -> 3, 1 -> 0, 2 -> 1, 3 -> 2
    const perm2 = [3, 0, 1, 2];
    const rot2List = [-5, 6, -4, 5];

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({
        onComplete: () => {
          isShuffling = false;
          if (shuffleBtn) {
            shuffleBtn.disabled = false;
            const icon = shuffleBtn.querySelector('i');
            if (icon) icon.classList.remove('fa-spin');
          }
          // Clear GSAP transforms and shadows so native CSS hover works seamlessly
          gsap.set(cards, { clearProps: "transform,zIndex,boxShadow" });
        }
      });

      // Phase 1: Lift & Shuffle into swapped slots (0s -> 0.65s)
      cards.forEach((card, i) => {
        const target1 = perm1[i % perm1.length];
        const dx1 = positions[target1].x - positions[i].x;
        const dy1 = positions[target1].y - positions[i].y;
        const rot1 = rot1List[i % rot1List.length];

        tl.to(card, {
          x: dx1,
          y: dy1,
          rotation: rot1,
          scale: 1.05,
          zIndex: 12 + i,
          boxShadow: '0 24px 48px rgba(14, 21, 56, 0.35)',
          duration: 0.65,
          ease: 'power2.out'
        }, 0);
      });

      // Phase 2: Dynamic Mid-Air Shuffle Pass (0.68s -> 1.28s)
      cards.forEach((card, i) => {
        const target2 = perm2[i % perm2.length];
        const dx2 = positions[target2].x - positions[i].x;
        const dy2 = positions[target2].y - positions[i].y;
        const rot2 = rot2List[i % rot2List.length];

        tl.to(card, {
          x: dx2,
          y: dy2,
          rotation: rot2,
          scale: 1.07,
          zIndex: 22 - i,
          boxShadow: '0 30px 54px rgba(14, 21, 56, 0.42)',
          duration: 0.6,
          ease: 'power2.inOut'
        }, 0.68);
      });

      // Phase 3: Glide smoothly back to their respective places (1.32s -> 2.15s)
      cards.forEach((card, i) => {
        tl.to(card, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          zIndex: 1,
          boxShadow: 'var(--shadow-card, 0 10px 28px rgba(14, 21, 56, 0.08))',
          duration: 0.75,
          ease: 'back.out(1.5)'
        }, 1.32 + (i * 0.08));
      });

    } else {
      setTimeout(() => {
        isShuffling = false;
        if (shuffleBtn) shuffleBtn.disabled = false;
      }, 1500);
    }
  }

  // Auto-trigger when scrolled into view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimatedOnScroll) {
          hasAnimatedOnScroll = true;
          setTimeout(runShuffle, 350);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -15px 0px' });

    observer.observe(section);
  } else {
    setTimeout(runShuffle, 800);
  }

  // Interactive Replay Button
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      runShuffle();
    });
  }
}

/* ===================================================================
   POPULAR TRAVEL DESTINATIONS - 6-CARD SEQUENTIAL 1-BY-1 ARRANGEMENT
   Arranges all 6 destination cards strictly one by one in order:
   1. First card arranges (Bali Island)
   2. Second card arranges (Swiss Alps)
   3. Third card arranges (Maldives Atolls)
   4. Fourth card arranges (Kashmir Valley)
   5. Fifth card arranges (Dubai Horizon)
   6. Sixth card arranges (Manali & Solang)
   =================================================================== */
function initPopularDestinationsSequentialArrange() {
  const section = document.getElementById('popularDestinations');
  const grid = document.getElementById('popularDestinationsGrid') || (section ? section.querySelector('.destinations-grid') : null);
  if (!section || !grid) return;

  const cards = Array.from(grid.querySelectorAll('.destination-card'));
  if (!cards.length) return;

  const arrangeBtn = document.getElementById('reArrangeDestinationsBtn');
  let hasAnimatedOnScroll = false;
  let isArranging = false;

  function runArrange() {
    if (isArranging) return;
    isArranging = true;

    if (arrangeBtn) {
      arrangeBtn.disabled = true;
      const icon = arrangeBtn.querySelector('i');
      if (icon) icon.classList.add('fa-spin');
    }

    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(cards);

      // Card initial positioning coordinates: strictly TOP to DOWN
      const initialConfigs = [
        { x: 0, y: -36, rot: 0 }, // Card 1 (Bali)
        { x: 0, y: -36, rot: 0 }, // Card 2 (Switzerland)
        { x: 0, y: -36, rot: 0 }, // Card 3 (Maldives)
        { x: 0, y: -36, rot: 0 }, // Card 4 (Kashmir)
        { x: 0, y: -36, rot: 0 }, // Card 5 (Dubai)
        { x: 0, y: -36, rot: 0 }  // Card 6 (Manali)
      ];

      // Prime cards for sequential arrangement
      cards.forEach((card, idx) => {
        const cfg = initialConfigs[idx % initialConfigs.length];
        gsap.set(card, {
          opacity: 0,
          x: cfg.x,
          y: cfg.y,
          rotation: cfg.rot,
          scale: 0.95
        });
      });

      const tl = gsap.timeline({
        onComplete: () => {
          isArranging = false;
          if (arrangeBtn) {
            arrangeBtn.disabled = false;
            const icon = arrangeBtn.querySelector('i');
            if (icon) icon.classList.remove('fa-spin');
          }
          // Clear GSAP transforms and opacity so native CSS hover effects work seamlessly
          gsap.set(cards, { clearProps: "transform,opacity" });
          cards.forEach(c => c.classList.add('is-arranged'));
        }
      });

      // Strict sequential 1-by-1 arrangement with 0.23s spacing between cards:
      // Card 1 -> Card 2 -> Card 3 -> Card 4 -> Card 5 -> Card 6
      const baseDuration = 0.65;
      const stepDelay = 0.23;

      cards.forEach((card, idx) => {
        const startTime = 0.05 + (idx * stepDelay);

        tl.to(card, {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: baseDuration,
          ease: 'power2.out'
        }, startTime);
      });

    } else {
      // Fallback if GSAP is unavailable: sequential class addition
      cards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.add('is-arranged');
          if (idx === cards.length - 1) {
            isArranging = false;
            if (arrangeBtn) arrangeBtn.disabled = false;
          }
        }, 80 + idx * 220);
      });
    }
  }

  // Trigger automatically when scrolled into view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimatedOnScroll) {
          hasAnimatedOnScroll = true;
          setTimeout(runArrange, 250);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -10px 0px' });

    observer.observe(section);
  } else {
    setTimeout(runArrange, 600);
  }

  // Interactive Re-arrange Button
  if (arrangeBtn) {
    arrangeBtn.addEventListener('click', () => {
      runArrange();
    });
  }
}

/* ===================================================================
   FEATURED TOUR PACKAGES - DYNAMIC 3-CARD SHUFFLE & ARRANGE ANIMATION
   When scrolled into view (or triggered via button), the 3 tour cards
   (Bali Paradise, Swiss Alps Glacier Express, Maldives Luxury Villa)
   dynamically shuffle places across the row with 3D elevations,
   crossover swaps and rotations, and then smoothly glide back into
   their respective places with a fluid spring curve.
   =================================================================== */
function initFeaturedToursShuffle() {
  const section = document.getElementById('featuredTours') || (document.querySelector('.featured-tours-shuffle-grid') ? document.querySelector('.featured-tours-shuffle-grid').closest('section') : null);
  const grid = document.getElementById('featuredToursGrid') || document.querySelector('.featured-tours-shuffle-grid');
  if (!section || !grid) return;

  const cards = Array.from(grid.querySelectorAll('.tour-card'));
  if (cards.length < 3) return;

  const shuffleBtn = document.getElementById('reShuffleToursBtn');
  let hasAnimatedOnScroll = false;
  let isShuffling = false;

  function runShuffle() {
    if (isShuffling) return;
    isShuffling = true;

    if (shuffleBtn) {
      shuffleBtn.disabled = true;
      const icon = shuffleBtn.querySelector('i');
      if (icon) icon.classList.add('fa-spin');
    }

    // Kill any active GSAP tweens on cards
    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(cards);
    }

    // Measure dynamic resting coordinates relative to the grid container
    const gridRect = grid.getBoundingClientRect();
    const positions = cards.map(c => {
      const r = c.getBoundingClientRect();
      return {
        x: r.left - gridRect.left,
        y: r.top - gridRect.top
      };
    });

    // Permutation 1: Cards swap across opposite columns
    // 0 -> 2 (right), 1 -> 0 (left), 2 -> 1 (center)
    const perm1 = [2, 0, 1];
    const rot1List = [6, -5, 5];

    // Permutation 2: Fast dynamic mid-air swap pass
    // 0 -> 1 (center), 1 -> 2 (right), 2 -> 0 (left)
    const perm2 = [1, 2, 0];
    const rot2List = [-5, 6, -6];

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({
        onComplete: () => {
          isShuffling = false;
          if (shuffleBtn) {
            shuffleBtn.disabled = false;
            const icon = shuffleBtn.querySelector('i');
            if (icon) icon.classList.remove('fa-spin');
          }
          // Clear GSAP transforms and shadows so native CSS hover works seamlessly
          gsap.set(cards, { clearProps: "transform,zIndex,boxShadow" });
        }
      });

      // Phase 1: Lift & Shuffle into swapped slots (0s -> 0.65s)
      cards.forEach((card, i) => {
        const target1 = perm1[i % perm1.length];
        const dx1 = positions[target1].x - positions[i].x;
        const dy1 = positions[target1].y - positions[i].y;
        const rot1 = rot1List[i % rot1List.length];

        tl.to(card, {
          x: dx1,
          y: dy1,
          rotation: rot1,
          scale: 1.05,
          zIndex: 12 + i,
          boxShadow: '0 24px 48px rgba(14, 21, 56, 0.35)',
          duration: 0.65,
          ease: 'power2.out'
        }, 0);
      });

      // Phase 2: Dynamic Mid-Air Shuffle Pass (0.68s -> 1.28s)
      cards.forEach((card, i) => {
        const target2 = perm2[i % perm2.length];
        const dx2 = positions[target2].x - positions[i].x;
        const dy2 = positions[target2].y - positions[i].y;
        const rot2 = rot2List[i % rot2List.length];

        tl.to(card, {
          x: dx2,
          y: dy2,
          rotation: rot2,
          scale: 1.07,
          zIndex: 22 - i,
          boxShadow: '0 30px 54px rgba(14, 21, 56, 0.42)',
          duration: 0.6,
          ease: 'power2.inOut'
        }, 0.68);
      });

      // Phase 3: Glide smoothly back to their respective places (1.32s -> 2.15s)
      cards.forEach((card, i) => {
        tl.to(card, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          zIndex: 1,
          boxShadow: 'var(--shadow-card, 0 10px 28px rgba(14, 21, 56, 0.08))',
          duration: 0.75,
          ease: 'back.out(1.5)'
        }, 1.32 + (i * 0.09));
      });

    } else {
      setTimeout(() => {
        isShuffling = false;
        if (shuffleBtn) shuffleBtn.disabled = false;
      }, 1500);
    }
  }

  // Auto-trigger when scrolled into view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimatedOnScroll) {
          hasAnimatedOnScroll = true;
          setTimeout(runShuffle, 350);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -15px 0px' });

    observer.observe(section);
  } else {
    setTimeout(runShuffle, 800);
  }

  // Interactive Replay Button
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      runShuffle();
    });
  }
}

/* ===================================================================
   WHY TRAVEL WITH STACKLY - SEQUENTIAL 1-BY-1 CARD ARRANGEMENT
   Arranges the feature cards strictly one by one smoothly:
   1. Best Price & Value
   2. Certified Local Guides
   3. 24/7 Global Concierge
   4. Flexible Booking
   =================================================================== */
function initWhyChooseSequentialArrange() {
  const section = document.getElementById('whyChooseSection');
  const grid = document.getElementById('whyChooseGrid') || (section ? section.querySelector('.why-choose-grid') : null);
  if (!section || !grid) return;

  const cards = Array.from(grid.querySelectorAll('.feature-box'));
  if (!cards.length) return;

  const arrangeBtn = document.getElementById('reArrangeWhyChooseBtn');
  let hasAnimatedOnScroll = false;
  let isArranging = false;

  function runArrange() {
    if (isArranging) return;
    isArranging = true;

    if (arrangeBtn) {
      arrangeBtn.disabled = true;
      const icon = arrangeBtn.querySelector('i');
      if (icon) icon.classList.add('fa-spin');
    }

    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(cards);

      // 4-card starting configuration: strictly TOP to DOWN
      const initialConfigs = [
        { x: 0, y: -32, rot: 0 },
        { x: 0, y: -32, rot: 0 },
        { x: 0, y: -32, rot: 0 },
        { x: 0, y: -32, rot: 0 }
      ];

      cards.forEach((card, idx) => {
        const cfg = initialConfigs[idx % initialConfigs.length];
        gsap.set(card, {
          opacity: 0,
          x: cfg.x,
          y: cfg.y,
          rotation: cfg.rot,
          scale: 0.95
        });
      });

      const tl = gsap.timeline({
        onComplete: () => {
          isArranging = false;
          if (arrangeBtn) {
            arrangeBtn.disabled = false;
            const icon = arrangeBtn.querySelector('i');
            if (icon) icon.classList.remove('fa-spin');
          }
          // Clear GSAP transforms and opacity so native CSS hover (black light aura) works seamlessly
          gsap.set(cards, { clearProps: "transform,opacity" });
          cards.forEach(c => c.classList.add('is-arranged'));
        }
      });

      // Strict sequential 1-by-1 arrangement with 0.23s spacing
      const baseDuration = 0.65;
      const stepDelay = 0.23;

      cards.forEach((card, idx) => {
        const startTime = 0.05 + (idx * stepDelay);

        tl.to(card, {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: baseDuration,
          ease: 'power2.out'
        }, startTime);
      });

    } else {
      // Fallback
      cards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.add('is-arranged');
          if (idx === cards.length - 1) {
            isArranging = false;
            if (arrangeBtn) arrangeBtn.disabled = false;
          }
        }, 80 + idx * 220);
      });
    }
  }

  // Trigger automatically when scrolled into view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimatedOnScroll) {
          hasAnimatedOnScroll = true;
          setTimeout(runArrange, 250);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -10px 0px' });

    observer.observe(section);
  } else {
    setTimeout(runArrange, 600);
  }

  // Interactive Re-arrange Button
  if (arrangeBtn) {
    arrangeBtn.addEventListener('click', () => {
      runArrange();
    });
  }
}

/* ===================================================================
   LATEST FROM STACKLY JOURNAL - REVERSE CARD ARRIVAL ANIMATION
   Arranges the 3 cards in reverse sequence:
   1. Third card arrives first (Maldives / Right)
   2. Second card arrives second (Swiss Alps / Center)
   3. First card arrives third / last (Bali / Left)
   =================================================================== */
function initLatestJournalReverseAnimation() {
  const section = document.getElementById('latestJournalSection');
  const grid = document.getElementById('latestJournalGrid') || (section ? section.querySelector('.three-card-grid') : null);
  if (!section || !grid) return;

  const cards = Array.from(grid.querySelectorAll('.journal-card-rev, .blog-card'));
  if (cards.length < 3) return;

  const card1 = cards[0]; // Bali (Left)
  const card2 = cards[1]; // Swiss Alps (Center)
  const card3 = cards[2]; // Maldives (Right)

  let hasAnimated = false;

  function runReverseArrival() {
    if (hasAnimated) return;
    hasAnimated = true;

    grid.classList.add('in-view');

    if (typeof gsap !== 'undefined') {
      // Set initial top-to-down vertical offsets:
      gsap.set(card3, { opacity: 0, x: 0, y: -30 });
      gsap.set(card2, { opacity: 0, x: 0, y: -30 });
      gsap.set(card1, { opacity: 0, x: 0, y: -30 });

      const tl = gsap.timeline({
        onComplete: () => {
          // Clear transform/opacity so CSS hover works smoothly
          gsap.set([card1, card2, card3], { clearProps: "transform,opacity" });
          [card1, card2, card3].forEach(c => c.classList.add('is-arrived'));
        }
      });

      // 1. THIRD CARD ARRIVES FIRST (Right - Maldives)
      tl.to(card3, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.82,
        ease: "power3.out"
      }, 0.1);

      // 2. SECOND CARD ARRIVES SECOND (Center - Swiss Alps)
      tl.to(card2, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.82,
        ease: "power3.out"
      }, 0.48);

      // 3. FIRST CARD ARRIVES THIRD (Left - Bali)
      tl.to(card1, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.82,
        ease: "power3.out"
      }, 0.86);

    } else {
      // CSS Fallback
      card3.classList.add('is-arrived');
      setTimeout(() => card2.classList.add('is-arrived'), 380);
      setTimeout(() => card1.classList.add('is-arrived'), 760);
    }
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          runReverseArrival();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -10px 0px' });

    observer.observe(section);
  } else {
    setTimeout(runReverseArrival, 500);
  }
}

/* ===================================================================
   ABOUT US: GUIDING PRINCIPLES - REVERSE CARD ARRIVAL ANIMATION
   Arranges the 3 cards in reverse sequence:
   1. Third card arrives first (Travel Philosophy / Right)
   2. Second card arrives second (Our Vision / Center)
   3. First card arrives third / last (Our Mission / Left)
   =================================================================== */
function initPrinciplesReverseAnimation() {
  const grid = document.getElementById('principlesReverseGrid') || document.querySelector('.principles-reverse-grid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.principle-card-rev, .principle-card'));
  if (cards.length < 3) return;

  const card1 = cards[0]; // Mission (Left)
  const card2 = cards[1]; // Vision (Center)
  const card3 = cards[2]; // Philosophy (Right)

  let hasAnimated = false;

  function runReverseArrival() {
    if (hasAnimated) return;
    hasAnimated = true;

    grid.classList.add('in-view');

    if (typeof gsap !== 'undefined') {
      // Set initial top-to-down vertical offsets:
      gsap.set(card3, { opacity: 0, x: 0, y: -30 });
      gsap.set(card2, { opacity: 0, x: 0, y: -30 });
      gsap.set(card1, { opacity: 0, x: 0, y: -30 });

      const tl = gsap.timeline({
        onComplete: () => {
          // Clear transform/opacity so CSS hover image reveals work flawlessly
          gsap.set([card1, card2, card3], { clearProps: "transform,opacity" });
          [card1, card2, card3].forEach(c => c.classList.add('is-arrived'));
        }
      });

      // 1. THIRD CARD ARRIVES FIRST (Right - Travel Philosophy)
      tl.to(card3, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.82,
        ease: "power3.out"
      }, 0.1);

      // 2. SECOND CARD ARRIVES SECOND (Center - Our Vision)
      tl.to(card2, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.82,
        ease: "power3.out"
      }, 0.48);

      // 3. FIRST CARD ARRIVES THIRD (Left - Our Mission)
      tl.to(card1, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.82,
        ease: "power3.out"
      }, 0.86);

    } else {
      // CSS Fallback
      card3.classList.add('is-arrived');
      setTimeout(() => card2.classList.add('is-arrived'), 380);
      setTimeout(() => card1.classList.add('is-arrived'), 760);
    }
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          runReverseArrival();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -10px 0px' });

    observer.observe(grid);
  } else {
    setTimeout(runReverseArrival, 500);
  }
}

/* ===================================================================
   STACKLY TRAVEL GALLERY CLICK ENLIGHTENMENT
   At the time of clicking or hovering any of the 6 gallery cards,
   they are enlightened with active continuous black color light radiance
   =================================================================== */
function initGalleryEnlightenment() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  galleryItems.forEach((item) => {
    // Clicking toggles / activates continuous black light illumination
    item.addEventListener('click', () => {
      item.classList.toggle('is-enlightened');
    });

    // Keyboard support (Enter / Space)
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
}

/* ===================================================================
   HERO TYPOGRAPHY ANIMATION SYSTEM (ALL WEB PAGES)
   - Bold white letters arrive from right side one by one (staggered cascade)
   - Small letter description arrives line by line from right side
   =================================================================== */
function splitDescriptionIntoLines(text) {
  const trimmed = text.trim().replace(/\s+/g, ' ');

  // Home Page custom split matching user request:
  // Line 1: Explore breathtaking destinations, discover unforgettable experiences,
  // Line 2: and plan your next adventure with Stackly.
  if (trimmed.toLowerCase().includes('plan your next adventure')) {
    const andIdx = trimmed.indexOf('and plan your next adventure');
    if (andIdx !== -1) {
      return [trimmed.slice(0, andIdx).trim(), trimmed.slice(andIdx).trim()];
    }
    const planIdx = trimmed.indexOf('plan your next adventure');
    if (planIdx !== -1) {
      return [trimmed.slice(0, planIdx).trim(), trimmed.slice(planIdx).trim()];
    }
  }

  // Question mark split
  if (trimmed.includes('?')) {
    const parts = trimmed.split('?');
    if (parts.length >= 2 && parts[1].trim()) {
      return [parts[0].trim() + '?', parts.slice(1).join('?').trim()];
    }
  }

  // Split around comma or conjunction near the middle
  const words = trimmed.split(' ');
  if (words.length >= 8) {
    const mid = Math.floor(words.length / 2);
    let splitIdx = -1;

    // Look for comma near middle
    for (let offset = 0; offset <= 3; offset++) {
      if (mid + offset < words.length && words[mid + offset].endsWith(',')) {
        splitIdx = mid + offset + 1;
        break;
      }
      if (mid - offset >= 0 && words[mid - offset].endsWith(',')) {
        splitIdx = mid - offset + 1;
        break;
      }
    }

    // Look for conjunction near middle
    if (splitIdx === -1) {
      for (let offset = 0; offset <= 3; offset++) {
        const w = (words[mid + offset] || '').toLowerCase();
        if (w === 'and' || w === 'with' || w === 'across' || w === 'from' || w === 'for') {
          splitIdx = mid + offset;
          break;
        }
      }
    }

    if (splitIdx !== -1 && splitIdx > 2 && splitIdx < words.length - 2) {
      return [words.slice(0, splitIdx).join(' '), words.slice(splitIdx).join(' ')];
    }

    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }

  return [trimmed];
}

function initHeroTextAnimations() {
  const titles = document.querySelectorAll('.hero-title, .page-hero-title, .page-hero h1');
  const descs = document.querySelectorAll('.hero-description, .page-hero-desc');

  if (!titles.length && !descs.length) return;

  function runAnimation() {
    titles.forEach(titleEl => {
      if (titleEl.dataset.heroLettersDone) return;
      titleEl.dataset.heroLettersDone = 'true';

      const rawText = titleEl.textContent.trim().replace(/\s+/g, ' ');
      const words = rawText.split(' ');
      titleEl.innerHTML = '';

      let letterIndex = 0;
      const baseDelay = 0.12; // Start quickly
      const letterStep = 0.032; // 32ms per letter for smooth, lively cascade

      words.forEach((word) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'hero-word';

        for (let char of word) {
          const charSpan = document.createElement('span');
          charSpan.className = 'hero-letter';
          charSpan.textContent = char;
          const delay = (baseDelay + letterIndex * letterStep).toFixed(3);
          charSpan.style.animationDelay = `${delay}s`;
          wordSpan.appendChild(charSpan);
          letterIndex++;
        }

        titleEl.appendChild(wordSpan);
      });

      titleEl.classList.add('is-animating');

      // Now animate corresponding description
      const heroParent = titleEl.closest('.hero-content, .page-hero-content') || titleEl.parentElement;
      const descEl = heroParent ? heroParent.querySelector('.hero-description, .page-hero-desc') : null;

      if (descEl && !descEl.dataset.heroLinesDone) {
        descEl.dataset.heroLinesDone = 'true';
        const rawDesc = descEl.textContent;
        const lines = splitDescriptionIntoLines(rawDesc);
        descEl.innerHTML = '';

        // Line 1 starts as the title cascade approaches completion
        const titleTotalTime = baseDelay + letterIndex * letterStep;
        const line1Delay = Math.max(0.65, titleTotalTime * 0.75).toFixed(3);
        const line2Delay = (parseFloat(line1Delay) + 0.42).toFixed(3);

        lines.forEach((lineText, idx) => {
          const lineSpan = document.createElement('span');
          lineSpan.className = 'hero-desc-line';
          lineSpan.textContent = lineText;
          lineSpan.style.animationDelay = `${idx === 0 ? line1Delay : line2Delay}s`;
          descEl.appendChild(lineSpan);
        });

        descEl.classList.add('is-animating');
      }
    });

    // Handle any standalone descriptions
    descs.forEach(descEl => {
      if (descEl.dataset.heroLinesDone) return;
      descEl.dataset.heroLinesDone = 'true';
      const rawDesc = descEl.textContent;
      const lines = splitDescriptionIntoLines(rawDesc);
      descEl.innerHTML = '';

      lines.forEach((lineText, idx) => {
        const lineSpan = document.createElement('span');
        lineSpan.className = 'hero-desc-line';
        lineSpan.textContent = lineText;
        lineSpan.style.animationDelay = `${(0.45 + idx * 0.38).toFixed(3)}s`;
        descEl.appendChild(lineSpan);
      });

      descEl.classList.add('is-animating');
    });
  }

  // Preloader synchronization: trigger right as preloader finishes
  const preloader = document.getElementById('stacklyPreloader');
  const isPreloaderActive = preloader && !window.__stacklyPreloaderDone && window.getComputedStyle(preloader).display !== 'none';

  if (isPreloaderActive) {
    window.addEventListener('stacklyPreloaderDone', () => {
      setTimeout(runAnimation, 200);
    }, { once: true });

    // Fallback timer if preloader is skipped or delayed
    setTimeout(runAnimation, 2600);
  } else {
    // Immediate activation on pages without active preloader
    setTimeout(runAnimation, 140);
  }
}

/* ===================================================================
   SECTION HEADINGS ANIMATION (ALL WEB PAGES & ALL SECTIONS)
   - Bold black letters arrive from LEFT side one by one (staggered cascade)
   - Small letter description arrives from LEFT side smoothly
   - Triggered when section scrolls into view via IntersectionObserver
   =================================================================== */
function initSectionHeadingsAnimation() {
  const sectionHeaders = document.querySelectorAll('.section-header, .split-content-text');
  const standaloneTitles = document.querySelectorAll('.section-title:not(.section-header .section-title)');
  const allTargets = [...sectionHeaders, ...standaloneTitles];

  if (!allTargets.length) return;

  function animateSectionHeader(headerEl) {
    if (headerEl.dataset.sectionHeaderDone) return;
    headerEl.dataset.sectionHeaderDone = 'true';

    const titleEl = headerEl.classList.contains('section-title') ? headerEl : headerEl.querySelector('.section-title');
    const descEl = headerEl.classList.contains('section-description') ? headerEl : headerEl.querySelector('.section-description');

    let letterCount = 0;
    const baseDelay = 0.08;
    const letterStep = 0.026; // 26ms per letter for crisp, rapid cascade

    if (titleEl && !titleEl.dataset.lettersDone) {
      titleEl.dataset.lettersDone = 'true';
      const rawText = titleEl.textContent.trim().replace(/\s+/g, ' ');
      const words = rawText.split(' ');
      titleEl.innerHTML = '';

      words.forEach((word) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'section-word';

        for (let char of word) {
          const charSpan = document.createElement('span');
          charSpan.className = 'section-letter';
          charSpan.textContent = char;
          const delay = (baseDelay + letterCount * letterStep).toFixed(3);
          charSpan.style.animationDelay = `${delay}s`;
          wordSpan.appendChild(charSpan);
          letterCount++;
        }

        titleEl.appendChild(wordSpan);
      });

      titleEl.classList.add('is-animating');
    }

    if (descEl && !descEl.dataset.descDone) {
      descEl.dataset.descDone = 'true';
      descEl.classList.add('section-desc-anim');
      const descDelay = Math.max(0.35, (baseDelay + letterCount * letterStep) * 0.65).toFixed(3);
      descEl.style.animationDelay = `${descDelay}s`;
      descEl.classList.add('is-animating');
    }

    headerEl.classList.add('is-animating');
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSectionHeader(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -10px 0px' });

    allTargets.forEach(h => observer.observe(h));
  } else {
    allTargets.forEach(animateSectionHeader);
  }
}

/* ===================================================================
   DESTINATION NETWORK - SEQUENTIAL CARD ARRIVAL OBSERVER
   =================================================================== */
function initFootprintGridAnimation() {
  const footprintGrids = document.querySelectorAll('.footprint-grid');
  if (!footprintGrids.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -10px 0px' });

    footprintGrids.forEach(grid => observer.observe(grid));
  } else {
    footprintGrids.forEach(grid => grid.classList.add('is-in-view'));
  }
}

/* ===================================================================
   UNIVERSAL CUSTOM DROPDOWN COMPONENT
   =================================================================== */
function initCustomDropdowns() {
  const customSelects = document.querySelectorAll('.custom-select-wrapper');
  if (!customSelects.length) return;

  // Close all custom selects if clicked outside
  document.addEventListener('click', (e) => {
    customSelects.forEach(select => {
      if (!select.contains(e.target)) {
        select.classList.remove('open');
      }
    });
  });

  customSelects.forEach(select => {
    const trigger = select.querySelector('.custom-select-trigger');
    const placeholder = select.querySelector('.custom-select-placeholder');
    const hiddenInput = select.querySelector('input[type="hidden"]');
    const options = select.querySelectorAll('.custom-select-option');

    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close other open selects
      customSelects.forEach(s => {
        if (s !== select) s.classList.remove('open');
      });
      select.classList.toggle('open');
    });

    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        const text = opt.textContent.trim();
        const val = opt.getAttribute('data-value') || text;
        if (placeholder) placeholder.textContent = text;
        if (hiddenInput) {
          hiddenInput.value = val;
          hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        select.classList.remove('open');
      });
    });
  });
}

/* ===================================================================
   DIRECTIONAL SCROLL ANIMATIONS (FAQ, SERVICES, BLOG, CONTACT)
   =================================================================== */
function initDirectionalScrollAnimations() {
  const animatedSelectors = [
    '.service-from-left',
    '.service-from-down',
    '.service-from-right',
    '.step-card',
    '.tour-card-left',
    '.tour-card-down',
    '.tour-card-right',
    '.featured-img-left',
    '.featured-content-right',
    '.card-from-left-3',
    '.card-from-bottom-3',
    '.card-from-right-3',
    '.story-dest-card',
    '.contact-left-channels',
    '.contact-right-form',
    '.contact-channel-item',
    '.faq-from-right',
    '.faq-from-left'
  ];

  const targets = document.querySelectorAll(animatedSelectors.join(', '));
  if (!targets.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });

    targets.forEach(el => observer.observe(el));

    // Safety: ensure any elements already visible on load or mobile trigger smoothly
    targets.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('in-view');
      }
    });
  } else {
    targets.forEach(el => el.classList.add('in-view'));
  }
}

// ===================================================================
// GLOBAL NAVIGATION & EXACT SCROLL POSITION RESTORATION (404 GO BACK)
// - Tracks exact page URL and pixel scroll coordinates on any 404 button click
// - When 'Go Back' is clicked on 404 page, returns to exact page & scroll position
// - Maintains scroll position across layout and rendering cycles
// ===================================================================

function captureNavigationReturnState(targetElement) {
  try {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
    let elemY = currentScrollY;
    let elementId = '';
    if (targetElement) {
      if (typeof targetElement.getBoundingClientRect === 'function') {
        elemY = Math.round(targetElement.getBoundingClientRect().top + currentScrollY);
      }
      elementId = targetElement.id || '';
    }
    const state = {
      url: window.location.href,
      pathname: window.location.pathname,
      hash: window.location.hash || '',
      scrollY: Math.round(currentScrollY),
      elemY: elemY,
      elementId: elementId,
      timestamp: Date.now()
    };
    sessionStorage.setItem('stackly_nav_return_state', JSON.stringify(state));
    sessionStorage.setItem('stackly_should_restore_scroll', 'true');
  } catch (err) {}
}
window.captureNavigationReturnState = captureNavigationReturnState;

// 1. Capture navigation state on any link or button pointing to 404
document.addEventListener('click', function(e) {
  const target = e.target.closest('a, button, [role="button"]');
  if (!target) return;
  const href = (target.getAttribute && target.getAttribute('href')) || '';
  const onclick = (target.getAttribute && target.getAttribute('onclick')) || '';
  if (href.includes('404.html') || onclick.includes('404.html') || target.dataset.goto404) {
    captureNavigationReturnState(target);
  }
}, true);

document.addEventListener('submit', function(e) {
  const form = e.target;
  if (!form) return;
  const action = (form.getAttribute && form.getAttribute('action')) || '';
  if (action.includes('404.html')) {
    captureNavigationReturnState(form);
  }
}, true);

// Keep last scroll position updated before page unloads
window.addEventListener('beforeunload', function() {
  if (!window.location.pathname.includes('404.html')) {
    try {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      const state = {
        url: window.location.href,
        pathname: window.location.pathname,
        hash: window.location.hash || '',
        scrollY: Math.round(currentScrollY),
        elemY: Math.round(currentScrollY),
        timestamp: Date.now()
      };
      sessionStorage.setItem('stackly_nav_return_state', JSON.stringify(state));
    } catch (e) {}
  }
});

// Footer brand logo click on home page navigates/scrolls smoothly to the top of the home page
document.addEventListener('click', function(e) {
  if (e.target.closest('.social-icon-btn, .social-links')) return;
  const footerLogo = e.target.closest('#footerLogoLink, .footer-logo-link, .footer-brand-col > a');
  if (!footerLogo) return;

  const currentPath = window.location.pathname.split('/').pop().toLowerCase();
  const isHomePage = currentPath === '' || currentPath === 'index.html' || currentPath === 'index';

  if (isHomePage) {
    e.preventDefault();
    sessionStorage.removeItem('stackly_should_restore_scroll');
    sessionStorage.removeItem('stackly_nav_return_state');
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
});

// 2. Go Back Handler for 404 page
let isNavigatingBack = false;
window.handleGoBack = function() {
  if (isNavigatingBack) return;
  isNavigatingBack = true;

  let returnState = null;
  try {
    const raw = sessionStorage.getItem('stackly_nav_return_state');
    if (raw) returnState = JSON.parse(raw);
    sessionStorage.setItem('stackly_should_restore_scroll', 'true');
  } catch (e) {}

  let targetUrl = '';
  if (returnState && returnState.url && !returnState.url.includes('404.html')) {
    targetUrl = returnState.url;
  } else if (document.referrer && !document.referrer.includes('404.html') && document.referrer.length > 5) {
    targetUrl = document.referrer;
  }

  if (targetUrl) {
    window.location.replace(targetUrl);
    return;
  }

  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  window.location.replace('index.html');
};

// 3. Exact Scroll Position Restoration on Return
function restorePreviousScrollPosition() {
  try {
    const shouldRestore = sessionStorage.getItem('stackly_should_restore_scroll');
    const raw = sessionStorage.getItem('stackly_nav_return_state');
    if (!raw) return;

    const state = JSON.parse(raw);
    if (!state) return;

    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    const savedPath = (state.pathname || '').replace(/\/$/, '') || '/';
    const pathMatches = currentPath === savedPath ||
                        currentPath.endsWith(savedPath) ||
                        savedPath.endsWith(currentPath) ||
                        (currentPath.includes('index') && (savedPath === '/' || savedPath === '')) ||
                        (savedPath.includes('index') && (currentPath === '/' || currentPath === ''));

    if (shouldRestore !== 'true' || !pathMatches) return;

    // Dismiss preloader immediately on back navigation to prevent blocking scroll
    const preloader = document.getElementById('stacklyPreloader');
    if (preloader) {
      preloader.style.display = 'none';
      preloader.classList.add('fade-out');
      window.__stacklyPreloaderDone = true;
      window.dispatchEvent(new CustomEvent('stacklyPreloaderDone'));
    }

    // Determine target scroll position
    let targetY = -1;
    if (state.elementId) {
      const el = document.getElementById(state.elementId);
      if (el) {
        const rect = el.getBoundingClientRect();
        targetY = Math.round(rect.top + (window.pageYOffset || document.documentElement.scrollTop || 0) - (window.innerHeight * 0.35));
      }
    }
    if (targetY < 0) {
      targetY = typeof state.elemY === 'number' && state.elemY >= 0
        ? state.elemY
        : (typeof state.scrollY === 'number' ? state.scrollY : 0);
    }

    if (targetY <= 0) return;

    // Manual scroll restoration prevents browser from popping to top (0,0)
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const applyScroll = function() {
      window.scrollTo({
        top: Math.max(0, targetY),
        left: 0,
        behavior: 'instant'
      });
    };

    // Multi-cycle restoration across layout and rendering frames
    applyScroll();
    requestAnimationFrame(applyScroll);
    setTimeout(applyScroll, 20);
    setTimeout(applyScroll, 60);
    setTimeout(applyScroll, 150);
    setTimeout(applyScroll, 350);
    setTimeout(applyScroll, 700);
    setTimeout(function() {
      applyScroll();
      sessionStorage.removeItem('stackly_should_restore_scroll');
    }, 1200);
  } catch (err) {
    console.error('Scroll restore failed:', err);
  }
}

// Bind scroll restoration to multiple lifecycle events
window.addEventListener('pageshow', function() {
  restorePreviousScrollPosition();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', restorePreviousScrollPosition);
} else {
  restorePreviousScrollPosition();
}
window.addEventListener('load', restorePreviousScrollPosition);
window.addEventListener('stacklyPreloaderDone', restorePreviousScrollPosition);





