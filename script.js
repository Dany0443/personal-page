// this script handles the UX of the personal my page

// utility function to capitalize first letter of a string      
function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

    document.querySelectorAll('.section').forEach(section=>{

        const inner = section.querySelector('.section-inner');
        const side  = section.dataset.side; // "left" or "right"

        let visible = false;

        const io = new IntersectionObserver(([entry])=>{
            if(entry.isIntersecting && entry.intersectionRatio > 0.5){
              inner.classList.add('in');
            } else if(!entry.isIntersecting){
              inner.classList.remove('in');
            }
        }, { threshold: [0, 0.5] });

            io.observe(section);
        });

// scroll progress bar
    const progressBar = document.querySelector('.scroll-progress');
    function updateProgress(){
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';     
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    // dot navigation
        const dots = document.querySelectorAll('.dot');

        const dotSections = [...dots].map(dot => {
          const href = dot.getAttribute('href');
          if(href === '#') return document.querySelector('.hero');
          return document.querySelector(href);
        });
        // observe sections and update active dot
        const dotObserver = new IntersectionObserver((entries)=>{
          entries.forEach(entry=>{
            if(entry.isIntersecting){
              const index = dotSections.indexOf(entry.target);
              if(index !== -1){
                dots.forEach((dot, i)=> dot.classList.toggle('active', i === index));
              }
            }
          });
        }, { threshold: 0.5 });

        dotSections.forEach(section => { if(section) dotObserver.observe(section); });


const scrollArrow = document.getElementById('scrollArrow');

// build ordered list of all "stops": hero + every section
const allStops = [document.querySelector('.hero'), ...document.querySelectorAll('.section')];

function getCurrentStopIndex(){
  const scrollPos = window.scrollY + window.innerHeight / 2;
  let current = 0;
  allStops.forEach((stop, i)=>{
    if(stop.offsetTop <= scrollPos) current = i;
  });
  return current;
}

function updateArrowState(){
  const atBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 10;
  scrollArrow.classList.toggle('flipped', atBottom);
}

scrollArrow.addEventListener('click', ()=>{
  const atBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 10;

  if(atBottom){
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const currentIndex = getCurrentStopIndex();
  const nextIndex = Math.min(currentIndex + 1, allStops.length - 1);
  allStops[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
});

window.addEventListener('scroll', updateArrowState, { passive: true });
updateArrowState();