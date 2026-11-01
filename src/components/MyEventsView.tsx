import React, { useState } from 'react';
import { CelebrationEvent, UserRole, CelebrationTheme } from '../types';
import { Calendar, MapPin, Users, IndianRupee, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import { formatCurrencyINR, formatEventDate, formatCountdownBadge } from '../utils/formatters';

interface MyEventsViewProps {
  events: CelebrationEvent[];
  userRole: UserRole;
  onOpenCreateEvent: () => void;
  onSelectEvent: (event: CelebrationEvent) => void;
  onDeleteEvent: (id: string) => void;
  onSelectThemeById: (themeId: string) => void;
  themes: CelebrationTheme[];
}

export const MyEventsView: React.FC<MyEventsViewProps> = ({
  events,
  userRole,
  onOpenCreateEvent,
  onSelectEvent,
  onDeleteEvent,
  onSelectThemeById,
  themes
}) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  const filteredEvents = events.filter((e) => {
    if (filter === 'upcoming') return e.daysRemaining >= 0;
    if (filter === 'completed') return e.progressPercentage >= 100;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>🎉</span>
            <span>{userRole === 'parent' ? 'My Celebrations & Events' : 'Managed Client Events'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track milestones, fulfillment status, and budget for all your kids celebrations
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter segment */}
          <div className="flex p-1 bg-[#161730] border border-[#272948] rounded-xl text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({events.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'upcoming' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'completed' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Done
            </button>
          </div>

          <button
            onClick={onOpenCreateEvent}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Celebration</span>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((evt) => {
          const theme = themes.find((t) => t.id === evt.themeId);
          const isHalloween = evt.themeId === 'halloween-party';
          const isBeach = evt.themeId === 'beach-party';

          return (
            <div
              key={evt.id}
              className="rounded-2xl border border-[#252749] bg-[#14152a] overflow-hidden hover:border-purple-500/50 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Event Cover Photo */}
                <div className="relative h-40 w-full overflow-hidden bg-[#0d0e20]">
                  {isHalloween ? (
                    <img
                      src="/assets/aistudio/Halloween_d7e01516.png"
                      alt={evt.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : isBeach ? (
                    <img
                      src="/assets/aistudio/Beach_Party_e48b471d.png"
                      alt={evt.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src="/assets/aistudio/Celebration_Themes_041b2e2f.png"
                        alt={evt.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {theme && (
                        <div
                          className="absolute inset-0 mix-blend-color opacity-30"
                          style={{ backgroundColor: theme.accentColor }}
                        />
                      )}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#14152a] via-transparent to-transparent" />

                  <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-amber-300 border border-white/10">
                    {evt.themeName}
                  </span>

                  <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950">
                    {formatCountdownBadge(evt.daysRemaining)}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-base text-white group-hover:text-amber-300 transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>{formatEventDate(evt.date)} • {evt.time}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span className="truncate">{evt.location}</span>
                    </p>
                  </div>

                  {/* Metrics: Guests & Budget */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#181934] border border-[#26284a] text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                        <Users className="w-3 h-3 text-cyan-400" /> Guests
                      </span>
                      <span className="font-bold text-white tabular-nums">
                        {evt.guestsGoingCount} RSVPs
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                        <IndianRupee className="w-3 h-3 text-amber-400" /> Budget
                      </span>
                      <span className="font-bold text-white tabular-nums">
                        {formatCurrencyINR(evt.budgetEstimated)}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-slate-300 font-medium">Planning Progress</span>
                      <span className="text-amber-400 font-bold tabular-nums">
                        {evt.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-[#0d0e1e] rounded-full h-2 overflow-hidden ring-1 ring-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-600 to-amber-500 transition-all duration-500"
                        style={{ width: `${evt.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 border-t border-[#202244] mt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    onSelectEvent(evt);
                    onSelectThemeById(evt.themeId);
                  }}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-[#202246] hover:bg-[#2b2e5c] text-xs font-semibold text-slate-200 transition-colors cursor-pointer text-center"
                >
                  Set as Dashboard Event
                </button>
                <button
                  onClick={() => onDeleteEvent(evt.id)}
                  aria-label="Delete Event"
                  className="p-1.5 rounded-xl hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
