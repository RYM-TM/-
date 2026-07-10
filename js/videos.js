const VideosPage = {
  data: null,
  gridContainer: null,
  modal: null,
  modalVideo: null,
  modalTitle: null,
  modalDate: null,
  modalDesc: null,
  currentVideoIndex: 0,

  init() {
    this.gridContainer = document.getElementById('videos-grid');
    this.modal = document.getElementById('video-modal');
    this.modalVideo = document.getElementById('video-modal-video');
    this.modalTitle = document.getElementById('video-modal-title');
    this.modalDate = document.getElementById('video-modal-date');
    this.modalDesc = document.getElementById('video-modal-desc');

    if (!this.gridContainer) return;

    this.loadData();
    this.bindModalEvents();
  },

  async loadData() {
    try {
      this.data = await DataLoader.loadVideos();
      this.renderVideos();
    } catch (error) {
      this.gridContainer.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);grid-column:1/-1;">加载失败，请刷新重试</p>';
    }
  },

  renderVideos() {
    if (!this.data || !this.gridContainer) return;

    this.gridContainer.innerHTML = this.data.videos.map((video, index) => `
      <div class="video-card animate-on-scroll" data-index="${index}" style="transition-delay: ${index * 0.08}s">
        <div class="video-card__cover">
          <img src="${video.cover}" alt="${video.title}" loading="lazy">
          <div class="video-card__play">▶</div>
        </div>
        <div class="video-card__info">
          <h3 class="video-card__title">${video.title}</h3>
          <p class="video-card__date">📅 ${video.date}</p>
        </div>
      </div>
    `).join('');

    this.gridContainer.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.dataset.index);
        this.openModal(index);
      });
    });

    ScrollAnimation.refresh();
  },

  bindModalEvents() {
    if (!this.modal) return;

    document.getElementById('video-modal-close').addEventListener('click', () => this.closeModal());

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;
      if (e.key === 'Escape') this.closeModal();
    });
  },

  openModal(index) {
    this.currentVideoIndex = index;
    const video = this.data.videos[index];
    if (!video) return;

    this.modalVideo.src = video.src;
    this.modalTitle.textContent = video.title;
    this.modalDate.textContent = `📅 ${video.date}`;
    this.modalDesc.textContent = video.description;

    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    this.modalVideo.play().catch(e => console.log('视频播放失败:', e));
  },

  closeModal() {
    this.modal.classList.remove('active');
    this.modalVideo.pause();
    this.modalVideo.src = '';
    document.body.style.overflow = '';
  },

  reinit() {
    this.data = null;
    this.gridContainer = document.getElementById('videos-grid');
    this.modal = document.getElementById('video-modal');
    this.modalVideo = document.getElementById('video-modal-video');
    this.modalTitle = document.getElementById('video-modal-title');
    this.modalDate = document.getElementById('video-modal-date');
    this.modalDesc = document.getElementById('video-modal-desc');

    if (this.gridContainer) {
      this.loadData();
      this.bindModalEvents();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  VideosPage.init();
});
