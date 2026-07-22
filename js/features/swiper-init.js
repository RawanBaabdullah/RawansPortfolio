/*var swiper = new Swiper(".slide-content", {
    slidesPerView: 3,
    spaceBetween: 25,
    loop: false,
    centerSlide: "true",
    fade: "true",
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    mousewheel: {
      forceToAxis: true,
      sensitivity: 1,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      520: {
        slidesPerView: 2,
      },
      950: {
        slidesPerView: 3,
      },
    },
  });*/

  document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".projects-slider-container");
    const track = document.querySelector(".projects-slider-track");
    const dotsContainer = document.querySelector(".custom-slider-dots");
    const cards = document.querySelectorAll(".project-card");
    const prevBtn = document.querySelector(".prev-arrow");
    const nextBtn = document.querySelector(".next-arrow");
  
    if (!container || cards.length === 0) return;
  
    // 1. Generate active dot controls
    if (dotsContainer) {
      cards.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.classList.add("custom-dot");
        if (index === 0) dot.classList.add("active");
        
        dot.addEventListener("click", () => {
          scrollToCard(index);
        });
        dotsContainer.appendChild(dot);
      });
    }
  
    const dots = Array.from(document.querySelectorAll(".custom-dot"));
  
    // Sizing calculation helper (UX dynamic dots)
    function updateDynamicDots(activeIndex) {
      if (dots.length === 0) return;
  
      dots.forEach((dot, index) => {
        dot.className = "custom-dot";
        const distance = Math.abs(index - activeIndex);
  
        if (index === activeIndex) {
          dot.classList.add("active");
        } else if (distance === 1) {
          dot.classList.add("sibling-1");
        } else if (distance === 2) {
          dot.classList.add("sibling-2");
        } else {
          dot.classList.add("shrunk");
        }
      });
  
      const dotWidth = 16; 
      const offset = -(activeIndex - 2) * dotWidth;
      const safeOffset = Math.min(0, Math.max(-(dots.length - 5) * dotWidth, offset));
      dotsContainer.style.transform = `translateX(${safeOffset}px)`;
    }
  
    // Helper to scroll smoothly to a specific card index
    function scrollToCard(index) {
      const cardGap = parseInt(window.getComputedStyle(track).gap || 24);
      const cardWidth = cards[0].offsetWidth + cardGap;
      container.scrollTo({ left: cardWidth * index, behavior: "smooth" });
    }
  
    // Helper to toggle Disabled Arrow states dynamically based on scroll boundaries
    function updateArrowStates() {
      const scrollPosition = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      const cardGap = parseInt(window.getComputedStyle(track).gap || 24);
      const cardWidth = cards[0].offsetWidth + cardGap;
      const activeIndex = Math.round(scrollPosition / cardWidth);
  
      if (prevBtn) prevBtn.disabled = activeIndex === 0;
      if (nextBtn) nextBtn.disabled = activeIndex >= cards.length - 1 || scrollPosition >= maxScroll - 10;
    }
  
    // 2. Click listeners for navigation arrows
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        const cardGap = parseInt(window.getComputedStyle(track).gap || 24);
        const cardWidth = cards[0].offsetWidth + cardGap;
        const activeIndex = Math.round(container.scrollLeft / cardWidth);
        if (activeIndex > 0) {
          scrollToCard(activeIndex - 1);
        }
      });
  
      nextBtn.addEventListener("click", () => {
        const cardGap = parseInt(window.getComputedStyle(track).gap || 24);
        const cardWidth = cards[0].offsetWidth + cardGap;
        const activeIndex = Math.round(container.scrollLeft / cardWidth);
        if (activeIndex < cards.length - 1) {
          scrollToCard(activeIndex + 1);
        }
      });
    }
  
    // 3. Listen to native container scroll to update dots & arrows together
    container.addEventListener("scroll", () => {
      const cardGap = parseInt(window.getComputedStyle(track).gap || 24);
      const cardWidth = cards[0].offsetWidth + cardGap;
      const scrollPosition = container.scrollLeft;
      
      const activeIndex = Math.round(scrollPosition / cardWidth);
      
      updateDynamicDots(activeIndex);
      updateArrowStates();
    });
  
    // Init default layout states
    updateDynamicDots(0);
    updateArrowStates();
  });

//SKILLS JS
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".matrix-tab-btn");
  const cards = Array.from(document.querySelectorAll(".skill-card"));
  const prevBtn = document.querySelector(".prev-matrix-btn");
  const nextBtn = document.querySelector(".next-matrix-btn");
  const pageIndicator = document.querySelector(".matrix-page-indicator");

  if (cards.length === 0) return;

  let currentCategory = "all";
  let currentPage = 1;
  let filteredCards = [];

  // Responsive items per page (UX Best Practice)
  function getCardsPerPage() {
    return window.innerWidth <= 640 ? 2 : 4;
  }

  // 1. Core calculation system
  function updatePagination() {
    const CARDS_PER_PAGE = getCardsPerPage();

    // Filter cards belonging to the active category
    filteredCards = cards.filter(card => {
      const cardCategory = card.getAttribute("data-category");
      return currentCategory === "all" || cardCategory === currentCategory;
    });

    const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE) || 1;

    // Ensure current page does not exceed bounds of a newly selected category
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    // Toggle button active/inactive states
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;

    // Render text output
    if (pageIndicator) {
      pageIndicator.textContent = `${currentPage} / ${totalPages}`;
    }

    // Determine slice range for the page
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;

    // Hide all cards cleanly (removing inline display overrides)
    cards.forEach(card => {
      card.style.display = ""; // Reset inline display styles
      card.classList.add("hidden");
      card.classList.add("fade-out");
    });

    // Reveal only the active slice for this page
    filteredCards.forEach((card, index) => {
      if (index >= startIndex && index < endIndex) {
        card.classList.remove("hidden");

        // Small delay to trigger smooth CSS fade-in
        setTimeout(() => {
          card.classList.remove("fade-out");
        }, 30);
      }
    });
  }

  // 2. Tab Navigation Listener
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      currentCategory = tab.getAttribute("data-category");
      currentPage = 1; // Always reset to page 1 on category change
      updatePagination();
    });
  });

  // 3. Arrow Click Listeners
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        updatePagination();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const CARDS_PER_PAGE = getCardsPerPage();
      const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE) || 1;
      if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
      }
    });
  }

  // 4. Handle window resize (Adjust card count dynamic on screen rotate/resize)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updatePagination();
    }, 150);
  });

  // Initial Run
  updatePagination();
});