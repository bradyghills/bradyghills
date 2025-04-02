document.addEventListener('DOMContentLoaded', function() {
    const lightboxLinks = document.querySelectorAll('a.lightbox');

    lightboxLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const imageUrl = link.getAttribute('href');
            const lightboxOverlay = document.createElement('div');
            lightboxOverlay.classList.add('lightbox-overlay');
            lightboxOverlay.innerHTML = `
                <div class="lightbox-content">
                    <img src="${imageUrl}" alt="Lightbox Image">
                </div>
            `;
            document.body.appendChild(lightboxOverlay);

            const adjustImageSize = () => {
                const lightboxImage = lightboxOverlay.querySelector('img');
                if (lightboxImage) {
                    lightboxImage.style.maxWidth = `${window.innerWidth * 0.8}px`;
                    lightboxImage.style.maxHeight = `${window.innerHeight * 0.8}px`;
                }
            };

            adjustImageSize();
            window.addEventListener('resize', adjustImageSize);

            lightboxOverlay.addEventListener('click', function() {
                document.body.removeChild(lightboxOverlay);
                window.removeEventListener('resize', adjustImageSize);
            });
        });
    });
});