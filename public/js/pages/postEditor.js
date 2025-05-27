import { createLayout } from '../components/layout.js';
import { getPost, createPost, updatePost, getPlatforms } from '../api.js';
import { formatDateForInput, formatTimeForInput, showToast, updateCharacterCount } from '../utils.js';

export async function renderPostEditor(container, postId) {
  document.title = postId ? 'Edit Post - PostMaster' : 'New Post - PostMaster';
  
  // Create layout
  const layout = createLayout('dashboard');
  container.appendChild(layout);
  
  const mainContent = document.getElementById('main-content');
  
  // Show loading state
  mainContent.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0">${postId ? 'Edit Post' : 'Create New Post'}</h1>
      <a href="#/dashboard" class="btn btn-outline-secondary">
        <i class="bi bi-arrow-left me-2"></i>Back to Dashboard
      </a>
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
    
    // Load post data if editing
    let post = null;
    if (postId) {
      post = await getPost(parseInt(postId));
    }
    
    // Render the editor
    mainContent.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">${postId ? 'Edit Post' : 'Create New Post'}</h1>
        <a href="#/dashboard" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>Back to Dashboard
        </a>
      </div>
      
      <div class="card shadow-sm border-0">
        <div class="card-body p-4">
          <form id="post-form">
            <div class="mb-4">
              <label for="post-title" class="form-label">Title <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="post-title" placeholder="Enter post title" 
                  value="${post ? post.title : ''}" required>
              <div class="form-text">A title to help you identify this post (not published to platforms)</div>
            </div>
            
            <div class="mb-4">
              <label for="post-content" class="form-label">Content <span class="text-danger">*</span></label>
              <textarea class="form-control" id="post-content" rows="5" 
                  placeholder="What would you like to share?" required>${post ? post.content : ''}</textarea>
              <div class="d-flex justify-content-between mt-2">
                <div class="form-text">The content that will be published to selected platforms</div>
                <div id="character-counter" class="character-counter">0/280 characters</div>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="form-label d-block">Platforms <span class="text-danger">*</span></label>
              <div class="d-flex flex-wrap gap-3" id="platforms-container">
                ${platforms.map(platform => `
                  <div class="form-check form-check-inline platform-checkbox">
                    <input class="form-check-input platform-check" type="checkbox" id="platform-${platform.id}" 
                        value="${platform.id}" data-max-length="${platform.maxLength}"
                        ${post && post.platforms.includes(platform.id) ? 'checked' : ''}>
                    <label class="form-check-label d-flex align-items-center" for="platform-${platform.id}">
                      <span class="platform-icon ${platform.id} me-2">${getPlatformIcon(platform.id)}</span>
                      ${platform.name}
                    </label>
                  </div>
                `).join('')}
              </div>
              <div class="form-text">Select the platforms where you want to publish this post</div>
            </div>
            
            <div class="mb-4">
              <label for="post-image" class="form-label">Image</label>
              <input type="file" class="form-control" id="post-image" accept="image/*">
              <div class="form-text">Add an image to your post (optional)</div>
              
              ${post && post.image ? `
                <div class="mt-2" id="current-image-container">
                  <div class="d-flex align-items-center">
                    <img src="${post.image}" alt="Current post image" class="img-thumbnail" style="max-height: 100px;">
                    <button type="button" class="btn btn-sm btn-outline-danger ms-3" id="remove-image-btn">
                      <i class="bi bi-trash"></i> Remove
                    </button>
                  </div>
                </div>
              ` : ''}
              
              <div class="mt-2 d-none" id="image-preview-container">
                <img id="image-preview" class="img-thumbnail" style="max-height: 100px;">
              </div>
            </div>
            
            <div class="mb-4">
              <label class="form-label">Schedule <span class="text-danger">*</span></label>
              
              <div class="row g-3">
                <div class="col-md-6">
                  <input type="date" class="form-control" id="post-date" 
                      value="${post ? formatDateForInput(post.scheduledDate) : formatDateForInput(new Date())}" required>
                </div>
                <div class="col-md-6">
                  <input type="time" class="form-control" id="post-time" 
                      value="${post ? formatTimeForInput(post.scheduledDate) : '12:00'}" required>
                </div>
              </div>
              <div class="form-text">When should this post be published?</div>
            </div>
            
            <div class="mb-4">
              <label for="post-status" class="form-label">Status</label>
              <select class="form-select" id="post-status">
                <option value="draft" ${post && post.status === 'draft' ? 'selected' : ''}>Draft</option>
                <option value="scheduled" ${post && post.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
              </select>
              <div class="form-text">Draft posts won't be published automatically</div>
            </div>
            
            <div class="d-flex justify-content-between mt-4 pt-2">
              <button type="button" class="btn btn-outline-secondary" id="cancel-btn">Cancel</button>
              <div>
                <button type="submit" class="btn btn-primary px-4" id="save-button">
                  <span id="save-button-text">${postId ? 'Update Post' : 'Create Post'}</span>
                  <span id="save-button-spinner" class="spinner-border spinner-border-sm d-none" role="status"></span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
    
    // Function to get platform icon HTML
    function getPlatformIcon(platformId) {
      const platformIcons = {
        facebook: '<i class="bi bi-facebook"></i>',
        twitter: '<i class="bi bi-twitter"></i>',
        instagram: '<i class="bi bi-instagram"></i>',
        linkedin: '<i class="bi bi-linkedin"></i>'
      };
      
      return platformIcons[platformId] || '';
    }
    
    // Handle character counter
    const contentInput = document.getElementById('post-content');
    const characterCounter = document.getElementById('character-counter');
    const platformCheckboxes = document.querySelectorAll('.platform-check');
    
    function updateCounter() {
      const content = contentInput.value;
      
      // Find selected platform with the lowest character limit
      let minLimit = 5000; // Default large limit
      platformCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
          const limit = parseInt(checkbox.dataset.maxLength);
          if (limit < minLimit) {
            minLimit = limit;
          }
        }
      });
      
      // Update the counter with the appropriate limit
      updateCharacterCount(characterCounter, content, minLimit);
    }
    
    // Initial counter update
    updateCounter();
    
    // Event listeners
    contentInput.addEventListener('input', updateCounter);
    platformCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateCounter);
    });
    
    // Image preview functionality
    const imageInput = document.getElementById('post-image');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    
    imageInput.addEventListener('change', function(e) {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          imagePreview.src = e.target.result;
          imagePreviewContainer.classList.remove('d-none');
          
          // Hide current image if exists
          const currentImageContainer = document.getElementById('current-image-container');
          if (currentImageContainer) {
            currentImageContainer.classList.add('d-none');
          }
        };
        
        reader.readAsDataURL(e.target.files[0]);
      }
    });
    
    // Remove image button
    const removeImageBtn = document.getElementById('remove-image-btn');
    if (removeImageBtn) {
      removeImageBtn.addEventListener('click', function() {
        const currentImageContainer = document.getElementById('current-image-container');
        if (currentImageContainer) {
          currentImageContainer.classList.add('d-none');
        }
        
        // Clear the file input
        imageInput.value = '';
      });
    }
    
    // Form submission
    const postForm = document.getElementById('post-form');
    const saveButton = document.getElementById('save-button');
    const saveButtonText = document.getElementById('save-button-text');
    const saveButtonSpinner = document.getElementById('save-button-spinner');
    
    postForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate form
      const title = document.getElementById('post-title').value;
      const content = document.getElementById('post-content').value;
      const date = document.getElementById('post-date').value;
      const time = document.getElementById('post-time').value;
      const status = document.getElementById('post-status').value;
      
      // Get selected platforms
      const selectedPlatforms = [];
      platformCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
          selectedPlatforms.push(checkbox.value);
        }
      });
      
      if (!title || !content || !date || !time || selectedPlatforms.length === 0) {
        showToast('Please fill in all required fields', 'danger');
        return;
      }
      
      // Show loading state
      saveButton.disabled = true;
      saveButtonText.classList.add('d-none');
      saveButtonSpinner.classList.remove('d-none');
      
      try {
        // Create scheduled date
        const scheduledDate = new Date(`${date}T${time}`).toISOString();
        
        // Get image (in a real app, this would upload to server)
        let image = post && post.image ? post.image : null;
        
        // For demo purposes, just use stock photos
        const stockImages = [
          'https://images.pexels.com/photos/3773557/pexels-photo-3773557.png',
          'https://images.pexels.com/photos/935979/pexels-photo-935979.jpeg',
          'https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg',
          'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
          'https://images.pexels.com/photos/3182777/pexels-photo-3182777.jpeg'
        ];
        
        if (imageInput.files && imageInput.files[0]) {
          // In a real app, we would upload the file
          // For this demo, use a random stock image
          image = stockImages[Math.floor(Math.random() * stockImages.length)];
        }
        
        // Create or update post
        const postData = {
          title,
          content,
          image,
          platforms: selectedPlatforms,
          scheduledDate,
          status
        };
        
        if (postId) {
          await updatePost(postId, postData);
          showToast('Post updated successfully', 'success');
        } else {
          await createPost(postData);
          showToast('Post created successfully', 'success');
        }
        
        // Redirect to dashboard
        window.location.hash = '#/dashboard';
      } catch (error) {
        console.error('Failed to save post:', error);
        showToast('Failed to save post. Please try again.', 'danger');
        
        // Reset button state
        saveButton.disabled = false;
        saveButtonText.classList.remove('d-none');
        saveButtonSpinner.classList.add('d-none');
      }
    });
    
    // Handle cancel button
    const cancelBtn = document.getElementById('cancel-btn');
    cancelBtn.addEventListener('click', () => {
      window.location.hash = '#/dashboard';
    });
    
  } catch (error) {
    console.error('Failed to load post editor:', error);
    mainContent.innerHTML = `
      <div class="alert alert-danger">
        Failed to load post editor. Please try again later.
      </div>
    `;
  }
}