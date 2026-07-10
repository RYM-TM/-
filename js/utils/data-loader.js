const DataLoader = {
  cache: {},

  async load(url) {
    if (this.cache[url]) {
      return this.cache[url];
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      this.cache[url] = data;
      return data;
    } catch (error) {
      console.error('数据加载失败:', url, error);
      throw error;
    }
  },

  async loadQuotes() {
    return this.load('data/quotes.json');
  },

  async loadMemories() {
    return this.load('data/memories.json');
  },

  async loadPhotos() {
    return this.load('data/photos.json');
  },

  async loadMusic() {
    return this.load('data/music.json');
  },

  async loadVideos() {
    return this.load('data/videos.json');
  }
};
