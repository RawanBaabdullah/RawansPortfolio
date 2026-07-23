const section = document.getElementById('feedback');

// 1. Detect Mobile
const isMobile = window.innerWidth <= 768;

function launchConfetti() {
  if (typeof confetti !== 'function') return;

  confetti({
    // Scaled down particle count on mobile to keep frame rate high
    particleCount: isMobile ? 50 : 120, 
    spread: isMobile ? 80 : 160,
    origin: { y: 0.6 },
    disableForReducedMotion: true
  });
}

// Track if confetti has already fired once to avoid continuous lagging while scrolling
let hasTriggered = false;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasTriggered) {
        launchConfetti();
        hasTriggered = true; // Prevents re-firing on scroll back-and-forth

        // Unobserve after firing to free up browser memory entirely
        if (section) observer.unobserve(section); 
      }
    });
  },
  {
    threshold: isMobile ? 0.2 : 0.5 // Trigger earlier without blocking UI thread
  }
);

if (section) {
  observer.observe(section);
}