// Mock authentication system (would connect to a real backend in production)

// Store for authentication state
let currentUser = null;

// Check if the user is already logged in
export function setupAuth() {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  }
}

// Check if the user is authenticated
export function isAuthenticated() {
  return currentUser !== null;
}

// Get the current user
export function getCurrentUser() {
  return currentUser;
}

// Log in a user
export async function login(email, password) {
  // In a real app, this would make an API call to a Laravel backend using Sanctum
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock successful login
      if (email && password) {
        currentUser = {
          id: 1,
          name: email.split('@')[0],
          email: email,
          token: 'mock-jwt-token-' + Math.random().toString(36).substring(2)
        };
        localStorage.setItem('user', JSON.stringify(currentUser));
        resolve(currentUser);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800); // Simulate network delay
  });
}

// Register a new user
export async function register(name, email, password) {
  // In a real app, this would make an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name && email && password) {
        currentUser = {
          id: 1,
          name: name,
          email: email,
          token: 'mock-jwt-token-' + Math.random().toString(36).substring(2)
        };
        localStorage.setItem('user', JSON.stringify(currentUser));
        resolve(currentUser);
      } else {
        reject(new Error('Please fill in all fields'));
      }
    }, 800);
  });
}

// Log out the current user
export function logout() {
  currentUser = null;
  localStorage.removeItem('user');
  window.location.hash = '#/login';
}

// Update user profile
export async function updateProfile(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentUser = { ...currentUser, ...data };
      localStorage.setItem('user', JSON.stringify(currentUser));
      resolve(currentUser);
    }, 800);
  });
}