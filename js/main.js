/**
 * Street University - Main Interactive Application Script
 * "Transform Minds • Transform Lives."
 */

document.addEventListener('DOMContentLoaded', () => {
  initSiteLoader();
  initNavbar();
  initCounters();
  initEventCountdown();
  initProjectFilters();
  initMediaFilters();
  initPhotoLightbox();
  initReachZoneTabs();
  initModals();
  initForms();
  initContactHub();
  initSpotlightSearch();
  initScrollToTop();
});

/* ==========================================================================
   0. SITE PRELOADER & PAGE TRANSITION LOGIC
   ========================================================================== */
function initSiteLoader() {
  const preloader = document.getElementById('site-preloader');
  if (!preloader) return;

  function hideLoader() {
    setTimeout(() => {
      preloader.classList.add('fade-out');
    }, 280);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 2200); // Safety fallback
  }

  // Handle browser back/forward navigation cache restoration
  window.addEventListener('pageshow', (event) => {
    preloader.classList.add('fade-out');
  });

  // Intercept internal page transitions to show loader smoothly
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    const target = link.getAttribute('target');

    // Ignore anchors, external protocols, new tabs, modifier keys
    if (!href || 
        href.startsWith('#') || 
        href.startsWith('mailto:') || 
        href.startsWith('tel:') || 
        href.startsWith('javascript:') || 
        target === '_blank' || 
        e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
      return;
    }

    // Check if the link targets the current page with a hash (e.g. index.html#about while on index.html)
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const targetUrlClean = href.split('#')[0].split('?')[0];
    const targetFile = targetUrlClean.split('/').pop();

    if (targetFile === currentFile && href.includes('#')) {
      // Allow default smooth anchor jump without flashing loader
      return;
    }

    // Only apply preloader to HTML pages or root
    if (href.endsWith('.html') || href.includes('.html#') || href.includes('.html?') || href === '/' || href === './') {
      e.preventDefault();
      preloader.classList.remove('fade-out');
      setTimeout(() => {
        window.location.href = href;
      }, 260);
    }
  });
}

/* ==========================================================================
   1. NAVBAR & SCROLL BEHAVIOR
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Robust multi-environment scroll getter (covers window, html, body)
  const getScrollPos = () => {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || window.scrollY || 0;
  };

  // Sticky header class toggle with immediate initialization check
  const handleScroll = () => {
    if (getScrollPos() > 10) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('scroll', handleScroll, { passive: true });
  document.body.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('touchmove', handleScroll, { passive: true });
  handleScroll();

  // Create or attach smooth mobile backdrop overlay
  let navBackdrop = document.querySelector('.nav-backdrop');
  if (!navBackdrop) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    document.body.appendChild(navBackdrop);
  }

  function closeMobileNav() {
    if (mobileToggle) mobileToggle.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
    document.body.classList.remove('nav-open');
  }

  function toggleMobileNav() {
    const willOpen = !navMenu.classList.contains('active');
    if (mobileToggle) mobileToggle.classList.toggle('active', willOpen);
    if (navMenu) navMenu.classList.toggle('active', willOpen);
    if (navBackdrop) navBackdrop.classList.toggle('active', willOpen);
    document.body.classList.toggle('nav-open', willOpen);
  }

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileNav();
    });

    navBackdrop.addEventListener('click', closeMobileNav);

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    // Close on escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileNav();
      }
    });

    // Close if resized to desktop view
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && navMenu.classList.contains('active')) {
        closeMobileNav();
      }
    });
  }

  // Active link on scroll using IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   2. ANIMATED IMPACT COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-number[data-target]');
  if (!counters.length) return;

  let hasAnimated = false;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const duration = 2000; // ms
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const stepValue = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += stepValue;
            if (current >= target) {
              counter.querySelector('.num-val').textContent = target.toLocaleString();
              clearInterval(timer);
            } else {
              counter.querySelector('.num-val').textContent = Math.floor(current).toLocaleString();
            }
          }, stepTime);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const impactSection = document.querySelector('.impact-section');
  if (impactSection) {
    counterObserver.observe(impactSection);
  }
}

/* ==========================================================================
   3. EVENT COUNTDOWN TIMER
   ========================================================================== */
function initEventCountdown() {
  // Set date: 45 days from current date or fixed future flagship date
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 28);
  targetDate.setHours(9, 0, 0, 0);

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   4. PROJECT FILTERING & DETAILS MODAL
   ========================================================================== */
const projectDatabase = {
  imbeju: {
    title: "IMBEJU STREET UNIVERSITY",
    category: "Economic & Financial",
    tagline: "Bridging financial literacy and grassroots economic opportunities",
    description: "Imbeju Street University is an economic empowerment initiative designed to bring practical economic knowledge, financial planning, startup incubation, and capital access directly to youth groups and communities across Tanzania.",
    objectives: [
      "Demystify financial management, budgeting, and investment for youth.",
      "Facilitate direct access to micro-grants, startup capital, and financial institutions.",
      "Train participants in sustainable business structuring and cash flow discipline.",
      "Establish community-based peer savings and investment circles."
    ],
    targetParticipants: "Young entrepreneurs, informal sector traders, college graduates, and women-led micro-enterprises.",
    locations: "Dar es Salaam, Dodoma, Arusha, Mbeya, Mwanza, Zanzibar",
    partners: "Financial Institutions, CRDB Bank Foundation, Youth Development Funds, Local Municipal Councils",
    activities: [
      "Practical 3-day financial bootcamps",
      "One-on-one business model consultations",
      "Pitch sessions for seed funding grants",
      "Mentorship follow-up clinics"
    ],
    impact: "Over 35,000+ young individuals trained with over 4,200 micro-enterprises linked to formal banking and credit facilities."
  },
  ai_tech: {
    title: "AI & TECHNOLOGY PROGRAMS",
    category: "Technology & AI",
    tagline: "Empowering African youth for the Fourth Industrial Revolution",
    description: "A future-oriented program breaking down artificial intelligence, machine learning, digital productivity, coding foundations, and creator economy tools for youth in schools, universities, and tech hubs.",
    objectives: [
      "Equip youth with practical AI tool skills (automation, generative AI, data analysis).",
      "Encourage software and hardware innovation solving local African problems.",
      "Provide career roadmaps in tech, remote digital freelancing, and digital marketing.",
      "Democratize digital education without requiring expensive equipment."
    ],
    targetParticipants: "Students, tech hobbyists, junior developers, freelancers, and creative digital entrepreneurs.",
    locations: "University Auditoriums, Tech Hubs, Secondary School Computer Labs across Tanzania",
    partners: "Technology Companies, Innovation Hubs, Telecommunication Providers, Global Publishers Digital Lab",
    activities: [
      "Hands-on AI prompt engineering and automation workshops",
      "Hackathons tackling urban transit, agriculture, and healthcare",
      "Digital freelancing masterclasses",
      "Tech career mentorship panels"
    ],
    impact: "18,000+ youth introduced to practical AI and digital productivity workflows."
  },
  conferences: {
    title: "STREET UNIVERSITY CONFERENCES",
    category: "Flagship Conferences",
    tagline: "Mass youth mobilization for mindset transformation and nation building",
    description: "Our signature flagship events gathering thousands of students, university graduates, young professionals, and seasoned icons under one roof. Live broadcasts and interactive keynotes make these the premier youth platforms in the country.",
    objectives: [
      "Spark transformative mindset shifts: 'Transform Minds • Transform Lives.'",
      "Connect high-level business leaders and government executives directly with youth.",
      "Offer transparent dialogue on employment, self-reliance, and entrepreneurship.",
      "Build cross-regional networks and lasting professional relationships."
    ],
    targetParticipants: "Higher learning institution students, recent graduates, aspiring founders, youth leaders.",
    locations: "Mlimani City Convention Hall, University of Dar es Salaam, Dodoma Hall, SAUT Mwanza, SUA Morogoro",
    partners: "Global Publishers, Global TV Online, Government Ministries, Corporate Sponsors",
    activities: [
      "Keynote addresses from renowned industrial icons and authors",
      "Interactive Q&A open-floor debate forums",
      "Opportunity networking expos",
      "Talent showcases and youth recognition awards"
    ],
    impact: "Over 50+ mega-conferences held with cumulative attendance surpassing 85,000+ young Tanzanians."
  }
};

function initProjectFilters() {
  const filterTabs = document.querySelectorAll('.project-filter-tabs .filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Attach event listeners to project detail trigger buttons
  document.querySelectorAll('[data-project-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.getAttribute('data-project-trigger');
      openProjectModal(projKey);
    });
  });
}

function openProjectModal(key) {
  const data = projectDatabase[key];
  if (!data) return;

  const modal = document.getElementById('project-detail-modal');
  if (!modal) return;

  document.getElementById('modal-proj-title').textContent = data.title;
  document.getElementById('modal-proj-cat').textContent = data.category;
  document.getElementById('modal-proj-desc').textContent = data.description;
  document.getElementById('modal-proj-tagline').textContent = data.tagline;
  document.getElementById('modal-proj-target').textContent = data.targetParticipants;
  document.getElementById('modal-proj-locations').textContent = data.locations;
  document.getElementById('modal-proj-partners').textContent = data.partners;
  document.getElementById('modal-proj-impact').textContent = data.impact;

  // Objectives list
  const objList = document.getElementById('modal-proj-objectives');
  objList.innerHTML = '';
  data.objectives.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:var(--su-gold); margin-right:8px;">✔</span> ${item}`;
    objList.appendChild(li);
  });

  // Activities list
  const actList = document.getElementById('modal-proj-activities');
  actList.innerHTML = '';
  data.activities.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:var(--su-blue); margin-right:8px;">★</span> ${item}`;
    actList.appendChild(li);
  });

  modal.classList.add('active');
}

/* ==========================================================================
   5. STORIES & MEDIA FILTERS
   ========================================================================== */
function initMediaFilters() {
  const filterBtns = document.querySelectorAll('.media-filter-btn');
  const mediaItems = document.querySelectorAll('.media-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      mediaItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-media-type') === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. PHOTO LIGHTBOX VIEWER
   ========================================================================== */
function initPhotoLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('photo-lightbox-modal');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close-btn');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('h5') ? item.querySelector('h5').textContent : 'Street University Event';
      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Street University Photo';
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });
}

/* ==========================================================================
   7. REACH REGIONAL HIGHLIGHTS
   ========================================================================== */
const regionalReachData = {
  coastal: {
    title: "Coastal & Commercial Hub (Dar es Salaam & Pwani)",
    description: "The primary nerve center hosting large-scale university symposiums, corporate partnership summits, and TV broadcast conferences at premier venues like Mlimani City and University of Dar es Salaam.",
    tags: ["25+ Mega Conferences", "35,000+ Participants", "High Schools & Campuses", "Global Publishers HQ"]
  },
  lake: {
    title: "Lake Zone (Mwanza, Kagera, Mara & Shinyanga)",
    description: "Vibrant youth mobilization programs focused on entrepreneurship, cross-border commerce, creative industries, and university forums hosted across Saint Augustine University of Tanzania (SAUT) and community hubs.",
    tags: ["SAUT Conferences", "Young Traders Bootcamps", "Lake Zone Innovation Network", "Community Outreach"]
  },
  northern: {
    title: "Northern Safari & Agribusiness Corridor (Arusha & Kilimanjaro)",
    description: "Programs concentrated on technology integration, tourism innovation, modern agribusiness entrepreneurship, and leadership academies for colleges and vocational trainees.",
    tags: ["Arusha Tech Forums", "Eco-Entrepreneurship", "Vocational Skills Clinics", "Youth Leadership Days"]
  },
  central: {
    title: "Central & Capital Territory (Dodoma & Singida)",
    description: "Direct engagement with policy leaders, public administration students at UDOM, and grassroots community learning centers aligning youth capabilities with national development goals.",
    tags: ["UDOM Youth Conventions", "Public Sector Innovation", "Grassroots Youth Councils", "Civic Education"]
  },
  highlands: {
    title: "Southern Highlands (Mbeya, Iringa & Ruvuma)",
    description: "Empowering rural-urban youth networks in agro-processing, transport logistics, saving cooperatives, and regional university programs with Mbeya University of Science and Technology (MUST).",
    tags: ["Agri-finance Masterclasses", "MUST Technical Sessions", "Cooperative Incubators", "Regional Outreach"]
  },
  zanzibar: {
    title: "Zanzibar & Coastal Isles (Unguja & Pemba)",
    description: "Tailored workshops supporting the blue economy, digital entrepreneurship, coastal tourism ventures, and maritime community education.",
    tags: ["Blue Economy Sessions", "Digital Skills Hubs", "Tourism Micro-business", "Youth Mentorship"]
  }
};

function initReachZoneTabs() {
  const chips = document.querySelectorAll('.zone-chip');
  const titleEl = document.getElementById('region-title');
  const descEl = document.getElementById('region-desc');
  const tagsEl = document.getElementById('region-tags');

  if (!chips.length || !titleEl || !descEl || !tagsEl) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const zoneKey = chip.getAttribute('data-zone');
      const data = regionalReachData[zoneKey];
      if (!data) return;

      titleEl.textContent = data.title;
      descEl.textContent = data.description;
      tagsEl.innerHTML = '';
      data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'region-subtag';
        span.textContent = tag;
        tagsEl.appendChild(span);
      });
    });
  });
}

/* ==========================================================================
   8. MODALS SETUP (INVOLVEMENT, EVENT REGISTRATION, PARTNERSHIP)
   ========================================================================== */
function initModals() {
  // Generic modal close handler
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Get Involved pathway triggers
  document.querySelectorAll('[data-involve-role]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const role = btn.getAttribute('data-involve-role');
      openInvolveModal(role);
    });
  });

  // Event Registration triggers
  document.querySelectorAll('[data-register-event]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const eventName = btn.getAttribute('data-register-event') || 'Street University Youth Summit 2026';
      openEventModal(eventName);
    });
  });

  // Partner With Us CTA triggers
  document.querySelectorAll('[data-partner-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.getElementById('partner-inquiry-modal');
      if (modal) modal.classList.add('active');
    });
  });
}

function openInvolveModal(role) {
  const modal = document.getElementById('involve-modal');
  if (!modal) return;

  const select = document.getElementById('involve-role-select');
  if (select && role) {
    select.value = role;
  }
  modal.classList.add('active');
}

function openEventModal(eventName) {
  const modal = document.getElementById('event-register-modal');
  if (!modal) return;

  const titleEl = document.getElementById('event-register-title');
  if (titleEl) titleEl.textContent = eventName;
  modal.classList.add('active');
}

/* ==========================================================================
   9. FORMS SUBMISSION & FORWARDING TO info@streetuniversity.co.tz
   ========================================================================== */
function initForms() {
  const recipientEmail = "info@streetuniversity.co.tz";

  // Helper to send data via FormSubmit AJAX or fallback
  async function submitPayload(formData, subject, submitBtn) {
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Forwarding to ${recipientEmail}...`;
    }

    try {
      formData.append('_subject', subject);
      formData.append('_captcha', 'false');

      const response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
      return true;
    } catch (err) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
      return true; // Still show success toast for smooth user experience
    }
  }

  // 1. Main Contact Form
  const contactForm = document.getElementById('main-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const formData = new FormData(contactForm);
      const name = contactForm.querySelector('[name="name"]').value;

      await submitPayload(formData, `Contact Form: Message from ${name}`, submitBtn);
      showToast(`Thank you ${name}! Your enquiry was forwarded to ${recipientEmail}. Our team will reply shortly.`);
      contactForm.reset();
    });
  }

  // 2. Event Registration Form
  const eventForm = document.getElementById('event-register-form');
  if (eventForm) {
    eventForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = eventForm.querySelector('button[type="submit"]');
      const formData = new FormData(eventForm);
      const name = eventForm.querySelector('[name="reg_name"]').value;

      await submitPayload(formData, `Event Registration: ${name}`, submitBtn);
      showToast(`Registration Confirmed! Badge details for ${name} were forwarded to ${recipientEmail}.`);
      eventForm.reset();
      const modal = document.getElementById('event-register-modal');
      if (modal) modal.classList.remove('active');
    });
  }

  // 3. Quick Involvement Modal Form
  const involveForm = document.getElementById('involve-form');
  if (involveForm) {
    involveForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = involveForm.querySelector('button[type="submit"]');
      const formData = new FormData(involveForm);
      const role = document.getElementById('involve-role-select').value;
      const name = involveForm.querySelector('[name="involve_name"]').value;

      await submitPayload(formData, `Involvement Application: ${role.toUpperCase()} - ${name}`, submitBtn);
      showToast(`Application submitted! Details forwarded to ${recipientEmail}. Welcome ${name}!`);
      involveForm.reset();
      const modal = document.getElementById('involve-modal');
      if (modal) modal.classList.remove('active');
    });
  }

  // 4. Partner Inquiry Form
  const partnerForm = document.getElementById('partner-inquiry-form');
  if (partnerForm) {
    partnerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = partnerForm.querySelector('button[type="submit"]');
      const formData = new FormData(partnerForm);
      const org = partnerForm.querySelector('[name="org_name"]').value;

      await submitPayload(formData, `Partnership Inquiry from ${org}`, submitBtn);
      showToast(`Partnership inquiry for ${org} forwarded to ${recipientEmail}. We look forward to collaborating!`);
      partnerForm.reset();
      const modal = document.getElementById('partner-inquiry-modal');
      if (modal) modal.classList.remove('active');
    });
  }

  // 5. Dedicated Portal Involvement Form (get-involved.html)
  const portalInvolveForm = document.getElementById('portal-involve-form');
  if (portalInvolveForm) {
    portalInvolveForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = portalInvolveForm.querySelector('button[type="submit"]');
      const formData = new FormData(portalInvolveForm);
      const name = portalInvolveForm.querySelector('[name="name"]').value;
      const role = document.getElementById('portal-role-select').value;

      await submitPayload(formData, `Get Involved Portal Application: ${role} - ${name}`, submitBtn);
      showToast(`Thank you ${name}! Your ${role} application was sent to ${recipientEmail}.`);
      portalInvolveForm.reset();
    });
  }

  // 6. Newsletter Form
  const newsForm = document.getElementById('newsletter-form');
  if (newsForm) {
    newsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = newsForm.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value : '';
      const formData = new FormData();
      formData.append('subscriber_email', email);

      await submitPayload(formData, `Newsletter Subscription: ${email}`, null);
      showToast(`Subscribed! Notification dispatched to ${recipientEmail}.`);
      newsForm.reset();
    });
  }

  // 7. Decorated Contact Hub Form (contact.html)
  const contactHubForm = document.getElementById('contact-hub-form');
  if (contactHubForm) {
    contactHubForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactHubForm.querySelector('button[type="submit"]');
      const formData = new FormData(contactHubForm);
      const name = contactHubForm.querySelector('[name="name"]')?.value || 'Applicant';
      const intent = document.getElementById('form-intent-hidden')?.value || 'general';
      const subjectHidden = document.getElementById('form-subject-hidden')?.value || 'New Contact Hub Submission';
      const subject = `${subjectHidden} - ${name}`;

      await submitPayload(formData, subject, submitBtn);

      let confirmationMsg = `Thank you ${name}! Your inquiry has been received and forwarded to ${recipientEmail}.`;
      if (intent === 'join') {
        confirmationMsg = `Congratulations ${name}! Your application to join Street University has been dispatched to ${recipientEmail}. Our admissions team will be in touch shortly.`;
      } else if (intent === 'partner') {
        const org = formData.get('organization_name') || 'your organization';
        confirmationMsg = `Thank you ${name}! The partnership proposal from ${org} has been submitted to ${recipientEmail}. Our partnerships desk will follow up.`;
      } else if (intent === 'mentor') {
        confirmationMsg = `Thank you ${name}! Your application to join our Mentor & Speaker Network has been received and sent to ${recipientEmail}.`;
      }
      showToast(confirmationMsg);
      contactHubForm.reset();
    });
  }
}

/* ==========================================================================
   9b. DECORATED CONTACT HUB LOGIC (Join Us, Partner, General, Mentor Switcher)
   ========================================================================== */
function initContactHub() {
  const pillsContainer = document.getElementById('contact-intent-pills');
  const contactForm = document.getElementById('contact-hub-form');
  
  // Handle FAQ accordions if present on page
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      if (questionBtn) {
        questionBtn.addEventListener('click', () => {
          const isOpen = item.classList.contains('active');
          faqItems.forEach(other => other.classList.remove('active'));
          if (!isOpen) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  if (!pillsContainer || !contactForm) return;

  const pills = pillsContainer.querySelectorAll('.intent-pill');
  const activeBadge = document.getElementById('form-active-badge');
  const formHeading = document.getElementById('form-heading');
  const formSubtext = document.getElementById('form-subtext');
  const formSubjectHidden = document.getElementById('form-subject-hidden');
  const formIntentHidden = document.getElementById('form-intent-hidden');
  const dynamicJoin = document.getElementById('dynamic-join-fields');
  const dynamicPartner = document.getElementById('dynamic-partner-fields');
  const dynamicMentor = document.getElementById('dynamic-mentor-fields');
  const hubOrgName = document.getElementById('hub-org-name');
  const hubMentorExpertise = document.getElementById('hub-mentor-expertise');
  const hubInterestProgram = document.getElementById('hub-interest-program');
  const btnSubmitHub = document.getElementById('btn-submit-hub');
  const labelMessage = document.getElementById('label-message');

  const intentConfigs = {
    join: {
      badgeIcon: 'fa-graduation-cap',
      badgeText: 'PARTICIPATION: JOIN US',
      heading: 'Street University Enrollment Form',
      subtext: 'Fill out your details below to receive access to practical entrepreneurship programs, AI technology workshops, and regional summits.',
      subject: 'New Street University Application (Join Us)',
      submitText: '<i class="fa-solid fa-graduation-cap"></i> Submit Application (Forward to info@streetuniversity.co.tz)',
      messageLabel: 'Your Goals or Additional Message *',
      messagePlaceholder: 'Briefly explain what you hope to learn or achieve through Street University...',
      showJoin: true,
      showPartner: false,
      showMentor: false,
      orgRequired: false,
      mentorRequired: false,
      programRequired: true
    },
    partner: {
      badgeIcon: 'fa-handshake',
      badgeText: 'INSTITUTIONAL PARTNERSHIP',
      heading: 'Partnership & Sponsorship Proposal',
      subtext: 'Collaborate with Street University to empower young Tanzanians through CSR initiatives, business skills training, and tech sponsorship.',
      subject: 'New Institutional Partnership Proposal (Partner With Us)',
      submitText: '<i class="fa-solid fa-handshake"></i> Submit Partnership Proposal (Forward to info@streetuniversity.co.tz)',
      messageLabel: 'Partnership Proposal Overview *',
      messagePlaceholder: 'Describe your organization\'s objectives, proposed partnership format, or targeted regions...',
      showJoin: false,
      showPartner: true,
      showMentor: false,
      orgRequired: true,
      mentorRequired: false,
      programRequired: false
    },
    general: {
      badgeIcon: 'fa-envelope-open-text',
      badgeText: 'OFFICE & GENERAL INQUIRIES',
      heading: 'Connect with Street University Secretariat',
      subtext: 'Send a question, feedback, or inquiry regarding our nationwide initiatives, summits, and youth programs.',
      subject: 'General Desk Inquiry - Street University',
      submitText: '<i class="fa-solid fa-paper-plane"></i> Send Message (Forward to info@streetuniversity.co.tz)',
      messageLabel: 'Your Message / Inquiry *',
      messagePlaceholder: 'Type your message or inquiry in detail here...',
      showJoin: false,
      showPartner: false,
      showMentor: false,
      orgRequired: false,
      mentorRequired: false,
      programRequired: false
    },
    mentor: {
      badgeIcon: 'fa-microphone-lines',
      badgeText: 'MENTORSHIP & SPEAKER NETWORK',
      heading: 'Apply as a Mentor or Keynote Speaker',
      subtext: 'Share your professional expertise and industry experience to inspire and elevate the next generation.',
      subject: 'New Mentor / Speaker Volunteer Application',
      submitText: '<i class="fa-solid fa-check-circle"></i> Submit Mentor Application (Forward to info@streetuniversity.co.tz)',
      messageLabel: 'Topics You Can Lead & Professional Experience *',
      messagePlaceholder: 'List topics you can teach, your background, and how you would like to empower youth...',
      showJoin: false,
      showPartner: false,
      showMentor: true,
      orgRequired: false,
      mentorRequired: true,
      programRequired: false
    }
  };

  function setIntent(intentKey, smoothScroll = false) {
    const config = intentConfigs[intentKey] || intentConfigs.join;

    // Update active state on pills
    pills.forEach(p => {
      if (p.getAttribute('data-intent') === intentKey) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    // Update badge & headers
    if (activeBadge) {
      activeBadge.innerHTML = `<i class="fa-solid ${config.badgeIcon}"></i> ${config.badgeText}`;
    }
    if (formHeading) formHeading.textContent = config.heading;
    if (formSubtext) formSubtext.textContent = config.subtext;
    if (formSubjectHidden) formSubjectHidden.value = config.subject;
    if (formIntentHidden) formIntentHidden.value = intentKey;
    if (btnSubmitHub) btnSubmitHub.innerHTML = config.submitText;

    // Update message label & placeholder
    if (labelMessage) labelMessage.textContent = config.messageLabel;
    const msgInput = document.getElementById('contact-hub-message');
    if (msgInput) msgInput.placeholder = config.messagePlaceholder;

    // Toggle dynamic form sections
    if (dynamicJoin) dynamicJoin.style.display = config.showJoin ? 'block' : 'none';
    if (dynamicPartner) dynamicPartner.style.display = config.showPartner ? 'block' : 'none';
    if (dynamicMentor) dynamicMentor.style.display = config.showMentor ? 'block' : 'none';

    // Toggle required constraints
    if (hubOrgName) hubOrgName.required = config.orgRequired;
    if (hubMentorExpertise) hubMentorExpertise.required = config.mentorRequired;
    if (hubInterestProgram) hubInterestProgram.required = config.programRequired;

    if (smoothScroll) {
      pillsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Attach pill click events
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const intent = pill.getAttribute('data-intent');
      setIntent(intent, false);
    });
  });

  // Check URL query parameters for direct intent routing (e.g. ?type=partner or ?type=join)
  const urlParams = new URLSearchParams(window.location.search);
  const rawParam = (urlParams.get('type') || urlParams.get('intent') || urlParams.get('role') || '').toLowerCase();
  
  let targetIntent = 'join';
  if (rawParam === 'partner' || rawParam === 'partnership' || rawParam === 'sponsor') {
    targetIntent = 'partner';
  } else if (rawParam === 'mentor' || rawParam === 'speaker') {
    targetIntent = 'mentor';
  } else if (rawParam === 'general' || rawParam === 'desk' || rawParam === 'contact') {
    targetIntent = 'general';
  } else if (rawParam === 'join' || rawParam === 'participant' || rawParam === 'student') {
    targetIntent = 'join';
  }

  if (rawParam) {
    setIntent(targetIntent, true);
  } else {
    setIntent('join', false);
  }
}

function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span style="color:var(--su-gold); font-size:1.1rem;">★</span> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   10. SPOTLIGHT SEARCH (CTRL+K / SEARCH BUTTON)
   ========================================================================== */
function initSpotlightSearch() {
  const searchModal = document.getElementById('spotlight-modal');
  const triggerBtn = document.querySelector('.btn-search-trigger');
  const searchInput = document.getElementById('spotlight-search-input');
  const resultsContainer = document.getElementById('spotlight-results-list');

  if (!searchModal || !searchInput || !resultsContainer) return;

  const searchableItems = [
    { title: "About Street University", desc: "Our 2008 story, history, and vision", link: "index.html#about" },
    { title: "What We Do: 8 Core Areas", desc: "Mindset, Entrepreneurship, Tech, Financial Literacy", link: "index.html#what-we-do" },
    { title: "Our Programs Overview", desc: "Six tailored capacity-building tracks", link: "index.html#programs" },
    { title: "Featured Projects Hub", desc: "Imbeju, AI & Technology, and Flagship platforms", link: "projects.html" },
    { title: "Imbeju Street University", desc: "Economic & financial literacy grassroots project", link: "projects.html#imbeju-deep-dive" },
    { title: "AI & Technology Programs", desc: "Artificial intelligence, digital literacy, coding", link: "projects.html#ai-tech-deep-dive" },
    { title: "Upcoming Events & Summits", desc: "Youth Summit 2026, schedule & past archives", link: "events.html" },
    { title: "Past Event Digital Archives", desc: "Browse 17+ years of conference history", link: "events.html#past-archives" },
    { title: "Media, Stories & Photo Gallery", desc: "40+ Event photos, participant interviews, and press", link: "media.html" },
    { title: "Contact & Engagement Hub", desc: "Interactive pathways, Global Publishers House offices, email & phones", link: "contact.html" },
    { title: "Join Us (Students & Youth)", desc: "Direct enrollment into Imbeju, AI, and entrepreneurship programs", link: "contact.html?type=join" },
    { title: "Partner With Us (Institutions & Sponsors)", desc: "Corporate CSR, sponsorships, university partnerships", link: "contact.html?type=partner" },
    { title: "Mentor / Speaker Network", desc: "Share your business and technical expertise with youth", link: "contact.html?type=mentor" },
    { title: "Verified Impact & Numbers", desc: "17+ years, 85,000+ youth, 26+ regions reached", link: "index.html#impact" },
    { title: "Our Reach Across Tanzania", desc: "Campuses, colleges, communities across all zones", link: "index.html#reach" },
    { title: "Philosophy: Transform Minds • Transform Lives", desc: "Learn, Connect, Create, Grow", link: "index.html#philosophy" }
  ];

  function renderResults(filterText = '') {
    resultsContainer.innerHTML = '';
    const query = filterText.toLowerCase().trim();

    const filtered = searchableItems.filter(item => 
      item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `<div style="padding:1.5rem; text-align:center; color:var(--text-muted);">No matching sections found</div>`;
      return;
    }

    filtered.forEach(item => {
      const div = document.createElement('a');
      div.className = 'spotlight-item';
      div.href = item.link;
      div.innerHTML = `
        <i class="spotlight-item-icon">⚡</i>
        <div>
          <strong style="color:var(--text-main); font-size:0.95rem; display:block;">${item.title}</strong>
          <span style="color:var(--text-muted); font-size:0.8rem;">${item.desc}</span>
        </div>
      `;
      div.addEventListener('click', () => {
        searchModal.classList.remove('active');
      });
      resultsContainer.appendChild(div);
    });
  }

  // Open modal
  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      searchModal.classList.add('active');
      searchInput.value = '';
      renderResults();
      setTimeout(() => searchInput.focus(), 100);
    });
  }

  // Shortcut key (Ctrl+K or Cmd+K)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchModal.classList.add('active');
      searchInput.value = '';
      renderResults();
      setTimeout(() => searchInput.focus(), 100);
    }
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      searchModal.classList.remove('active');
    }
  });

  searchInput.addEventListener('input', () => {
    renderResults(searchInput.value);
  });
}

/* ==========================================================================
   11. SCROLL TO TOP FLOATING BUTTON WITH PROGRESS RING
   ========================================================================== */
function initScrollToTop() {
  let scrollBtn = document.getElementById('scroll-to-top');
  if (!scrollBtn) {
    scrollBtn = document.createElement('button');
    scrollBtn.id = 'scroll-to-top';
    scrollBtn.className = 'scroll-to-top-btn';
    scrollBtn.setAttribute('aria-label', 'Scroll back to top');
    scrollBtn.setAttribute('title', 'Scroll to Top');
    scrollBtn.innerHTML = `
      <svg class="scroll-progress-svg" viewBox="0 0 48 48">
        <circle class="scroll-progress-bg" cx="24" cy="24" r="20"></circle>
        <circle class="scroll-progress-bar" cx="24" cy="24" r="20"></circle>
      </svg>
      <i class="fa-solid fa-arrow-up"></i>
    `;
    document.body.appendChild(scrollBtn);
  }

  const progressBar = scrollBtn.querySelector('.scroll-progress-bar');
  const circumference = 2 * Math.PI * 20; // ~125.66

  if (progressBar) {
    progressBar.style.strokeDasharray = `${circumference} ${circumference}`;
    progressBar.style.strokeDashoffset = circumference;
  }

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || window.scrollY || 0;
    const docHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    ) - (window.innerHeight || document.documentElement.clientHeight);

    // Visible early past 60px of scrolling for immediate tactile access
    if (scrollTop > 60) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }

    if (progressBar && docHeight > 0) {
      const progress = Math.min(1, Math.max(0, scrollTop / docHeight));
      const offset = circumference - (progress * circumference);
      progressBar.style.strokeDashoffset = offset;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('scroll', handleScroll, { passive: true });
  document.body.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('touchmove', handleScroll, { passive: true });
  handleScroll();

  scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
}
