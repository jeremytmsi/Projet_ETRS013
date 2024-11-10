let map = L.map("map").setView([51.505,-0.09], 13)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.control.scale({position: 'bottomright', imperial: false, maxWidth: 100}).addTo(map)
L.control.zoom({position: 'bottomright'}).addTo(map)

let displayCars = async () => {
    let response = await fetch("http://localhost:3000/api/vehicules/all_vehicules")
    let cars = await response.json()

    let carList = document.getElementById("car-list")
    let template = document.getElementById("vehicle-template")

    console.log(template)

    let selectedCar = null

    cars.forEach((car) => {
        let carCard = template.content.cloneNode(true)

        let img = carCard.querySelector('img')
        img.src = car.media.image.url
        img.alt = `${car.naming.make} ${car.naming.model}`

        carCard.querySelector("h3").textContent = `${car.naming.make} ${car.naming.model}`
        carCard.querySelector("p").textContent = car.version
        carCard.querySelector(".vehicle-range").textContent = car.range.chargetrip_range.worst

        carCard.querySelector("div").addEventListener("click", () => {
            this.setAttribute("selectedCar", 'true')
            selectedCar = this
        })

        carList.appendChild(carCard)
    })
}

let fetchSuggestions = async (query) => {
    let response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}`)
    let data = await response.json()

    return data.features.map((feature) => feature.properties.label)
}

let handleSuggestions = (inputElement, suggestionsContainer) => {
    inputElement.addEventListener("input", async (e) => {

        let query = e.target.value

        if(query.length > 2){
            let results = await fetchSuggestions(query)
            suggestionsContainer.innerHTML = ""

            if(results.length > 0){
                results.forEach(res => {
                    let suggestionItem = document.createElement("li")
                    suggestionItem.textContent = res
                    
                    suggestionItem.addEventListener("click", () => {
                        inputElement.value = res
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

displayCars()

let start = document.getElementById("start")
let end = document.getElementById("end")
let startSuggestions = document.getElementById("startSuggestions")
let endSuggestions = document.getElementById("endSuggestions")

handleSuggestions(start,startSuggestions)
handleSuggestions(end,endSuggestions)