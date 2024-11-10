let express = require("express")
let app = express()
let port = 80
let fs = require("fs")
const path = require("path")
let cors = require("cors")

app.use(express.static(__dirname))
app.use(cors())

app.get('/',(req,res) => {
    res.sendFile("index.html",{root: path.join(__dirname)})
})

app.listen(port,() => {
    console.log(`En écoute sur le port ${port}`)
})