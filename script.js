const hero = document.querySelector('.hero');
const sections = document.querySelectorAll('.section');
const stops = [hero, ...sections];
const dots = document.querySelectorAll('.dot');
const progress = document.querySelector('.scroll-progress');
const arrow = document.getElementById('scrollArrow');
const emailBtn = document.getElementById('emailBtn');
const emailStatus = document.getElementById('emailStatus');

// reveal text when scrolled into view
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const inner = entry.target.querySelector('.section-inner');
    if (inner) inner.classList.toggle('in', entry.isIntersecting);
  });
}, { threshold: 0.2 });

sections.forEach(s => revealObserver.observe(s));

// find stop closest to the screen center
function getActiveIndex() {
  const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
  if (isBottom) return stops.length - 1;

  const mid = window.scrollY + window.innerHeight / 2;
  let closest = 0;
  let minDiff = Infinity;

  stops.forEach((stop, i) => {
    const stopMid = stop.offsetTop + stop.offsetHeight / 2;
    const diff = Math.abs(mid - stopMid);
    if (diff < minDiff) {
      minDiff = diff;
      closest = i;
    }
  });

  return closest;
}

// smooth scroll to a stop
function goToStop(index) {
  const target = stops[index];
  if (!target) return;

  if (index === 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (index === stops.length - 1) {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// sync ui with scroll
function onScroll() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (progress && maxScroll > 0) {
    progress.style.width = `${(window.scrollY / maxScroll) * 100}%`;
  }

  const activeIndex = getActiveIndex();
  dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));

  sections.forEach((section) => {
    const sectionIndex = stops.indexOf(section);
    section.classList.toggle('in-focus', sectionIndex === activeIndex);
  });

  if (arrow) {
    const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
    arrow.classList.toggle('flipped', isBottom);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

// instant jump to hash target when coming back from subpages
if (window.location.hash) {
  const target = document.querySelector(window.location.hash);
  if (target) {
    target.scrollIntoView({ behavior: 'instant', block: 'center' });
    const inner = target.querySelector('.section-inner');
    if (inner) inner.classList.add('in');
  }
}

onScroll();

// dot clicks
dots.forEach((dot, i) => {
  dot.addEventListener('click', (e) => {
    e.preventDefault();
    goToStop(i);
  });
});

// hero button
const viewMore = document.querySelector('.hero .btn');
if (viewMore) {
  viewMore.addEventListener('click', (e) => {
    e.preventDefault();
    goToStop(1);
  });
}

// scroll arrow
if (arrow) {
  arrow.addEventListener('click', () => {
    const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
    if (isBottom) {
      goToStop(0);
    } else {
      goToStop(Math.min(getActiveIndex() + 1, stops.length - 1));
    }
  });
}

// keyboard nav (j / k / arrows)
window.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

  if (e.key === 'j' || e.key === 'ArrowDown') {
    e.preventDefault();
    goToStop(Math.min(getActiveIndex() + 1, stops.length - 1));
  } else if (e.key === 'k' || e.key === 'ArrowUp') {
    e.preventDefault();
    goToStop(Math.max(getActiveIndex() - 1, 0));
  }
});

// copy email button
let copyTimer = null;
let lastClick = 0;

if (emailBtn && emailStatus) {
  emailBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastClick < 800) return;
    lastClick = now;

    const email = 'danzcrackz@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      emailStatus.textContent = 'Email copied to clipboard';
      emailStatus.classList.add('show');

      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => emailStatus.classList.remove('show'), 2000);
    }).catch(() => {
      window.location.href = `mailto:${email}`;
    });
  });
}