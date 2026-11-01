import React from 'react';
import {
  Zap,
  CalendarPlus,
  Palette,
  Users,
  Wallet,
  FileCheck2,
  Tags,
  Megaphone
} from 'lucide-react';
import { UserRole } from '../types';

interface QuickActionsSectionProps {
  userRole: UserRole;
  onCreateEvent: () => void;
  onExploreThemes: () => void;
  onManageGuests: () => void;
  onTrackBudget: () => void;
  onSubmitQuote: () => void;
  onPricingOptions: () => void;
  onCreatePublicEvent: () => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  userRole,
  onCreateEvent,
  onExploreThemes,
  onManageGuests,
  onTrackBudget,
  onSubmitQuote,
  onPricingOptions,
  onCreatePublicEvent
}) => {
  return (
    <div className="rounded-2xl border border-[#232442] bg-[#14152a] p-5 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
          <Zap className="w-4 h-4 fill-orange-400/20" />
        </div>
        <h2 className="text-base font-bold text-white tracking-tight">Quick Actions</h2>
        <span className="text-[11px] text-slate-400 ml-auto capitalize">
          {userRole === 'parent' ? 'Parent Tools' : 'Vendor Portal'}
        </span>
      </div>

      {/* 4 Action Cards Row */}
      {userRole === 'parent' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* 1. Create Event */}
          <button
            onClick={onCreateEvent}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#1a1b36] border border-[#2d2f53] hover:border-purple-500 hover:bg-[#222447] transition-all group text-center cursor-pointer shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-2.5 text-purple-400 group-hover:scale-110 group-hover:bg-purple-600/30 transition-all">
              <CalendarPlus className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
              Create Event
            </span>
          </button>

          {/* 2. Explore Themes */}
          <button
            onClick={onExploreThemes}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#1a1b36] border border-[#2d2f53] hover:border-blue-500 hover:bg-[#222447] transition-all group text-center cursor-pointer shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-2.5 text-blue-400 group-hover:scale-110 group-hover:bg-blue-600/30 transition-all">
              <Palette className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
              Explore Themes
            </span>
          </button>

          {/* 3. Manage Guests */}
          <button
            onClick={onManageGuests}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#1a1b36] border border-[#2d2f53] hover:border-emerald-500 hover:bg-[#222447] transition-all group text-center cursor-pointer shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mb-2.5 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600/30 transition-all">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
              Manage Guests
            </span>
          </button>

          {/* 4. Track Budget */}
          <button
            onClick={onTrackBudget}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#1a1b36] border border-[#2d2f53] hover:border-amber-500 hover:bg-[#222447] transition-all group text-center cursor-pointer shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center mb-2.5 text-amber-400 group-hover:scale-110 group-hover:bg-amber-600/30 transition-all">
              <Wallet className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
              Track Budget
            </span>
          </button>
        </div>
      ) : (
        /* Vendor Profile Quick Actions */
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* 1. Create Public Event */}
          <button
            onClick={onCreatePublicEvent}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#1a1b36] border border-[#2d2f53] hover:border-purple-500 hover:bg-[#222447] transition-all group text-center cursor-pointer shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-2.5 text-purple-400 group-hover:scale-110 group-hover:bg-purple-600/30 transition-all">
              <Megaphone className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
              Create Public Event
            </span>
          </button>

          {/* 2. Submit Quotes */}
          <button
            onClick={onSubmitQuote}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#1a1b36] border border-[#2d2f53] hover:border-blue-500 hover:bg-[#222447] transition-all group text-center cursor-pointer shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-2.5 text-blue-400 group-hover:scale-110 group-hover:bg-blue-600/30 transition-all">
              <FileCheck2 className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
              Submit Quotes
            </span>
          </button>

          {/* 3. Pricing Options */}
          <button
            onClick={onPricingOptions}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#1a1b36] border border-[#2d2f53] hover:border-amber-500 hover:bg-[#222447] transition-all group text-center cursor-pointer shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center mb-2.5 text-amber-400 group-hover:scale-110 group-hover:bg-amber-600/30 transition-all">
              <Tags className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
              Pricing Options
            </span>
          </button>

          {/* 4. Explore Themes */}
          <button
            onClick={onExploreThemes}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#1a1b36] border border-[#2d2f53] hover:border-emerald-500 hover:bg-[#222447] transition-all group text-center cursor-pointer shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mb-2.5 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600/30 transition-all">
              <Palette className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
              Theme Directory
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
