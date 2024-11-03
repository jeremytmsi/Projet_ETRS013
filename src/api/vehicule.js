let express = require("express")
let router = express.Router()

let client_id = "6710b564021ae87118927054"
let app_id = "6710b564021ae87118927056"
let base_url = "https://api.chargetrip.io/graphql"

let chargetrip_req = async (query) => {
    let res = await fetch(base_url, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-client-id": client_id,
            "x-app-id": app_id
        },
        body : JSON.stringify({
            query: query
        })
    })

    let {data} = await res.json()
    return data
}

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