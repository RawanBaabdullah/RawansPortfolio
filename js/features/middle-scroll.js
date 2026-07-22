// js/features/middle-scroll.js
document.querySelector('a[href="#projects-section"]').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('#projects-section').scrollIntoView({
      behavior: 'smooth',
      block: 'center'  // Centers the section in the viewport
    });
  });
  
  document.querySelector('a[href="#about-section"]').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('#about-section').scrollIntoView({
      behavior: 'smooth',
      block: 'center'  // Centers the section in the viewport
    });
  });
  