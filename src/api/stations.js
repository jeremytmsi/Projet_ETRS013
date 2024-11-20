let express = require("express")
let router = express.Router()

let {chargetrip_req} = require("./api_request")

// Récupère la liste des stations à proxmité d'un point
router.get("/around",async (req,res) => {
    let response = await chargetrip_req(`
        query stationAround {
            stationAround(
                filter: {
                    location: {
                        type: Point, 
                        coordinates: [
                            ${req.query.lat},
                            ${req.query.lon}
                        ]
                    },
                    distance: 10000
                }
                size: 10
            ) {
                id
                name
            }
                
        }
    `)
    
    res.send(response)
})

// Affiche les détails d'une station
router.get("/details",async (req,res) => {
    let response = await chargetrip_req(`
        query station {
            station(id: "${req.query.stationId}"){
                id
                name
                address
                city
                postal_code
                country
                coordinates {
                    latitude
                    longitude
                }
                evses {
                    evse_id
                    connectors {
                        id
                        standard
                        format
                        power
                        power_type
                    }
                }
            }
        }
    `)
    let details = response.station
    res.send(details)
})

module.exports = router