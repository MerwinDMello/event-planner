import React, { useState } from 'react';
import { VendorItem, VendorQuote, UserRole } from '../types';
import { Store, Star, MapPin, IndianRupee, ShieldCheck, Mail, Phone, Plus, CheckCircle, Clock } from 'lucide-react';

interface VendorsViewProps {
  vendors: VendorItem[];
  quotes: VendorQuote[];
  userRole: UserRole;
  onRequestQuote: (vendor: VendorItem) => void;
  onSubmitQuoteModal: () => void;
  onUpdateQuoteStatus: (quoteId: string, status: 'accepted' | 'declined') => void;
}

export const VendorsView: React.FC<VendorsViewProps> = ({
  vendors,
  quotes,
  userRole,
  onRequestQuote,
  onSubmitQuoteModal,
  onUpdateQuoteStatus
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'directory' | 'quotes'>('directory');

  const categories = [
    'All',
    'Decor & Styling',
    'Catering & Cake',
    'Entertainment & Magician',
    'Photography',
    'Games & Activities'
  ];

  const filteredVendors = vendors.filter((v) => {
    return selectedCategory === 'All' || v.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Store className="w-6 h-6 text-amber-400" />
            <span>{userRole === 'parent' ? 'Kids Event Vendors & Artists' : 'Vendor Portal & Quotes'}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {userRole === 'parent'
              ? 'Book top rated, verified balloon decorators, cake artists, magicians, and game hosts'
              : 'Manage incoming client leads, customize your service pricing, and submit proposals'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-[#161730] border border-[#272948] rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'directory' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Vendor Directory
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'quotes' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Quotes ({quotes.length})
            </button>
          </div>

          {userRole === 'vendor' && (
            <button
              onClick={onSubmitQuoteModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Quote</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'directory' ? (
        <>
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-[#161730] text-slate-400 hover:text-slate-200 border border-[#272949]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Vendors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="rounded-2xl border border-[#26284b] bg-[#14152a] p-4 flex flex-col justify-between hover:border-purple-500/50 hover:shadow-xl transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                      {vendor.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end text-xs font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{vendor.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">({vendor.reviewCount})</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {vendor.category}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-base text-white group-hover:text-amber-300 transition-colors">
                        {vendor.name}
                      </h3>
                      {vendor.verified && (
                        <span title="Verified Vendor">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>{vendor.location}</span>
                    </p>
                  </div>

                  {/* Specialty Themes */}
                  <div className="mt-3">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Theme Specialties:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {vendor.themesSpecialty.map((th, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#1f2142] border border-[#2c2f56] text-[10px] text-slate-300 font-medium"
                        >
                          {th}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-3 pt-3 border-t border-[#202244] text-[11px] text-slate-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-purple-400" />
                      <span className="truncate">{vendor.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>{vendor.contactPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Footer with Starting Price & CTA */}
                <div className="mt-4 pt-3 border-t border-[#202244] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Starting from</span>
                    <span className="font-bold text-white text-sm tabular-nums flex items-center">
                      <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                      {vendor.startingPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => onRequestQuote(vendor)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-900/30 transition-all cursor-pointer"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Quotes Tab */
        <div className="rounded-2xl border border-[#26284b] bg-[#14152a] p-6 space-y-4">
          <h2 className="text-base font-bold text-white">Event Quotations & Bids</h2>
          {quotes.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No quotes submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {quotes.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-[#191a35] border border-[#2b2d52] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{q.eventName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          q.status === 'accepted'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : q.status === 'declined'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>
                    <p className="text-xs text-purple-300 font-medium">{q.serviceOffered}</p>
                    <p className="text-xs text-slate-400">{q.message}</p>
                    <span className="text-[11px] text-slate-500 block">
                      Submitted on {q.dateSubmitted} for client: {q.clientName}
                    </span>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Quoted Price</span>
                      <span className="font-extrabold text-base text-amber-400 tabular-nums">
                        ₹{q.quotedAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {userRole === 'parent' && q.status === 'pending' && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onUpdateQuoteStatus(q.id, 'accepted')}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => onUpdateQuoteStatus(q.id, 'declined')}
                          className="px-3 py-1 rounded-lg bg-[#27294b] hover:bg-[#343763] text-slate-300 text-xs font-semibold"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
