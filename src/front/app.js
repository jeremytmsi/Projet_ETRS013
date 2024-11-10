let init = () => {
    
    let map = L.map("map").setView([51.505,-0.09], 13)

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

    return { map, layers };
}

green = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

red = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

orange = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

// Default icon
def = L.icon({
    iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});



let displayCars = async () => {
    let response = await fetch("http://localhost:3000/api/vehicules/all_vehicules")
    let cars = await response.json()

    let carList = document.getElementById("car-list")
    let template = document.getElementById("vehicle-template")

    let selectedCar = null

    cars.forEach((car) => {
        let carCard = template.content.cloneNode(true)

        let img = carCard.querySelector('img')
        img.src = car.media.image.url
        img.alt = `${car.naming.make} ${car.naming.model}`

        carCard.querySelector("h3").textContent = `${car.naming.make} ${car.naming.model}`
        carCard.querySelector("p").textContent = car.version
        carCard.querySelector(".vehicle-range").textContent = car.range.chargetrip_range.worst

        carCard.querySelector("div").addEventListener("click", (e) => {

            if(selectedCar){
                selectedCar.classList.remove("border")
                selectedCar.removeAttribute("selectedCar")
            }

            e.target.classList.add("border")
            e.target.setAttribute("selectedCar","true")
            selectedCar = e.target
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

let {map, layers} = init()
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
})

let addMarker = (layer, lat,lon,label, {icon}) => {
    let marker = L.marker([lat,lon]).addTo(map)
    layer.addLayer(marker)
}

let clearLayers = (layers) => {
    Object.values(layers).forEach(layer => layer.clearLayers())
}

let drawRoute = (layer, coordinates) => {
    if(coordinates && coordinates.length > 0){
        let routeCoords = coordinates.map(coord => [parseFloat(coord[1]),parseFloat(coord[0])])
        let polyline = L.polyline(routeCoords,{color: "blue"})
        layer.addLayer(polyline)
        layer._map.fitBounds(polyline.getBounds())
        return polyline
    } else {
        console.error("Aucune donnée")
        return null
    }
}

fetch("http://localhost:3000/api/route?startPoint=Paris&endPoint=Estrun", {
    method: "POST"
}).then((res) => {
    res.json().then(data => {
        console.log(data)
        drawRoute(layers.routeLayer,data.features[0].geometry.coordinates)
        addMarker(layers.routeLayer,data.metadata.query.coordinates[0][1],data.metadata.query.coordinates[0][0],"Depart", def)
        addMarker(layers.routeLayer,data.metadata.query.coordinates[1][1],data.metadata.query.coordinates[1][0],"Depart", def)
    })
})