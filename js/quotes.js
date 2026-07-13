const QuotesPage = {
  data: null,
  currentCategory: '治愈',
  container: null,
  tabsContainer: null,

  init() {
    this.container = document.getElementById('quotes-container');
    this.tabsContainer = document.getElementById('filter-tabs');
    if (!this.container) return;

    this.loadData();
  },

  async loadData() {
    try {
      this.data = await DataLoader.loadQuotes();
      if (!this.data.categories.includes(this.currentCategory)) {
        this.currentCategory = this.data.categories[0];
      }
      this.renderTabs();
      this.renderQuotes();
    } catch (error) {
      this.container.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);">加载失败，请刷新重试</p>';
    }
  },

  renderTabs() {
    if (!this.tabsContainer || !this.data) return;

    this.tabsContainer.innerHTML = this.data.categories.map(cat => `
      <button class="filter-tab ${cat === this.currentCategory ? 'active' : ''}" data-category="${cat}">
        ${cat}
      </button>
    `).join('');

    this.tabsContainer.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.currentCategory = tab.dataset.category;
        this.updateTabsActive();
        this.renderQuotes();
      });
    });
  },

  updateTabsActive() {
    this.tabsContainer.querySelectorAll('.filter-tab').forEach(tab => {
      if (tab.dataset.category === this.currentCategory) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  },

  renderQuotes() {
    if (!this.data || !this.container) return;

    const quotes = this.data.quotes.filter(q => q.category === this.currentCategory);

    this.container.innerHTML = quotes.map((quote, index) => `
      <div class="quote-card animate-on-scroll" style="animation-delay: ${index * 0.05}s">
        <p class="quote-card__content">${quote.content}</p>
        <p class="quote-card__author">${quote.author}</p>
        <div style="margin-top: var(--spacing-sm);">
          <span class="tag">${quote.category}</span>
        </div>
      </div>
    `).join('');

    ScrollAnimation.refresh();
  },

  reinit() {
    this.data = null;
    this.currentCategory = '治愈';
    this.container = document.getElementById('quotes-container');
    this.tabsContainer = document.getElementById('filter-tabs');
    if (this.container) {
      this.loadData();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  QuotesPage.init();
});