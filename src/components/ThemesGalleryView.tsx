/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CelebrationTheme } from '../types';

interface ThemesGalleryViewProps {
  themes: CelebrationTheme[];
  currentTheme: CelebrationTheme;
  onSelectTheme: (themeId: string) => void;
  onPlanEvent: (theme: CelebrationTheme) => void;
  onOpenExplorerModal: () => void;
}

export const ThemesGalleryView: React.FC<ThemesGalleryViewProps> = ({
  themes,
  currentTheme,
  onSelectTheme,
  onPlanEvent,
  onOpenExplorerModal
}) => {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#14152a] border border-[#242646] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">Signature Kids Celebration Themes</h2>
          <p className="text-xs text-slate-400">
            Browse all 12 signature themes with customized itineraries and decorations.
          </p>
        </div>
        <button
          onClick={onOpenExplorerModal}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md cursor-pointer shrink-0 transition-colors"
        >
          Open Full Gallery
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {themes.map((theme) => {
          const isSelected = currentTheme.id === theme.id;
          const isHalloween = theme.id === 'halloween-party';
          const isBeach = theme.id === 'beach-party';

          return (
            <div
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#1c1d3d] border-purple-500 ring-2 ring-purple-500/50'
                  : 'bg-[#14152a] border-[#252749] hover:border-purple-400/40 hover:bg-[#1a1b38]'
              }`}
            >
              <div>
                <div className="h-32 rounded-xl overflow-hidden relative mb-2.5 bg-[#0e0f22]">
                  {isHalloween ? (
                    <img
                      src="/assets/aistudio/Halloween_d7e01516.png"
                      alt={theme.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : isBeach ? (
                    <img
                      src="/assets/aistudio/Beach_Party_e48b471d.png"
                      alt={theme.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src="/assets/aistudio/Celebration_Themes_041b2e2f.png"
                        alt={theme.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 mix-blend-color opacity-30"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-amber-300">
                    {theme.season}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-white">{theme.name}</h3>
                <p className="text-xs text-amber-300 font-medium">{theme.tagline}</p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {theme.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#222448] flex items-center justify-between">
                <span className="text-[10px] text-purple-300 font-semibold">{theme.funBadge}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlanEvent(theme);
                  }}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-[11px] cursor-pointer hover:from-amber-400 hover:to-orange-400 transition-colors"
                >
                  Plan Event
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
