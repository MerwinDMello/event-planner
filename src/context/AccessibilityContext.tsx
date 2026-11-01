import React, { createContext, useContext, useState, useEffect } from 'react';

export type TextScale = 'normal' | 'large' | 'xlarge';

interface AccessibilityContextType {
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  toggleHighContrast: () => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  toggleReducedMotion: () => void;
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  announcement: string;
  announce: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('a11y_high_contrast') === 'true';
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    const saved = localStorage.getItem('a11y_reduced_motion');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [textScale, setTextScale] = useState<TextScale>(() => {
    return (localStorage.getItem('a11y_text_scale') as TextScale) || 'normal';
  });

  const [announcement, setAnnouncement] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('a11y_high_contrast', String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('a11y_reduced_motion', String(reducedMotion));
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem('a11y_text_scale', textScale);
    document.documentElement.classList.remove('text-scale-normal', 'text-scale-large', 'text-scale-xlarge');
    document.documentElement.classList.add(`text-scale-${textScale}`);
  }, [textScale]);

  const announce = (message: string) => {
    setAnnouncement(message);
    // Auto-clear after 3 seconds so subsequent identical messages trigger re-announcement
    setTimeout(() => {
      setAnnouncement('');
    }, 3000);
  };

  const toggleHighContrast = () => setHighContrast((prev) => !prev);
  const toggleReducedMotion = () => setReducedMotion((prev) => !prev);

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        setHighContrast,
        toggleHighContrast,
        reducedMotion,
        setReducedMotion,
        toggleReducedMotion,
        textScale,
        setTextScale,
        announcement,
        announce,
      }}
    >
      {/* ARIA Live Region for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
