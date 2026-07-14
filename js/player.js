const MusicPlayer = {
  audio: null,
  playlist: [],
  currentIndex: 0,
  isPlaying: false,
  playerEl: null,
  coverEl: null,
  titleEl: null,
  artistEl: null,
  progressFillEl: null,
  currentTimeEl: null,
  totalTimeEl: null,
  playBtn: null,
  prevBtn: null,
  nextBtn: null,
  volumeSlider: null,
  volumeIcon: null,

  init() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';

    this.playerEl = document.querySelector('.player');
    if (!this.playerEl) return;

    this.coverEl = this.playerEl.querySelector('.player__cover img');
    this.titleEl = this.playerEl.querySelector('.player__title');
    this.artistEl = this.playerEl.querySelector('.player__artist');
    this.progressFillEl = this.playerEl.querySelector('.player__progress-fill');
    this.currentTimeEl = this.playerEl.querySelector('.player__current-time');
    this.totalTimeEl = this.playerEl.querySelector('.player__total-time');
    this.playBtn = this.playerEl.querySelector('.player__btn--play');
    this.prevBtn = this.playerEl.querySelector('.player__btn--prev');
    this.nextBtn = this.playerEl.querySelector('.player__btn--next');
    this.volumeSlider = this.playerEl.querySelector('.player__volume-slider');
    this.volumeIcon = this.playerEl.querySelector('.player__volume-icon');

    this.bindEvents();
    this.loadPlaylist();
  },

  bindEvents() {
    this.playBtn.addEventListener('click', () => this.togglePlay());
    this.prevBtn.addEventListener('click', () => this.playPrev());
    this.nextBtn.addEventListener('click', () => this.playNext());

    const progressBar = this.playerEl.querySelector('.player__progress-bar');
    progressBar.addEventListener('click', (e) => this.seek(e));

    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    this.audio.addEventListener('ended', () => this.playNext());
    this.audio.addEventListener('play', () => this.updatePlayState(true));
    this.audio.addEventListener('pause', () => this.updatePlayState(false));

    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        this.audio.volume = e.target.value;
        this.updateVolumeIcon(e.target.value);
      });
      this.audio.volume = this.volumeSlider.value;
    }
  },

  async loadPlaylist() {
    try {
      const data = await DataLoader.loadMusic();
      this.playlist = data.songs;
      if (this.playlist.length > 0) {
        this.loadSong(0);
      }
    } catch (error) {
      console.error('加载歌单失败:', error);
    }
  },

  loadSong(index) {
    if (index < 0 || index >= this.playlist.length) return;

    this.currentIndex = index;
    const song = this.playlist[index];

    this.audio.src = song.src;
    this.titleEl.textContent = song.title;
    this.artistEl.textContent = song.artist;
    this.coverEl.src = song.cover;
    this.coverEl.alt = song.title;

    this.updateSongListActive();
  },

  playSong(index) {
    this.loadSong(index);
    this.audio.play().catch(e => console.log('播放失败:', e));
  },

  togglePlay() {
    if (!this.playlist.length) return;

    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch(e => console.log('播放失败:', e));
    }
  },

  playPrev() {
    if (!this.playlist.length) return;
    let newIndex = this.currentIndex - 1;
    if (newIndex < 0) newIndex = this.playlist.length - 1;
    this.playSong(newIndex);
  },

  playNext() {
    if (!this.playlist.length) return;
    let newIndex = this.currentIndex + 1;
    if (newIndex >= this.playlist.length) newIndex = 0;
    this.playSong(newIndex);
  },

  seek(e) {
    if (!this.audio.duration) return;
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    this.audio.currentTime = percent * this.audio.duration;
  },

  updateProgress() {
    if (!this.audio.duration) return;
    const percent = (this.audio.currentTime / this.audio.duration) * 100;
    this.progressFillEl.style.width = percent + '%';
    this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
  },

  updateDuration() {
    this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
  },

  updatePlayState(playing) {
    this.isPlaying = playing;
    if (playing) {
      this.playerEl.classList.add('playing');
      this.playBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      this.playBtn.setAttribute('aria-label', '暂停');
    } else {
      this.playerEl.classList.remove('playing');
      this.playBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      this.playBtn.setAttribute('aria-label', '播放');
    }
  },

  updateVolumeIcon(value) {
    if (!this.volumeIcon) return;
    if (value == 0) {
      this.volumeIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
    } else if (value < 0.5) {
      this.volumeIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>';
    } else {
      this.volumeIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
    }
  },

  updateSongListActive() {
    document.querySelectorAll('.song-item').forEach((item, index) => {
      if (index === this.currentIndex) {
        item.classList.add('playing');
      } else {
        item.classList.remove('playing');
      }
    });
  },

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
};
