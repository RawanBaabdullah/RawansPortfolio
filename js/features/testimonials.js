// 1. إعدادات الاتصال بـ Supabase الخاصة بمشروعك
const SUPABASE_URL = "https://dlakqmnpavhthwydqloy.supabase.co";
// ⚠️ تذكير: ضعي هنا مفتاح الـ Publishable الكامـل (الذي يبدأ بـ sb_publishable_) وليس الـ secret key!
const SUPABASE_ANON_KEY = "sb_publishable_xzywZAbIh9Vaju0OP4d-xw_r5f9nZbV"; 

const cardContainer = document.getElementById("card-container");
const loadMoreButton = document.getElementById("load-more-button");

let testimonialsData = [];
let currentIndex = 0;
const cardsPerClick = 3;

// مصفوفة الألوان الخاصة بكِ بالتتابع المطلوب
const avatarColors = ["#AAC6F3", "#DEA3E1", "#EDDA8A", "#C2ACEE"];

// دالة تجلب اللون بناءً على الترتيب وتكرر السلسلة بمجرد انتهائها
function getAvatarColor(cardIndex) {
  return avatarColors[cardIndex % avatarColors.length];
}

// 2. دالة جلب البيانات من جدول Peer Feedback في Supabase
async function fetchTestimonials() {
  const API_URL = `${SUPABASE_URL}/rest/v1/Peer%20Feedback?select=*&order=id.asc`; 
  
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) throw new Error("Failed to fetch data from database");

    testimonialsData = await response.json();
    loadTestimonials(); 
  } catch (error) {
    console.error("Error loading testimonials:", error);
    if (loadMoreButton) loadMoreButton.style.display = "none";
  }
}

// 3. دالة بناء وهيكلة البطاقات بطابع الـ UX الحديث
function loadTestimonials() {
  if (!cardContainer) return;
  
  const nextCards = testimonialsData.slice(currentIndex, currentIndex + cardsPerClick);

  // هنا قمنا بإضافة الـ index داخل الـ forEach لتحديد الترتيب بدقة وتلافي أي خطأ
  nextCards.forEach((testimonial, index) => {
    const card = document.createElement("div");
    card.classList.add("feedback-card");
    
    // استخراج الحروف الأولى تلقائياً من الاسم (Nadia Almarashi -> NA)
    const initials = testimonial.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    // حساب الترتيب الفعلي للبطاقة (حتى لو كانت في الصفحات التالية عند الضغط على Load More)
    const absoluteIndex = currentIndex + index;
    const bgAvatarColor = getAvatarColor(absoluteIndex);
    
    // فحص ذكي للصور لمنع ظهور الأيقونات المكسورة في المتصفحات
    const hasValidImage = testimonial.img && testimonial.img.trim() !== "" && !testimonial.img.includes("assets/images/");

    card.innerHTML = `
      <div class="card-quote-icon">“</div>
      <div class="card-body">
        <p class="feedback-text">“${testimonial.text}”</p>
      </div>
      <div class="card-header">
        <div class="user-avatar-professional" style="background-color: ${bgAvatarColor};">
          ${hasValidImage 
            ? `<img src="${testimonial.img}" alt="${testimonial.name}" onerror="this.style.display='none'; this.parentNode.innerText='${initials}'">`
            : `<span>${initials}</span>`
          }
        </div>
        <div class="user-info">
          <h4 class="user-name">${testimonial.name}</h4>
          <span class="user-role">${testimonial.title}، ${testimonial.team}</span>
        </div>
      </div>
    `;
    cardContainer.appendChild(card);
  });

  currentIndex += cardsPerClick;

  if (currentIndex >= testimonialsData.length) {
    if (loadMoreButton) loadMoreButton.style.display = "none";
  }
}

// تشغيل جلب البيانات الفوري
fetchTestimonials();

if (loadMoreButton) {
  loadMoreButton.addEventListener("click", loadTestimonials);
}

// ==========================================
// 4. تأثير الـ Confetti Popper عند كل تمرير للقسم
// ==========================================
const section = document.getElementById('feedback');

function launchConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 170,
      origin: { y: 0.6 }
    });
  } else {
    console.warn("Canvas Confetti library is not loaded.");
  }
}

if (section) {
  const isMobile = window.innerWidth <= 768;
  let hasTriggered = false; // تتبع حالة التشغيل لمنع الفاير المزدوج أثناء التمرير البطيء

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!hasTriggered) {
            launchConfetti();
            hasTriggered = true; // نحدد أنه تم الإطلاق
          }
        } else {
          hasTriggered = false; // عند الخروج من القسم، نعيد تعيين الحالة لتعمل المرة القادمة!
        }
      });
    },
    { 
      threshold: isMobile ? 0.2 : 0.35 
    }
  );

  observer.observe(section);
} else {
  console.warn("Element with id 'feedback' was not found in the DOM.");
}