// File: src/app/reset-password/page.tsx
// Version: v1 - Password reset page with organization context

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

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const orgId = searchParams.get('org');
  const orgName = searchParams.get('orgName');
  
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    checkResetSession();
    if (orgId && !orgName) {
      fetchOrganization(orgId);
    }
  }, [orgId, orgName]);

  const checkResetSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      setIsValidSession(true);
    } else {
      // Check if we're in the middle of a password reset flow
      const { data, error } = await supabase.auth.getUser();
      if (data.user && !error) {
        setIsValidSession(true);
      }
    }
  };

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

  const handlePasswordReset = async () => {
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        
        // Redirect to admin dashboard after a short delay
        setTimeout(() => {
          if (orgId) {
            window.location.href = `/tenant?org=${orgId}`;
          } else {
            window.location.href = '/';
          }
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
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
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Password Updated!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully updated. 
            {(orgName || organization?.name) && ` You'll be redirected to ${orgName || organization?.name}'s admin dashboard.`}
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
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
              Set New Password
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Set New Password
            </h2>
            {(orgName || organization?.name) && (
              <p className="text-gray-600">
                For {orgName || organization?.name}
              </p>
            )}
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your new password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordReset()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your new password"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handlePasswordReset}
              disabled={loading || !password || !confirmPassword}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
            
            <Link
              href="/"
              className="block w-full text-center py-2 px-4 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Your password should be at least 6 characters long and secure.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}