/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  CelebrationTheme,
  CelebrationEvent,
  BudgetItem,
  GuestItem,
  ToDoItem,
  VendorQuote,
  ActivityLogItem,
  VendorItem
} from '../types';
import { CELEBRATION_THEMES } from '../data/celebrationThemes';
import {
  INITIAL_EVENTS,
  INITIAL_ACTIVITIES,
  INITIAL_VENDORS,
  INITIAL_BUDGET,
  INITIAL_GUESTS,
  INITIAL_TODOS,
  INITIAL_QUOTES
} from '../data/mockData';
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
} from '../firebase/firestoreService';
import { formatCurrencyINR } from '../utils/formatters';

const STORAGE_KEYS = {
  EVENTS: 'celebration_events',
  ACTIVITIES: 'celebration_activities',
  BUDGET: 'celebration_budget',
  GUESTS: 'celebration_guests',
  TODOS: 'celebration_todos',
  QUOTES: 'celebration_quotes'
} as const;

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type: 'vendor' | 'rsvp' | 'season';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'nt-1', title: "Vendor 'Spooky Decor Co.' confirmed your setup", time: '2h ago', read: false, type: 'vendor' },
  { id: 'nt-2', title: '5 RSVP updates received for Zenia’s Party', time: '5h ago', read: false, type: 'rsvp' },
  { id: 'nt-3', title: 'Google Maps: Verified local party decorators found nearby', time: '1d ago', read: false, type: 'season' }
];

export function usePlannerState(
  user: User | null,
  openPinModalForAction: (action: () => void, description: string) => void
) {
  // Theme & Event Selection
  const [currentThemeId, setCurrentThemeId] = useState<string>('halloween-party');

  // Core Data States with localStorage initializers
  const [events, setEvents] = useState<CelebrationEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [activities, setActivities] = useState<ActivityLogItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [vendors] = useState<VendorItem[]>(INITIAL_VENDORS);

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGET);
      return saved ? JSON.parse(saved) : INITIAL_BUDGET;
    } catch {
      return INITIAL_BUDGET;
    }
  });

  const [guests, setGuests] = useState<GuestItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GUESTS);
      return saved ? JSON.parse(saved) : INITIAL_GUESTS;
    } catch {
      return INITIAL_GUESTS;
    }
  });

  const [todos, setTodos] = useState<ToDoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TODOS);
      return saved ? JSON.parse(saved) : INITIAL_TODOS;
    } catch {
      return INITIAL_TODOS;
    }
  });

  const [quotes, setQuotes] = useState<VendorQuote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUOTES);
      return saved ? JSON.parse(saved) : INITIAL_QUOTES;
    } catch {
      return INITIAL_QUOTES;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Selected event ID
  const [selectedEventId, setSelectedEventId] = useState<string>(() => events[0]?.id || 'evt-1');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budgetItems));
  }, [budgetItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
  }, [quotes]);

  // Firestore Real-Time Subscriptions
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

  // Derived current theme
  const currentTheme: CelebrationTheme = useMemo(() => {
    return CELEBRATION_THEMES.find((t) => t.id === currentThemeId) || CELEBRATION_THEMES[0];
  }, [currentThemeId]);

  // Derived active event
  const activeEvent: CelebrationEvent | undefined = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0];
  }, [events, selectedEventId]);

  // Derived popular themes
  const popularThemes: CelebrationTheme[] = useMemo(() => {
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

  // Log activity helper
  const logActivity = useCallback((iconType: ActivityLogItem['iconType'], title: string, badgeColor: string) => {
    const newAct: ActivityLogItem = {
      id: `act-${Date.now()}`,
      iconType,
      title,
      timestamp: 'Just now',
      badgeColor
    };
    setActivities((prev) => [newAct, ...prev]);
  }, []);

  // Event Handlers
  const handleSaveEvent = useCallback(
    async (newEvent: CelebrationEvent) => {
      setEvents((prev) => [newEvent, ...prev]);
      setSelectedEventId(newEvent.id);
      setCurrentThemeId(newEvent.themeId);

      if (user) {
        await saveEventToFirestore(newEvent, user.uid);
      }

      logActivity('event', `Created celebration '${newEvent.title}'`, '#38bdf8');
    },
    [user, logActivity]
  );

  const handleDeleteEvent = useCallback(
    async (id: string) => {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      if (user) {
        await deleteEventFromFirestore(id);
      }
    },
    [user]
  );

  const handleSelectEvent = useCallback((event: CelebrationEvent) => {
    setSelectedEventId(event.id);
    setCurrentThemeId(event.themeId);
  }, []);

  const updateEventLocation = useCallback(
    async (venueName: string) => {
      if (!activeEvent) return;
      const updated = { ...activeEvent, location: venueName };
      setEvents((prev) => prev.map((e) => (e.id === activeEvent.id ? updated : e)));
      if (user) {
        await saveEventToFirestore(updated, user.uid);
      }
      logActivity('event', `Venue selected: ${venueName}`, '#10b981');
    },
    [activeEvent, user, logActivity]
  );

  // Budget Handlers
  const handleAddBudgetItem = useCallback(
    async (item: BudgetItem) => {
      setBudgetItems((prev) => [item, ...prev]);
      if (user) {
        await saveBudgetItemToFirestore(item, user.uid);
      }
      const costDisplay = formatCurrencyINR(item.actualCost || item.estimatedCost);
      logActivity('budget', `Logged expense: ${item.title} (${costDisplay})`, '#f59e0b');
    },
    [user, logActivity]
  );

  const handleDeleteBudgetItem = useCallback(
    async (id: string) => {
      setBudgetItems((prev) => prev.filter((b) => b.id !== id));
      if (user) {
        await deleteBudgetItemFromFirestore(id);
      }
    },
    [user]
  );

  const handleToggleBudgetStatus = useCallback(
    async (id: string) => {
      setBudgetItems((prev) => {
        const updated = prev.map((b) => {
          if (b.id !== id) return b;
          const nextStatus: BudgetItem['status'] =
            b.status === 'planned' ? 'pending' : b.status === 'pending' ? 'paid' : 'planned';
          return { ...b, status: nextStatus };
        });
        const changed = updated.find((b) => b.id === id);
        if (changed && user) {
          saveBudgetItemToFirestore(changed, user.uid);
        }
        return updated;
      });
    },
    [user]
  );

  // Guest Handlers
  const handleAddGuest = useCallback(
    async (guest: GuestItem) => {
      setGuests((prev) => [guest, ...prev]);
      if (user) {
        await saveGuestToFirestore(guest, user.uid);
      }
      if (guest.rsvpStatus === 'confirmed') {
        setEvents((prev) =>
          prev.map((e) => (e.id === activeEvent?.id ? { ...e, guestsGoingCount: e.guestsGoingCount + 1 } : e))
        );
      }
      logActivity('guest', `Guest '${guest.name}' added to list`, '#06b6d4');
    },
    [user, activeEvent?.id, logActivity]
  );

  const handleToggleGuestRsvp = useCallback(
    async (id: string) => {
      setGuests((prev) => {
        const updated = prev.map((g) => {
          if (g.id !== id) return g;
          const nextRsvp: GuestItem['rsvpStatus'] =
            g.rsvpStatus === 'confirmed' ? 'declined' : g.rsvpStatus === 'declined' ? 'pending' : 'confirmed';
          return { ...g, rsvpStatus: nextRsvp };
        });
        const changed = updated.find((g) => g.id === id);
        if (changed && user) {
          saveGuestToFirestore(changed, user.uid);
        }
        return updated;
      });
    },
    [user]
  );

  const handleDeleteGuest = useCallback(
    async (id: string) => {
      setGuests((prev) => prev.filter((g) => g.id !== id));
      if (user) {
        await deleteGuestFromFirestore(id);
      }
    },
    [user]
  );

  // To-Do Handlers
  const handleToggleTodo = useCallback(
    async (id: string) => {
      setTodos((prev) => {
        const updated = prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
        const done = updated.filter((t) => t.completed).length;
        const progress = updated.length > 0 ? Math.round((done / updated.length) * 100) : 0;

        if (activeEvent) {
          const updatedEvent = { ...activeEvent, progressPercentage: progress };
          setEvents((eList) => eList.map((e) => (e.id === activeEvent.id ? updatedEvent : e)));
          if (user) {
            saveEventToFirestore(updatedEvent, user.uid);
          }
        }

        const changed = updated.find((t) => t.id === id);
        if (changed && user) {
          saveTodoToFirestore(changed, user.uid);
        }

        return updated;
      });

      logActivity('checklist', 'Event checklist item updated', '#a855f7');
    },
    [activeEvent, user, logActivity]
  );

  const handleAddTodo = useCallback(
    async (todo: ToDoItem) => {
      setTodos((prev) => [todo, ...prev]);
      if (user) {
        await saveTodoToFirestore(todo, user.uid);
      }
    },
    [user]
  );

  const handleDeleteTodo = useCallback(
    async (id: string) => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      if (user) {
        await deleteTodoFromFirestore(id);
      }
    },
    [user]
  );

  // Vendor Quotes Handlers
  const handleSaveQuote = useCallback(
    async (quote: VendorQuote) => {
      setQuotes((prev) => [quote, ...prev]);
      if (user) {
        await saveQuoteToFirestore(quote, user.uid);
      }
      logActivity('vendor', `Quotation submitted: ${formatCurrencyINR(quote.quotedAmount)}`, '#10b981');
    },
    [user, logActivity]
  );

  const handleUpdateQuoteStatus = useCallback((quoteId: string, status: 'accepted' | 'declined') => {
    setQuotes((prev) => prev.map((q) => (q.id === quoteId ? { ...q, status } : q)));
  }, []);

  // Notifications Handlers
  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Reset to Defaults (PIN guarded)
  const handleResetData = useCallback(() => {
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
  }, [openPinModalForAction]);

  return {
    events,
    activities,
    vendors,
    budgetItems,
    guests,
    todos,
    quotes,
    notifications,
    currentThemeId,
    setCurrentThemeId,
    selectedEventId,
    setSelectedEventId,
    currentTheme,
    activeEvent,
    popularThemes,
    // Action methods
    handleSaveEvent,
    handleDeleteEvent,
    handleSelectEvent,
    updateEventLocation,
    handleAddBudgetItem,
    handleDeleteBudgetItem,
    handleToggleBudgetStatus,
    handleAddGuest,
    handleToggleGuestRsvp,
    handleDeleteGuest,
    handleToggleTodo,
    handleAddTodo,
    handleDeleteTodo,
    handleSaveQuote,
    handleUpdateQuoteStatus,
    markAllNotificationsRead,
    dismissNotification,
    handleResetData
  };
}
