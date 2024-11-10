let express = require("express")
let router = express.Router()
let {chargetrip_req} = require("./api_request")

router.post("/", async (req,res) => {

    let start_coordinates = await get_coordinates_from_address(req.query.startPoint)
    let end_coordinates = await get_coordinates_from_address(req.query.endPoint)

    console.log(start_coordinates)
    console.log(end_coordinates)

    let response = await fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson",{
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
            "Authorization": "5b3ce3597851110001cf62486808877b35464842b5f6a16ca8f2acf4"
        },
        body: JSON.stringify({
            coordinates: [start_coordinates, end_coordinates]
        })
    })

    let data = await response.json()
    res.send(data)
    //res.send(data.features[0].geometry.coordinates)

})

let get_coordinates_from_address = async (address) => {
    let response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${address}&limit=1`)
    let data = await response.json()

    return data.features[0].geometry.coordinates
}

module.exports = router