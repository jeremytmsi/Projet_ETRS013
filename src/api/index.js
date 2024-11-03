let express = require("express")
let vehicules = require("./vehicule")

let app = express()
let port = 3000

app.get("/",(req,res) => {
    res.send({})
})

app.use("/api/vehicules",vehicules)

app.listen(port, () => {
    console.log(`En écoute sur le port ${port}`)
})