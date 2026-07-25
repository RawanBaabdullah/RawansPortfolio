// js/features/skills.js

const SKILLS_SUPABASE_URL = "https://dlakqmnpavhthwydqloy.supabase.co";
const SKILLS_SUPABASE_ANON_KEY = "sb_publishable_xzywZAbIh9Vaju0OP4d-xw_r5f9nZbV"; 

function initSkillsFeature() {
  const gridContainer = document.querySelector(".matrix-skills-grid");
  if (!gridContainer || !window.supabase) return;

  const supabaseClient = window.supabase.createClient(SKILLS_SUPABASE_URL, SKILLS_SUPABASE_ANON_KEY);

  let allSkills = [];
  let filteredSkills = [];

  async function fetchSkills() {
    try {
      const { data, error } = await supabaseClient
        .from("skills")
        .select("*")
        .order("display_order", { ascending: true });

      if (error || !data || data.length === 0) {
        gridContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 14px;">No skills available.</p>`;
        return;
      }

      allSkills = data;
      filteredSkills = [...allSkills];
      renderGrid();
    } catch (err) {
      console.error("❌ Error fetching skills:", err);
    }
  }

  function renderCardHTML(skill) {
    const categoryLabel = skill.skill_category_label || skill.category || 'Skill';
    const titleText = skill.title || 'Untitled Skill';
    const descText = skill.description || '';
    const isCore = skill.is_core || false;
    const tooltipText = skill.tooltip_text || 'Core Tool';

    return `
    <div class="skill-card ${isCore ? 'is-core' : ''}" data-category="${skill.category || ''}">
      <div class="skill-header">
        <span class="skill-category">${categoryLabel}</span>
        ${
          isCore
            ? `<span class="skill-badge core-primary" data-tooltip="${tooltipText}">
                <i class="fa-solid fa-star"></i> Primary Skill
               </span>`
            : ''
        }
      </div>
      <h3 class="skill-title">${titleText}</h3>
      <p class="skill-desc">${descText}</p>
    </div>
  `;
  }

  function renderGrid() {
    if (filteredSkills.length === 0) {
      gridContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 14px;">No skills in this category.</p>`;
      return;
    }

    const isMobile = window.innerWidth <= 850;

    if (isMobile) {
      // Group cards into slides of 2 on mobile
      let slidesHTML = "";
      for (let i = 0; i < filteredSkills.length; i += 2) {
        const pair = filteredSkills.slice(i, i + 2);
        slidesHTML += `
          <div class="skill-slide">
            ${pair.map(renderCardHTML).join('')}
          </div>
        `;
      }
      gridContainer.innerHTML = slidesHTML;
    } else {
      // Standard grid render on desktop
      gridContainer.innerHTML = filteredSkills.map(renderCardHTML).join('');
    }

    gridContainer.scrollLeft = 0;
    setTimeout(updateControls, 50);

    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  }

  function getScrollStep() {
    return gridContainer.clientWidth;
  }

  function updateControls() {
    const prevBtn = document.querySelector(".prev-matrix-btn");
    const nextBtn = document.querySelector(".next-matrix-btn");
    const pageIndicator = document.querySelector(".matrix-page-indicator");

    if (!gridContainer || filteredSkills.length === 0) return;

    const scrollLeft = gridContainer.scrollLeft;
    const containerWidth = gridContainer.clientWidth || 1;
    const maxScroll = gridContainer.scrollWidth - containerWidth;

    // Enable/Disable Nav Buttons
    if (prevBtn) prevBtn.disabled = scrollLeft <= 10;
    if (nextBtn) nextBtn.disabled = scrollLeft >= maxScroll - 10;

    const isMobile = window.innerWidth <= 850;
    const itemsPerPage = isMobile ? 2 : 4;
    const totalCards = filteredSkills.length;

    // Calculate current page (1-based index)
    const totalPages = Math.ceil(totalCards / itemsPerPage) || 1;
    let currentPage = Math.round(scrollLeft / containerWidth) + 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    // Cumulative total cards shown up to current page view
    const visibleCardsCount = Math.min(currentPage * itemsPerPage, totalCards);

    // Displays "2 / 10", "4 / 10", ..., "10 / 10" on mobile
    if (pageIndicator) {
      pageIndicator.textContent = `${visibleCardsCount} / ${totalCards}`;
    }
  }

  const prevBtn = document.querySelector(".prev-matrix-btn");
  const nextBtn = document.querySelector(".next-matrix-btn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      gridContainer.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      gridContainer.scrollBy({ left: getScrollStep(), behavior: "smooth" });
    });
  }

  gridContainer.addEventListener("scroll", updateControls);
  
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      renderGrid();
    }, 150);
  });

  // Tab Filtering
  const tabBtns = document.querySelectorAll(".matrix-tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-category");
      filteredSkills = (category === "all") 
        ? [...allSkills] 
        : allSkills.filter(item => item.category === category);

      renderGrid();
    });
  });

  fetchSkills();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSkillsFeature);
} else {
  initSkillsFeature();
}