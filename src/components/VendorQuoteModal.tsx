import React, { useState } from 'react';
import { X, FileCheck, IndianRupee, Store, Send } from 'lucide-react';
import { VendorItem, CelebrationEvent, VendorQuote } from '../types';
import confetti from 'canvas-confetti';

interface VendorQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor?: VendorItem | null;
  events: CelebrationEvent[];
  activeEvent?: CelebrationEvent;
  isVendorSubmission?: boolean;
  onSubmitQuote: (quote: VendorQuote) => void;
}

export const VendorQuoteModal: React.FC<VendorQuoteModalProps> = ({
  isOpen,
  onClose,
  vendor,
  events,
  activeEvent,
  isVendorSubmission = false,
  onSubmitQuote
}) => {
  const [selectedEventId, setSelectedEventId] = useState(activeEvent?.id || (events[0]?.id || ''));
  const [serviceName, setServiceName] = useState(
    isVendorSubmission ? 'Full Party Decor & Balloon Arch Package' : 'Custom Decor & Entertainment Quotation Request'
  );
  const [quotedAmount, setQuotedAmount] = useState(vendor?.startingPrice || 15000);
  const [message, setMessage] = useState(
    isVendorSubmission
      ? 'Includes on-site balloon artist, themed photobooth backdrop, and 3 hours dedicated assistance.'
      : 'Looking for themed party setup, kids activity coordination, and lighting. Please share options!'
  );

  if (!isOpen) return null;

  const targetEvent = events.find((e) => e.id === selectedEventId) || activeEvent || events[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEvent) return;

    const newQuote: VendorQuote = {
      id: `qt-${Date.now()}`,
      eventId: targetEvent.id,
      eventName: targetEvent.title,
      clientName: targetEvent.ownerName || 'Merwin D’Mello',
      serviceOffered: serviceName.trim(),
      quotedAmount: Number(quotedAmount) || 12000,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'pending',
      message: message.trim()
    };

    onSubmitQuote(newQuote);
    try {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 }
      });
    } catch {
      // fallback
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#12132a] border border-[#27294e] shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 border-b border-[#212344] bg-[#161734] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isVendorSubmission ? 'Submit Vendor Quotation' : `Request Quote from ${vendor?.name || 'Vendor'}`}
              </h3>
              <p className="text-xs text-slate-400">
                {isVendorSubmission ? 'Send your competitive bid to event parents' : 'Direct pricing and availability inquiry'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#202246] hover:bg-[#2b2e5e] text-slate-300 flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Target Event Picker */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Target Event</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full bg-[#181934] border border-[#2b2d4e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} ({evt.themeName} • {evt.date})
                </option>
              ))}
            </select>
          </div>

          {/* Service Title */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Service Package / Requirement</label>
            <input
              type="text"
              required
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full bg-[#181934] border border-[#2b2d4e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
              {isVendorSubmission ? 'Quoted Amount (₹)' : 'Estimated Target Budget (₹)'}
            </label>
            <input
              type="number"
              step="500"
              required
              value={quotedAmount}
              onChange={(e) => setQuotedAmount(Number(e.target.value))}
              className="w-full bg-[#181934] border border-[#2b2d4e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400 font-bold text-amber-400"
            />
          </div>

          {/* Message / Scope */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Scope Details & Message</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#181934] border border-[#2b2d4e] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-[#202244]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#202246] text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold shadow-md shadow-orange-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isVendorSubmission ? 'Submit Quote' : 'Send Inquiry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
