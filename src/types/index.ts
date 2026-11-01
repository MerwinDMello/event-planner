export type UserRole = 'parent' | 'vendor';

export type Season = 'Autumn' | 'Winter' | 'Spring' | 'Summer' | 'Year-round';

export interface CelebrationTheme {
  id: string;
  name: string;
  tagline: string;
  season: Season;
  description: string;
  heroHeadline: string;
  heroSubtext: string;
  bannerImage: string;
  posterImage?: string;
  iconName: string;
  accentColor: string; // e.g. '#f97316' for orange, '#06b6d4' for cyan
  glowColor: string;
  funBadge: string;
  popularRank?: number;
  sampleChecklist: string[];
  suggestedActivities: string[];
}

export interface CelebrationEvent {
  id: string;
  title: string;
  themeId: string;
  themeName: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "7:00 PM"
  location: string;
  daysRemaining: number;
  guestsGoingCount: number;
  progressPercentage: number;
  budgetEstimated: number; // in INR ₹
  budgetSpent: number;
  isOwner: boolean;
  ownerName: string;
  bannerImage?: string;
  notes?: string;
  isPublicForVendors?: boolean;
}

export interface QuickActionItem {
  id: string;
  label: string;
  icon: string;
  colorBg: string;
  colorText: string;
  action: () => void;
}

export interface ActivityLogItem {
  id: string;
  iconType: 'vendor' | 'checklist' | 'budget' | 'guest' | 'event';
  title: string;
  timestamp: string;
  badgeColor: string;
}

export interface VendorItem {
  id: string;
  name: string;
  category: 'Decor & Styling' | 'Catering & Cake' | 'Entertainment & Magician' | 'Photography' | 'Games & Activities' | 'Venue';
  rating: number;
  reviewCount: number;
  location: string;
  startingPrice: number;
  themesSpecialty: string[];
  image: string;
  verified: boolean;
  contactEmail: string;
  contactPhone: string;
}

export interface BudgetItem {
  id: string;
  category: 'Decor' | 'Food & Drinks' | 'Cake & Treats' | 'Entertainment' | 'Gifts & Favors' | 'Venue';
  title: string;
  estimatedCost: number;
  actualCost: number;
  status: 'planned' | 'paid' | 'pending';
  paidTo?: string;
}

export interface GuestItem {
  id: string;
  name: string;
  type: 'kid' | 'parent';
  familyGroup: string;
  rsvpStatus: 'confirmed' | 'pending' | 'declined';
  dietaryNote?: string;
  hasGift: boolean;
}

export interface ToDoItem {
  id: string;
  title: string;
  dueDate: string;
  category: 'Checklist' | 'Vendors' | 'Invites' | 'Decor' | 'Day-of';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface VendorQuote {
  id: string;
  eventId: string;
  eventName: string;
  clientName: string;
  serviceOffered: string;
  quotedAmount: number;
  dateSubmitted: string;
  status: 'pending' | 'accepted' | 'declined';
  message: string;
  vendorId?: string;
  clientId?: string;
}
