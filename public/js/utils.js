// Format date for display
export function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

// Format date and time for display
export function formatDateTime(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

// Format date for input[type="date"]
export function formatDateForInput(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

// Format time for input[type="time"]
export function formatTimeForInput(dateString) {
  const date = new Date(dateString);
  return date.toTimeString().substring(0, 5); // Returns "HH:MM"
}

// Get status badge HTML
export function getStatusBadge(status) {
  const statusClasses = {
    draft: 'bg-secondary',
    scheduled: 'bg-primary',
    published: 'bg-success',
    failed: 'bg-danger'
  };
  
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);
  return `<span class="badge ${statusClasses[status] || 'bg-secondary'}">${statusText}</span>`;
}

// Get platform icon HTML
export function getPlatformIcon(platformId) {
  const platformIcons = {
    facebook: '<i class="bi bi-facebook"></i>',
    twitter: '<i class="bi bi-twitter"></i>',
    instagram: '<i class="bi bi-instagram"></i>',
    linkedin: '<i class="bi bi-linkedin"></i>'
  };
  
  return `<span class="platform-icon ${platformId}">${platformIcons[platformId] || ''}</span>`;
}

// Truncate text with ellipsis
export function truncateText(text, length = 100) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Show toast notification
export function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '5';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type} border-0`;
  toast.role = 'alert';
  toast.ariaLive = 'assertive';
  toast.ariaAtomic = 'true';
  
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  
  document.getElementById('toast-container').appendChild(toast);
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
  
  // Remove toast after it's hidden
  toast.addEventListener('hidden.bs.toast', () => {
    toast.remove();
  });
}

// Character counter for different platforms
export function updateCharacterCount(element, contentText, platformId) {
  if (!element) return;
  
  const platformLimits = {
    twitter: 280,
    facebook: 5000,
    instagram: 2200,
    linkedin: 3000
  };
  
  const limit = platformLimits[platformId] || 5000;
  const count = contentText.length;
  const remaining = limit - count;
  
  // Update counter text and color
  element.textContent = `${count}/${limit} characters`;
  
  // Add warning colors
  if (remaining < limit * 0.1) {
    element.classList.add('text-danger');
    element.classList.remove('text-warning');
  } else if (remaining < limit * 0.2) {
    element.classList.add('text-warning');
    element.classList.remove('text-danger');
  } else {
    element.classList.remove('text-danger', 'text-warning');
  }
  
  return count <= limit;
}