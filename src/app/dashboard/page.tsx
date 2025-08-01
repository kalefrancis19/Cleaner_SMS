'use client';

import React, { useState } from 'react';
import { 
  Home, 
  List, 
  MessageCircle, 
  User, 
  Bell, 
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Square,
  Plus,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'chat') {
      router.push('/chat');
    }
  };

  const mockTasks = [
    {
      id: '1',
      title: 'Kitchen Deep Clean',
      property: '123 Main St, Apt 4B',
      status: 'pending',
      estimatedTime: '2 hours',
      priority: 'high',
      scheduledTime: '2024-01-16T10:00:00Z'
    },
    {
      id: '2',
      title: 'Bathroom Sanitization',
      property: '456 Oak Ave, Unit 7',
      status: 'in_progress',
      estimatedTime: '1.5 hours',
      priority: 'medium',
      scheduledTime: '2024-01-15T14:00:00Z'
    },
    {
      id: '3',
      title: 'Living Room Refresh',
      property: '789 Pine St, House 12',
      status: 'completed',
      estimatedTime: '1 hour',
      priority: 'low',
      scheduledTime: '2024-01-14T16:00:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-200';
      case 'in_progress': return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-200';
      case 'completed': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-200';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 dark:from-gray-900/30 dark:to-slate-900/30 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl px-6 py-6 shadow-lg border-b border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              Welcome back, Sarah 👋
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="relative p-3 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
            </button>
            <button 
              onClick={() => router.push('/profile')}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <span className="text-white font-semibold text-lg">S</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Today's Tasks</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">5</p>
                <p className="text-green-500 text-xs font-medium">+2 from yesterday</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <List className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Hours Today</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">8.5</p>
                <p className="text-blue-500 text-xs font-medium">+1.2 from yesterday</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Task */}
      <div className="px-6 mb-6">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-blue-200/50 dark:border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Current Task</h3>
            <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
              In Progress
            </span>
          </div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Bathroom Sanitization
          </h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            456 Oak Ave, Unit 7
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <Play className="w-4 h-4" />
                <span className="font-semibold">Continue</span>
              </button>
              <button className="flex items-center space-x-2 bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200">
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-300">Time Left</p>
              <p className="font-bold text-gray-900 dark:text-white text-lg">45 min</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="px-6 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Today's Tasks</h3>
          <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <Plus className="w-4 h-4" />
            <span className="font-semibold">New</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {mockTasks.map((task) => (
            <div key={task.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-200 transform hover:scale-[1.02]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                    {task.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{task.property}</span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">{task.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-300">
                        {formatTime(task.scheduledTime)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-3">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className={`text-xs font-bold ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Start Task
                </button>
                <button className="p-3 text-gray-400 hover:text-blue-500 bg-white/50 dark:bg-gray-700/50 rounded-2xl hover:shadow-lg transition-all duration-200">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-t border-white/20 px-6 py-4">
        <div className="flex items-center justify-around">
          <button 
            onClick={() => handleTabChange('dashboard')}
            className={`flex flex-col items-center space-y-1 p-2 rounded-2xl transition-all duration-200 ${
              activeTab === 'dashboard' 
                ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' 
                : 'text-gray-400 hover:text-blue-500'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => handleTabChange('tasks')}
            className={`flex flex-col items-center space-y-1 p-2 rounded-2xl transition-all duration-200 ${
              activeTab === 'tasks' 
                ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' 
                : 'text-gray-400 hover:text-blue-500'
            }`}
          >
            <List className="w-6 h-6" />
            <span className="text-xs font-medium">Tasks</span>
          </button>
          <button 
            onClick={() => handleTabChange('chat')}
            className={`flex flex-col items-center space-y-1 p-2 rounded-2xl transition-all duration-200 ${
              activeTab === 'chat' 
                ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' 
                : 'text-gray-400 hover:text-blue-500'
            }`}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-medium">Chat</span>
          </button>
          <button 
            onClick={() => handleTabChange('profile')}
            className={`flex flex-col items-center space-y-1 p-2 rounded-2xl transition-all duration-200 ${
              activeTab === 'profile' 
                ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' 
                : 'text-gray-400 hover:text-blue-500'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
} 