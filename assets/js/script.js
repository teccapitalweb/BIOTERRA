
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const coursesGrid = document.getElementById('coursesGrid');
const courseModal = document.getElementById('courseModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalTopics = document.getElementById('modalTopics');
const modalWhatsapp = document.getElementById('modalWhatsapp');
const modalModality = document.getElementById('modalModality');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');

if (navToggle) {
  navToggle.addEventListener('click', () => navMenu.classList.toggle('is-open'));
}

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('is-open'));
});

function renderCourses() {
  if (!coursesGrid || !Array.isArray(coursesData)) return;
  coursesGrid.innerHTML = coursesData.map(course => `
    <article class="course-card reveal" data-course-id="${course.id}" tabindex="0" role="button" aria-label="Abrir información de ${course.title}">
      <div class="course-card__image">
        <img src="${course.image}" alt="${course.title}">
      </div>
      <div class="course-card__content">
        <span class="course-card__pill">${course.modality}</span>
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <span class="course-card__action">Ver más detalles →</span>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.course-card').forEach(card => {
    const open = () => openCourseModal(Number(card.dataset.courseId));
    card.addEventListener('click', open);
    card.addEventListener('keypress', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });

  observeReveal();
}

function openCourseModal(id) {
  const course = coursesData.find(item => item.id === id);
  if (!course) return;

  modalImage.src = course.image;
  modalImage.alt = course.title;
  modalTitle.textContent = course.title;
  modalDescription.textContent = course.description;
  modalModality.textContent = course.modality;
  modalTopics.innerHTML = course.topics.map(topic => `<li>${topic}</li>`).join('');
  modalWhatsapp.href = `https://wa.me/522361236846?text=${encodeURIComponent(`Hola Bioterra México, quiero información sobre el curso: ${course.title}`)}`;

  courseModal.classList.add('is-open');
  courseModal.setAttribute('aria-hidden', 'false');
  if (window.innerWidth > 760) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  courseModal.scrollTop = 0;
}

function closeCourseModal() {
  courseModal.classList.remove('is-open');
  courseModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-close-modal]').forEach(button => {
  button.addEventListener('click', closeCourseModal);
});

function openLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-close-lightbox]').forEach(button => {
  button.addEventListener('click', closeLightbox);
});

document.querySelectorAll('.gallery__item').forEach(button => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    openLightbox(image.src, image.alt);
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeCourseModal();
    closeLightbox();
  }
});

function animateCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.counter);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 45));

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = `${current}${target === 100 ? '%' : '+'}`;
      }, 36);

      observer.unobserve(el);
    });
  }, { threshold: 0.45 });

  counters.forEach(counter => observer.observe(counter));
}

function observeReveal() {
  const revealItems = document.querySelectorAll('.reveal:not(.is-visible)');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => observer.observe(item));
}

renderCourses();
animateCounters();
observeReveal();
