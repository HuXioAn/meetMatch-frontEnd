// function onClick() {
 
//     const vToken = document.getElementById("vTokenText").value
//     const mToken = document.getElementById("mTokenText").value
//     const output = document.getElementById("responseText")

//     //const result = visitTableApi(vToken)

//     //const result = createTableApi("gggg8", ["2024-02-02T22:32:10.069Z", "2024-02-03T22:32:10.069Z"], 2, 10, 15, "g8@meetmatch.us")

//     // const result = updateTableApi(vToken, "orange", [{ 
//     //     "startTime": "2024-02-02T22:48:14.780Z",
//     //     "endTime": "2024-02-02T22:50:14.780Z"
//     // },{
//     //     "startTime": "2024-02-03T21:48:14.780Z",
//     //     "endTime": "2024-02-03T22:48:14.780Z"
//     // }])

//     //const result = manageTableApi(mToken, "develop 9g", ["2024-02-02T22:32:10.069Z", "2024-02-03T22:32:10.069Z"], 1, 7, 6, "9g@meetmatch.us")

//     //const result = getTableResultApi(vToken)

//     //const result = deleteTableApi(mToken)
//     result.then(json => output.innerHTML = JSON.stringify(json))


// }




function getApiUrl() {
    return 'https://meetmatch.us/api/timeTable/'
}



export function createTableApi(meetingName, dateSelection, timeRangeStart = 0, timeRangeEnd = 24, maxCollaborator, email = null) {
    

    const createRequestJson = {
        "meetingName": meetingName,
        "dateSelection": dateSelection,
        "timeRange": [
            timeRangeStart, timeRangeEnd
        ],
        "maxCollaborator": maxCollaborator,
        "email": email
    }
    const createRequestStr = JSON.stringify(createRequestJson)

    const BASE_API = getApiUrl()
    const req = new Request(BASE_API)
    const head = new Headers()
    head.append('Content-Type', 'application/json')
    const response = fetch(req, {
        mode : "cors",
        method : "POST",
        headers : head,
        body : createRequestStr
    });

    return response.then(res => res.json())
            .catch(err => console.log(err))
}

export function visitTableApi(vToken) {
    const BASE_API = getApiUrl()

    const req = new Request(BASE_API + vToken)
    const response = fetch(req, {mode : "cors"});

    return response.then(res => res.json())
            .catch(err => console.log(err))

}

export function updateTableApi(vToken, color, slots) {

    const updateRequestJson = {
        "selection": {
          "color": color,
          "slots": slots
        }
      }
    const updateRequestStr = JSON.stringify(updateRequestJson)

    const head = new Headers()
    head.append('Content-Type', 'application/json')
    const BASE_API = getApiUrl()
    const req = new Request(BASE_API + "update/" + vToken)
    const response = fetch(req, {
        mode : "cors",
        method : "POST",
        headers : head,
        body : updateRequestStr
    });

    return response.then(res => res.json())
            .catch(err => console.log(err))

}

export function manageTableApi(mToken, meetingName, dateSelection, timeRangeStart = 0, timeRangeEnd = 24, maxCollaborator, email = null) {
    

    const manageRequestJson = {
        "meetingName": meetingName,
        "dateSelection": dateSelection,
        "timeRange": [
            timeRangeStart, timeRangeEnd
        ],
        "maxCollaborator": maxCollaborator,
        "email": email
    }
    const manageRequestStr = JSON.stringify(manageRequestJson)

    const head = new Headers()
    head.append('Content-Type', 'application/json')
    const BASE_API = getApiUrl()
    const req = new Request(BASE_API + "manage/" + mToken)
    const response = fetch(req, {
        mode : "cors",
        method : "PUT",
        headers : head,
        body : manageRequestStr
    });

    return response.then(res => res.json())
            .catch(err => console.log(err))

}

export function getTableResultApi(vToken) {
    const BASE_API = getApiUrl()

    const req = new Request(BASE_API + "result/" + vToken)
    const response = fetch(req, {mode : "cors"});

    return response.then(res => res.json())
            .catch(err => console.log(err))

}

export function deleteTableApi(mToken) {
    const BASE_API = getApiUrl()

    const req = new Request(BASE_API + mToken)
    const response = fetch(req, {
        mode : "cors",
        method : "DELETE"
    });

    return response.then(res => res.json())
            .catch(err => console.log(err))

}

