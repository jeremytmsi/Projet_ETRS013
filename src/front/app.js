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

displayCars()