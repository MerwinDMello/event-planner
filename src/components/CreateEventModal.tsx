import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, IndianRupee, Users, Sparkles, Check } from 'lucide-react';
import { CelebrationTheme, CelebrationEvent, UserRole } from '../types';
import confetti from 'canvas-confetti';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  themes: CelebrationTheme[];
  defaultTheme?: CelebrationTheme;
  onSaveEvent: (event: CelebrationEvent) => void;
  userRole: UserRole;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  themes,
  defaultTheme,
  onSaveEvent,
  userRole
}) => {
  const initialTheme = defaultTheme || themes[0];
  const [selectedThemeId, setSelectedThemeId] = useState(initialTheme.id);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-11-20');
  const [time, setTime] = useState('5:00 PM');
  const [location, setLocation] = useState('Our Residence, Mumbai');
  const [guestsCount, setGuestsCount] = useState(15);
  const [budgetEstimated, setBudgetEstimated] = useState(30000);
  const [notes, setNotes] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  if (!isOpen) return null;

  const currentTheme = themes.find((t) => t.id === selectedThemeId) || initialTheme;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Calculate approximate days remaining
    const eventDate = new Date(date);
    const today = new Date('2026-11-01');
    const diffTime = eventDate.getTime() - today.getTime();
    const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const newEvent: CelebrationEvent = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      themeId: currentTheme.id,
      themeName: currentTheme.name,
      date,
      time,
      location: location.trim() || 'Mumbai',
      daysRemaining,
      guestsGoingCount: guestsCount,
      progressPercentage: 25,
      budgetEstimated: Number(budgetEstimated) || 25000,
      budgetSpent: 0,
      isOwner: true,
      ownerName: userRole === 'parent' ? 'Merwin' : 'Vendor Host',
      bannerImage: currentTheme.bannerImage,
      notes,
      isPublicForVendors: isPublic
    };

    onSaveEvent(newEvent);
    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#111228] border border-[#27294f] shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#212344] bg-[#161732] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {userRole === 'parent' ? 'Plan a Kids Celebration' : 'Create Public Festive Event'}
              </h2>
              <p className="text-xs text-slate-400">
                Pick from our 12 signature themes and customize every detail
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#202246] hover:bg-[#2b2e5e] text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Theme Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Celebration Theme (12 Themes Available)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto p-1 bg-[#0d0e20] rounded-xl border border-[#202242]">
              {themes.map((t) => {
                const isSelected = selectedThemeId === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => {
                      setSelectedThemeId(t.id);
                      if (!title) {
                        setTitle(userRole === 'parent' ? `Kid's ${t.name}` : `${t.name} Extravaganza`);
                      }
                    }}
                    className={`p-2 rounded-lg text-left text-xs transition-all relative ${
                      isSelected
                        ? 'bg-purple-900/60 border border-purple-400 text-white font-bold shadow-md'
                        : 'bg-[#15162e] border border-[#252749] text-slate-300 hover:bg-[#1b1c3b]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate block font-semibold">{t.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-amber-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-amber-400/80 block">{t.season}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Event Name
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Reyansh's Space Exploration Party"
              className="w-full bg-[#171833] border border-[#2c2e54] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Date, Time, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-purple-400" /> Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#171833] border border-[#2c2e54] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-400" /> Time
              </label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="4:30 PM"
                className="w-full bg-[#171833] border border-[#2c2e54] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-emerald-400" /> Expected Guests
              </label>
              <input
                type="number"
                min="1"
                max="200"
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full bg-[#171833] border border-[#2c2e54] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* Location & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-400" /> Location / Venue
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Clubhouse, Residential Lawn, Resort"
                className="w-full bg-[#171833] border border-[#2c2e54] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <IndianRupee className="w-3 h-3 text-amber-400" /> Budget Estimate (₹)
              </label>
              <input
                type="number"
                step="1000"
                min="5000"
                value={budgetEstimated}
                onChange={(e) => setBudgetEstimated(Number(e.target.value))}
                className="w-full bg-[#171833] border border-[#2c2e54] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Celebration Notes & Wishlist
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Two-tier chocolate cake, magician at 6 PM, return gift buckets..."
              className="w-full bg-[#171833] border border-[#2c2e54] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Public quote checkbox */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0e0f22] border border-[#222445]">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="isPublic" className="text-xs text-slate-300 cursor-pointer">
              Allow verified vendors to view requirements & submit quotes for this event
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3 border-t border-[#212344]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1e2040] hover:bg-[#282a55] text-xs font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 transition-all"
            >
              Create Celebration Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
