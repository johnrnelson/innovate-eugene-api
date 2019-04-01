const topics = {
    //Get a list of sample files to work with....
    'sample-code-list': function (request, response) {

        const reqData = request.RequestData.data;

        const sampleid = reqData.sampleid.replace(/\./g, '');

        // console.log(sampleid);

        const fs = require('fs');
        const path = require('path');
 

        // const examplesFolder = path.resolve(path.join(SERVER.RootFolder, "services",
        //     path.normalize(path.join('data', 'examples'))));

        const examplesFolder = path.resolve(path.join(SERVER.RootFolder, "services", sampleid, 'examples'));


        // console.log(examplesFolder);

        fs.readdir(examplesFolder, function (err, items) {
            if (err) {
                debugger;
            } else {


                const sampleFiles = [];

                for (var i = 0; i < items.length; i++) {
                    // var debugFilePath = examplesFolder + '/' + items[i];
                    var stripFileName = items[i].replace('.json', '');

                    // console.log("Start: " + debugFilePath);
                    sampleFiles.push(stripFileName);
                }

                //go through the selected service examples and get what they want...
                response.end(JSON.stringify({
                    samples: sampleFiles
                }));

            }


        });

    },
    //get the actual sample file...
    'sample-code-fetch': function (request, response) {
        const reqData = request.RequestData.data;

        const sampleid = reqData.sampleid.replace(/\./g, '');
    
        const targetService = reqData["target-service"].replace(/\./g, '');

        // console.log(sampleid, targetService);

        const fs = require('fs');
        const path = require('path'); 

        const examplesFilePath = path.join(SERVER.RootFolder, "services", targetService, "examples", sampleid + ".json");
 


        fs.readFile(examplesFilePath, 'utf8', function (err, data) {
            if (err) {
                debugger;
                console.log(reqData);
                console.log(sampleid);
                console.log(examplesFilePath);
                response.end(JSON.stringify({
                    path: examplesFilePath,
                    err: err.message,
                }));
            } else {
                response.end(JSON.stringify({
                    msg: "Have fun with this code!",
                    code: JSON.parse(data),
                }));
            }


        });



    }
};

function ServiceRequest(request, response) {


    // debugger;
    try {

        const reqData = request.RequestData.data;



        if (!reqData.topic) {

            response.SendError(response, {
                err: 'Please supply a topic!'
            });

        } else {

            const activeTopic = topics[reqData.topic];

            if (!activeTopic) {

                response.end(JSON.stringify({
                    msg: 'Ok now write help about this topic <b>' + reqData.topic + '<b>! lol'
                }));
            } else {
                activeTopic(request, response);
            }


        }

    }
    catch (errorService) {
        response.SendError(response, {
            err: errorService.message
        });


    }


}
exports.ServiceRequest = ServiceRequest;