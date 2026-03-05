/*
  3D ANIMATED PORTFOLIO — SCRIPT ENGINE
  Three.js Particle Galaxy + Nebula + GSAP ScrollTrigger + Interactions
*/

document.addEventListener('DOMContentLoaded', () => {

  // ============================
  // 1. THREE.JS 3D SCENE
  // ============================
  const canvas = document.getElementById('bg-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --- Galaxy Particles ---
  const particleCount = 2500;
  const galaxyGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorA = new THREE.Color(0x888888);
  const colorB = new THREE.Color(0xbbbbbb);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const radius = Math.random() * 6 + 0.3;
    const spinAngle = radius * 2.8;
    const branchAngle = ((i % 4) / 4) * Math.PI * 2;
    const scatter = Math.pow(radius / 6, 0.6);

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * 1.8 * scatter;
    positions[i3 + 1] = (Math.random() - 0.5) * 0.6;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + (Math.random() - 0.5) * 1.8 * scatter;

    const mixedColor = colorA.clone().lerp(colorB, radius / 6);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const galaxyMaterial = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
  scene.add(galaxy);

  // --- Floating Stars (Background Layer) ---
  const starCount = 800;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    starPositions[i3] = (Math.random() - 0.5) * 30;
    starPositions[i3 + 1] = (Math.random() - 0.5) * 20;
    starPositions[i3 + 2] = (Math.random() - 0.5) * 20 - 5;

    const brightness = 0.3 + Math.random() * 0.7;
    starColors[i3] = brightness;
    starColors[i3 + 1] = brightness;
    starColors[i3 + 2] = brightness;
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 0.015,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // --- Nebula Orbs (Glow Clouds) ---
  const nebulaGroup = new THREE.Group();
  const nebulaData = [
    { x: -3, y: 1.5, z: -4, color: 0x999999, scale: 1.5 },
    { x: 4, y: -1, z: -3, color: 0xaaaaaa, scale: 1.2 },
    { x: -1, y: -2, z: -6, color: 0x888888, scale: 2 },
    { x: 5, y: 2, z: -8, color: 0x999999, scale: 1.8 },
  ];

  nebulaData.forEach((data) => {
    const nebulaGeo = new THREE.SphereGeometry(data.scale, 16, 16);
    const nebulaMat = new THREE.MeshBasicMaterial({
      color: data.color,
      transparent: true,
      opacity: 0.025,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
    nebula.position.set(data.x, data.y, data.z);
    nebulaGroup.add(nebula);
  });

  scene.add(nebulaGroup);

  camera.position.z = 5;
  camera.position.y = 1.5;

  // Mouse tracking
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Scroll-based camera depth
  let scrollProgress = 0;
  window.addEventListener('scroll', () => {
    scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  });

  // Animation loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Smooth mouse follow
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    // Galaxy rotation
    galaxy.rotation.y = elapsed * 0.06 + mouseX * 0.12;
    galaxy.rotation.x = elapsed * 0.015 + mouseY * 0.06;

    // Stars subtle sway
    stars.rotation.y = elapsed * 0.01 + mouseX * 0.03;
    stars.rotation.x = elapsed * 0.005 + mouseY * 0.02;

    // Nebula pulse
    nebulaGroup.children.forEach((nebula, i) => {
      const pulseFactor = 1 + Math.sin(elapsed * 0.5 + i * 1.5) * 0.15;
      nebula.scale.setScalar(pulseFactor);
      nebula.material.opacity = 0.02 + Math.sin(elapsed * 0.3 + i) * 0.01;
    });

    // Camera depth on scroll
    camera.position.z = 5 - scrollProgress * 2;
    camera.position.y = 1.5 - scrollProgress * 1;

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // ============================
  // 2. CURSOR GLOW
  // ============================
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.innerWidth > 768) {
    let glowX = 0, glowY = 0;
    let targetGlowX = 0, targetGlowY = 0;

    document.addEventListener('mousemove', (e) => {
      targetGlowX = e.clientX;
      targetGlowY = e.clientY;
    });

    function updateGlow() {
      glowX += (targetGlowX - glowX) * 0.08;
      glowY += (targetGlowY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(updateGlow);
    }
    updateGlow();
  }

  // ============================
  // 3. GSAP SCROLL ANIMATIONS
  // ============================
  gsap.registerPlugin(ScrollTrigger);

  // Reveal-up
  gsap.utils.toArray('.reveal-up').forEach((el) => {
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 1.1,
      delay: parseFloat(el.style.getPropertyValue('--delay')) || 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Reveal-left
  gsap.utils.toArray('.reveal-left').forEach((el) => {
    gsap.to(el, {
      x: 0,
      opacity: 1,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Reveal-right
  gsap.utils.toArray('.reveal-right').forEach((el) => {
    gsap.to(el, {
      x: 0,
      opacity: 1,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // ============================
  // 4. ANIMATED COUNTERS
  // ============================
  document.querySelectorAll('.stat-num[data-count]').forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-count'));

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(counter, {
          innerText: target,
          duration: 2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: function () {
            counter.innerText = Math.round(parseFloat(counter.innerText));
          },
        });
      },
      once: true,
    });
  });

  // ============================
  // 5. TYPING EFFECT
  // ============================
  const roles = ['Full Stack Developer', 'Problem Solver'];
  const typedEl = document.getElementById('typedRole');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeRole() {
    const current = roles[roleIndex];

    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === current.length) {
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(typeRole, typingSpeed);
  }

  setTimeout(typeRole, 1200);

  // ============================
  // 6. VANILLA TILT
  // ============================
  const tiltElements = document.querySelectorAll('[data-tilt]');
  if (window.innerWidth > 768) {
    VanillaTilt.init(tiltElements, {
      max: 10,
      speed: 400,
      glare: true,
      'max-glare': 0.18,
      scale: 1.03,
      perspective: 800,
    });
  }

  // ============================
  // 7. HEADER SCROLL EFFECT
  // ============================
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ============================
  // 8. ACTIVE NAV LINK
  // ============================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // ============================
  // 9. MOBILE MENU
  // ============================
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = document.getElementById('closeMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-links a');

  function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  }

  mobileToggle.addEventListener('click', toggleMobileMenu);
  closeMenu.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // ============================
  // 10. CONTACT FORM (Web3Forms)
  // ============================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('.btn-submit');
      const btnSpan = btn.querySelector('span');
      const btnIcon = btn.querySelector('i');
      const originalText = btnSpan.innerText;

      btnSpan.innerText = 'Sending...';
      btnIcon.className = 'bx bx-loader-alt bx-spin';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          btnSpan.innerText = 'Sent Successfully!';
          btnIcon.className = 'bx bx-check';
          btn.style.opacity = '1';
          contactForm.reset();

          setTimeout(() => {
            btnSpan.innerText = originalText;
            btnIcon.className = 'bx bx-send';
            btn.disabled = false;
          }, 4000);
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        console.error(error);
        btnSpan.innerText = 'Error. Try Again.';
        btnIcon.className = 'bx bx-error';
        btn.style.background = '#EF4444';

        setTimeout(() => {
          btnSpan.innerText = originalText;
          btnIcon.className = 'bx bx-send';
          btn.style.background = '';
          btn.disabled = false;
          btn.style.opacity = '1';
        }, 3000);
      }
    });
  }

  // ============================
  // 11. MAGNETIC BUTTONS
  // ============================
  if (window.innerWidth > 768) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

});
