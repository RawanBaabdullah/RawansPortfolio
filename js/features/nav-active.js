// js/features/nav-active.js
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".navigation a");
    
    window.addEventListener("scroll", function () {
      let current = "";
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 150; // triggers earlier
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute("id");
        }
      });
    
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
          link.classList.add("active");
        }
      });
    });
  });
  