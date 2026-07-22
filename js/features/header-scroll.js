document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.top-header');
    const heroLeft = document.querySelector('.hero-left');
    const heroCenter = document.querySelector('.hero-center');
    const offsetBuffer = 80;
  
    if (!header || !heroLeft || !heroCenter) return;
  
    // Function to handle the scroll behavior
    function handleScroll() {
      const isMobile = window.innerWidth <= 768;
      const triggerElement = isMobile ? heroCenter : heroLeft;
  
      const triggerPoint = triggerElement.getBoundingClientRect().top + window.scrollY - offsetBuffer;
  
      if (window.scrollY >= triggerPoint) {
        header.style.backgroundColor = '#FFFFFF';
        header.style.boxShadow = '0 5px 25px rgba(1, 1, 1, 0.05)';
      } else {
        header.style.backgroundColor = 'transparent';
        header.style.boxShadow = 'none';
      }
    }
  
    // Run on scroll
    window.addEventListener('scroll', handleScroll);
  
    // Also run once on page load
    handleScroll();
  });
  