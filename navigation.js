document.addEventListener("DOMContentLoaded", () => {
    let map;
    let busMarker;

    // Function to fetch data from ESP32 backend
    async function fetchData() {
        try {
            console.log("Fetching data from ESP32...");
            const response = await fetch('http://192.168.100.233/data');
            if (!response.ok) throw new Error("Network error");

            const data = await response.json();
            console.log("Data received:", data);

            updateSeatStatus(data);
            updatePassengerCount(data);
            updateMap(data.lat, data.lng);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Function to update seat status
    function updateSeatStatus(data) {
        document.getElementById('S1').className = 'seat ' + (data.seat1 ? 'occupied' : 'available');
        document.getElementById('S2').className = 'seat ' + (data.seat2 ? 'occupied' : 'available');
        document.getElementById('S3').className = 'seat ' + (data.seat3 ? 'occupied' : 'available');
    }

    // Function to update passenger count
    function updatePassengerCount(data) {
        const occupiedCount = [data.seat1, data.seat2, data.seat3].filter(seat => seat).length;
        document.getElementById('occupied-count').innerText = occupiedCount;
        document.getElementById('available-count').innerText = 3 - occupiedCount;
    }

    // Function to initialize the map
    function initMap(lat, lng) {
        map = L.map('map').setView([lat, lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        busMarker = L.marker([lat, lng]).addTo(map).bindPopup('Bus Location');
    }

    // Function to update map with real-time bus location
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

    // Fetch data every second
    setInterval(fetchData, 1000);
});
