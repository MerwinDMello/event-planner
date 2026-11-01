import React, { useState } from 'react';
import { UserRole } from '../types';
import { Settings, User, Store, IndianRupee, MapPin, Bell, RefreshCw, Check } from 'lucide-react';

interface SettingsViewProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userRole,
  setUserRole,
  onResetData
}) => {
  const [parentName, setParentName] = useState('Merwin D’Mello');
  const [parentEmail, setParentEmail] = useState('merwin.dmello@gmail.com');
  const [city, setCity] = useState('Mumbai, Maharashtra');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-purple-400" />
          <span>Account & Preferences</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure planner profiles, default event regions, and notification alerts
        </p>
      </div>

      {/* Role Switcher Card */}
      <div className="p-5 rounded-2xl bg-[#14152a] border border-[#26284b] shadow-xl space-y-3">
        <h2 className="text-sm font-bold text-white">Active Profile Type</h2>
        <p className="text-xs text-slate-400">
          Seamlessly test and experience both Parent and Vendor views of the Celebration Planner.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setUserRole('parent')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              userRole === 'parent'
                ? 'bg-purple-900/40 border-purple-500 ring-2 ring-purple-500/40 text-white'
                : 'bg-[#181934] border-[#292b4f] text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <User className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm text-white">Parent Profile</span>
              {userRole === 'parent' && <Check className="w-4 h-4 text-amber-400 ml-auto" />}
            </div>
            <p className="text-xs text-slate-300">
              Access Home, My Events, 12 Themes, Vendors, Budget Tracker, Guest List & To-Do.
            </p>
          </button>

          <button
            onClick={() => setUserRole('vendor')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              userRole === 'vendor'
                ? 'bg-purple-900/40 border-purple-500 ring-2 ring-purple-500/40 text-white'
                : 'bg-[#181934] border-[#292b4f] text-slate-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <Store className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-sm text-white">Vendor Profile</span>
              {userRole === 'vendor' && <Check className="w-4 h-4 text-amber-400 ml-auto" />}
            </div>
            <p className="text-xs text-slate-300">
              Access Home, My Events, To-Do, Settings + Submit Quotes, Public Events & Pricing.
            </p>
          </button>
        </div>
      </div>

      {/* Profile Details Form */}
      <form onSubmit={handleSave} className="p-5 rounded-2xl bg-[#14152a] border border-[#26284b] shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white">Profile Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Display Name</label>
            <input
              type="text"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              className="w-full bg-[#101124] border border-[#2c2f54] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className="w-full bg-[#101124] border border-[#2c2f54] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-400" /> Default City / Location
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-[#101124] border border-[#2c2f54] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-amber-400" /> Currency Standard
            </label>
            <select
              defaultValue="INR"
              className="w-full bg-[#101124] border border-[#2c2f54] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
            >
              <option value="INR">INR (₹ - Indian Rupee)</option>
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="EUR">EUR (€ - Euro)</option>
              <option value="GBP">GBP (£ - British Pound)</option>
            </select>
          </div>
        </div>

        {/* Notifications toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#0e0f22] border border-[#222445]">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-xs font-bold text-white block">Event Reminders & Vendor Alerts</span>
              <span className="text-[11px] text-slate-400">Receive alerts 14 days, 7 days, and 2 days before celebration date</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedMessage && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Preferences saved!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Reset Data Option */}
      <div className="p-4 rounded-2xl bg-[#14152a] border border-[#26284b] flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-white block">Reset to Showcase Defaults</span>
          <span className="text-[11px] text-slate-400">
            Restore sample events (Zenia's Halloween Party, Aarav's Beach Party) and initial data.
          </span>
        </div>
        <button
          onClick={onResetData}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#212347] hover:bg-[#2c3060] text-xs font-semibold text-slate-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </div>
  );
};
