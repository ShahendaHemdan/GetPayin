import { login } from '../auth.js';
import { showToast } from '../utils.js';

export function renderLogin(container) {
  document.title = 'Login - PostMaster';
  
  const loginContainer = document.createElement('div');
  loginContainer.className = 'container py-5';
  loginContainer.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4 p-md-5">
            <div class="text-center mb-4">
              <h1 class="h3 mb-3 fw-bold text-primary">
                <i class="bi bi-calendar-check-fill me-2"></i>PostMaster
              </h1>
              <p class="text-muted">Sign in to your account</p>
            </div>
            
            <form id="login-form">
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                  <input type="email" class="form-control" id="email" placeholder="name@example.com" required>
                </div>
              </div>
              
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <label for="password" class="form-label mb-0">Password</label>
                  <a href="#" class="small text-decoration-none">Forgot password?</a>
                </div>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-lock"></i></span>
                  <input type="password" class="form-control" id="password" placeholder="••••••••" required>
                </div>
              </div>
              
              <div class="d-grid mb-4">
                <button type="submit" id="login-button" class="btn btn-primary py-2">
                  <span id="login-button-text">Sign In</span>
                  <span id="login-button-spinner" class="spinner-border spinner-border-sm d-none" role="status"></span>
                </button>
              </div>
              
              <div class="text-center">
                <p class="mb-0">Don't have an account? <a href="#/register" class="text-decoration-none">Sign up</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.appendChild(loginContainer);
  
  // Add event listeners
  const loginForm = document.getElementById('login-form');
  const loginButton = document.getElementById('login-button');
  const loginButtonText = document.getElementById('login-button-text');
  const loginButtonSpinner = document.getElementById('login-button-spinner');
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    loginButton.disabled = true;
    loginButtonText.classList.add('d-none');
    loginButtonSpinner.classList.remove('d-none');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      await login(email, password);
      showToast('Logged in successfully!', 'success');
      window.location.hash = '#/';
    } catch (error) {
      showToast(error.message || 'Login failed. Please try again.', 'danger');
      
      // Reset button state
      loginButton.disabled = false;
      loginButtonText.classList.remove('d-none');
      loginButtonSpinner.classList.add('d-none');
    }
  });
}