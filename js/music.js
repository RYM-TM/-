const MusicPage = {
  data: null,
  nowPlayingEl: null,
  npCover: null,
  npTitle: null,
  npArtist: null,
  npProgressFill: null,
  npCurrent: null,
  npTotal: null,
  npPlayBtn: null,
  npPrevBtn: null,
  npNextBtn: null,
  npProgressBar: null,
  playlistEl: null,

  init() {
    this.nowPlayingEl = document.getElementById('now-playing');
    if (!this.nowPlayingEl) return;

    this.npCover = document.getElementById('np-cover');
    this.npTitle = document.getElementById('np-title');
    this.npArtist = document.getElementById('np-artist');
    this.npProgressFill = document.getElementById('np-progress-fill');
    this.npCurrent = document.getElementById('np-current');
    this.npTotal = document.getElementById('np-total');
    this.npPlayBtn = document.getElementById('np-play');
    this.npPrevBtn = document.getElementById('np-prev');
    this.npNextBtn = document.getElementById('np-next');
    this.npProgressBar = document.getElementById('np-progress-bar');
    this.playlistEl = document.getElementById('playlist');

    this.loadData();
    this.bindEvents();
  },

  async loadData() {
    try {
      this.data = await DataLoader.loadMusic();
      this.renderPlaylist();
      this.syncWithGlobalPlayer();
    } catch (error) {
      this.playlistEl.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);padding:var(--spacing-xl);">加载失败，请刷新重试</p>';
    }
  },

  renderPlaylist() {
    if (!this.data || !this.playlistEl) return;

    this.playlistEl.innerHTML = this.data.songs.map((song, index) => `
      <div class="song-item" data-index="${index}">
        <div class="song-item__index">${index + 1}</div>
        <div class="song-item__cover">
          <img src="${song.cover}" alt="${song.title}" loading="lazy">
        </div>
        <div class="song-item__info">
          <div class="song-item__title">${song.title}</div>
          <div class="song-item__artist">${song.artist}</div>
        </div>
        <div class="song-item__duration">${song.duration}</div>
      </div>
    `).join('');

    this.playlistEl.querySelectorAll('.song-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        MusicPlayer.playSong(index);
      });
    });
  },

  bindEvents() {
    this.npPlayBtn.addEventListener('click', () => MusicPlayer.togglePlay());
    this.npPrevBtn.addEventListener('click', () => MusicPlayer.playPrev());
    this.npNextBtn.addEventListener('click', () => MusicPlayer.playNext());

    this.npProgressBar.addEventListener('click', (e) => {
      if (!MusicPlayer.audio.duration) return;
      const rect = this.npProgressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      MusicPlayer.audio.currentTime = percent * MusicPlayer.audio.duration;
    });

    const originalUpdateProgress = MusicPlayer.updateProgress.bind(MusicPlayer);
    MusicPlayer.updateProgress = () => {
      originalUpdateProgress();
      this.updateNowPlaying();
    };

    const originalUpdatePlayState = MusicPlayer.updatePlayState.bind(MusicPlayer);
    MusicPlayer.updatePlayState = (playing) => {
      originalUpdatePlayState(playing);
      this.updateNowPlayingState(playing);
    };

    const originalLoadSong = MusicPlayer.loadSong.bind(MusicPlayer);
    MusicPlayer.loadSong = (index) => {
      originalLoadSong(index);
      this.updateNowPlayingInfo();
    };
  },

  syncWithGlobalPlayer() {
    if (MusicPlayer.playlist.length > 0) {
      this.updateNowPlayingInfo();
      this.updateNowPlayingState(MusicPlayer.isPlaying);
    }
  },

  updateNowPlayingInfo() {
    if (!this.data) return;
    const song = MusicPlayer.playlist[MusicPlayer.currentIndex];
    if (!song) return;

    this.npCover.src = song.cover;
    this.npTitle.textContent = song.title;
    this.npArtist.textContent = song.artist;

    this.playlistEl.querySelectorAll('.song-item').forEach((item, index) => {
      if (index === MusicPlayer.currentIndex) {
        item.classList.add('playing');
      } else {
        item.classList.remove('playing');
      }
    });
  },

  updateNowPlayingState(playing) {
    if (playing) {
      this.nowPlayingEl.classList.add('playing');
      this.npPlayBtn.innerHTML = '&#10074;&#10074;';
    } else {
      this.nowPlayingEl.classList.remove('playing');
      this.npPlayBtn.innerHTML = '&#9654;';
    }
  },

  updateNowPlaying() {
    if (!MusicPlayer.audio.duration) return;
    const percent = (MusicPlayer.audio.currentTime / MusicPlayer.audio.duration) * 100;
    this.npProgressFill.style.width = percent + '%';
    this.npCurrent.textContent = MusicPlayer.formatTime(MusicPlayer.audio.currentTime);
    this.npTotal.textContent = MusicPlayer.formatTime(MusicPlayer.audio.duration);
  },

  reinit() {
    this.data = null;
    this.nowPlayingEl = document.getElementById('now-playing');
    if (this.nowPlayingEl) {
      this.npCover = document.getElementById('np-cover');
      this.npTitle = document.getElementById('np-title');
      this.npArtist = document.getElementById('np-artist');
      this.npProgressFill = document.getElementById('np-progress-fill');
      this.npCurrent = document.getElementById('np-current');
      this.npTotal = document.getElementById('np-total');
      this.npPlayBtn = document.getElementById('np-play');
      this.npPrevBtn = document.getElementById('np-prev');
      this.npNextBtn = document.getElementById('np-next');
      this.npProgressBar = document.getElementById('np-progress-bar');
      this.playlistEl = document.getElementById('playlist');

      this.loadData();
      this.bindEvents();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MusicPage.init();
});
