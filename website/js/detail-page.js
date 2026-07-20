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

    // Render hero carousel, if this page has one
    const heroCarousel = document.getElementById('hero-carousel');
    if (heroCarousel) {
      try {
        const sliderData = heroCarousel.getAttribute('data-slider-images');
        if (sliderData) {
          const sliderImages = JSON.parse(sliderData);
          if (sliderImages && sliderImages.length > 0 && window.Carousel) {
            heroCarousel.removeAttribute('data-slider-images');
            new window.Carousel('carousel-container', sliderImages, {
              autoplayInterval: 4000,
              dragging: true
            });
          }
        }
      } catch (error) {
        console.error('Failed to parse slider images data:', error);
      }
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
