/**
 * STACKLY TOURISM & TRAVEL PORTAL - TOUR OPERATOR DASHBOARD
 * Features:
 * - 5 Clean Main Pages (Dashboard, Bookings, Tour Packages, Analytics, Settings)
 * - Dynamic Welcome Note with user name from Signup / localStorage
 * - Profile Widget with Initials Avatar (e.g., KS for Kumar Swami, HA for Hari)
 * - Profile Dropdown Card showing Name, Email, and Selected Role
 * - Interactive Charts, Live Synced Bookings Register, and Status Management
 */

// Strictly suppress native browser alert popups throughout the entire website
window.alert = function() { /* Browser popups disabled */ };

let currentBookingFilter = 'all';

function initOperatorDashboard() {
  try { initPreloader(); } catch (e) { console.error('Error initPreloader:', e); }
  try { initOperatorUserProfile(); } catch (e) { console.error('Error initOperatorUserProfile:', e); }
  try { initOperatorSidebar(); } catch (e) { console.error('Error initOperatorSidebar:', e); }
  try { initOperatorCleanNav(); } catch (e) { console.error('Error initOperatorCleanNav:', e); }
  try { initOperatorCharts(); } catch (e) { console.error('Error initOperatorCharts:', e); }
  try { initBookingFilters(); } catch (e) { console.error('Error initBookingFilters:', e); }
  try { renderOperatorBookingsTable(); } catch (e) { console.error('Error renderOperatorBookingsTable:', e); }
  try { runOperatorLiveCounters('tabOperatorOverview'); } catch (e) { console.error('Error runOperatorLiveCounters:', e); }
  try { initOperatorLiveFeed(); } catch (e) { console.error('Error initOperatorLiveFeed:', e); }
  try { initOperatorProfileDropdown(); } catch (e) { console.error('Error initOperatorProfileDropdown:', e); }
  try { initOperatorProfileForm(); } catch (e) { console.error('Error initOperatorProfileForm:', e); }
  try { initOperatorSectionHeadingTextAnimation(); } catch (e) { console.error('Error initOperatorSectionHeadingTextAnimation:', e); }
  try { restoreOperatorPreviousScrollPosition(); } catch (e) {}
  setTimeout(() => {
    const preloader = document.getElementById('stacklyPreloader');
    if (!preloader || preloader.style.display === 'none' || preloader.classList.contains('fade-out')) {
      const activeEl = document.querySelector('.dashboard-tab-content.active');
      const activeTabId = activeEl ? activeEl.id : 'tabOperatorOverview';
      animateOperatorAllTabSections(activeTabId);
    }
  }, 400);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOperatorDashboard);
} else {
  initOperatorDashboard();
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
function getStoredOperatorUser() {
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
    role: 'operator'
  };
}

// 1. Initialize User Profile across UI
function initOperatorUserProfile() {
  const user = getStoredOperatorUser();
  const initials = getUserInitials(user.name);
  const roleLabel = 'Tour Operator';

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
  const detailName = document.getElementById('profileDetailNameDisplay');
  const detailEmail = document.getElementById('profileDetailEmailDisplay');
  const detailRole = document.getElementById('profileDetailRoleDisplay');

  if (cardAvatar) cardAvatar.textContent = initials;
  if (cardName) cardName.textContent = user.name;
  if (cardEmail) cardEmail.textContent = user.email || 'maheshsabari@gmail.com';
  if (cardRole) cardRole.textContent = roleLabel;
  if (detailName) detailName.textContent = user.name;
  if (detailEmail) detailEmail.textContent = user.email || 'maheshsabari@gmail.com';
  if (detailRole) detailRole.textContent = roleLabel;

  // Overview Welcome Banner
  const welcomeEl = document.getElementById('welcomeOperatorName');
  if (welcomeEl) welcomeEl.textContent = user.name;
}

// 2. Profile Dropdown Interaction
function initOperatorProfileDropdown() {
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
        showOperatorToast('Logged out successfully. Redirecting to login...');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 800);
      });
    }
  });
}

// 3. Settings Form Sync
function initOperatorProfileForm() {
  const form = document.getElementById('operatorProfileForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('operatorFormName');
    const emailInput = document.getElementById('operatorFormEmail');

    if (nameInput && nameInput.value.trim()) {
      const updatedUser = {
        name: nameInput.value.trim(),
        email: emailInput ? emailInput.value.trim() : 'maheshsabari@gmail.com',
        role: 'operator'
      };
      localStorage.setItem('stackly_user', JSON.stringify(updatedUser));
    }
    showOperatorToast('Operator profile saved successfully!');
  });
}

// 4. Clean 5-Heading Navigation & Hash Routing
function initOperatorCleanNav() {
  const links = document.querySelectorAll('.sidebar-clean-link');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTabId = link.getAttribute('data-target-tab');
      if (targetTabId) {
        window.switchToOperatorTab(targetTabId);
      }
    });
  });

  // URL Hash routing
  function handleHash() {
    const hash = window.location.hash;
    if (hash === '#overview' || hash === '#dashboard') window.switchToOperatorTab('tabOperatorOverview');
    else if (hash === '#bookings') window.switchToOperatorTab('tabOperatorBookings');
    else if (hash === '#tour-packages') window.switchToOperatorTab('tabOperatorPackages');
    else if (hash === '#analytics') window.switchToOperatorTab('tabOperatorAnalytics');
    else if (hash === '#inquiries' || hash === '#settings') window.switchToOperatorTab('tabOperatorInquiries');
    else {
      // Restore previously saved tab if available
      try {
        const savedTab = sessionStorage.getItem('stackly_active_operator_tab');
        if (savedTab && document.getElementById(savedTab)) {
          window.switchToOperatorTab(savedTab, { preserveScroll: true });
        }
      } catch (e) {}
    }
  }

  window.addEventListener('hashchange', handleHash);
  if (window.location.hash) {
    handleHash();
  }
}

window.switchToOperatorTab = function(tabId, options = {}) {
  const links = document.querySelectorAll('.sidebar-clean-link');
  const tabs = document.querySelectorAll('.dashboard-tab-content');
  const pageTitle = document.getElementById('operatorPageTitle');

  // Update tabs
  tabs.forEach(tab => {
    if (tab.id === tabId) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Update sidebar links
  links.forEach(link => {
    if (link.getAttribute('data-target-tab') === tabId) {
      link.classList.add('active');
      const text = link.querySelector('span')?.textContent || 'Overview';
      if (pageTitle) pageTitle.textContent = (text === 'Dashboard' || text === 'Operator Overview') ? 'Overview' : text;
    } else {
      link.classList.remove('active');
    }
  });

  // Update URL hash without jumping page
  const tabSlugMap = {
    'tabOperatorOverview': 'overview',
    'tabOperatorBookings': 'bookings',
    'tabOperatorPackages': 'tour-packages',
    'tabOperatorAnalytics': 'analytics',
    'tabOperatorInquiries': 'inquiries'
  };
  const slug = tabSlugMap[tabId];
  if (slug) {
    try {
      history.replaceState(null, '', '#' + slug);
    } catch (err) {}
  }
  try {
    sessionStorage.setItem('stackly_active_operator_tab', tabId);
  } catch (err) {}

  // Trigger resize so Chart.js recalculates dimensions
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
    if (tabId === 'tabOperatorOverview') {
      runOperatorLiveCounters('tabOperatorOverview');
    } else if (tabId === 'tabOperatorBookings') {
      renderOperatorBookingsTable(window.currentBookingFilter || 'all');
    }
    // Trigger alternating section entrance & combined inner animations across active operator tab
    animateOperatorAllTabSections(tabId);
  }, 60);

  // Close mobile sidebar if open
  const sidebar = document.getElementById('operatorSidebar');
  if (sidebar && window.innerWidth <= 900) {
    sidebar.classList.remove('open');
  }

  // Scroll main container to top ONLY if not preserving scroll
  if (!options || !options.preserveScroll) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
};

// 4a. Master Orchestrator: Alternating Section Entrances & Combined Component Animations
// 1st section comes from right side, 2nd from left side, 3rd from right, 4th from left...
function animateOperatorAllTabSections(tabId = 'tabOperatorOverview') {
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
        console.warn('GSAP operator section animation bypassed:', e);
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
  // 1. Overview banner
  if (tabId === 'tabOperatorOverview') {
    triggerOperatorCardsAnimation();
  }

  // 2. Two-Card rows inside current tab: Smooth Top-to-Down
  triggerOperatorTwoCardsAnimation('#' + tabId + ' .two-card-row, #' + tabId + ' .charts-grid-2col, #' + tabId + ' .charts-grid-equal');

  // 3. 4-Card KPI Grids: Smooth Top-to-Down into direct grid slots
  triggerOperatorShuffleArrangeCards('#' + tabId + ' .kpi-grid');

  // 4. Section Headings: Kinetic letter-by-letter entrance in gold resolving to navy
  animateOperatorSectionHeadings('#' + tabId);
}

// 4b. Overview Banner Top-to-Down Entrance Animation
function triggerOperatorCardsAnimation() {
  const card1 = document.querySelector('#tabOperatorOverview .dashboard-welcome-banner');
  if (!card1) return;

  if (typeof gsap !== 'undefined') {
    try {
      gsap.killTweensOf(card1);

      gsap.fromTo(card1,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity' }
      );
      return;
    } catch (e) {
      console.warn('GSAP card animation bypassed:', e);
    }
  }

  // Pure CSS animation fallback
  card1.classList.remove('animate-slide-left');
  void card1.offsetWidth;
  card1.classList.add('animate-slide-left');
}

// 4c. Top-to-Down Entrance Animation for Operator KPI Cards & Other Cards
function triggerOperatorShuffleArrangeCards(containerSelector = '#tabOperatorOverview .kpi-grid') {
  const containers = document.querySelectorAll(containerSelector);
  if (!containers || !containers.length) return;

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
              clearProps: 'transform,boxShadow,zIndex,opacity'
            }
          );
        });
        return;
      } catch (e) {
        console.warn('GSAP operator card shuffle bypassed:', e);
      }
    }

    // Pure CSS reflow fallback
    cards.forEach(card => {
      card.style.animation = 'none';
      card.style.opacity = '1';
      card.style.visibility = 'visible';
      void card.offsetWidth;
      card.style.animation = '';
    });
  });
}

// 4d. Two-Card Row Entrance (Smooth Top-to-Down)
function triggerOperatorTwoCardsAnimation(containerSelector = '.two-card-row, .charts-grid-2col, .charts-grid-equal') {
  const containers = document.querySelectorAll(containerSelector);
  if (!containers || !containers.length) return;

  containers.forEach(container => {
    const leftCard = container.querySelector('.chart-card:first-child, .kpi-card:first-child') || container.firstElementChild;
    const rightCard = (container.children.length > 1) ? (container.querySelector('.chart-card:last-child, .kpi-card:last-child') || container.lastElementChild) : null;
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
        console.warn('GSAP operator two-card animation bypassed:', e);
      }
    }

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

function triggerOperatorTwoChartsAnimation(containerSelector = '.two-card-row, .charts-grid-2col, .charts-grid-equal') {
  triggerOperatorTwoCardsAnimation(containerSelector);
}

// 4e. Section Headings: Split Text for Letter-by-Letter & Word-by-Word Animation
function initOperatorSectionHeadingTextAnimation() {
  const headers = document.querySelectorAll('.dashboard-section-header');
  headers.forEach(header => {
    const textSpan = header.querySelector('span');
    if (!textSpan || textSpan.dataset.split) return;
    
    const rawText = textSpan.textContent.trim();
    if (!rawText) return;

    const words = rawText.split(/\s+/);
    textSpan.innerHTML = words.map(word => {
      const chars = word.split('').map(char => `<span class="heading-char">${char}</span>`).join('');
      return `<span class="heading-word">${chars}</span>`;
    }).join(' ');

    textSpan.dataset.split = 'true';
  });
}

// Animate Section Heading Text (Letters glide in from right side in gold and turn to black)
function animateOperatorSectionHeadings(scopeSelector = '#tabOperatorOverview') {
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
            stagger: 0.022,
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
        console.warn('GSAP operator heading text animation bypassed:', e);
      }
    }

    chars.forEach(c => {
      c.style.animation = 'none';
      void c.offsetWidth;
      c.style.animation = '';
    });
  });
}

// 5. Mobile Sidebar Toggle
function initOperatorSidebar() {
  const toggleBtn = document.getElementById('operatorMobileToggle');
  const sidebar = document.getElementById('operatorSidebar');
  const closeBtn = document.getElementById('operatorSidebarCloseBtn') || document.querySelector('.sidebar-close-btn');

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
      if (typeof window.switchToOperatorTab === 'function') {
        window.switchToOperatorTab('tabOperatorOverview');
      }
      try {
        history.pushState(null, '', 'dashboard-operator.html');
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

// 5b. Live Number Roll-Up / Count-Up Animation
function animateOperatorNumber(el, target, duration = 1200) {
  if (!el) return;
  const start = 0;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const val = start + (target - start) * ease;
    el.textContent = Math.round(val).toLocaleString('en-US');

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target.toLocaleString('en-US');
    }
  }

  requestAnimationFrame(step);
}

function runOperatorLiveCounters(scopeId) {
  const container = scopeId ? document.getElementById(scopeId) : document;
  if (!container) return;
  const counters = container.querySelectorAll('.live-counter-num');
  counters.forEach(c => {
    const rawVal = c.getAttribute('data-target') || c.textContent.replace(/[^0-9.]/g, '');
    const target = parseFloat(rawVal);
    if (!isNaN(target)) {
      animateOperatorNumber(c, target, target > 1000 ? 1500 : 900);
    }
  });
}

// 5c. Continuous Live Feed simulation for bookings and revenue
let liveBookingsCount = 1428;
let liveRevenueCount = 1284500;
let operatorFeedInterval = null;
function initOperatorLiveFeed() {
  const bookingsEl = document.getElementById('opKpiBookings');
  const revenueEl = document.getElementById('opKpiRevenue');
  const bookTicker = document.getElementById('opBookingsTicker');
  const revTicker = document.getElementById('opRevenueTicker');

  if (operatorFeedInterval) clearInterval(operatorFeedInterval);
  operatorFeedInterval = setInterval(() => {
    liveBookingsCount += 1;
    liveRevenueCount += 450;

    if (bookingsEl) bookingsEl.textContent = liveBookingsCount.toLocaleString('en-US');
    if (revenueEl) revenueEl.textContent = liveRevenueCount.toLocaleString('en-US');

    if (bookTicker) {
      bookTicker.textContent = '+1';
      bookTicker.classList.add('active');
      setTimeout(() => bookTicker.classList.remove('active'), 700);
    }
    if (revTicker) {
      revTicker.textContent = '+$450';
      revTicker.classList.add('active');
      setTimeout(() => revTicker.classList.remove('active'), 700);
    }
  }, 6000);
}

// 6. Chart.js Analytics Charts
function initOperatorCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js library is not loaded. Skipping operator chart initialization.');
    return;
  }

  try {
    const bluePrimary = '#3823c9';
    const blueHover = '#2a16ad';
    const blueLight = '#e0e9fa';
    const accentGreen = '#10b981';
    const accentGold = '#f59e0b';
    const accentRed = '#ef4444';

    window.__operatorCharts = [];

    // 1. Monthly Bookings (Area / Line Chart)
    const ctxMonthly = document.getElementById('chartMonthlyBookings')?.getContext('2d');
    if (ctxMonthly) {
      const oc1 = new Chart(ctxMonthly, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Bookings (2026)',
            data: [65, 82, 110, 145, 190, 240, 310, 290, 220, 260, 280, 340],
            borderColor: bluePrimary,
            backgroundColor: 'rgba(56, 35, 201, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: bluePrimary,
            pointRadius: 4,
            borderWidth: 2.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: '#f1f5f9' } },
            x: { grid: { display: false } }
          }
        }
      });
      window.__operatorCharts.push(oc1);
    }

    // 2. Booking Status Doughnut Chart
    const ctxStatus = document.getElementById('chartBookingStatus')?.getContext('2d');
    if (ctxStatus) {
      const oc2 = new Chart(ctxStatus, {
        type: 'doughnut',
        data: {
          labels: ['Confirmed', 'Pending', 'Cancelled'],
          datasets: [{
            data: [72, 18, 10],
            backgroundColor: [accentGreen, accentGold, accentRed],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: { legend: { position: 'bottom' } }
        }
      });
      window.__operatorCharts.push(oc2);
    }

    // 3. Revenue Analytics (Bar Chart)
    const ctxRevenue = document.getElementById('chartRevenueAnalytics')?.getContext('2d');
    if (ctxRevenue) {
      const oc3 = new Chart(ctxRevenue, {
        type: 'bar',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [
            {
              label: 'Actual Revenue ($k)',
              data: [142, 185, 230, 215, 178, 205],
              backgroundColor: bluePrimary,
              borderRadius: 6
            },
            {
              label: 'Target Revenue ($k)',
              data: [130, 170, 210, 200, 170, 195],
              backgroundColor: blueLight,
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } },
          scales: {
            y: { grid: { color: '#f1f5f9' } },
            x: { grid: { display: false } }
          }
        }
      });
      window.__operatorCharts.push(oc3);
    }

    // 4. Destination Popularity (Horizontal Bar)
    const ctxDest = document.getElementById('chartDestinationPopularity')?.getContext('2d');
    if (ctxDest) {
      const oc4 = new Chart(ctxDest, {
        type: 'bar',
        data: {
          labels: ['Bali', 'Swiss Alps', 'Maldives', 'Dubai', 'Kashmir', 'Paris'],
          datasets: [{
            label: 'Travellers',
            data: [940, 810, 760, 680, 610, 520],
            backgroundColor: ['#3823c9', '#4d39e6', '#6451ee', '#7f6ff3', '#9b8ef8', '#b7adfc'],
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
      window.__operatorCharts.push(oc4);
    }

    // 5. Traveller Growth (Line Chart)
    const ctxGrowth = document.getElementById('chartTravellerGrowth')?.getContext('2d');
    if (ctxGrowth) {
      const oc5 = new Chart(ctxGrowth, {
        type: 'line',
        data: {
          labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026'],
          datasets: [{
            label: 'Total Active Travellers',
            data: [1200, 1850, 2400, 3100, 3750, 4300, 4890],
            borderColor: accentGreen,
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
      window.__operatorCharts.push(oc5);
    }

    // 6. Tour Performance (Bar Chart)
    const ctxPerf = document.getElementById('chartTourPerformance')?.getContext('2d');
    if (ctxPerf) {
      const oc6 = new Chart(ctxPerf, {
        type: 'bar',
        data: {
          labels: ['Bali Escape', 'Swiss Peaks', 'Maldives Villa', 'Dubai Safari', 'Kashmir Dal Lake'],
          datasets: [{
            label: 'Satisfaction Score (Out of 100)',
            data: [98, 96, 99, 94, 97],
            backgroundColor: bluePrimary,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { min: 80, max: 100 }
          }
        }
      });
      window.__operatorCharts.push(oc6);
    }

    // Window resize listener to auto-scale charts
    window.addEventListener('resize', () => {
      if (window.__operatorCharts && window.__operatorCharts.length) {
        window.__operatorCharts.forEach(c => {
          try { c.resize(); } catch(e){}
        });
      }
    });
  } catch (err) {
    console.error('Error during operator charts initialization:', err);
  }
}

// 7. Render Operator Bookings Table with Filter
window.currentBookingFilter = 'all';

window.updateBookingFilterButtons = function(activeFilter) {
  const norm = (activeFilter || 'all').toLowerCase();
  const buttons = document.querySelectorAll('.booking-filter-btn');
  buttons.forEach(btn => {
    const f = (btn.getAttribute('data-filter') || '').toLowerCase();
    if (f === norm) {
      btn.classList.add('btn-primary');
      btn.classList.remove('btn-outline');
    } else {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline');
    }
  });
};

window.filterBookings = function(filter, clickedBtn) {
  const targetFilter = (filter || 'all').toLowerCase();
  window.currentBookingFilter = targetFilter;
  updateBookingFilterButtons(targetFilter);
  renderOperatorBookingsTable(targetFilter);
};

window.initBookingFilters = function() {
  const buttons = document.querySelectorAll('.booking-filter-btn');
  buttons.forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      const filter = this.getAttribute('data-filter') || 'all';
      window.filterBookings(filter, this);
    };
  });
};

window.renderOperatorBookingsTable = function(filter) {
  if (filter !== undefined) {
    window.currentBookingFilter = (filter || 'all').toLowerCase();
  }
  const activeFilter = (window.currentBookingFilter || 'all').toLowerCase();
  updateBookingFilterButtons(activeFilter);

  const tableBody = document.getElementById('operatorBookingsTableBody');
  if (!tableBody) return;

  const allBookings = (typeof getAllBookings === 'function') ? getAllBookings() : [];
  let bookings = allBookings;

  if (activeFilter !== 'all') {
    bookings = allBookings.filter(b => (b.status || '').toLowerCase() === activeFilter);
  }

  tableBody.innerHTML = '';

  if (!bookings || bookings.length === 0) {
    const prettyFilter = activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1);
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:36px 16px; color:var(--text-muted);">
          <div style="font-size:2rem; color:var(--primary-blue); opacity:0.35; margin-bottom:8px;">
            <i class="fas fa-calendar-times"></i>
          </div>
          <div style="font-weight:600; font-size:0.95rem; color:var(--text-dark-navy);">No ${prettyFilter} Bookings Found</div>
          <p style="font-size:0.82rem; margin-top:4px; max-width:380px; margin-left:auto; margin-right:auto; color:var(--text-muted);">
            There are currently no reservations marked as <strong>${prettyFilter}</strong> in the booking register.
          </p>
        </td>
      </tr>
    `;
    return;
  }

  bookings.forEach(b => {
    const tr = document.createElement('tr');
    tr.id = `booking-row-${b.id}`;
    const statusClass = (b.status || 'Confirmed').toLowerCase();

    tr.innerHTML = `
      <td><strong style="color:var(--primary-blue); font-family:monospace; font-size:0.88rem;">${b.id}</strong></td>
      <td>
        <div style="font-weight:600; color:var(--text-dark-navy);">${b.travellerName || 'Traveller'}</div>
        <div style="font-size:0.78rem; color:var(--text-muted);">${b.travellerEmail || 'N/A'}</div>
      </td>
      <td>
        <div style="font-weight:600; color:var(--text-dark-navy);">${b.tourTitle || 'Custom Tour'}</div>
        <div style="font-size:0.78rem; color:var(--primary-blue);"><i class="fas fa-map-marker-alt" style="font-size:0.7rem; margin-right:4px;"></i>${b.destination || 'Global'}</div>
      </td>
      <td>
        <div style="font-size:0.85rem; font-weight:500;">${b.travelDate || 'Flexible'}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${b.adults || 1} Adult(s)${b.children ? `, ${b.children} Child` : ''}</div>
      </td>
      <td><strong style="color:var(--text-dark-navy); font-size:0.92rem;">$${Number(b.totalPrice || 0).toLocaleString()}</strong></td>
      <td><span class="status-badge ${statusClass}">${b.status || 'Confirmed'}</span></td>
      <td>
        <div style="display:flex; gap:6px; align-items:center;">
          ${(b.status || '').toLowerCase() !== 'confirmed' ? `
            <button class="table-action-btn" title="Confirm Booking" onclick="operatorChangeStatus('${b.id}', 'Confirmed')" aria-label="Confirm Booking">
              <i class="fas fa-check" style="color:var(--accent-green);"></i>
            </button>
          ` : ''}
          ${(b.status || '').toLowerCase() !== 'cancelled' ? `
            <button class="table-action-btn danger" title="Cancel Booking" onclick="operatorChangeStatus('${b.id}', 'Cancelled')" aria-label="Cancel Booking">
              <i class="fas fa-times"></i>
            </button>
          ` : ''}
          <button class="table-action-btn" title="Toggle Booking Details" onclick="operatorToggleDetails('${b.id}')" aria-label="Toggle Details">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);

    // Expandable detailed view row
    const detailTr = document.createElement('tr');
    detailTr.id = `booking-detail-${b.id}`;
    detailTr.style.display = 'none';
    detailTr.className = 'booking-detail-expanded-row';
    const addonsList = Array.isArray(b.addons) && b.addons.length > 0 ? b.addons.join(', ') : 'None selected';
    detailTr.innerHTML = `
      <td colspan="7" style="background:#f8fafc; padding:18px 24px; border-top:1px dashed var(--border-light); border-bottom:2px solid var(--border-light);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
          <div style="flex:1; min-width:220px;">
            <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted); font-weight:700; margin-bottom:4px;">Reservation Information</div>
            <div style="font-size:0.9rem; font-weight:600; color:var(--text-dark-navy);">${b.tourTitle}</div>
            <div style="font-size:0.82rem; color:var(--text-muted); margin-top:2px;">Booking ID: <strong>${b.id}</strong> &bull; Booked Date: ${b.bookedAt || '2026-10-20'}</div>
            <div style="font-size:0.82rem; color:var(--text-muted); margin-top:2px;">Add-ons / Concierge: <strong>${addonsList}</strong></div>
          </div>
          <div style="flex:1; min-width:200px;">
            <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted); font-weight:700; margin-bottom:4px;">Traveller Details</div>
            <div style="font-size:0.88rem; font-weight:600; color:var(--text-dark-navy);">${b.travellerName}</div>
            <div style="font-size:0.82rem; color:var(--text-muted);">${b.travellerEmail}</div>
            <div style="font-size:0.82rem; color:var(--text-muted); margin-top:2px;">Party Size: ${b.totalTravellers || (b.adults || 1) + (b.children || 0)} Guests (${b.adults || 1} Adult(s), ${b.children || 0} Children)</div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
            <div style="font-size:0.85rem; color:var(--text-muted);">Total Price: <strong style="color:var(--primary-blue); font-size:1.05rem;">$${Number(b.totalPrice || 0).toLocaleString()}</strong></div>
            <div style="display:flex; gap:8px;">
              ${(b.status || '').toLowerCase() !== 'confirmed' ? `<button class="btn btn-primary btn-sm" onclick="operatorChangeStatus('${b.id}', 'Confirmed')" style="padding:6px 14px; font-size:0.8rem;"><i class="fas fa-check"></i> Mark Confirmed</button>` : ''}
              ${(b.status || '').toLowerCase() !== 'cancelled' ? `<button class="btn btn-outline btn-sm" onclick="operatorChangeStatus('${b.id}', 'Cancelled')" style="padding:6px 14px; font-size:0.8rem; color:var(--accent-red); border-color:var(--accent-red);"><i class="fas fa-ban"></i> Cancel Booking</button>` : ''}
              <button class="btn btn-ghost btn-sm" onclick="operatorToggleDetails('${b.id}')" style="padding:6px 10px; font-size:0.8rem;"><i class="fas fa-chevron-up"></i> Close</button>
            </div>
          </div>
        </div>
      </td>
    `;
    tableBody.appendChild(detailTr);
  });
};

// Toggle expandable details row
window.operatorToggleDetails = function(id) {
  const row = document.getElementById(`booking-detail-${id}`);
  if (!row) return;
  if (row.style.display === 'none' || !row.style.display) {
    row.style.display = 'table-row';
  } else {
    row.style.display = 'none';
  }
};
window.operatorViewBooking = window.operatorToggleDetails;

// Global hook for changing status
window.operatorChangeStatus = function(id, newStatus) {
  if (typeof updateBookingStatus === 'function') {
    updateBookingStatus(id, newStatus);
  }
  renderOperatorBookingsTable(window.currentBookingFilter || 'all');
};

window.showOperatorToast = function(msg) {
  // Suppressed: Toast notifications disabled throughout the entire website
  const existing = document.getElementById('operatorToast');
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
  return;
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
    animateOperatorAllTabSections('tabOperatorOverview');
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

function captureOperatorNavigationReturnState(targetElement) {
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
      'tabOperatorOverview': '#overview',
      'tabOperatorBookings': '#bookings',
      'tabOperatorPackages': '#tour-packages',
      'tabOperatorAnalytics': '#analytics',
      'tabOperatorInquiries': '#inquiries'
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
      sessionStorage.setItem('stackly_active_operator_tab', activeTabId);
    }
  } catch (err) {}
}

document.addEventListener('click', function(e) {
  const target = e.target.closest('a, button, [role="button"]');
  if (!target) return;
  const href = (target.getAttribute && target.getAttribute('href')) || '';
  const onclick = (target.getAttribute && target.getAttribute('onclick')) || '';
  if (href.includes('404.html') || onclick.includes('404.html') || target.dataset.goto404) {
    captureOperatorNavigationReturnState(target);
  }
}, true);

window.addEventListener('beforeunload', function() {
  if (!window.location.pathname.includes('404.html')) {
    try {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      const activeEl = document.querySelector('.dashboard-tab-content.active');
      const activeTabId = activeEl ? activeEl.id : '';
      const tabHashMap = {
        'tabOperatorOverview': '#overview',
        'tabOperatorBookings': '#bookings',
        'tabOperatorPackages': '#tour-packages',
        'tabOperatorAnalytics': '#analytics',
        'tabOperatorInquiries': '#inquiries'
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

function restoreOperatorPreviousScrollPosition() {
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
      if (hash === '#tour-packages') targetTabId = 'tabOperatorPackages';
      else if (hash === '#bookings') targetTabId = 'tabOperatorBookings';
      else if (hash === '#analytics') targetTabId = 'tabOperatorAnalytics';
      else if (hash === '#inquiries' || hash === '#settings') targetTabId = 'tabOperatorInquiries';
      else if (hash === '#overview' || hash === '#dashboard') targetTabId = 'tabOperatorOverview';
    }
    if (!targetTabId) {
      try {
        targetTabId = sessionStorage.getItem('stackly_active_operator_tab');
      } catch (e) {}
    }

    if (targetTabId && typeof window.switchToOperatorTab === 'function') {
      window.switchToOperatorTab(targetTabId, { preserveScroll: true });
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
    console.error('Operator scroll restore failed:', err);
  }
}

window.addEventListener('pageshow', restoreOperatorPreviousScrollPosition);
window.addEventListener('load', restoreOperatorPreviousScrollPosition);
