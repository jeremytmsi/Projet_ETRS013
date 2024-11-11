let express = require("express")
let router = express.Router()
let {chargetrip_req} = require("./api_request")

router.post("/", async (req,res) => {

    let start_coordinates = await get_coordinates_from_address(req.query.startPoint)
    let end_coordinates = await get_coordinates_from_address(req.query.endPoint)

    let intermediateCoordinates = req.query.intermediateCoordinates

    let response = await fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson",{
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
            "Authorization": process.env.OPENROUTESERVICE_API_KEY
        },
        body: JSON.stringify({
            coordinates: intermediateCoordinates == null ? [start_coordinates,end_coordinates] : [start_coordinates, intermediateCoordinates, end_coordinates]
        })
    })

    let data = await response.json()
    res.send(data)

})

let get_coordinates_from_address = async (address) => {
    let response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${address}&limit=1`)
    let data = await response.json()

    return data.features[0].geometry.coordinates
}

module.exports = router