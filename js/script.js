// Map afficher
var map
// Les 2 marqueurs
let marqueur1 = null, marqueur2 = null
// La postion des 2 marqueurs
let pos1 = null, pos2 = null
// les coordonnées des 2 marqueurs
var lat1, lat2, lng1, lng2
// Adresse des 2 points
let adresse1, adresse2
// Bouton de suppression
let remove1, remove2

window.onload = () => {
      // Coordonnées point 1
      lat1 = document.querySelector("#lat1");
      lng1 = document.querySelector("#lng1");
      // Coordonnées point 2
      lat2 = document.querySelector("#lat2");
      lng2 = document.querySelector("#lng2");
      // Adresse des 2 points
      adresse1 = document.querySelector('#firstAdresse')
      adresse2 = document.querySelector('#secondAdresse')
      // Bouton de suppression
      remove1 = document.querySelector('#removefirst')
      remove2 = document.querySelector('#removesecond')

      remove1.addEventListener('click', (event) => { removeMarker(1) });
      remove2.addEventListener('click', (event) => { removeMarker(2) });

      // Initialiser la carte à une certaine position (Amiens) est un certain zoom
      map = L.map('map').setView([49.894067, 2.295753], 12)
      // Ajouter une couche de tuiles à la carte
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
      }).addTo(map)

      map.on("click", mapClickListen)
      adresse1.addEventListener('blur', getCity)
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
      if (pos1 == null) {
            pos1 = e.latlng
            //Ajoute les valeurs dans les champs
            lat1.value = pos1.lat
            lng1.value = pos1.lng
            addMarker(pos1)
      }
      else {
            pos2 = e.latlng
            //Ajoute les valeurs dans les champs
            lat2.value = pos2.lat
            lng2.value = pos2.lng
            addMarker(pos2)
      }
}

function removeMarker(index) {
      if (index == 1) {
            marqueur1 = marqueur2
            pos1 = pos2
            lat1.value = lat2.value
            lat1 = lat2
            lng1.value = lng2.value
            lng1 = lng2
            adresse1.value = adresse2.value
            adresse1 = adresse2
      }
      marqueur2 = null
      pos2 = null
      lat2.value = ""
      lat2 = null
      lng2.value = ""
      lng2 = null
      adresse2.value = ""
      adresse2 = null
}

function addMarker(pos) {
      if (marqueur1 == null) {
            marqueur1 = L.marker(pos, {
                  draggable: true
            })
            marqueur1.on("dragend", function (e) {
                  pos = e.target.getLatLng()
                  lat1.value = pos.lat
                  lng1.value = pos.lng
            })
            marqueur1.addTo(map)
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

            var control = L.Routing.control({
                  waypoints: [
                        L.latLng(marqueur1.getLatLng()),
                        L.latLng(marqueur2.getLatLng())
                  ],
                  routeWhileDragging: true,
                  show: false,
                  addWaypoints: false,
                  geocoder: L.Control.Geocoder.nominatim()
            }).addTo(map);
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