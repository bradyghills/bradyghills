document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".content img");

    // Add a fade-in effect for images as they appear in the viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
            }
        });
    });

    images.forEach((img) => observer.observe(img));
});