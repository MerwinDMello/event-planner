import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  Palmtree,
  TreePine,
  Flame,
  Palette,
  Cake,
  Trees,
  Popcorn,
  Rocket,
  Tent,
  Trophy,
  Compass,
  Skull,
  Search,
  ListChecks,
  Gift
} from 'lucide-react';
import { CelebrationTheme, Season } from '../types';

interface ThemesExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  themes: CelebrationTheme[];
  currentTheme: CelebrationTheme;
  onSelectTheme: (theme: CelebrationTheme) => void;
  onPlanThisEvent: (theme: CelebrationTheme) => void;
}

export const ThemesExplorerModal: React.FC<ThemesExplorerModalProps> = ({
  isOpen,
  onClose,
  themes,
  currentTheme,
  onSelectTheme,
  onPlanThisEvent
}) => {
  const [selectedSeason, setSelectedSeason] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [activeThemeDetail, setActiveThemeDetail] = useState<CelebrationTheme | null>(null);

  if (!isOpen) return null;

  const seasons = ['All', 'Autumn', 'Winter', 'Spring', 'Summer', 'Year-round'];

  const filteredThemes = themes.filter((theme) => {
    const matchesSeason = selectedSeason === 'All' || theme.season === selectedSeason;
    const matchesSearch =
      theme.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      theme.tagline.toLowerCase().includes(searchFilter.toLowerCase()) ||
      theme.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSeason && matchesSearch;
  });

  const getThemeIcon = (iconName: string) => {
    const props = { className: 'w-4 h-4 text-white' };
    switch (iconName) {
      case 'Palmtree': return <Palmtree {...props} />;
      case 'TreePine': return <TreePine {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Palette': return <Palette {...props} />;
      case 'Cake': return <Cake {...props} />;
      case 'Trees': return <Trees {...props} />;
      case 'Popcorn': return <Popcorn {...props} />;
      case 'Rocket': return <Rocket {...props} />;
      case 'Tent': return <Tent {...props} />;
      case 'Trophy': return <Trophy {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Skull': return <Skull {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl rounded-3xl bg-[#0f1024] border border-[#27294d] shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header Matching Screenshot 3 */}
        <div className="px-6 py-5 border-b border-[#212344] bg-[#14152e] flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                12 Kids Celebration <span className="text-amber-400">Themes</span>
              </h2>
            </div>
            <p className="text-xs md:text-sm text-purple-300 font-medium italic mt-0.5">
              Turn any occasion into a magical celebration! ✨
            </p>
          </div>

          {/* Search & Close Button */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search themes..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-[#1e2040] border border-[#30335e] text-xs text-white rounded-full pl-9 pr-3 py-1.5 focus:outline-none focus:border-purple-400 w-44"
              />
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#1e2040] hover:bg-[#2c2f5a] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Season Filter Bar */}
        <div className="px-6 py-2.5 border-b border-[#1c1e3d] bg-[#11122a] flex items-center gap-2 overflow-x-auto shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          <span className="text-xs font-semibold text-slate-400 mr-2 shrink-0">Season:</span>
          {seasons.map((season) => (
            <button
              key={season}
              onClick={() => setSelectedSeason(season)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                selectedSeason === season
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1f2142]'
              }`}
            >
              {season}
            </button>
          ))}
        </div>

        {/* Themes Grid */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredThemes.map((theme) => {
              const isSelected = currentTheme.id === theme.id;
              const isHalloween = theme.id === 'halloween-party';
              const isBeach = theme.id === 'beach-party';

              return (
                <div
                  key={theme.id}
                  className={`group relative rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl overflow-hidden ${
                    isSelected
                      ? 'bg-[#1b1c3d] ring-2 ring-purple-500 shadow-purple-950/60'
                      : 'bg-[#15162f] border border-[#282a50] hover:border-purple-500/50 hover:bg-[#1a1b39]'
                  }`}
                >
                  <div>
                    {/* Visual Card Image */}
                    <div className="relative h-36 w-full rounded-xl overflow-hidden bg-[#0d0e20] mb-3">
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

                      {/* Season Pill on top left */}
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-amber-300">
                        {theme.season}
                      </span>

                      {/* Active Checkmark Pill on top right */}
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg border border-white/50">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    {/* Icon + Title + Tagline */}
                    <div className="flex items-start gap-2.5 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-md"
                        style={{ backgroundColor: theme.accentColor }}
                      >
                        {getThemeIcon(theme.iconName)}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                          {theme.name}
                        </h3>
                        <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
                          {theme.tagline}
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {theme.description}
                    </p>
                  </div>

                  {/* Actions: Details & Plan This Event */}
                  <div className="pt-2 border-t border-[#222445] flex items-center gap-2">
                    <button
                      onClick={() => setActiveThemeDetail(theme)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#212347] hover:bg-[#2b2e5c] text-[11px] font-semibold text-slate-300 transition-colors"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => {
                        onSelectTheme(theme);
                        onPlanThisEvent(theme);
                        onClose();
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition-transform active:scale-95 shadow-md shadow-orange-500/20"
                    >
                      <span>Plan This Event</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inspirational Footer Promo banner matching screenshot */}
          <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-[#20183d] via-[#1b1c3b] to-[#121327] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-purple-500 flex items-center justify-center text-2xl shadow-lg shadow-purple-900/40">
                ✨
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white">
                  Can't decide on a single theme?
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Combine elements! Many parents blend Beach & Carnival, or Space & Movie sleepovers with custom decor packages.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onPlanThisEvent(currentTheme);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shrink-0 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              Start Custom Celebration
            </button>
          </div>
        </div>
      </div>

      {/* Theme Detail Sub-Modal */}
      {activeThemeDetail && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl bg-[#14152d] border border-[#2e315b] p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: activeThemeDetail.accentColor }}
                >
                  {getThemeIcon(activeThemeDetail.iconName)}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">
                    {activeThemeDetail.name}
                  </h3>
                  <span className="text-xs text-amber-400 font-medium">
                    {activeThemeDetail.season} Season • {activeThemeDetail.funBadge}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveThemeDetail(null)}
                className="w-7 h-7 rounded-full bg-[#202246] hover:bg-[#2b2e5e] text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeThemeDetail.description}
            </p>

            {/* Checklist Ideas */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                <ListChecks className="w-3.5 h-3.5" />
                <span>Recommended Checklist</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 bg-[#0e0f22] p-3 rounded-xl border border-[#222447]">
                {activeThemeDetail.sampleChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Activities */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                <Gift className="w-3.5 h-3.5" />
                <span>Suggested Kids Activities</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeThemeDetail.suggestedActivities.map((act, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#202247] border border-[#2f3261] text-[11px] text-slate-200"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => {
                  onSelectTheme(activeThemeDetail);
                  setActiveThemeDetail(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#22254d] hover:bg-[#2c3063] text-xs font-semibold text-slate-200"
              >
                Set as Active Theme
              </button>
              <button
                onClick={() => {
                  onSelectTheme(activeThemeDetail);
                  onPlanThisEvent(activeThemeDetail);
                  setActiveThemeDetail(null);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs"
              >
                Plan This Event Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
