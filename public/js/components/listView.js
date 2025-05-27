import { formatDateTime, getStatusBadge, getPlatformIcon } from '../utils.js';

export function renderListView(posts) {
  const postsContainer = document.getElementById('posts-container');
  if (!postsContainer) return;
  
  // Clear loading spinner
  postsContainer.innerHTML = '';
  
  if (posts.length === 0) {
    postsContainer.innerHTML = `
      <div class="alert alert-info">
        <i class="bi bi-info-circle me-2"></i>
        No posts found. Try changing your filters or <a href="#/post/new">create a new post</a>.
      </div>
    `;
    return;
  }
  
  // Create the table
  const table = document.createElement('div');
  table.className = 'table-responsive';
  table.innerHTML = `
    <table class="table table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>Title</th>
          <th>Platforms</th>
          <th>Scheduled For</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="posts-table-body"></tbody>
    </table>
  `;
  
  postsContainer.appendChild(table);
  
  const tableBody = document.getElementById('posts-table-body');
  
  posts.forEach(post => {
    const row = document.createElement('tr');
    
    // Create title cell with image preview
    const titleCell = document.createElement('td');
    titleCell.innerHTML = `
      <div class="d-flex align-items-center">
        ${post.image ? `
          <div class="me-3" style="width: 48px; height: 48px;">
            <img src="${post.image}" alt="${post.title}" class="img-fluid rounded" 
                style="width: 48px; height: 48px; object-fit: cover;">
          </div>
        ` : ''}
        <div>
          <h6 class="mb-0">${post.title}</h6>
          <small class="text-muted text-truncate d-inline-block" style="max-width: 200px;">
            ${post.content.substring(0, 60)}${post.content.length > 60 ? '...' : ''}
          </small>
        </div>
      </div>
    `;
    
    // Create platforms cell
    const platformsCell = document.createElement('td');
    platformsCell.innerHTML = `
      <div class="d-flex gap-1">
        ${post.platforms.map(platform => 
          `<span class="platform-icon ${platform}" title="${platform.charAt(0).toUpperCase() + platform.slice(1)}">
            ${getPlatformIcon(platform).replace('<span class="platform-icon ' + platform + '">', '')}
           </span>`
        ).join('')}
      </div>
    `;
    
    // Create scheduled date cell
    const dateCell = document.createElement('td');
    dateCell.innerHTML = `
      <div>
        <span class="d-none d-md-inline">
          ${formatDateTime(post.scheduledDate)}
        </span>
        <span class="d-md-none">
          ${new Date(post.scheduledDate).toLocaleDateString()}
        </span>
      </div>
    `;
    
    // Create status cell
    const statusCell = document.createElement('td');
    statusCell.innerHTML = getStatusBadge(post.status);
    
    // Create actions cell
    const actionsCell = document.createElement('td');
    actionsCell.className = 'text-end';
    actionsCell.innerHTML = `
      <div class="d-flex gap-1">
        <a href="#/post/edit?id=${post.id}" class="btn btn-sm btn-outline-primary">
          <i class="bi bi-pencil"></i>
          <span class="d-none d-md-inline ms-1">Edit</span>
        </a>
        <button data-id="${post.id}" class="btn btn-sm btn-outline-danger delete-post-btn">
          <i class="bi bi-trash"></i>
          <span class="d-none d-md-inline ms-1">Delete</span>
        </button>
      </div>
    `;
    
    // Append cells to row
    row.appendChild(titleCell);
    row.appendChild(platformsCell);
    row.appendChild(dateCell);
    row.appendChild(statusCell);
    row.appendChild(actionsCell);
    
    // Append row to table
    tableBody.appendChild(row);
  });
  
  // Add event listeners for delete buttons
  setTimeout(() => {
    const deleteButtons = document.querySelectorAll('.delete-post-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const postId = e.currentTarget.getAttribute('data-id');
        showDeleteConfirmation(postId);
      });
    });
  }, 0);
}

function showDeleteConfirmation(postId) {
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'delete-confirmation-modal';
  modal.tabIndex = -1;
  modal.setAttribute('aria-hidden', 'true');
  
  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirm Deletion</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Are you sure you want to delete this post? This action cannot be undone.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" id="confirm-delete-btn">Delete Post</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Show the modal
  const deleteModal = new bootstrap.Modal(modal);
  deleteModal.show();
  
  // Handle delete confirmation
  document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
    try {
      // In a real app, this would call the API
      import('../api.js').then(async ({ deletePost }) => {
        await deletePost(postId);
        
        // Hide and remove the modal
        deleteModal.hide();
        modal.addEventListener('hidden.bs.modal', () => {
          modal.remove();
          
          // Show success message
          import('../utils.js').then(({ showToast }) => {
            showToast('Post deleted successfully', 'success');
          });
          
          // Refresh the current page
          const currentHash = window.location.hash;
          window.location.hash = '#/temp';
          setTimeout(() => {
            window.location.hash = currentHash;
          }, 10);
        });
      });
    } catch (error) {
      console.error('Failed to delete post:', error);
      import('../utils.js').then(({ showToast }) => {
        showToast('Failed to delete post. Please try again.', 'danger');
      });
    }
  });
  
  // Clean up when the modal is hidden
  modal.addEventListener('hidden.bs.modal', () => {
    modal.remove();
  });
}