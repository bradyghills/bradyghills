document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
        card.addEventListener("click", function () {
            const targetLink = card.getAttribute("data-link");

            // Navigate to the target page
            window.location.href = targetLink;
        });
    });
});