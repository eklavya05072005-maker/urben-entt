'use client';

import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { AdminUser } from '@/types';
import { loginAdminApi } from '@/lib/api';

interface AdminLoginProps {
  onSuccess: (user: AdminUser) => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginAdminApi(email, password);
      if (!result.success || !result.user) {
        setError(result.error || 'Authentication failed. Please verify your credentials.');
      } else {
        onSuccess(result.user);
      }
    } catch {
      setError('Connection error communicating with authentication service.');
    } finally {
      setIsLoading(false);
    }
  };

  const setRoleEmail = (roleEmail: string) => {
    setEmail(roleEmail);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111111] border border-white/10 p-6 sm:p-8 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-brand-red/10 border border-brand-red/30 rounded-full mb-3 text-brand-red">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">
            URBEN<span className="text-brand-red">.</span>ENTT
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 mt-1">
            PROTECTED OPERATIONS GATEWAY
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/70 border border-brand-red text-xs text-white flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-brand-red flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Authorized Operator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@urben.entt"
                className="w-full pl-9 pr-4 py-2.5 bg-[#080808] border border-white/15 focus:border-brand-red text-white text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-[#080808] border border-white/15 focus:border-brand-red text-white text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-brand-red hover:bg-brand-red-glow text-white text-xs font-bold font-mono uppercase tracking-widest transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <span>SIGN IN TO DASHBOARD</span>
            )}
          </button>
        </form>

        {/* Authorized Operator Roles Reference */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-2 text-center">
            Authorized Account Roles:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRoleEmail('owner@urben.entt')}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-zinc-300 uppercase hover:border-brand-red transition-colors text-left"
            >
              <span className="font-bold text-white block">OWNER ROLE</span>
              <span className="text-[9px] text-zinc-500 block truncate">Full Publishing Power</span>
            </button>

            <button
              type="button"
              onClick={() => setRoleEmail('admin@urben.entt')}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-zinc-300 uppercase hover:border-brand-red transition-colors text-left"
            >
              <span className="font-bold text-white block">EVENT ADMIN ROLE</span>
              <span className="text-[9px] text-zinc-500 block truncate">Draft & Review Only</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
