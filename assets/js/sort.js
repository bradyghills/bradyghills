function sortTripLogs() {
    const sortOrder = document.getElementById('sort-order').value;
    const tripLogsGrid = document.getElementById('trip-logs-grid');
    const tripCards = Array.from(tripLogsGrid.getElementsByClassName('trip-card'));

    // Sort the trip cards based on the selected order
    tripCards.sort((a, b) => {
        const dateA = new Date(a.getAttribute('data-date'));
        const dateB = new Date(b.getAttribute('data-date'));

        if (sortOrder === 'newest') {
            return dateB - dateA; // Newest to Oldest
        } else {
            return dateA - dateB; // Oldest to Newest
        }
    });

    // Clear the grid and re-append the sorted cards
    tripLogsGrid.innerHTML = '';
    tripCards.forEach(card => tripLogsGrid.appendChild(card));
}

// Automatically sort by "Newest to Oldest" on page load
document.addEventListener('DOMContentLoaded', () => {
    const sortOrderDropdown = document.getElementById('sort-order');
    sortOrderDropdown.value = 'newest'; // Set the default value to "Newest to Oldest"
    sortTripLogs(); // Call the sorting function
});