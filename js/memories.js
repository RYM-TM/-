const MemoriesPage = {
  data: null,
  container: null,

  init() {
    this.container = document.getElementById('timeline-container');
    if (!this.container) return;

    this.loadData();
  },

  async loadData() {
    try {
      this.data = await DataLoader.loadMemories();
      this.renderTimeline();
    } catch (error) {
      this.container.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);">加载失败，请刷新重试</p>';
    }
  },

  renderTimeline() {
    if (!this.data || !this.container) return;

    const memories = [...this.data.memories].sort((a, b) => new Date(b.date) - new Date(a.date));

    this.container.innerHTML = memories.map((mem, index) => `
      <div class="timeline__item animate-on-scroll" style="transition-delay: ${index * 0.1}s">
        <div class="timeline__dot"></div>
        <div class="timeline__date">
          <span>📅</span>
          <span>${mem.date}</span>
        </div>
        <div class="timeline__card">
          <h3 style="font-family: var(--font-display); font-size: var(--font-size-xl); margin-bottom: var(--spacing-sm); color: var(--color-text-primary);">
            ${mem.title}
          </h3>
          ${this.renderContent(mem)}
          ${mem.images && mem.images.length > 0 ? `
            <div class="timeline__images">
              ${mem.images.map(img => `<img src="${img}" alt="${mem.title}" loading="lazy">`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');

    ScrollAnimation.refresh();
  },

  renderContent(mem) {
    if (mem.type === 'chat') {
      const lines = mem.content.split('\n').filter(line => line.trim());
      return lines.map((line, i) => {
        const isRight = line.startsWith('「') || i % 2 === 1;
        const text = line.replace(/^「|」$/g, '');
        return `<div class="chat-bubble ${isRight ? 'chat-bubble--right' : 'chat-bubble--left'}">${text}</div>`;
      }).join('');
    }
    return `<p style="color: var(--color-text-secondary); line-height: 2; white-space: pre-wrap;">${mem.content}</p>`;
  },

  reinit() {
    this.data = null;
    this.container = document.getElementById('timeline-container');
    if (this.container) {
      this.loadData();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MemoriesPage.init();
});
