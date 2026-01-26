/*
  script.js
  Interaction Logic for Mint Minimalist Portfolio
*/

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Menu Toggle ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const closeMenuBtn = document.querySelector('.close-menu');
  const mobileLinks = document.querySelectorAll('.mobile-links a');

  function toggleMenu() {
    mobileMenuOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : ''; // Prevent scroll
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMenu);
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', toggleMenu);
  }

  // Close menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenuOverlay.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // --- Active Link Highlight on Scroll ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      // 150px offset for header height
      if (scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // --- Form Submission (Web3Forms) ---
  const form = document.querySelector('.mint-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('.btn-submit');
      const originalText = btn.innerText;

      // Loading State
      btn.innerText = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      const formData = new FormData(form);

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });

        if (response.ok) {
          btn.innerText = 'Sent Successfully!';
          btn.style.background = '#2DD4BF'; // Mint
          btn.style.color = 'black';
          form.reset();

          setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
            btn.style.opacity = '1';
          }, 4000);
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        console.error(error);
        btn.innerText = 'Error. Try Again.';
        btn.style.background = '#EF4444'; // Red

        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.background = '';
          btn.disabled = false;
          btn.style.opacity = '1';
        }, 3000);
      }
    });
  }

});
