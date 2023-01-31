window.onload = function () {
    let map = L.map('carte').setView([49.894067, 2.295753], 12)
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 20
    }).addTo(map)
    var routage = L.Routing.control({
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
    })
    routage.addTo(map)

    routage.on('routeselected', function (e) {

        var array = []
        trajet = e.route.coordinates

        function getElevation(index) {
            return new Promise((resolve, reject) => {
                fetch(`https://api.open-meteo.com/v1/elevation?latitude=${trajet[index].lat}&longitude=${trajet[index].lng}`)
                    .then(response => {
                        response.json()
                            .then(function (result) {
                                resolve(result.elevation[0])
                            });
                    })
                    .catch(error => {
                        reject(error)
                    });
            });
        }

        async function fetchElevations() {
            for (let index = 0; index < trajet.length; index++) {
                try {
                    const elevation = await getElevation(index);
                    array.push(elevation)
                } catch (error) {
                    console.error(error)
                }
            }
            var max = 1
            var label = []
            for (let i = 0; i < array.length; i++) {
                label.push(i)
                if (max < array[i]) {
                    max = array[i]
                }
            }
            createChart(max, array, label)
        }

        fetchElevations();



    });
    //#region Ajout d'élément complémentaire
    divField = document.getElementsByClassName("leaflet-routing-geocoder")
    divField[0].firstChild.setAttribute("placeholder", "Départ")
    divField[1].firstChild.setAttribute("placeholder", "Fin")

    card = document.getElementsByClassName("leaflet-control-container")
    card[0].children[1].classList.add("card-info");
    card[0].children[0].classList.add("zoom");
    cardI = document.getElementsByClassName("card-info")
    var h = document.createElement("h1");
    h.innerText = "Maps"
    cardI[0].children[0].prepend(h)
    //#endregion


}

function createChart(max, array, label) {
    var max = 1
    var label = []
    for (let i = 0; i < array.length; i++) {
        label.push(i)
        if (max < array[i]) {
            max = array[i]
        }
    }
    // Ajoute la Chart ici
    detail = document.getElementsByClassName("leaflet-routing-container leaflet-bar leaflet-control")
    var canevas = document.createElement("canvas");
    canevas.setAttribute("id", "myChart");
    detail[0].append(canevas)
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: label,
            datasets: [{
                label: 'Altitude',
                data: array,
                backgroundColor: [
                    'rgba(156,217,145,0.8)',
                ],
                borderColor: [
                    'rgba(145,149,217,0.8)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: max // set the maximum value here
                    }
                }]
            }
        }
    });
}
