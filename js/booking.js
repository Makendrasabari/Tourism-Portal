/**
 * STACKLY TOURISM & TRAVEL PORTAL - UNIVERSAL BOOKING ENGINE & DATA STORE
 * Supports interactive booking modals, on-page calculators, localStorage sync,
 * and seamless updates across Traveller and Tour Operator dashboards.
 */

const STACKLY_STORAGE_KEY = 'stackly_bookings_data';

// Default initial mock bookings
const defaultBookings = [
  {
    id: 'STK-2026-8841',
    tourTitle: 'Bali Tropical Paradise & Nusa Penida',
    destination: 'Bali, Indonesia',
    travellerName: 'Elena Vance',
    travellerEmail: 'elena@stackly.com',
    travelDate: '2026-11-15',
    adults: 2,
    children: 1,
    totalTravellers: 3,
    packagePrice: 1250,
    addons: ['Travel Insurance', 'Airport Transfer'],
    totalPrice: 2855,
    status: 'Confirmed',
    bookedAt: '2026-10-20'
  },
  {
    id: 'STK-2026-7294',
    tourTitle: 'Swiss Alps Glacier Express & Peaks',
    destination: 'Zermatt, Switzerland',
    travellerName: 'Elena Vance',
    travellerEmail: 'elena@stackly.com',
    travelDate: '2026-12-05',
    adults: 2,
    children: 0,
    totalTravellers: 2,
    packagePrice: 2199,
    addons: ['Travel Insurance'],
    totalPrice: 4443,
    status: 'Confirmed',
    bookedAt: '2026-10-22'
  },
  {
    id: 'STK-2026-6130',
    tourTitle: 'Maldives Overwater Luxury Villa Retreat',
    destination: 'Male, Maldives',
    travellerName: 'Marcus Sterling',
    travellerEmail: 'marcus@example.com',
    travelDate: '2026-11-28',
    adults: 2,
    children: 0,
    totalTravellers: 2,
    packagePrice: 2899,
    addons: ['VIP Airport Lounge', 'Spa Package'],
    totalPrice: 6187,
    status: 'Pending',
    bookedAt: '2026-10-24'
  },
  {
    id: 'STK-2026-5519',
    tourTitle: 'Kashmir Paradise Valley & Dal Lake Houseboat',
    destination: 'Srinagar, Kashmir',
    travellerName: 'Priya Sharma',
    travellerEmail: 'priya@example.com',
    travelDate: '2026-12-18',
    adults: 4,
    children: 1,
    totalTravellers: 5,
    packagePrice: 650,
    addons: ['Gondola Ride', 'Pony Trekking'],
    totalPrice: 3412,
    status: 'Confirmed',
    bookedAt: '2026-10-25'
  },
  {
    id: 'STK-2026-4491',
    tourTitle: 'Tokyo & Kyoto Cultural Autumn Odyssey',
    destination: 'Tokyo, Japan',
    travellerName: 'David Chen',
    travellerEmail: 'david@example.com',
    travelDate: '2026-11-10',
    adults: 1,
    children: 0,
    totalTravellers: 1,
    packagePrice: 1850,
    addons: ['Bullet Train Pass'],
    totalPrice: 1942,
    status: 'Cancelled',
    bookedAt: '2026-10-15'
  },
  {
    id: 'STK-2026-3918',
    tourTitle: 'Swiss Alps Peaks Odyssey & Glacier Hike',
    destination: 'Zermatt, Switzerland',
    travellerName: 'Sophia Chen',
    travellerEmail: 'sophia@example.com',
    travelDate: '2026-12-10',
    adults: 4,
    children: 0,
    totalTravellers: 4,
    packagePrice: 2199,
    addons: ['Helicopter Tour', 'Fondue Dining'],
    totalPrice: 8796,
    status: 'Pending',
    bookedAt: '2026-10-26'
  },
  {
    id: 'STK-2026-2180',
    tourTitle: 'Santorini Sunset Luxury Catamaran Cruise',
    destination: 'Santorini, Greece',
    travellerName: 'Liam Thorne',
    travellerEmail: 'liam@example.com',
    travelDate: '2026-11-04',
    adults: 2,
    children: 0,
    totalTravellers: 2,
    packagePrice: 1450,
    addons: ['Private Wine Tasting'],
    totalPrice: 2900,
    status: 'Cancelled',
    bookedAt: '2026-10-18'
  }
];

// Initialize Storage
function initializeBookingsStore() {
  if (!localStorage.getItem(STACKLY_STORAGE_KEY)) {
    localStorage.setItem(STACKLY_STORAGE_KEY, JSON.stringify(defaultBookings));
  }
}

// Retrieve all bookings
function getAllBookings() {
  initializeBookingsStore();
  try {
    const raw = localStorage.getItem(STACKLY_STORAGE_KEY);
    if (!raw) return defaultBookings;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STACKLY_STORAGE_KEY, JSON.stringify(defaultBookings));
      return defaultBookings;
    }
    // Guarantee that pending, confirmed, and cancelled sample bookings exist for UI filtering
    let updated = false;
    ['Pending', 'Confirmed', 'Cancelled'].forEach(statusName => {
      const exists = parsed.some(b => (b.status || '').toLowerCase() === statusName.toLowerCase());
      if (!exists) {
        const sample = defaultBookings.filter(b => b.status.toLowerCase() === statusName.toLowerCase());
        sample.forEach(s => {
          if (!parsed.some(p => p.id === s.id)) {
            parsed.push(s);
            updated = true;
          }
        });
      }
    });
    if (updated) {
      localStorage.setItem(STACKLY_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    return defaultBookings;
  }
}

// Save a new booking
function createNewBooking(bookingData) {
  const bookings = getAllBookings();
  const newBooking = {
    id: 'STK-2026-' + Math.floor(1000 + Math.random() * 9000),
    bookedAt: new Date().toISOString().split('T')[0],
    status: 'Pending',
    ...bookingData
  };
  bookings.unshift(newBooking);
  localStorage.setItem(STACKLY_STORAGE_KEY, JSON.stringify(bookings));
  return newBooking;
}

// Update status
function updateBookingStatus(id, newStatus) {
  const bookings = getAllBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    bookings[index].status = newStatus;
    localStorage.setItem(STACKLY_STORAGE_KEY, JSON.stringify(bookings));
    return bookings[index];
  }
  return null;
}

// Delete booking
function removeBooking(id) {
  const bookings = getAllBookings();
  const filtered = bookings.filter(b => b.id !== id);
  localStorage.setItem(STACKLY_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

/* ===================================================================
   UNIVERSAL INTERACTIVE BOOKING NAVIGATION
   =================================================================== */
window.openBookingModal = function(title, dest, basePrice) {
  const modal = document.getElementById('universalBookingModal');
  if (modal) {
    if (title && document.getElementById('modalTourTitle')) {
      document.getElementById('modalTourTitle').textContent = title;
    }
    modal.classList.add('open');
    return false;
  }
  window.location.href = 'tour-details.html';
  return false;
};

window.closeBookingModal = function() {
  const modal = document.getElementById('universalBookingModal');
  if (modal) modal.classList.remove('open');
};

// Modal confirmation presentation
function showBookingConfirmationModal(booking) {
  let modal = document.getElementById('bookingConfirmModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'bookingConfirmModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content-box">
      <div class="modal-icon-success">
        <i class="fas fa-check-circle"></i>
      </div>
      <h3 style="font-size: 1.6rem; margin-bottom: 8px;">Reservation Confirmed!</h3>
      <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px;">
        Your reservation for <strong>${booking.tourTitle}</strong> has been successfully booked.
      </p>

      <div style="background: var(--bg-subtle-blue); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 18px; text-align: left; margin-bottom: 24px; font-size: 0.88rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
          <span style="color:var(--text-muted);">Booking Reference:</span>
          <strong style="color:var(--primary-blue); font-family:var(--font-heading);">${booking.id}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
          <span style="color:var(--text-muted);">Departure Date:</span>
          <strong>${booking.travelDate}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
          <span style="color:var(--text-muted);">Total Guests:</span>
          <strong>${booking.totalTravellers} (${booking.adults} Adults${booking.children > 0 ? ', ' + booking.children + ' Children' : ''})</strong>
        </div>
        <div style="display:flex; justify-content:space-between; border-top: 1px dashed var(--border-light); padding-top: 8px;">
          <span style="color:var(--text-muted);">Total Paid / Due:</span>
          <strong style="font-size: 1.1rem; color:var(--primary-blue);">$${booking.totalPrice.toLocaleString()}</strong>
        </div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <a href="dashboard-traveller.html" class="btn btn-primary btn-sm">
          <i class="fas fa-compass"></i> View in Traveller Dashboard
        </a>
        <a href="dashboard-operator.html" class="btn btn-outline btn-sm">
          <i class="fas fa-briefcase"></i> View in Operator Portal
        </a>
        <button onclick="document.getElementById('bookingConfirmModal').classList.remove('open')" class="btn btn-ghost btn-sm" style="width: 100%;">
          Close & Continue Exploring
        </button>
      </div>
    </div>
  `;

  setTimeout(() => modal.classList.add('open'), 50);
}

// Auto-run calculator on DOMContentLoaded if on tour details
document.addEventListener('DOMContentLoaded', () => {
  initializeBookingsStore();
});
