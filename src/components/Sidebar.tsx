import React from 'react';
import {
  Home,
  Calendar,
  Palette,
  Store,
  Wallet,
  Users,
  CheckSquare,
  Settings,
  Sparkles,
  PartyPopper,
  MapPin
} from 'lucide-react';
import { UserRole, CelebrationTheme } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  currentTheme: CelebrationTheme;
  onOpenThemesExplorer: () => void;
  onOpenCreateEvent: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  currentTheme,
  onOpenThemesExplorer,
  onOpenCreateEvent
}) => {
  // Navigation links based on Parent Profile vs Vendor Profile
  const parentNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'events', label: 'My Events', icon: Calendar },
    { id: 'themes', label: 'Themes', icon: Palette },
    { id: 'maps', label: 'Maps Explorer', icon: MapPin },
    { id: 'vendors', label: 'Vendors', icon: Store },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'guests', label: 'Guest List', icon: Users },
    { id: 'todo', label: 'To-Do', icon: CheckSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const vendorNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'events', label: 'My Events', icon: Calendar },
    { id: 'maps', label: 'Maps Explorer', icon: MapPin },
    { id: 'todo', label: 'To-Do', icon: CheckSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const navItems = userRole === 'parent' ? parentNavItems : vendorNavItems;

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between h-screen bg-[#0e0f21] border-r border-[#1f2138] p-4 select-none overflow-y-auto">
      {/* Top Branding & Navigation */}
      <div>
        {/* Brand Lockup */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-orange-500/20 text-slate-950 font-bold">
            <PartyPopper className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-300 ring-2 ring-[#0e0f21]" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block leading-tight">
              Celebration
            </span>
            <span className="font-semibold text-xs text-amber-400 tracking-wider uppercase block">
              Planner
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#442c75] to-[#302157] text-white shadow-md shadow-purple-900/30 font-semibold ring-1 ring-purple-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#181930]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Left below Navigation: Image card based on current theme */}
      <div className="mt-6 pt-2">
        <div 
          onClick={onOpenThemesExplorer}
          className="relative group cursor-pointer overflow-hidden rounded-2xl border border-[#2b2d4b] bg-gradient-to-b from-[#191b36] to-[#121324] p-3 text-center transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-950/50"
        >
          {/* Visual Poster based on active theme */}
          <div className="relative h-44 w-full rounded-xl overflow-hidden bg-[#101224] flex items-center justify-center">
            {currentTheme.id === 'halloween-party' ? (
              <div className="relative w-full h-full">
                <img
                  src="/assets/aistudio/Halloween_d7e01516.png"
                  alt="Halloween Spooky Theme"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-bottom brightness-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-2.5">
                  <div className="text-amber-400 text-xs font-fun font-bold tracking-wide">
                    Plan. Celebrate.
                  </div>
                  <div className="text-white text-sm font-fun font-bold drop-shadow-md">
                    Make it Magical! 🎃
                  </div>
                </div>
              </div>
            ) : currentTheme.id === 'beach-party' ? (
              <div className="relative w-full h-full">
                <img
                  src="/assets/aistudio/Beach_Party_e48b471d.png"
                  alt="Beach Party Theme"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center brightness-95 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-2.5">
                  <div className="text-cyan-300 text-xs font-fun font-bold tracking-wide">
                    Sun, Sand & Waves
                  </div>
                  <div className="text-white text-sm font-fun font-bold drop-shadow-md">
                    Beach Party Fun! 🏖️
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src="/assets/aistudio/Celebration_Themes_041b2e2f.png"
                  alt={currentTheme.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-2.5">
                  <div className="text-amber-300 text-xs font-fun font-bold tracking-wide">
                    {currentTheme.tagline}
                  </div>
                  <div className="text-white text-sm font-fun font-bold drop-shadow-md">
                    {currentTheme.name} ✨
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="truncate font-medium text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              {currentTheme.name}
            </span>
            <span className="text-purple-400 font-semibold group-hover:text-purple-300 transition-colors shrink-0">
              Change &rarr;
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
