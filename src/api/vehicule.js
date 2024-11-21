let express = require("express")
let router = express.Router()
let {chargetrip_req} = require("./api_request")

// Obtient la liste des véhicules disponible
router.get("/all_vehicules",async (req,res) => {
    let data = await chargetrip_req(
        `
            query {
                vehicleList {
                    id,
                    naming {
                        make
                        model
                        version
                    }
                    range {
                        chargetrip_range {
                            worst
                            best
                        }
                    }
                    media {
                        image {
                            url
                        }
                    }
                }
            }
        `
    )
    res.send(data.vehicleList)
})

module.exports = router