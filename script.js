/* ============================================================
   CalmConnect - Main JavaScript (Part 3)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ===========================
       1. ACCORDION (Resources Page)
       =========================== */
    const accordions = document.querySelectorAll(".accordion-header");
    accordions.forEach(header => {
        header.addEventListener("click", () => {
            header.classList.toggle("active");
            const content = header.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    /* ===========================
       2. SEARCH FILTER (Resources Page)
       =========================== */
    const searchInput = document.getElementById("searchBar");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const input = searchInput.value.toLowerCase();
            const items = document.querySelectorAll(".resource-item");
            items.forEach(item => {
                const text = item.innerText.toLowerCase();
                item.style.display = text.includes(input) ? "" : "none";
            });
        });
    }

    /* ===========================
       3. CONTACT FORM VALIDATION
       =========================== */
    const contactForm = document.querySelector("form[onsubmit='return validateContactForm()']");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("contact-name");
            const email = document.getElementById("contact-email");
            const msg = document.getElementById("contact-msg");

            let valid = true;

            // Remove previous error messages
            document.querySelectorAll(".error-msg").forEach(el => el.remove());

            if (name.value.trim() === "") {
                showError(name, "Name is required.");
                valid = false;
            }
            if (email.value.trim() === "" || !validateEmail(email.value)) {
                showError(email, "Valid email is required.");
                valid = false;
            }
            if (msg.value.trim() === "") {
                showError(msg, "Message cannot be empty.");
                valid = false;
            }

            if (valid) {
                showSuccess(contactForm, "Thank you! Your message has been received.");
                contactForm.reset();
            }
        });
    }

    /* ===========================
       4. ENQUIRY FORM VALIDATION & COST
       =========================== */
    const enquiryForm = document.querySelector("form[action='#']");
    if (enquiryForm) {
        const estimateResult = document.getElementById("estimate-result");
        enquiryForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const topic = document.getElementById("topic");
            const service = document.getElementById("service-type");
            const sessions = document.getElementById("sessions");

            let valid = true;
            // Clear previous errors
            document.querySelectorAll(".error-msg").forEach(el => el.remove());

            if (name.value.trim() === "") { showError(name, "Name is required."); valid = false; }
            if (email.value.trim() === "" || !validateEmail(email.value)) { showError(email, "Valid email is required."); valid = false; }
            if (topic.value === "") { showError(topic, "Please select a topic."); valid = false; }
            if (service.value === "") { showError(service, "Please select a service type."); valid = false; }
            if (sessions.value === "" || Number(sessions.value) < 1) { showError(sessions, "Enter a valid number of sessions."); valid = false; }

            if (valid) {
                // Calculate estimate
                const rate = service.value === "group" ? 120 : 250;
                const estimate = rate * Number(sessions.value);
                estimateResult.innerText = "Estimated Cost: R" + estimate;
                estimateResult.style.color = "green";

                // Optionally, here you can submit via AJAX
                // For now, just show confirmation
                alert("Enquiry submitted successfully!");
                enquiryForm.reset();
            }
        });
    }

    /* ===========================
       HELPER FUNCTIONS
       =========================== */
    function showError(input, message) {
        const error = document.createElement("div");
        error.className = "error-msg";
        error.style.color = "red";
        error.style.fontSize = "0.9rem";
        error.innerText = message;
        input.parentNode.appendChild(error);
    }

    function showSuccess(form, message) {
        const success = document.createElement("div");
        success.className = "success-msg";
        success.style.color = "green";
        success.style.fontWeight = "bold";
        success.style.marginTop = "1rem";
        success.innerText = message;
        form.appendChild(success);
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    /* ===========================
       5. LIGHTBOX GALLERY
       =========================== */
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("lightbox-img")) {
            const src = e.target.getAttribute("src");
            showLightbox(src);
        }
    });

    function showLightbox(imageSrc) {
        const box = document.createElement("div");
        box.id = "lightbox";
        box.style.position = "fixed";
        box.style.top = 0;
        box.style.left = 0;
        box.style.width = "100%";
        box.style.height = "100%";
        box.style.background = "rgba(0,0,0,0.8)";
        box.style.display = "flex";
        box.style.alignItems = "center";
        box.style.justifyContent = "center";
        box.style.zIndex = "9999";

        const img = document.createElement("img");
        img.src = imageSrc;
        img.style.maxWidth = "90%";
        img.style.maxHeight = "90%";
        img.style.border = "3px solid white";
        img.style.borderRadius = "10px";

        box.appendChild(img);

        // Close on click or Escape
        box.addEventListener("click", () => box.remove());
        document.addEventListener("keydown", function escClose(e) {
            if (e.key === "Escape") {
                box.remove();
                document.removeEventListener("keydown", escClose);
            }
        });

        document.body.appendChild(box);
    }

    /* ===========================
       6. INTERACTIVE MAP (Leaflet.js)
       =========================== */
    const mapContainer = document.getElementById("leaflet-map");
    if (mapContainer) {
        const map = L.map("leaflet-map").setView([-26.2041, 28.0473], 6); // Center SA

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        // Johannesburg
        L.marker([-26.2041, 28.0473]).addTo(map).bindPopup("Johannesburg").openPopup();
        // Durban
        L.marker([-29.8587, 31.0218]).addTo(map).bindPopup("Durban");
    }

}); // DOMContentLoaded
