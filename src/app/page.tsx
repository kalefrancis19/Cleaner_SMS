'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Smartphone, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'error' | 'success'>('error');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [otpRequested, setOtpRequested] = useState(false);
  
  const router = useRouter();

  const showToastMessage = (message: string, type: 'error' | 'success' = 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    setOtpError('');
    
    let hasError = false;
    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    }
    
    if (loginMethod === 'password' && !password) {
      setPasswordError('Password is required');
      hasError = true;
    }
    
    if (loginMethod === 'otp' && !otp) {
      setOtpError('OTP is required');
      hasError = true;
    }
    
    if (hasError) {
      showToastMessage('Please fill in all required fields.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToastMessage('Login successful! Welcome back!', 'success');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      showToastMessage('Login failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOTP = async () => {
    if (!email) {
      setEmailError('Email is required');
      showToastMessage('Please enter your email first.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpRequested(true);
      showToastMessage('OTP sent to your email!', 'success');
    } catch (error) {
      showToastMessage('Failed to send OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          {/* Logo */}
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/25">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-bold">PS</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            PropertySanta
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
            Cleaner Portal
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/10 border border-white/20 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Welcome Back
          </h2>

          {/* Email Input */}
          <div className="mb-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
                  emailError 
                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:border-blue-500'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
              />
            </div>
            {emailError && (
              <p className="text-red-500 text-sm mt-2 ml-1">{emailError}</p>
            )}
          </div>

          {/* Password/OTP Input */}
          {loginMethod === 'password' ? (
            <div className="mb-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
                    passwordError 
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:border-blue-500'
                  } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mt-2 ml-1">{passwordError}</p>
              )}
            </div>
          ) : (
            <div className="mb-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Smartphone className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
                    otpError 
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:border-blue-500'
                  } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                />
              </div>
              {otpError && (
                <p className="text-red-500 text-sm mt-2 ml-1">{otpError}</p>
              )}
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 rounded-2xl mb-6 transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center group"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* OTP Request Button */}
          {loginMethod === 'otp' && !otpRequested && (
            <button
              onClick={handleRequestOTP}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-gray-300 font-medium py-3 rounded-2xl mb-6 transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-md"
            >
              Request OTP
            </button>
          )}

          {/* Switch Login Method */}
          <div className="text-center">
            <button
              onClick={() => {
                setLoginMethod(loginMethod === 'password' ? 'otp' : 'password');
                setOtpRequested(false);
                setOtp('');
              }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              {loginMethod === 'password' ? 'Login with OTP' : 'Login with Password'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Need help? <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Contact support</span>
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-6 left-6 right-6 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
          toastType === 'success' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400' 
            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-400'
        } animate-bounce-in z-50`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">{toastMessage}</span>
            <button 
              onClick={() => setShowToast(false)}
              className="ml-4 text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 