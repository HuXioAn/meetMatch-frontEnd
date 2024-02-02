function visitTable() {
 
    const BASE_API = 'https://meetmatch.us/api/timeTable/'
    //const vToken = 'vdcf582148cc6424d'
    const vToken = document.getElementById("vTokenText").value
    const output = document.getElementById("responseText")

    // const req = new Request(BASE_API + vToken)
    // const response = fetch(req, {mode : "cors"});

    // response.then(res => res.text())
    //         .then(myjson => output.innerHTML = myjson)
    //         .catch(err => document.writeln(err))

    const result = visitTableApi(vToken)
    result.then(json => output.innerHTML = json.meetingName)

}

function getApiUrl() {
    return 'https://meetmatch.us/api/timeTable/'
}



function createTableApi(meetingName, dateSelection, timeRangeStart = 0, timeRangeEnd = 24, maxCollaborator, email = null) {
    

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
    const response = fetch(req, {
        mode : "cors",
        method : "POST",
        body : createRequestStr
    });

    return response.then(res => res.json())
            .catch(err => console.log(err))

}

function visitTableApi(vToken) {
    const BASE_API = getApiUrl()

    const req = new Request(BASE_API + vToken)
    const response = fetch(req, {mode : "cors"});

    return response.then(res => res.json())
            .catch(err => console.log(err))

}

function updateTableApi(vToken, color, slots) {

    const updateRequestJson = {
        "selection": {
          "color": "string",
          "slots": slots
        }
      }
    const updateRequestStr = JSON.stringify(updateRequestJson)


    const BASE_API = getApiUrl()
    const req = new Request(BASE_API + "update/" + vToken)
    const response = fetch(req, {
        mode : "cors",
        method : "POST",
        body : updateRequestStr
    });

    return response.then(res => res.json())
            .catch(err => console.log(err))

}

function manageTableApi(mToken, meetingName, dateSelection, timeRangeStart = 0, timeRangeEnd = 24, maxCollaborator, email = null) {
    

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

    const BASE_API = getApiUrl()
    const req = new Request(BASE_API + "manage/" + mToken)
    const response = fetch(req, {
        mode : "cors",
        method : "PUT",
        body : manageRequestStr
    });

    return response.then(res => res.json())
            .catch(err => console.log(err))

}

function getTableResultApi(vToken) {
    const BASE_API = getApiUrl()

    const req = new Request(BASE_API + "result/" + vToken)
    const response = fetch(req, {mode : "cors"});

    return response.then(res => res.json())
            .catch(err => console.log(err))

}

function deleteTableApi(mToken) {
    const BASE_API = getApiUrl()

    const req = new Request(BASE_API + mToken)
    const response = fetch(req, {
        mode : "cors",
        method : "DELETE"
    });

    return response.then(res => res.json())
            .catch(err => console.log(err))

}

