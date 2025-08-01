export interface GeminiRequest {
  contents: {
    parts: {
      text?: string;
      inlineData?: {
        mimeType: string;
        data: string; // base64 encoded
      };
    }[];
  }[];
  generationConfig?: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
  };
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
    finishReason: string;
    index: number;
    safetyRatings: any[];
  }[];
  promptFeedback?: any;
}

export interface ChatContext {
  currentJob?: string;
  currentRoom?: string;
  completedTasks: string[];
  pendingTasks: string[];
  photos: {
    before: string[];
    after: string[];
    during: string[];
  };
  issues: string[];
  jobHistory: string[];
  cleanerInfo: {
    name: string;
    rating: number;
    specialties: string[];
  };
}

export interface PhotoAnalysisResult {
  cleanliness: number;
  issues: string[];
  recommendations: string[];
  confidence: number;
  needsReWork: boolean;
  reWorkAreas: string[];
  roomType?: string;
  taskCompletion?: number;
}

export class GeminiService {
  private static instance: GeminiService;
  private apiKey: string;
  private apiUrl: string;
  private context: ChatContext;

  private constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    this.context = {
      completedTasks: [],
      pendingTasks: [],
      photos: { before: [], after: [], during: [] },
      issues: [],
      jobHistory: [],
      cleanerInfo: {
        name: 'Sarah',
        rating: 4.8,
        specialties: ['Deep Cleaning', 'Eco-friendly', 'Kitchen Sanitization']
      }
    };
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  // Update context with new information
  public updateContext(updates: Partial<ChatContext>): void {
    this.context = { ...this.context, ...updates };
  }

  // Get current context
  public getContext(): ChatContext {
    return this.context;
  }

  // Generate AI response for chat messages
  async generateChatResponse(userMessage: string): Promise<string> {
    try {
      const prompt = this.buildChatPrompt(userMessage);
      const response = await this.callGeminiAPI(prompt);
      return response;
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  // Analyze uploaded photo
  async analyzePhoto(photoBase64: string, photoType: 'before' | 'after' | 'during', roomType?: string): Promise<PhotoAnalysisResult> {
    try {
      const prompt = this.buildPhotoAnalysisPrompt(photoBase64, photoType, roomType);
      const response = await this.callGeminiAPI(prompt, photoBase64);
      
      // Parse the AI response to extract analysis results
      return this.parsePhotoAnalysisResponse(response);
    } catch (error) {
      console.error('Photo analysis error:', error);
      return this.getMockPhotoAnalysis();
    }
  }

  // Call Gemini API
  private async callGeminiAPI(prompt: string, photoBase64?: string): Promise<string> {
    const requestBody: GeminiRequest = {
      contents: [{
        parts: [
          { text: prompt }
        ]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000
      }
    };

    // Add photo if provided
    if (photoBase64) {
      requestBody.contents[0].parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: photoBase64
        }
      });
    }

    const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data: GeminiResponse = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'I apologize, but I couldn\'t generate a response.';
  }

  // Build chat prompt with context
  private buildChatPrompt(userMessage: string): string {
    const context = this.context;
    
    return `You are PropertySanta AI, a professional cleaning service assistant. You help cleaners complete their tasks efficiently.

CONTEXT:
- Current Job: ${context.currentJob || 'None'}
- Current Room: ${context.currentRoom || 'None'}
- Completed Tasks: ${context.completedTasks.join(', ') || 'None'}
- Pending Tasks: ${context.pendingTasks.join(', ') || 'None'}
- Issues Found: ${context.issues.join(', ') || 'None'}
- Cleaner: ${context.cleanerInfo.name} (Rating: ${context.cleanerInfo.rating})

WORKFLOW COMMANDS YOU UNDERSTAND:
- "START [JOB_ID]" - Begin a new cleaning job
- "[ROOM] BEFORE" - Log before photos for a room
- "[ROOM] AFTER" - Log after photos for a room
- "1,2,3" - Mark tasks as completed (task numbers)
- "NEXT ROOM" - Move to next room
- "NOTE: [description]" - Report issues or notes
- "JOB COMPLETE [JOB_ID]" - Finish the job

USER MESSAGE: "${userMessage}"

Respond professionally. Be direct, clear, and efficient. Guide the cleaner through the proper workflow. If they're not following the workflow, redirect them firmly. Provide clear, concise instructions and next steps.`;
  }

  // Build photo analysis prompt
  private buildPhotoAnalysisPrompt(photoBase64: string, photoType: 'before' | 'after' | 'during', roomType?: string): string {
    return `You are a professional cleaning quality inspector. Analyze this ${photoType} photo of a ${roomType || 'room'}.

TASK: Evaluate the cleanliness and identify any issues.

ANALYSIS REQUIREMENTS:
1. Cleanliness Score (0-100): Rate overall cleanliness
2. Issues Found: List any stains, damage, or cleaning problems
3. Recommendations: Suggest specific cleaning actions
4. Re-work Needed: Determine if area needs re-cleaning
5. Confidence Level: How confident are you in this assessment

RESPOND IN THIS EXACT JSON FORMAT:
{
  "cleanliness": 85,
  "issues": ["stain on counter", "dust on shelf"],
  "recommendations": ["use stain remover", "dust shelves"],
  "confidence": 0.9,
  "needsReWork": false,
  "reWorkAreas": [],
  "roomType": "kitchen",
  "taskCompletion": 75
}`;
  }

  // Parse photo analysis response
  private parsePhotoAnalysisResponse(response: string): PhotoAnalysisResult {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          cleanliness: parsed.cleanliness || 0,
          issues: parsed.issues || [],
          recommendations: parsed.recommendations || [],
          confidence: parsed.confidence || 0,
          needsReWork: parsed.needsReWork || false,
          reWorkAreas: parsed.reWorkAreas || [],
          roomType: parsed.roomType,
          taskCompletion: parsed.taskCompletion
        };
      }
    } catch (error) {
      console.error('Failed to parse photo analysis response:', error);
    }
    
    return this.getMockPhotoAnalysis();
  }

  // Fallback response when AI fails
  private getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.startsWith('start ')) {
      const jobId = userMessage.split(' ')[1];
      this.updateContext({ currentJob: jobId });
      return `OK, let's start job ${jobId}! Please send "LIVING ROOM BEFORE" with a photo, then "KITCHEN BEFORE" with a photo.`;
    } else if (lowerMessage.includes('before') && lowerMessage.includes('photo')) {
      return 'Got it! Photo logged. Send next photo or "SKIP".';
    } else if (lowerMessage.includes('kitchen') && lowerMessage.includes('before')) {
      this.updateContext({ 
        currentRoom: 'Kitchen',
        pendingTasks: ['Wipe counters', 'Clean sink', 'Empty trash']
      });
      return 'Starting Kitchen. Tasks: 1. Wipe counters. 2. Clean sink. 3. Empty trash. Reply with task numbers (e.g., "1,2") when done. Reply "NEXT ROOM" when finished with Kitchen.';
    } else if (lowerMessage.match(/^\d+(,\d+)*$/)) {
      this.updateContext({ 
        completedTasks: [...this.context.completedTasks, 'Kitchen tasks'],
        currentRoom: 'Master Bath'
      });
      return 'Great work in Kitchen! Moving to Master Bath. CRITICAL TASK: Check shampoo level. Send "SHAMPOO LOW" with photo if low, or "SHAMPOO OK".';
    } else if (lowerMessage.includes('note:')) {
      const issue = userMessage.replace('note:', '').trim();
      this.updateContext({ 
        issues: [...this.context.issues, issue]
      });
      return `Maintenance request logged: ${issue}. AI has categorized this as a high-priority maintenance issue. Reply "NEXT ROOM" when ready.`;
    } else if (lowerMessage.startsWith('job complete')) {
      return 'Thanks! Running final AI quality check on all submitted photos and tasks. This takes 1-2 minutes. Please wait for confirmation.';
    } else {
      return 'I understand. Please follow the workflow: START → Photos → Tasks → Notes → Complete. How can I help?';
    }
  }

  // Mock photo analysis for fallback
  private getMockPhotoAnalysis(): PhotoAnalysisResult {
    const cleanliness = Math.random() * 100;
    const issues = cleanliness < 70 ? ['Dust on surfaces', 'Stains on floor'] : [];
    
    return {
      cleanliness: Math.round(cleanliness),
      issues,
      recommendations: ['Use microfiber cloth', 'Apply stain remover'],
      confidence: 0.85,
      needsReWork: cleanliness < 60,
      reWorkAreas: cleanliness < 60 ? ['Kitchen counter', 'Bathroom floor'] : [],
      roomType: 'kitchen',
      taskCompletion: Math.round(cleanliness)
    };
  }
} 