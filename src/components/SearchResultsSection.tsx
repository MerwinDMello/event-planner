/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CelebrationTheme, CelebrationEvent, VendorItem } from '../types';

export interface SearchResults {
  matchedEvents: CelebrationEvent[];
  matchedThemes: CelebrationTheme[];
  matchedVendors: VendorItem[];
}

interface SearchResultsSectionProps {
  searchQuery: string;
  searchResults: SearchResults;
  onClearSearch: () => void;
  onSelectTheme: (themeId: string) => void;
  onSelectEvent: (event: CelebrationEvent) => void;
  onSelectVendorTab: () => void;
}

export const SearchResultsSection: React.FC<SearchResultsSectionProps> = ({
  searchQuery,
  searchResults,
  onClearSearch,
  onSelectTheme,
  onSelectEvent,
  onSelectVendorTab
}) => {
  const hasResults =
    searchResults.matchedThemes.length > 0 ||
    searchResults.matchedEvents.length > 0 ||
    searchResults.matchedVendors.length > 0;

  return (
    <div className="rounded-2xl border border-purple-500/50 bg-[#13142c] p-5 shadow-2xl space-y-4" role="region" aria-label="Search Results">
      <div className="flex items-center justify-between border-b border-[#222448] pb-3">
        <h3 className="font-bold text-sm text-white">
          Search Results for &ldquo;{searchQuery}&rdquo;
        </h3>
        <button
          onClick={onClearSearch}
          className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
        >
          Clear Search
        </button>
      </div>

      {!hasResults && (
        <p className="text-xs text-slate-400 py-2">
          No matching themes, events, or vendors found. Try a different keyword like &ldquo;Halloween&rdquo;, &ldquo;Beach&rdquo;, or &ldquo;Decor&rdquo;.
        </p>
      )}

      {searchResults.matchedThemes.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            Themes ({searchResults.matchedThemes.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {searchResults.matchedThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onSelectTheme(theme.id);
                  onClearSearch();
                }}
                className="p-2.5 rounded-xl bg-[#1a1b38] border border-[#2b2d52] hover:border-purple-400 text-left text-xs text-white cursor-pointer transition-colors"
              >
                <span className="font-bold block truncate">{theme.name}</span>
                <span className="text-[11px] text-slate-400 block truncate">{theme.tagline}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {searchResults.matchedEvents.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
            Events ({searchResults.matchedEvents.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {searchResults.matchedEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => {
                  onSelectEvent(event);
                  onClearSearch();
                }}
                className="p-2.5 rounded-xl bg-[#1a1b38] border border-[#2b2d52] hover:border-purple-400 text-left text-xs text-white cursor-pointer transition-colors"
              >
                <span className="font-bold block">{event.title}</span>
                <span className="text-[11px] text-slate-400 block">{event.location}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {searchResults.matchedVendors.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            Vendors ({searchResults.matchedVendors.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {searchResults.matchedVendors.map((vendor) => (
              <button
                key={vendor.id}
                onClick={() => {
                  onSelectVendorTab();
                  onClearSearch();
                }}
                className="p-2.5 rounded-xl bg-[#1a1b38] border border-[#2b2d52] hover:border-purple-400 text-left text-xs text-white cursor-pointer transition-colors"
              >
                <span className="font-bold block">{vendor.name}</span>
                <span className="text-[11px] text-slate-400 block">
                  {vendor.category} • {vendor.location}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
