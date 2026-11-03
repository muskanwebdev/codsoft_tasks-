// PNS — PIXELNEST STUDIO

// NAVBAR
const header = document.getElementById("header");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navItems = document.querySelectorAll(".nav-links a");

let lastScroll = window.scrollY;

window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    header.classList.toggle("scrolled", currentScroll > 30);

    if (currentScroll > lastScroll && currentScroll > 150) {
        header.classList.add("nav-hidden");
    } else {
        header.classList.remove("nav-hidden");
    }

    lastScroll = currentScroll;

    const backToTop = document.getElementById("back-to-top");

    if (currentScroll > 450) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

// MOBILE MENU
menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((item) => {
    item.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

// Close the mobile menu with Escape.
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.focus();
    }
});

// ACTIVE NAV LINK
const sections = document.querySelectorAll("main section[id]");

const activeObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const currentId = entry.target.id;

                navItems.forEach((link) => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${currentId}`
                    );
                });
            }
        });
    },
    {
        rootMargin: "-35% 0px -55% 0px"
    }
);

sections.forEach((section) => activeObserver.observe(section));

// SCROLL REVEAL
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${(index % 4) * 90}ms`;
    revealObserver.observe(element);
});

// BACK TO TOP
const backToTop = document.getElementById("back-to-top");

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// COPYRIGHT YEAR
document.getElementById("year").textContent = new Date().getFullYear();

// CURSOR LIGHT
const cursorGlow = document.querySelector(".cursor-glow");

if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (event) => {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
    });
}

// BUTTON CLICK SOUND
// Only click sound. No hover sound or background music.
let audioContext;

function playClickSound() {
    try {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        if (!audioContext) {
            audioContext = new AudioContextClass();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
            650,
            audioContext.currentTime
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            430,
            audioContext.currentTime + 0.08
        );

        gain.gain.setValueAtTime(
            0.045,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.09
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.09);

    } catch (error) {
        console.log("Click sound unavailable.");
    }
}

document.addEventListener("click", (event) => {
    const clickable = event.target.closest(
        ".btn, .nav-contact, .back-to-top, .work-arrow"
    );

    if (clickable) {
        playClickSound();
    }
});

// CONTACT FORM
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");

const contactEmail = "hello@yourdomain.com";

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);

    const name = formData.get("name");
    const email = formData.get("email");
    const project = formData.get("project");
    const message = formData.get("message");

    const subject = encodeURIComponent(
        `New Project Enquiry — ${project}`
    );

    const body = encodeURIComponent(
        `Hello PixelNest Studio,

I would like to discuss a project.

Name: ${name}
Email: ${email}
Project Type: ${project}

Project Details:
${message}

Regards,
${name}`
    );

    contactStatus.textContent =
        "Opening your email application...";

    window.location.href =
        `mailto:${contactEmail}?subject=${subject}&body=${body}`;
});

// FEEDBACK FORM
const feedbackForm = document.getElementById("feedback-form");
const feedbackStatus = document.getElementById("feedback-status");

// STAR RATING — highlight every star up to the selected rating.
const ratingInputs = feedbackForm.querySelectorAll('input[name="rating"]');
const ratingLabels = feedbackForm.querySelectorAll(".rating-options label");

function updateRatingStars() {
    const selectedRating = Number(feedbackForm.querySelector('input[name="rating"]:checked')?.value || 0);

    ratingLabels.forEach((label, index) => {
        label.classList.toggle("is-active", index < selectedRating);
    });
}

ratingInputs.forEach((input) => {
    input.addEventListener("change", updateRatingStars);
});

// Keep the selected rating visible when the form is revisited.
updateRatingStars();

feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!feedbackForm.reportValidity()) return;

    const formData = new FormData(feedbackForm);

    const rating = formData.get("rating");
    const name = formData.get("name") || "Anonymous";
    const message = formData.get("message");

    const subject = encodeURIComponent("PixelNest Studio Website Feedback");

    const body = encodeURIComponent(
        `Hello PixelNest Studio,

Here is my feedback.

Name: ${name}
Rating: ${rating}/5 Stars

Feedback:
${message}

Thank you.`
    );

    feedbackStatus.textContent =
        "Opening your email application...";

    window.location.href =
        `mailto:${contactEmail}?subject=${subject}&body=${body}`;
});