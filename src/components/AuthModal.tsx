import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User, Sparkles, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { loginWithGoogle, registerWithEmail, loginWithEmail, resetPassword } = useApp();
  
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForms = () => {
    setEmail('');
    setPassword('');
    setName('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleToggleMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForms();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Display Name is required');
        if (password.length < 6) throw new Error('Password must be at least 6 characters long');
        await registerWithEmail(email, password, name);
        setSuccessMsg('Account registered successfully! Welcome aboard.');
        setTimeout(() => onClose(), 2000);
      } else if (mode === 'signin') {
        await loginWithEmail(email, password);
        setSuccessMsg('Signed in successfully! Redirecting...');
        setTimeout(() => onClose(), 1500);
      } else {
        await resetPassword(email);
        setSuccessMsg('Reset password link dispatched! Check your email inbox shortly.');
      }
    } catch (err: any) {
      if (err && err.message && err.message.includes('auth/operation-not-allowed')) {
        console.warn('Auth warning - provider not enabled in console', err);
      } else {
        console.error('Auth error', err);
      }
      // Give readable error message, check if Email password needs console activation notice
      let msg = err.message || 'An unexpected authentication exception has occurred';
      if (msg.includes('auth/operation-not-allowed')) {
        msg = "Email/Password Auth is not yet enabled in the Firebase Console. Go to Firebase Console -> Authentication -> Sign-In Method to activate it, or use the pre-configured Google Login below!";
      } else if (msg.includes('auth/invalid-credential')) {
        msg = "Invalid credentials. Please verify your email/password or use Google Sign-In.";
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = "This email is already registered. Try logging in or resetting your password.";
      }
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
      setSuccessMsg('Google Login succeeded! Welcome.');
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      console.error('Google Sign In error', err);
      let errMsg = err.message || 'Google Login has been cancelled or rejected.';
      if (err.code === 'auth/popup-closed-by-user' || errMsg.includes('popup-closed-by-user') || errMsg.includes('popup_closed_by_user')) {
        errMsg = "Google Login popup was blocked or closed (common inside sandboxed iframe previews). To bypass this, please register or login using the Email & Password form above, or click the 'Open in new window' button in the top-right of AI Studio to open the app in a new tab.";
      } else if (err.code === 'auth/cancelled-popup-request' || errMsg.includes('cancelled-popup-request')) {
        errMsg = "Popup was cancelled due to a conflict. Please retry or use the Email/Password options.";
      }
      setErrorMsg(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs font-sans px-4">
      {/* Absolute Backdrop Close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>
      
      {/* Modal Dialog */}
      <div className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-brand-100 z-10 animate-scale-up">
        
        {/* Header Block with Premium Accents */}
        <div className="relative bg-brand-900 text-white px-6 py-8">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-brand-300 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-1.5 text-xs text-brand-200 uppercase tracking-widest font-mono font-bold mb-1">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Smart Kitchen Store
          </div>
          
          <h2 className="text-2xl font-bold font-sans tracking-tight">
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-brand-200 text-xs mt-1">
            {mode === 'signin' && 'Sign in to access order tracking, wishlists, and addresses.'}
            {mode === 'signup' && 'Register now to start choosing smart kitchenwares.'}
            {mode === 'forgot' && 'Provide your email address to recover credential locks.'}
          </p>
        </div>

        {/* Content & Form Group */}
        <div className="px-6 py-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-800 text-xs p-3.5 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3.5 rounded-xl flex items-start gap-2.5">
              <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-500 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-800 font-sans">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="E.g. Chef John"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-brand-50/70 border border-brand-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 font-sans"
                  />
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-400" />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-brand-800 font-sans">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-50/70 border border-brand-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 font-sans"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-400" />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-brand-800 font-sans">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => handleToggleMode('forgot')}
                      className="text-[11px] text-brand-500 hover:text-brand-700 hover:underline font-mono"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-brand-50/70 border border-brand-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 font-sans"
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-brand-400" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-brand-300"
            >
              {submitting ? 'Please wait...' : (
                <>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Send Recovery Email'}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Sign-in divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest"><span className="bg-white px-3 text-brand-400">Or connected access</span></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-3 bg-white border border-brand-200 hover:bg-brand-50 text-brand-800 font-medium py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.86-4.53-6.16-4.53z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          {/* Helper Whitelist Info */}
          <div className="mt-6 border border-amber-200 bg-amber-50/70 p-3.5 rounded-2xl text-xs text-brand-800 leading-normal font-sans">
            <p className="font-semibold text-amber-800 mb-0.5">💡 Demo Whitelist Note:</p>
            The runtime user email is <strong className="font-mono text-[11px] bg-white/75 px-1 py-0.5 rounded border border-amber-100">ahemadkh832@gmail.com</strong>.
            Sign in via Google with this address to inherit <strong>Administrative rights</strong> automatically and operate the Admin console!
          </div>

          {/* Mode Switchers */}
          <div className="mt-8 text-center text-xs text-brand-500 font-sans">
            {mode === 'signin' && (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => handleToggleMode('signup')}
                  className="text-brand-600 font-semibold hover:underline"
                >
                  Create account
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already registered?{' '}
                <button
                  onClick={() => handleToggleMode('signin')}
                  className="text-brand-600 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <p>
                Remembered constraints?{' '}
                <button
                  onClick={() => handleToggleMode('signin')}
                  className="text-brand-600 font-semibold hover:underline"
                >
                  Sign back in
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
