/**
 * Initialise la carte
 */
let init = () => {
    let map = L.map("map").setView([45.564,5.914], 13)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    L.control.scale({position: 'bottomright', imperial: false, maxWidth: 100}).addTo(map)
    L.control.zoom({position: 'bottomright'}).addTo(map)

    let layers = {
        routeLayer: L.layerGroup().addTo(map),
        startEndLayer: L.layerGroup().addTo(map),
        polygonLayer: L.layerGroup().addTo(map),
        usedStationsLayer: L.layerGroup().addTo(map),
        debugLayer: L.layerGroup(),
    };

    let icons = {
        green : L.icon({
            iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        
        red : L.icon({
            iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        
        orange : L.icon({
            iconUrl: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        
        // Default icon
        def : L.icon({
            iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        })
    }

    return { map, layers, icons };
}

let selectedCarElement = null
let selectedCar = null


// Affiche la liste des voitures
let displayCars = async () => {
    let response = await fetch("/api/vehicules/all_vehicules")
    let cars = await response.json()

    let carList = document.getElementById("car-list")
    let template = document.getElementById("vehicle-template")

    cars.forEach((car) => {
        let carCard = template.content.cloneNode(true)

        let img = carCard.querySelector('img')
        img.src = car.media.image.url
        img.alt = `${car.naming.make} ${car.naming.model}`

        carCard.querySelector("h6").textContent = `${car.naming.make} ${car.naming.model}`
        carCard.querySelector("p").textContent = car.naming.version
        carCard.querySelector(".vehicle-range").textContent = car.range.chargetrip_range.best

        carCard.querySelector("div").addEventListener("click", (e) => {

            console.log(selectedCar)

            if(selectedCar){
                selectedCarElement.classList.remove("border")
                selectedCarElement.removeAttribute("selectedCar")
            }

            e.target.classList.add("border")
            e.target.setAttribute("selectedCar","true")
            selectedCarElement = e.target
            selectedCar = car
        })

        carList.appendChild(carCard)
    })
}
let fetchSuggestions = async (query) => {
    let response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}`)
    let data = await response.json()

    return data.features
}

let handleSuggestions = (inputElement, suggestionsContainer, point) => {
    inputElement.addEventListener("input", async (e) => {

        let query = e.target.value

        if(query.length > 2){
            let results = await fetchSuggestions(query)
            suggestionsContainer.innerHTML = ""

            if(results.length > 0){
                results.forEach(res => {
                    let suggestionItem = document.createElement("li")
                    suggestionItem.textContent = res.properties.label
                    
                    suggestionItem.addEventListener("click", () => {
                        inputElement.value = res.properties.label
                        point = res.geometry.coordinates
                        suggestionsContainer.innerHTML = ""
                    })

                    suggestionsContainer.appendChild(suggestionItem)
                })

                suggestionsContainer.classList.remove("hidden")
            } else {
                suggestionsContainer.classList.add("hidden")
            }
        } else {
            suggestionsContainer.innerHTML = ""
            suggestionsContainer.classList.add("hidden")
        }
    })
}

let {map, layers, icons} = init()
displayCars()

let start = document.getElementById("start")
let end = document.getElementById("end")
let startSuggestions = document.getElementById("startSuggestions")
let endSuggestions = document.getElementById("endSuggestions")

handleSuggestions(start,startSuggestions)
handleSuggestions(end,endSuggestions)

// Gestion soumission form
document.getElementById('form-submit').addEventListener("click",async (e) => {
    e.preventDefault()

    clearLayers(layers)

    let startAddress = start.value
    let endAddress = end.value

    // On calcule la route
    let route_res = await fetch(`/api/route?startPoint=${startAddress}&endPoint=${endAddress}`,{
        method: "POST"
    })
    let route_data = await route_res.json()
    console.log(route_data)

    let distanceTotale = (route_data.features[0].properties.summary.distance)/1000

    let nbRecharges = Math.floor(distanceTotale/selectedCar.range.chargetrip_range.best)
    console.log(nbRecharges)

    let coordinates = route_data.features[0].geometry.coordinates
    let base_coordinates = route_data.features[0].geometry.coordinates

    //Trace la route
    drawRoute(layers.routeLayer,coordinates)

    // Ajoute un marqueur au départ
    addMarker(layers.routeLayer,route_data.metadata.query.coordinates[0][1],route_data.metadata.query.coordinates[0][0],"Depart", icons.def)

    // Ajoute un marqueur à l'arrivée
    addMarker(layers.routeLayer,route_data.metadata.query.coordinates[1][1],route_data.metadata.query.coordinates[1][0],"Arrivée", icons.def)

    for(let i=0; i < nbRecharges; i++){
        let circle = null
        if(i==0){
            circle = drawCircle(layers.routeLayer,[route_data.metadata.query.coordinates[0][1],route_data.metadata.query.coordinates[0][0]],selectedCar.range.chargetrip_range.worst)
        } else {
            circle = drawCircle(layers.routeLayer,[coordinates[0][1],coordinates[0][0]],selectedCar.range.chargetrip_range.worst)
        }
        coordinates = coordinates.filter((coordinates) => !pointIsInCircle(coordinates,circle))
        let coordinatesSearchStation = coordinates[0]

        let station_res = await fetch(`/api/stations/around?lon=${coordinatesSearchStation[1]}&lat=${coordinatesSearchStation[0]}`)
        let station_data = await station_res.json()
        station_data = station_data.stationAround
        console.log(station_data)
        addMarker(layers.routeLayer,coordinatesSearchStation[1],coordinatesSearchStation[0],`${coordinatesSearchStation[1]}, ${coordinatesSearchStation[0]}`,icons.def)

        //clearLayers(layers)
        

    }
    


})