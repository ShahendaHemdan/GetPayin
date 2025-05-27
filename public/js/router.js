import { renderLogin } from './pages/login.js';
import { renderRegister } from './pages/register.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderPostEditor } from './pages/postEditor.js';
import { renderSettings } from './pages/settings.js';
import { isAuthenticated } from './auth.js';

// Define routes
const routes = {
  '/': 'dashboard',
  '/login': 'login',
  '/register': 'register',
  '/dashboard': 'dashboard',
  '/post/new': 'postEditor',
  '/post/edit': 'postEditor',
  '/settings': 'settings'
};

// Route renderer function
function renderRoute(route) {
  const appElement = document.getElementById('app');
  
  // Clear previous content with a nice fade
  appElement.style.opacity = 0;
  
  setTimeout(() => {
    // Reset the content
    appElement.innerHTML = '';
    
    // Handle authentication
    if (!isAuthenticated() && route !== 'login' && route !== 'register') {
      window.location.hash = '#/login';
      return;
    }
    
    // Render the correct page
    switch (route) {
      case 'login':
        renderLogin(appElement);
        break;
      case 'register':
        renderRegister(appElement);
        break;
      case 'dashboard':
        renderDashboard(appElement);
        break;
      case 'postEditor':
        const postId = new URLSearchParams(window.location.search).get('id');
        renderPostEditor(appElement, postId);
        break;
      case 'settings':
        renderSettings(appElement);
        break;
      default:
        renderDashboard(appElement);
    }
    
    // Fade in the new content
    appElement.style.opacity = 1;
    appElement.style.transition = 'opacity 0.3s ease';
  }, 150);
}

export function setupRouter() {
  // Initial route
  let currentPath = window.location.hash.substring(1) || '/';
  if (!isAuthenticated() && currentPath !== '/login' && currentPath !== '/register') {
    currentPath = '/login';
    window.location.hash = '#/login';
  }
  
  const routeName = routes[currentPath] || 'dashboard';
  renderRoute(routeName);
  
  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    const path = window.location.hash.substring(1) || '/';
    const routeName = routes[path] || 'dashboard';
    renderRoute(routeName);
  });
  
  // Expose navigate function globally
  window.navigate = (path) => {
    window.location.hash = `#${path}`;
  };
}