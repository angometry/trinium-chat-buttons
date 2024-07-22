export class JournalEntryRenderer {
  constructor(journalEntry) {
    this.journalEntry = journalEntry;
    this.currentPage = 0;
    this.pageSize = 3;
    this.logger = logger;
    this.renderedPages = new Map();
    this.imageObserver = this.createImageObserver();
  }

  createImageObserver() {
    return new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          if (src) {
            this.loadImage(img, src).then(() => {
              observer.unobserve(img);
            });
          }
        }
      });
    }, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    });
  }

  async loadImage(img, src) {
    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      img.onload = () => {
        const endTime = performance.now();
        this.logger.debug('Image loaded', { 
          src, 
          loadTime: endTime - startTime 
        });
        img.classList.remove('lazy-image');
        resolve();
      };

      img.onerror = () => {
        this.logger.error('Image failed to load', { src });
        reject();
      };

      img.src = src;
    });
  }

  async render() {
    this.logger.debug('Rendering journal entry', { id: this.journalEntry.id, name: this.journalEntry.name });
    const content = await this.getRenderedContent();
    return this.wrapContent(content);
  }
  
  wrapContent(content) {
    return `
      <div class="journal-entry-content" data-entry-id="${this.journalEntry.id}">
        <h1>${this.journalEntry.name}</h1>
        ${content}
      </div>
    `;
  }

  async getRenderedContent() {
    this.logger.debug('Getting rendered content', { pagesCount: this.journalEntry.pages.size });
    if (this.journalEntry.pages.size === 1) {
      return this.renderSinglePage(this.journalEntry.pages.contents[0]);
    } else {
      return this.renderMultiplePages();
    }
  }

  async renderSinglePage(page) {
    this.logger.debug('Rendering single page', { pageId: page.id, pageType: page.type });
    return this.renderPage(page);
  }

  async renderMultiplePages() {
    const totalPages = this.journalEntry.pages.size;
    const pagesToRender = Math.min(this.pageSize, totalPages - this.currentPage);

    this.logger.debug('Rendering multiple pages', {
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
      this.logger.debug('Using cached page content', { pageId: page.id });
      return this.renderedPages.get(page.id);
    }
    const content = await this.renderPage(page);
    this.renderedPages.set(page.id, content);
    return content;
  }

  async renderPage(page) {
    this.logger.debug('Rendering page', { pageId: page.id, pageType: page.type });
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
    this.logger.debug('Rendering text page', { pageId: page.id });
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
    this.logger.debug('Rendering image page', { pageId: page.id, imageSrc: page.src });
    const uniqueId = `img-${page.id}-${Date.now()}`;
    return `
      <div class="image-container" id="${uniqueId}">
        <div class="image-placeholder" data-src="${page.src}">
          <span>Loading...</span>
        </div>
      </div>
    `;
  }

  renderUnsupportedPage(page) {
    this.logger.warn('Rendering unsupported page type', { pageId: page.id, pageType: page.type });
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

    images.forEach(img => {
      if (!img.classList.contains('lazy-image')) {
        img.classList.add('lazy-image');
        img.dataset.src = img.src;
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        this.imageObserver.observe(img);
      }
    });

    return doc.body.innerHTML;
  }

  initializeLazyLoading(content) {
    this.logger.debug('Initializing lazy loading for images');
    const images = content.querySelectorAll('img.lazy-image');
    images.forEach(img => this.imageObserver.observe(img));
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