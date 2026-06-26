// Utility Functions
// Markdown parsing, image handling, teaser rendering

(function() {
  'use strict';

  // Simple markdown parser
  function parseMarkdown(markdown) {
    if (!markdown) return '';

    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      // Replace <br> immediately after a heading with a paragraph opening tag
      .replace(/<\/(h[1-6])><br>/g, '</$1><p>');
  }

  // Get image URL with size parameters (if needed)
  function getImageUrl(image, size = {}) {
    if (!image || !image.localPath) return '';

    // For now, just return the local path
    // In production, you could add image transformation logic here
    return image.localPath;
  }

  // Extract YouTube video ID
  function extractYouTubeId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // Extract Vimeo video ID
  function extractVimeoId(url) {
    const regex = /vimeo\.com\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // Render video player
  function renderVideo(videoUrl) {
    if (!videoUrl) return '';

    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = extractYouTubeId(videoUrl);
      if (videoId) {
        return `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="width:100%;height:400px;"></iframe>`;
      }
    } else if (videoUrl.includes('vimeo.com')) {
      const videoId = extractVimeoId(videoUrl);
      if (videoId) {
        return `<iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allowfullscreen style="width:100%;height:400px;"></iframe>`;
      }
    }

    // Default to HTML5 video
    return `<video src="${videoUrl}" controls style="width:100%;"></video>`;
  }

  // Render teasers list
  function renderTeasers(teasers, containerId) {
    if (!teasers || !teasers.length) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    teasers.forEach((teaser, index) => {
      const article = document.createElement('article');
      article.className = `teaser ${index % 2 === 0 ? 'image-left' : 'image-right'}`;

      // Build teaser HTML
      let imageHtml = '';
      if (teaser.videoUrl) {
        imageHtml = renderVideo(teaser.videoUrl);
      } else if (teaser.image) {
        const imgUrl = getImageUrl(teaser.image);
        if (imgUrl) {
          imageHtml = `<img src="${imgUrl}" alt="${teaser.headline || ''}" loading="lazy">`;
        }
      }

      const linkHtml = teaser.link
        ? `<a href="${getLinkHref(teaser.link)}" class="cta">${teaser.linkText || 'Learn More'}</a>`
        : '';

      article.innerHTML = `
        ${imageHtml ? `<div class="teaser__image">${imageHtml}</div>` : ''}
        <div class="teaser__content">
          <h2>${teaser.headline || ''}</h2>
          <div class="content">${parseMarkdown(teaser.content || '')}</div>
          ${linkHtml}
        </div>
      `;

      container.appendChild(article);
    });
  }

  // Get proper href for link
  function getLinkHref(link) {
    if (!link) return '#';

    // Check if external link
    if (link.startsWith('http://') || link.startsWith('https://')) {
      return link;
    }

    // Internal link - add .html extension
    return `/${link}.html`;
  }

  // Export functions
  window.parseMarkdown = parseMarkdown;
  window.getImageUrl = getImageUrl;
  window.renderVideo = renderVideo;
  window.renderTeasers = renderTeasers;
  window.getLinkHref = getLinkHref;
})();
