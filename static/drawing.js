let addMarker = (layer, lat,lon,label, {icon}) => {
    let marker = L.marker([lat,lon]).addTo(map).bindPopup(label).openPopup()
    layer.addLayer(marker)
}

let clearLayers = (layers) => {
    Object.values(layers).forEach(layer => layer.clearLayers())
}

let drawRoute = (layer, coordinates) => {
    if(coordinates && coordinates.length > 0){
        let routeCoords = coordinates.map(coord => [parseFloat(coord[1]),parseFloat(coord[0])])
        let polyline = L.polyline(routeCoords,{color: "blue"})
        layer.addLayer(polyline)
        layer._map.fitBounds(polyline.getBounds())
        return polyline
    } else {
        console.error("Aucune donnée")
        return null
    }
}

let drawCircle = (layer, coordinates, autonomy) => {
    let circle = L.circle(coordinates, {
        color: 'transparent',
        fillOpacity: 0,
        radius: autonomy*1000 - ((autonomy*1000)*0.2)
    }).addTo(map)
    layer.addLayer(circle)
    return circle  
}

// Vérifie si un point est dans un cercle
let pointIsInCircle = (coordinate, circle) => {
    let distance = circle.getLatLng().distanceTo([coordinate[1], coordinate[0]])
    return distance <= circle.getRadius()
}