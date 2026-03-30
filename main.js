/* ================================================================
   AJAY PORTFOLIO — main.js (UPDATED)
   Changes:
     1. Hire Me button now smooth-scrolls to #contact (href change in HTML, 
        existing anchor smooth-scroll logic covers it automatically)
     2. Skill bar animation via IntersectionObserver (more reliable)
     3. Project cards: fade-in + stagger on scroll
     4. Experience cards: alternating slide-in on scroll
   ================================================================ */

// ────────────────────────────────────────────────────────────────
// HEADER STICKY ON SCROLL
// ────────────────────────────────────────────────────────────────
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (header) header.classList.toggle('sticky', window.scrollY > 0);
});

// ────────────────────────────────────────────────────────────────
// MOBILE NAVIGATION SIDEBAR
// ────────────────────────────────────────────────────────────────
const menuBtn = document.querySelector(".menu-btn");
const navigation = document.querySelector(".navigation");
const navigationItems = document.querySelectorAll(".navigation a");

if (menuBtn && navigation) {
  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navigation.classList.toggle("active");
  });
}

navigationItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (menuBtn && navigation) {
      menuBtn.classList.remove("active");
      navigation.classList.remove("active");
    }
  });
});

// ────────────────────────────────────────────────────────────────
// SCROLL TO TOP BUTTON
// ────────────────────────────────────────────────────────────────
const scrollBtn = document.querySelector(".scrollToTop-btn");

if (scrollBtn) {
  window.addEventListener("scroll", function () {
    scrollBtn.classList.toggle("active", window.scrollY > 500);
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ────────────────────────────────────────────────────────────────
// SMOOTH SCROLL FOR ANCHOR LINKS  (covers #contact, Hire Me btn)
// ────────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href && href.startsWith("#") && href !== "#") {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ────────────────────────────────────────────────────────────────
// GENERAL REVEAL ON SCROLL  (.reveal elements)
// ────────────────────────────────────────────────────────────────
window.addEventListener("scroll", revealElements);

function revealElements() {
  const reveals = document.querySelectorAll(".reveal");
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 50) el.classList.add("active");
  });
}

// Run once on load in case elements are already in view
revealElements();

// ────────────────────────────────────────────────────────────────
// CHANGE 2: SKILL BARS — IntersectionObserver (no hover hack)
// ────────────────────────────────────────────────────────────────
const skillsSection = document.querySelector('.skills');

if (skillsSection) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillsSection.classList.add('active');
        skillObserver.unobserve(skillsSection); // fire once
      }
    });
  }, { threshold: 0.25 });

  skillObserver.observe(skillsSection);
}

// ────────────────────────────────────────────────────────────────
// CHANGE 3: PROJECT CARDS — Fade-in, Floating Image, and Tilt
// ────────────────────────────────────────────────────────────────
const projectCards = document.querySelectorAll('.project-card');

if (projectCards.length > 0) {
  // 1. Scroll Fade-in
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const delay = parseInt(card.dataset.delay, 10) || 0;

        setTimeout(() => {
          card.classList.add('card-visible');
        }, delay);

        projectObserver.unobserve(card);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  projectCards.forEach(card => projectObserver.observe(card));

  // 2. Hover Interactions: Floating Image + Tilt
  const cursorPreview = document.createElement('img');
  cursorPreview.id = 'cursor-image-preview';
  document.body.appendChild(cursorPreview);

  projectCards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
      const imgPath = card.getAttribute('data-image');
      if (imgPath) {
        cursorPreview.src = imgPath;
        cursorPreview.classList.add('active');
      }
    });

    card.addEventListener('mouseleave', () => {
      cursorPreview.classList.remove('active');
      // Reset tilt
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });

    card.addEventListener('mousemove', (e) => {
      // Move floating image
      cursorPreview.style.left = e.clientX + 'px';
      cursorPreview.style.top = e.clientY + 'px';

      // 3D Tilt calculation
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Max tilt angle = 10 degrees
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
  });
}

// ────────────────────────────────────────────────────────────────
// CHANGE 4: EXPERIENCE CARDS — Alternate left / right slide-in
// ────────────────────────────────────────────────────────────────
const expCards = document.querySelectorAll('.portfolio-card');

if (expCards.length > 0) {
  const expObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-visible');
        expObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

  expCards.forEach((card, i) => {
    // Stagger each card slightly
    card.style.transitionDelay = `${i * 120}ms`;
    expObserver.observe(card);
  });
}

// ────────────────────────────────────────────────────────────────
// PORTFOLIO CERTIFICATE BUTTONS
// ────────────────────────────────────────────────────────────────
function setupPortfolioInteractions() {
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  portfolioCards.forEach(card => {
    const viewBtn = card.querySelector('.view-btn');
    if (!viewBtn) return;

    viewBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const certUrl = viewBtn.getAttribute('data-certificate');

      if (certUrl) {
        window.open(certUrl, '_blank');
        viewBtn.style.transform = 'scale(0.95)';
        setTimeout(() => { viewBtn.style.transform = 'scale(1)'; }, 150);
      } else {
        const projectName = card.querySelector('h3').textContent;
        viewBtn.style.transform = 'scale(0.95)';
        setTimeout(() => { viewBtn.style.transform = 'scale(1.05)'; }, 100);
        setTimeout(() => { alert(`${projectName} — ongoing project`); }, 200);
      }
    });
  });
}

// ────────────────────────────────────────────────────────────────
// CONTACT CARDS — animate when section enters viewport
// ────────────────────────────────────────────────────────────────
const contactSection = document.querySelector('.contact');
const contactCards = document.querySelectorAll('.contact .card');
let contactAnimated = false;

function isInView(el) {
  const rect = el.getBoundingClientRect();
  return rect.top <= window.innerHeight && rect.bottom >= 0;
}

window.addEventListener('scroll', () => {
  if (!contactAnimated && contactSection && isInView(contactSection)) {
    contactCards.forEach((card, index) => {
      setTimeout(() => { card.classList.add('animate'); }, index * 200);
    });
    contactAnimated = true;
  }
});

// ────────────────────────────────────────────────────────────────
// EMAILJS  + CONTACT FORM
// ────────────────────────────────────────────────────────────────
(function () {
  emailjs.init('5EbkoUwb4EYZ0iLOF');
})();

document.addEventListener('DOMContentLoaded', function () {
  setupPortfolioInteractions();

  const form = document.getElementById('form');
  const resultElement = document.getElementById('result');

  if (!form || !resultElement) {
    console.error('Form or result element not found');
    return;
  }

  form.addEventListener('submit', handleFormSubmit);

  function handleFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const sendBtn      = form.querySelector('.send-btn');
    const btnText      = sendBtn.querySelector('.btn-text');
    const btnIcon      = sendBtn.querySelector('.btn-icon');
    const nameField    = document.getElementById('name');
    const emailField   = document.getElementById('email');
    const phoneField   = document.getElementById('phone');
    const messageField = document.getElementById('message');

    if (!sendBtn || !btnText || !btnIcon || !nameField || !emailField || !phoneField || !messageField) {
      console.error('Required elements not found');
      return false;
    }

    const formData = {
      from_name:  nameField.value.trim(),
      from_email: emailField.value.trim(),
      phone:      phoneField.value.trim(),
      message:    messageField.value.trim()
    };

    if (!formData.from_name || !formData.from_email || !formData.phone || !formData.message) {
      showErrorMessage('Please fill in all fields.');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.from_email)) {
      showErrorMessage('Please enter a valid email address.');
      return false;
    }

    sendBtn.disabled = true;
    btnText.textContent = 'Sending...';
    btnIcon.className = 'loading';

    resultElement.className = 'result-message';
    resultElement.textContent = '';

    emailjs.send('service_ajay', 'template_8jr1k7k', formData)
      .then(() => { showSuccessMessage(); resetForm(); })
      .catch(() => { showErrorMessage('Failed to send message. Please try again later.'); })
      .finally(() => {
        sendBtn.disabled = false;
        btnText.textContent = 'Send Message';
        btnIcon.className = 'fas fa-paper-plane btn-icon';
      });

    return false;
  }

  function showSuccessMessage() {
    resultElement.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
    resultElement.className = 'result-message success show success-animation';
    setTimeout(() => {
      resultElement.style.transform = 'scale(1.05)';
      setTimeout(() => { resultElement.style.transform = 'scale(1)'; }, 200);
    }, 100);
  }

  function showErrorMessage(msg = '❌ Failed to send message. Please try again later.') {
    resultElement.textContent = msg;
    resultElement.className = 'result-message error show';
    resultElement.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => { resultElement.style.animation = ''; }, 500);
  }

  function resetForm() {
    setTimeout(() => {
      form.reset();
      resultElement.className = 'result-message';
      resultElement.textContent = '';
      resultElement.style.transform = '';
    }, 4000);
  }

  // Input focus micro-animations
  const inputs = document.querySelectorAll('#form input, #form textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function () {
      this.style.transform  = 'translateY(-2px)';
      this.style.borderColor = '#3a6cf4';
    });
    input.addEventListener('blur', function () {
      this.style.transform = 'translateY(0)';
      if (!this.value.trim()) this.style.borderColor = '#e0e0e0';
    });
    input.addEventListener('input', function () {
      this.style.borderColor = this.value.trim() ? '#3a6cf4' : '#e0e0e0';
    });
  });

  // Animate contact cards and form on load
  const cards = document.querySelectorAll('.card');
  const contactForm = document.querySelector('.contact-form');

  cards.forEach((card, index) => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(50px)';
    setTimeout(() => {
      card.style.transition = 'all 0.6s ease';
      card.style.opacity    = '1';
      card.style.transform  = 'translateY(0)';
    }, index * 200);
  });

  if (contactForm) {
    contactForm.style.opacity   = '0';
    contactForm.style.transform = 'translateY(50px)';
    setTimeout(() => {
      contactForm.style.transition = 'all 0.8s ease';
      contactForm.style.opacity    = '1';
      contactForm.style.transform  = 'translateY(0)';
    }, 600);
  }
});

// ────────────────────────────────────────────────────────────────
// INJECT KEYFRAMES DYNAMICALLY  (shake + spin + slideInUp)
// ────────────────────────────────────────────────────────────────
const dynStyle = document.createElement('style');
dynStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  @keyframes pulse {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  .loading {
    display: inline-block;
    width: 20px; height: 20px;
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .success-animation { animation: slideInUp 0.6s ease-out; }
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(dynStyle);

// ────────────────────────────────────────────────────────────────
// PROJECTS CAROUSEL — Vanilla JS (ElegantCarousel port)
// ────────────────────────────────────────────────────────────────
(function () {
  const PROJECTS = [
    {
      index:    '01',
      title:    'AUTONOMOUS IV LINE DETECTION & POINTING ROBOT',
      domain:   'Robotics & Medical AI',
      desc:     'A vision-guided robotic system that autonomously detects intravenous line insertion points on patients using computer vision, providing real-time pointing assistance to medical staff in clinical environments.',
      tags:     ['Computer Vision', 'ROS', 'Python', 'OpenCV', 'Linux', 'Raspberry Pi', 'IoT'],
      image:    'assets/IV-ROBOT-1.jpeg',
      accent:   '#00c9a7',
      link:     'https://github.com/Ajay-464/Project-AIVDPR'
    },
    {
      index:    '02',
      title:    'P&ID TO DIGITAL INTELLIGENCE SYSTEM',
      domain:   'Industrial Automation & AI',
      desc:     'An AI-powered system that parses and digitises Piping & Instrumentation Diagrams (P&IDs), converting complex engineering drawings into structured, queryable digital data for smart plant operations.',
      tags:     ['Machine Learning', 'OCR', 'Python', 'OpenCV', 'CAD', 'Tensor flow'],
      image:    'assets/P-ID-IMG.jpg',
      accent:   '#4e9eff',
      link:     'https://github.com/Ajay-464/P-ID-ABB'
    },
    {
      index:    '03',
      title:    'STRUCTURAL CRACK DETECTION ROVER FOR SPACE STATION',
      domain:   'Space Robotics',
      desc:     'An autonomous rover designed for structural integrity inspection aboard space stations, using computer vision and sensor fusion to identify and map micro-cracks in pressure-bearing surfaces.',
      tags:     ['ROS', 'OpenCV', 'Raspberry Pi', 'Python', 'SOLIDWORKS', 'Nvidia Issac gym'],
      image:    'assets/SCD ROVER.png',
      accent:   '#a78bfa',
      link:     'https://github.com/Ajay-464/SCD-Rover'
    },
    {
      index:    '04',
      title:    'DEEP LEARNING FOR RUL PROGNOSTICS',
      domain:   'Predictive Maintenance & AI',
      desc:     'A deep learning pipeline for predicting the Remaining Useful Life (RUL) of industrial machinery, enabling proactive maintenance scheduling and reducing unplanned downtime in manufacturing systems.',
      tags:     ['Deep Learning', 'LSTM', 'Python', 'TensorFlow', 'Data Science', 'CUDA', 'PyTorch', 'Open CV'],
      image:    'assets/DEEPLEARN-RUL.jpg',
      accent:   '#f59e0b',
      link:     'https://github.com/Ajay-464/DL-RUL'
    },
    {
      index:    '05',
      title:    'IoT BASED SMART SEEDING AND SPRAYING ROBOT',
      domain:   'Agricultural Automation',
      desc:     'An agricultural automation robot capable of precision seeding and targeted spraying using IoT sensors and path-planning algorithms, designed to reduce manual labour and optimise resource usage in the field.',
      tags:     ['ROS', 'ESP32', 'Raspberry Pi', 'Python', 'SOLIDWORKS', 'Embedded C', 'IoT'],
      image:    'assets/Proj Front View.jpg',
      accent:   '#34d399',
      link:     'https://github.com/Ajay-464/IOT-Based-Smart-Seeding-and-Spraying-Robot-Mini-Project'
    },
    {
      index:    '06',
      title:    'AXIOA DIGITAL SERVICE PLATFORM',
      domain:   'Web & Product Design',
      desc:     'A modern full-stack digital service platform built for streamlined client engagement, featuring responsive UI design, service listing, inquiry management, and dynamic content powered by a backend API.',
      tags:     ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'UI/UX', 'Express.js', 'React', 'MongoDB', 'REST API'],
      image:    'assets/AXIOA-LOGO G-BG.png',
      accent:   '#f472b6',
      link:     'https://github.com/Ajay-464/AxioA'
    },
    {
      index:    '07',
      title:    '6-DOF Pick & Place Industrial ROBOT',
      domain:   'Robotics & Automation',
      desc:     'A vision-guided robotic system that autonomously detects intravenous line insertion points on patients using computer vision, providing real-time pointing assistance to medical staff in clinical environments.',
      tags:     ['Solidworks', 'Research & Development', 'Auto CAD', '3D Modelling'],
      image:    'assets/MINIPROJ-2.png',
      accent:   '#00951bff',
      link:     'https://github.com/Ajay-464/6DOF-Robotic-Arm-Solidworks'
    }
  ];

  const SLIDE_DURATION  = 6000;  // ms per slide
  const TICK_INTERVAL   = 50;    // progress update tick

  let currentIndex  = 0;
  let isPaused      = false;
  let isTransition  = false;
  let progress      = 0;
  let autoTimer     = null;
  let progressTimer = null;

  // ── DOM refs ──
  const carousel    = document.getElementById('projCarousel');
  if (!carousel) return;  // bail if section not on page

  const bgWash      = document.getElementById('projBgWash');
  const counterText = document.getElementById('projCounterText');
  const domainEl    = document.getElementById('projDomain');
  const titleEl     = document.getElementById('projTitle');
  const descEl      = document.getElementById('projDesc');
  const tagsEl      = document.getElementById('projTags');
  const extLinkEl   = document.getElementById('projExtLink');
  const imageEl     = document.getElementById('projImage');
  const overlayEl   = document.getElementById('projImageOverlay');
  const imageFrame  = document.getElementById('projImageFrame');
  const cornerTL    = document.getElementById('projCornerTL');
  const cornerBR    = document.getElementById('projCornerBR');
  const navArrows   = carousel.querySelector('.proj-nav-arrows');
  const counterEl   = document.getElementById('projCounter');
  const prevBtn     = document.getElementById('projPrev');
  const nextBtn     = document.getElementById('projNext');
  const progressItems = document.querySelectorAll('.proj-progress-item');
  const fills       = document.querySelectorAll('.proj-progress-fill');

  // ── Animatable text elements ──
  const animEls = [counterEl, domainEl, titleEl, descEl, tagsEl, extLinkEl, navArrows];

  function setAccent(color) {
    carousel.style.setProperty('--proj-accent', color);
  }

  function hideAnimEls() {
    animEls.forEach(el => { if (el) el.classList.remove('visible'); });
    if (imageFrame) imageFrame.classList.remove('visible');
  }

  function showAnimEls() {
    animEls.forEach(el => { if (el) el.classList.add('visible'); });
    if (imageFrame) imageFrame.classList.add('visible');
  }

  function renderSlide(idx) {
    const p = PROJECTS[idx];

    // Accent color
    setAccent(p.accent);

    // Bg wash
    if (bgWash) {
      bgWash.style.background = `radial-gradient(ellipse at 70% 50%, ${p.accent}1a 0%, transparent 70%)`;
    }

    // Text content
    if (counterText)  counterText.textContent  = `${p.index} / 0${PROJECTS.length}`;
    if (domainEl)     domainEl.textContent      = p.domain;
    if (titleEl)      titleEl.textContent       = p.title;
    if (descEl)       descEl.textContent        = p.desc;

    // Tags
    if (tagsEl) {
      tagsEl.innerHTML = p.tags.map(t => `<span>${t}</span>`).join('');
    }

    // External Link (bind data from PROJECTS array if available)
    if (extLinkEl) {
      if (p.link) {
        extLinkEl.href = p.link;
        extLinkEl.target = "_blank"; // Ensure it opens in a new tab
        extLinkEl.rel = "noopener noreferrer"; // Security best practice
        extLinkEl.style.display = "inline-flex"; // ensure visible if hidden
      } else {
        extLinkEl.removeAttribute("href");
        extLinkEl.style.display = "none"; // hide if no link is provided
      }
      
      // Force click to work by stopping propagation to carousel elements
      extLinkEl.onclick = function(e) {
         e.stopPropagation();
      };
    }

    // Image
    if (imageEl) {
      imageEl.src = p.image;
      imageEl.alt = p.title;
    }

    // Image overlay gradient
    if (overlayEl) {
      overlayEl.style.background = `linear-gradient(135deg, ${p.accent}22 0%, transparent 50%)`;
    }

    // Corner accent colors (corners use CSS var, already reactive)
    // Progress bar state
    progressItems.forEach((item, i) => {
      item.classList.toggle('active', i === idx);
    });
    fills.forEach((fill, i) => {
      fill.style.transition = 'none';
      fill.style.width      = i < idx  ? '100%'
                            : i === idx ? '0%'
                            : '0%';
      fill.style.background = PROJECTS[i].accent;
    });
  }

  function goToSlide(idx, skipTransition) {
    if (isTransition || idx === currentIndex) return;
    isTransition = true;

    // Hide text
    hideAnimEls();
    resetTimers();
    progress = 0;

    setTimeout(() => {
      currentIndex = idx;
      renderSlide(idx);
      setTimeout(() => {
        showAnimEls();
        isTransition = false;
        if (!isPaused) startTimers();
      }, 60);
    }, 380);
  }

  function goNext() {
    goToSlide((currentIndex + 1) % PROJECTS.length);
  }

  function goPrev() {
    goToSlide((currentIndex - 1 + PROJECTS.length) % PROJECTS.length);
  }

  function startTimers() {
    clearTimers();
    progressTimer = setInterval(() => {
      progress = Math.min(progress + (100 / (SLIDE_DURATION / TICK_INTERVAL)), 100);
      const fill = fills[currentIndex];
      if (fill) {
        fill.style.transition = `width ${TICK_INTERVAL}ms linear`;
        fill.style.width = `${progress}%`;
      }
    }, TICK_INTERVAL);

    autoTimer = setTimeout(() => {
      if (!isPaused) goNext();
    }, SLIDE_DURATION);
  }

  function clearTimers() {
    clearInterval(progressTimer);
    clearTimeout(autoTimer);
  }

  function resetTimers() {
    clearTimers();
    progress = 0;
  }

  // ── Keyboard support ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft')  goPrev();
  });

  // ── Touch swipe ──
  let touchStartX = 0;
  carousel.addEventListener('touchstart', e  => { touchStartX = e.targetTouches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend',   e  => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 55) diff > 0 ? goNext() : goPrev();
  });

  // ── Hover pause ──
  carousel.addEventListener('mouseenter', () => { isPaused = true;  clearTimers(); });
  carousel.addEventListener('mouseleave', () => { isPaused = false; if (!isTransition) startTimers(); });

  // ── Button listeners ──
  if (prevBtn) prevBtn.addEventListener('click', goPrev);
  if (nextBtn) nextBtn.addEventListener('click', goNext);

  progressItems.forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.index, 10);
      if (idx !== currentIndex) goToSlide(idx);
    });
  });

  // ── Initial render via IntersectionObserver (animate in on scroll) ──
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        renderSlide(0);
        setTimeout(showAnimEls, 150);
        startTimers();
        io.unobserve(carousel);
      }
    });
  }, { threshold: 0.15 });

  io.observe(carousel);

})();

// Timeline Scroll Logic (Aceternity style)
const timelineWrapper = document.getElementById('timelineWrapper');
const timelineProgress = document.getElementById('timelineProgress');

if (timelineWrapper && timelineProgress) {
  window.addEventListener('scroll', () => {
    const rect = timelineWrapper.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // We want the scroll progress relative to the timeline component
    // Offset so it starts animating when component enters the viewport
    const startOffset = windowHeight * 0.5; // Starts filling when timeline is at 50% of viewport
    let scrollPosition = startOffset - rect.top;
    
    // Clamp the value between 0 and the total height of the wrapper
    let progressHeight = Math.max(0, Math.min(scrollPosition, rect.height));

    // Calculate percentage and apply
    timelineProgress.style.height = `${progressHeight}px`;
  });
}

// Stats Number Scroll & Count Up Animation
const statNumbers = document.querySelectorAll('.stat-number');
let statsCounted = false;

const startCountUp = () => {
  statNumbers.forEach(el => {
    const target = +el.getAttribute('data-target');
    const duration = 2000; // ms
    const stepTime = Math.abs(Math.floor(duration / target));

    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      el.innerText = current;
      if (current >= target) {
        clearInterval(timer);
        el.innerText = target;
      }
    }, stepTime);
  });
};

const statsContainer = document.querySelector('.about-stats');
if (statsContainer) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        startCountUp();
      }
    });
  }, { threshold: 0.5 }); // Triggers when 50% of stat div is visible

  counterObserver.observe(statsContainer);
}
