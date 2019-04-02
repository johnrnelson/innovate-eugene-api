/*
    default service and temptate you can use.
    
*/
//Change this!!!
function ServiceRequest(request, response) {

    response.end(JSON.stringify({
        msg: 'Hello there!'
    }));


}
exports.ServiceRequest = ServiceRequest;