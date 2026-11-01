import React, { useState } from 'react';
import { GuestItem, CelebrationEvent } from '../types';
import { Users, UserPlus, CheckCircle2, Clock, XCircle, Gift, Trash2, Heart } from 'lucide-react';

interface GuestListViewProps {
  guests: GuestItem[];
  activeEvent?: CelebrationEvent;
  onAddGuest: (guest: GuestItem) => void;
  onToggleRsvp: (id: string) => void;
  onDeleteGuest: (id: string) => void;
}

export const GuestListView: React.FC<GuestListViewProps> = ({
  guests,
  activeEvent,
  onAddGuest,
  onToggleRsvp,
  onDeleteGuest
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'kid' | 'parent'>('kid');
  const [familyGroup, setFamilyGroup] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<GuestItem['rsvpStatus']>('confirmed');
  const [dietaryNote, setDietaryNote] = useState('');

  const totalKids = guests.filter((g) => g.type === 'kid').length;
  const totalParents = guests.filter((g) => g.type === 'parent').length;
  const confirmedCount = guests.filter((g) => g.rsvpStatus === 'confirmed').length;
  const pendingCount = guests.filter((g) => g.rsvpStatus === 'pending').length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGuest: GuestItem = {
      id: `gst-${Date.now()}`,
      name: name.trim(),
      type,
      familyGroup: familyGroup.trim() || 'General Invite',
      rsvpStatus,
      dietaryNote: dietaryNote.trim() || undefined,
      hasGift: false
    };

    onAddGuest(newGuest);
    setName('');
    setFamilyGroup('');
    setDietaryNote('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>Kids & Parents Guest List</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking invites & RSVPs for{' '}
            <span className="text-amber-400 font-semibold">{activeEvent?.title || 'Celebration'}</span>
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Guest / Family</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-2xl bg-[#14152a] border border-[#242646] shadow-xl">
          <span className="text-[11px] text-slate-400 block mb-1">Total Confirmed</span>
          <div className="text-2xl font-black text-emerald-400 tabular-nums flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{confirmedCount}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#14152a] border border-[#242646] shadow-xl">
          <span className="text-[11px] text-slate-400 block mb-1">Pending Responses</span>
          <div className="text-2xl font-black text-amber-400 tabular-nums flex items-center gap-1.5">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>{pendingCount}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#14152a] border border-[#242646] shadow-xl">
          <span className="text-[11px] text-slate-400 block mb-1">Kids Count</span>
          <div className="text-2xl font-black text-purple-400 tabular-nums flex items-center gap-1.5">
            <Heart className="w-5 h-5 text-purple-400" />
            <span>{totalKids}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#14152a] border border-[#242646] shadow-xl">
          <span className="text-[11px] text-slate-400 block mb-1">Parents / Adults</span>
          <div className="text-2xl font-black text-cyan-400 tabular-nums flex items-center gap-1.5">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>{totalParents}</span>
          </div>
        </div>
      </div>

      {/* Add Guest Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="p-5 rounded-2xl bg-[#181935] border border-purple-500/40 space-y-4">
          <h3 className="text-sm font-bold text-white">Add New Guest to Event</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Guest Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Neil D'Souza"
                className="w-full bg-[#101124] border border-[#2b2d4f] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Guest Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'kid' | 'parent')}
                className="w-full bg-[#101124] border border-[#2b2d4f] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
              >
                <option value="kid">Kid / Child</option>
                <option value="parent">Parent / Adult</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Family Group / Notes</label>
              <input
                type="text"
                value={familyGroup}
                onChange={(e) => setFamilyGroup(e.target.value)}
                placeholder="e.g. D'Souza Family"
                className="w-full bg-[#101124] border border-[#2b2d4f] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Initial RSVP</label>
              <select
                value={rsvpStatus}
                onChange={(e) => setRsvpStatus(e.target.value as GuestItem['rsvpStatus'])}
                className="w-full bg-[#101124] border border-[#2b2d4f] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 block mb-1">Dietary Preferences or Allergies</label>
            <input
              type="text"
              value={dietaryNote}
              onChange={(e) => setDietaryNote(e.target.value)}
              placeholder="e.g. Vegetarian, Gluten free, Nut allergy"
              className="w-full bg-[#101124] border border-[#2b2d4f] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-xl bg-[#202244] text-xs text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-md"
            >
              Save Guest
            </button>
          </div>
        </form>
      )}

      {/* Guest Table */}
      <div className="rounded-2xl border border-[#242646] bg-[#14152a] overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-[#212342] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Guest Roster</h2>
          <span className="text-xs text-slate-400">{guests.length} invitees</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#212342] bg-[#101124] text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Name & Type</th>
                <th className="py-3 px-4 font-semibold">Family Group</th>
                <th className="py-3 px-4 font-semibold">Dietary & Notes</th>
                <th className="py-3 px-4 font-semibold text-center">RSVP Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e203c]">
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-[#181936] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-bold text-[11px] flex items-center justify-center">
                        {guest.name[0]}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{guest.name}</span>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {guest.type === 'kid' ? 'Child' : 'Parent'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {guest.familyGroup}
                  </td>
                  <td className="py-3 px-4">
                    {guest.dietaryNote ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px]">
                        {guest.dietaryNote}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Standard menu</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onToggleRsvp(guest.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        guest.rsvpStatus === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : guest.rsvpStatus === 'declined'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {guest.rsvpStatus}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDeleteGuest(guest.id)}
                      className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
