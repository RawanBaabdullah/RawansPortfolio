window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const firstSection = document.querySelector('.main');
    
    // Check if we've scrolled past the first section
    if (window.scrollY > firstSection.offsetHeight) {
        header.style.backgroundColor = '#FFFFFF';  // Solid white background after scrolling
        header.style.boxShadow = '0 5px 25px rgba(1, 1, 1, 0.05)';  // Add shadow when solid
    } else {
        header.style.backgroundColor = 'transparent';  // Transparent background on first section
        header.style.boxShadow = 'none';  // Remove shadow when transparent
    }
});
