/**
 * STACKLY TOURISM & TRAVEL PORTAL - TRAVELLER DASHBOARD
 * Features:
 * - 5 Clean Main Pages (Dashboard, My Trips, Explore, Analytics, Settings)
 * - Dynamic Welcome Note with user name from Signup / localStorage
 * - Profile Widget with Initials Avatar (e.g., KS for Kumar Swami, HA for Hari)
 * - Profile Dropdown Card showing Name, Email, and Selected Role
 * - Interactive Charts, Bookings, Wishlist, and Profile Settings Sync
 */

// Strictly suppress native browser alert popups throughout the entire website
window.alert = function() { /* Browser popups disabled */ };

function initTravellerDashboard() {
  try { initPreloader(); } catch (e) { console.error('Error initPreloader:', e); }
  try { initTravellerUserProfile(); } catch (e) { console.error('Error initTravellerUserProfile:', e); }
  try { initTravellerSidebar(); } catch (e) { console.error('Error initTravellerSidebar:', e); }
  try { initTravellerCleanNav(); } catch (e) { console.error('Error initTravellerCleanNav:', e); }
  try { initTravellerCharts(); } catch (e) { console.error('Error initTravellerCharts:', e); }
  try { renderTravellerTrips(); } catch (e) { console.error('Error renderTravellerTrips:', e); }
  try { initCountdownTimer(); } catch (e) { console.error('Error initCountdownTimer:', e); }
  try { runLiveCounters('tabTravellerOverview'); } catch (e) { console.error('Error runLiveCounters:', e); }
  try { initLiveMilesTracker(); } catch (e) { console.error('Error initLiveMilesTracker:', e); }
  try { initTripTailorCalculator(); } catch (e) { console.error('Error initTripTailorCalculator:', e); }
  try { initProfileDropdown(); } catch (e) { console.error('Error initProfileDropdown:', e); }
  try { initProfileForm(); } catch (e) { console.error('Error initProfileForm:', e); }
  try { initSectionHeadingTextAnimation(); } catch (e) { console.error('Error initSectionHeadingTextAnimation:', e); }
  try { restoreTravellerPreviousScrollPosition(); } catch (e) {}
  setTimeout(() => {
    const preloader = document.getElementById('stacklyPreloader');
    if (!preloader || preloader.style.display === 'none' || preloader.classList.contains('fade-out')) {
      const activeEl = document.querySelector('.dashboard-tab-content.active');
      const activeTabId = activeEl ? activeEl.id : 'tabTravellerOverview';
      animateAllTabSections(activeTabId);
    }
  }, 400);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTravellerDashboard);
} else {
  initTravellerDashboard();
}

// Helper: Calculate 2-letter uppercase initials (e.g. Mahesh Sabari -> MS)
function getUserInitials(name) {
  if (!name || !name.trim()) return 'MS';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return name.trim().substring(0, 2).toUpperCase();
}

// Helper: Get active profile from localStorage or fallback
function getStoredUser() {
  try {
    const raw = localStorage.getItem('stackly_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name) return parsed;
    }
  } catch (e) {
    console.warn('Error reading stackly_user from localStorage', e);
  }
  return {
    name: 'Mahesh Sabari',
    email: 'maheshsabari@gmail.com',
    role: 'traveller'
  };
}

// 1. Initialize User Profile across UI
function initTravellerUserProfile() {
  const user = getStoredUser();
  const initials = getUserInitials(user.name);
  const roleLabel = (user.role && user.role.toLowerCase() === 'operator') ? 'Tour Operator' : 'Explorer (Traveller)';

  // Topbar Profile Widget
  const navAvatar = document.getElementById('navAvatarInitials');
  const navName = document.getElementById('navUserName');
  if (navAvatar) navAvatar.textContent = initials;
  if (navName) navName.textContent = user.name;

  // Sidebar Footer Profile Widget
  const sideAvatar = document.getElementById('sidebarAvatarInitials');
  const sideName = document.getElementById('sidebarUserName');
  if (sideAvatar) sideAvatar.textContent = initials;
  if (sideName) sideName.textContent = user.name;

  // Dropdown Card Profile Details
  const cardAvatar = document.getElementById('cardAvatarInitials');
  const cardName = document.getElementById('cardUserName');
  const cardEmail = document.getElementById('cardUserEmail');
  const cardRole = document.getElementById('cardUserRole');
  const detailName = document.getElementById('detailFullName');
  const detailEmail = document.getElementById('detailEmail');
  const detailRole = document.getElementById('detailRole');

  if (cardAvatar) cardAvatar.textContent = initials;
  if (cardName) cardName.textContent = user.name;
  if (cardEmail) cardEmail.textContent = user.email || 'maheshsabari@gmail.com';
  if (cardRole) cardRole.textContent = roleLabel;
  if (detailName) detailName.textContent = user.name;
  if (detailEmail) detailEmail.textContent = user.email || 'maheshsabari@gmail.com';
  if (detailRole) detailRole.textContent = roleLabel;

  // Overview Welcome Banner
  const welcomeEl = document.getElementById('welcomeUserName');
  if (welcomeEl) welcomeEl.textContent = user.name;
}

// 2. Profile Dropdown Interaction
function initProfileDropdown() {
  const btn = document.getElementById('dashboardProfileBtn');
  const card = document.getElementById('profileDropdownCard');
  const logoutBtn = document.getElementById('dashboardLogoutBtn');
  const sideLogout = document.getElementById('sidebarLogoutBtn');

  if (btn && card) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      card.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!card.contains(e.target) && !btn.contains(e.target)) {
        card.classList.remove('active');
      }
    });
  }

  [logoutBtn, sideLogout].forEach(b => {
    if (b) {
      b.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('stackly_logged_in');
        showDashboardToast('Logged out successfully. Redirecting to login...');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 800);
      });
    }
  });
}

// 3. Settings Form Validation & 404 Navigation
function initProfileForm() {
  const form = document.getElementById('travellerProfileForm');
  if (!form) return;

  const nameInput = document.getElementById('settingsFullName');
  const emailInput = document.getElementById('settingsEmail');
  const phoneInput = document.getElementById('settingsPhone');
  const countryInput = document.getElementById('settingsCountry');

  const nameError = document.getElementById('settingsFullNameError');
  const emailError = document.getElementById('settingsEmailError');
  const phoneError = document.getElementById('settingsPhoneError');
  const countryError = document.getElementById('settingsCountryError');

  function validateField(input, errorEl, defaultMsg) {
    if (!input) return true;
    const val = input.value.trim();
    if (!val) {
      input.classList.add('is-invalid');
      if (errorEl) {
        errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${defaultMsg}`;
        errorEl.style.display = 'flex';
      }
      return false;
    }
    input.classList.remove('is-invalid');
    if (errorEl) {
      errorEl.style.display = 'none';
    }
    return true;
  }

  function validateEmailField() {
    if (!emailInput) return true;
    const val = emailInput.value.trim();
    if (!val) {
      emailInput.classList.add('is-invalid');
      if (emailError) {
        emailError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter your email';
        emailError.style.display = 'flex';
      }
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      emailInput.classList.add('is-invalid');
      if (emailError) {
        emailError.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter a valid email address';
        emailError.style.display = 'flex';
      }
      return false;
    }
    emailInput.classList.remove('is-invalid');
    if (emailError) emailError.style.display = 'none';
    return true;
  }

  // Clear errors live as user types
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim()) {
        nameInput.classList.remove('is-invalid');
        if (nameError) nameError.style.display = 'none';
      }
    });
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (emailInput.value.trim()) {
        emailInput.classList.remove('is-invalid');
        if (emailError) emailError.style.display = 'none';
      }
    });
  }
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      if (phoneInput.value.trim()) {
        phoneInput.classList.remove('is-invalid');
        if (phoneError) phoneError.style.display = 'none';
      }
    });
  }
  if (countryInput) {
    countryInput.addEventListener('input', () => {
      if (countryInput.value.trim()) {
        countryInput.classList.remove('is-invalid');
        if (countryError) countryError.style.display = 'none';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, nameError, 'Please enter your name');
    const isEmailValid = validateEmailField();
    const isPhoneValid = validateField(phoneInput, phoneError, 'Please enter your phone number');
    const isCountryValid = validateField(countryInput, countryError, 'Please enter your passport country');

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isCountryValid) {
      if (!isNameValid && nameInput) nameInput.focus();
      else if (!isEmailValid && emailInput) emailInput.focus();
      else if (!isPhoneValid && phoneInput) phoneInput.focus();
      else if (!isCountryValid && countryInput) countryInput.focus();
      return;
    }

    // All details entered -> navigate to 404 page
    if (typeof captureTravellerNavigationReturnState === 'function') captureTravellerNavigationReturnState(form);
    window.location.href = '404.html';
  });
}

// 4. Clean Navigation Headings & 5-Tab Switching
function initTravellerCleanNav() {
  const links = document.querySelectorAll('.sidebar-clean-link');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTabId = link.getAttribute('data-target-tab') || link.getAttribute('data-tab');
      if (targetTabId) {
        window.switchToTab(targetTabId);
      }
    });
  });

  // URL Hash routing on load & change
  function handleHash() {
    const hash = window.location.hash;
    if (hash === '#dashboard' || hash === '#overview') window.switchToTab('tabTravellerOverview');
    else if (hash === '#my-trips') window.switchToTab('tabTravellerTrips');
    else if (hash === '#tour-packages') window.switchToTab('tabTravellerExplore');
    else if (hash === '#analytics') window.switchToTab('tabTravellerAnalytics');
    else if (hash === '#wishlist' || hash === '#settings') window.switchToTab('tabTravellerWishlist');
    else {
      // Restore previously saved tab if available
      try {
        const savedTab = sessionStorage.getItem('stackly_active_traveller_tab');
        if (savedTab && document.getElementById(savedTab)) {
          window.switchToTab(savedTab, { preserveScroll: true });
        }
      } catch (e) {}
    }
  }

  window.addEventListener('hashchange', handleHash);
  if (window.location.hash) {
    handleHash();
  }
}

window.switchToTab = function(tabId, options = {}) {
  const links = document.querySelectorAll('.sidebar-clean-link');
  const tabs = document.querySelectorAll('.dashboard-tab-content');
  const pageTitle = document.getElementById('travellerPageTitle');

  // Update tabs
  tabs.forEach(tab => {
    if (tab.id === tabId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Update sidebar links
  let foundActiveLink = false;
  links.forEach(link => {
    const linkTab = link.getAttribute('data-target-tab') || link.getAttribute('data-tab');
    if (linkTab === tabId) {
      link.classList.add('active');
      foundActiveLink = true;
      const text = link.querySelector('span')?.textContent || 'Overview';
      if (pageTitle) pageTitle.textContent = (text === 'Dashboard' || text === 'Dashboard Overview') ? 'Overview' : text;
    } else {
      link.classList.remove('active');
    }
  });

  if (!foundActiveLink && pageTitle) {
    if (tabId === 'tabTravellerWishlist' || tabId === 'tabTravellerSettings') pageTitle.textContent = 'Wishlist';
    else if (tabId === 'tabTravellerExplore') pageTitle.textContent = 'Tour Packages';
    else if (tabId === 'tabTravellerTrips') pageTitle.textContent = 'My Trips';
    else if (tabId === 'tabTravellerAnalytics') pageTitle.textContent = 'Travel Analytics';
  }

  // Update URL hash without jumping page
  const tabSlugMap = {
    'tabTravellerOverview': 'overview',
    'tabTravellerTrips': 'my-trips',
    'tabTravellerExplore': 'tour-packages',
    'tabTravellerAnalytics': 'analytics',
    'tabTravellerWishlist': 'wishlist'
  };
  const slug = tabSlugMap[tabId];
  if (slug) {
    try {
      history.replaceState(null, '', '#' + slug);
    } catch (err) {}
  }
  try {
    sessionStorage.setItem('stackly_active_traveller_tab', tabId);
  } catch (err) {}

  // Trigger resize so Chart.js recalculates dimensions for newly visible tab
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
    if (window.__travellerCharts) {
      window.__travellerCharts.forEach(c => { try { c.resize(); } catch(e){} });
    }
    // Run live counter roll-up on visible tab
    if (tabId === 'tabTravellerOverview' || tabId === 'tabTravellerAnalytics') {
      runLiveCounters(tabId);
    }
    // Trigger alternating section entrance & combined inner animations across active tab
    animateAllTabSections(tabId);
  }, 60);

  // Close mobile sidebar if open
  const sidebar = document.getElementById('travellerSidebar');
  if (sidebar && window.innerWidth <= 900) {
    sidebar.classList.remove('open');
  }

  // Scroll main container to top ONLY if not preserving scroll
  if (!options || !options.preserveScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// 4a. Master Orchestrator: Alternating Section Entrances & Combined Component Animations
// 1st section comes from right side, 2nd from left side, 3rd from right, 4th from left...
function animateAllTabSections(tabId = 'tabTravellerOverview') {
  const tab = document.getElementById(tabId);
  if (!tab) return;

  const isMobile = window.innerWidth <= 768;
  const sectionOffset = isMobile ? 35 : 70;

  // Query all top-level section blocks in this tab
  const sections = tab.querySelectorAll('.dashboard-section-block');

  if (sections && sections.length) {
    if (typeof gsap !== 'undefined') {
      try {
        sections.forEach((section, idx) => {
          gsap.killTweensOf(section);
          const delay = 0.04 + idx * 0.08;

          gsap.fromTo(section,
            { opacity: 0, y: -18, x: 0 },
            {
              opacity: 1,
              y: 0,
              x: 0,
              duration: 0.65,
              delay: delay,
              ease: 'power2.out',
              clearProps: 'transform,opacity'
            }
          );
        });
      } catch (e) {
        console.warn('GSAP section animation bypassed:', e);
      }
    } else {
      // Pure CSS fallback
      sections.forEach((section, idx) => {
        section.classList.remove('anim-section-right', 'anim-section-left');
        void section.offsetWidth;
        const fromRight = (idx % 2 === 0);
        section.classList.add(fromRight ? 'anim-section-right' : 'anim-section-left');
      });
    }
  }

  // Combined Meaningful Inner Animations:
  // 1. Overview banner & hero countdown card
  if (tabId === 'tabTravellerOverview') {
    triggerTravellerCardsAnimation();
  }

  // 2. Two-Card rows inside current tab: Smooth Top-to-Down
  triggerTwoCardsAnimation('#' + tabId + ' .two-card-row, #' + tabId + ' .charts-grid-2col');

  // 3. 4-Card KPI Grids: Smooth Top-to-Down into direct grid slots
  triggerShuffleArrangeCards('#' + tabId + ' .kpi-grid');

  // 4. Section Headings: Kinetic letter-by-letter entrance in gold resolving to navy
  animateSectionHeadings('#' + tabId);
}

// 4b. Overview Hero Cards Top-to-Down Entrance Animation
function triggerTravellerCardsAnimation() {
  const card1 = document.querySelector('#tabTravellerOverview .dashboard-welcome-banner');
  const card2 = document.querySelector('#tabTravellerOverview .traveller-hero-trip');
  if (!card1 || !card2) return;

  if (typeof gsap !== 'undefined') {
    try {
      gsap.killTweensOf([card1, card2]);

      gsap.fromTo(card1,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity' }
      );

      gsap.fromTo(card2,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: 'power3.out', clearProps: 'transform,opacity' }
      );
      return;
    } catch (e) {
      console.warn('GSAP card animation bypassed:', e);
    }
  }

  // Pure CSS animation fallback
  card1.classList.remove('animate-slide-left');
  card2.classList.remove('animate-slide-right');
  void card1.offsetWidth;
  void card2.offsetWidth;
  card1.classList.add('animate-slide-left');
  card2.classList.add('animate-slide-right');
}

// 4c. Shuffle and Arrange Animation for Dashboard KPI Cards & other cards
function triggerShuffleArrangeCards(containerSelector = '#tabTravellerOverview .kpi-grid') {
  const containers = document.querySelectorAll(containerSelector);
  if (!containers || !containers.length) return;

  const isMobile = window.innerWidth <= 768;

  containers.forEach(container => {
    const cards = container.querySelectorAll('.kpi-card, .chart-card');
    if (!cards || !cards.length) return;

    if (typeof gsap !== 'undefined') {
      try {
        cards.forEach((card, idx) => {
          gsap.killTweensOf(card);
          const delay = 0.06 + idx * 0.05;

          gsap.fromTo(card,
            {
              opacity: 0,
              y: -22,
              x: 0,
              scale: 0.98,
              boxShadow: '0 12px 28px rgba(56, 35, 201, 0.12)'
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              duration: 0.65,
              delay: delay,
              ease: 'power2.out',
              clearProps: 'transform,boxShadow,zIndex'
            }
          );
        });
        return;
      } catch (e) {
        console.warn('GSAP card shuffle animation bypassed:', e);
      }
    }

    // Pure CSS reflow fallback
    cards.forEach(card => {
      card.style.animation = 'none';
      void card.offsetWidth;
      card.style.animation = '';
    });
  });
}

// 4d. Two-Card Row Entrance (Smooth Top-to-Down)
function triggerTwoCardsAnimation(containerSelector = '.two-card-row, .charts-grid-2col') {
  const containers = document.querySelectorAll(containerSelector);
  if (!containers || !containers.length) return;

  containers.forEach(container => {
    const leftCard = container.querySelector('.chart-card:first-child, .archive-journey-card:first-child') || container.firstElementChild;
    const rightCard = (container.children.length > 1) ? (container.querySelector('.chart-card:last-child, .archive-journey-card:last-child') || container.lastElementChild) : null;
    if (!leftCard) return;

    if (typeof gsap !== 'undefined') {
      try {
        const targetCards = [leftCard, rightCard].filter(Boolean);
        gsap.killTweensOf(targetCards);
        gsap.fromTo(targetCards,
          { opacity: 0, y: -20, x: 0 },
          { opacity: 1, y: 0, x: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', clearProps: 'transform,opacity' }
        );
        return;
      } catch (e) {
        console.warn('GSAP two-card animation bypassed:', e);
      }
    }

    // CSS Fallback
    if (leftCard) {
      leftCard.style.animation = 'none';
      void leftCard.offsetWidth;
      leftCard.style.animation = '';
    }
    if (rightCard && rightCard !== leftCard) {
      rightCard.style.animation = 'none';
      void rightCard.offsetWidth;
      rightCard.style.animation = '';
    }
  });
}

function triggerTwoChartsAnimation(containerSelector = '.two-card-row, .charts-grid-2col') {
  triggerTwoCardsAnimation(containerSelector);
}

// 4e. Section Headings: Split Text for Letter-by-Letter & Word-by-Word Animation
function initSectionHeadingTextAnimation() {
  const headers = document.querySelectorAll('.dashboard-section-header');
  headers.forEach(header => {
    const textSpan = header.querySelector('span');
    if (!textSpan || textSpan.dataset.split) return;
    
    const rawText = textSpan.textContent.trim();
    if (!rawText) return;

    // Split words and wrap characters
    const words = rawText.split(/\s+/);
    textSpan.innerHTML = words.map(word => {
      const chars = word.split('').map(char => `<span class="heading-char">${char}</span>`).join('');
      return `<span class="heading-word">${chars}</span>`;
    }).join(' ');

    textSpan.dataset.split = 'true';
  });
}

// Animate Section Heading Text (Letters glide in from right side in gold and turn to black)
function animateSectionHeadings(scopeSelector = '#tabTravellerOverview') {
  const scope = document.querySelector(scopeSelector) || document;
  const headers = scope.querySelectorAll('.dashboard-section-header');

  headers.forEach(header => {
    const chars = header.querySelectorAll('.heading-char');
    const icon = header.querySelector('i');

    if (typeof gsap !== 'undefined' && chars.length) {
      try {
        gsap.killTweensOf(chars);
        gsap.fromTo(chars,
          {
            opacity: 0,
            x: 35, // Coming from right side
            color: '#f59e0b', // Radiant gold
            textShadow: '0 0 12px rgba(245, 158, 11, 0.7)'
          },
          {
            opacity: 1,
            x: 0, // Arrange into direct position
            color: '#0e1538', // Resolves to deep dark navy / black letters
            textShadow: '0 0 0 rgba(0, 0, 0, 0)',
            duration: 0.65,
            stagger: 0.022, // Word/letter-by-letter arrangement
            ease: 'power2.out',
            clearProps: 'transform,textShadow'
          }
        );

        if (icon) {
          gsap.killTweensOf(icon);
          gsap.fromTo(icon,
            { scale: 0.7, color: '#f59e0b', rotation: -12 },
            { scale: 1, color: '#3823c9', rotation: 0, duration: 0.7, ease: 'back.out(1.8)' }
          );
        }
        return;
      } catch (e) {
        console.warn('GSAP heading text animation bypassed:', e);
      }
    }

    // CSS Fallback
    chars.forEach(c => {
      c.style.animation = 'none';
      void c.offsetWidth;
      c.style.animation = '';
    });
  });
}

// 5. Mobile Sidebar Toggle
function initTravellerSidebar() {
  const toggleBtn = document.getElementById('travellerMobileToggle');
  const sidebar = document.getElementById('travellerSidebar');
  const closeBtn = document.getElementById('travellerSidebarCloseBtn') || document.querySelector('.sidebar-close-btn');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.remove('open');
    });
  }

  const logoLink = sidebar ? sidebar.querySelector('.sidebar-header a') : null;
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.switchToTab === 'function') {
        window.switchToTab('tabTravellerOverview');
      }
      try {
        history.pushState(null, '', 'dashboard-traveller.html');
      } catch (err) {}
      if (window.innerWidth <= 900 && sidebar) {
        sidebar.classList.remove('open');
      }
    });
  }

  if (sidebar) {
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
          sidebar.classList.remove('open');
        }
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    }, { passive: true });
  }
}

// 6. Interactive Live Countdown Timer (Real-time second-by-second countdown)
let travellerCountdownInterval = null;
function initCountdownTimer() {
  const daysEl = document.getElementById('heroCountDays');
  const hoursEl = document.getElementById('heroCountHours');
  const minsEl = document.getElementById('heroCountMins');
  const secsEl = document.getElementById('heroCountSecs');
  if (!daysEl || !hoursEl || !minsEl) return;

  // Next departure: Bali Tropical Paradise (November 15, 2026 09:00:00)
  // Dynamic fallback: If fixed date is past or too close, maintain a rolling 19 days, 8 hrs, 45 mins
  function getTargetTimestamp() {
    const fixedTarget = new Date('2026-11-15T09:00:00').getTime();
    const now = Date.now();
    if (fixedTarget > now) {
      return fixedTarget;
    }
    const offset = (19 * 24 * 3600 + 8 * 3600 + 45 * 60) * 1000;
    return now + offset;
  }

  const targetTime = getTargetTimestamp();

  function updateLiveClock() {
    const now = Date.now();
    let diff = targetTime - now;
    if (diff <= 0) diff = 0;

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    if (secsEl) {
      secsEl.textContent = String(s).padStart(2, '0');
    }
  }

  updateLiveClock();
  if (travellerCountdownInterval) clearInterval(travellerCountdownInterval);
  travellerCountdownInterval = setInterval(updateLiveClock, 1000);
}

// 6b. Live Number Roll-Up / Count-Up Animation
function animateCounterNumber(el, target, duration = 1200, isFloat = false) {
  if (!el) return;
  const start = 0;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth easeOutExpo
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const val = start + (target - start) * ease;

    if (isFloat) {
      el.textContent = val.toFixed(1);
    } else {
      el.textContent = Math.round(val).toLocaleString('en-US');
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString('en-US');
    }
  }

  requestAnimationFrame(step);
}

function runLiveCounters(scopeId) {
  const container = scopeId ? document.getElementById(scopeId) : document;
  if (!container) return;
  const counters = container.querySelectorAll('.live-counter-num');
  counters.forEach(c => {
    const rawVal = c.getAttribute('data-target') || c.textContent.replace(/[^0-9.]/g, '');
    const target = parseFloat(rawVal);
    const isFloat = c.getAttribute('data-float') === 'true';
    if (!isNaN(target)) {
      animateCounterNumber(c, target, target > 1000 ? 1500 : 900, isFloat);
    }
  });
}

// 6c. Continuous Live Miles Telemetry Tracker
let liveMilesRunning = 18420;
let liveMilesInterval = null;
function initLiveMilesTracker() {
  const milesEl = document.getElementById('kpiRewardMiles');
  const tickerEl = document.getElementById('milesFloatingTicker');
  const statusEl = document.getElementById('milesLiveTickerStatus');
  if (!milesEl) return;

  if (liveMilesInterval) clearInterval(liveMilesInterval);
  liveMilesInterval = setInterval(() => {
    liveMilesRunning += 1;
    milesEl.textContent = liveMilesRunning.toLocaleString('en-US');

    if (tickerEl) {
      tickerEl.textContent = '+1 mi';
      tickerEl.classList.add('active');
      setTimeout(() => {
        tickerEl.classList.remove('active');
      }, 700);
    }
    if (statusEl) {
      statusEl.textContent = `Syncing +${liveMilesRunning - 18420} mi in-flight`;
    }
  }, 4500);
}

// 7. Chart.js Analytics Charts
function initTravellerCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js library is not loaded. Skipping chart initialization.');
    return;
  }

  try {
    const bluePrimary = '#3823c9';
    const blueLight = '#523de5';
    const accentGreen = '#10b981';
    const accentGold = '#f59e0b';
    const accentRed = '#ef4444';

    window.__travellerCharts = [];

    // 1. Monthly Travel Activity (Bar Chart - Overview Tab)
    const ctxActivity = document.getElementById('chartTravelActivity')?.getContext('2d');
    if (ctxActivity) {
      const c1 = new Chart(ctxActivity, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Days Traveled (2026)',
            data: [0, 4, 0, 7, 0, 12, 10, 0, 5, 8, 14, 0],
            backgroundColor: bluePrimary,
            borderRadius: 5,
            maxBarThickness: 26
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              grid: { color: '#f1f5f9' },
              title: { display: true, text: 'Days' },
              beginAtZero: true
            },
            x: {
              grid: { display: false },
              ticks: {
                autoSkip: true,
                maxRotation: 0,
                font: { size: 11 }
              }
            }
          }
        }
      });
      window.__travellerCharts.push(c1);
    }

    // 2. Travel Expenditure Breakdown (Doughnut Chart - Overview Tab)
    const ctxExp = document.getElementById('chartExpenditure')?.getContext('2d');
    if (ctxExp) {
      const c2 = new Chart(ctxExp, {
        type: 'doughnut',
        data: {
          labels: ['Accommodation (45%)', 'Guided Tours (30%)', 'Adventure Sports (15%)', 'Transfers (10%)'],
          datasets: [{
            data: [45, 30, 15, 10],
            backgroundColor: [bluePrimary, blueLight, '#8b5cf6', '#ec4899'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '66%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                padding: 10,
                font: { size: 11 }
              }
            }
          }
        }
      });
      window.__travellerCharts.push(c2);
    }

    // 3. Trip Completion Rate (Doughnut Chart - Analytics Tab)
    const ctxComp = document.getElementById('chartTripCompletion')?.getContext('2d');
    if (ctxComp) {
      const c3 = new Chart(ctxComp, {
        type: 'doughnut',
        data: {
          labels: ['Completed (94%)', 'Cancelled / Rescheduled (6%)'],
          datasets: [{
            data: [94, 6],
            backgroundColor: [accentGreen, '#e2e8f0'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '74%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                padding: 10,
                font: { size: 11 }
              }
            }
          }
        }
      });
      window.__travellerCharts.push(c3);
    }

    // 4. Booking History Over Years (Line Chart - Analytics Tab)
    const ctxHist = document.getElementById('chartBookingHistory')?.getContext('2d');
    if (ctxHist) {
      const c4 = new Chart(ctxHist, {
        type: 'line',
        data: {
          labels: ['2022', '2023', '2024', '2025', '2026 (YTD)'],
          datasets: [{
            label: 'Total Trips Completed',
            data: [2, 3, 5, 7, 9],
            borderColor: bluePrimary,
            backgroundColor: 'rgba(56, 35, 201, 0.12)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
            x: { grid: { display: false } }
          }
        }
      });
      window.__travellerCharts.push(c4);
    }

    // 5. Destination Preference Distribution (Polar Area - Analytics Tab)
    const ctxCat = document.getElementById('chartDestCategories')?.getContext('2d');
    if (ctxCat) {
      const c5 = new Chart(ctxCat, {
        type: 'polarArea',
        data: {
          labels: ['Islands & Tropical', 'Alpine Treks', 'Heritage & Culture', 'Desert Safaris', 'City Luxury'],
          datasets: [{
            data: [35, 25, 20, 15, 30],
            backgroundColor: [
              'rgba(56, 35, 201, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(239, 68, 68, 0.7)',
              'rgba(139, 92, 246, 0.7)'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                padding: 10,
                font: { size: 11 }
              }
            }
          }
        }
      });
      window.__travellerCharts.push(c5);
    }

    // Window resize observer to ensure chart canvas scales fluidly
    window.addEventListener('resize', () => {
      if (window.__travellerCharts && window.__travellerCharts.length) {
        window.__travellerCharts.forEach(c => {
          try { c.resize(); } catch(e){}
        });
      }
    });
  } catch (err) {
    console.error('Error during traveller charts initialization:', err);
  }
}

// 8. Render Traveller Bookings
function renderTravellerTrips() {
  const container = document.getElementById('travellerTripsList');
  if (!container) return;

  const bookings = getAllBookings();
  container.innerHTML = '';

  if (bookings.length === 0) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid var(--border-light); border-radius:var(--radius-lg); padding:40px; text-align:center;">
        <i class="fas fa-suitcase-rolling" style="font-size:3rem; color:var(--primary-blue); margin-bottom:16px;"></i>
        <h3>No trips booked yet!</h3>
        <p style="color:var(--text-muted); margin-bottom:20px;">Ready to start your next adventure with Stackly?</p>
        <button type="button" class="btn btn-primary" onclick="switchToTab('tabTravellerExplore')">Browse Tour Packages</button>
      </div>
    `;
    return;
  }

  bookings.forEach(b => {
    const card = document.createElement('div');
    card.className = 'table-card';
    card.style.marginBottom = '20px';

    const statusClass = (b.status || 'Confirmed').toLowerCase();

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; margin-bottom:16px;">
        <div>
          <span style="font-size:0.78rem; font-weight:700; color:var(--primary-blue); text-transform:uppercase; letter-spacing:0.8px;">${b.id}</span>
          <h3 style="font-size:1.3rem; margin:4px 0 6px;">${b.tourTitle}</h3>
          <p style="color:var(--text-muted); font-size:0.88rem; display:flex; align-items:center; gap:6px;">
            <i class="fas fa-map-marker-alt" style="color:var(--primary-blue);"></i> ${b.destination}
          </p>
        </div>
        <div style="text-align:right;">
          <span class="status-badge ${statusClass}">${b.status}</span>
          <div style="font-size:1.4rem; font-weight:800; color:var(--primary-blue); font-family:var(--font-heading); margin-top:6px;">
            $${Number(b.totalPrice || 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:12px; background:var(--bg-subtle-blue); padding:14px; border-radius:var(--radius-md); font-size:0.85rem; margin-bottom:16px;">
        <div>
          <span style="color:var(--text-muted); display:block; font-size:0.75rem;">Departure Date</span>
          <strong>${b.travelDate}</strong>
        </div>
        <div>
          <span style="color:var(--text-muted); display:block; font-size:0.75rem;">Party Size</span>
          <strong>${b.totalTravellers} Guests</strong>
        </div>
        <div>
          <span style="color:var(--text-muted); display:block; font-size:0.75rem;">Add-ons</span>
          <strong>${b.addons && b.addons.length ? b.addons.join(', ') : 'Standard'}</strong>
        </div>
        <div>
          <span style="color:var(--text-muted); display:block; font-size:0.75rem;">Booking Date</span>
          <strong>${b.bookedAt || '2026-10-25'}</strong>
        </div>
      </div>

      <div style="display:flex; gap:10px; justify-content:flex-end;">
        <button class="btn btn-outline btn-sm" onclick="window.location.href='404.html'">
          <i class="fas fa-file-invoice"></i> Download Invoice
        </button>
        ${b.status !== 'Cancelled' ? `
          <button class="btn btn-ghost btn-sm" style="color:var(--accent-red);" onclick="window.location.href='404.html'">
            Cancel Trip
          </button>
        ` : ''}
      </div>
    `;
    container.appendChild(card);
  });
}

// Interactive Custom Trip Tailor Live Calculator
function initTripTailorCalculator() {
  const regionSel = document.getElementById('tailorRegionSelect');
  const daysInp = document.getElementById('tailorDaysInput');
  const guestsInp = document.getElementById('tailorGuestsInput');
  const display = document.getElementById('tailorPriceDisplay');
  if (!regionSel || !daysInp || !guestsInp || !display) return;

  const rates = {
    'Southeast Asia': 175,
    'Western Europe': 320,
    'Nordics': 380,
    'Middle East': 290
  };

  function recalculate() {
    const region = regionSel.value || 'Southeast Asia';
    const days = Math.max(1, parseInt(daysInp.value, 10) || 7);
    const guests = Math.max(1, parseInt(guestsInp.value, 10) || 2);
    const base = rates[region] || 200;
    const discount = guests >= 4 ? 0.88 : (guests >= 2 ? 0.94 : 1.0);
    const total = Math.round(base * days * guests * discount);
    display.textContent = `$${total.toLocaleString('en-US')}`;
  }

  regionSel.addEventListener('change', recalculate);
  daysInp.addEventListener('input', recalculate);
  guestsInp.addEventListener('input', recalculate);
}

window.showDashboardToast = function(msg) {
  // Suppressed: Toast notifications disabled throughout the entire website
  const existing = document.getElementById('dashboardToast');
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
  return;
};

window.downloadDemoReceipt = function(id) {
  if (typeof captureTravellerNavigationReturnState === 'function') captureTravellerNavigationReturnState();
  window.location.href = '404.html';
};

window.travellerCancelBooking = function(id) {
  if (typeof captureTravellerNavigationReturnState === 'function') captureTravellerNavigationReturnState();
  window.location.href = '404.html';
};

function initPreloader() {
  const preloader = document.getElementById('stacklyPreloader');
  if (!preloader) return;

  const skipBtn = document.getElementById('skipPreloader');
  const progressBar = document.getElementById('preloaderProgressBar');
  const buildingPaths = document.querySelectorAll('.arch-line, .arch-fill');
  const logoWrap = document.getElementById('preloaderLogoWrap');
  const brandText = document.getElementById('preloaderBrandText');

  let isClosed = false;
  function closePreloader() {
    if (isClosed) return;
    isClosed = true;
    preloader.classList.add('fade-out');
    preloader.style.opacity = '0';
    preloader.style.pointerEvents = 'none';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 350);
    animateAllTabSections('tabTravellerOverview');
  }

  // Immediate dismiss on skip click or backdrop click
  if (skipBtn) skipBtn.addEventListener('click', closePreloader);
  preloader.addEventListener('click', closePreloader);

  // GUARANTEED FAILSAFE: Never let the preloader hang over 600ms
  const failsafeTimer = setTimeout(closePreloader, 600);

  if (typeof gsap !== 'undefined') {
    try {
      const tl = gsap.timeline({
        onComplete: () => {
          clearTimeout(failsafeTimer);
          closePreloader();
        }
      });
      gsap.set(buildingPaths, { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' });
      gsap.set(logoWrap, { opacity: 0, scale: 0.85 });
      gsap.set(brandText, { opacity: 0, y: 10 });
      gsap.set(progressBar, { width: '0%' });

      tl.to(progressBar, { width: '60%', duration: 0.2, ease: 'power2.out' })
        .to(buildingPaths, { opacity: 1, scaleY: 1, stagger: 0.03, duration: 0.25, ease: 'power1.out' }, '-=0.1')
        .to(logoWrap, { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(1.2)' }, '-=0.1')
        .to(brandText, { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, '-=0.1')
        .to(progressBar, { width: '100%', duration: 0.15, ease: 'power2.out' });
    } catch (e) {
      console.warn('GSAP preloader animation bypassed:', e);
      closePreloader();
    }
  } else {
    setTimeout(closePreloader, 300);
  }
}

// ===================================================================
// GLOBAL NAVIGATION & EXACT SCROLL POSITION RESTORATION (404 GO BACK)
// ===================================================================

function captureTravellerNavigationReturnState(targetElement) {
  try {
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
    let elemY = currentScrollY;
    let elementId = '';

    // Find active tab or parent tab of the clicked element
    let activeTabId = '';
    const parentTab = targetElement ? targetElement.closest('.dashboard-tab-content') : null;
    if (parentTab && parentTab.id) {
      activeTabId = parentTab.id;
    } else {
      const activeEl = document.querySelector('.dashboard-tab-content.active');
      if (activeEl && activeEl.id) {
        activeTabId = activeEl.id;
      }
    }

    if (targetElement) {
      elementId = targetElement.id || '';
      if (typeof targetElement.getBoundingClientRect === 'function') {
        elemY = Math.round(targetElement.getBoundingClientRect().top + currentScrollY);
      }
    }

    const tabHashMap = {
      'tabTravellerOverview': '#overview',
      'tabTravellerTrips': '#my-trips',
      'tabTravellerExplore': '#tour-packages',
      'tabTravellerAnalytics': '#analytics',
      'tabTravellerWishlist': '#wishlist'
    };
    const tabHash = (activeTabId && tabHashMap[activeTabId]) ? tabHashMap[activeTabId] : (window.location.hash || '');
    const cleanUrl = window.location.origin + window.location.pathname + tabHash;

    const state = {
      url: cleanUrl,
      pathname: window.location.pathname,
      hash: tabHash,
      activeTabId: activeTabId,
      scrollY: Math.round(currentScrollY),
      elemY: elemY,
      elementId: elementId,
      timestamp: Date.now()
    };
    sessionStorage.setItem('stackly_nav_return_state', JSON.stringify(state));
    sessionStorage.setItem('stackly_should_restore_scroll', 'true');
    if (activeTabId) {
      sessionStorage.setItem('stackly_active_traveller_tab', activeTabId);
    }
  } catch (err) {}
}

document.addEventListener('click', function(e) {
  const target = e.target.closest('a, button, [role="button"]');
  if (!target) return;
  const href = (target.getAttribute && target.getAttribute('href')) || '';
  const onclick = (target.getAttribute && target.getAttribute('onclick')) || '';
  if (href.includes('404.html') || onclick.includes('404.html') || target.dataset.goto404) {
    captureTravellerNavigationReturnState(target);
  }
}, true);

window.addEventListener('beforeunload', function() {
  if (!window.location.pathname.includes('404.html')) {
    try {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      const activeEl = document.querySelector('.dashboard-tab-content.active');
      const activeTabId = activeEl ? activeEl.id : '';
      const tabHashMap = {
        'tabTravellerOverview': '#overview',
        'tabTravellerTrips': '#my-trips',
        'tabTravellerExplore': '#tour-packages',
        'tabTravellerAnalytics': '#analytics',
        'tabTravellerWishlist': '#wishlist'
      };
      const tabHash = (activeTabId && tabHashMap[activeTabId]) ? tabHashMap[activeTabId] : (window.location.hash || '');
      const cleanUrl = window.location.origin + window.location.pathname + tabHash;

      // Don't overwrite if recent click on specific element
      const existingRaw = sessionStorage.getItem('stackly_nav_return_state');
      if (existingRaw) {
        const existing = JSON.parse(existingRaw);
        if (existing && existing.elementId && (Date.now() - existing.timestamp < 3500)) {
          return;
        }
      }

      const state = {
        url: cleanUrl,
        pathname: window.location.pathname,
        hash: tabHash,
        activeTabId: activeTabId,
        scrollY: Math.round(currentScrollY),
        elemY: Math.round(currentScrollY),
        timestamp: Date.now()
      };
      sessionStorage.setItem('stackly_nav_return_state', JSON.stringify(state));
    } catch (e) {}
  }
});

function restoreTravellerPreviousScrollPosition() {
  try {
    const raw = sessionStorage.getItem('stackly_nav_return_state');
    if (!raw) return;

    const state = JSON.parse(raw);
    if (!state) return;

    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    const savedPath = (state.pathname || '').replace(/\/$/, '') || '/';
    if (!currentPath.endsWith(savedPath) && !savedPath.endsWith(currentPath) && sessionStorage.getItem('stackly_should_restore_scroll') !== 'true') return;

    // 1. ACTIVATE CORRECT TAB IMMEDIATELY!
    let targetTabId = state.activeTabId;
    if (!targetTabId) {
      const hash = state.hash || window.location.hash;
      if (hash === '#tour-packages') targetTabId = 'tabTravellerExplore';
      else if (hash === '#my-trips') targetTabId = 'tabTravellerTrips';
      else if (hash === '#analytics') targetTabId = 'tabTravellerAnalytics';
      else if (hash === '#wishlist' || hash === '#settings') targetTabId = 'tabTravellerWishlist';
      else if (hash === '#overview' || hash === '#dashboard') targetTabId = 'tabTravellerOverview';
    }
    if (!targetTabId) {
      try {
        targetTabId = sessionStorage.getItem('stackly_active_traveller_tab');
      } catch (e) {}
    }

    if (targetTabId && typeof window.switchToTab === 'function') {
      window.switchToTab(targetTabId, { preserveScroll: true });
    }

    // Dismiss preloader immediately on back navigation to prevent blocking view
    const preloader = document.getElementById('stacklyPreloader');
    if (preloader) {
      preloader.style.display = 'none';
      preloader.classList.add('fade-out');
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

    applyScroll();
    requestAnimationFrame(applyScroll);
    setTimeout(applyScroll, 20);
    setTimeout(applyScroll, 60);
    setTimeout(applyScroll, 120);
    setTimeout(applyScroll, 250);
    setTimeout(applyScroll, 500);
    setTimeout(applyScroll, 900);
    setTimeout(function() {
      applyScroll();
      sessionStorage.removeItem('stackly_should_restore_scroll');
    }, 1400);
  } catch (err) {
    console.error('Traveller scroll restore failed:', err);
  }
}

window.addEventListener('pageshow', restoreTravellerPreviousScrollPosition);
window.addEventListener('load', restoreTravellerPreviousScrollPosition);
