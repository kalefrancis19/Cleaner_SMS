'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Smartphone, 
  Camera, 
  Mic, 
  Paperclip,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Bot,
  Upload,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GeminiService } from '../../services/geminiService';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
  type: 'text' | 'photo' | 'command' | 'system';
  status?: 'sent' | 'delivered' | 'read';
  isCommand?: boolean;
  commandType?: 'start' | 'photo' | 'task' | 'complete' | 'note';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Welcome to PropertySanta! I\'m your AI assistant. Send "START [JOB_ID]" to begin a cleaning task.',
      sender: 'system',
      timestamp: new Date(),
      type: 'system'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [currentJob, setCurrentJob] = useState<string | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [currentTasks, setCurrentTasks] = useState<string[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string>('');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const geminiService = GeminiService.getInstance();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'system', type: ChatMessage['type'] = 'text', isCommand = false, commandType?: ChatMessage['commandType']): string => {
    const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newMessage: ChatMessage = {
      id: messageId,
      text,
      sender,
      timestamp: new Date(),
      type,
      isCommand,
      commandType
    };
    setMessages(prev => [...prev, newMessage]);
    return messageId;
  };

  const generateAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    try {
      // Update context with current state
      geminiService.updateContext({
        currentJob,
        completedTasks,
        photos: {
          before: uploadedPhotos.filter(photo => photo.includes('before')),
          after: uploadedPhotos.filter(photo => photo.includes('after')),
          during: uploadedPhotos.filter(photo => photo.includes('during'))
        }
      });

      // Get AI response
      const aiResponse = await geminiService.generateChatResponse(userMessage);
      
      // Update local state based on AI response
      updateStateFromResponse(userMessage, aiResponse);
      
      addMessage(aiResponse, 'system', 'system');
    } catch (error) {
      console.error('AI response error:', error);
      addMessage('I apologize, but I\'m having trouble processing your request. Please try again.', 'system', 'system');
    } finally {
      setIsTyping(false);
    }
  };

  const updateStateFromResponse = (userMessage: string, aiResponse: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.startsWith('start ')) {
      const jobId = userMessage.split(' ')[1];
      setCurrentJob(jobId);
      setCompletedTasks([]);
    } else if (lowerMessage.match(/^\d+(,\d+)*$/)) {
      // Task completion
      const taskNumbers = userMessage.split(',').map(num => parseInt(num.trim()));
      setCompletedTasks(prev => [...prev, ...taskNumbers.map(num => `task_${num}`)]);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Convert file to base64
      const base64 = await fileToBase64(file);
      
      // Set selected image for preview
      setSelectedImage(base64);
      setSelectedImageName(file.name);
      
    } catch (error) {
      console.error('Photo upload error:', error);
      addMessage('❌ Failed to upload photo. Please try again.', 'system', 'system');
    }
  };

  const handleSendWithImage = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage = inputText.trim();
    
    if (selectedImage) {
      // Add photo to uploaded list
      setUploadedPhotos(prev => [...prev, selectedImage]);
      
      // Show analyzing indicator
      setIsAnalyzingImage(true);
      
      // Analyze photo with AI
      const photoType = userMessage.toLowerCase().includes('before') ? 'before' : 
                       userMessage.toLowerCase().includes('after') ? 'after' : 'during';
      const roomType = currentRoom?.toLowerCase();
      
      try {
        const analysis = await geminiService.analyzePhoto(selectedImage, photoType, roomType);
        
        // Add analysis result
        addMessage(`📸 Photo analyzed! Cleanliness: ${analysis.cleanliness}% | Issues: ${analysis.issues.join(', ') || 'None'} | Recommendations: ${analysis.recommendations.join(', ')}`, 'system', 'system');
        
        // If re-work needed, add warning
        if (analysis.needsReWork) {
          addMessage(`⚠️ Re-work needed in: ${analysis.reWorkAreas.join(', ')}. Please address these areas before continuing.`, 'system', 'system');
        }
      } catch (error) {
        console.error('Photo analysis error:', error);
        addMessage('❌ Failed to analyze photo. Please try again.', 'system', 'system');
      } finally {
        setIsAnalyzingImage(false);
      }
    }

    if (userMessage) {
      addMessage(userMessage, 'user', 'text', true);
      await generateAIResponse(userMessage);
    }

    // Clear input and selected image
    setInputText('');
    setSelectedImage(null);
    setSelectedImageName('');
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setSelectedImageName('');
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/jpeg;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;

    if (selectedImage) {
      await handleSendWithImage();
    } else {
      const userMessage = inputText.trim();
      addMessage(userMessage, 'user', 'text', true);
      setInputText('');
      await generateAIResponse(userMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  const quickCommands = [
    { text: 'START 12345', command: 'start' },
    { text: 'MASTER BEDROOM BEFORE', command: 'photo' },
    { text: '1,2,3', command: 'task' },
    { text: 'NOTE: Leaky faucet', command: 'note' },
    { text: 'JOB COMPLETE 12345', command: 'complete' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 px-6 py-4 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                PropertySanta AI
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                SMS/WhatsApp Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Online</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-4 scroll-smooth">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'system' && (
                  <Bot className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {message.sender === 'user' && (
                      <div className="flex items-center space-x-1">
                        {message.status === 'sent' && <CheckCircle className="w-3 h-3" />}
                        {message.status === 'delivered' && <CheckCircle className="w-3 h-3" />}
                        {message.status === 'read' && <CheckCircle className="w-3 h-3" />}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/80 dark:bg-gray-800/80 px-4 py-3 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-blue-500" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isAnalyzingImage && (
          <div className="flex justify-start">
            <div className="bg-white/80 dark:bg-gray-800/80 px-4 py-3 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">🔍 Analyzing photo...</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Commands - Sticky Bottom */}
      <div className="sticky bottom-[88px] z-40 px-4 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {quickCommands.map((cmd, index) => (
            <button
              key={index}
              onClick={() => setInputText(cmd.text)}
              className="flex-shrink-0 px-3 py-2 bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
            >
              {cmd.text}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Image Preview - Sticky */}
      {selectedImage && (
        <div className="sticky bottom-[136px] z-30 px-4 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 p-3 bg-white/80 dark:bg-gray-700/80 rounded-2xl">
            <img 
              src={`data:image/jpeg;base64,${selectedImage}`} 
              alt="Selected" 
              className="w-12 h-12 object-cover rounded-xl"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedImageName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ready to send</p>
            </div>
            <button
              onClick={removeSelectedImage}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area - Sticky */}
      <div className="sticky bottom-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
            <Camera className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white rounded-2xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() && !selectedImage}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 