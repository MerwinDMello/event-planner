import React, { useState } from 'react';
import { Calendar, MapPin, ArrowRight, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { CelebrationEvent, UserRole } from '../types';
import { formatEventDate, formatCountdownBadge } from '../utils/formatters';

interface UpcomingEventsSectionProps {
  events: CelebrationEvent[];
  userRole: UserRole;
  onViewAll: () => void;
  onSelectEvent: (event: CelebrationEvent) => void;
}

export const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({
  events,
  userRole,
  onViewAll,
  onSelectEvent
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeEvents = events.length > 0 ? events : [];
  const currentEvent = activeEvents[currentIndex] || activeEvents[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : activeEvents.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < activeEvents.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="rounded-2xl border border-[#232442] bg-[#14152a] p-5 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
            <Calendar className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">Upcoming Events</h2>
          {activeEvents.length > 1 && (
            <span className="text-[11px] text-slate-400 font-medium">
              ({currentIndex + 1} of {activeEvents.length})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeEvents.length > 1 && (
            <div className="flex items-center gap-1 mr-1">
              <button
                onClick={handlePrev}
                aria-label="Previous event"
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#202242] transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next event"
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#202242] transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {currentEvent ? (
        <div
          onClick={() => onSelectEvent(currentEvent)}
          className="group cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#171932] border border-[#272948] hover:border-purple-500/40 rounded-xl p-3.5 transition-all"
        >
          {/* Left Thumbnail */}
          <div className="md:col-span-5 h-36 w-full rounded-lg overflow-hidden relative bg-[#0e0f22] shrink-0">
            {currentEvent.themeId === 'halloween-party' ? (
              <img
                src="/assets/aistudio/Halloween_d7e01516.png"
                alt={currentEvent.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : currentEvent.themeId === 'beach-party' ? (
              <img
                src="/assets/aistudio/Beach_Party_e48b471d.png"
                alt={currentEvent.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <img
                src="/assets/aistudio/Celebration_Themes_041b2e2f.png"
                alt={currentEvent.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-2 left-2 text-[10px] font-bold text-amber-300 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
              {currentEvent.themeName}
            </div>
          </div>

          {/* Right Details */}
          <div className="md:col-span-7 space-y-2.5">
            {/* Title & Days Remaining Badge */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors leading-snug">
                {currentEvent.title}
              </h3>
              <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {formatCountdownBadge(currentEvent.daysRemaining)}
              </span>
            </div>

            {/* Date, Time & Location */}
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="tabular-nums">
                  {formatEventDate(currentEvent.date)} • {currentEvent.time}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="truncate">{currentEvent.location}</span>
              </div>
            </div>

            {/* People Going Avatars */}
            <div className="flex items-center gap-2 pt-0.5">
              <div className="flex -space-x-1.5 overflow-hidden">
                <span className="inline-block w-5 h-5 rounded-full ring-2 ring-[#171932] bg-gradient-to-tr from-amber-400 to-orange-400 text-[10px] font-bold text-slate-900 text-center leading-5">
                  M
                </span>
                <span className="inline-block w-5 h-5 rounded-full ring-2 ring-[#171932] bg-gradient-to-tr from-blue-400 to-indigo-500 text-[10px] font-bold text-white text-center leading-5">
                  A
                </span>
                <span className="inline-block w-5 h-5 rounded-full ring-2 ring-[#171932] bg-gradient-to-tr from-pink-400 to-rose-500 text-[10px] font-bold text-white text-center leading-5">
                  Z
                </span>
                <span className="inline-block w-5 h-5 rounded-full ring-2 ring-[#171932] bg-gradient-to-tr from-emerald-400 to-teal-500 text-[10px] font-bold text-slate-950 text-center leading-5">
                  R
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-300">
                +{currentEvent.guestsGoingCount - 4 > 0 ? currentEvent.guestsGoingCount - 4 : currentEvent.guestsGoingCount} going
              </span>
            </div>

            {/* Planning Progress Bar for Owner/Parent or Vendor */}
            <div className="pt-1">
              <div className="flex justify-between items-center text-[11px] mb-1">
                <span className="text-slate-300 font-medium">
                  {userRole === 'vendor' ? 'Vendor Fulfillment' : 'Planning'}{' '}
                  <span className="tabular-nums font-semibold text-white">
                    {currentEvent.progressPercentage}% complete
                  </span>
                </span>
                {currentEvent.progressPercentage >= 100 && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <div className="w-full bg-[#0d0e1e] rounded-full h-2 overflow-hidden ring-1 ring-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-fuchsia-500 shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-700"
                  style={{ width: `${currentEvent.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 text-xs">
          No upcoming celebrations yet. Click "Plan This Event" to get started!
        </div>
      )}
    </div>
  );
};
