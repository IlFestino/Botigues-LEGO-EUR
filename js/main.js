const backToTopButton = document.querySelector(".back-to-start a, #back-to-top");

if (backToTopButton) {
    backToTopButton.addEventListener("click", function(event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function initStoreMap() {
    const mapElement = document.getElementById("store-map");
    if (!mapElement || typeof L === "undefined") {
        return;
    }

    const selectorButtons = Array.from(document.querySelectorAll(".storeSelector"));
    const storeTitle = document.getElementById("selected-store-title");
    const storeAddress = document.getElementById("selected-store-address");

    if (!selectorButtons.length) {
        return;
    }

    const requestedStore = new URLSearchParams(window.location.search).get("store");

    const initialButton = selectorButtons.find(function(button) {
        return requestedStore && button.dataset.store === requestedStore;
    }) || selectorButtons.find(function(button) {
        return button.classList.contains("is-active");
    }) || selectorButtons[0];

    const initialLat = Number(initialButton.dataset.lat);
    const initialLng = Number(initialButton.dataset.lng);

    const map = L.map(mapElement).setView([initialLat, initialLng], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const marker = L.marker([initialLat, initialLng]).addTo(map);

    function setActiveStore(button) {
        const lat = Number(button.dataset.lat);
        const lng = Number(button.dataset.lng);
        const name = button.dataset.name || "LEGO Store";
        const address = button.dataset.address || "";

        selectorButtons.forEach(function(item) {
            item.classList.remove("is-active");
        });
        button.classList.add("is-active");

        if (storeTitle) {
            storeTitle.textContent = name;
        }
        if (storeAddress) {
            storeAddress.textContent = address;
        }

        marker.setLatLng([lat, lng]).bindPopup("<strong>" + name + "</strong><br>" + address).openPopup();
        map.flyTo([lat, lng], 13, {
            duration: 1.1
        });
    }

    selectorButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            setActiveStore(button);
        });
    });

    setActiveStore(initialButton);
}

document.addEventListener("DOMContentLoaded", initStoreMap);