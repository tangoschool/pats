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
  let hoverOpenedAt = 0;

  // How long the pointer may be outside the drawer before it closes
  const DRAWER_CLOSE_DELAY = 400;

  // Flyout "aim" state - see handleDrawerMouseover()
  const AIM_DELAY = 300;      // ms to wait before re-checking where the pointer is headed
  const AIM_TOLERANCE = 75;   // px of slack above/below the open flyout
  const mouseLocs = [];       // last few pointer positions
  let activeGroup = null;     // the group whose flyout is showing
  let aimTimeout = null;
  let lastDelayLoc = null;

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
      menuDrawer.addEventListener('mouseover', handleDrawerMouseover);
    }
    document.addEventListener('mousemove', trackMouse);

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
    // With a mouse, hovering MENU already opened the drawer, so a click that
    // follows right after is meant to open it too - don't let it close it.
    if (isMenuOpen && hoverQuery.matches && Date.now() - hoverOpenedAt < 1000) {
      return;
    }
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
    clearTimeout(aimTimeout);
    setActiveGroup(null);
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
      if (!isMenuOpen) hoverOpenedAt = Date.now();
      openMenu();
    });

    el.addEventListener('mouseleave', function() {
      if (!hoverQuery.matches) return;
      if (hoverCloseTimeout) {
        clearTimeout(hoverCloseTimeout);
      }
      hoverCloseTimeout = setTimeout(closeMenu, DRAWER_CLOSE_DELAY);
    });
  }

  // Navigate to page
  function handleNavigation(path) {
    closeMenu();

    if (path.startsWith('http://') || path.startsWith('https://')) {
      window.location.href = path;
      return;
    }

    if (path === '/') {
      window.location.href = '/index.html';
      return;
    }

    // A path like "workshops#some-anchor" needs ".html" inserted before the
    // fragment, not appended after it.
    const hashIndex = path.indexOf('#');
    if (hashIndex === -1) {
      window.location.href = `/${path}.html`;
    } else {
      const base = path.slice(0, hashIndex);
      const hash = path.slice(hashIndex);
      window.location.href = `/${base}.html${hash}`;
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

  // ---- Flyout submenus (mouse only) ----
  //
  // Only one flyout shows at a time, beside its row. Reaching a lower item
  // in a flyout means moving the pointer diagonally, which crosses the rows
  // below the one you started on. Switching flyouts the moment the pointer
  // touches those rows made the flyout you were heading for vanish under a
  // different one. So, like most desktop menus ("menu aim"), while the
  // pointer is moving toward the open flyout we keep it open, and only
  // switch once the pointer pauses on a row or moves some other way.

  function trackMouse(e) {
    mouseLocs.push({ x: e.clientX, y: e.clientY });
    if (mouseLocs.length > 3) mouseLocs.shift();
  }

  function setActiveGroup(groupEl) {
    if (activeGroup === groupEl) return;
    if (activeGroup) activeGroup.classList.remove('flyout-open');
    activeGroup = groupEl;
    if (activeGroup) activeGroup.classList.add('flyout-open');
  }

  // Returns a delay (ms) if the pointer is heading toward the open flyout,
  // or 0 if it's fine to switch now.
  function aimDelay() {
    if (!activeGroup) return 0;
    const flyout = activeGroup.querySelector('.drawer-submenu');
    const loc = mouseLocs[mouseLocs.length - 1];
    const prev = mouseLocs[0];
    if (!flyout || !loc || !prev) return 0;

    // Pointer hasn't moved since we last waited: it has stopped on this row.
    if (lastDelayLoc && loc.x === lastDelayLoc.x && loc.y === lastDelayLoc.y) {
      return 0;
    }

    const r = flyout.getBoundingClientRect();
    if (loc.x >= r.left) return 0;
    const upper = { x: r.left, y: r.top - AIM_TOLERANCE };
    const lower = { x: r.left, y: r.bottom + AIM_TOLERANCE };
    const slope = (a, b) => (b.y - a.y) / (b.x - a.x);

    // Moving toward the flyout = the angle to its top-left corner narrows
    // from above and the angle to its bottom-left corner narrows from below.
    if (slope(loc, upper) < slope(prev, upper) &&
        slope(loc, lower) > slope(prev, lower)) {
      lastDelayLoc = loc;
      return AIM_DELAY;
    }
    lastDelayLoc = null;
    return 0;
  }

  // Pointer is over a row: activate that row's flyout (or none, for rows
  // without a submenu) unless the pointer is on its way to the open flyout.
  function aimAt(groupEl) {
    clearTimeout(aimTimeout);
    if (groupEl === activeGroup) return;
    const delay = aimDelay();
    if (delay) {
      aimTimeout = setTimeout(function() { aimAt(groupEl); }, delay);
    } else {
      setActiveGroup(groupEl);
    }
  }

  function handleDrawerMouseover(e) {
    if (!hoverQuery.matches) return;
    // Pointer reached a flyout: keep it, cancel any pending switch.
    if (e.target.closest('.drawer-submenu')) {
      clearTimeout(aimTimeout);
      return;
    }
    // A group row, or null for plain rows / the Register button / blank space
    aimAt(e.target.closest('.drawer-menu-group'));
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

      // Group headers: on touch, toggle the submenu; with a mouse, navigate
      // to the group's page if it has one, otherwise show its flyout
      mobileMenuList.querySelectorAll('.drawer-menu-parent').forEach(el => {
        el.addEventListener('click', function(e) {
          if (e.target.closest('.drawer-menu-toggle')) return;
          const link = this.getAttribute('data-link');
          if (!hoverQuery.matches) {
            // Touch: tapping the whole row expands/collapses the submenu (the
            // small chevron alone was easy to miss). Each group's own page is
            // already the first item in its submenu, so nothing is lost.
            toggleGroup(this.closest('.drawer-menu-group'));
          } else if (link) {
            handleNavigation(link);
          } else {
            // Mouse: clicking a no-page header (e.g. Special Events) shows its flyout right away
            clearTimeout(aimTimeout);
            setActiveGroup(this.closest('.drawer-menu-group'));
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
        // Insert ".html" before any "#anchor", as in handleNavigation.
        const href = item.link.startsWith('http')
          ? item.link
          : `/${item.link.replace(/^([^#]*)/, '$1.html')}`;
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
