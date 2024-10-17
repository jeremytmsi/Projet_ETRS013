let express = require("express")
let router = express.Router()

let {chargetrip_request} = require("./api_request")

router.get("/around", (req,res) => {
    console.log(req.query)
    chargetrip_request(`
        query stationAround {
            stationAround(
                filter: {
                    location: {type: Point, coordinates: [${req.query.latitude},
          ${req.query.longitude}]},
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
    `)
    .then(data => {
        res.send(data)
    })
    .catch(err => {
        console.error(err)
    })
})

module.exports = router