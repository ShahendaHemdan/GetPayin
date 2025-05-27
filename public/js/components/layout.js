import { logout, getCurrentUser } from '../auth.js';

// Create the main layout structure
export function createLayout(activeMenuItem = 'dashboard') {
  const user = getCurrentUser();
  const layout = document.createElement('div');
  layout.className = 'layout-container';
  
  // Create toast container
  const toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
  toastContainer.style.zIndex = '1050';
  
  // Create the navigation bar
  const navbar = document.createElement('nav');
  navbar.className = 'navbar navbar-expand-lg navbar-dark bg-primary sticky-top';
  navbar.innerHTML = `
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center" href="#/">
        <i class="bi bi-calendar-check-fill me-2"></i>
        PostMaster
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              <i class="bi bi-person-circle me-1"></i>
              ${user ? user.name : 'Account'}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#/settings"><i class="bi bi-gear me-2"></i>Settings</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><button id="logout-button" class="dropdown-item text-danger"><i class="bi bi-box-arrow-right me-2"></i>Log out</button></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  `;
  
  // Create the container for the main content
  const container = document.createElement('div');
  container.className = 'd-flex';
  
  // Create the sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'app-sidebar bg-light p-3';
  sidebar.id = 'sidebar';
  
  sidebar.innerHTML = `
    <div class="d-flex flex-column h-100">
      <div class="mb-4">
        <div class="d-grid gap-2 mb-3">
          <a href="#/post/new" class="btn btn-primary d-flex align-items-center justify-content-center">
            <i class="bi bi-plus-lg me-2"></i> New Post
          </a>
        </div>
        
        <div class="list-group">
          <a href="#/dashboard" class="sidebar-link ${activeMenuItem === 'dashboard' ? 'active' : ''}">
            <i class="bi bi-house-door"></i> Dashboard
          </a>
          <a href="#/settings" class="sidebar-link ${activeMenuItem === 'settings' ? 'active' : ''}">
            <i class="bi bi-gear"></i> Settings
          </a>
        </div>
      </div>
      
      <div class="mt-auto">
        <div class="sidebar-footer text-muted p-3 small">
          <p class="mb-1">© 2025 PostMaster</p>
          <p class="mb-0">Version 0.1.0</p>
        </div>
      </div>
    </div>
  `;
  
  // Create the main content area
  const main = document.createElement('div');
  main.className = 'flex-grow-1 py-4 px-4 page-container';
  main.id = 'main-content';
  
  // Append elements to the container
  container.appendChild(sidebar);
  container.appendChild(main);
  
  // Append elements to the layout
  layout.appendChild(navbar);
  layout.appendChild(container);
  layout.appendChild(toastContainer);
  
  // Add event listeners
  setTimeout(() => {
    // Logout button
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    }
    
    // Mobile sidebar toggle
    const navbarToggler = navbar.querySelector('.navbar-toggler');
    if (navbarToggler) {
      navbarToggler.addEventListener('click', () => {
        sidebar.classList.toggle('show');
      });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (event) => {
      const isClickInside = sidebar.contains(event.target) || navbarToggler.contains(event.target);
      if (!isClickInside && window.innerWidth < 768 && sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
      }
    });
  }, 0);
  
  return layout;
}