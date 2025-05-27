// Character counter functionality
import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.addEventListener('DOMContentLoaded', function () {
    const contentInput = document.getElementById('post-content');
    const characterCounter = document.getElementById('character-counter');

    if (contentInput && characterCounter) {
        function updateCounter() {
            const content = contentInput.value;
            const count = content.length;
            const limit = 280; // Twitter's limit

            characterCounter.textContent = `${count}/${limit} characters`;

            if (count > limit) {
                characterCounter.classList.add('text-danger');
                characterCounter.classList.remove('text-warning');
            } else if (count > limit * 0.8) {
                characterCounter.classList.add('text-warning');
                characterCounter.classList.remove('text-danger');
            } else {
                characterCounter.classList.remove('text-danger', 'text-warning');
            }
        }

        contentInput.addEventListener('input', updateCounter);
        updateCounter(); // Initial count
    }

    // Image preview functionality
    const imageInput = document.getElementById('post-image');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');

    if (imageInput && imagePreviewContainer && imagePreview) {
        imageInput.addEventListener('change', function (e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    imagePreviewContainer.classList.remove('d-none');
                };

                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    // Mobile sidebar toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const sidebar = document.getElementById('sidebar');

    if (navbarToggler && sidebar) {
        navbarToggler.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (event) => {
            const isClickInside = sidebar.contains(event.target) || navbarToggler.contains(event.target);
            if (!isClickInside && window.innerWidth < 768 && sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
            }
        });
    }
});

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
