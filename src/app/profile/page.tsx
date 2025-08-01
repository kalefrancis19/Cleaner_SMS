'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Star,
  Settings,
  LogOut,
  Camera,
  Edit,
  Check,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  const mockUser = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@propertysanta.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    rating: 4.8,
    totalTasks: 156,
    totalHours: 892,
    joinDate: '2023-03-15',
    specialties: ['Deep Cleaning', 'Kitchen Sanitization', 'Bathroom Cleaning'],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Profile
          </h1>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500"
          >
            {isEditing ? <Check className="w-6 h-6" /> : <Edit className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 px-6 py-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">S</span>
            </div>
            {isEditing && (
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {mockUser.name}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {mockUser.rating}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                • {mockUser.totalTasks} tasks completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockUser.totalTasks}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tasks Completed
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockUser.totalHours}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Hours Worked
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Contact Information
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-300">Email</p>
                <p className="text-gray-900 dark:text-white">{mockUser.email}</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-300">Phone</p>
                <p className="text-gray-900 dark:text-white">{mockUser.phone}</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-300">Location</p>
                <p className="text-gray-900 dark:text-white">{mockUser.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Specialties
        </h3>
        <div className="flex flex-wrap gap-2">
          {mockUser.specialties.map((specialty, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Availability
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="grid grid-cols-7 gap-2">
            {Object.entries(mockUser.availability).map(([day, available]) => (
              <div key={day} className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                  {day.charAt(0).toUpperCase()}
                </p>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  available 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                }`}>
                  {available ? '✓' : '✗'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings & Logout */}
      <div className="px-6 py-4 flex-1">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <button className="w-full p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between text-left">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-gray-400" />
              <span className="text-gray-900 dark:text-white">Settings</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center space-x-3">
              <LogOut className="w-5 h-5 text-red-400" />
              <span className="text-red-500">Logout</span>
            </div>
            <span className="text-gray-400">›</span>
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to logout from your account?
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 