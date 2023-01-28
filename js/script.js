var map, marqueur = null, marqueur2 = null, pos1 = null, pos2 = null
var lat1, lat2, lng1, lng2
window.onload = () => {
      // Initialiser la carte à une certaine position est un certain zoom
      map = L.map('map').setView([49.894067, 2.295753], 12)
      lat1 = document.querySelector("#lat1");
      lat2 = document.querySelector("#lat2");
      lng1 = document.querySelector("#lng1");
      lng2 = document.querySelector("#lng2");
      // Ajouter une couche de tuiles à la carte
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
      }).addTo(map)

      map.on("click", mapClickListen)
      document.querySelector('#start').addEventListener('blur', getCity)
      /*
            var A = L.latLng(49.894067, 2.295753);
            var B = L.latLng(49.771884, 2.488428);
            var C = L.latLng(49.671884, 2.688428);
            // Ajouter un itinéraire entre les deux marqueurs
            var control = L.Routing.control({
                  waypoints: [
                        A,B,C
                  ],
                  routeWhileDragging: true,
                  geocoder: L.Control.Geocoder.nominatim(),
                  // option pour récupérer les informations de variation d'altitude
                  altLine: true
            }).addTo(map);
            
            // Récupérer les données de variation d'altitude
            control.on('routeselected', function(e) {
                  var route = e.route;
                  var altitudes = route.altitudes;
      
                  // Initialiser un tableau pour les données de chart.js
                  var chartData = {
                        labels: [],
                        datasets: [{
                              label: "Altitude (m)",
                              data: altitudes,
                              backgroundColor: "rgba(255, 99, 132, 0.2)",
                              borderColor: "rgba(255, 99, 132, 1)",
                              borderWidth: 2
                        }]
                  };
      
            // Initialiser un canvas pour le graphique
                  var ctx = document.getElementById("altitudeChart").getContext("2d");
      
                  // Créer le graphique en utilisant Chart.js
                  var altitudeChart = new Chart(ctx, {
                        type: "line",
                        data: chartData,
                        options: {
                              scales: {
                              y: {
                                    beginAtZero: true
                              }
                              }
                        }
                  });
            });
            var routingContainer = document.querySelector(".leaflet-routing-container");
            routingContainer.parentNode.removeChild(routingContainer);*/
};

function mapClickListen(e) {
      let pos = e.latlng
      if (pos1 == null) {
            pos1 = e.latlng
            lat1.value = pos.lat
            lng1.value = pos.lng
            addMarker(pos1)
      }
      else {
            pos2 = e.latlng
            addMarker(pos2)
            lat2.value = pos.lat
            lng2.value = pos.lng
      }
}

function addMarker(pos) {
      if (marqueur == null) {
            marqueur = L.marker(pos, {
                  draggable: true
            })
            marqueur.on("dragend", function (e) {
                  pos = e.target.getLatLng()
                  lat1.value = pos.lat
                  lng1.value = pos.lng
            })
            marqueur.addTo(map)
            L.marker(pos).addTo(map)
      }
      else {
            if (marqueur2 != null) {
                  map.removeLayer(marqueur2)
            }
            marqueur2 = L.marker(pos, {
                  draggable: true
            })
            marqueur2.on("dragend", function (e) {
                  pos = e.target.getLatLng()
                  lat2.value = pos.lat
                  lng2.value = pos.lng
            })
            marqueur2.addTo(map)
            L.marker(pos).addTo(map)
            L.Routing.control({
                  waypoints: [
                        L.latLng(57.74, 11.94),
                        L.latLng(57.6792, 11.949)
                  ]
            }).addTo(map)
      }
}

function getCity() {
      // ajax
      const xmlhttp = new XMLHttpRequest
      var address = document.querySelector('#start').value
      xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4) {
                  if (xmlhttp.status == 200) {
                        let response = JSON.parse(xmlhttp.response)
                        console.log(response)

                        let lat = response[0]["lat"]
                        let lon = response[0]["lon"]
                        document.querySelector("#lat1").value = lat
                        document.querySelector("#lng1").value = lon

                        let pos = [lat, lon]
                        addMarker(pos)
                        map.setView(pos, 11)
                  }
            }
      }
      xmlhttp.open("get", 'https://nominatim.openstreetmap.org/search?q=${adresse}&format=json&adressedetails=1&polygon_svg=1')
      xmlhttp.send()
}