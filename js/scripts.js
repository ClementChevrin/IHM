window.onload = function () {
    let map = L.map('carte').setView([49.894067, 2.295753], 12)
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 20
    }).addTo(map)
    L.Routing.control({
        router: new L.Routing.osrmv1({
            language: 'fr',
            profile: 'bike', // car, bike, foot
            steps: false,
            units: 'metric',
            show: false,
        }),
        lineOptions: {
            styles: [{ color: '#2485E0', opacity: 1, weight: 7 }]
        },
        geocoder: L.Control.Geocoder.nominatim()
    }).addTo(map)
    divField = document.getElementsByClassName("leaflet-routing-geocoder")
    divField[0].firstChild.setAttribute("placeholder", "Départ")
    divField[1].firstChild.setAttribute("placeholder", "Fin")

    card = document.getElementsByClassName("leaflet-control-container")
    card[0].children[1].classList.add("card-info");
    card[0].children[0].classList.add("zoom");

}
$(document).ready(function () {
    var start = [45.52, -122.67];
    var end = [45.54, -122.66];
});
// Effectuer une requête sur l'API Elevation de MapQuest pour récupérer les informations sur les variations d'altitude pour l'itinéraire
/*$.ajax({
    url: 'http://open.mapquestapi.com/directions/v2/route?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC&from=' + start[1] + ',' + start[0] + '&to=' + end[1] + ',' + end[0] + '&routeType=bicycle&fullShape=true',
    method: 'GET',
    success: function (data) {
        // Tracer le tracé de l'itinéraire en utilisant les données de variation d'altitude
        console.log(data);
        var path = data.route.shape;
        console.log(path);
    }
});*/
