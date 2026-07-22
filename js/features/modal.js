function showReportingModal(event) {
    event.preventDefault();
    const modal = document.getElementById("reportingModal");
    modal.style.display = "flex";
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("reportingModal");
    const closeBtn = modal.querySelector(".close");
  
    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });
  
    window.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  
    feather.replace();
  });
  