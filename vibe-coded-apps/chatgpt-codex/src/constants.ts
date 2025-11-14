export interface Ticket {
  id: string;
  customer: string;
  issue: string;
  status: 'open' | 'in-progress' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  createdAt: string;
  assignedTo?: string;
}

export const mockTickets: Ticket[] = [
  {
    id: 'TK-001',
    customer: 'Sarah Johnson',
    issue: 'Unable to login to account after password reset. Getting "invalid credentials" error repeatedly.',
    status: 'escalated',
    priority: 'critical',
    category: 'Authentication',
    createdAt: '2024-11-10T08:30:00Z',
    assignedTo: 'Tech Support Team'
  },
  {
    id: 'TK-002',
    customer: 'Michael Chen',
    issue: 'Payment processing failed multiple times. Transaction shows as pending but amount was deducted.',
    status: 'open',
    priority: 'high',
    category: 'Billing',
    createdAt: '2024-11-11T10:15:00Z'
  },
  {
    id: 'TK-003',
    customer: 'Emily Rodriguez',
    issue: 'Dashboard loading very slowly, sometimes takes 30+ seconds to display data.',
    status: 'in-progress',
    priority: 'medium',
    category: 'Performance',
    createdAt: '2024-11-11T14:20:00Z',
    assignedTo: 'Dev Team'
  },
  {
    id: 'TK-004',
    customer: 'David Kim',
    issue: 'Mobile app crashes when trying to upload profile picture. Happens consistently on iOS.',
    status: 'open',
    priority: 'high',
    category: 'Mobile App',
    createdAt: '2024-11-12T09:00:00Z'
  },
  {
    id: 'TK-005',
    customer: 'Lisa Anderson',
    issue: 'Export to PDF feature not working. Button clicks but nothing happens.',
    status: 'resolved',
    priority: 'medium',
    category: 'Features',
    createdAt: '2024-11-09T16:45:00Z',
    assignedTo: 'Frontend Team'
  },
  {
    id: 'TK-006',
    customer: 'James Wilson',
    issue: 'Notification emails not being received. Checked spam folder, nothing there.',
    status: 'in-progress',
    priority: 'medium',
    category: 'Email',
    createdAt: '2024-11-12T11:30:00Z',
    assignedTo: 'Infrastructure'
  },
  {
    id: 'TK-007',
    customer: 'Maria Garcia',
    issue: 'Cannot delete saved items from wishlist. Delete button appears but does nothing when clicked.',
    status: 'open',
    priority: 'low',
    category: 'Features',
    createdAt: '2024-11-13T13:15:00Z'
  },
  {
    id: 'TK-008',
    customer: 'Robert Taylor',
    issue: 'Account was charged twice for the same subscription. Need urgent refund for duplicate charge.',
    status: 'escalated',
    priority: 'critical',
    category: 'Billing',
    createdAt: '2024-11-13T15:00:00Z',
    assignedTo: 'Finance Team'
  },
  {
    id: 'TK-009',
    customer: 'Jennifer Lee',
    issue: 'Cannot access premium features despite active subscription. Shows "upgrade required" message.',
    status: 'open',
    priority: 'high',
    category: 'Subscription',
    createdAt: '2024-11-13T16:20:00Z'
  },
  {
    id: 'TK-010',
    customer: 'Thomas Brown',
    issue: 'Dark mode toggle not working properly. Interface keeps reverting to light mode.',
    status: 'resolved',
    priority: 'low',
    category: 'UI/UX',
    createdAt: '2024-11-08T10:00:00Z',
    assignedTo: 'Frontend Team'
  },
  {
    id: 'TK-011',
    customer: 'Amanda White',
    issue: 'Search functionality returns no results even for exact matches. Tried multiple search terms.',
    status: 'in-progress',
    priority: 'high',
    category: 'Search',
    createdAt: '2024-11-13T17:45:00Z',
    assignedTo: 'Backend Team'
  },
  {
    id: 'TK-012',
    customer: 'Christopher Moore',
    issue: 'API integration documentation is outdated. Following steps results in authentication errors.',
    status: 'open',
    priority: 'medium',
    category: 'Documentation',
    createdAt: '2024-11-14T08:00:00Z'
  }
];

export const TICKET_STATUS_COLORS = {
  'open': 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  'resolved': 'bg-green-100 text-green-800',
  'escalated': 'bg-red-100 text-red-800'
};

export const PRIORITY_COLORS = {
  'low': 'bg-gray-100 text-gray-800',
  'medium': 'bg-blue-100 text-blue-800',
  'high': 'bg-orange-100 text-orange-800',
  'critical': 'bg-red-100 text-red-800'
};
