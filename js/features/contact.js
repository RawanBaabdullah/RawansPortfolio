// Initialize EmailJS
(function () {
    emailjs.init("KXjG-FT3eJXiKwJQR");
  })();

// Function to send the message
(function() {
    emailjs.init("KXjG-FT3eJXiKwJQR");
  })();
  
  function sendMessage() {
    const serviceID = "service_2qvid1q";
    const templateID = "template_fdl9dsd";
  
    const params = {
      sendername: document.querySelector("#name").value,
      senderemail: document.querySelector("#email").value,
      subject: document.querySelector("#subject").value,
      message: document.querySelector("#message").value,
    };
  
    emailjs.send(serviceID, templateID, params)
      .then(() => {
        alert(`Thank you ${params.sendername}! Your message has been sent.`);
        document.querySelector(".contact-form").reset();
      })
      .catch((err) => {
        console.error("EmailJS Error:", err);
        alert("Failed to send message. Please try again.");
      });
  }
  