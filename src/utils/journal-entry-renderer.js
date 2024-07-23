export class JournalEntryRenderer {
  constructor(journalEntry) {
    this.journalEntry = journalEntry;
    this.currentPage = 0;
    this.pageSize = 3;
    this.logger = logger;
    this.renderedPages = new Map();
    this.imageCache = new Map();
    this.imageObserver = this.createImageObserver();
  }

  createImageObserver() {
    return new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const container = entry.target;
            const img = container.querySelector('img');
            const src = img.dataset.src;
            if (src) {
              this.loadImage(container, img, src).then(() => {
                observer.unobserve(container);
              }).catch((error) => {
                this.logger.error('Error loading image', { src, error });
              });
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );
  }

  async loadImage(container, img, src) {
    if (this.imageCache.has(src)) {
      this.setImageSource(img, this.imageCache.get(src), container);
      return;
    }

    try {
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const objectURL = URL.createObjectURL(blob);
      const resizedURL = await this.resizeImage(objectURL);
      this.scheduleImageRender(container, img, resizedURL, src);
      this.imageCache.set(src, resizedURL);
    } catch (error) {
      this.handleImageError(container, src, error);
    }
  }

  resizeImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1000; // maximum dimension for resizing
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height *= maxDim / width;
          width = maxDim;
        } else if (height > width && height > maxDim) {
          width *= maxDim / height;
          height = maxDim;
        } else if (width > maxDim) {
          width = maxDim;
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          const resizedURL = URL.createObjectURL(blob);
          resolve(resizedURL);
        }, img.type);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  scheduleImageRender(container, img, objectURL, src) {
    const renderImage = () => {
      this.setImageSource(img, objectURL, container);
    };
    requestAnimationFrame(renderImage);
  }

  setImageSource(img, src, container) {
    img.src = src;
    img.classList.remove('lazy-image');
    const overlay = container.querySelector('.image-loading-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  handleImageError(container, src, error) {
    this.logger.error('Image failed to load', { src, error });
    const overlay = container.querySelector('.image-loading-overlay');
    if (overlay) {
      overlay.textContent = 'Failed to load image';
    }
  }

  async render(delay = 0) {
    const content = await this.getRenderedContent();
    const wrappedContent = this.wrapContent(content);

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    return wrappedContent;
  }

  async getRenderedContent() {
    if (this.journalEntry.pages.size === 1) {
      return this.renderSinglePage(this.journalEntry.pages.contents[0]);
    } else {
      return this.renderMultiplePages();
    }
  }

  async renderSinglePage(page) {
    return this.renderPage(page);
  }

  async renderMultiplePages() {
    const totalPages = this.journalEntry.pages.size;
    const pagesToRender = Math.min(this.pageSize, totalPages - this.currentPage);

    this.logger.debug('Trinium Journal Renderer: Rendering multiple pages', {
      totalPages,
      currentPage: this.currentPage,
      pagesToRender,
    });

    const pageElements = await Promise.all(
      this.journalEntry.pages.contents
        .slice(this.currentPage, this.currentPage + pagesToRender)
        .map(async (page, index) => {
          const pageContent = await this.getOrRenderPage(page);
          return `<section class="journal-page" data-page-number="${
            this.currentPage + index + 1
          }">${pageContent}</section>`;
        })
    );

    const pageSelector = this.createPageSelector(totalPages);
    return `
      ${pageSelector}
      ${pageElements.join('')}
      ${this.currentPage + pagesToRender < totalPages ? this.createLoadMoreButton() : ''}
    `;
  }

  async getOrRenderPage(page) {
    if (this.renderedPages.has(page.id)) {
      this.logger.debug('Trinium Journal Renderer: Using cached page content for page', { pageId: page.id });
      return this.renderedPages.get(page.id);
    }
    const content = await this.renderPage(page);
    this.renderedPages.set(page.id, content);
    return content;
  }

  async renderPage(page) {
    this.logger.debug('Trinium Journal Renderer: Rendering page', { pageId: page.id, pageType: page.type });
    this.logger.debug('Trinium Journal Renderer: Page object structure', page);
    let content;
    switch (page.type) {
      case 'text':
        content = await this.renderTextPage(page);
        break;
      case 'image':
        content = this.renderImagePage(page);
        break;
      default:
        content = this.renderUnsupportedPage(page);
    }
    return `<h2>${page.name}</h2>${content}`;
  }

  async renderTextPage(page) {
    if (!page || !page.text || !page.text.content) {
      this.logger.error('Trinium Journal Renderer: Invalid Page Structure', page);
      return `<p>Error: Invalid journal page structure. If this is a custom page created by Monk's Enhanced Journal, it is not supported! If it isn't, you can find an error "Invalid Page Structure" in your console with more details, open an issue on github if you can!</p>`;
    }
  
    const maxLength = 1000;
    let content = page.text.content;
  
    if (content.length > maxLength) {
      const truncatedContent = content.slice(0, maxLength);
      content = `
        <div class="truncated-content">${await TextEditor.enrichHTML(truncatedContent, {
          async: true,
          secrets: this.journalEntry.isOwner,
        })}</div>
        <div class="full-content" style="display: none;">${await TextEditor.enrichHTML(content, {
          async: true,
          secrets: this.journalEntry.isOwner,
        })}</div>
        <button class="expand-content" data-action="expandContent">${game.i18n.localize(
          'TCB_GMSCREEN.ShowMore'
        )}</button>
      `;
    } else {
      content = await TextEditor.enrichHTML(content, { async: true, secrets: this.journalEntry.isOwner });
    }
  
    return this.processLazyImages(content);
  }
  

  renderImagePage(page) {
    const uniqueId = `img-${page.id}-${Date.now()}`;
    return `
      <div class="image-container" id="${uniqueId}">
        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
             alt="${page.name}" 
             class="lazy-image" 
             data-src="${page.src}" 
             style="max-width: 100%; height: auto;">
        <div class="image-loading-overlay">
          <div class="loading-spinner"></div>
          <div class="loading-text">Loading...</div>
        </div>
      </div>
    `;
  }

  renderUnsupportedPage(page) {
    this.logger.warn('Trinium Journal Renderer: Rendering unsupported page type', { pageId: page.id, pageType: page.type });
    let content = `<p>${game.i18n.localize('TCB_GMSCREEN.UnsupportedPageType')} "${page.type}". ${game.i18n.localize(
      'TCB_GMSCREEN.TryingToRenderText'
    )}</p>`;
    if (page.text && page.text.content) {
      content += `<div>${page.text.content}</div>`;
    }
    return content;
  }

  createPageSelector(totalPages) {
    const pageButtons = this.journalEntry.pages.contents
      .map(
        (page, index) =>
          `<button type="button" class="page-link ${index === this.currentPage ? 'active' : ''}" data-page="${index}">
            ${page.name}
          </button>`
      )
      .join('');

    return `
      <div class="journal-page-selector">
        ${pageButtons}
      </div>
    `;
  }

  createLoadMoreButton() {
    return `<button class="load-more" data-action="loadMore">${game.i18n.localize('TCB_GMSCREEN.LoadMore')}</button>`;
  }

  wrapContent(content) {
    return `
      <div class="journal-entry-content" data-entry-id="${this.journalEntry.id}">
        <h1>${this.journalEntry.name}</h1>
        ${content}
      </div>
    `;
  }

  processLazyImages(content) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const images = doc.querySelectorAll('img');

    images.forEach((img) => {
      if (!img.classList.contains('lazy-image')) {
        const container = document.createElement('div');
        container.className = 'image-container';
        img.parentNode.insertBefore(container, img);
        container.appendChild(img);

        img.classList.add('lazy-image');
        img.dataset.src = img.src;
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

        const overlay = document.createElement('div');
        overlay.className = 'image-loading-overlay';
        overlay.innerHTML = '<div class="loading-spinner"></div><div class="loading-text">Loading...</div>';
        container.appendChild(overlay);

        this.imageObserver.observe(container);
      }
    });

    return doc.body.innerHTML;
  }

  initializeLazyLoading(content) {
    const containers = content.querySelectorAll('.image-container');
    containers.forEach((container) => this.imageObserver.observe(container));
  }

  expandTruncatedContent(button) {
    const truncated = button.previousElementSibling.previousElementSibling;
    const full = button.previousElementSibling;
    truncated.style.display = 'none';
    full.style.display = 'block';
    button.remove();
  }

  async loadMorePages() {
    this.pageSize += 3;
    return this.renderMultiplePages();
  }

  async changePage(newPage) {
    this.currentPage = newPage;
    this.pageSize = 3;
    return this.renderMultiplePages();
  }
}
