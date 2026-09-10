document.body.classList.add('dim');

const envelope = document.getElementById('envelope');
const letter = document.getElementById('letter');
const pages = document.querySelectorAll('.page-flow');
const memoryContainer = document.getElementById('memories');
const previousButton = document.getElementById('previousButton');
const nextButton = document.getElementById('nextButton');
const pageIndicator = document.getElementById('pageIndicator');
const instruction = document.getElementById('instruction');
const secretMessage = document.getElementById('secretMessage');
const controls = document.querySelector('.letter-controls');
const MEMORY_COUNT = 48;

let currentPage = 0;
let opened = false;
let completed = false;
let isAnimating = false;

// Memórias
for (let i = 0; i < MEMORY_COUNT; i++) {
  const m = document.createElement('div');
  m.classList.add('memory');

  const size = Math.random() * 3 + 2;
  const duration = Math.random() * 6 + 4;
  const delay = Math.random() * 5;

  m.style.width = `${size}px`;
  m.style.height = `${size}px`;
  m.style.left = `${Math.random() * 100}vw`;
  m.style.top = `${Math.random() * 100}vh`;
  m.style.animationDuration = `${duration}s`;
  m.style.animationDelay = `${delay}s`;
  m.style.animationTimingFunction =
  Math.random() > 0.5
    ? 'cubic-bezier(0.6, 0.2, 0.4, 1)'
    : 'ease-in-out';

  memoryContainer.appendChild(m);
}

// Abertura da carta
function updateNavigation() {
  pageIndicator.textContent = `Página ${currentPage + 1} de ${pages.length}`;
  previousButton.disabled = !opened || completed || currentPage === 0 || isAnimating;
  nextButton.disabled = !opened || completed || isAnimating;
  pages.forEach((page, index) => page.setAttribute('aria-hidden', String(index !== currentPage)));
}

function showPage(index) {
  if (index < 0 || index >= pages.length || isAnimating) return;
  const current = pages[currentPage];
  const next = pages[index];
  if (currentPage === index) return;
  isAnimating = true;
  current.classList.add(index > currentPage ? 'exit' : 'exit-back');
  current.classList.remove('active');
  setTimeout(() => {
    current.classList.remove('exit', 'exit-back');
    next.classList.add('active');
    currentPage = index;
    isAnimating = false;
    updateNavigation();
  }, 600);
  updateNavigation();
}

function openLetter() {
  if (isAnimating || completed) return;
  if (envelope.classList.contains('closed-final')) {
    envelope.classList.remove('closed-final');
  }
  if (opened) return;
  letter.classList.remove('closing', 'fade-out');
  pages.forEach(page => page.classList.remove('active', 'exit'));
  currentPage = 0;
  pages[0].classList.add('active');
  opened = true;
  envelope.classList.add('open');
  envelope.setAttribute('aria-expanded', 'true');
  envelope.setAttribute('aria-label', 'Carta aberta');
  instruction.textContent = 'Clique na carta ou use as setas para continuar';
  secretMessage.classList.remove('visible');
  controls.classList.remove('hidden');
  updateNavigation();

  if (!document.querySelector('.initial-seal')) {
    const seal = document.createElement('div');
    seal.classList.add('seal', 'initial-seal');
    seal.innerHTML = '<span>♥</span>';
    envelope.appendChild(seal);
  }

  setTimeout(() => {
    const seal = document.querySelector('.initial-seal');
    if (seal) seal.remove();
  }, 800);
}

envelope.addEventListener('click', openLetter);
envelope.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openLetter();
  }
});
letter.addEventListener('click', event => {
  event.stopPropagation();
  if (!opened || isAnimating) return;
  if (currentPage === pages.length - 1) endLetter();
  else showPage(currentPage + 1);
});
previousButton.addEventListener('click', () => showPage(currentPage - 1));
nextButton.addEventListener('click', () => {
  if (currentPage === pages.length - 1) endLetter();
  else showPage(currentPage + 1);
});

// Encerramento da carta
function endLetter() {
  if (envelope.classList.contains('closed-final') || !opened || completed) return;

  isAnimating = true;
  completed = true;

  letter.classList.add('closing');

  pages[currentPage].classList.remove('active');

  setTimeout(() => {
    envelope.classList.remove('open');
  }, 200);

  setTimeout(() => {
    envelope.classList.add('closed-final');
  }, 900);

  setTimeout(() => {
    const oldSeal = envelope.querySelector('.final-seal');
    if (oldSeal) oldSeal.remove();

    const finalSeal = document.createElement('div');
    finalSeal.classList.add('seal', 'final-seal', 'animate');
    finalSeal.innerHTML = '<span>♥</span>';
    envelope.appendChild(finalSeal);
  }, 900);

  setTimeout(() => {
    const secret = document.getElementById('secretMessage');
    letter.classList.add('fade-out');
    opened = false;
    isAnimating = false;
    envelope.setAttribute('aria-expanded', 'false');
    envelope.setAttribute('aria-label', 'Carta encerrada');
    envelope.setAttribute('aria-disabled', 'true');
    envelope.removeAttribute('tabindex');
    secretMessage.classList.add('visible');
    controls.classList.add('hidden');
    instruction.textContent = '';
    updateNavigation();
  }, 5000);
}

updateNavigation();
