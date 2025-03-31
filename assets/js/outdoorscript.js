document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display trip logs
    fetch('/theoutdoors/trip-logs/trips.json')
        .then(response => response.json())
        .then(trips => {
            const tripLogsGrid = document.getElementById('trip-logs-grid');
            trips.forEach(trip => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <img src="${trip.thumbnail}" alt="${trip.title}">
                    <h3>${trip.title}</h3>
                    <p>${trip.excerpt}</p>
                    <a href="${trip.link}">Read More</a>
                `;
                tripLogsGrid.appendChild(card);
            });
        });

    // Fetch and display photo gallery
    fetch('/theoutdoors/photos/photos.json')
        .then(response => response.json())
        .then(photos => {
            const galleryGrid = document.getElementById('gallery-grid');
            photos.forEach(photo => {
                const photoDiv = document.createElement('div');
                photoDiv.className = 'photo';
                photoDiv.innerHTML = `
                    <img src="/theoutdoors/photos/${photo.category}/${photo.filename}" alt="${photo.description}">
                    <p>${photo.description}</p>
                `;
                galleryGrid.appendChild(photoDiv);
            });

            // Add lightbox functionality
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <span class="lightbox-close">&times;</span>
                <div class="lightbox-content">
                    <img id="lightbox-img" src="" alt="">
                </div>
            `;
            document.body.appendChild(lightbox);

            const lightboxImg = document.getElementById('lightbox-img');
            const lightboxClose = document.querySelector('.lightbox-close');

            document.querySelectorAll('.gallery-grid .photo img').forEach(img => {
                img.addEventListener('click', () => {
                    lightbox.style.display = 'block';
                    lightboxImg.src = img.src;
                });
            });

            lightboxClose.addEventListener('click', () => {
                lightbox.style.display = 'none';
            });

            lightbox.addEventListener('click', (event) => {
                if (event.target === lightbox) {
                    lightbox.style.display = 'none';
                }
            });
        });
});