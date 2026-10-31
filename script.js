/**
 * PEDITRO FILMS — LUXURY PURPLE GRADIENT PORTFOLIO
 * High-End Interactivity, Draggable Badges, Before/After Slider, Video Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. HAMBURGER MENU & FULLSCREEN DRAWER
     -------------------------------------------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const menuDrawer = document.getElementById('menuDrawer');
  const menuLinks = document.querySelectorAll('.menu-drawer-link');

  function toggleMenu() {
    const isOpen = menuDrawer.classList.contains('open');
    if (isOpen) {
      menuDrawer.classList.remove('open');
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      menuDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    } else {
      menuDrawer.classList.add('open');
      hamburgerBtn.classList.add('open');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      menuDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  if (hamburgerBtn && menuDrawer) {
    hamburgerBtn.addEventListener('click', toggleMenu);

    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu();
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuDrawer.classList.contains('open')) {
        toggleMenu();
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. INTERACTIVE BEFORE / AFTER COLOR GRADING SLIDER (TOUCH & AUTO-DEMO)
     -------------------------------------------------------------------------- */
  const baWrapper = document.getElementById('colorGradeSlider');
  const baAfterLayer = document.getElementById('baAfterLayer');
  const baLine = document.getElementById('baLine');
  const baHandle = document.getElementById('baHandle');

  if (baWrapper && baAfterLayer && baLine && baHandle) {
    let isSliding = false;
    let hasAutoDemoPlayed = false;
    let autoDemoFrame = null;

    function applySliderPercent(percent) {
      percent = Math.max(0, Math.min(100, percent));
      baAfterLayer.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
      baLine.style.left = `${percent}%`;
      baHandle.style.left = `${percent}%`;
    }

    function updateSliderFromClientX(clientX) {
      const rect = baWrapper.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const percent = (offsetX / rect.width) * 100;
      applySliderPercent(percent);
    }

    // Pointer Events for flawless cross-device touch & mouse
    baWrapper.addEventListener('pointerdown', (e) => {
      isSliding = true;
      if (autoDemoFrame) cancelAnimationFrame(autoDemoFrame);
      try { baWrapper.setPointerCapture(e.pointerId); } catch(err) {}
      updateSliderFromClientX(e.clientX);
    });

    baWrapper.addEventListener('pointermove', (e) => {
      if (isSliding) {
        updateSliderFromClientX(e.clientX);
      }
    });

    function endSliderDrag(e) {
      if (isSliding) {
        isSliding = false;
        try { baWrapper.releasePointerCapture(e.pointerId); } catch(err) {}
      }
    }

    baWrapper.addEventListener('pointerup', endSliderDrag);
    baWrapper.addEventListener('pointercancel', endSliderDrag);

    // Auto-demonstration sweep animation on scroll into view
    function startAutoDemo() {
      if (hasAutoDemoPlayed || isSliding) return;
      hasAutoDemoPlayed = true;
      const startTime = performance.now();
      const duration = 2200; // ms

      function animateDemo(time) {
        if (isSliding) return;
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Smooth sine wave sweep: 50% -> 22% -> 78% -> 50%
        const wave = Math.sin(progress * Math.PI * 2);
        const percent = 50 + wave * 28;
        applySliderPercent(percent);

        if (progress < 1) {
          autoDemoFrame = requestAnimationFrame(animateDemo);
        } else {
          applySliderPercent(50);
        }
      }
      autoDemoFrame = requestAnimationFrame(animateDemo);
    }

    if ('IntersectionObserver' in window) {
      const sliderObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(startAutoDemo, 350);
            sliderObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      sliderObserver.observe(baWrapper);
    }
  }

  /* --------------------------------------------------------------------------
     3. SHOWCASE INTERACTIVE FOLLOWER CURSOR BADGE & PORTFOLIO TRIGGER
     -------------------------------------------------------------------------- */
  const showcaseBox = document.getElementById('showcaseBox');
  const showcaseCursor = document.getElementById('showcaseCursor');

  if (showcaseBox && showcaseCursor) {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let isInside = false;

    // Detect touch / fine pointer
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isTouch) {
      document.body.classList.add('is-touch');
      showcaseBox.classList.add('touch-showcase');
      showcaseCursor.style.opacity = '1';
    }

    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (hasFinePointer && !isTouch) {
      showcaseBox.addEventListener('mouseenter', () => {
        isInside = true;
      });

      showcaseBox.addEventListener('mouseleave', () => {
        isInside = false;
      });

      showcaseBox.addEventListener('mousemove', (e) => {
        const rect = showcaseBox.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
      });

      // Avoid blocking Before/After slider drag interactions
      const colorGradeSlider = document.getElementById('colorGradeSlider');
      if (colorGradeSlider) {
        colorGradeSlider.addEventListener('mouseenter', () => {
          showcaseCursor.style.opacity = '0';
          showcaseCursor.style.pointerEvents = 'none';
        });
        colorGradeSlider.addEventListener('mouseleave', () => {
          showcaseCursor.style.opacity = '1';
          showcaseCursor.style.pointerEvents = 'auto';
        });
      }

      function renderCursor() {
        if (isInside) {
          currentX += (targetX - currentX) * 0.18;
          currentY += (targetY - currentY) * 0.18;
          showcaseCursor.style.left = `${currentX}px`;
          showcaseCursor.style.top = `${currentY}px`;
        }
        requestAnimationFrame(renderCursor);
      }
      renderCursor();
    }

    // Function to smoothly scroll directly to "My Projects" (#works / #portfolioMasterCard)
    function goToMyProjects(e) {
      if (e) {
        // If clicking or dragging inside the Before/After comparison slider, don't hijack it
        if (e.target && e.target.closest('#colorGradeSlider')) {
          return;
        }
        e.preventDefault();
      }

      const dest = document.getElementById('portfolioMasterCard') || document.getElementById('works');
      if (dest) {
        const headerOffset = 80;
        const elementPosition = dest.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Add sleek highlight pulse animation to My Projects card
        const targetCard = document.getElementById('portfolioMasterCard');
        if (targetCard) {
          targetCard.classList.remove('highlight-pulse');
          void targetCard.offsetWidth; // Trigger reflow
          targetCard.classList.add('highlight-pulse');
        }

        if (history.pushState) {
          history.pushState(null, '', '#works');
        }
      }
    }

    // 1. Direct click/tap on the "See Recent Work" badge
    showcaseCursor.addEventListener('click', goToMyProjects);
    showcaseCursor.addEventListener('touchend', (e) => {
      goToMyProjects(e);
    });

    // 2. Click or tap ANYWHERE inside the Showcase box (except Before/After slider)
    showcaseBox.addEventListener('click', (e) => {
      if (e.target && e.target.closest('#colorGradeSlider')) return;
      goToMyProjects(e);
    });
  }

  /* --------------------------------------------------------------------------
     4. DRAGGABLE SKILL PHYSICS & FLOATING BADGES (MOBILE & DESKTOP)
     -------------------------------------------------------------------------- */
  const manifestoArea = document.getElementById('manifestoArea');
  const badgeEls = Array.from(document.querySelectorAll('.draggable-badge'));

  if (manifestoArea && badgeEls.length > 0) {
    class PhysicsBadge {
      constructor(el, index, total) {
        this.el = el;
        this.index = index;
        this.total = total;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.width = 140;
        this.height = 42;
        this.isDragging = false;
        this.pointerId = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.lastTime = 0;

        // Floating idle oscillation parameters
        this.floatPhase = (index / total) * Math.PI * 2;
        this.floatSpeed = 0.022 + (index % 3) * 0.007;
        this.floatRadiusX = 7 + (index % 2) * 5;
        this.floatRadiusY = 9 + ((index + 1) % 3) * 4;
        this.anchorX = 0;
        this.anchorY = 0;

        this.initEvents();
      }

      initEvents() {
        this.el.addEventListener('pointerdown', (e) => this.onPointerDown(e));
        this.el.addEventListener('pointermove', (e) => this.onPointerMove(e));
        this.el.addEventListener('pointerup', (e) => this.onPointerUp(e));
        this.el.addEventListener('pointercancel', (e) => this.onPointerUp(e));
      }

      setInitialSlots(parentW, parentH) {
        const rect = this.el.getBoundingClientRect();
        this.width = rect.width || (parentW < 600 ? 125 : 155);
        this.height = rect.height || 40;

        const isMobile = parentW < 900;

        if (isMobile) {
          // Mobile safe slotting: Badges NEVER overlap text
          // Top: 2 badges above text
          // Bottom: 4 badges below text in 2 clean rows
          switch (this.index) {
            case 0: // Video Editor (top-left)
              this.anchorX = 12;
              this.anchorY = 14;
              break;
            case 1: // Motion Designer (top-right)
              this.anchorX = Math.max(12, parentW - this.width - 12);
              this.anchorY = 14;
              break;
            case 2: // Research & Strategy (bottom row 1 left)
              this.anchorX = 12;
              this.anchorY = parentH - 180;
              break;
            case 3: // Trends & Algorithms (bottom row 1 right)
              this.anchorX = Math.max(12, parentW - this.width - 12);
              this.anchorY = parentH - 180;
              break;
            case 4: // Viral Retention (bottom row 2 left)
              this.anchorX = 12;
              this.anchorY = parentH - 90;
              break;
            case 5: // Color Grading (bottom row 2 right)
              this.anchorX = Math.max(12, parentW - this.width - 12);
              this.anchorY = parentH - 90;
              break;
            default:
              this.anchorX = (parentW - this.width) / 2;
              this.anchorY = parentH - 75;
          }
        } else {
          // Desktop safe slotting: Spacious orbit around centered text
          switch (this.index) {
            case 0: // Video Editor (top-left)
              this.anchorX = parentW * 0.02;
              this.anchorY = parentH * 0.05;
              break;
            case 1: // Motion Designer (top-right)
              this.anchorX = parentW * 0.75;
              this.anchorY = parentH * 0.05;
              break;
            case 2: // Research (mid-left)
              this.anchorX = parentW * 0.04;
              this.anchorY = parentH * 0.62;
              break;
            case 3: // Trends (bottom-right)
              this.anchorX = parentW * 0.72;
              this.anchorY = parentH * 0.74;
              break;
            case 4: // Viral Retention (bottom-left)
              this.anchorX = parentW * 0.08;
              this.anchorY = parentH * 0.82;
              break;
            case 5: // Color Grading (bottom-mid)
              this.anchorX = parentW * 0.40;
              this.anchorY = parentH * 0.80;
              break;
            default:
              this.anchorX = parentW * 0.2;
              this.anchorY = parentH * 0.2;
          }
        }

        this.x = this.anchorX;
        this.y = this.anchorY;
        this.vx = 0;
        this.vy = 0;
      }

      onPointerDown(e) {
        e.preventDefault();
        this.isDragging = true;
        this.pointerId = e.pointerId;
        try { this.el.setPointerCapture(e.pointerId); } catch(err) {}
        this.el.classList.add('is-dragging');

        const parentRect = manifestoArea.getBoundingClientRect();
        this.dragOffsetX = e.clientX - (parentRect.left + this.x);
        this.dragOffsetY = e.clientY - (parentRect.top + this.y);

        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.lastTime = performance.now();
        this.vx = 0;
        this.vy = 0;
      }

      onPointerMove(e) {
        if (!this.isDragging) return;
        const now = performance.now();
        const dt = Math.max(1, now - this.lastTime);
        const parentRect = manifestoArea.getBoundingClientRect();

        const newX = e.clientX - parentRect.left - this.dragOffsetX;
        const newY = e.clientY - parentRect.top - this.dragOffsetY;

        // Calculate fling release velocity
        this.vx = ((e.clientX - this.lastX) / dt) * 16;
        this.vy = ((e.clientY - this.lastY) / dt) * 16;

        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.lastTime = now;

        this.x = newX;
        this.y = newY;
        this.anchorX = newX;
        this.anchorY = newY;
      }

      onPointerUp(e) {
        if (!this.isDragging) return;
        this.isDragging = false;
        try { this.el.releasePointerCapture(e.pointerId); } catch(err) {}
        this.el.classList.remove('is-dragging');

        // Clamp extreme fling velocities
        const maxV = 26;
        this.vx = Math.max(-maxV, Math.min(maxV, this.vx));
        this.vy = Math.max(-maxV, Math.min(maxV, this.vy));
      }

      update(parentW, parentH) {
        const maxX = parentW - this.width - 6;
        const maxY = parentH - this.height - 6;
        const minX = 6;
        const minY = 6;

        if (this.isDragging) {
          this.x = Math.max(minX - 25, Math.min(maxX + 25, this.x));
          this.y = Math.max(minY - 25, Math.min(maxY + 25, this.y));
          this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) scale(1.1)`;
          return;
        }

        const isMovingFast = Math.abs(this.vx) > 0.25 || Math.abs(this.vy) > 0.25;

        if (isMovingFast) {
          this.x += this.vx;
          this.y += this.vy;

          // Friction damping
          this.vx *= 0.93;
          this.vy *= 0.93;

          // Boundary bounce with restitution
          const restitution = 0.72;
          if (this.x < minX) {
            this.x = minX;
            this.vx = -this.vx * restitution;
          } else if (this.x > maxX) {
            this.x = maxX;
            this.vx = -this.vx * restitution;
          }

          if (this.y < minY) {
            this.y = minY;
            this.vy = -this.vy * restitution;
          } else if (this.y > maxY) {
            this.y = maxY;
            this.vy = -this.vy * restitution;
          }

          this.anchorX = this.x;
          this.anchorY = this.y;

          const tilt = Math.max(-8, Math.min(8, this.vx * 0.4));
          this.el.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) rotate(${tilt}deg)`;
        } else {
          // Idle sinusoidal organic floating
          this.vx = 0;
          this.vy = 0;
          this.floatPhase += this.floatSpeed;

          const floatOffsetX = Math.sin(this.floatPhase) * this.floatRadiusX;
          const floatOffsetY = Math.cos(this.floatPhase * 0.8) * this.floatRadiusY;
          const tilt = Math.sin(this.floatPhase) * 2;

          let renderX = this.anchorX + floatOffsetX;
          let renderY = this.anchorY + floatOffsetY;

          renderX = Math.max(minX, Math.min(maxX, renderX));
          renderY = Math.max(minY, Math.min(maxY, renderY));

          this.el.style.transform = `translate3d(${renderX}px, ${renderY}px, 0) rotate(${tilt}deg)`;
        }
      }
    }

    const physicsBadges = badgeEls.map((el, i) => new PhysicsBadge(el, i, badgeEls.length));

    function resetLayout() {
      const rect = manifestoArea.getBoundingClientRect();
      const parentW = rect.width;
      const parentH = rect.height;
      if (parentW > 0 && parentH > 0) {
        physicsBadges.forEach(b => b.setInitialSlots(parentW, parentH));
      }
    }

    setTimeout(resetLayout, 60);

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resetLayout, 150);
    });

    function loop() {
      const rect = manifestoArea.getBoundingClientRect();
      const parentW = rect.width;
      const parentH = rect.height;

      if (parentW > 0 && parentH > 0) {
        physicsBadges.forEach(b => b.update(parentW, parentH));
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* --------------------------------------------------------------------------
     5. PORTFOLIO FILTER TABS
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterVal === 'all' || filterVal === cardCat) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     6. INTERACTIVE FAQ ACCORDION
     -------------------------------------------------------------------------- */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others for sleek single accordion
      accordionItems.forEach(other => {
        other.classList.remove('active');
        const otherContent = other.querySelector('.accordion-content');
        if (otherContent) otherContent.style.maxHeight = '0px';
      });

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 30 + 'px';
      }
    });
  });

  /* --------------------------------------------------------------------------
     7. SCROLLSPY NAVIGATION
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const sectionHeight = sec.offsetHeight;
      const sectionTop = sec.offsetTop - 140;
      const sectionId = sec.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });


  /* --------------------------------------------------------------------------
     8. SCROLL REVEAL ANIMATIONS (MOBILE & DESKTOP)
     -------------------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.bento-card, .work-card, .faq-contact-card, .accordion-item, .portfolio-master-card'
  );

  revealTargets.forEach((el, index) => {
    el.classList.add('reveal-on-scroll');
    const delayClass = `stagger-${(index % 4) + 1}`;
    el.classList.add(delayClass);
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-revealed'));
  }

});

/* --------------------------------------------------------------------------
   8. GLOBAL VIDEO LIGHTBOX MODAL FUNCTION
   -------------------------------------------------------------------------- */
function openVideoModal(title, desc, videoSource, isVertical = false) {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoModalIframe');
  const videoPlayer = document.getElementById('videoModalVideoPlayer');
  const titleEl = document.getElementById('videoModalTitle');
  const descEl = document.getElementById('videoModalDesc');
  const wrapper = document.getElementById('videoModalPlayerWrapper');
  const container = modal ? modal.querySelector('.video-modal-container') : null;

  if (!modal) return;

  if (titleEl) titleEl.textContent = title || 'Featured Project';
  if (descEl) descEl.textContent = desc || 'Video editing showcase.';

  if (isVertical) {
    if (wrapper) wrapper.classList.add('is-vertical');
    if (container) container.classList.add('modal-is-vertical');
  } else {
    if (wrapper) wrapper.classList.remove('is-vertical');
    if (container) container.classList.remove('modal-is-vertical');
  }

  const isLocalMp4 =
    typeof videoSource === 'string' &&
    (videoSource.endsWith('.mp4') || videoSource.includes('.mp4'));

  if (isLocalMp4) {
    if (iframe) {
      iframe.style.display = 'none';
      iframe.src = '';
    }
    if (videoPlayer) {
      videoPlayer.style.display = 'block';
      videoPlayer.src = videoSource;
      videoPlayer.currentTime = 0;
      videoPlayer.play().catch(() => {});
    }
  } else {
    if (videoPlayer) {
      videoPlayer.pause();
      videoPlayer.style.display = 'none';
      videoPlayer.src = '';
    }
    if (iframe) {
      iframe.style.display = 'block';
      iframe.src = `https://www.youtube.com/embed/${videoSource}?autoplay=1&modestbranding=1&rel=0&playsinline=1`;
    }
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoModalIframe');
  const videoPlayer = document.getElementById('videoModalVideoPlayer');
  if (!modal) return;

  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  if (iframe) iframe.src = '';
  if (videoPlayer) {
    videoPlayer.pause();
    videoPlayer.src = '';
  }
  document.body.style.overflow = '';
}

// Attach close listener
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('videoModalClose');
  const modal = document.getElementById('videoModal');

  if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeVideoModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
  });
});
