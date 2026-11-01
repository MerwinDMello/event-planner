import React, { useState } from 'react';
import { Lock, ShieldAlert, X, KeyRound, CheckCircle2 } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export const ParentLockModal: React.FC = () => {
  const { isPinModalOpen, closePinModal, unlockWithPin, pendingActionName } = useSecurity();
  const [enteredDigits, setEnteredDigits] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [success, setSuccess] = useState(false);

  if (!isPinModalOpen) return null;

  const handleDigitClick = (digit: string) => {
    if (enteredDigits.length < 4) {
      const next = enteredDigits + digit;
      setEnteredDigits(next);
      setErrorMsg('');

      if (next.length === 4) {
        const ok = unlockWithPin(next);
        if (ok) {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            setEnteredDigits('');
            closePinModal();
          }, 600);
        } else {
          setErrorMsg('Incorrect PIN. Default demo PIN is 2468.');
          setTimeout(() => setEnteredDigits(''), 800);
        }
      }
    }
  };

  const handleBackspace = () => {
    setEnteredDigits((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setEnteredDigits('');
    setErrorMsg('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="parent-lock-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-[#111228] border border-[#2d2f58] shadow-2xl p-6 text-center my-auto">
        {/* Close Button */}
        <button
          onClick={closePinModal}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#1e2042] hover:bg-[#2b2e5a] text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Close PIN prompt"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Icon Lockup */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/50 mb-3 text-white">
          {success ? <CheckCircle2 className="w-7 h-7 text-emerald-300 animate-bounce" /> : <Lock className="w-7 h-7" />}
        </div>

        <h2 id="parent-lock-modal-title" className="text-base font-bold text-white">
          Parent Authorization Required
        </h2>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          Enter your 4-digit PIN to authorize <span className="text-amber-400 font-medium">"{pendingActionName || 'Protected Operation'}"</span>
        </p>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = index < enteredDigits.length;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  isFilled
                    ? 'bg-purple-500 border-purple-400 scale-110 shadow-[0_0_10px_rgba(168,85,247,0.7)]'
                    : 'border-[#393b66] bg-[#161730]'
                }`}
              />
            );
          })}
        </div>

        {errorMsg && (
          <div className="text-xs text-rose-400 font-semibold mb-3 flex items-center justify-center gap-1.5 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigitClick(digit)}
              className="h-12 rounded-2xl bg-[#171836] hover:bg-[#232552] border border-[#2b2d56] text-white text-base font-bold shadow-md active:scale-95 transition-all cursor-pointer"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-2xl bg-[#171836] hover:bg-[#232552] border border-[#2b2d56] text-slate-400 text-xs font-semibold active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleDigitClick('0')}
            className="h-12 rounded-2xl bg-[#171836] hover:bg-[#232552] border border-[#2b2d56] text-white text-base font-bold active:scale-95 transition-all cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-12 rounded-2xl bg-[#171836] hover:bg-[#232552] border border-[#2b2d56] text-slate-400 text-xs font-semibold active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          >
            ⌫
          </button>
        </div>

        <div className="p-2.5 rounded-xl bg-[#0d0e20] border border-[#202242] text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <KeyRound className="w-3 h-3 text-amber-400" />
          <span>Demo Parent PIN: <strong>2468</strong></span>
        </div>
      </div>
    </div>
  );
};
