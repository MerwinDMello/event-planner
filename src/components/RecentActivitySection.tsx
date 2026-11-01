import React from 'react';
import { History, ArrowRight, CheckCircle2, Calendar, IndianRupee, Users, Sparkles } from 'lucide-react';
import { ActivityLogItem } from '../types';

interface RecentActivitySectionProps {
  activities: ActivityLogItem[];
  onViewAll: () => void;
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({
  activities,
  onViewAll
}) => {
  const getIcon = (type: ActivityLogItem['iconType'], color: string) => {
    switch (type) {
      case 'vendor':
        return (
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'checklist':
        return (
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400">
            <Calendar className="w-4 h-4" />
          </div>
        );
      case 'budget':
        return (
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
            <IndianRupee className="w-4 h-4" />
          </div>
        );
      case 'guest':
        return (
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
            <Users className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-[#232442] bg-[#14152a] p-5 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <History className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">Recent Activity</h2>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {activities.slice(0, 4).map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-[#1a1b38] transition-colors"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {getIcon(activity.iconType, activity.badgeColor)}
              <span className="text-xs text-slate-200 truncate font-medium">
                {activity.title}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 shrink-0 tabular-nums">
              {activity.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
