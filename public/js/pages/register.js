import { register } from '../auth.js';
import { showToast } from '../utils.js';

export function renderRegister(container) {
  document.title = 'Register - PostMaster';
  
  const registerContainer = document.createElement('div');
  registerContainer.className = 'container py-5';
  registerContainer.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4 p-md-5">
            <div class="text-center mb-4">
              <h1 class="h3 mb-3 fw-bold text-primary">
                <i class="bi bi-calendar-check-fill me-2"></i>PostMaster
              </h1>
              <p class="text-muted">Create a new account</p>
            </div>
            
            <form id="register-form">
              <div class="mb-3">
                <label for="name" class="form-label">Full Name</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person"></i></span>
                  <input type="text" class="form-control" id="name" placeholder="John Doe" required>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                  <input type="email" class="form-control" id="email" placeholder="name@example.com" required>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-lock"></i></span>
                  <input type="password" class="form-control" id="password" placeholder="••••••••" minlength="8" required>
                </div>
                <div class="form-text">Password must be at least 8 characters</div>
              </div>
              
              <div class="mb-4">
                <label for="password-confirm" class="form-label">Confirm Password</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-lock"></i></span>
                  <input type="password" class="form-control" id="password-confirm" placeholder="••••••••" required>
                </div>
              </div>
              
              <div class="d-grid mb-4">
                <button type="submit" id="register-button" class="btn btn-primary py-2">
                  <span id="register-button-text">Create Account</span>
                  <span id="register-button-spinner" class="spinner-border spinner-border-sm d-none" role="status"></span>
                </button>
              </div>
              
              <div class="text-center">
                <p class="mb-0">Already have an account? <a href="#/login" class="text-decoration-none">Sign in</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.appendChild(registerContainer);
  
  // Add event listeners
  const registerForm = document.getElementById('register-form');
  const registerButton = document.getElementById('register-button');
  const registerButtonText = document.getElementById('register-button-text');
  const registerButtonSpinner = document.getElementById('register-button-spinner');
  
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    
    if (password !== passwordConfirm) {
      showToast('Passwords do not match', 'danger');
      return;
    }
    
    // Show loading state
    registerButton.disabled = true;
    registerButtonText.classList.add('d-none');
    registerButtonSpinner.classList.remove('d-none');
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    try {
      await register(name, email, password);
      showToast('Account created successfully!', 'success');
      window.location.hash = '#/';
    } catch (error) {
      showToast(error.message || 'Registration failed. Please try again.', 'danger');
      
      // Reset button state
      registerButton.disabled = false;
      registerButtonText.classList.remove('d-none');
      registerButtonSpinner.classList.add('d-none');
    }
  });
}