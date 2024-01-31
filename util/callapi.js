function visitTable() {
 
    const BASE_API = 'https://66.103.216.190:7209/api/timeTable/'
    //const vToken = 'vdcf582148cc6424d'
    const vToken = document.getElementById("vTokenText").value
    const output = document.getElementById("responseText")

    const req = new Request(BASE_API + vToken)
    const response = fetch(req, {mode : "cors"});

    response.then(res => res.text())
            .then(myjson => output.innerHTML = myjson)
            .catch(err => document.writeln(err))

}