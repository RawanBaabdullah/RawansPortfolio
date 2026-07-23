/**
 * ==========================================================
 * INTERACTION ARCHIVE ENGINE — PROJECTS SLIDER
 * ==========================================================
 */

const PROJECT_SUPABASE_URL = "https://dlakqmnpavhthwydqloy.supabase.co";
const PROJECT_ANON_KEY = "sb_publishable_xzywZAbIh9Vaju0OP4d-xw_r5f9nZbV"; 


const sliderContainer = document.querySelector(".projects-slider-container");
const sliderTrack = document.getElementById("projects-slider-track");
const dotsContainer = document.getElementById("custom-slider-dots");
const prevBtn = document.querySelector(".prev-arrow");
const nextBtn = document.querySelector(".next-arrow");

let projectsData = [];
let activeSlideIndex = 0;

async function fetchProjects() {
  const API_URL = `${PROJECT_SUPABASE_URL}/rest/v1/projects?select=*&order=id.asc`;
  
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "apikey": PROJECT_ANON_KEY,
        "Authorization": `Bearer ${PROJECT_ANON_KEY}`
      }
    });

    if (!response.ok) throw new Error("Supabase transmission failed.");

    projectsData = await response.json();
    renderProjects();
    initializeSlider();
  } catch (error) {
    console.error("Critical System Warning: Unable to parse dynamic projects archive. Error:", error);
    if (sliderTrack) {
      sliderTrack.innerHTML = `<p style="padding:24px; color:var(--text-muted); font-size:14px;">Archive temporarily locked for system updates.</p>`;
    }
  }
}

function renderProjects() {
  if (!sliderTrack) return;
  sliderTrack.innerHTML = "";
  
  projectsData.forEach((project) => {
    const card = document.createElement("div");
    card.classList.add("project-card");
    
    const isLocked = project.is_locked === true || String(project.is_locked).toLowerCase() === "true";

    let actionButtonHTML = "";
    if (isLocked) {
      actionButtonHTML = `
        <div class="locked-btn-wrapper">
          <span class="nda-tooltip">Confidential project — Case </br> study restricted</span>
          <button class="button no-text-link locked-btn" type="button" onclick="if(typeof showReportingModal === 'function'){ showReportingModal(event); } else { event.preventDefault(); }">
            <i data-feather="lock"></i>
          </button>
        </div>
      `;
    } else {
      actionButtonHTML = `
        <a href="${project.link || '#'}" target="_blank" class="button no-text-link">
          <i data-feather="arrow-up-right"></i>
        </a>
      `;
    }

    card.innerHTML = `
      <div class="image-content">
        <img src="${project.img || 'assets/images/fallback.png'}" alt="${project.name}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'">
      </div>
      <div class="card-content">
        <div class="project-tag">${project.tag || 'Case Study'}</div>
        <h2 class="name">${project.name || 'Untitled Concept'}</h2>
        <p class="description">${project.description || ''}</p> 
        ${actionButtonHTML}
      </div>
    `;
    
    sliderTrack.appendChild(card);
  });

  if (typeof feather !== "undefined") {
    feather.replace();
  }
}

function initializeSlider() {
  if (!sliderContainer || !sliderTrack) return;

  const cards = sliderTrack.children;
  if (cards.length === 0) return;

  const DOT_SIZE = 8;            
  const GAP = 10;                
  const ACTIVE_PILL_WIDTH = 24;  

  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    
    dotsContainer.style.display = "flex";
    dotsContainer.style.alignItems = "center";
    dotsContainer.style.justifyContent = "flex-start"; 
    dotsContainer.style.gap = `${GAP}px`;
    dotsContainer.style.overflow = "hidden";
    
    dotsContainer.style.width = "78px"; 
    dotsContainer.style.padding = "4px 2px"; 
    dotsContainer.style.margin = "0 auto"; /* Top margin zeroed in JS */
    dotsContainer.style.position = "relative";

    Array.from(cards).forEach((_, idx) => {
      const dotButton = document.createElement("button");
      dotButton.classList.add("custom-dot");
      
      dotButton.style.boxSizing = "border-box";
      dotButton.style.width = `${DOT_SIZE}px`;               
      dotButton.style.height = `${DOT_SIZE}px`;
      dotButton.style.padding = "0";
      dotButton.style.border = "none"; 
      dotButton.style.borderRadius = "20px"; 
      dotButton.style.flexShrink = "0";
      dotButton.style.cursor = "pointer";
      dotButton.style.backgroundColor = "rgba(0, 0, 0, 0.16)"; 
      dotButton.style.transition = "width 0.28s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.28s ease, transform 0.28s ease";

      if (idx === 0) {
        dotButton.classList.add("active");
        dotButton.style.width = `${ACTIVE_PILL_WIDTH}px`;
        dotButton.style.backgroundColor = "#D417BC"; /* Brand Pink */
      }
      
      dotButton.addEventListener("click", () => {
        const cardWidth = cards[0].getBoundingClientRect().width + 24; 
        sliderContainer.scrollTo({
          left: idx * cardWidth,
          behavior: "smooth"
        });
      });
      dotsContainer.appendChild(dotButton);
    });
  }

  function syncUIIndicators() {
    const cardWidth = cards[0].getBoundingClientRect().width + 24;
    const scrolledAmount = sliderContainer.scrollLeft;
    
    activeSlideIndex = Math.round(scrolledAmount / cardWidth);

    const dots = dotsContainer ? dotsContainer.querySelectorAll(".custom-dot") : [];
    
    dots.forEach((dot, idx) => {
      if (idx === activeSlideIndex) {
        dot.classList.add("active");
        dot.style.width = `${ACTIVE_PILL_WIDTH}px`;
        dot.style.backgroundColor = "#D417BC"; /* Brand Pink */
      } else {
        dot.classList.remove("active");
        dot.style.width = `${DOT_SIZE}px`;
        dot.style.backgroundColor = "rgba(0, 0, 0, 0.16)";
      }
    });

    if (dots.length > 0) {
      const containerCenter = 78 / 2;
      
      let activeDotLeftOffset = 0;
      for (let i = 0; i < activeSlideIndex; i++) {
        activeDotLeftOffset += DOT_SIZE + GAP;
      }
      
      const activeDotCenter = activeDotLeftOffset + (ACTIVE_PILL_WIDTH / 2);
      let moveAmount = activeDotCenter - containerCenter;
      
      if (moveAmount < 0) moveAmount = 0;
      
      const maxScrollableDotsWidth = (dots.length * DOT_SIZE) + ((dots.length - 1) * GAP) + (ACTIVE_PILL_WIDTH - DOT_SIZE);
      if (moveAmount > maxScrollableDotsWidth - 78) {
        moveAmount = maxScrollableDotsWidth - 78;
      }

      dots.forEach((dot) => {
        dot.style.transform = `translateX(-${moveAmount}px)`;
      });
    }

    if (prevBtn) prevBtn.disabled = activeSlideIndex === 0;
    if (nextBtn) nextBtn.disabled = activeSlideIndex >= cards.length - 1 || (sliderContainer.scrollLeft + sliderContainer.clientWidth >= sliderTrack.scrollWidth - 10);
  }

  sliderContainer.addEventListener("scroll", syncUIIndicators, { passive: true });

  if (nextBtn) {
    nextBtn.removeAttribute("disabled");
    nextBtn.onclick = (e) => {
      e.preventDefault();
      const cardWidth = cards[0].getBoundingClientRect().width + 24;
      sliderContainer.scrollBy({ left: cardWidth, behavior: "smooth" });
    };
  }

  if (prevBtn) {
    prevBtn.onclick = (e) => {
      e.preventDefault();
      const cardWidth = cards[0].getBoundingClientRect().width + 24;
      sliderContainer.scrollBy({ left: -cardWidth, behavior: "smooth" });
    };
  }

  syncUIIndicators();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", fetchProjects);
} else {
  fetchProjects();
}