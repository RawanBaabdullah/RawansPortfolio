function copyEmail() {
    navigator.clipboard.writeText("rawankhaledba@gmail.com")
      .then(() => alert("Email copied to clipboard!"))
      .catch(err => alert("Failed to copy email"));
  }
  
  // Smooth scroll for nav links with responsive behavior
document.querySelectorAll('.navigation a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();

    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    const headerHeight = document.querySelector('.top-header').offsetHeight;

    if (targetSection) {
      let offsetTop;

      if (window.innerWidth <= 768) {
        // 📱 Mobile: scroll to top of section
        offsetTop = targetSection.offsetTop - headerHeight;
      } else {
        // 💻 Desktop: scroll to center of section
        const sectionTop = targetSection.offsetTop;
        const sectionHeight = targetSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        offsetTop = sectionTop - ((viewportHeight - sectionHeight) / 2);
      }

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});


