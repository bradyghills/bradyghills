function sortTripLogs() {
    const sortOrder = document.getElementById('sort-order').value;
    const tripLogsGrid = document.getElementById('trip-logs-grid');
    const tripCards = Array.from(tripLogsGrid.getElementsByClassName('trip-card'));

    tripCards.sort((a, b) => {
        const dateA = new Date(a.getAttribute('data-date'));
        const dateB = new Date(b.getAttribute('data-date'));

        if (sortOrder === 'newest') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });

    tripLogsGrid.innerHTML = '';
    tripCards.forEach(card => tripLogsGrid.appendChild(card));
}