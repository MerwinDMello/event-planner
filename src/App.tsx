/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, VendorItem } from './types';
import { CELEBRATION_THEMES } from './data/celebrationThemes';

import { AuthProvider, useAuth } from './firebase/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { SecurityProvider, useSecurity } from './context/SecurityContext';

import { usePlannerState } from './hooks/usePlannerState';

import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { HeroBanner } from './components/HeroBanner';
import { UpcomingEventsSection } from './components/UpcomingEventsSection';
import { QuickActionsSection } from './components/QuickActionsSection';
import { PopularThemesSection } from './components/PopularThemesSection';
import { RecentActivitySection } from './components/RecentActivitySection';
import { SearchResultsSection, SearchResults } from './components/SearchResultsSection';
import { ThemesGalleryView } from './components/ThemesGalleryView';

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
import { AccessibilityModal } from './components/AccessibilityModal';
import { TestingSuiteView } from './components/TestingSuiteView';
import { ParentLockModal } from './components/ParentLockModal';
import { SecurityCenterView } from './components/SecurityCenterView';

function PlannerContent() {
  const { user, userProfile } = useAuth();
  const { openPinModalForAction } = useSecurity();

  // Navigation & Role State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole>('parent');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract reactive state, storage persistence, and CRUD handlers
  const {
    events,
    activities,
    vendors,
    budgetItems,
    guests,
    todos,
    quotes,
    notifications,
    setCurrentThemeId,
    currentTheme,
    activeEvent,
    popularThemes,
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
  } = usePlannerState(user, openPinModalForAction);

  // Sync role if set in user profile
  useEffect(() => {
    if (userProfile?.role) {
      setUserRole(userProfile.role);
    }
  }, [userProfile]);

  // Modals visibility
  const [isThemesExplorerOpen, setIsThemesExplorerOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [selectedVendorForQuote, setSelectedVendorForQuote] = useState<VendorItem | null>(null);
  const [isVendorQuoteSubmission, setIsVendorQuoteSubmission] = useState(false);

  // Quote Request triggers
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

  // Global search filtering
  const searchResults: SearchResults | null = useMemo(() => {
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
            <SearchResultsSection
              searchQuery={searchQuery}
              searchResults={searchResults}
              onClearSearch={() => setSearchQuery('')}
              onSelectTheme={(id) => setCurrentThemeId(id)}
              onSelectEvent={handleSelectEvent}
              onSelectVendorTab={() => setCurrentTab('vendors')}
            />
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
              onSelectVenueForEvent={updateEventLocation}
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
            <ThemesGalleryView
              themes={CELEBRATION_THEMES}
              currentTheme={currentTheme}
              onSelectTheme={(id) => setCurrentThemeId(id)}
              onPlanEvent={(theme) => {
                setCurrentThemeId(theme.id);
                setIsCreateEventOpen(true);
              }}
              onOpenExplorerModal={() => setIsThemesExplorerOpen(true)}
            />
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
        onMarkAllRead={markAllNotificationsRead}
        onDismiss={dismissNotification}
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
