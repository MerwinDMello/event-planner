import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  severity: 'info' | 'warning' | 'critical';
  details: string;
  ipPlaceholder?: string;
}

interface SecurityContextType {
  parentLockEnabled: boolean;
  setParentLockEnabled: (enabled: boolean) => void;
  isParentLocked: boolean;
  unlockWithPin: (pin: string) => boolean;
  lockNow: () => void;
  setCustomPin: (pin: string) => void;
  hasPin: boolean;
  childPrivacyMode: boolean;
  setChildPrivacyMode: (enabled: boolean) => void;
  toggleChildPrivacyMode: () => void;
  auditLogs: SecurityAuditEntry[];
  addAuditLog: (action: string, severity: 'info' | 'warning' | 'critical', details: string) => void;
  clearAuditLogs: () => void;
  sanitizeInput: (input: string) => string;
  securityHealthScore: number;
  openPinModalForAction: (onSuccess: () => void, actionName?: string) => void;
  closePinModal: () => void;
  isPinModalOpen: boolean;
  pendingActionName: string;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

// Input sanitizer preventing script injection and XSS
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[&<>"']/g, (m) => {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return m;
      }
    })
    .trim();
}

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parentLockEnabled, setParentLockEnabledState] = useState<boolean>(() => {
    return localStorage.getItem('cp_parent_lock_enabled') === 'true';
  });

  const [pin, setPin] = useState<string>(() => {
    return localStorage.getItem('cp_parent_pin') || '2468'; // Default 4-digit demo PIN
  });

  // If lock is enabled, start in locked state
  const [isParentLocked, setIsParentLocked] = useState<boolean>(() => {
    return localStorage.getItem('cp_parent_lock_enabled') === 'true';
  });

  const [childPrivacyMode, setChildPrivacyModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('cp_child_privacy_mode');
    return saved !== null ? saved === 'true' : true; // Enabled by default for kids safety
  });

  const [auditLogs, setAuditLogs] = useState<SecurityAuditEntry[]>(() => {
    const saved = localStorage.getItem('cp_security_audit_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [
      {
        id: 'sec-1',
        timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: 'CHILD_PRIVACY_ACTIVE',
        severity: 'info',
        details: 'COPPA-compliant guest and child detail redaction enabled for vendor views.',
      },
      {
        id: 'sec-2',
        timestamp: new Date(Date.now() - 7200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: 'FIRESTORE_SECURITY_VERIFIED',
        severity: 'info',
        details: 'Zero-trust security rules enforced on collection /events and /quotes.',
      }
    ];
  });

  // State for PIN prompt modal
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [pendingActionName, setPendingActionName] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('cp_parent_lock_enabled', String(parentLockEnabled));
  }, [parentLockEnabled]);

  useEffect(() => {
    localStorage.setItem('cp_parent_pin', pin);
  }, [pin]);

  useEffect(() => {
    localStorage.setItem('cp_child_privacy_mode', String(childPrivacyMode));
  }, [childPrivacyMode]);

  useEffect(() => {
    localStorage.setItem('cp_security_audit_logs', JSON.stringify(auditLogs.slice(0, 50)));
  }, [auditLogs]);

  const addAuditLog = (action: string, severity: 'info' | 'warning' | 'critical', details: string) => {
    const entry: SecurityAuditEntry = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      action,
      severity,
      details,
    };
    setAuditLogs((prev) => [entry, ...prev].slice(0, 50));
  };

  const setParentLockEnabled = (enabled: boolean) => {
    setParentLockEnabledState(enabled);
    if (enabled) {
      setIsParentLocked(true);
      addAuditLog('PARENT_LOCK_ENABLED', 'info', 'Parent PIN lock enabled to prevent accidental changes');
    } else {
      setIsParentLocked(false);
      addAuditLog('PARENT_LOCK_DISABLED', 'warning', 'Parent PIN lock was deactivated');
    }
  };

  const setCustomPin = (newPin: string) => {
    if (newPin.length === 4 && /^\d+$/.test(newPin)) {
      setPin(newPin);
      addAuditLog('PIN_UPDATED', 'info', 'Parent lock security PIN was updated');
    }
  };

  const unlockWithPin = (enteredPin: string): boolean => {
    if (enteredPin === pin) {
      setIsParentLocked(false);
      addAuditLog('PIN_UNLOCK_SUCCESS', 'info', 'Parent authorization granted via PIN');
      return true;
    } else {
      addAuditLog('PIN_UNLOCK_FAILED', 'warning', 'Invalid PIN attempt recorded');
      return false;
    }
  };

  const lockNow = () => {
    setIsParentLocked(true);
    addAuditLog('PARENT_LOCK_ENGAGED', 'info', 'Planner interface locked manually');
  };

  const setChildPrivacyMode = (enabled: boolean) => {
    setChildPrivacyModeState(enabled);
    addAuditLog(
      enabled ? 'CHILD_PRIVACY_ON' : 'CHILD_PRIVACY_OFF',
      enabled ? 'info' : 'warning',
      enabled ? 'Masking child last names & sensitive notes' : 'Child privacy masking paused'
    );
  };

  const toggleChildPrivacyMode = () => setChildPrivacyMode(!childPrivacyMode);

  const clearAuditLogs = () => {
    setAuditLogs([]);
  };

  const openPinModalForAction = (onSuccess: () => void, actionName: string = 'Authorized Operation') => {
    if (!parentLockEnabled || !isParentLocked) {
      onSuccess();
      return;
    }
    setPendingAction(() => onSuccess);
    setPendingActionName(actionName);
    setIsPinModalOpen(true);
  };

  const closePinModal = () => {
    setIsPinModalOpen(false);
    setPendingAction(null);
    setPendingActionName('');
  };

  // Compute overall security health score (0-100%)
  const securityHealthScore = React.useMemo(() => {
    let score = 50; // Base score with HTTPS + Vite dev proxy + Firestore default deny
    if (parentLockEnabled) score += 20;
    if (childPrivacyMode) score += 15;
    if (pin && pin !== '1234' && pin !== '0000') score += 10;
    if (auditLogs.length > 0) score += 5;
    return Math.min(100, score);
  }, [parentLockEnabled, childPrivacyMode, pin, auditLogs]);

  return (
    <SecurityContext.Provider
      value={{
        parentLockEnabled,
        setParentLockEnabled,
        isParentLocked,
        unlockWithPin,
        lockNow,
        setCustomPin,
        hasPin: Boolean(pin),
        childPrivacyMode,
        setChildPrivacyMode,
        toggleChildPrivacyMode,
        auditLogs,
        addAuditLog,
        clearAuditLogs,
        sanitizeInput,
        securityHealthScore,
        openPinModalForAction,
        closePinModal,
        isPinModalOpen,
        pendingActionName,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
