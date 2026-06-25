// Image Carousel Component
// Autoplay, drag/swipe, responsive sizing

(function() {
  'use strict';

  class Carousel {
    constructor(containerId, images, options = {}) {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        console.error(`Carousel container #${containerId} not found`);
        return;
      }

      this.images = images || [];
      this.currentIndex = 0;
      this.autoplayInterval = options.autoplayInterval || 4000;
      this.dragging = options.dragging !== false;
      this.autoplayTimer = null;
      this.startX = 0;
      this.isDragging = false;
      this.slidesElement = null;

      if (this.images.length > 0) {
        this.init();
      }
    }

    init() {
      this.render();
      this.startAutoplay();
      if (this.dragging) {
        this.enableDragging();
      }

      // Hide loading spinner
      const loading = document.querySelector('.carousel-loading');
      if (loading) {
        loading.classList.add('hidden');
      }
    }

    render() {
      // Create slides container
      this.slidesElement = document.createElement('div');
      this.slidesElement.className = 'carousel-slides';

      // Create slides
      this.images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `<img src="${image.localPath}" alt="${image.title || ''}" loading="${index === 0 ? 'eager' : 'lazy'}">`;
        this.slidesElement.appendChild(slide);
      });

      this.container.appendChild(this.slidesElement);
      this.updateSlide();
    }

    next() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.updateSlide();
    }

    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
      this.updateSlide();
    }

    goTo(index) {
      if (index >= 0 && index < this.images.length) {
        this.currentIndex = index;
        this.updateSlide();
      }
    }

    updateSlide() {
      if (!this.slidesElement) return;

      const translateX = -this.currentIndex * 100;
      this.slidesElement.style.transform = `translateX(${translateX}%)`;
    }

    startAutoplay() {
      if (this.images.length <= 1) return;

      this.stopAutoplay();
      this.autoplayTimer = setInterval(() => {
        this.next();
      }, this.autoplayInterval);
    }

    stopAutoplay() {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    }

    enableDragging() {
      if (!this.container) return;

      // Mouse events
      this.container.addEventListener('mousedown', this.handleDragStart.bind(this));
      this.container.addEventListener('mousemove', this.handleDragMove.bind(this));
      this.container.addEventListener('mouseup', this.handleDragEnd.bind(this));
      this.container.addEventListener('mouseleave', this.handleDragEnd.bind(this));

      // Touch events
      this.container.addEventListener('touchstart', this.handleDragStart.bind(this));
      this.container.addEventListener('touchmove', this.handleDragMove.bind(this));
      this.container.addEventListener('touchend', this.handleDragEnd.bind(this));
    }

    handleDragStart(e) {
      this.isDragging = true;
      this.startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
      this.stopAutoplay();

      // Disable transition during drag
      if (this.slidesElement) {
        this.slidesElement.style.transition = 'none';
      }
    }

    handleDragMove(e) {
      if (!this.isDragging) return;

      e.preventDefault();
      const currentX = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
      const diff = currentX - this.startX;
      const containerWidth = this.container.offsetWidth;
      const percentageDiff = (diff / containerWidth) * 100;

      // Update slide position
      if (this.slidesElement) {
        const translateX = -this.currentIndex * 100 + percentageDiff;
        this.slidesElement.style.transform = `translateX(${translateX}%)`;
      }
    }

    handleDragEnd(e) {
      if (!this.isDragging) return;

      this.isDragging = false;

      // Re-enable transition
      if (this.slidesElement) {
        this.slidesElement.style.transition = '';
      }

      const endX = e.type === 'mouseup' ? e.pageX : (e.changedTouches ? e.changedTouches[0].pageX : this.startX);
      const diff = endX - this.startX;
      const threshold = 50; // Minimum drag distance to trigger slide change

      if (diff > threshold) {
        // Dragged right - go to previous
        this.prev();
      } else if (diff < -threshold) {
        // Dragged left - go to next
        this.next();
      } else {
        // Not dragged enough - snap back to current
        this.updateSlide();
      }

      // Restart autoplay
      this.startAutoplay();
    }

    destroy() {
      this.stopAutoplay();
      if (this.container) {
        this.container.innerHTML = '';
      }
    }
  }

  // Export Carousel class
  window.Carousel = Carousel;
})();
