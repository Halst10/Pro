document.addEventListener("DOMContentLoaded", () => {
    let map;
    let busMarker;

    async function fetchData() {
        try {
            const response = await fetch('http://192.168.100.233/data');
            if (!response.ok) throw new Error("Network error");

            const data = await response.json();
            updateSeatStatus(data);
            updatePassengerCount(data);
            updateMap(data.lat, data.lng);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function updateSeatStatus(data) {
        document.getElementById('S1').className = 'seat ' + (data.seat1 ? 'occupied' : 'available');
        document.getElementById('S2').className = 'seat ' + (data.seat2 ? 'occupied' : 'available');
        document.getElementById('S3').className = 'seat ' + (data.seat3 ? 'occupied' : 'available');
    }

    function updatePassengerCount(data) {
        const occupiedCount = [data.seat1, data.seat2, data.seat3].filter(seat => seat).length;
        document.getElementById('occupied-count').innerText = occupiedCount;
        document.getElementById('available-count').innerText = 3 - occupiedCount;
    }

    function initMap(lat, lng) {
        map = L.map('map').setView([lat, lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        busMarker = L.marker([lat, lng]).addTo(map).bindPopup('Bus Location');
    }

    function updateMap(lat, lng) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        if (!map) {
            initMap(latitude, longitude);
        } else {
            busMarker.setLatLng([latitude, longitude]);
            map.setView([latitude, longitude]);
        }
    }

    setInterval(fetchData, 1000);
});
