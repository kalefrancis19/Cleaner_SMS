import { AuthState, User, LoginCredentials, OTPRequest } from '../types';
import { mockUser } from './mockData';

class AuthService {
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loginMethod: 'password'
  };

  // Simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Login with password
  async loginWithPassword(email: string, password: string): Promise<AuthState> {
    console.log('Attempting password login for:', email);
    
    await this.delay(1000); // Simulate API call

    if (email === mockUser.email && password === 'password') {
      const token = 'mock-jwt-token-' + Date.now();
      this.authState = {
        isAuthenticated: true,
        user: mockUser,
        token,
        loginMethod: 'password'
      };
      
      // Store in AsyncStorage (in real app)
      this.storeAuthState();
      
      return this.authState;
    } else {
      throw new Error('Invalid email or password');
    }
  }

  // Request OTP
  async requestOTP(email: string, phone?: string): Promise<boolean> {
    console.log('Requesting OTP for:', email, phone);
    
    await this.delay(1500); // Simulate API call

    if (email === mockUser.email) {
      // In real app, this would send OTP via SMS/email
      console.log('OTP sent to:', phone || email);
      return true;
    } else {
      throw new Error('Email not found');
    }
  }

  // Login with OTP
  async loginWithOTP(email: string, otp: string): Promise<AuthState> {
    console.log('Attempting OTP login for:', email);
    
    await this.delay(1000); // Simulate API call

    // Mock OTP validation (in real app, validate against server)
    if (email === mockUser.email && otp === '123456') {
      const token = 'mock-jwt-token-otp-' + Date.now();
      this.authState = {
        isAuthenticated: true,
        user: mockUser,
        token,
        loginMethod: 'otp'
      };
      
      this.storeAuthState();
      return this.authState;
    } else {
      throw new Error('Invalid OTP');
    }
  }

  // Logout
  async logout(): Promise<void> {
    console.log('Logging out user');
    
    this.authState = {
      isAuthenticated: false,
      user: null,
      token: null,
      loginMethod: 'password'
    };
    
    this.clearAuthState();
  }

  // Get current auth state
  getAuthState(): AuthState {
    return this.authState;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.authState.user;
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    return this.authState.user?.role === role;
  }

  // Check if user is cleaner
  isCleaner(): boolean {
    return this.hasRole('cleaner');
  }

  // Store auth state (in real app, use AsyncStorage)
  private storeAuthState(): void {
    // In real app: AsyncStorage.setItem('authState', JSON.stringify(this.authState));
    console.log('Auth state stored');
  }

  // Clear auth state (in real app, use AsyncStorage)
  private clearAuthState(): void {
    // In real app: AsyncStorage.removeItem('authState');
    console.log('Auth state cleared');
  }

  // Load auth state from storage (in real app, use AsyncStorage)
  async loadAuthState(): Promise<void> {
    // In real app: const stored = await AsyncStorage.getItem('authState');
    // if (stored) this.authState = JSON.parse(stored);
    console.log('Auth state loaded from storage');
  }

  // Refresh token (in real app)
  async refreshToken(): Promise<string | null> {
    if (!this.authState.token) return null;
    
    await this.delay(500);
    const newToken = 'mock-jwt-token-refreshed-' + Date.now();
    this.authState.token = newToken;
    this.storeAuthState();
    
    return newToken;
  }
}

export const authService = new AuthService();
export default authService; 