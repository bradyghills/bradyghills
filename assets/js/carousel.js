document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.querySelector(".gallery-grid");
    const galleryItems = Array.from(gallery.children); // Convert NodeList to Array
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");

    let currentIndex = 0;

    // Function to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Shuffle gallery items
    const shuffledItems = shuffleArray(galleryItems);

    // Clear the gallery and append shuffled items
    gallery.innerHTML = "";
    shuffledItems.forEach((item) => gallery.appendChild(item));

    // Function to scroll to a specific image
    function scrollToImage(index) {
        const itemWidth = galleryItems[0].offsetWidth + parseInt(getComputedStyle(gallery).gap);
        gallery.scrollTo({
            left: index * itemWidth,
            behavior: "smooth",
        });
    }

    // Handle right arrow click
    rightArrow.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % galleryItems.length; // Loop back to the first image
        scrollToImage(currentIndex);
    });

    // Handle left arrow click
    leftArrow.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length; // Loop back to the last image
        scrollToImage(currentIndex);
    });

    // Automatically cycle to the next image every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % galleryItems.length; // Loop back to the first image
        scrollToImage(currentIndex);
    }, 5000); // 5000ms = 5 seconds

    // Lightbox functionality
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.querySelector(".lightbox-image");
    const lightboxClose = document.querySelector(".lightbox-close");

    galleryItems.forEach((img) => {
        img.querySelector("img").addEventListener("click", () => {
            lightbox.style.display = "flex";
            lightboxImage.src = img.querySelector("img").src;
        });
    });

    lightboxClose.addEventListener("click", () => {
        lightbox.style.display = "none";
    });

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
        }
    });
});