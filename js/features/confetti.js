// استهداف القسم الجديد باستخدام الـ id الجديد
const section = document.getElementById('feedback');

function launchConfetti() {
  confetti({
    particleCount: 200,
    spread: 200,
    origin: { y: 0.6 }
  });
}

const isMobile = window.innerWidth <= 768;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      // يطلق القصاصات الملونة في كل مرة يدخل فيها القسم إلى الشاشة
      if (entry.isIntersecting) {
        launchConfetti();
      }
    });
  },
  {
    threshold: isMobile ? 0.4 : 0.7 // تفعيل التأثير بشكل أبكر على شاشات الموبايل
  }
);

if (section) {
  observer.observe(section);
}