// ═══ EduNova Main JS ═══

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
  // Scroll to top button
  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    if (window.scrollY > 300) scrollBtn.classList.add('visible');
    else scrollBtn.classList.remove('visible');
  }
});

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu?.classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
  });
});

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabGroup = btn.closest('.tab-group') || btn.parentElement.parentElement;
    const target = btn.dataset.tab;
    tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const panes = document.querySelectorAll(`.tab-pane[data-tab="${target}"]`);
    // Find all tab panes in the same container
    const allPanes = btn.closest('.section')?.querySelectorAll('.tab-pane') 
      || document.querySelectorAll('.tab-pane');
    allPanes.forEach(p => p.classList.remove('active'));
    panes.forEach(p => p.classList.add('active'));
  });
});

// Modal
function openModal(id) {
  const overlay = document.getElementById(id);
  overlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.modal));
});

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay').id));
});

// Scroll to top
document.querySelector('.scroll-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Toast notification
function showToast(message, type = 'info', duration = 3500) {
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const container = document.querySelector('.toast-container') || (() => {
    const c = document.createElement('div');
    c.className = 'toast-container';
    document.body.appendChild(c);
    return c;
  })();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// File upload preview
document.querySelectorAll('.file-upload').forEach(uploadArea => {
  const input = uploadArea.querySelector('input[type="file"]');
  uploadArea.addEventListener('click', () => input?.click());
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--accent)';
  });
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '';
  });
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '';
    const files = e.dataTransfer.files;
    if (files.length) handleFileSelect(files[0], uploadArea);
  });
  input?.addEventListener('change', () => {
    if (input.files.length) handleFileSelect(input.files[0], uploadArea);
  });
});

function handleFileSelect(file, area) {
  const p = area.querySelector('p');
  if (p) p.textContent = `📎 ${file.name} selected`;
  area.style.borderColor = 'var(--accent)';
  area.style.background = 'var(--accent-soft)';
}

// Form submissions
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    if (btn) {
      const original = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        showToast('Submitted successfully!', 'success');
        form.reset();
        // Close modal if inside one
        const modal = form.closest('.modal-overlay');
        if (modal) closeModal(modal.id);
      }, 1500);
    }
  });
});

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// Animated counter for stats
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start).toLocaleString() + (el.dataset.suffix || '');
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(el => animateCounter(el, parseInt(el.dataset.count), 2000));
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats, .about-stats-grid').forEach(el => statsObserver.observe(el));
