/* ── Domain metrics (problem-context banner) ──────────────── */

const METRICS = {
  booking_rate_zero_review: { value: '2.3%',   modifier: 'danger', label: 'Booking rate, zero-review providers' },
  booking_rate_reviewed:    { value: '14%',    modifier: 'good',   label: 'Booking rate, reviewed providers' },
  median_days_first_booking:{ value: '19 days',modifier: 'warn',   label: 'Median days to a new provider\'s first booking' },
  exit_without_booking:     { value: '68%',    modifier: 'danger', label: 'Search → profile → exit without booking' }
};

const USER_QUOTES = [
  {
    text:   "I'm great at my job but I'll never get a review if no one books me first. It's a chicken-and-egg trap.",
    cite:   'New provider · 0 bookings'
  },
  {
    text:   'I wish I could see <em>something</em> — a verified ID, a portfolio, anything — before I commit money.',
    cite:   'Buyer · abandoned search'
  },
  {
    text:   "The established providers are booked out for weeks. I'd try someone new if I felt safe doing it.",
    cite:   'Repeat buyer'
  }
];
