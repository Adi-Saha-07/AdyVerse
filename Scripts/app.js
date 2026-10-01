/* ==========================================================================
   AdyVerse — app.js (v4.0)
   Editorial Monochrome + iOS 27 Liquid Glass + Scroll-Driven 3D Flip Engine
   ========================================================================== */

/* ──────────────────────────────────────────────────────────────────────────
   0. PREMIUM SMOOTH SCROLL ENGINE
   Momentum-based lerp (linear interpolation) scroll with exponential easing.
   Far smoother than the browser's native scroll-behavior:smooth.
   ────────────────────────────────────────────────────────────────────────── */
(function () {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return; // Respect accessibility

    // Smooth scroll config
    const LERP_FACTOR = 0.082;      // Lower = more momentum, higher = snappier (0.06–0.12 sweet spot)
    const VELOCITY_THRESHOLD = 0.4; // px — stop rAF loop below this velocity

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let rafId = null;
    let isAnimating = false;

    // Clamp helper
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    // Core lerp loop
    function smoothLoop() {
        const diff = targetY - currentY;

        if (Math.abs(diff) < VELOCITY_THRESHOLD) {
            currentY = targetY;
            window.scrollTo(0, currentY);
            isAnimating = false;
            rafId = null;
            return;
        }

        currentY += diff * LERP_FACTOR;
        window.scrollTo(0, currentY);
        rafId = requestAnimationFrame(smoothLoop);
    }

    // Intercept wheel events for smooth momentum
    window.addEventListener('wheel', (e) => {
        e.preventDefault();

        // Increase scroll distance for a more natural feel
        const delta = e.deltaY * (e.deltaMode === 1 ? 30 : e.deltaMode === 2 ? window.innerHeight : 1);
        const maxY = document.documentElement.scrollHeight - window.innerHeight;

        targetY = clamp(targetY + delta, 0, maxY);

        if (!isAnimating) {
            isAnimating = true;
            currentY = window.scrollY;
            rafId = requestAnimationFrame(smoothLoop);
        }
    }, { passive: false });

    // Smooth anchor-link scrolling (nav clicks, "back to top", etc.)
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const hash = anchor.getAttribute('href');
        if (!hash || hash === '#') return;

        const target = document.querySelector(hash);
        if (!target) return;

        e.preventDefault();

        const headerOffset = 80; // Match sticky header height
        const elementTop = target.getBoundingClientRect().top + window.scrollY;
        const scrollTo = Math.max(0, elementTop - headerOffset);
        const maxY = document.documentElement.scrollHeight - window.innerHeight;

        targetY = clamp(scrollTo, 0, maxY);

        if (!isAnimating) {
            isAnimating = true;
            currentY = window.scrollY;
            rafId = requestAnimationFrame(smoothLoop);
        }

        // Update URL hash without jumping
        history.pushState(null, '', hash);
    });

    // Touch scroll: sync targetY to actual position (native touch is already smooth)
    window.addEventListener('touchstart', () => {
        if (isAnimating) {
            cancelAnimationFrame(rafId);
            isAnimating = false;
        }
        targetY = window.scrollY;
        currentY = window.scrollY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
        targetY = window.scrollY;
        currentY = window.scrollY;
    }, { passive: true });

    // Keyboard arrow/page scroll
    window.addEventListener('keydown', (e) => {
        const maxY = document.documentElement.scrollHeight - window.innerHeight;
        let delta = 0;

        switch (e.key) {
            case 'ArrowDown': delta = 80; break;
            case 'ArrowUp': delta = -80; break;
            case 'PageDown': delta = window.innerHeight * 0.85; break;
            case 'PageUp': delta = -window.innerHeight * 0.85; break;
            case 'End': delta = maxY - targetY; break;
            case 'Home': delta = -targetY; break;
            default: return;
        }

        // Don't hijack if user is typing in an input
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

        e.preventDefault();
        targetY = clamp(targetY + delta, 0, maxY);

        if (!isAnimating) {
            isAnimating = true;
            currentY = window.scrollY;
            rafId = requestAnimationFrame(smoothLoop);
        }
    });
})();

document.addEventListener('DOMContentLoaded', () => {


    /* ──────────────────────────────────────────────────────────────────────
       1. SCROLL PROGRESS BAR
       ────────────────────────────────────────────────────────────────────── */
    const progressBar = document.getElementById('scroll-progress');
    const updateScrollProgress = () => {
        if (!progressBar) return;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const pct = totalHeight > 0 ? (scrolled / totalHeight) * 100 : 0;
        progressBar.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', updateScrollProgress, { passive: true });


    /* ──────────────────────────────────────────────────────────────────────
       2. iOS 27 LIQUID GLASS HEADER & DRAWER
       ────────────────────────────────────────────────────────────────────── */
    const headerCapsule = document.querySelector('.island-capsule');
    const islandToggle = document.getElementById('islandToggle');
    const glassDrawer = document.getElementById('glassDrawer');
    const navItems = document.querySelectorAll('.island-nav .nav-item');
    const drawerItems = document.querySelectorAll('.drawer-item');

    // Sticky shrink & elevation on scroll
    window.addEventListener('scroll', () => {
        if (!headerCapsule) return;
        if (window.scrollY > 40) {
            headerCapsule.style.transform = 'scale(0.98)';
            headerCapsule.style.background = 'rgba(255, 255, 255, 0.85)';
        } else {
            headerCapsule.style.transform = 'scale(1)';
            headerCapsule.style.background = 'rgba(255, 255, 255, 0.72)';
        }
    }, { passive: true });

    // Drawer menu toggle
    if (islandToggle && glassDrawer) {
        islandToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            glassDrawer.classList.toggle('open');
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!glassDrawer.contains(e.target) && !islandToggle.contains(e.target)) {
                glassDrawer.classList.remove('open');
            }
        });

        // Close drawer on link click
        drawerItems.forEach(item => {
            item.addEventListener('click', () => {
                glassDrawer.classList.remove('open');
            });
        });
    }

    // Active nav link spy on scroll
    const sections = document.querySelectorAll('section[id]');
    const mbnItems = document.querySelectorAll('.mbn-item');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        sections.forEach(sec => {
            const top = sec.offsetTop - 180;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navItems.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
                mbnItems.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { passive: true });


    /* ──────────────────────────────────────────────────────────────────────
       3. SIGNATURE SCROLL-DRIVEN 3D FLIP & COLOR MORPH ENGINE
          (Translates from Hero headline center -> flips 180° -> docks in "Hey!")
       ────────────────────────────────────────────────────────────────────── */
    const flipPortal = document.getElementById('flipPortal');   // wrapper — CSS positions this, JS must NOT touch transform
    const flipCard = document.getElementById('scrollFlipCard');  // inner card — JS rotates this
    const heroSection = document.getElementById('hero');
    const heroPhotoStage = document.getElementById('heroPhotoStage');
    const dockSlot = document.getElementById('dockSlot');

    let targetProgress = 0;
    let currentProgress = 0;
    let isLoopRunning = false;

    function applyTransform(p) {
        if (!flipCard || window.innerWidth <= 1024) return;

        // JS only rotates the inner card — CSS sticky handles position
        const rotY = p * 180;
        // Scale up: starts small (0.85) in hero, grows bigger (1.25) when landing in about
        const baseScale = 0.85 + p * 0.40;
        // Subtle mid-flip pop on top of the base growth
        const popScale = 1 + Math.sin(p * Math.PI) * 0.04;
        const finalScale = baseScale * popScale;
        flipCard.style.transform = `rotateY(${rotY}deg) scale(${finalScale})`;

        // Front face: stays crisp noir B&W throughout
        const frontImg = flipCard.querySelector('.photo-bw');
        if (frontImg) {
            frontImg.style.filter = `grayscale(100%) contrast(1.15) brightness(0.92)`;
        }

        // Back face: blooms from B&W → rich full color as flip passes midpoint
        const backImg = flipCard.querySelector('.photo-color');
        if (backImg) {
            const colorRatio = Math.min(Math.max((p - 0.35) / 0.65, 0), 1);
            const sat = 1.0 + colorRatio * 0.3;
            const gray = Math.max(0, (1 - colorRatio) * 100);
            backImg.style.filter = `grayscale(${gray}%) contrast(1.05) saturate(${sat})`;
        }
    }

    function smoothStep() {
        const diff = targetProgress - currentProgress;
        if (Math.abs(diff) > 0.0008) {
            currentProgress += diff * 0.12; // buttery smooth easing
            applyTransform(currentProgress);
            requestAnimationFrame(smoothStep);
        } else {
            currentProgress = targetProgress;
            applyTransform(currentProgress);
            isLoopRunning = false;
        }
    }

    function updateScrollTarget() {
        if (window.innerWidth <= 1024) {
            // Disabled on mobile as requested (photo sits statically in hero section)
            return;
        }

        const stickyWrap = document.getElementById('heroPhotoStage');
        const dock = document.getElementById('dockSlot');
        const aboutGrid = document.getElementById('about');
        if (!stickyWrap || !dock) return;

        const scrollY = window.scrollY;
        const dockRect = dock.getBoundingClientRect();
        const stageRect = stickyWrap.getBoundingClientRect();
        const gridRect = aboutGrid ? aboutGrid.getBoundingClientRect() : dockRect;

        // Visual height of the card when scaled (scale = 1.25 in About section)
        const portalHeight = flipPortal ? flipPortal.offsetHeight : 250;
        const photoVisualHeight = portalHeight * 1.25;

        // Current un-shifted center and bottom of the sticky photo
        const naturalPhotoCenter = stageRect.top + portalHeight / 2;
        const unShiftedPhotoBottom = naturalPhotoCenter + photoVisualHeight / 2;

        // The exact "red line" drawn by the user (bottom of about grid / buttons)
        const redLine = gridRect.bottom;

        // Calculate how much the photo bottom overflows past the red line
        const overflowPastRedLine = unShiftedPhotoBottom - redLine;

        // Distance from dockSlot center
        const dockCenter = dockRect.top + dockRect.height / 2;
        const diff = dockCenter - naturalPhotoCenter;

        // STRICT CLAMP: If the photo bottom crosses the red line, shift it UP
        // by the exact overflow amount so its bottom never, ever goes below the red line!
        if (flipPortal) {
            if (overflowPastRedLine > 0) {
                flipPortal.style.transform = `translate3d(0, ${(-overflowPastRedLine).toFixed(2)}px, 0)`;
            } else if (diff < 0) {
                flipPortal.style.transform = `translate3d(0, ${diff.toFixed(2)}px, 0)`;
            } else {
                flipPortal.style.transform = '';
            }
        }

        // Calculate flip progress from 0 (at hero) to 1 (when arriving at dockSlot)
        const landingScrollY = scrollY + diff;
        if (landingScrollY > 50) {
            targetProgress = Math.min(Math.max(scrollY / landingScrollY, 0), 1);
        } else {
            targetProgress = diff <= 0 ? 1 : 0;
        }

        if (!isLoopRunning) {
            isLoopRunning = true;
            requestAnimationFrame(smoothStep);
        }
    }

    window.addEventListener('scroll', updateScrollTarget, { passive: true });
    window.addEventListener('resize', () => {
        updateScrollTarget();
        applyTransform(currentProgress);
    }, { passive: true });

    // Initial render call
    updateScrollTarget();
    applyTransform(targetProgress);


    /* ──────────────────────────────────────────────────────────────────────
       4. AMBIENT GLYPH PARALLAX MOUSE EFFECT (DESKTOP)
       ────────────────────────────────────────────────────────────────────── */
    const starGlyph = document.querySelector('.glyph-star');
    const boltGlyph = document.querySelector('.glyph-bolt');

    if (window.innerWidth > 1024 && heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const deltaX = (clientX - centerX) / centerX;
            const deltaY = (clientY - centerY) / centerY;

            if (starGlyph) {
                starGlyph.style.transform = `translate(${deltaX * -22}px, ${deltaY * -22}px) rotate(${deltaX * 10}deg)`;
            }
            if (boltGlyph) {
                boltGlyph.style.transform = `translate(${deltaX * 26}px, ${deltaY * 26}px) rotate(${deltaY * -8}deg)`;
            }
        });

        heroSection.addEventListener('mouseleave', () => {
            if (starGlyph) starGlyph.style.transform = '';
            if (boltGlyph) boltGlyph.style.transform = '';
        });
    }


    /* ──────────────────────────────────────────────────────────────────────
       5. COUNTER ANIMATION — handled by Section 10 (Stat Flip Reveal)
       ────────────────────────────────────────────────────────────────────── */
    // Counters are now triggered after the flip animation completes (see Section 10).


    /* ──────────────────────────────────────────────────────────────────────
       6. 3D INTERACTIVE SKILLS SPHERE (TAGCANVAS)
       ────────────────────────────────────────────────────────────────────── */
    function startTagCanvas() {
        if (!window.TagCanvas) return;
        const canvas = document.getElementById('skillCanvas');
        const wrapper = document.querySelector('.sphere-wrapper');

        // Dynamically compute canvas dimensions to ensure it never exceeds container
        if (canvas && wrapper) {
            const containerWidth = wrapper.clientWidth || (wrapper.parentElement ? wrapper.parentElement.clientWidth : 340);
            const targetDim = Math.min(Math.max(containerWidth - 24, 260), 460);
            canvas.width = targetDim;
            canvas.height = targetDim;
        }

        try {
            TagCanvas.Start('skillCanvas', 'tags', {
                textColour: '#0d0d0d',
                textHeight: window.innerWidth <= 768 ? 14 : 20,
                outlineColour: 'transparent',
                depth: 0.92,
                maxSpeed: 0.025,
                minSpeed: 0.008,
                decel: 0.98,
                reverse: true,
                wheelZoom: false,
                shadow: 'rgba(0, 0, 0, 0.08)',
                shadowBlur: 4,
                initial: [0.08, -0.04],
                fadeIn: 800,
                noSelect: true
            });
        } catch (e) {
            console.warn('TagCanvas notice:', e);
        }
    }
    // Run after full page load; fallback to DOMContentLoaded timing if load already fired
    if (document.readyState === 'complete') {
        startTagCanvas();
    } else {
        window.addEventListener('load', startTagCanvas);
    }


    /* ──────────────────────────────────────────────────────────────────────
       7. CONTACT FORM (FORMSPREE WITH DYNAMIC FEEDBACK)
       ────────────────────────────────────────────────────────────────────── */
    const contactForm = document.getElementById('editorialContactForm');
    const submitBtn = document.getElementById('submitButton');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalText = submitBtn.innerHTML;

            // Loading state
            submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
                    submitBtn.style.background = '#1a1a1a';
                    submitBtn.style.opacity = '1';
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 4000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (err) {
                // Fallback submission if fetch is blocked by CORS/file protocol
                contactForm.submit();
            }
        });
    }


    /* ──────────────────────────────────────────────────────────────────────
       8. DYNAMIC YEAR
       ────────────────────────────────────────────────────────────────────── */
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    /* ──────────────────────────────────────────────────────────────────────
       9. SCROLL REVEAL — IntersectionObserver
       Targets major content blocks and fades + slides them up as they
       enter the viewport. No HTML edits required.
       ────────────────────────────────────────────────────────────────────── */
    const REVEAL_SELECTORS = [
        /* Hero */
        '.hero-headline-wrap',
        '.hero-meta-bar',
        '.hero-mobile-photo-card',

        /* About */
        '.dock-left',
        '.dock-right',

        /* Journey / Stats — handled separately via flip reveal */
        '.editorial-header',

        /* Education */
        '.edu-card',

        /* Skills */
        '.skills-panel',
        '.skills-canvas-card',

        /* Projects */
        '.project-editorial-card',

        /* Credentials */
        '.cert-card',

        /* Leadership */
        '.leadership-editorial-card',

        /* Contact */
        '.contact-glass-card',
        '.contact-info-panel',

        /* Footer */
        '.footer-big-phrase',
        '.footer-contact-details',
    ];

    // Mark elements as .reveal (hidden) — skip if reduced-motion is preferred
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced) {
        REVEAL_SELECTORS.forEach(sel => {
            document.querySelectorAll(sel).forEach((el, i) => {
                el.classList.add('reveal');
                // Slight stagger for siblings (capped at 300ms)
                el.style.setProperty('--reveal-delay', `${Math.min(i * 60, 300)}ms`);
            });
        });

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target); // reveal once
                }
            });
        }, {
            threshold: 0.12,          // 12% of element visible triggers reveal
            rootMargin: '0px 0px -40px 0px'  // slight bottom offset
        });

        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }


    /* ──────────────────────────────────────────────────────────────────────
       10. STAT CARDS — STAGGERED FLIP REVEAL
       Cards show black back face first, then flip one-by-one to front.
       ────────────────────────────────────────────────────────────────────── */
    const statBoxes = document.querySelectorAll('.stat-box');

    if (statBoxes.length) {
        const flipObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                // Trigger each card flip sequentially with 200ms stagger
                statBoxes.forEach((box, i) => {
                    setTimeout(() => {
                        box.classList.add('stat-flipped');
                    }, i * 200);
                });

                // Start counters after all cards have flipped
                const totalFlipTime = (statBoxes.length - 1) * 200 + 720;
                setTimeout(() => {
                    document.querySelectorAll('.counter').forEach(counter => {
                        const target = parseFloat(counter.getAttribute('data-target'));
                        const isDecimal = target % 1 !== 0;
                        const duration = 1200;
                        const start = performance.now();

                        const tick = (now) => {
                            const elapsed = now - start;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            const current = eased * target;
                            counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
                            if (progress < 1) requestAnimationFrame(tick);
                            else counter.textContent = isDecimal ? target.toFixed(1) : target;
                        };
                        requestAnimationFrame(tick);
                    });
                }, totalFlipTime);

                flipObserver.unobserve(entry.target); // trigger once
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe the grid container so all 4 cards flip together on entry
        const statsGrid = document.querySelector('.stats-editorial-grid');
        if (statsGrid) flipObserver.observe(statsGrid);
    }

}); // End DOMContentLoaded