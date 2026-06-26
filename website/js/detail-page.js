// Detail Page JavaScript
// Handles markdown rendering and teaser display for detail pages

(function() {
  'use strict';

  // Initialize detail page
  function initDetailPage() {
    // Parse markdown content
    const contentElement = document.getElementById('page-content-markdown');
    if (contentElement) {
      const markdownText = contentElement.textContent.trim();
      contentElement.innerHTML = `<p>${window.parseMarkdown(markdownText)}</p>`;
    }

    // Render page teasers
    const teasersElement = document.getElementById('page-teasers');
    if (teasersElement) {
      try {
        const teasersData = teasersElement.getAttribute('data-teasers');
        if (teasersData) {
          const teasers = JSON.parse(teasersData);
          if (teasers && teasers.length > 0) {
            teasersElement.removeAttribute('data-teasers');
            window.renderTeasers(teasers, 'page-teasers');
          }
        }
      } catch (error) {
        console.error('Failed to parse teasers data:', error);
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDetailPage);
  } else {
    initDetailPage();
  }
})();
