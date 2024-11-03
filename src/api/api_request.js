let client_id = "6710b564021ae87118927054"
let app_id = "6710b564021ae87118927056"
let base_url = "https://api.chargetrip.io/graphql"

export let chargetrip_req = async (query) => {
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