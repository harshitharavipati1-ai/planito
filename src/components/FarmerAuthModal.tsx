import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Lock, 
  Mail, 
  User, 
  MapPin, 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  ArrowRight,
  Database,
  Layers,
  ShieldAlert,
  Key,
  RefreshCw,
  Activity,
  FileText,
  Globe
} from 'lucide-react';
import { User as UserType, Language } from '../types';
import { SUPPORTED_LANGUAGES, getLanguageName } from '../utils/translations';

interface FarmerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType, preferredLang?: Language) => void;
  currentUser: UserType | null;
}

export const FarmerAuthModal: React.FC<FarmerAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'security'>('login');
  const [preferredLang, setPreferredLang] = useState<Language>('en');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [existingUsers, setExistingUsers] = useState<any[]>([]);

  // Security Logs & Metrics State
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [securityMetrics, setSecurityMetrics] = useState<any>(null);
  const [refreshingLogs, setRefreshingLogs] = useState(false);
  const [testedTokenInfo, setTestedTokenInfo] = useState<any>(null);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('ramesh.farmer@greengrow.ai');
  const [loginPassword, setLoginPassword] = useState('farmer123');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regLocation, setRegLocation] = useState('Guntur, Andhra Pradesh');
  const [regFarmSize, setRegFarmSize] = useState('5.0');

  useEffect(() => {
    if (isOpen) {
      const storedLang = (localStorage.getItem('greengrow_app_language') as Language) || 'en';
      setPreferredLang(storedLang);
      fetchExistingUsers();
      fetchSecurityLogs();
      // Check stored token
      const storedToken = localStorage.getItem('greengrow_auth_token');
      const storedSecurity = localStorage.getItem('greengrow_auth_security');
      if (storedToken && storedSecurity) {
        try {
          setTestedTokenInfo({
            token: storedToken.substring(0, 16) + '...' + storedToken.substring(storedToken.length - 8),
            security: JSON.parse(storedSecurity)
          });
        } catch (e) {}
      }
    }
  }, [isOpen]);

  const fetchExistingUsers = async () => {
    try {
      const res = await fetch('/api/auth/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setExistingUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch existing users from SQLite:', err);
    }
  };

  const fetchSecurityLogs = async () => {
    setRefreshingLogs(true);
    try {
      const res = await fetch('/api/auth/security-logs');
      const data = await res.json();
      if (data.success) {
        setSecurityLogs(data.securityLogs || []);
        setSecurityMetrics(data.metrics || null);
      }
    } catch (err) {
      console.error('Failed to fetch security logs:', err);
    } finally {
      setRefreshingLogs(false);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    if (!password) return { label: 'Not Entered', score: 0, color: 'bg-slate-200 text-slate-500' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1;

    switch (score) {
      case 0:
      case 1:
        return { label: 'Weak • Add numbers or letters', score: 1, color: 'bg-red-500 text-red-700 bg-red-100' };
      case 2:
        return { label: 'Moderate • Good basic protection', score: 2, color: 'bg-amber-500 text-amber-800 bg-amber-100' };
      case 3:
        return { label: 'Strong • PBKDF2 SHA-256 Ready', score: 3, color: 'bg-emerald-500 text-emerald-800 bg-emerald-100' };
      case 4:
      default:
        return { label: 'Military-Grade • 256-Bit Secure', score: 4, color: 'bg-teal-600 text-teal-800 bg-teal-100' };
    }
  };

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          role: 'FARMER'
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (data.token) {
          localStorage.setItem('greengrow_auth_token', data.token);
        }
        if (data.security) {
          localStorage.setItem('greengrow_auth_security', JSON.stringify(data.security));
        }
        localStorage.setItem('greengrow_app_language', preferredLang);
        const userWithLang = { ...data.user, preferredLanguage: preferredLang };
        setSuccessMessage(`Welcome back, ${data.user.name}! Verified SHA-256 Salted Password & set app language to ${getLanguageName(preferredLang)}.`);
        onLoginSuccess(userWithLang, preferredLang);
        fetchSecurityLogs();
        setTimeout(() => {
          onClose();
        }, 900);
      } else {
        setErrorMessage(data.error || 'Login failed. Please verify credentials.');
        fetchSecurityLogs();
      }
    } catch (err: any) {
      setErrorMessage('Network error connecting to SQLite database.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!regName.trim() || !regEmail.trim()) {
      setErrorMessage('Please enter both your name and email address.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword || 'farmer123',
          role: 'FARMER',
          location: regLocation,
          farmSizeAcres: Number(regFarmSize) || 4.0,
          phone: regPhone
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (data.token) {
          localStorage.setItem('greengrow_auth_token', data.token);
        }
        if (data.security) {
          localStorage.setItem('greengrow_auth_security', JSON.stringify(data.security));
        }
        localStorage.setItem('greengrow_app_language', preferredLang);
        const userWithLang = { ...data.user, preferredLanguage: preferredLang };
        setSuccessMessage(`Farmer account created for ${data.user.name}! Password salted & set app language to ${getLanguageName(preferredLang)}.`);
        onLoginSuccess(userWithLang, preferredLang);
        await fetchExistingUsers();
        await fetchSecurityLogs();
        setTimeout(() => {
          onClose();
        }, 1100);
      } else {
        setErrorMessage(data.error || 'Failed to register farmer account.');
      }
    } catch (err: any) {
      setErrorMessage('Network error while registering account.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (user: any) => {
    setLoginEmail(user.email);
    setLoginPassword('farmer123');
    setActiveTab('login');
    setErrorMessage(null);
  };

  const currentLoginPwStrength = calculatePasswordStrength(loginPassword);
  const currentRegPwStrength = calculatePasswordStrength(regPassword);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-emerald-100 overflow-hidden my-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/15 backdrop-blur-md rounded-xl border border-white/20 shadow-md">
              <ShieldCheck className="w-7 h-7 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold">Authentication Security & Farmer Auth</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                  PBKDF2 SHA-256 Protected
                </span>
              </div>
              <p className="text-xs text-emerald-100 flex items-center gap-1.5 mt-1">
                <Database className="w-3.5 h-3.5" />
                SQLite Engine • Salted Password Hashing • Brute-Force Lockout Shield
              </p>
            </div>
          </div>

          {/* Tab Selector (3 Tabs) */}
          <div className="grid grid-cols-3 gap-2 mt-6 bg-emerald-950/50 p-1.5 rounded-xl border border-emerald-500/30">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-xs transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-emerald-900 font-bold shadow-sm'
                  : 'text-emerald-100 hover:text-white hover:bg-white/5'
              }`}
            >
              <LogIn className="w-4 h-4 text-emerald-600" />
              <span>Farmer Login</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-xs transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-emerald-900 font-bold shadow-sm'
                  : 'text-emerald-100 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>Create Account</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('security'); setErrorMessage(null); setSuccessMessage(null); fetchSecurityLogs(); }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-xs transition-all ${
                activeTab === 'security'
                  ? 'bg-white text-emerald-900 font-bold shadow-sm'
                  : 'text-emerald-100 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Auth Security & Logs</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Authentication Security Notice</p>
                <p className="text-xs mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-800 text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Authentication Verified</p>
                <p className="text-xs mt-0.5 leading-relaxed">{successMessage}</p>
              </div>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Security Shield Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-600 text-white mt-0.5">
                  <Key className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-black">Military-Grade PBKDF2 / SHA-256 Salted Authentication</p>
                  <p className="text-black font-medium leading-relaxed">
                    Passwords are verified using SHA-256 salted hashes. Brute-force protection automatically locks accounts for 120s after 5 consecutive failed login attempts.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                  Farmer Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. ramesh.farmer@greengrow.ai"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black font-bold text-sm outline-none transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-black uppercase tracking-wider">
                    Account Password
                  </label>
                  <span className="text-[11px] font-bold text-black">
                    Auto-upgrade to PBKDF2 hash on login
                  </span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black font-bold text-sm outline-none transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                {/* Password Strength Indicator */}
                {loginPassword && (
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-black font-bold">Strength check:</span>
                    <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${currentLoginPwStrength.color}`}>
                      {currentLoginPwStrength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Language Preference for Overall Web Application */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Preferred Web Application Language *</span>
                  </label>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Sets App Language
                  </span>
                </div>
                <p className="text-[11px] text-black font-medium mb-2.5">
                  Your language selection will automatically translate navigation, buttons, and AI assistant voice across the entire GreenGrow web application.
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setPreferredLang(lang.code)}
                      className={`py-2 px-1.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                        preferredLang === lang.code
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm font-bold'
                          : 'bg-white border-slate-300 text-black hover:border-emerald-500 hover:bg-emerald-50/50'
                      }`}
                    >
                      <span className="text-sm font-bold text-black">{lang.nativeName}</span>
                      <span className="text-[10px] text-black font-semibold">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In with PBKDF2 Secure Auth</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Switch Registered Farmers from SQLite */}
              {existingUsers.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" />
                      SQLite Database Users (Quick Select)
                    </span>
                    <span className="text-xs text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                      {existingUsers.length} saved
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                    {existingUsers.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleQuickSelect(u)}
                        className="p-2.5 rounded-xl border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all flex flex-col justify-between bg-white"
                      >
                        <span className="font-bold text-xs text-black truncate">{u.name}</span>
                        <span className="text-[11px] text-black font-semibold truncate">{u.email}</span>
                        <span className="text-[10px] text-emerald-700 font-bold mt-1">
                          • {u.location || 'India'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-900 text-emerald-100 text-xs border border-emerald-800 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>
                  Your password will be encrypted with a unique 128-bit random salt and 10,000 PBKDF2 SHA-256 iterations before storage.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                    Full Farmer Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black font-bold text-sm outline-none transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. ramesh@greengrow.ai"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black font-bold text-sm outline-none transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                    Password (PBKDF2 Salted) *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black font-bold text-sm outline-none transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  {/* Real-time Password Strength Meter */}
                  <div className="mt-1.5">
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          currentRegPwStrength.score === 1
                            ? 'w-1/4 bg-red-500'
                            : currentRegPwStrength.score === 2
                            ? 'w-2/4 bg-amber-500'
                            : currentRegPwStrength.score === 3
                            ? 'w-3/4 bg-emerald-500'
                            : 'w-full bg-teal-600'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] text-black font-semibold mt-1 block">
                      Strength: <strong className="text-black">{currentRegPwStrength.label}</strong>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black font-bold text-sm outline-none transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                    Farm Location / District
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      placeholder="e.g. Guntur, Andhra Pradesh"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black font-bold text-sm outline-none transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5">
                    Farm Size (in Acres)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={regFarmSize}
                    onChange={(e) => setRegFarmSize(e.target.value)}
                    placeholder="e.g. 5.0"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-black font-bold text-sm outline-none transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Language Preference for Overall Web Application */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Preferred Web Application Language *</span>
                  </label>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Sets App Language
                  </span>
                </div>
                <p className="text-[11px] text-black font-medium mb-2.5">
                  Your language selection will automatically translate navigation, buttons, and AI assistant voice across the entire GreenGrow web application.
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setPreferredLang(lang.code)}
                      className={`py-2 px-1.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                        preferredLang === lang.code
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm font-bold'
                          : 'bg-white border-slate-300 text-black hover:border-emerald-500 hover:bg-emerald-50/50'
                      }`}
                    >
                      <span className="text-sm font-bold text-black">{lang.nativeName}</span>
                      <span className="text-[10px] text-black font-semibold">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5" />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create Secure Farmer Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: AUTHENTICATION SECURITY AUDIT & LOGS */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Top 3 Security Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Hashing Standard</span>
                    <Key className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-sm font-bold text-white">PBKDF2 SHA-256</p>
                  <p className="text-[10px] text-slate-400">10,000 rounds • 128-bit unique salt</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Brute-Force Guard</span>
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-sm font-bold text-white">120s Auto-Lockout</p>
                  <p className="text-[10px] text-slate-400">Triggered after 5 failed password attempts</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Session Tokens</span>
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                  </div>
                  <p className="text-sm font-bold text-white">256-Bit Cryptographic</p>
                  <p className="text-[10px] text-slate-400">Secure localStorage session token</p>
                </div>
              </div>

              {/* Current Active Session Token Verification Box */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    Current Session Security Status
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                    ACTIVE GUARD
                  </span>
                </div>
                {testedTokenInfo ? (
                  <div className="text-xs text-emerald-900 space-y-1">
                    <p><strong>Session Token Preview:</strong> <code className="bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800 font-mono">{testedTokenInfo.token}</code></p>
                    <p><strong>Encryption Method:</strong> {testedTokenInfo.security?.hashingMethod || 'PBKDF2-HMAC-SHA256'} (Salted)</p>
                    <p><strong>Brute-Force Shield:</strong> Active & Enabled</p>
                  </div>
                ) : (
                  <p className="text-xs text-emerald-800">
                    No active 256-bit session token in localStorage yet. Sign in or create a farmer account above to issue a cryptographic session token.
                  </p>
                )}
              </div>

              {/* Live Authentication Security Audit Log */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Live Authentication Security Audit Feed
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={fetchSecurityLogs}
                    disabled={refreshingLogs}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshingLogs ? 'animate-spin' : ''}`} />
                    <span>Refresh Logs</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {securityLogs.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No security audit logs recorded yet.</p>
                  ) : (
                    securityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                log.status === 'SUCCESS'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : log.status === 'WARNING'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {log.event}
                            </span>
                            <span className="font-semibold text-slate-800">{log.email}</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{log.details}</p>
                          <p className="text-[10px] text-slate-400">
                            IP: {log.ip} • {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 flex-shrink-0">
                          {log.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Security Engine: <strong className="text-slate-700">PBKDF2 SHA-256 + SQLite v22</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-slate-800 font-medium"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
