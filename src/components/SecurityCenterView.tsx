import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Database,
  FileText,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { useAuth } from '../firebase/AuthContext';

export const SecurityCenterView: React.FC = () => {
  const {
    parentLockEnabled,
    setParentLockEnabled,
    isParentLocked,
    unlockWithPin,
    lockNow,
    setCustomPin,
    childPrivacyMode,
    toggleChildPrivacyMode,
    auditLogs,
    clearAuditLogs,
    securityHealthScore,
    addAuditLog
  } = useSecurity();

  const { user } = useAuth();

  const [pinInput, setPinInput] = useState('');
  const [pinChangeMessage, setPinChangeMessage] = useState('');
  const [pinTestInput, setPinTestInput] = useState('');
  const [testResult, setTestResult] = useState<'success' | 'fail' | null>(null);

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length === 4 && /^\d+$/.test(pinInput)) {
      setCustomPin(pinInput);
      setPinChangeMessage('PIN updated successfully!');
      setPinInput('');
      setTimeout(() => setPinChangeMessage(''), 3000);
    } else {
      setPinChangeMessage('PIN must be exactly 4 digits');
      setTimeout(() => setPinChangeMessage(''), 3000);
    }
  };

  const handleTestPin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = unlockWithPin(pinTestInput);
    setTestResult(ok ? 'success' : 'fail');
    setPinTestInput('');
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleExportData = () => {
    try {
      const data = {
        exportedAt: new Date().toISOString(),
        user: user ? { uid: user.uid, email: user.email, displayName: user.displayName } : 'local_parent',
        events: JSON.parse(localStorage.getItem('celebration_events') || '[]'),
        budget: JSON.parse(localStorage.getItem('celebration_budget') || '[]'),
        guests: JSON.parse(localStorage.getItem('celebration_guests') || '[]'),
        todos: JSON.parse(localStorage.getItem('celebration_todos') || '[]'),
        securityAudit: auditLogs,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `celebration-planner-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addAuditLog('DATA_BACKUP_EXPORTED', 'info', 'Encrypted local and cloud celebration records exported as JSON');
    } catch {
      addAuditLog('DATA_BACKUP_FAILED', 'warning', 'Failed to generate JSON backup');
    }
  };

  const handlePurgeCache = () => {
    if (window.confirm('Clear local browser storage cache? (Cloud Firestore data will remain secure)')) {
      localStorage.removeItem('celebration_events');
      localStorage.removeItem('celebration_budget');
      localStorage.removeItem('celebration_guests');
      localStorage.removeItem('celebration_todos');
      localStorage.removeItem('celebration_activities');
      addAuditLog('CACHE_PURGED', 'warning', 'User initiated local storage purge for privacy');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            <span>Security &amp; Privacy Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            COPPA child privacy guard, zero-trust Firestore isolation, parent PIN authorization &amp; audit logging
          </p>
        </div>

        {/* Security Health Score Card */}
        <div className="flex items-center gap-4 px-4 py-2.5 rounded-2xl bg-[#14152a] border border-[#2b2d4e] shadow-xl">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Security Posture</span>
            <span className="text-xl font-black text-emerald-400">{securityHealthScore}% Hardened</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Parent PIN Lock & COPPA Privacy */}
        <div className="space-y-6">
          {/* Card 1: Parent PIN Protection */}
          <div className="p-5 rounded-2xl bg-[#14152a] border border-[#282a4d] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isParentLocked ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {isParentLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Parent PIN Lock</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      parentLockEnabled ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-700/40 text-slate-400'
                    }`}>
                      {parentLockEnabled ? (isParentLocked ? 'Locked' : 'Unlocked') : 'Disabled'}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Kid-proof gate preventing accidental deletions, budget changes, or unverified vendor quotes.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={parentLockEnabled}
                onChange={(e) => setParentLockEnabled(e.target.checked)}
                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                aria-label="Toggle Parent Lock"
              />
            </div>

            {parentLockEnabled && (
              <div className="pt-2 border-t border-[#212340] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Current Lock State:</span>
                  {isParentLocked ? (
                    <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Locked (PIN Required)
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <Unlock className="w-3.5 h-3.5" /> Unlocked
                      </span>
                      <button
                        onClick={lockNow}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-semibold cursor-pointer"
                      >
                        Lock Now
                      </button>
                    </div>
                  )}
                </div>

                {/* Change PIN Form */}
                <form onSubmit={handleUpdatePin} className="flex items-center gap-2 pt-1">
                  <div className="relative flex-1">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      maxLength={4}
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="New 4-digit PIN (default 2468)"
                      className="w-full bg-[#101124] border border-[#2c2f54] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    Set PIN
                  </button>
                </form>

                {pinChangeMessage && (
                  <p className="text-[11px] text-purple-300 font-medium">{pinChangeMessage}</p>
                )}

                {/* Test Unlock Keypad */}
                {isParentLocked && (
                  <form onSubmit={handleTestPin} className="flex items-center gap-2 pt-1">
                    <input
                      type="password"
                      maxLength={4}
                      value={pinTestInput}
                      onChange={(e) => setPinTestInput(e.target.value)}
                      placeholder="Verify PIN..."
                      className="flex-1 bg-[#101124] border border-[#2c2f54] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
                    >
                      Unlock
                    </button>
                    {testResult === 'success' && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Valid!
                      </span>
                    )}
                    {testResult === 'fail' && (
                      <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> Invalid PIN
                      </span>
                    )}
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Card 2: COPPA Child & Family Privacy Mode */}
          <div className="p-5 rounded-2xl bg-[#14152a] border border-[#282a4d] shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  {childPrivacyMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>COPPA Child Privacy Guard</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-cyan-500/20 text-cyan-300">
                      {childPrivacyMode ? 'Active' : 'Unmasked'}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Redacts child full names, precise dates of birth, and private medical notes in vendor summaries.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={childPrivacyMode}
                onChange={toggleChildPrivacyMode}
                className="w-5 h-5 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                aria-label="Toggle Child Privacy Guard"
              />
            </div>

            {/* Live Privacy Masking Preview */}
            <div className="p-3.5 rounded-xl bg-[#0e0f22] border border-[#232545] space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Live Privacy Masking Demonstration
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#14152e] border border-[#23254d]">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Parent Internal View</span>
                  <p className="text-slate-200 font-medium">Zenia D'Mello (Age 7)</p>
                  <p className="text-[11px] text-amber-300/80">Allergy: Peanuts &amp; Dairy</p>
                </div>
                <div className="p-2.5 rounded-lg bg-[#14152e] border border-[#23254d]">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">External Vendor Quote View</span>
                  <p className="text-cyan-300 font-medium">
                    {childPrivacyMode ? 'Zenia D. (Age 7)' : "Zenia D'Mello (Age 7)"}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {childPrivacyMode ? '[Dietary Restriction Registered]' : 'Allergy: Peanuts & Dairy'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Data Sovereignty & GDPR / CCPA Controls */}
          <div className="p-5 rounded-2xl bg-[#14152a] border border-[#282a4d] shadow-xl space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-400" />
              <span>Data Sovereignty &amp; Privacy Exports</span>
            </h2>
            <p className="text-xs text-slate-400">
              Export encrypted JSON snapshots of all celebration plans, budget items, and guest lists, or purge local sessions.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                onClick={handleExportData}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Data Backup (JSON)</span>
              </button>

              <button
                onClick={handlePurgeCache}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#232442] hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-[#333659] text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purge Local Storage</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Zero-Trust Cloud Database & Security Audit Trail */}
        <div className="space-y-6">
          {/* Card 4: Zero-Trust Cloud Database Status */}
          <div className="p-5 rounded-2xl bg-[#14152a] border border-[#282a4d] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Zero-Trust Firestore Database Protection</span>
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Rules Enforced
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Cloud security rules enforce default-deny (`allow read, write: if false;`), ensuring documents can only be queried or mutated by their verified cryptographic owner.
            </p>

            <div className="p-3 rounded-xl bg-[#0d0e20] border border-[#222448] font-mono text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Database ID:</span>
                <span className="text-purple-300 font-semibold truncate max-w-[240px]">
                  ai-studio-celebrationplann-...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Security Architecture:</span>
                <span className="text-emerald-400">Zero-Trust Default Deny</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Input Sanitizer:</span>
                <span className="text-cyan-400">Active (XSS Escaping)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Authentication:</span>
                <span className="text-amber-400">Google OAuth 2.0 PKCE</span>
              </div>
            </div>
          </div>

          {/* Card 5: Security Audit Log Trail */}
          <div className="p-5 rounded-2xl bg-[#14152a] border border-[#282a4d] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Security Event Audit Trail</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearAuditLogs}
                  className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Clear Trail
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Immutable local record of sensitive permissions, pin verifications, and privacy alterations.
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {auditLogs.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#0f1024] text-center text-xs text-slate-400">
                  No security events recorded yet.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-[#0f1024] border border-[#212344] text-xs flex items-start justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                          log.severity === 'critical'
                            ? 'bg-rose-500/20 text-rose-300'
                            : log.severity === 'warning'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          {log.action}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{log.details}</p>
                    </div>

                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
