import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    isLoading: false,
    token: localStorage.getItem('authToken') || null,
    error: null
  }),

  actions: {
    async login(username, password) {
      try {
        this.isLoading = true;
        this.error = null;
        
        // In production, implement real authentication
        throw new Error('Authentication not implemented in production');
      } catch (error) {
        console.error('Login error:', error);
        this.error = error.message;
        this.isLoading = false;
        throw error;
      }
    },

    logout() {
      this.isAuthenticated = false;
      this.token = null;
      localStorage.removeItem('authToken');
      this.isLoading = false;
      this.error = null;
    },

    // Initialize auth state
    initialize() {
      try {
        this.isLoading = true;
        this.error = null;
        
        // In development, automatically authenticate
        if (import.meta.env.DEV) {
          this.isAuthenticated = true;
          this.token = 'dev-token';
          localStorage.setItem('authToken', 'dev-token');
        } else {
          // In production, check token validity
          if (this.token) {
            this.isAuthenticated = true;
          } else {
            this.isAuthenticated = false;
          }
        }
        this.isLoading = false;
      } catch (error) {
        console.error('Auth initialization error:', error);
        this.error = error.message;
        this.isLoading = false;
      }
    }
  }
});
