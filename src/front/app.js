let map = L.map("map").setView([51.505,-0.09], 13)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.control.scale({position: 'bottomright', imperial: false, maxWidth: 100}).addTo(map)
L.control.zoom({position: 'bottomright'}).addTo(map)

let displayCars = async () => {
    let cars = (await fetch("https://voitureselectapi.vercel.app/api/vehicules/all_vehicules")).json()
    let carList = document.getElementById("car-list")
    let template = document.getElementById("vehicle-template")

    let selectedCar = null

    cars.forEach((car) => {
        let carCard = template.contentEditable.cloneNode(true)

        let img = carCard.querySelector('img')
        img.src = car.image
        img.alt = `${car.make} ${car.model}`

        carCard.querySelector("h3").textContent = `${car.make} ${car.model}`
        carCard.querySelector("p").textContent = car.version
        carCard.querySelector(".vehicule-range").textContent = car.range_worst

        carCard.querySelector("div").addEventListener("click", () => {
            this.setAttribute("selectedCar", 'true')
            selectedCar = this
        })

        carList.appendChild(carCard)
    })
}

displayCars()