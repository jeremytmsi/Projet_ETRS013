let express = require("express")
let router = express.Router()

let {chargetrip_req} = require("./api_request")

router.get("/around",(req,res) => {
    chargetrip_req(`
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
                location {
                    type
                    coordinates
                }    
            }
                
        }
    `).then(data => {
        res.send(data)
    }).catch(err => console.error(err))
})

module.exports = router