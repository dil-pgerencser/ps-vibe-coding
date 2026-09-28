/* ── Freelancer provider definitions ──────────────────────── */

const PROVIDERS = [
  {
    id:             'marcus-reid',
    name:           'Marcus Reid',
    title:          'UX Designer',
    location:       'San Francisco',
    rate:           '$75',
    avatarGradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    avatarInitials: 'MR',
    reviews:        0,
    skills:         ['UX Designer · San Francisco'],
    trustPills:     [
      { label: '✓ ID Verified',          cls: 'pill-green', trustVisible: true },
      { label: '✓ Portfolio Confirmed',   cls: 'pill-green', trustVisible: true },
      { label: '✓ Skills Tested',         cls: 'pill-green', trustVisible: true }
    ],
    risingTalent:   true,
    isBaseline:     false,
    available:      true
  },
  {
    id:             'priya-sharma',
    name:           'Priya Sharma',
    title:          'Content Strategist',
    location:       'New York',
    rate:           '$60',
    avatarGradient: 'linear-gradient(135deg,#ec4899,#f43f5e)',
    avatarInitials: 'PS',
    reviews:        0,
    trustPills:     [
      { label: '✓ ID Verified',          cls: 'pill-green', trustVisible: true },
      { label: '✓ Portfolio Confirmed',   cls: 'pill-green', trustVisible: true },
      { label: 'Skills test: Pending',    cls: '',           trustVisible: true }
    ],
    risingTalent:   true,
    isBaseline:     false,
    available:      true
  },
  {
    id:             'james-okafor',
    name:           'James Okafor',
    title:          'Full-Stack Developer',
    location:       'Austin',
    rate:           '$85',
    avatarGradient: 'linear-gradient(135deg,#0ea5e9,#06b6d4)',
    avatarInitials: 'JO',
    reviews:        0,
    trustPills:     [
      { label: '✓ ID Verified',          cls: 'pill-green', trustVisible: true },
      { label: '✓ Portfolio Confirmed',   cls: 'pill-green', trustVisible: true },
      { label: '✓ Skills Tested',         cls: 'pill-green', trustVisible: true }
    ],
    risingTalent:   true,
    isBaseline:     false,
    available:      true
  },
  {
    id:             'sarah-chen',
    name:           'Sarah Chen',
    title:          'Brand Designer',
    location:       'Seattle',
    rate:           '$95',
    avatarGradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    avatarInitials: 'SC',
    reviews:        18,
    rating:         '4.9',
    trustPills:     [
      { label: '✓ 18 verified reviews',  cls: 'pill-green', trustVisible: false },
      { label: 'Next available: 3 weeks', cls: '',           trustVisible: false }
    ],
    risingTalent:   false,
    isBaseline:     true,
    available:      false
  }
];
