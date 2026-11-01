import { ArrowRight, Sparkles, CalendarPlus, MapPin } from 'lucide-react';
import { CelebrationTheme, UserRole } from '../types';

interface HeroBannerProps {
  currentTheme: CelebrationTheme;
  userRole: UserRole;
  onPlanEvent: () => void;
  onExploreTheme: () => void;
  onExploreMaps?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentTheme,
  userRole,
  onPlanEvent,
  onExploreTheme,
  onExploreMaps
}) => {
  // If the active theme is Halloween, use the attached Halloween image
  // If Beach Party, use the attached Beach image
  // Otherwise, use the Celebration Themes image or dynamic graphic
  const isHalloween = currentTheme.id === 'halloween-party';
  const isBeach = currentTheme.id === 'beach-party';

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#2b2d4c] bg-[#121326] min-h-[220px] md:min-h-[260px] shadow-2xl flex items-center">
      {/* Background image & gradient overlay */}
      <div className="absolute inset-0 z-0">
        {isHalloween ? (
          <img
            src="/assets/aistudio/Halloween_d7e01516.png"
            alt="Halloween Theme"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right md:object-center brightness-90 contrast-105"
          />
        ) : isBeach ? (
          <img
            src="/assets/aistudio/Beach_Party_e48b471d.png"
            alt="Beach Party Theme"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right md:object-center brightness-95"
          />
        ) : (
          <div className="relative w-full h-full">
            <img
              src="/assets/aistudio/Celebration_Themes_041b2e2f.png"
              alt={currentTheme.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top opacity-50 blur-[2px]"
            />
            {/* Thematic color ambient gradient overlay */}
            <div
              className="absolute inset-0 mix-blend-color"
              style={{ backgroundColor: currentTheme.accentColor, opacity: 0.25 }}
            />
          </div>
        )}

        {/* Cinematic gradient scrims to ensure high text contrast and exact look */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c16] via-[#0b0c16]/85 to-transparent md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c16]/90 via-transparent to-transparent" />
      </div>

      {/* Banner Content */}
      <div className="relative z-10 p-6 md:p-8 max-w-2xl">
        {/* Editorial Subtitle / Season Kicker */}
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="uppercase tracking-wider">
            {currentTheme.season} Season Special • {currentTheme.name}
          </span>
        </div>

        {/* Main Banner Headline */}
        {isHalloween ? (
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Welcome Back, Merwin!
            </h1>
            <h2 className="text-xl md:text-2xl font-bold mt-1 text-slate-100 flex items-center gap-2 flex-wrap">
              Let's plan something <span className="text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.6)]">spooktacular!</span>
            </h2>
            <p className="mt-2 text-xs md:text-sm text-slate-300 max-w-lg leading-relaxed">
              From themed parties to grand celebrations, we've got you covered.
            </p>
          </div>
        ) : isBeach ? (
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Make Waves with a Beach Party!
            </h1>
            <p className="mt-2 text-xs md:text-sm text-slate-300 max-w-lg leading-relaxed">
              Sun, sand, games and endless smiles for a celebration to remember.
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {currentTheme.heroHeadline}
            </h1>
            <p className="mt-2 text-xs md:text-sm text-slate-300 max-w-lg leading-relaxed">
              {currentTheme.heroSubtext}
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex items-center gap-3 flex-wrap">
          <button
            onClick={onPlanEvent}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs md:text-sm shadow-lg shadow-orange-500/25 transition-all transform active:scale-95 group cursor-pointer"
          >
            <span>{userRole === 'parent' ? 'Plan This Event' : 'List Festive Packages'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {onExploreMaps && (
            <button
              onClick={onExploreMaps}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-xs font-bold text-red-300 transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Find Venues on Maps</span>
            </button>
          )}

          <button
            onClick={onExploreTheme}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1b1c35]/80 hover:bg-[#252749] border border-[#34375b] text-xs font-semibold text-slate-200 transition-all cursor-pointer"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>Theme Ideas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
