import { CelebrationEvent, ActivityLogItem, VendorItem, BudgetItem, GuestItem, ToDoItem, VendorQuote } from '../types';

export const INITIAL_EVENTS: CelebrationEvent[] = [
  {
    id: 'evt-1',
    title: "Zenia's Halloween Party",
    themeId: 'halloween-party',
    themeName: 'Halloween Party',
    date: '2026-11-15',
    time: '7:00 PM',
    location: 'Our Residence, Mumbai',
    daysRemaining: 12,
    guestsGoingCount: 16,
    progressPercentage: 75,
    budgetEstimated: 35000,
    budgetSpent: 26250,
    isOwner: true,
    ownerName: 'Merwin',
    bannerImage: '/assets/aistudio/Halloween_d7e01516.png',
    notes: 'Kids costume runway at 8 PM followed by spooky mystery room games.',
    isPublicForVendors: true
  },
  {
    id: 'evt-2',
    title: "Aarav's Beach Party",
    themeId: 'beach-party',
    themeName: 'Beach Party',
    date: '2026-12-20',
    time: '4:00 PM',
    location: 'Sunset Beach Resort, Alibaug',
    daysRemaining: 18,
    guestsGoingCount: 12,
    progressPercentage: 60,
    budgetEstimated: 55000,
    budgetSpent: 33000,
    isOwner: true,
    ownerName: 'Merwin',
    bannerImage: '/assets/aistudio/Beach_Party_e48b471d.png',
    notes: 'Tiki bar mocktails, sandcastle trophies, and sunset bonfire s’mores.',
    isPublicForVendors: false
  },
  {
    id: 'evt-3',
    title: "Ananya's Cosmic Space Quest",
    themeId: 'space-party',
    themeName: 'Space / Planetarium Party',
    date: '2027-01-14',
    time: '5:30 PM',
    location: 'Nehru Center Dome, Worli',
    daysRemaining: 44,
    guestsGoingCount: 22,
    progressPercentage: 40,
    budgetEstimated: 45000,
    budgetSpent: 18000,
    isOwner: true,
    ownerName: 'Merwin',
    bannerImage: '/assets/aistudio/Celebration_Themes_041b2e2f.png',
    notes: 'Telescope viewing, neon blacklight glow maze, rocket launch.',
    isPublicForVendors: true
  }
];

export const INITIAL_ACTIVITIES: ActivityLogItem[] = [
  {
    id: 'act-1',
    iconType: 'vendor',
    title: "Vendor 'Spooky Decor Co.' confirmed",
    timestamp: '2h ago',
    badgeColor: '#10b981'
  },
  {
    id: 'act-2',
    iconType: 'checklist',
    title: 'Event checklist updated (5 new items)',
    timestamp: '3h ago',
    badgeColor: '#a855f7'
  },
  {
    id: 'act-3',
    iconType: 'budget',
    title: 'Budget estimate approved: ₹25,000',
    timestamp: '1d ago',
    badgeColor: '#f59e0b'
  },
  {
    id: 'act-4',
    iconType: 'guest',
    title: 'Rohan & Kabir RSVP confirmed',
    timestamp: '2d ago',
    badgeColor: '#06b6d4'
  }
];

export const INITIAL_VENDORS: VendorItem[] = [
  {
    id: 'ven-1',
    name: 'Spooky Decor Co.',
    category: 'Decor & Styling',
    rating: 4.9,
    reviewCount: 38,
    location: 'Bandra West, Mumbai',
    startingPrice: 12000,
    themesSpecialty: ['Halloween Party', 'Carnival / Circus Party', 'Space / Planetarium Party'],
    image: '/assets/aistudio/Halloween_d7e01516.png',
    verified: true,
    contactEmail: 'contact@spookydecor.in',
    contactPhone: '+91 98201 12345'
  },
  {
    id: 'ven-2',
    name: 'BeachWave Events & Setups',
    category: 'Decor & Styling',
    rating: 4.8,
    reviewCount: 52,
    location: 'Alibaug & South Mumbai',
    startingPrice: 18000,
    themesSpecialty: ['Beach Party', 'Picnic Party'],
    image: '/assets/aistudio/Beach_Party_e48b471d.png',
    verified: true,
    contactEmail: 'aloha@beachwaveevents.com',
    contactPhone: '+91 98192 98765'
  },
  {
    id: 'ven-3',
    name: 'Magic Master & Illusionists',
    category: 'Entertainment & Magician',
    rating: 5.0,
    reviewCount: 64,
    location: 'Andheri West, Mumbai',
    startingPrice: 9500,
    themesSpecialty: ['Birthday Party', 'Halloween Party', 'Carnival / Circus Party'],
    image: '/assets/aistudio/Celebration_Themes_041b2e2f.png',
    verified: true,
    contactEmail: 'magic@illusionkids.in',
    contactPhone: '+91 97654 32100'
  },
  {
    id: 'ven-4',
    name: 'Frost & Sparkle Artisan Cakes',
    category: 'Catering & Cake',
    rating: 4.9,
    reviewCount: 89,
    location: 'Juhu, Mumbai',
    startingPrice: 4500,
    themesSpecialty: ['Birthday Party', 'Christmas Party', 'Sleepover Movie Party', 'Space / Planetarium Party'],
    image: '/assets/aistudio/Celebration_Themes_041b2e2f.png',
    verified: true,
    contactEmail: 'cakes@frostandsparkle.com',
    contactPhone: '+91 99300 45678'
  },
  {
    id: 'ven-5',
    name: 'SuperStars Junior Sports Academy',
    category: 'Games & Activities',
    rating: 4.7,
    reviewCount: 29,
    location: 'Powai, Mumbai',
    startingPrice: 11000,
    themesSpecialty: ['Sports Party', 'Scavenger Hunt / Easter Egg Hunt Party'],
    image: '/assets/aistudio/Celebration_Themes_041b2e2f.png',
    verified: true,
    contactEmail: 'coach@superstarssports.in',
    contactPhone: '+91 98211 76543'
  },
  {
    id: 'ven-6',
    name: 'Royal Heritage Decorators',
    category: 'Decor & Styling',
    rating: 4.9,
    reviewCount: 44,
    location: 'Dadar, Mumbai',
    startingPrice: 22000,
    themesSpecialty: ['Diwali Party', 'Holi Party', 'Birthday Party'],
    image: '/assets/aistudio/Celebration_Themes_041b2e2f.png',
    verified: true,
    contactEmail: 'festive@royaldecor.com',
    contactPhone: '+91 98333 11223'
  }
];

export const INITIAL_BUDGET: BudgetItem[] = [
  {
    id: 'bgt-1',
    category: 'Decor',
    title: 'Themed Glow Backdrop & Lanterns',
    estimatedCost: 15000,
    actualCost: 14000,
    status: 'paid',
    paidTo: 'Spooky Decor Co.'
  },
  {
    id: 'bgt-2',
    category: 'Food & Drinks',
    title: 'Monster Punch Cauldron & Finger Foods',
    estimatedCost: 8000,
    actualCost: 7500,
    status: 'paid',
    paidTo: 'Chef Delight Caterers'
  },
  {
    id: 'bgt-3',
    category: 'Cake & Treats',
    title: '3-Tier Spooky Ghost & Pumpkin Fondant Cake',
    estimatedCost: 5500,
    actualCost: 4750,
    status: 'paid',
    paidTo: 'Frost & Sparkle Artisan Cakes'
  },
  {
    id: 'bgt-4',
    category: 'Entertainment',
    title: 'Interactive Mystery Magic Show (1.5 hrs)',
    estimatedCost: 9500,
    actualCost: 0,
    status: 'planned'
  },
  {
    id: 'bgt-5',
    category: 'Gifts & Favors',
    title: 'Custom Goodie Buckets with Glowsticks & Slime',
    estimatedCost: 4500,
    actualCost: 0,
    status: 'pending'
  }
];

export const INITIAL_GUESTS: GuestItem[] = [
  { id: 'gst-1', name: 'Zenia D’Mello', type: 'kid', familyGroup: 'Host Family', rsvpStatus: 'confirmed', dietaryNote: 'Host birthday girl', hasGift: false },
  { id: 'gst-2', name: 'Aarav Mehta', type: 'kid', familyGroup: 'Mehta Family', rsvpStatus: 'confirmed', dietaryNote: 'Nut allergy', hasGift: true },
  { id: 'gst-3', name: 'Tara Mehta', type: 'parent', familyGroup: 'Mehta Family', rsvpStatus: 'confirmed', hasGift: true },
  { id: 'gst-4', name: 'Rohan Sharma', type: 'kid', familyGroup: 'Sharma Family', rsvpStatus: 'confirmed', hasGift: true },
  { id: 'gst-5', name: 'Pooja Sharma', type: 'parent', familyGroup: 'Sharma Family', rsvpStatus: 'confirmed', hasGift: true },
  { id: 'gst-6', name: 'Kabir Verma', type: 'kid', familyGroup: 'Verma Family', rsvpStatus: 'confirmed', dietaryNote: 'Vegetarian', hasGift: false },
  { id: 'gst-7', name: 'Ananya Roy', type: 'kid', familyGroup: 'Roy Family', rsvpStatus: 'pending', hasGift: false },
  { id: 'gst-8', name: 'Dev Sen', type: 'kid', familyGroup: 'Sen Family', rsvpStatus: 'pending', hasGift: false },
  { id: 'gst-9', name: 'Kiara Kothari', type: 'kid', familyGroup: 'Kothari Family', rsvpStatus: 'declined', hasGift: false }
];

export const INITIAL_TODOS: ToDoItem[] = [
  { id: 'td-1', title: 'Confirm Spooky Decor lighting setup time', dueDate: '2026-11-12', category: 'Vendors', completed: true, priority: 'high' },
  { id: 'td-2', title: 'Finalize pumpkin patch carving stencil set', dueDate: '2026-11-13', category: 'Decor', completed: true, priority: 'medium' },
  { id: 'td-3', title: 'Pick up dry ice pellets for cauldron punch', dueDate: '2026-11-15', category: 'Day-of', completed: false, priority: 'high' },
  { id: 'td-4', title: 'Send costume dress code reminders via WhatsApp', dueDate: '2026-11-10', category: 'Invites', completed: true, priority: 'medium' },
  { id: 'td-5', title: 'Assemble 16 personalized trick-or-treat bags', dueDate: '2026-11-14', category: 'Checklist', completed: false, priority: 'high' },
  { id: 'td-6', title: 'Test sound system and spooky Halloween playlist', dueDate: '2026-11-14', category: 'Day-of', completed: false, priority: 'medium' }
];

export const INITIAL_QUOTES: VendorQuote[] = [
  {
    id: 'qt-1',
    eventId: 'evt-1',
    eventName: "Zenia's Halloween Party",
    clientName: 'Merwin D’Mello',
    serviceOffered: 'Deluxe Haunted Cobwebs & Fog Machine Package',
    quotedAmount: 14000,
    dateSubmitted: '2026-11-01',
    status: 'accepted',
    message: 'Includes 2 on-site technicians, 4 amber LED cauldrons, and certified non-toxic mist.'
  },
  {
    id: 'qt-2',
    eventId: 'evt-2',
    eventName: "Aarav's Beach Party",
    clientName: 'Merwin D’Mello',
    serviceOffered: 'Tiki Hut Photo-Op & Sand Volleyball Nets',
    quotedAmount: 18500,
    dateSubmitted: '2026-11-01',
    status: 'pending',
    message: 'Full day equipment delivery at Sunset Beach Resort with setup team.'
  },
  {
    id: 'qt-3',
    eventId: 'evt-3',
    eventName: "Ananya's Cosmic Space Quest",
    clientName: 'Merwin D’Mello',
    serviceOffered: 'Stargazer High-Powered Telescope Station',
    quotedAmount: 11000,
    dateSubmitted: '2026-11-02',
    status: 'pending',
    message: 'Astronomer host to demonstrate Saturn rings, lunar craters, and guided laser tour.'
  }
];
