import React from 'react';
import { Star, ArrowRight, Check, Sparkles } from 'lucide-react';
import { CelebrationTheme } from '../types';
import confetti from 'canvas-confetti';

interface PopularThemesSectionProps {
  currentTheme: CelebrationTheme;
  onSelectTheme: (theme: CelebrationTheme) => void;
  onViewAll: () => void;
  popularThemes: CelebrationTheme[];
}

export const PopularThemesSection: React.FC<PopularThemesSectionProps> = ({
  currentTheme,
  onSelectTheme,
  onViewAll,
  popularThemes
}) => {
  const handleSelect = (theme: CelebrationTheme) => {
    onSelectTheme(theme);
    try {
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { y: 0.8 },
        colors: [theme.accentColor, '#f59e0b', '#a855f7']
      });
    } catch {
      // fallback
    }
  };

  return (
    <div className="rounded-2xl border border-[#232442] bg-[#14152a] p-5 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Star className="w-4 h-4 fill-amber-400/20" />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">Popular Themes</h2>
          <span className="text-[11px] text-slate-400">Based on time of the year</span>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {popularThemes.slice(0, 4).map((theme) => {
          const isSelected = currentTheme.id === theme.id;
          const isHalloween = theme.id === 'halloween-party';
          const isBeach = theme.id === 'beach-party';

          return (
            <div
              key={theme.id}
              onClick={() => handleSelect(theme)}
              className={`relative rounded-xl p-2 cursor-pointer transition-all duration-200 group flex flex-col overflow-hidden ${
                isSelected
                  ? 'bg-[#1e1d3e] ring-2 ring-purple-500 shadow-lg shadow-purple-900/30'
                  : 'bg-[#181932] border border-[#2b2d4c] hover:border-purple-400/50 hover:bg-[#1f203d]'
              }`}
            >
              {/* Image thumbnail */}
              <div className="h-24 w-full rounded-lg overflow-hidden relative bg-[#101124] mb-2">
                {isHalloween ? (
                  <img
                    src="/assets/aistudio/Halloween_d7e01516.png"
                    alt={theme.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : isBeach ? (
                  <img
                    src="/assets/aistudio/Beach_Party_e48b471d.png"
                    alt={theme.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src="/assets/aistudio/Celebration_Themes_041b2e2f.png"
                      alt={theme.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute inset-0 mix-blend-color opacity-30"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                  </div>
                )}

                {/* Selected Checkmark Badge matching screenshot */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-purple-600 border border-white text-white flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                <div className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-semibold text-amber-300">
                  {theme.season}
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="px-1 pb-1">
                <div className="font-bold text-xs text-white truncate group-hover:text-amber-300 transition-colors">
                  {theme.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5 leading-tight">
                  {theme.tagline}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
