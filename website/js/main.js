// Main JavaScript for Home Page
// Initializes carousel and renders home page teasers

(async function() {
  'use strict';

  // Initialize home page
  async function initHomePage() {
    try {
      // Load site data
      const data = await window.loadSiteData();

      // Initialize carousel with slider images
      if (data.sliderImages && data.sliderImages.length > 0) {
        const carousel = new window.Carousel('carousel-container', data.sliderImages, {
          autoplayInterval: 4000,
          dragging: true
        });
      }

      // Render home teasers
      if (data.homeTeasers && data.homeTeasers.length > 0) {
        window.renderTeasers(data.homeTeasers, 'teasers-container');
      }
    } catch (error) {
      console.error('Failed to initialize home page:', error);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomePage);
  } else {
    initHomePage();
  }
})();
