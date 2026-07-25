// js/features/hero.js

const HERO_SUPABASE_URL = "https://dlakqmnpavhthwydqloy.supabase.co";
const HERO_SUPABASE_ANON_KEY = "sb_publishable_xzywZAbIh9Vaju0OP4d-xw_r5f9nZbV";

async function initHeroFeature() {
  if (typeof supabase === "undefined" && !window.supabase) {
    console.error("❌ Supabase SDK is not loaded in window.supabase!");
    return;
  }

  const supabaseLib = window.supabase || supabase;
  const client = supabaseLib.createClient(HERO_SUPABASE_URL, HERO_SUPABASE_ANON_KEY);

  console.log("🔍 Fetching profile from 'hero' table...");

  try {
    // ⬇️ UPDATED TO MATCH YOUR TABLE NAME "hero"
    const { data, error } = await client
      .from("hero")
      .select("*")
      .limit(1);

    if (error) {
      console.error("❌ Supabase Query Error:", error);
      return;
    }

    if (!data || data.length === 0) {
      console.warn("⚠️ Query succeeded, but 'hero' table has 0 rows!");
      return;
    }

    const row = data[0];
    console.log("✅ Hero section data fetched:", row);

    // Helpers
    const setText = (id, text) => {
      const el = document.getElementById(id);
      if (el && text !== undefined && text !== null) el.textContent = text;
    };

    const setHref = (id, url) => {
      const el = document.getElementById(id);
      if (el && url) el.href = url;
    };

    // Populate Fields
    setText("hero-status", row.status_text);
    setText("hero-name", row.full_name);
    setText("hero-bio", row.bio);

    setText("hero-cta-text", row.cta_button_text);
    setHref("hero-cta-btn", row.cta_button_url);
    setHref("hero-linkedin", row.linkedin_url);
    setHref("hero-github", row.github_url);

    setText("hero-badge-1-title", row.badge_1_title);
    setText("hero-badge-1-subtitle", row.badge_1_subtitle);
    setText("hero-badge-2-title", row.badge_2_title);
    setText("hero-badge-2-subtitle", row.badge_2_subtitle);

    setText("floating-widget-text", row.floating_widget_text);
    setText("floating-widget-subtext", row.floating_widget_subtext);
    setHref("floating-connect-widget", row.floating_widget_url || row.linkedin_url);

    if (row.avatar_url) {
      document.querySelectorAll(".hero-avatar-target").forEach((img) => {
        img.src = row.avatar_url;
        img.alt = row.full_name || "Profile Picture";
      });
    }

  } catch (err) {
    console.error("❌ Unexpected Error in hero.js:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeroFeature);
} else {
  initHeroFeature();
}