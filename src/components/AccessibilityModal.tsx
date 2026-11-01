import React from 'react';
import { X, Eye, Sliders, Type, Keyboard, Volume2, Check } from 'lucide-react';
import { useAccessibility, TextScale } from '../context/AccessibilityContext';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    textScale,
    setTextScale,
    announce,
  } = useAccessibility();

  if (!isOpen) return null;

  const fontOptions: { id: TextScale; label: string; sample: string }[] = [
    { id: 'normal', label: 'Default (100%)', sample: 'Aa' },
    { id: 'large', label: 'Large (112%)', sample: 'Aa' },
    { id: 'xlarge', label: 'Extra Large (125%)', sample: 'Aa' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#111228] border border-[#27294f] shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#212344] bg-[#161732] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 id="a11y-modal-title" className="text-base font-bold text-white">
                Accessibility & Vision Options
              </h2>
              <p className="text-xs text-slate-400">
                WCAG 2.1 AA Compliant settings for contrast, motion &amp; typography
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close accessibility options"
            className="w-8 h-8 rounded-full bg-[#202246] hover:bg-[#2b2e5e] text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* High Contrast Mode */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#171936] border border-[#2a2c50]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-sm">High Contrast Mode</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Enhances border borders, surface contrast, and text luminance for low-vision reading.
              </p>
            </div>
            <button
              onClick={() => {
                toggleHighContrast();
                announce(!highContrast ? 'High contrast mode enabled' : 'High contrast mode disabled');
              }}
              role="switch"
              aria-checked={highContrast}
              aria-label="Toggle high contrast mode"
              className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center cursor-pointer ${
                highContrast ? 'bg-purple-600 justify-end' : 'bg-[#2a2c50] justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#171936] border border-[#2a2c50]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-sm">Reduced Motion Mode</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Stops animations, confetti bursts, and transitions for users with vestibular sensitivity.
              </p>
            </div>
            <button
              onClick={() => {
                toggleReducedMotion();
                announce(!reducedMotion ? 'Reduced motion mode enabled' : 'Reduced motion mode disabled');
              }}
              role="switch"
              aria-checked={reducedMotion}
              aria-label="Toggle reduced motion mode"
              className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center cursor-pointer ${
                reducedMotion ? 'bg-purple-600 justify-end' : 'bg-[#2a2c50] justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Text Scaling */}
          <div className="p-3.5 rounded-2xl bg-[#171936] border border-[#2a2c50] space-y-2">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-white text-sm">Text Scaling</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Increases the size of all labels, menus, and table contents.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {fontOptions.map((opt) => {
                const isActive = textScale === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setTextScale(opt.id);
                      announce(`Text size set to ${opt.label}`);
                    }}
                    className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-900/50 border-purple-400 text-white font-bold ring-1 ring-purple-400'
                        : 'bg-[#12132a] border-[#292b4f] text-slate-300 hover:text-white hover:bg-[#1a1b38]'
                    }`}
                  >
                    <span className="text-sm font-bold block mb-0.5">{opt.sample}</span>
                    <span className="text-[10px] block text-slate-400">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Screen Reader Test Trigger */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#171936] border border-[#2a2c50]">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-bold text-white block">Screen Reader Announcement Test</span>
                <span className="text-[11px] text-slate-400">Triggers an immediate ARIA Live polite update</span>
              </div>
            </div>
            <button
              onClick={() => announce('Celebration Planner screen reader announcement verified successfully!')}
              className="px-3 py-1.5 rounded-xl bg-[#222448] hover:bg-[#2c3060] text-slate-200 text-xs font-semibold cursor-pointer"
            >
              Test Voice
            </button>
          </div>

          {/* Keyboard Shortcuts Cheatsheet */}
          <div className="p-3.5 rounded-2xl bg-[#14152a] border border-[#252749] space-y-2">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <Keyboard className="w-4 h-4 text-amber-400" />
              <span>Keyboard Navigation Guide</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0e0f22]">
                <span>Navigate controls:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#202244] text-amber-300 font-mono text-[10px]">Tab / Shift+Tab</kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0e0f22]">
                <span>Activate item:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#202244] text-amber-300 font-mono text-[10px]">Enter / Space</kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0e0f22]">
                <span>Close dialogs:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#202244] text-amber-300 font-mono text-[10px]">Escape</kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0e0f22]">
                <span>Skip to content:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#202244] text-amber-300 font-mono text-[10px]">Top of Page Tab</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#212344] bg-[#161732] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
