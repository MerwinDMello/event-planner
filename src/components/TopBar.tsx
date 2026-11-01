import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Check, UserCheck, Briefcase, Sparkles, LogOut, LogIn, Database } from 'lucide-react';
import { UserRole, CelebrationTheme } from '../types';
import { useAuth } from '../firebase/AuthContext';

interface TopBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  currentTheme: CelebrationTheme;
  onSelectTheme: (themeId: string) => void;
  allThemes: CelebrationTheme[];
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  setSearchQuery,
  userRole,
  setUserRole,
  onOpenNotifications,
  unreadNotificationsCount,
  currentTheme,
  onSelectTheme,
  allThemes,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const { user, userProfile, signInWithGoogle, signOutUser, updateUserRole } = useAuth();

  const handleRoleChange = async (role: UserRole) => {
    setUserRole(role);
    if (user) {
      await updateUserRole(role);
    }
  };

  return (
    <header className="h-16 px-6 border-b border-[#1f2138] bg-[#0c0d1e]/90 backdrop-blur-md flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Search Bar matching screenshots */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events, themes, vendors..."
          className="w-full bg-[#171830] border border-[#2b2d4b] focus:border-purple-500 rounded-full pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Right Section: Seasonal Selector + Notifications + Firebase Auth / Profile */}
      <div className="flex items-center gap-3">
        {/* Firestore Sync Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#161730] border border-[#272948] text-[10px] text-slate-300">
          <Database className="w-3 h-3 text-emerald-400" />
          <span>Firestore Connected</span>
        </div>

        {/* Season & Theme Quick Picker */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowSeasonDropdown(!showSeasonDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181932] border border-[#2e3052] text-xs text-slate-300 hover:text-white hover:border-purple-500/50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-slate-200">Theme: {currentTheme.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showSeasonDropdown && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#14152a] border border-[#2a2c4a] shadow-2xl p-2 z-50 text-xs max-h-80 overflow-y-auto">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Active Season Theme
              </div>
              <div className="space-y-1 mt-1">
                {allThemes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTheme(t.id);
                      setShowSeasonDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                      currentTheme.id === t.id
                        ? 'bg-purple-900/40 text-amber-300 font-semibold border border-purple-500/30'
                        : 'text-slate-300 hover:bg-[#202240] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{t.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{t.season}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon with Badge */}
        <button
          onClick={onOpenNotifications}
          aria-label="View notifications"
          className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-[#1a1b36] transition-colors"
        >
          <Bell className="w-5 h-5 text-slate-300" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute 0 top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-[#0c0d1e]">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Firebase Authentication & Profile Menu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-[#181932] border border-[#2c2d4a] hover:border-purple-500/50 transition-all text-left cursor-pointer"
            >
              {/* User Avatar */}
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-purple-500/40"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 ring-2 ring-purple-500/40 flex items-center justify-center text-xs font-bold text-slate-950">
                  {user.displayName?.[0] || 'M'}
                </div>
              )}

              <div className="hidden sm:block text-left leading-none">
                <span className="text-xs font-semibold text-slate-100 block truncate max-w-[110px]">
                  {user.displayName || 'Merwin D.'}
                </span>
                <span className="text-[10px] text-amber-400 font-medium capitalize">
                  {userRole === 'parent' ? 'Parent Profile' : 'Vendor Profile'}
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#14152b] border border-[#2b2d4c] shadow-2xl p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-[#23243f]">
                  <p className="font-semibold text-slate-100 truncate">
                    {user.displayName || 'Merwin D’Mello'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>

                <div className="p-1 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active Role
                  </div>

                  <button
                    onClick={() => {
                      handleRoleChange('parent');
                      setShowProfileMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                      userRole === 'parent'
                        ? 'bg-purple-900/40 text-amber-300 font-semibold'
                        : 'text-slate-300 hover:bg-[#202240] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Parent Profile</span>
                    </div>
                    {userRole === 'parent' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>

                  <button
                    onClick={() => {
                      handleRoleChange('vendor');
                      setShowProfileMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                      userRole === 'vendor'
                        ? 'bg-purple-900/40 text-amber-300 font-semibold'
                        : 'text-slate-300 hover:bg-[#202240] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Vendor Profile</span>
                    </div>
                    {userRole === 'vendor' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>

                  <div className="pt-2 border-t border-[#23243f]">
                    <button
                      onClick={() => {
                        signOutUser();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 font-semibold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => signInWithGoogle()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-900/40 transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign in with Google</span>
          </button>
        )}
      </div>
    </header>
  );
};
