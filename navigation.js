// Function to fetch data from ESP32 backend
async function fetchData() {
    try {
        console.log("Fetching data from ESP32...");
        const response = await fetch('http://192.168.100.233/data');
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        console.log("Fetched data:", data);

        // Update seat status
        updateSeatStatus(data);

        // Update passenger count
        updatePassengerCount(data);

        // Update GPS coordinates and map
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
    console.log("Initializing map...");
    window.map = L.map('map').setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(window.map);

    window.marker = L.marker([lat, lng]).addTo(window.map).bindPopup('Bus Location');
}

// Function to update bus location on the map
function updateMap(lat, lng) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (!window.map) {
        initMap(latitude, longitude);
    } else {
        window.marker.setLatLng([latitude, longitude]);
        window.map.setView([latitude, longitude]);
    }
}

// Fetch data every second
setInterval(fetchData, 1000);
