export const navigationSections = [
  {
    id: 'home',
    type: 'item',
    label: 'Home',
    icon: 'home',
  },
  {
    id: 'talent-intelligence',
    type: 'group',
    label: 'Talent Intelligence',
    expanded: true,
    items: [
      { id: 'workforce-overview', label: 'Workforce Overview', icon: 'team-gear' },
      { id: 'people-analytics', label: 'People Analytics', icon: 'chart-bars' },
      { id: 'skills-intelligence', label: 'Skills Intelligence', icon: 'spark' },
      { id: 'talent-pipeline', label: 'Talent Pipeline', icon: 'refresh' },
    ],
  },
  {
    id: 'recruitment',
    type: 'group',
    label: 'Recruitment',
    expanded: true,
    items: [
      { id: 'jobs', label: 'Jobs', icon: 'briefcase', active: true },
      { id: 'candidates', label: 'Candidates', icon: 'users' },
      { id: 'interviews', label: 'Interviews', icon: 'calendar' },
      { id: 'offers', label: 'Offers', icon: 'target' },
      { id: 'referrals', label: 'Referrals', icon: 'hash' },
    ],
  },
  {
    id: 'people',
    type: 'group',
    label: 'People',
    expanded: true,
    items: [
      { id: 'employees', label: 'Employees', icon: 'user' },
      { id: 'performance', label: 'Performance', icon: 'trend-up' },
      { id: 'career-mobility', label: 'Career & Mobility', icon: 'building' },
      { id: 'engagement', label: 'Engagement', icon: 'smile' },
      { id: 'surveys', label: 'Surveys', icon: 'clipboard-check' },
    ],
  },
  {
    id: 'workforce-ops',
    type: 'group',
    label: 'Workforce Ops',
    expanded: true,
    items: [
      { id: 'payroll', label: 'Payroll', icon: 'wallet' },
      { id: 'attendance', label: 'Time & Attendance', icon: 'clock' },
    ],
  },
  {
    id: 'settings',
    type: 'item',
    label: 'Settings',
    icon: 'settings',
  },
]
