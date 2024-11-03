let express = require("express")
let router = express.Router()
let {chargetrip_req} = require("./api_request")

router.get("/all_vehicules",(req,res) => {
    chargetrip_req(
        `
            query {
                vehicleList {
                    id,
                    naming {
                        make
                        model
                    }
                }
            }
        `
    ).then(data => {
        data = data["vehicleList"]
        res.send(data)
    }).catch(err => console.error(err))
})

module.exports = router