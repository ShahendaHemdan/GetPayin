import { createLayout } from '../components/layout.js';
import { getPlatforms, updatePlatform } from '../api.js';
import { showToast } from '../utils.js';
import { updateProfile, getCurrentUser } from '../auth.js';

export async function renderSettings(container) {
  document.title = 'Settings - PostMaster';
  
  // Create layout
  const layout = createLayout('settings');
  container.appendChild(layout);
  
  const mainContent = document.getElementById('main-content');
  
  // Show loading state
  mainContent.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0">Settings</h1>
    </div>
    
    <div class="d-flex justify-content-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
  
  try {
    // Load platforms
    const platforms = await getPlatforms();
    const user = getCurrentUser();
    
    // Render the settings page
    mainContent.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">Settings</h1>
      </div>
      
      <div class="row">
        <div class="col-lg-4 mb-4">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-transparent">
              <h5 class="card-title mb-0">Account Information</h5>
            </div>
            <div class="card-body">
              <form id="profile-form">
                <div class="mb-3">
                  <label for="name" class="form-label">Name</label>
                  <input type="text" class="form-control" id="name" value="${user.name}" required>
                </div>
                
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <input type="email" class="form-control" id="email" value="${user.email}" required>
                </div>
                
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary" id="save-profile-btn">
                    <span id="save-profile-text">Save Changes</span>
                    <span id="save-profile-spinner" class="spinner-border spinner-border-sm d-none" role="status"></span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div class="col-lg-8">
          <div class="card shadow-sm border-0">
            <div class="card-header bg-transparent">
              <h5 class="card-title mb-0">Social Media Platforms</h5>
              <p class="card-subtitle text-muted">Enable or disable platforms for your content</p>
            </div>
            <div class="card-body">
              <div id="platforms-container">
                ${platforms.map(platform => `
                  <div class="card mb-3 border">
                    <div class="card-body">
                      <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                          <div class="platform-icon ${platform.id} me-3">
                            <i class="bi bi-${platform.icon}"></i>
                          </div>
                          <div>
                            <h5 class="mb-0">${platform.name}</h5>
                            <p class="text-muted mb-0 small">Max ${platform.maxLength} characters</p>
                          </div>
                        </div>
                        <div class="form-check form-switch">
                          <input class="form-check-input platform-toggle" type="checkbox" id="platform-toggle-${platform.id}" 
                              data-platform-id="${platform.id}" ${platform.active ? 'checked' : ''}>
                          <label class="form-check-label" for="platform-toggle-${platform.id}">
                            ${platform.active ? 'Enabled' : 'Disabled'}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <div class="card shadow-sm border-0 mt-4">
            <div class="card-header bg-transparent">
              <h5 class="card-title mb-0">Danger Zone</h5>
            </div>
            <div class="card-body">
              <p class="text-muted">These actions are destructive and cannot be reversed.</p>
              
              <button type="button" class="btn btn-outline-danger">
                <i class="bi bi-trash me-2"></i>Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners for platform toggles
    const platformToggles = document.querySelectorAll('.platform-toggle');
    platformToggles.forEach(toggle => {
      toggle.addEventListener('change', async function(e) {
        const platformId = this.dataset.platformId;
        const isActive = this.checked;
        
        // Update the label
        const label = this.nextElementSibling;
        label.textContent = isActive ? 'Enabled' : 'Disabled';
        
        try {
          // Update the platform
          await updatePlatform(platformId, { active: isActive });
          showToast(`${isActive ? 'Enabled' : 'Disabled'} ${platformId} successfully`, 'success');
        } catch (error) {
          console.error('Failed to update platform:', error);
          showToast('Failed to update platform settings', 'danger');
          
          // Reset the toggle
          this.checked = !isActive;
          label.textContent = !isActive ? 'Enabled' : 'Disabled';
        }
      });
    });
    
    // Handle profile form submission
    const profileForm = document.getElementById('profile-form');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const saveProfileText = document.getElementById('save-profile-text');
    const saveProfileSpinner = document.getElementById('save-profile-spinner');
    
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Show loading state
      saveProfileBtn.disabled = true;
      saveProfileText.classList.add('d-none');
      saveProfileSpinner.classList.remove('d-none');
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      
      try {
        await updateProfile({ name, email });
        showToast('Profile updated successfully', 'success');
        
        // Reset button state
        saveProfileBtn.disabled = false;
        saveProfileText.classList.remove('d-none');
        saveProfileSpinner.classList.add('d-none');
      } catch (error) {
        console.error('Failed to update profile:', error);
        showToast('Failed to update profile. Please try again.', 'danger');
        
        // Reset button state
        saveProfileBtn.disabled = false;
        saveProfileText.classList.remove('d-none');
        saveProfileSpinner.classList.add('d-none');
      }
    });
    
  } catch (error) {
    console.error('Failed to load settings:', error);
    mainContent.innerHTML = `
      <div class="alert alert-danger">
        Failed to load settings. Please try again later.
      </div>
    `;
  }
}