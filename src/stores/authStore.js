import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const isAuthenticated = computed(() => !!user.value);
  const isLoading = ref(false);
  const error = ref(null);

  // Mock login function - replace with actual authentication logic
  const login = async (credentials) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      // Mock authentication - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, accept any non-empty credentials
      if (credentials && credentials.email && credentials.password) {
        user.value = {
          uid: 'demo-user-123',
          email: credentials.email,
          displayName: credentials.email.split('@')[0],
          emailVerified: true
        };
        return user.value;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      error.value = err.message || 'Failed to login';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      isLoading.value = true;
      // Add any cleanup or API calls needed for logout
      await new Promise(resolve => setTimeout(resolve, 200));
      user.value = null;
    } catch (err) {
      error.value = 'Failed to logout';
      console.error('Logout error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Check authentication status
  const checkAuth = async () => {
    // In a real app, this would verify the authentication state
    // For now, we'll just return the current state
    return isAuthenticated.value;
  };

  // Initialize the auth store
  const initialize = async () => {
    try {
      isLoading.value = true;
      // In a real app, this would check for existing auth tokens/sessions
      // For now, we'll just check if there's a stored user session
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user.value = JSON.parse(storedUser);
      }
      return true;
    } catch (err) {
      console.error('Error initializing auth:', err);
      error.value = 'Failed to initialize authentication';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    logout,
    checkAuth,
    initialize
  };
});
