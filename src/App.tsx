/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  UserRole,
  CelebrationTheme,
  CelebrationEvent,
  BudgetItem,
  GuestItem,
  ToDoItem,
  VendorQuote,
  ActivityLogItem,
  VendorItem
} from './types';
import { CELEBRATION_THEMES } from './data/celebrationThemes';
import {
  INITIAL_EVENTS,
  INITIAL_ACTIVITIES,
  INITIAL_VENDORS,
  INITIAL_BUDGET,
  INITIAL_GUESTS,
  INITIAL_TODOS,
  INITIAL_QUOTES
} from './data/mockData';

import { AuthProvider, useAuth } from './firebase/AuthContext';
import {
  subscribeUserEvents,
  saveEventToFirestore,
  deleteEventFromFirestore,
  subscribeBudgetItems,
  saveBudgetItemToFirestore,
  deleteBudgetItemFromFirestore,
  subscribeGuests,
  saveGuestToFirestore,
  deleteGuestFromFirestore,
  subscribeTodos,
  saveTodoToFirestore,
  deleteTodoFromFirestore,
  saveQuoteToFirestore
} from './firebase/firestoreService';

import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { HeroBanner } from './components/HeroBanner';
import { UpcomingEventsSection } from './components/UpcomingEventsSection';
import { QuickActionsSection } from './components/QuickActionsSection';
import { PopularThemesSection } from './components/PopularThemesSection';
import { RecentActivitySection } from './components/RecentActivitySection';

import { ThemesExplorerModal } from './components/ThemesExplorerModal';
import { CreateEventModal } from './components/CreateEventModal';
import { MyEventsView } from './components/MyEventsView';
import { VendorsView } from './components/VendorsView';
import { BudgetView } from './components/BudgetView';
import { GuestListView } from './components/GuestListView';
import { ToDoView } from './components/ToDoView';
import { SettingsView } from './components/SettingsView';
import { NotificationsModal } from './components/NotificationsModal';
import { VendorQuoteModal } from './components/VendorQuoteModal';
import { GoogleMapsExplorerView } from './components/GoogleMapsExplorerView';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AccessibilityModal } from './components/AccessibilityModal';
import { TestingSuiteView } from './components/TestingSuiteView';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import { ParentLockModal } from './components/ParentLockModal';
import { SecurityCenterView } from './components/SecurityCenterView';

function PlannerContent() {
  const { user, userProfile } = useAuth();
  const { openPinModalForAction } = useSecurity();

  // Navigation & Role State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole>('parent');
  const [searchQuery, setSearchQuery] = useState('');

  // Active theme (defaults to Halloween Party as in Screenshot 1, or can toggle to Beach Party as in Screenshot 2)
  const [currentThemeId, setCurrentThemeId] = useState<string>('halloween-party');

  // Core Data States
  const [events, setEvents] = useState<CelebrationEvent[]>(() => {
    const saved = localStorage.getItem('celebration_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [activities, setActivities] = useState<ActivityLogItem[]>(() => {
    const saved = localStorage.getItem('celebration_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [vendors] = useState<VendorItem[]>(INITIAL_VENDORS);

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => {
    const saved = localStorage.getItem('celebration_budget');
    return saved ? JSON.parse(saved) : INITIAL_BUDGET;
  });

  const [guests, setGuests] = useState<GuestItem[]>(() => {
    const saved = localStorage.getItem('celebration_guests');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [todos, setTodos] = useState<ToDoItem[]>(() => {
    const saved = localStorage.getItem('celebration_todos');
    return saved ? JSON.parse(saved) : INITIAL_TODOS;
  });

  const [quotes, setQuotes] = useState<VendorQuote[]>(() => {
    const saved = localStorage.getItem('celebration_quotes');
    return saved ? JSON.parse(saved) : INITIAL_QUOTES;
  });

  // Sync role if set in user profile
  useEffect(() => {
    if (userProfile?.role) {
      setUserRole(userProfile.role);
    }
  }, [userProfile]);

  // Real-time Firestore sync when user is authenticated
  useEffect(() => {
    if (!user) return;

    const unsubEvents = subscribeUserEvents(user.uid, (remoteEvents) => {
      if (remoteEvents.length > 0) {
        setEvents(remoteEvents);
      }
    });

    const unsubBudget = subscribeBudgetItems(user.uid, (remoteBudget) => {
      if (remoteBudget.length > 0) {
        setBudgetItems(remoteBudget);
      }
    });

    const unsubGuests = subscribeGuests(user.uid, (remoteGuests) => {
      if (remoteGuests.length > 0) {
        setGuests(remoteGuests);
      }
    });

    const unsubTodos = subscribeTodos(user.uid, (remoteTodos) => {
      if (remoteTodos.length > 0) {
        setTodos(remoteTodos);
      }
    });

    return () => {
      unsubEvents();
      unsubBudget();
      unsubGuests();
      unsubTodos();
    };
  }, [user]);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 'nt-1', title: "Vendor 'Spooky Decor Co.' confirmed your setup", time: '2h ago', read: false, type: 'vendor' as const },
    { id: 'nt-2', title: '5 RSVP updates received for Zenia’s Party', time: '5h ago', read: false, type: 'rsvp' as const },
    { id: 'nt-3', title: 'Google Maps: Verified local party decorators found nearby', time: '1d ago', read: false, type: 'season' as const }
  ]);

  // Modals visibility
  const [isThemesExplorerOpen, setIsThemesExplorerOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [selectedVendorForQuote, setSelectedVendorForQuote] = useState<VendorItem | null>(null);
  const [isVendorQuoteSubmission, setIsVendorQuoteSubmission] = useState(false);

  // Selected event for detail views
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || 'evt-1');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('celebration_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('celebration_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('celebration_budget', JSON.stringify(budgetItems));
  }, [budgetItems]);

  useEffect(() => {
    localStorage.setItem('celebration_guests', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('celebration_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('celebration_quotes', JSON.stringify(quotes));
  }, [quotes]);

  // Active theme object
  const currentTheme = useMemo(() => {
    return CELEBRATION_THEMES.find((t) => t.id === currentThemeId) || CELEBRATION_THEMES[0];
  }, [currentThemeId]);

  // Active event object
  const activeEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0];
  }, [events, selectedEventId]);

  // Popular Themes: Show Top 4 popular themes based on current theme season
  const popularThemes = useMemo(() => {
    const seasonThemes = CELEBRATION_THEMES.filter(
      (t) => t.season === currentTheme.season || t.season === 'Year-round'
    );
    const combined = [...seasonThemes];
    CELEBRATION_THEMES.forEach((t) => {
      if (!combined.some((item) => item.id === t.id)) {
        combined.push(t);
      }
    });

    const index = combined.findIndex((t) => t.id === currentTheme.id);
    if (index > 3 && index !== -1) {
      const [item] = combined.splice(index, 1);
      combined.unshift(item);
    }

    return combined.slice(0, 4);
  }, [currentTheme]);

  // Handlers for Event creation
  const handleSaveEvent = async (newEvent: CelebrationEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    setSelectedEventId(newEvent.id);
    setCurrentThemeId(newEvent.themeId);

    if (user) {
      await saveEventToFirestore(newEvent, user.uid);
    }

    const newAct: ActivityLogItem = {
      id: `act-${Date.now()}`,
      iconType: 'event',
      title: `Created celebration '${newEvent.title}'`,
      timestamp: 'Just now',
      badgeColor: '#38bdf8'
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleDeleteEvent = async (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (user) {
      await deleteEventFromFirestore(id);
    }
  };

  const handleSelectEvent = (event: CelebrationEvent) => {
    setSelectedEventId(event.id);
    setCurrentThemeId(event.themeId);
  };

  // Handlers for Budget
  const handleAddBudgetItem = async (item: BudgetItem) => {
    setBudgetItems((prev) => [item, ...prev]);
    if (user) {
      await saveBudgetItemToFirestore(item, user.uid);
    }
    const newAct: ActivityLogItem = {
      id: `act-${Date.now()}`,
      iconType: 'budget',
      title: `Logged expense: ${item.title} (₹${item.actualCost || item.estimatedCost})`,
      timestamp: 'Just now',
      badgeColor: '#f59e0b'
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleDeleteBudgetItem = async (id: string) => {
    setBudgetItems((prev) => prev.filter((b) => b.id !== id));
    if (user) {
      await deleteBudgetItemFromFirestore(id);
    }
  };

  const handleToggleBudgetStatus = async (id: string) => {
    const updated = budgetItems.map((b) => {
      if (b.id !== id) return b;
      const nextStatus: BudgetItem['status'] =
        b.status === 'planned' ? 'pending' : b.status === 'pending' ? 'paid' : 'planned';
      return { ...b, status: nextStatus };
    });
    setBudgetItems(updated);

    const changed = updated.find((b) => b.id === id);
    if (changed && user) {
      await saveBudgetItemToFirestore(changed, user.uid);
    }
  };

  // Handlers for Guests
  const handleAddGuest = async (guest: GuestItem) => {
    setGuests((prev) => [guest, ...prev]);
    if (user) {
      await saveGuestToFirestore(guest, user.uid);
    }
    if (guest.rsvpStatus === 'confirmed') {
      setEvents((prev) =>
        prev.map((e) => (e.id === activeEvent?.id ? { ...e, guestsGoingCount: e.guestsGoingCount + 1 } : e))
      );
    }
    const newAct: ActivityLogItem = {
      id: `act-${Date.now()}`,
      iconType: 'guest',
      title: `Guest '${guest.name}' added to list`,
      timestamp: 'Just now',
      badgeColor: '#06b6d4'
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleToggleGuestRsvp = async (id: string) => {
    const updated = guests.map((g) => {
      if (g.id !== id) return g;
      const nextRsvp: GuestItem['rsvpStatus'] =
        g.rsvpStatus === 'confirmed' ? 'declined' : g.rsvpStatus === 'declined' ? 'pending' : 'confirmed';
      return { ...g, rsvpStatus: nextRsvp };
    });
    setGuests(updated);

    const changed = updated.find((g) => g.id === id);
    if (changed && user) {
      await saveGuestToFirestore(changed, user.uid);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
    if (user) {
      await deleteGuestFromFirestore(id);
    }
  };

  // Handlers for To-Dos
  const handleToggleTodo = async (id: string) => {
    const updated = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    const done = updated.filter((t) => t.completed).length;
    const progress = updated.length > 0 ? Math.round((done / updated.length) * 100) : 0;

    setTodos(updated);

    if (activeEvent) {
      const updatedEvent = { ...activeEvent, progressPercentage: progress };
      setEvents((eList) => eList.map((e) => (e.id === activeEvent.id ? updatedEvent : e)));
      if (user) {
        await saveEventToFirestore(updatedEvent, user.uid);
      }
    }

    const changed = updated.find((t) => t.id === id);
    if (changed && user) {
      await saveTodoToFirestore(changed, user.uid);
    }

    const newAct: ActivityLogItem = {
      id: `act-${Date.now()}`,
      iconType: 'checklist',
      title: 'Event checklist item updated',
      timestamp: 'Just now',
      badgeColor: '#a855f7'
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleAddTodo = async (todo: ToDoItem) => {
    setTodos((prev) => [todo, ...prev]);
    if (user) {
      await saveTodoToFirestore(todo, user.uid);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (user) {
      await deleteTodoFromFirestore(id);
    }
  };

  // Handlers for Quotes
  const handleRequestQuote = (vendor: VendorItem) => {
    setSelectedVendorForQuote(vendor);
    setIsVendorQuoteSubmission(false);
    setIsQuoteModalOpen(true);
  };

  const handleSubmitQuoteModal = () => {
    setSelectedVendorForQuote(null);
    setIsVendorQuoteSubmission(true);
    setIsQuoteModalOpen(true);
  };

  const handleSaveQuote = async (quote: VendorQuote) => {
    setQuotes((prev) => [quote, ...prev]);
    if (user) {
      await saveQuoteToFirestore(quote, user.uid);
    }
    const newAct: ActivityLogItem = {
      id: `act-${Date.now()}`,
      iconType: 'vendor',
      title: `Quotation submitted: ₹${quote.quotedAmount.toLocaleString('en-IN')}`,
      timestamp: 'Just now',
      badgeColor: '#10b981'
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleUpdateQuoteStatus = (quoteId: string, status: 'accepted' | 'declined') => {
    setQuotes((prev) => prev.map((q) => (q.id === quoteId ? { ...q, status } : q)));
  };

  // Reset to sample defaults (guarded by Parent PIN lock)
  const handleResetData = () => {
    openPinModalForAction(() => {
      setEvents(INITIAL_EVENTS);
      setActivities(INITIAL_ACTIVITIES);
      setBudgetItems(INITIAL_BUDGET);
      setGuests(INITIAL_GUESTS);
      setTodos(INITIAL_TODOS);
      setQuotes(INITIAL_QUOTES);
      setCurrentThemeId('halloween-party');
      setSelectedEventId('evt-1');
    }, 'Reset to Defaults');
  };

  // Global search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const matchedEvents = events.filter(
      (e) => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
    );
    const matchedThemes = CELEBRATION_THEMES.filter(
      (t) => t.name.toLowerCase().includes(q) || t.tagline.toLowerCase().includes(q)
    );
    const matchedVendors = vendors.filter(
      (v) => v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q)
    );
    return { matchedEvents, matchedThemes, matchedVendors };
  }, [searchQuery, events, vendors]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0c16] text-slate-100 antialiased font-sans">
      {/* Skip to Main Content Link (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        currentTheme={currentTheme}
        onOpenThemesExplorer={() => setIsThemesExplorerOpen(true)}
        onOpenCreateEvent={() => setIsCreateEventOpen(true)}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <TopBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          userRole={userRole}
          setUserRole={setUserRole}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadNotificationsCount={unreadCount}
          currentTheme={currentTheme}
          onSelectTheme={(id) => setCurrentThemeId(id)}
          allThemes={CELEBRATION_THEMES}
          onOpenAccessibility={() => setIsAccessibilityOpen(true)}
          onOpenSecurity={() => setCurrentTab('security')}
        />

        {/* Scrollable Main Area */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 focus:outline-none"
        >
          {/* Active Search Results */}
          {searchResults && (
            <div className="rounded-2xl border border-purple-500/50 bg-[#13142c] p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#222448] pb-3">
                <h3 className="font-bold text-sm text-white">
                  Search Results for "{searchQuery}"
                </h3>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                >
                  Clear Search
                </button>
              </div>

              {searchResults.matchedThemes.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                    Themes ({searchResults.matchedThemes.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {searchResults.matchedThemes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setCurrentThemeId(t.id);
                          setSearchQuery('');
                        }}
                        className="p-2.5 rounded-xl bg-[#1a1b38] border border-[#2b2d52] hover:border-purple-400 text-left text-xs text-white cursor-pointer"
                      >
                        <span className="font-bold block truncate">{t.name}</span>
                        <span className="text-[11px] text-slate-400 block truncate">{t.tagline}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.matchedEvents.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                    Events ({searchResults.matchedEvents.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {searchResults.matchedEvents.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => {
                          handleSelectEvent(e);
                          setSearchQuery('');
                        }}
                        className="p-2.5 rounded-xl bg-[#1a1b38] border border-[#2b2d52] hover:border-purple-400 text-left text-xs text-white cursor-pointer"
                      >
                        <span className="font-bold block">{e.title}</span>
                        <span className="text-[11px] text-slate-400 block">{e.location}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.matchedVendors.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                    Vendors ({searchResults.matchedVendors.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {searchResults.matchedVendors.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setCurrentTab('vendors');
                          setSearchQuery('');
                        }}
                        className="p-2.5 rounded-xl bg-[#1a1b38] border border-[#2b2d52] hover:border-purple-400 text-left text-xs text-white cursor-pointer"
                      >
                        <span className="font-bold block">{v.name}</span>
                        <span className="text-[11px] text-slate-400 block">{v.category} • {v.location}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Home View */}
          {currentTab === 'home' && (
            <>
              {/* Top: Dynamic Hero Banner */}
              <HeroBanner
                currentTheme={currentTheme}
                userRole={userRole}
                onPlanEvent={() => setIsCreateEventOpen(true)}
                onExploreTheme={() => setIsThemesExplorerOpen(true)}
                onExploreMaps={() => setCurrentTab('maps')}
              />

              {/* Middle Section: Upcoming Events (Left) & Quick Actions (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-7 flex flex-col">
                  <UpcomingEventsSection
                    events={events}
                    userRole={userRole}
                    onViewAll={() => setCurrentTab('events')}
                    onSelectEvent={handleSelectEvent}
                  />
                </div>

                <div className="lg:col-span-5 flex flex-col">
                  <QuickActionsSection
                    userRole={userRole}
                    onCreateEvent={() => setIsCreateEventOpen(true)}
                    onExploreThemes={() => setIsThemesExplorerOpen(true)}
                    onManageGuests={() => setCurrentTab('guests')}
                    onTrackBudget={() => setCurrentTab('budget')}
                    onSubmitQuote={handleSubmitQuoteModal}
                    onPricingOptions={() => setCurrentTab('vendors')}
                    onCreatePublicEvent={() => setIsCreateEventOpen(true)}
                  />
                </div>
              </div>

              {/* Bottom Section: Popular Themes (Left) & Recent Activity (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-7 flex flex-col">
                  <PopularThemesSection
                    currentTheme={currentTheme}
                    onSelectTheme={(theme) => setCurrentThemeId(theme.id)}
                    onViewAll={() => setIsThemesExplorerOpen(true)}
                    popularThemes={popularThemes}
                  />
                </div>

                <div className="lg:col-span-5 flex flex-col">
                  <RecentActivitySection
                    activities={activities}
                    onViewAll={() => setCurrentTab('events')}
                  />
                </div>
              </div>
            </>
          )}

          {/* Google Maps Grounding Explorer */}
          {currentTab === 'maps' && (
            <GoogleMapsExplorerView
              currentTheme={currentTheme}
              onSelectVenueForEvent={(venueName) => {
                if (activeEvent) {
                  const updated = { ...activeEvent, location: venueName };
                  setEvents((prev) => prev.map((e) => (e.id === activeEvent.id ? updated : e)));
                  if (user) {
                    saveEventToFirestore(updated, user.uid);
                  }
                }
              }}
            />
          )}

          {/* Events View */}
          {currentTab === 'events' && (
            <MyEventsView
              events={events}
              userRole={userRole}
              onOpenCreateEvent={() => setIsCreateEventOpen(true)}
              onSelectEvent={handleSelectEvent}
              onDeleteEvent={handleDeleteEvent}
              onSelectThemeById={(id) => setCurrentThemeId(id)}
              themes={CELEBRATION_THEMES}
            />
          )}

          {/* Themes View */}
          {currentTab === 'themes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#14152a] border border-[#242646] flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Signature Kids Celebration Themes</h2>
                  <p className="text-xs text-slate-400">
                    Browse all 12 signature themes with customized itineraries and decorations.
                  </p>
                </div>
                <button
                  onClick={() => setIsThemesExplorerOpen(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Open Full Gallery
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {CELEBRATION_THEMES.map((theme) => {
                  const isSelected = currentTheme.id === theme.id;
                  const isHalloween = theme.id === 'halloween-party';
                  const isBeach = theme.id === 'beach-party';

                  return (
                    <div
                      key={theme.id}
                      onClick={() => setCurrentThemeId(theme.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#1c1d3d] border-purple-500 ring-2 ring-purple-500/50'
                          : 'bg-[#14152a] border-[#252749] hover:border-purple-400/40 hover:bg-[#1a1b38]'
                      }`}
                    >
                      <div>
                        <div className="h-32 rounded-xl overflow-hidden relative mb-2.5 bg-[#0e0f22]">
                          {isHalloween ? (
                            <img
                              src="/assets/aistudio/Halloween_d7e01516.png"
                              alt={theme.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : isBeach ? (
                            <img
                              src="/assets/aistudio/Beach_Party_e48b471d.png"
                              alt={theme.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="relative w-full h-full">
                              <img
                                src="/assets/aistudio/Celebration_Themes_041b2e2f.png"
                                alt={theme.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <div
                                className="absolute inset-0 mix-blend-color opacity-30"
                                style={{ backgroundColor: theme.accentColor }}
                              />
                            </div>
                          )}
                          <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-amber-300">
                            {theme.season}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-sm text-white">{theme.name}</h3>
                        <p className="text-xs text-amber-300 font-medium">{theme.tagline}</p>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {theme.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#222448] flex items-center justify-between">
                        <span className="text-[10px] text-purple-300 font-semibold">{theme.funBadge}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentThemeId(theme.id);
                            setIsCreateEventOpen(true);
                          }}
                          className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-[11px] cursor-pointer"
                        >
                          Plan Event
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Vendors View */}
          {currentTab === 'vendors' && (
            <VendorsView
              vendors={vendors}
              quotes={quotes}
              userRole={userRole}
              onRequestQuote={handleRequestQuote}
              onSubmitQuoteModal={handleSubmitQuoteModal}
              onUpdateQuoteStatus={handleUpdateQuoteStatus}
            />
          )}

          {/* Budget View */}
          {currentTab === 'budget' && (
            <BudgetView
              budgetItems={budgetItems}
              activeEvent={activeEvent}
              onAddBudgetItem={handleAddBudgetItem}
              onDeleteBudgetItem={handleDeleteBudgetItem}
              onToggleStatus={handleToggleBudgetStatus}
            />
          )}

          {/* Guests View */}
          {currentTab === 'guests' && (
            <GuestListView
              guests={guests}
              activeEvent={activeEvent}
              onAddGuest={handleAddGuest}
              onToggleRsvp={handleToggleGuestRsvp}
              onDeleteGuest={handleDeleteGuest}
            />
          )}

          {/* To-Do View */}
          {currentTab === 'todo' && (
            <ToDoView
              todos={todos}
              activeEvent={activeEvent}
              onToggleTodo={handleToggleTodo}
              onAddTodo={handleAddTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          )}

          {/* Security Center View */}
          {currentTab === 'security' && <SecurityCenterView />}

          {/* Testing Suite View */}
          {currentTab === 'testing' && <TestingSuiteView />}

          {/* Settings View */}
          {currentTab === 'settings' && (
            <SettingsView
              userRole={userRole}
              setUserRole={setUserRole}
              onResetData={handleResetData}
              onOpenAccessibility={() => setIsAccessibilityOpen(true)}
              onOpenTesting={() => setCurrentTab('testing')}
              onOpenSecurity={() => setCurrentTab('security')}
            />
          )}
        </main>
      </div>

      {/* 3. Modals & Overlays */}
      <ThemesExplorerModal
        isOpen={isThemesExplorerOpen}
        onClose={() => setIsThemesExplorerOpen(false)}
        themes={CELEBRATION_THEMES}
        currentTheme={currentTheme}
        onSelectTheme={(t) => setCurrentThemeId(t.id)}
        onPlanThisEvent={(t) => {
          setCurrentThemeId(t.id);
          setIsCreateEventOpen(true);
        }}
      />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        themes={CELEBRATION_THEMES}
        defaultTheme={currentTheme}
        onSaveEvent={handleSaveEvent}
        userRole={userRole}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onDismiss={(id) => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }}
      />

      <VendorQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        vendor={selectedVendorForQuote}
        events={events}
        activeEvent={activeEvent}
        isVendorSubmission={isVendorQuoteSubmission}
        onSubmitQuote={handleSaveQuote}
      />

      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
      />

      <ParentLockModal />
    </div>
  );
}

export default function App() {
  return (
    <SecurityProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <PlannerContent />
        </AuthProvider>
      </AccessibilityProvider>
    </SecurityProvider>
  );
}
