// // // Initialize EmailJS
// // (function () {
// //     emailjs.init("KXjG-FT3eJXiKwJQR");
// //   })();

// // // Function to send the message
// // (function() {
// //     emailjs.init("KXjG-FT3eJXiKwJQR");
// //   })();
  
// //   function sendMessage() {
// //     const serviceID = "service_2qvid1q";
// //     const templateID = "template_fdl9dsd";
  
// //     const params = {
// //       sendername: document.querySelector("#name").value,
// //       senderemail: document.querySelector("#email").value,
// //       subject: document.querySelector("#subject").value,
// //       message: document.querySelector("#message").value,
// //     };
  
// //     emailjs.send(serviceID, templateID, params)
// //       .then(() => {
// //         alert(`Thank you ${params.sendername}! Your message has been sent.`);
// //         document.querySelector(".contact-form").reset();
// //       })
// //       .catch((err) => {
// //         console.error("EmailJS Error:", err);
// //         alert("Failed to send message. Please try again.");
// //       });
// //   }
  




// // Initialize EmailJS (only need to call this once)
// (function () {
//   if (typeof emailjs !== "undefined") {
//     emailjs.init("KXjG-FT3eJXiKwJQR");
//   }
// })();

// function sendMessage() {
//   const form = document.getElementById("contact-form") || document.querySelector(".terminal-form-engine");
  
//   // Basic HTML validation check
//   if (form && !form.checkValidity()) {
//     form.reportValidity();
//     return;
//   }

//   const serviceID = "service_2qvid1q";
//   const templateID = "template_fdl9dsd";

//   const submitBtn = document.querySelector(".terminal-submit-btn");
//   if (submitBtn) submitBtn.disabled = true;

//   const params = {
//     sendername: document.querySelector("#name").value,
//     senderemail: document.querySelector("#email").value,
//     subject: document.querySelector("#subject").value,
//     message: document.querySelector("#message").value,
//   };

//   emailjs.send(serviceID, templateID, params)
//     .then(() => {
//       alert(`Thank you ${params.sendername}! Your message has been sent successfully.`);
//       if (form) form.reset();
//     })
//     .catch((err) => {
//       console.error("EmailJS Error:", err);
//       alert("Failed to send message. Please try again or reach out directly via email.");
//     })
//     .finally(() => {
//       if (submitBtn) submitBtn.disabled = false;
//     });
// }


// Initialize EmailJS
(function () {
  if (typeof emailjs !== "undefined") {
    emailjs.init("KXjG-FT3eJXiKwJQR");
  }
})();

function sendMessage() {
  const form = document.getElementById("contact-form") || document.querySelector(".terminal-form-engine");
  const fieldsWrapper = document.getElementById("form-fields-wrapper");
  const feedbackContainer = document.getElementById("form-feedback");
  
  if (form && !form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const serviceID = "service_2qvid1q";
  const templateID = "template_fdl9dsd";

  const submitBtn = document.querySelector(".terminal-submit-btn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.querySelector("span").innerText = "Sending...";
  }

  const senderName = document.querySelector("#name").value;

  const params = {
    sendername: senderName,
    senderemail: document.querySelector("#email").value,
    subject: document.querySelector("#subject").value,
    message: document.querySelector("#message").value,
  };

  emailjs.send(serviceID, templateID, params)
    .then(() => {
      if (form) form.reset();
      
      // Hide the fields and display the success message inline
      if (fieldsWrapper) fieldsWrapper.style.display = "none";
      if (feedbackContainer) {
        feedbackContainer.className = "form-feedback success-state";
        feedbackContainer.innerHTML = `
          <div class="feedback-content">
            <div class="feedback-icon"><i class="fa-solid fa-circle-check"></i></div>
            <h3>Message Transmitted</h3>
            <p>Thank you, <strong>${senderName}</strong>! Your message has been sent successfully. I'll get back to you shortly.</p>
            <button type="button" class="reset-form-btn" onclick="resetFormState()">Send Another Message</button>
          </div>
        `;
        feedbackContainer.style.display = "block";
      }
    })
    .catch((err) => {
      console.error("EmailJS Error:", err);
      if (feedbackContainer) {
        feedbackContainer.className = "form-feedback error-state";
        feedbackContainer.innerHTML = `
          <p>⚠️ Unable to transmit message. Please check your network or email directly at <a href="mailto:rawankhaledba@gmail.com">rawankhaledba@gmail.com</a>.</p>
        `;
        feedbackContainer.style.display = "block";
      }
    })
    .finally(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.querySelector("span").innerText = "Send Message";
      }
    });
}

// Function to bring back form fields if user wants to send another message
function resetFormState() {
  const fieldsWrapper = document.getElementById("form-fields-wrapper");
  const feedbackContainer = document.getElementById("form-feedback");
  
  if (feedbackContainer) feedbackContainer.style.display = "none";
  if (fieldsWrapper) fieldsWrapper.style.display = "block";
}