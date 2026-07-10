const PJAX = {
  container: null,
  isTransitioning: false,

  init() {
    this.container = document.getElementById('main-content');
    if (!this.container) return;

    this.bindEvents();
    window.addEventListener('popstate', (e) => this.handlePopState(e));
  },

  bindEvents() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || link.target === '_blank') {
        return;
      }

      if (href.endsWith('.html') || href === '/' || href === './' || href.endsWith('/')) {
        e.preventDefault();
        this.navigate(href);
      }
    });
  },

  async navigate(url) {
    if (this.isTransitioning) return;
    if (url === window.location.pathname + window.location.search) return;

    this.isTransitioning = true;

    this.container.style.opacity = '0';
    this.container.style.transform = 'translateY(20px)';
    this.container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const newContent = doc.getElementById('main-content');
      const newTitle = doc.querySelector('title')?.textContent || '';

      if (newContent) {
        document.title = newTitle;
        history.pushState(null, '', url);

        this.container.innerHTML = newContent.innerHTML;
        this.updateActiveNav(url);

        setTimeout(() => {
          this.container.style.opacity = '1';
          this.container.style.transform = 'translateY(0)';
        }, 50);

        this.reinitializePageScripts();

        setTimeout(() => {
          this.isTransitioning = false;
        }, 400);
      } else {
        window.location.href = url;
      }
    } catch (error) {
      console.error('页面加载失败:', error);
      window.location.href = url;
    }
  },

  handlePopState(e) {
    this.isTransitioning = true;

    this.container.style.opacity = '0';
    this.container.style.transform = 'translateY(20px)';
    this.container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    fetch(window.location.href)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.getElementById('main-content');
        const newTitle = doc.querySelector('title')?.textContent || '';

        if (newContent) {
          document.title = newTitle;
          this.container.innerHTML = newContent.innerHTML;
          this.updateActiveNav(window.location.pathname);

          setTimeout(() => {
            this.container.style.opacity = '1';
            this.container.style.transform = 'translateY(0)';
          }, 50);

          this.reinitializePageScripts();
        }
      })
      .catch(() => {
        window.location.reload();
      })
      .finally(() => {
        setTimeout(() => {
          this.isTransitioning = false;
        }, 400);
      });
  },

  updateActiveNav(url) {
    const filename = url.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === filename || (filename === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  reinitializePageScripts() {
    ScrollAnimation.refresh();

    if (typeof QuotesPage !== 'undefined' && QuotesPage.reinit) {
      QuotesPage.reinit();
    }
    if (typeof MemoriesPage !== 'undefined' && MemoriesPage.reinit) {
      MemoriesPage.reinit();
    }
    if (typeof GalleryPage !== 'undefined' && GalleryPage.reinit) {
      GalleryPage.reinit();
    }
    if (typeof MusicPage !== 'undefined' && MusicPage.reinit) {
      MusicPage.reinit();
    }
    if (typeof VideosPage !== 'undefined' && VideosPage.reinit) {
      VideosPage.reinit();
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  NavToggle.init();
  ScrollAnimation.init();
  BackToTop.init();
  MusicPlayer.init();
  PJAX.init();
});
