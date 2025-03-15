
      const seatsContainer = document.getElementById("bus-seats");
      const occupiedCount = document.getElementById("occupied-count");
      const availableCount = document.getElementById("available-count");

      // Generate random seat statuses
      const seats = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        occupied: Math.random() < 0.5,
      }));

      // Function to update passenger count
      function updatePassengerCount() {
        const occupied = seats.filter((seat) => seat.occupied).length;
        const available = seats.length - occupied;
        occupiedCount.textContent = occupied;
        availableCount.textContent = available;
      }

      // Render seats and update count
      seats.forEach((seat) => {
        const seatDiv = document.createElement("div");
        seatDiv.className = `seat ${seat.occupied ? "occupied" : "available"}`;
        seatDiv.innerText = `S${seat.id}`;
        seatsContainer.appendChild(seatDiv);
      });

      // Initial count update
      updatePassengerCount();

      // Map setup
      const busLocation = [35.5613, 45.4306];
      const stations = [
        {
          id: 1,
          name: "Sulaymaniyah Main Station",
          location: [35.5625, 45.4331],
        },
        { id: 2, name: "City Center Station", location: [35.565, 45.438] },
        { id: 3, name: "University Station", location: [35.5678, 45.4253] },
      ];

      const map = L.map("map").setView(busLocation, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const busMarker = L.marker(busLocation).addTo(map);
      busMarker.bindPopup("Bus is here").openPopup();

      stations.forEach((station) => {
        L.marker(station.location).addTo(map).bindPopup(station.name);
      });
    
