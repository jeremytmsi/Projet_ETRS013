let express = require("express")
let vehicules = require("./vehicules")
let stations = require("./stations")

let app = express()
let port = 3000

app.get("/",(req,res) => {
    res.send({})
})

app.use("/api/vehicules",vehicules)
app.use("/api/stations", stations)

app.listen(port,() => {
    console.log(`En écoute sur le port ${port}`)
})