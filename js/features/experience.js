/**
 * ==========================================================
 * INTERACTION ARCHIVE ENGINE — EXPERIENCE LOGS
 * ==========================================================
 */

const EXP_SUPABASE_URL = "https://dlakqmnpavhthwydqloy.supabase.co";
const EXP_ANON_KEY = "sb_publishable_xzywZAbIh9Vaju0OP4d-xw_r5f9nZbV"; 

const streamTrack = document.getElementById("evolution-stream-track");

async function fetchExperience() {
  const API_URL = `${EXP_SUPABASE_URL}/rest/v1/experience?select=*&order=id.asc`;
  
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "apikey": EXP_ANON_KEY,
        "Authorization": `Bearer ${EXP_ANON_KEY}`,
        "Range-Unit": "items"
      }
    });

    if (!response.ok) throw new Error("Supabase corporate ledger transmission failed.");

    const experienceData = await response.json();
    
    if (!experienceData || experienceData.length === 0) {
      // إذا عادت البيانات فارغة بسبب الـ RLS، سيتم تنبيهك هنا
      if (streamTrack) {
        streamTrack.innerHTML = `<p style="padding:24px; color:var(--text-muted); font-size:14px;">Archive is empty. Please disable RLS in Supabase dashboard.</p>`;
      }
      return;
    }

    renderExperience(experienceData);
  } catch (error) {
    console.error("Critical System Warning: Unable to parse dynamic experience stream. Error:", error);
    if (streamTrack) {
      streamTrack.innerHTML = `<p style="padding:24px; color:var(--text-muted); font-size:14px;">Historical track temporarily offline for sync.</p>`;
    }
  }
}

function renderExperience(data) {
  if (!streamTrack) return;
  streamTrack.innerHTML = "";
  
  data.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("stream-card");
    
    // تأمين التحقق من حالة النشاط
    const isActive = item.is_active === true || String(item.is_active).toLowerCase() === "true";
    if (isActive) {
      card.classList.add("active-stream");
    }

    // تأمين معالجة الـ Tags بشكل سليم لمنع أي خطأ برمجي
    let tagsHTML = "";
    if (item.tags) {
      const tagsArray = typeof item.tags === "string" ? item.tags.split(",") : item.tags;
      if (Array.isArray(tagsArray)) {
        tagsHTML = tagsArray.map(tag => `<span>${tag.trim()}</span>`).join("");
      }
    }

    card.innerHTML = `
      <div class="stream-meta">
        <span class="stream-timeline">${item.timeline || ''}</span>
        <span class="stream-org">${item.org || ''}</span>
      </div>
      <h3 class="stream-position">${item.position || ''}</h3>
      <p class="stream-summary">${item.summary || ''}</p>
      <div class="stream-tags">
        ${tagsHTML}
      </div>
    `;
    
    streamTrack.appendChild(card);
  });
}

// تشغيل المحرك فور جاهزية الصفحة
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", fetchExperience);
} else {
  fetchExperience();
}