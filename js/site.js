'use strict';

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
const setMenu = (open) => {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  navigation.classList.toggle('is-open', open);
};
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});
const mobileQuery = window.matchMedia('(max-width: 850px)');
mobileQuery.addEventListener('change', () => setMenu(false));

// Reflect the section currently being read without changing browser history.
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navigation.querySelectorAll('a').forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('main > section[id]').forEach(section => sectionObserver.observe(section));
}

const cards = Array.from(document.querySelectorAll('.project-card'));
const filters = document.querySelectorAll('.filter');
filters.forEach(filter => filter.addEventListener('click', () => {
  filters.forEach(button => {
    const selected = filter === button;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  cards.forEach(card => { card.hidden = filter.dataset.filter !== 'all' && card.dataset.category !== filter.dataset.filter; });
  const count = cards.filter(card => !card.hidden).length;
  document.querySelector('#filter-status').textContent = `${count} réalisation${count > 1 ? 's affichées' : ' affichée'}`;
}));

const dialog = document.querySelector('#gallery-dialog');
let currentCard;
function displayPhoto(card) {
  currentCard = card;
  const visibleCards = cards.filter(item => !item.hidden);
  const photo = document.querySelector('#dialog-image');
  photo.src = `images/optimized/${card.dataset.photo}.webp`;
  photo.alt = card.querySelector('img').alt;
  document.querySelector('#dialog-title').textContent = card.dataset.title;
  document.querySelector('#dialog-description').textContent = card.dataset.description;
  document.querySelector('#photo-count').textContent = `${visibleCards.indexOf(card) + 1} / ${visibleCards.length}`;
  document.querySelector('#photo-prev').disabled = visibleCards.length < 2;
  document.querySelector('#photo-next').disabled = visibleCards.length < 2;
}
cards.forEach(card => card.addEventListener('click', () => {
  displayPhoto(card);
  dialog.showModal();
  document.body.classList.add('modal-open');
}));
function stepPhoto(direction) {
  const visibleCards = cards.filter(card => !card.hidden);
  const next = (visibleCards.indexOf(currentCard) + direction + visibleCards.length) % visibleCards.length;
  displayPhoto(visibleCards[next]);
}
document.querySelector('#photo-prev').addEventListener('click', () => stepPhoto(-1));
document.querySelector('#photo-next').addEventListener('click', () => stepPhoto(1));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { event.preventDefault(); stepPhoto(1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); stepPhoto(-1); }
});
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));

document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  document.querySelector('#service').value = link.dataset.service;
}));

// Static hosting: prepare an email and never imply that a message was sent.
const form = document.querySelector('#contact-form');
let preparedMessage = '';
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const service = data.get('service') || 'À préciser';
  preparedMessage = `Bonjour l’équipe CEG,\n\n${String(data.get('message')).trim()}\n\nExpertise : ${service}\nNom : ${String(data.get('name')).trim()}\nE-mail : ${data.get('email')}\nTéléphone : ${String(data.get('phone')).trim() || 'Non renseigné'}\n`;
  const subject = `Demande de projet — ${service}`;
  document.querySelector('#form-status').textContent = 'Votre demande est prête. Envoyez-la depuis votre messagerie pour nous la transmettre.';
  document.querySelector('#email-fallback').hidden = false;
  document.querySelector('#message-fallback').value = preparedMessage;
  window.location.href = `mailto:cayoreg@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(preparedMessage)}`;
});
document.querySelector('#copy-message').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(preparedMessage);
    document.querySelector('#form-status').textContent = 'Demande copiée. Collez-la dans un e-mail à cayoreg@gmail.com.';
  } catch {
    const fallback = document.querySelector('#message-fallback');
    fallback.hidden = false;
    fallback.focus();
    fallback.select();
    document.querySelector('#form-status').textContent = 'Sélectionnez et copiez le texte ci-dessous dans votre messagerie.';
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();
