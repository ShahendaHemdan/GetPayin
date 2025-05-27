import { createLayout } from '../components/layout.js';
import { getPosts } from '../api.js';
import { formatDateTime, getStatusBadge, getPlatformIcon } from '../utils.js';
import { renderCalendarView } from '../components/calendarView.js';
import { renderListView } from '../components/listView.js';

export async function renderDashboard(container) {
  document.title = 'Dashboard - PostMaster';
  
  // Create layout
  const layout = createLayout('dashboard');
  container.appendChild(layout);
  
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0">Post Dashboard</h1>
      <a href="#/post/new" class="btn btn-primary">
        <i class="bi bi-plus-lg me-2"></i>New Post
      </a>
    </div>
    
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                <i class="bi bi-calendar-check text-primary fs-4"></i>
              </div>
              <div>
                <h6 class="text-muted mb-1">Scheduled Posts</h6>
                <h4 class="mb-0" id="scheduled-count">-</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                <i class="bi bi-check-circle text-success fs-4"></i>
              </div>
              <div>
                <h6 class="text-muted mb-1">Published Posts</h6>
                <h4 class="mb-0" id="published-count">-</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                <i class="bi bi-pencil-square text-warning fs-4"></i>
              </div>
              <div>
                <h6 class="text-muted mb-1">Draft Posts</h6>
                <h4 class="mb-0" id="draft-count">-</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-white border-bottom-0 py-3">
        <ul class="nav nav-tabs card-header-tabs" id="view-tabs">
          <li class="nav-item">
            <button class="nav-link active" id="calendar-tab" data-bs-toggle="tab" data-bs-target="#calendar-view">Calendar View</button>
          </li>
          <li class="nav-item">
            <button class="nav-link" id="list-tab" data-bs-toggle="tab" data-bs-target="#list-view">List View</button>
          </li>
        </ul>
      </div>
      
      <div class="card-body">
        <div class="tab-content">
          <div class="tab-pane fade show active" id="calendar-view">
            <div id="calendar-container" class="mb-3">
              <div class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="tab-pane fade" id="list-view">
            <div class="mb-3">
              <div class="row g-3">
                <div class="col-md-3">
                  <select id="status-filter" class="form-select">
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                
                <div class="col-md-3">
                  <select id="platform-filter" class="form-select">
                    <option value="">All Platforms</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                
                <div class="col-md-6">
                  <div class="d-flex gap-2">
                    <div class="input-group">
                      <span class="input-group-text">From</span>
                      <input type="date" id="date-from" class="form-control">
                    </div>
                    
                    <div class="input-group">
                      <span class="input-group-text">To</span>
                      <input type="date" id="date-to" class="form-control">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div id="posts-container">
              <div class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Load data and render views
  try {
    const posts = await getPosts();
    
    // Update counts
    document.getElementById('scheduled-count').textContent = posts.filter(p => p.status === 'scheduled').length;
    document.getElementById('published-count').textContent = posts.filter(p => p.status === 'published').length;
    document.getElementById('draft-count').textContent = posts.filter(p => p.status === 'draft').length;
    
    // Render calendar view
    renderCalendarView(posts);
    
    // Render list view
    renderListView(posts);
    
    // Setup filters
    const statusFilter = document.getElementById('status-filter');
    const platformFilter = document.getElementById('platform-filter');
    const dateFromFilter = document.getElementById('date-from');
    const dateToFilter = document.getElementById('date-to');
    
    async function applyFilters() {
      const filters = {
        status: statusFilter.value || undefined,
        platform: platformFilter.value || undefined,
        startDate: dateFromFilter.value || undefined,
        endDate: dateToFilter.value || undefined
      };
      
      const filteredPosts = await getPosts(filters);
      renderListView(filteredPosts);
    }
    
    // Add event listeners for filters
    statusFilter.addEventListener('change', applyFilters);
    platformFilter.addEventListener('change', applyFilters);
    dateFromFilter.addEventListener('change', applyFilters);
    dateToFilter.addEventListener('change', applyFilters);
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML += `
      <div class="alert alert-danger">
        Failed to load dashboard data. Please try again later.
      </div>
    `;
  }
}