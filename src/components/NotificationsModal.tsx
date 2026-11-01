import React from 'react';
import { X, Bell, CheckCircle2, Calendar, Star, Check } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type: 'vendor' | 'rsvp' | 'checklist' | 'season';
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onDismiss
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-[#13142c] border border-[#292b4f] shadow-2xl overflow-hidden my-auto">
        <div className="px-5 py-4 border-b border-[#212344] bg-[#171836] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Event Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold"
            >
              Mark all as read
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#202246] hover:bg-[#2b2e5e] text-slate-300 flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-2.5 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No notifications right now.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-xl border transition-colors flex items-start justify-between gap-3 ${
                  notif.read
                    ? 'bg-[#161730] border-[#252748] opacity-75'
                    : 'bg-[#1c1d3f] border-purple-500/30'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {notif.type === 'vendor' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {notif.type === 'rsvp' && <Check className="w-4 h-4 text-cyan-400" />}
                    {notif.type === 'checklist' && <Calendar className="w-4 h-4 text-purple-400" />}
                    {notif.type === 'season' && <Star className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white leading-snug">{notif.title}</p>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{notif.time}</span>
                  </div>
                </div>

                <button
                  onClick={() => onDismiss(notif.id)}
                  className="text-slate-500 hover:text-slate-300 text-xs shrink-0"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
