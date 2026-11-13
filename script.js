// ==========================================================
// 1. MOBILE NAVIGATION
// ==========================================================

const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}


// ==========================================================
// 2. ACTIVE NAVIGATION LINK
// ==========================================================

const currentLocation = location.href;
const menuItems = document.querySelectorAll(".nav-links a");

menuItems.forEach(item => {
    if (item.href === currentLocation) {
        item.classList.add("active");
    }
});


// ==========================================================
// 3. HERO BACKGROUND SLIDESHOW
// ==========================================================

const heroSlides = document.querySelectorAll(".hero-slide");

if (heroSlides.length > 0) {
    let currentSlide = 0;

    function nextHeroSlide() {
        heroSlides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % heroSlides.length;
        heroSlides[currentSlide].classList.add("active");
    }

    setInterval(nextHeroSlide, 6000);
}


// ==========================================================
// 4. COUNTDOWN TIMER
// ==========================================================

function updateCountdown() {
    const targetDate = new Date("February 1, 2027 08:00:00").getTime();
    const now = Date.now();
    const difference = targetDate - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    if (difference <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ==========================================================
// 5. TESTIMONIAL SLIDER
// ==========================================================

const testimonials = document.querySelectorAll(".testimonial-item");

if (testimonials.length > 0) {
    let currentTestimonial = 0;

    function rotateTestimonials() {
        testimonials[currentTestimonial].classList.remove("active");
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add("active");
    }

    setInterval(rotateTestimonials, 5000);
}


// ==========================================================
// 6. GALLERY LIGHTBOX
// ==========================================================

const galleryItems = document.querySelectorAll(".gallery-item");
const lightboxModal = document.getElementById("lightboxModal");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.querySelector(".lightbox-close");

if (lightboxModal && lightboxImg && lightboxCaption) {
    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            const image = item.querySelector("img");
            const title = item.querySelector("h4");

            if (!image || !title) return;

            lightboxModal.style.display = "block";
            lightboxImg.src = image.src;
            lightboxImg.alt = image.alt;
            lightboxCaption.textContent = title.textContent;
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener("click", () => {
            lightboxModal.style.display = "none";
        });
    }

    lightboxModal.addEventListener("click", event => {
        if (event.target === lightboxModal) {
            lightboxModal.style.display = "none";
        }
    });
}


// ==========================================================
// 7. CONTACT INQUIRY FORM — BROWSER + FORMSPREE
// ==========================================================

const inquiryForm = document.getElementById("inquiryForm");
const formSuccess = document.getElementById("formSuccess");

if (inquiryForm && formSuccess) {
    const inquiryFields = {
        full_name: inquiryForm.elements.namedItem("full_name"),
        phone: inquiryForm.elements.namedItem("phone"),
        inquiry_type: inquiryForm.elements.namedItem("inquiry_type"),
        message: inquiryForm.elements.namedItem("message")
    };

    // Clear custom validation messages as the visitor corrects a field.
    Object.values(inquiryFields).forEach(field => {
        if (!field) return;

        field.addEventListener("input", () => field.setCustomValidity(""));
        field.addEventListener("change", () => field.setCustomValidity(""));
    });

    inquiryForm.addEventListener("submit", async event => {
        event.preventDefault();

        // Run the browser's built-in required/type/min/max validation first.
        if (!inquiryForm.reportValidity()) return;

        const name = inquiryFields.full_name?.value.trim() ?? "";
        const phone = inquiryFields.phone?.value.trim() ?? "";
        const message = inquiryFields.message?.value.trim() ?? "";

        const checks = [
            [inquiryFields.full_name, name.length >= 2, "Your name must contain at least 2 characters."],
            [inquiryFields.full_name, name.length <= 40, "Your name cannot exceed 40 characters."],
            [inquiryFields.phone, phone.length >= 7, "Your phone number is too short."],
            [inquiryFields.phone, phone.length <= 20, "Your phone number is too long."],
            [inquiryFields.message, message.length >= 10, "Your message must contain at least 10 characters."],
            [inquiryFields.message, message.length <= 500, "Your message cannot exceed 500 characters."]
        ];

        const failedCheck = checks.find(([, passed]) => !passed);

        if (failedCheck) {
            const [field, , messageText] = failedCheck;
            field.setCustomValidity(messageText);
            field.reportValidity();
            return;
        }

        const endpoint = inquiryForm.action;

        if (!endpoint || new URL(endpoint).hostname !== "formspree.io") {
            alert("The inquiry form is not connected to its Formspree endpoint yet.");
            return;
        }

        const submitButton = inquiryForm.querySelector('[type="submit"]');
        if (submitButton) submitButton.disabled = true;

        try {
            const formResponse = await fetch(endpoint, {
                method: "POST",
                body: new FormData(inquiryForm),
                headers: { Accept: "application/json" }
            });

            if (!formResponse.ok) {
                throw new Error(`Formspree returned HTTP ${formResponse.status}`);
            }

            inquiryForm.reset();
            inquiryForm.classList.add("hidden");
            formSuccess.classList.remove("hidden");
        } catch (error) {
            console.error("Inquiry submission failed:", error);
            alert("Unable to submit your inquiry. Please check your connection and try again.");
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
}
