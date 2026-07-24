// Menu Navigation System - Matches original Next.js header.js
// Drawer menu slides in from left, no desktop horizontal menu

(function() {
  'use strict';

  // Social media links - shown as icons in the footer
  const SOCIAL_LINKS = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/philadelphiatangoschool',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/philadelphiatango',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@meredithklein',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a2.997 2.997 0 0 0-2.112-2.121C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.386.52A2.997 2.997 0 0 0 .502 6.186 31.29 31.29 0 0 0 0 12a31.29 31.29 0 0 0 .502 5.814 2.997 2.997 0 0 0 2.112 2.121c1.881.52 9.386.52 9.386.52s7.505 0 9.386-.52a2.997 2.997 0 0 0 2.112-2.121A31.29 31.29 0 0 0 24 12a31.29 31.29 0 0 0-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z"/></svg>'
    }
  ];

  // State
  let isMenuOpen = false;
  let hoverCloseTimeout = null;

  // Only devices with a real mouse get hover-to-open; touch has no hover
  const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

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
      attachHoverOpen(menuToggle);
    }
    if (menuDrawer) {
      attachHoverOpen(menuDrawer);
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
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Open menu
  function openMenu() {
    isMenuOpen = true;
    menuDrawer.classList.add('open');
  }

  // Close menu
  function closeMenu() {
    isMenuOpen = false;
    menuDrawer.classList.remove('open');
  }

  // Open the drawer on mouseenter and close it on mouseleave, with a short
  // grace period so moving the pointer from the toggle button into the
  // drawer (or back) doesn't flicker it shut. No-op on touch devices.
  function attachHoverOpen(el) {
    el.addEventListener('mouseenter', function() {
      if (!hoverQuery.matches) return;
      if (hoverCloseTimeout) {
        clearTimeout(hoverCloseTimeout);
        hoverCloseTimeout = null;
      }
      openMenu();
    });

    el.addEventListener('mouseleave', function() {
      if (!hoverQuery.matches) return;
      if (hoverCloseTimeout) {
        clearTimeout(hoverCloseTimeout);
      }
      hoverCloseTimeout = setTimeout(closeMenu, 150);
    });
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

  // Render one drawer row (top-level leaf, or top-level group with a submenu)
  function renderDrawerItem(item) {
    const hasChildren = item.children && item.children.length;

    if (!hasChildren) {
      return `<li class="drawer-menu-item" data-link="${item.link}">${item.linkName}</li>`;
    }

    const childrenHtml = item.children.map(child =>
      `<li class="drawer-menu-item drawer-submenu-item" data-link="${child.link}">${child.linkName}</li>`
    ).join('');

    return `
      <li class="drawer-menu-group">
        <div class="drawer-menu-item drawer-menu-parent" data-link="${item.link || ''}">
          <span class="drawer-menu-label">${item.linkName}</span>
          <button type="button" class="drawer-menu-toggle" aria-label="Toggle ${item.linkName} submenu" aria-expanded="false">
            <svg class="drawer-menu-chevron" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
          </button>
        </div>
        <ul class="drawer-submenu">${childrenHtml}</ul>
      </li>`;
  }

  // Expand/collapse a drawer group
  function toggleGroup(groupEl) {
    const isOpen = groupEl.classList.toggle('open');
    const toggleBtn = groupEl.querySelector('.drawer-menu-toggle');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
  }

  // Open a group's flyout on hover and close it after a grace period, so
  // briefly leaving the hoverable area (e.g. while moving diagonally toward
  // a lower item) doesn't close it before the pointer arrives. mouseenter/
  // mouseleave consider the whole subtree, so this covers both the trigger
  // row and the flyout panel itself even though the flyout renders outside
  // the row's own box.
  function attachSubmenuHover(groupEl) {
    groupEl.addEventListener('mouseenter', function() {
      if (!hoverQuery.matches) return;
      if (groupEl._flyoutCloseTimeout) {
        clearTimeout(groupEl._flyoutCloseTimeout);
        groupEl._flyoutCloseTimeout = null;
      }
      groupEl.classList.add('flyout-open');
    });

    groupEl.addEventListener('mouseleave', function() {
      if (!hoverQuery.matches) return;
      if (groupEl._flyoutCloseTimeout) {
        clearTimeout(groupEl._flyoutCloseTimeout);
      }
      groupEl._flyoutCloseTimeout = setTimeout(function() {
        groupEl.classList.remove('flyout-open');
      }, 300);
    });
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
      mobileMenuList.innerHTML = menuItems.map(renderDrawerItem).join('');

      // Leaf items (top-level links and submenu items) navigate on click
      mobileMenuList.querySelectorAll('.drawer-menu-item:not(.drawer-menu-parent)').forEach(el => {
        el.addEventListener('click', function() {
          const link = this.getAttribute('data-link');
          if (link) handleNavigation(link);
        });
      });

      // Group headers navigate if they have their own page, otherwise just toggle
      mobileMenuList.querySelectorAll('.drawer-menu-parent').forEach(el => {
        el.addEventListener('click', function(e) {
          if (e.target.closest('.drawer-menu-toggle')) return;
          const link = this.getAttribute('data-link');
          if (link) {
            handleNavigation(link);
          } else {
            toggleGroup(this.closest('.drawer-menu-group'));
          }
        });
      });

      // Chevron button always just toggles, never navigates
      mobileMenuList.querySelectorAll('.drawer-menu-toggle').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          toggleGroup(this.closest('.drawer-menu-group'));
        });
      });

      // On hover-capable devices, open each flyout on hover with a grace
      // period before closing - reaching a lower item means moving the
      // pointer diagonally, which briefly crosses dead space between the
      // trigger row and the flyout. Closing instantly (plain CSS :hover)
      // makes the flyout vanish mid-crossing.
      mobileMenuList.querySelectorAll('.drawer-menu-group').forEach(attachSubmenuHover);
    }

    // Render footer menu - flattened so every page stays reachable
    if (footerMenuList) {
      const flatItems = [];
      menuItems.forEach(item => {
        if (item.children && item.children.length) {
          if (item.link) {
            flatItems.push({ linkName: item.linkName, link: item.link });
          }
          item.children.forEach(child => flatItems.push(child));
        } else {
          flatItems.push(item);
        }
      });

      footerMenuList.innerHTML = flatItems.map(item => {
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

    // Footer social icons
    const footerCompany = document.querySelector('.footer-company');
    if (footerCompany && !document.querySelector('.footer-social')) {
      const social = document.createElement('div');
      social.className = 'footer-social';
      social.innerHTML = SOCIAL_LINKS.map(function(s) {
        return '<a href="' + s.url + '" target="_blank" rel="noopener noreferrer" aria-label="' + s.name + '">' + s.svg + '</a>';
      }).join('');
      footerCompany.insertAdjacentElement('afterend', social);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
