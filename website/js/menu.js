// Menu Navigation System - Matches original Next.js header.js
// Drawer menu slides in from left, no desktop horizontal menu

(function() {
  'use strict';

  // State
  let isMenuOpen = false;

  // DOM Elements
  let menuToggle, menuDrawer, mobileMenuList, footerMenuList, logoLink;

  // Initialize menu system
  function init() {
    // Get DOM elements
    menuToggle = document.getElementById('menu-toggle');
    menuDrawer = document.getElementById('menu-drawer');
    mobileMenuList = document.getElementById('mobile-menu-list');
    footerMenuList = document.getElementById('footer-menu-list');
    logoLink = document.getElementById('logo-link');

    // Add event listeners
    if (menuToggle) {
      menuToggle.addEventListener('click', toggleMenu);
    }

    // Logo click to go home
    if (logoLink) {
      logoLink.addEventListener('click', function() {
        window.location.href = '/index.html';
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (isMenuOpen &&
          !menuDrawer.contains(e.target) &&
          !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Load and render menu
    renderMenu();

    // Insert logos
    insertLogos();
  }

  // Toggle drawer menu
  function toggleMenu(e) {
    e.stopPropagation();
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
      menuDrawer.classList.add('open');
    } else {
      menuDrawer.classList.remove('open');
    }
  }

  // Close menu
  function closeMenu() {
    isMenuOpen = false;
    menuDrawer.classList.remove('open');
  }

  // Navigate to page
  function handleNavigation(path) {
    closeMenu();

    if (path.startsWith('http://') || path.startsWith('https://')) {
      window.location.href = path;
    } else {
      window.location.href = path === '/' ? '/index.html' : `/${path}.html`;
    }
  }

  // Render menu items
  async function renderMenu() {
    const data = await window.loadSiteData();
    const menuItems = data.menu || [];

    if (!menuItems.length) {
      console.warn('No menu items found');
      return;
    }

    // Render drawer menu items
    if (mobileMenuList) {
      mobileMenuList.innerHTML = menuItems.map(item =>
        `<li class="drawer-menu-item" data-link="${item.link}">${item.linkName}</li>`
      ).join('');

      // Add click handlers
      const menuItemElements = mobileMenuList.querySelectorAll('.drawer-menu-item');
      menuItemElements.forEach(el => {
        el.addEventListener('click', function() {
          const link = this.getAttribute('data-link');
          handleNavigation(link);
        });
      });
    }

    // Render footer menu
    if (footerMenuList) {
      footerMenuList.innerHTML = menuItems.map(item => {
        const href = item.link.startsWith('http') ? item.link : `/${item.link}.html`;
        return `<li><a href="${href}">${item.linkName}</a></li>`;
      }).join('');
    }
  }

  // Insert logo SVGs
  function insertLogos() {
    // Header logo
    if (logoLink && window.LOGO_SVG) {
      logoLink.innerHTML = window.LOGO_SVG;
    }

    // Drawer logo
    const drawerLogo = document.getElementById('drawer-logo');
    if (drawerLogo && window.LOGO_SVG) {
      drawerLogo.innerHTML = window.LOGO_SVG;
      drawerLogo.style.cursor = 'pointer';
      drawerLogo.addEventListener('click', function() {
        handleNavigation('/');
      });
    }

    // Footer logo
    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo && window.LOGO_WHITE_SVG) {
      footerLogo.innerHTML = window.LOGO_WHITE_SVG;
    }

    // Set copyright year
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
      footerYear.textContent = new Date().getFullYear();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
