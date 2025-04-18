document.addEventListener("DOMContentLoaded", () => {
    let travelData = []; // Store the original travel data globally

    // Fetch travel-data.json for stats, logs, and map
    fetch("/assets/data/travel-data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            travelData = data; // Store the fetched data globally
            generateStats(data);
            generateTravelLogs(data); // Generate logs
            sortTravelLogs(); // Auto-sort by newest to oldest
            generateMap(data);
        })
        .catch(error => console.error("Error loading travel data:", error));

    // Fetch travel-photos.json for the photo gallery
    fetch("/assets/data/travel-photos.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(photoData => {
            generateGallery(photoData); // Generate the photo gallery
        })
        .catch(error => console.error("Error loading travel photos:", error));

    function generateStats(data) {
        const totalTrips = data.length;

        // Calculate unique countries
        const countries = [...new Set(data.flatMap(trip => Array.isArray(trip.country) ? trip.country : [trip.country]))].length;

        // Calculate unique cities
        const cities = [...new Set(data.flatMap(trip => trip.cities))].length;

        // Calculate unique U.S. states
        const states = [...new Set(data.flatMap(trip => Array.isArray(trip.state) ? trip.state : [trip.state]).filter(state => state))].length;

        // Calculate the longest trip in days
        const longestTrip = data.reduce((max, trip) => {
            const startDate = new Date(trip.start_date);
            const endDate = new Date(trip.end_date);
            const tripLength = (endDate - startDate) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
            return Math.max(max, tripLength);
        }, 0);

        // Update the stats in the DOM
        document.getElementById("total-trips").textContent = totalTrips;
        document.getElementById("countries-visited").textContent = countries;
        document.getElementById("cities-visited").textContent = cities;
        document.getElementById("states-visited").textContent = states;
        document.getElementById("longest-trip").textContent = longestTrip;
    }

    function generateTravelLogs(data) {
        const grid = document.getElementById("travel-logs-grid");
        grid.innerHTML = ""; // Clear any existing content

        // Generate travel log cards
        data.forEach(trip => {
            const startDate = new Date(trip.start_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
            const endDate = new Date(trip.end_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

            const card = document.createElement("div");
            card.className = "travel-card";
            card.setAttribute("data-date", trip.start_date); // Add data-date for sorting
            card.innerHTML = `
                <a href="${trip.markdown}">
                    <img src="${trip.image}" alt="${trip.title}">
                    <div class="card-content">
                        <h3>${trip.title}</h3>
                        <p>${trip.cities.join(", ")}, ${trip.country}</p>
                        <p class="travel-date">${startDate} - ${endDate}</p>
                    </div>
                </a>
            `;
            grid.appendChild(card);
        });
    }

    function generateMap(data) {
        const map = L.map("map").setView([20, 0], 2); // Centered globally
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        data.forEach(trip => {
            // Ensure coordinates and cities are arrays
            const coordinates = Array.isArray(trip.coordinates[0]) ? trip.coordinates : [trip.coordinates];
            const cities = Array.isArray(trip.cities) ? trip.cities : [trip.cities];

            // Loop through each coordinate and bind the corresponding city
            coordinates.forEach((coord, index) => {
                const city = cities[index] || "Unknown City"; // Match city to coordinate or use a fallback
                const marker = L.marker(coord).addTo(map);

                // Bind popup with specific city, country/state, and a link to the markdown page
                const countries = Array.isArray(trip.country) ? trip.country.join(", ") : trip.country;
                const states = Array.isArray(trip.state) ? trip.state.join(", ") : trip.state;
                const popupContent = `
                    <strong>${trip.title}</strong><br>
                    ${city}, ${states ? states + ", " : ""}${countries}<br>
                    <a href="${trip.markdown}" target="_blank">View Travel Log</a>
                `;
                marker.bindPopup(popupContent);
            });
        });
    }

    function generateGallery(photoData) {
        const galleryGrid = document.getElementById("gallery-grid");
        const basePath = "/assets/media/travel/"; // Base path for travel images

        // Shuffle the photos before rendering
        const shuffledPhotos = photoData.sort(() => Math.random() - 0.5);

        // Render the gallery
        galleryGrid.innerHTML = "";
        shuffledPhotos.forEach(photo => {
            const galleryItem = document.createElement("div");
            galleryItem.className = "gallery-item";
            const imagePath = `${basePath}${photo.filename}`;
            galleryItem.innerHTML = `
                <a href="${imagePath}" class="lightbox"
                   data-description="${photo.description}"
                   data-country="${photo.country}"
                   data-continent="${photo.continent}"
                   data-trip-title="${photo.trip_title || ''}"
                   data-markdown="${photo.markdown || ''}">
                    <img src="${imagePath}" alt="${photo.description}">
                </a>
            `;
            galleryGrid.appendChild(galleryItem);
        });

        // Initialize the lightbox
        initializeLightbox();
    }

    function sortTravelLogs() {
        const sortOrder = document.getElementById('sort-order').value;

        // Sort the travelData array based on the selected order
        const sortedData = [...travelData].sort((a, b) => {
            const dateA = new Date(a.start_date);
            const dateB = new Date(b.start_date);

            if (sortOrder === 'newest') {
                return dateB - dateA; // Newest to Oldest
            } else {
                return dateA - dateB; // Oldest to Newest
            }
        });

        // Re-render the travel logs with the sorted data
        generateTravelLogs(sortedData);
    }

    // Add sort order dropdown to the DOM
    const sortOrderContainer = document.createElement("div");
    sortOrderContainer.innerHTML = `
        <label for="sort-order">Sort by Date:</label>
        <select id="sort-order" onchange="sortTravelLogs()">
            <option value="newest" selected>Newest to Oldest</option>
            <option value="oldest">Oldest to Newest</option>
        </select>
    `;
    document.body.insertBefore(sortOrderContainer, document.getElementById("travel-logs-grid"));

    // Get references to the time display elements
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('total-duration');

    // Format time as mm:ss
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Update the current time and total duration
    function updateTimeDisplay() {
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalDurationEl.textContent = formatTime(audio.duration || 0);
    }

    // Update the total duration when a new track loads
    audio.addEventListener('loadedmetadata', () => {
        totalDurationEl.textContent = formatTime(audio.duration || 0);
    });

    // Update the current time every second while the track is playing
    audio.addEventListener('timeupdate', updateTimeDisplay);
});