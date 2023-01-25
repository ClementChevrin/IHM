let map, marqueur
window.onload = () => {
      // Initialiser la carte à une certaine position est un certain zoom
      map = L.map('map').setView([49.894067, 2.295753], 12)

      // Ajouter une couche de tuiles à la carte
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
      }).addTo(map)

      map.on("click",mapClickListen)

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
      addMarker(pos)
      document.querySelector("#lat1").value = pos.lat
      document.querySelector("#lng1").value = pos.lng
}

function addMarker(pos) {
      if (marqueur != undefined) {
            map.removeLayer(marqueur)
      }
      marqueur = L.marker(pos,{
            draggable:true
      })
      marqueur.on("dragend",function (e)  {
            pos = e.target.getLatLng()
            document.querySelector("#lat1").value = pos.lat
            document.querySelector("#lng1").value = pos.lng
      })
      marqueur.addTo(map)
}