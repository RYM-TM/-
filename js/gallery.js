const GalleryPage = {
  data: null,
  currentAlbumIndex: 0,
  currentPhotoIndex: 0,
  currentPhotos: [],
  tabsContainer: null,
  gridContainer: null,
  lightbox: null,
  lightboxImage: null,
  lightboxTitle: null,
  lightboxCounter: null,

  init() {
    this.tabsContainer = document.getElementById('album-tabs');
    this.gridContainer = document.getElementById('gallery-grid');
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImage = document.getElementById('lightbox-image');
    this.lightboxTitle = document.getElementById('lightbox-title');
    this.lightboxCounter = document.getElementById('lightbox-counter');

    if (!this.gridContainer) return;

    this.loadData();
    this.bindLightboxEvents();
  },

  async loadData() {
    try {
      this.data = await DataLoader.loadPhotos();
      this.renderTabs();
      this.renderGallery();
    } catch (error) {
      this.gridContainer.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);grid-column:1/-1;">加载失败，请刷新重试</p>';
    }
  },

  renderTabs() {
    if (!this.tabsContainer || !this.data) return;

    this.tabsContainer.innerHTML = this.data.albums.map((album, index) => `
      <button class="album-tab ${index === this.currentAlbumIndex ? 'active' : ''}" data-index="${index}">
        <img class="album-tab__cover" src="${album.cover}" alt="${album.name}" loading="lazy">
        <div class="album-tab__name">${album.name}</div>
      </button>
    `).join('');

    this.tabsContainer.querySelectorAll('.album-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.currentAlbumIndex = parseInt(tab.dataset.index);
        this.updateTabsActive();
        this.renderGallery();
      });
    });
  },

  updateTabsActive() {
    this.tabsContainer.querySelectorAll('.album-tab').forEach((tab, index) => {
      if (index === this.currentAlbumIndex) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  },

  renderGallery() {
    if (!this.data || !this.gridContainer) return;

    const album = this.data.albums[this.currentAlbumIndex];
    this.currentPhotos = album.photos;

    this.gridContainer.innerHTML = album.photos.map((photo, index) => `
      <div class="masonry-item gallery-item animate-on-scroll" data-index="${index}" style="transition-delay: ${index * 0.05}s">
        <img src="${photo.src}" alt="${photo.title}" loading="lazy">
        <div class="gallery-item__overlay">
          <div style="font-size: var(--font-size-base); margin-bottom: 4px;">${photo.title}</div>
          <div style="font-size: var(--font-size-xs); opacity: 0.8;">${photo.date}</div>
        </div>
      </div>
    `).join('');

    this.gridContainer.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        this.openLightbox(index);
      });
    });

    ScrollAnimation.refresh();
  },

  bindLightboxEvents() {
    if (!this.lightbox) return;

    document.getElementById('lightbox-close').addEventListener('click', () => this.closeLightbox());
    document.getElementById('lightbox-prev').addEventListener('click', () => this.prevPhoto());
    document.getElementById('lightbox-next').addEventListener('click', () => this.nextPhoto());

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.prevPhoto();
      if (e.key === 'ArrowRight') this.nextPhoto();
    });
  },

  openLightbox(index) {
    this.currentPhotoIndex = index;
    this.updateLightboxContent();
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeLightbox() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = '';
  },

  prevPhoto() {
    this.currentPhotoIndex--;
    if (this.currentPhotoIndex < 0) {
      this.currentPhotoIndex = this.currentPhotos.length - 1;
    }
    this.updateLightboxContent();
  },

  nextPhoto() {
    this.currentPhotoIndex++;
    if (this.currentPhotoIndex >= this.currentPhotos.length) {
      this.currentPhotoIndex = 0;
    }
    this.updateLightboxContent();
  },

  updateLightboxContent() {
    const photo = this.currentPhotos[this.currentPhotoIndex];
    if (!photo) return;

    this.lightboxImage.style.opacity = '0';
    setTimeout(() => {
      this.lightboxImage.src = photo.src;
      this.lightboxImage.alt = photo.title;
      this.lightboxImage.style.opacity = '1';
    }, 150);

    this.lightboxTitle.textContent = photo.title;
    this.lightboxCounter.textContent = `${this.currentPhotoIndex + 1} / ${this.currentPhotos.length}`;
  },

  reinit() {
    this.data = null;
    this.currentAlbumIndex = 0;
    this.tabsContainer = document.getElementById('album-tabs');
    this.gridContainer = document.getElementById('gallery-grid');
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImage = document.getElementById('lightbox-image');
    this.lightboxTitle = document.getElementById('lightbox-title');
    this.lightboxCounter = document.getElementById('lightbox-counter');

    if (this.gridContainer) {
      this.loadData();
      this.bindLightboxEvents();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  GalleryPage.init();
});
