// Admin panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Confirmation for destructive actions
  document.querySelectorAll('[data-confirm]').forEach(element => {
    element.addEventListener('click', function(e) {
      const message = this.dataset.confirm || 'Are you sure?';
      if (!confirm(message)) {
        e.preventDefault();
      }
    });
  });

  // Auto-resize textareas
  document.querySelectorAll('textarea[data-autoresize]').forEach(textarea => {
    textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });
  });

  // Tab functionality
  document.querySelectorAll('[data-tab-target]').forEach(tab => {
    tab.addEventListener('click', function() {
      const target = this.dataset.tabTarget;
      const tabContent = document.querySelectorAll('[data-tab-content]');
      const tabs = document.querySelectorAll('[data-tab-target]');

      // Hide all tab contents
      tabContent.forEach(content => {
        content.classList.add('hidden');
      });

      // Remove active state from all tabs
      tabs.forEach(t => {
        t.classList.remove('bg-primary-800');
        t.classList.add('hover:bg-primary-800');
      });

      // Show target content
      const targetContent = document.querySelector(`[data-tab-content="${target}"]`);
      if (targetContent) {
        targetContent.classList.remove('hidden');
      }

      // Set active state on clicked tab
      this.classList.add('bg-primary-800');
      this.classList.remove('hover:bg-primary-800');
    });
  });
});

// Toast notifications
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white ${
    type === 'success' ? 'bg-green-600' : 'bg-red-600'
  } shadow-lg z-50 animate-fade-in`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
