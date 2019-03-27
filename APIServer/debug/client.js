/*
    Simple wrapper to test the API...
*/

 
const ServerAPI = {

    //Quick and easy way to get data from our api...
    Fetch(data = {}) {
        const url = document.URL + 'api/';

        return fetch(url, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit

            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        }).then(response => response.json()); // parses JSON response into native Javascript objects 

    },

    GetHelp(Topic) {

        ServerAPI.Fetch({
            service: 'help',
            data: {
                topic: Topic
            }
        })
            .then(data => {
                console.log('This is the help data...', data);
            }) // JSON-string from `response.json()` call
            .catch(error => {
                console.error(error);
                debugger;
            });

    },

    GetDataFolder(Topic) {

        ServerAPI.Fetch({
            service: 'dbfolder',
            data: {
                file: 'MasterMap'
            }
        })
            .then(data => {
                console.log('This is the assets data...', data);
            }) // JSON-string from `response.json()` call
            .catch(error => {
                console.error(error);
                debugger;
            });

    },
    GetData(OptionsConfig) {
        if (!OptionsConfig) {
            OptionsConfig = {
                data: {
                    view: 'test'
                }
            };
        }
        OptionsConfig.service = "data";
        console.info('Requesting the server...', OptionsConfig);

        ServerAPI.Fetch(OptionsConfig)
            .then(data => {
                if (OptionsConfig.OnData) {
                    OptionsConfig.OnData(null, data);
                }
                // console.log('MySQL Data:', data);
            }) // JSON-string from `response.json()` call
            .catch(error => {
                // console.error(error);
                debugger;
                if (OptionsConfig.OnData) {
                    OptionsConfig.OnData(error, null);
                }
            });

    },
    TEST: {
        GetAllAssets() {
            ServerAPI.GetData({
                view: 'AllAssets',
                OnData: function (err, AllData) {
                    console.log('All Assets via SQL!');
                    console.log(err, AllData);
                }
            });
        },
        GetDBStats() {
            ServerAPI.GetData({
                view: 'TableTotals',
                OnData: function (err, AllData) {
                    console.log('Database stats...!');
                    console.log(err, AllData);
                }
            });
        }

    }

};

const DebugUI = {
    SetHelpTable() {
        const DisplayTestingActions = document.getElementById("DisplayTestingActions");

        //Clear any old stuff...
        DisplayTestingActions.innerHTML = "";

        for (var n in debugdata.apidata) {
            const namespace = debugdata.apidata[n];
            AddTestingRow(n, namespace);
        }


        function AddTestingRow(NameSpace, RowData) {
            
            debugger;

            //for each test record we have....
            for(var t in RowData.test){
                const test = RowData.test;
                console.log(test)

            }



            const rowHTML = `            
                <td>
                <b>${NameSpace}</b>
                </td>
                <td>${RowData.notes}</td>            
            `;
            const TR = document.createElement('tr');
            TR.innerHTML = rowHTML;
            DisplayTestingActions.appendChild(TR);

        }


    }
};

//After page has loaded...
window.onload = function () {



    console.info('The API Client has loaded...');
    console.info('Feel free to explore this object in the console.');
    /*
        This is only available to the debug client. We 
        don't put this in normal requests from users... 
    */
    console.info(`
    
        Use : "ServerAPI" for easy code to help with testing.
        Use : "debugdata" in the console for the api data help.
    
    `);

    DebugUI.SetHelpTable();

};