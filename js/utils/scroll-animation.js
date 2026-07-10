const ScrollAnimation = {
  observer: null,

  init() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('animate-in');
      });
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.observeElements();
  },

  observeElements() {
    if (!this.observer) return;
    document.querySelectorAll('.animate-on-scroll:not(.animate-in)').forEach(el => {
      this.observer.observe(el);
    });
  },

  refresh() {
    this.observeElements();
  }
};

const BackToTop = {
  button: null,

  init() {
    this.button = document.querySelector('.back-to-top');
    if (!this.button) return;

    window.addEventListener('scroll', () => this.handleScroll());
    this.button.addEventListener('click', () => this.scrollToTop());
  },

  handleScroll() {
    if (window.scrollY > 300) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  },

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

const NavToggle = {
  toggle: null,
  menu: null,

  init() {
    this.toggle = document.querySelector('.navbar__toggle');
    this.menu = document.querySelector('.navbar__menu');
    if (!this.toggle || !this.menu) return;

    this.toggle.addEventListener('click', () => this.toggleMenu());

    document.querySelectorAll('.navbar__link').forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    document.addEventListener('click', (e) => {
      if (!this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
        this.closeMenu();
      }
    });
  },

  toggleMenu() {
    this.menu.classList.toggle('open');
    this.toggle.classList.toggle('active');
  },

  closeMenu() {
    this.menu.classList.remove('open');
    this.toggle.classList.remove('active');
  }
};
