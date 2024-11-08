let express = require("express")
let app = express()
let port = 80
let fs = require("fs")
const path = require("path")

app.use(express.static(__dirname))

app.get('/',(req,res) => {
    res.sendFile("index.html",{root: path.join(__dirname)})
})

app.listen(port,() => {
    console.log(`En écoute sur le port ${port}`)
})