let express = require("express")
let cors = require("cors")
let path = require("path")

let vehicules = require("./src/api/vehicule")
let stations = require("./src/api/stations")
let routes = require("./src/api/route")

let app = express()
let port = 3000

app.use(cors())

app.use(express.static(path.join(__dirname,"static")))

app.get("/",(req,res) => {
    let file = path.join(__dirname,'index.html')
    res.sendFile(file)
})

app.use("/api/vehicules",vehicules)
app.use("/api/stations",stations)
app.use("/api/route",routes)

app.listen(port, () => {
    console.log(`En écoute sur le port ${port}`)
})