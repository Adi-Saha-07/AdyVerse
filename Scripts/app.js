/* =========================================
   AdyVerse Portfolio JavaScript
   ========================================= */
//Home
document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll(".reveal-up, .reveal-scale, .reveal-fade");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.18 });

    reveals.forEach((el) => observer.observe(el));

    const profileImg = document.getElementById("profile-img");
    const wrapper = document.querySelector(".glass-card");

    if (profileImg && wrapper && window.innerWidth > 992) {
        wrapper.addEventListener("mousemove", (e) => {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateY = ((x / rect.width) - 0.5) * 10;
            const rotateX = ((y / rect.height) - 0.5) * -10;

            profileImg.style.transform = `scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        wrapper.addEventListener("mouseleave", () => {
            profileImg.style.transform = "scale(1) rotateX(0deg) rotateY(0deg)";
        });
    }
});



/* ==========================
   COUNT UP ANIMATION
========================== */

const counters = document.querySelectorAll(".counter");

const startCounters = () => {

    counters.forEach(counter => {

        const target = +counter.getAttribute("data-target");

        let count = 0;

        const speed = target / 60;

        const updateCount = () => {

            if (count < target) {

                count += speed;

                if (target === 8) {
                    counter.innerText = count.toFixed(1);
                } else {
                    counter.innerText = Math.ceil(count);
                }

                requestAnimationFrame(updateCount);

            } else {

                if (target === 8) {
                    counter.innerText = "8.0";
                } else {
                    counter.innerText = target + "+";
                }

            }

        };

        updateCount();

    });

};

const statsSection = document.querySelector(".stats");

const observer = new IntersectionObserver(entries => {

    if (entries[0].isIntersecting) {

        startCounters();

        observer.disconnect();

    }

}, { threshold: 0.4 });

observer.observe(statsSection);


//skill gloabe effect
window.addEventListener("load", () => {

    if (!window.TagCanvas) return;

    try {

        TagCanvas.Start("skillCanvas", "tags", {

            textColour: "#ffffff",
            textHeight: 24,

            outlineColour: "transparent",

            shadow: "#ff2b2b",
            shadowBlur: 10,

            depth: 0.8,

            zoom: 1,

            // Right → Left slow rotation
            reverse: true,
            initial: [0.08, 0],

            maxSpeed: 0.02,
            minSpeed: 0.01,

            freezeActive: false,
            freezeDecel: false,

            decel: 1,

            wheelZoom: false,
            dragControl: false,

            shuffleTags: false,

            fadeIn: 1000,

            noSelect: true

        });

    } catch (e) {

        console.error(e);

    }

});


//scroll bar
window.addEventListener("scroll", () => {
    const winScroll =
        document.documentElement.scrollTop;

    const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const scrolled =
        (winScroll / height) * 100;

    document.getElementById(
        "scroll-progress"
    ).style.width = scrolled + "%";
});

// popup
const profileImg = document.getElementById("profile-img");
const popup = document.getElementById("profilePopup");
const closeBtn = document.querySelector(".close-popup");

profileImg.addEventListener("click", () => {
    popup.classList.add("active");
});

closeBtn.addEventListener("click", () => {
    popup.classList.remove("active");
});

popup.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.classList.remove("active");
    }
});



// --- Preloader ---
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500); // fully remove from flow

        // Trigger initial reveal animations after preloader
        reveal();
    }, 1500); // Reduced to 1 second for a snappier load
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    hidePreloader();
} else {
    document.addEventListener('DOMContentLoaded', hidePreloader);
    window.addEventListener('load', hidePreloader); // fallback
}


// --- Navigation Toggle (Mobile) ---
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Remove menu on link click
const navLinks = document.querySelectorAll('.nav-link');
const linkAction = () => {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
}
navLinks.forEach(n => n.addEventListener('click', linkAction));

// --- Sticky Header ---
const scrollHeader = () => {
    const header = document.getElementById('header');
    if (window.scrollY >= 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
}
window.addEventListener('scroll', scrollHeader);

// --- Active Link on Scroll ---
const sections = document.querySelectorAll('section[id]');
const scrollActive = () => {
    const scrollDown = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 100,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav-menu a[href*=' + sectionId + ']');

        if (sectionsClass) {
            if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
                sectionsClass.classList.add('active');
            } else {
                sectionsClass.classList.remove('active');
            }
        }
    });
}
window.addEventListener('scroll', scrollActive);

// --- Skills Tabs ---
const tabs = document.querySelectorAll('.skills-tab'),
    groups = document.querySelectorAll('.skills-group');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.target);

        // Remove active class from all groups and tabs
        groups.forEach(group => group.classList.remove('active'));
        tabs.forEach(t => t.classList.remove('active'));

        // Add active class to clicked tab and corresponding group
        tab.classList.add('active');
        target.classList.add('active');
    });
});

// --- Scroll Reveal Animations ---
function reveal() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-scale, .reveal-slide-left, .reveal-slide-right');
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    reveals.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}
window.addEventListener('scroll', reveal);

// --- Contact Form Submission (Mock) ---
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector("button");
        const originalText = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    Accept: "application/json"
                }
            });

            if (response.ok) {
                contactForm.reset();
                btn.innerHTML = 'Message Sent <i class="fas fa-check"></i>';
                btn.style.background = "linear-gradient(135deg, #00ff88, #00cc66)";
            } else {
                btn.innerHTML = 'Failed to Send <i class="fas fa-times"></i>';
                btn.style.background = "#ff2b2b";
            }
        } catch (error) {
            btn.innerHTML = 'Network Error <i class="fas fa-wifi"></i>';
            btn.style.background = "#ff2b2b";
        }

        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            btn.style.background = "";
        }, 3000);
    });
}

// --- Footer Year ---
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}


window.addEventListener("load", () => {
    document.documentElement.classList.add("loaded");
});
