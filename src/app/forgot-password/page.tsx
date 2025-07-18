// File: src/app/forgot-password/page.tsx
// Version: v1 - Forgot password page with organization context

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

interface Organization {
  id: string;
  name: string;
  slug: string;
}

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const orgId = searchParams.get('org');
  const orgName = searchParams.get('orgName');
  const urlEmail = searchParams.get('email');
  
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orgId) {
      fetchOrganization(orgId);
    }
    if (urlEmail) {
      setEmail(urlEmail);
    }
  }, [orgId, urlEmail]);

  const fetchOrganization = async (id: string) => {
    const { data, error } = await supabase
      .from('tenants')
      .select('id, name, slug')
      .eq('id', id)
      .single();
    
    if (data) {
      setOrganization(data);
    }
  };

  const handleResetPassword = async () => {
    if (!email || !orgId) return;

    setLoading(true);
    setError('');

    try {
      const redirectParams = new URLSearchParams();
      if (orgId) redirectParams.set('org', orgId);
      if (orgName) redirectParams.set('orgName', orgName);
      
      const redirectUrl = `${window.location.origin}/reset-password${redirectParams.toString() ? `?${redirectParams.toString()}` : ''}`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!orgId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Request</h2>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid. Please start over from the sign-in page.
          </p>
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
          <div className="text-green-600 text-5xl mb-4">📧</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            If an account with that email exists for {orgName || organization?.name || 'this organization'}, we've sent you a password reset link.
          </p>
          <div className="space-y-3">
            <Link 
              href="/"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              className="block w-full text-blue-600 hover:text-blue-800 underline"
            >
              Send another reset email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="/voluntold-logo.png" 
                alt="Voluntold" 
                className="h-10 w-10"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h1 className="text-2xl font-bold text-gray-900">Voluntold</h1>
            </Link>
            <div className="text-sm text-gray-600">
              Password Reset
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Reset Your Password
            </h2>
            {(orgName || organization?.name) && (
              <p className="text-gray-600">
                For {orgName || organization?.name}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email address"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleResetPassword}
              disabled={loading || !email}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending Reset Email...' : 'Send Reset Email'}
            </button>
            
            <button
              onClick={() => {
                // Go back to auth page with context if we have it
                if (orgId && urlEmail) {
                  const params = new URLSearchParams();
                  params.set('email', urlEmail);
                  params.set('accessType', 'tenant_admin');
                  params.set('org', orgId);
                  if (orgName) params.set('orgName', orgName);
                  window.location.href = `/auth/login?${params.toString()}`;
                } else {
                  window.location.href = '/';
                }
              }}
              className="w-full text-center py-2 px-4 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Back to Sign In
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Enter the email address associated with your admin account and we'll send you a link to reset your password.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}