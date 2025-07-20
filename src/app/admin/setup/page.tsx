// File: src/app/admin/setup/[token]/page.tsx
// Version: v1
// Purpose: Password setup page for both invitations and password resets

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface TokenInfo {
  tokenType: 'invitation' | 'password_reset';
  adminInfo: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  tenant: {
    name: string;
    slug: string;
  };
  expiresAt: string;
}

export default function AdminPasswordSetupPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(`/api/admin/setup-password?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        setTokenInfo(data);
      } else {
        setError(data.error || 'Invalid or expired token');
      }
    } catch (err) {
      setError('Failed to validate token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/setup-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to sign-in page after a brief delay
        setTimeout(() => {
          router.push('/?admin=true');
        }, 3000);
      } else {
        setError(data.error || 'Failed to set password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 8) return { strength: 'weak', text: 'Too short' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score < 3) return { strength: 'weak', text: 'Weak' };
    if (score < 5) return { strength: 'medium', text: 'Medium' };
    return { strength: 'strong', text: 'Strong' };
  };

  const passwordStrength = password ? getPasswordStrength(password) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating invitation...</p>
        </div>
      </div>
    );
  }

  if (error && !tokenInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              href="/?admin=true" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {tokenInfo?.tokenType === 'invitation' ? 'Account Set Up!' : 'Password Reset!'}
            </h1>
            <p className="text-gray-600 mb-6">
              {tokenInfo?.tokenType === 'invitation' 
                ? 'Your admin account has been set up successfully.'
                : 'Your password has been reset successfully.'
              }
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Redirecting you to sign in...
            </p>
            <Link 
              href="/?admin=true" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenInfo) return null;

  const isInvitation = tokenInfo.tokenType === 'invitation';
  const expiresAt = new Date(tokenInfo.expiresAt);
  const timeUntilExpiry = expiresAt.getTime() - new Date().getTime();
  const hoursUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60 * 60));

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Voluntold</h1>
          <h2 className="text-2xl font-bold text-gray-900">
            {isInvitation ? 'Set Up Your Admin Account' : 'Reset Your Password'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isInvitation ? 'Welcome to ' : 'Reset password for '}
            <span className="font-semibold">{tokenInfo.tenant.name}</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {isInvitation ? 'Setting up account for:' : 'Resetting password for:'}
            </p>
            <p className="font-semibold text-gray-900">
              {tokenInfo.adminInfo.firstName && tokenInfo.adminInfo.lastName
                ? `${tokenInfo.adminInfo.firstName} ${tokenInfo.adminInfo.lastName}`
                : tokenInfo.adminInfo.email
              }
            </p>
            <p className="text-sm text-gray-500">{tokenInfo.adminInfo.email}</p>
          </div>

          {hoursUntilExpiry > 0 && (
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                This link expires in {hoursUntilExpiry} hour{hoursUntilExpiry !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your new password"
              />
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${
                          passwordStrength.strength === 'weak' ? 'bg-red-500 w-1/3' :
                          passwordStrength.strength === 'medium' ? 'bg-yellow-500 w-2/3' :
                          'bg-green-500 w-full'
                        }`}
                      />
                    </div>
                    <span 
                      className={`text-sm font-medium ${
                        passwordStrength.strength === 'weak' ? 'text-red-600' :
                        passwordStrength.strength === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}
                    >
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your new password"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting || password !== confirmPassword || password.length < 8}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Setting Password...
                  </div>
                ) : (
                  isInvitation ? 'Set Up Account' : 'Reset Password'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/?admin=true" 
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}