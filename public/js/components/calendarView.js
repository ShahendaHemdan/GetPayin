import { formatDate } from '../utils.js';

export function renderCalendarView(posts) {
  const calendarContainer = document.getElementById('calendar-container');
  if (!calendarContainer) return;
  
  // Clear loading spinner
  calendarContainer.innerHTML = '';
  
  // Get current date
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  // Create calendar header with month navigation
  const calendarHeader = document.createElement('div');
  calendarHeader.className = 'd-flex align-items-center justify-content-between mb-3';
  calendarHeader.innerHTML = `
    <div>
      <button id="prev-month" class="btn btn-sm btn-outline-secondary">
        <i class="bi bi-chevron-left"></i>
      </button>
      <button id="next-month" class="btn btn-sm btn-outline-secondary ms-1">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
    <h4 id="calendar-title" class="m-0"></h4>
    <button id="today-button" class="btn btn-sm btn-outline-primary">Today</button>
  `;
  
  calendarContainer.appendChild(calendarHeader);
  
  // Create calendar grid
  const calendarGrid = document.createElement('div');
  calendarGrid.className = 'calendar-grid mt-3';
  calendarGrid.id = 'calendar-grid';
  calendarContainer.appendChild(calendarGrid);
  
  // Set current view date
  let currentViewDate = new Date(today);
  
  // Function to render the calendar
  function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Update calendar title
    const calendarTitle = document.getElementById('calendar-title');
    calendarTitle.textContent = new Intl.DateTimeFormat('en-US', { 
      month: 'long',
      year: 'numeric'
    }).format(date);
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Get the day of the week of the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Clear the grid
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';
    
    // Create the grid with days of the week
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekdaysRow = document.createElement('div');
    weekdaysRow.className = 'row mb-2';
    
    weekdays.forEach(day => {
      const dayCol = document.createElement('div');
      dayCol.className = 'col text-center fw-bold';
      dayCol.textContent = day;
      weekdaysRow.appendChild(dayCol);
    });
    
    calendarGrid.appendChild(weekdaysRow);
    
    // Create the days grid
    let dayCount = 1;
    let isWithinMonth = false;
    
    // Calculate the number of rows needed
    const totalDays = firstDayOfWeek + daysInMonth;
    const rows = Math.ceil(totalDays / 7);
    
    for (let row = 0; row < rows; row++) {
      const weekRow = document.createElement('div');
      weekRow.className = 'row g-1 mb-1';
      
      for (let col = 0; col < 7; col++) {
        const dayCol = document.createElement('div');
        dayCol.className = 'col';
        
        if ((row === 0 && col < firstDayOfWeek) || dayCount > daysInMonth) {
          // Empty cell
          dayCol.innerHTML = `<div class="calendar-day bg-light text-muted"></div>`;
        } else {
          // Current month date
          const currentDate = new Date(year, month, dayCount);
          const isToday = currentDate.toDateString() === today.toDateString();
          
          // Check if there are any posts for this day
          const postsOnThisDay = posts.filter(post => {
            const postDate = new Date(post.scheduledDate);
            return postDate.getDate() === dayCount && 
                   postDate.getMonth() === month && 
                   postDate.getFullYear() === year;
          });
          
          const hasEvents = postsOnThisDay.length > 0;
          
          // Determine the cell classes
          let dayCellClasses = 'calendar-day position-relative';
          if (isToday) dayCellClasses += ' border-primary';
          if (hasEvents) dayCellClasses += ' has-posts';
          
          // Create the day cell content
          let cellContent = `
            <div class="${dayCellClasses}" data-date="${year}-${month+1}-${dayCount}">
              <div class="d-flex justify-content-between align-items-center">
                <span class="${isToday ? 'fw-bold text-primary' : ''}">${dayCount}</span>
                ${hasEvents ? `<span class="badge bg-primary rounded-pill">${postsOnThisDay.length}</span>` : ''}
              </div>
          `;
          
          // Add up to 3 post indicators
          if (hasEvents) {
            cellContent += `<div class="mt-1">`;
            for (let i = 0; i < Math.min(postsOnThisDay.length, 3); i++) {
              const post = postsOnThisDay[i];
              cellContent += `
                <div class="small text-truncate">
                  <span class="badge bg-${post.status === 'published' ? 'success' : post.status === 'scheduled' ? 'primary' : 'secondary'} badge-sm"></span>
                  ${post.title.substring(0, 18)}${post.title.length > 18 ? '...' : ''}
                </div>
              `;
            }
            if (postsOnThisDay.length > 3) {
              cellContent += `<div class="small text-muted">+${postsOnThisDay.length - 3} more</div>`;
            }
            cellContent += `</div>`;
          }
          
          cellContent += `</div>`;
          dayCol.innerHTML = cellContent;
          
          // Add click event for days with posts
          if (hasEvents) {
            setTimeout(() => {
              const dayCell = dayCol.querySelector('.calendar-day');
              if (dayCell) {
                dayCell.style.cursor = 'pointer';
                dayCell.addEventListener('click', () => {
                  // Show a modal with posts for this day
                  showDayPostsModal(currentDate, postsOnThisDay);
                });
              }
            }, 0);
          }
          
          dayCount++;
        }
        
        weekRow.appendChild(dayCol);
      }
      
      calendarGrid.appendChild(weekRow);
    }
  }
  
  // Function to show a modal with posts for a specific day
  function showDayPostsModal(date, posts) {
    const modalId = 'dayPostsModal';
    
    // Remove existing modal if any
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
      existingModal.remove();
    }
    
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = modalId;
    modal.tabIndex = -1;
    
    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Posts for ${formatDate(date)}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="list-group">
              ${posts.map(post => `
                <a href="#/post/edit?id=${post.id}" class="list-group-item list-group-item-action">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-1">${post.title}</h6>
                      <p class="mb-1 text-muted small">${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
                      <div>
                        ${post.platforms.map(platform => 
                          `<span class="badge bg-secondary me-1">${platform}</span>`
                        ).join('')}
                      </div>
                    </div>
                    <div>
                      <span class="badge bg-${post.status === 'published' ? 'success' : post.status === 'scheduled' ? 'primary' : post.status === 'draft' ? 'secondary' : 'danger'}">
                        ${post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show the modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }
  
  // Initial render
  renderCalendar(currentViewDate);
  
  // Add event listeners for navigation
  document.getElementById('prev-month').addEventListener('click', () => {
    currentViewDate.setMonth(currentViewDate.getMonth() - 1);
    renderCalendar(currentViewDate);
  });
  
  document.getElementById('next-month').addEventListener('click', () => {
    currentViewDate.setMonth(currentViewDate.getMonth() + 1);
    renderCalendar(currentViewDate);
  });
  
  document.getElementById('today-button').addEventListener('click', () => {
    currentViewDate = new Date();
    renderCalendar(currentViewDate);
  });
}