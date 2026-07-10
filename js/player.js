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
      this.playBtn.innerHTML = '&#10074;&#10074;';
      this.playBtn.setAttribute('aria-label', '暂停');
    } else {
      this.playerEl.classList.remove('playing');
      this.playBtn.innerHTML = '&#9654;';
      this.playBtn.setAttribute('aria-label', '播放');
    }
  },

  updateVolumeIcon(value) {
    if (!this.volumeIcon) return;
    if (value == 0) {
      this.volumeIcon.innerHTML = '&#128263;';
    } else if (value < 0.5) {
      this.volumeIcon.innerHTML = '&#128264;';
    } else {
      this.volumeIcon.innerHTML = '&#128266;';
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
