const local = [-30.038889, -51.213611];
const map = L.map('map').setView(local, 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.marker(local).addTo(map)
  .bindPopup('Colégio Militar de Porto Alegre')
  .openPopup();