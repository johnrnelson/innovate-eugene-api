/*
    Simple wrapper to test the API.

    Adding in whatever you can to help the user actually use the API!

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
            //Put in a default if they are just playing around...
            OptionsConfig = {
                data: {
                    view: 'test'
                }
            };
        }
        OptionsConfig.service = "data";

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
                    if (err) {
                        console.warn('Error in API!', err);
                    } else {
                        console.log('All Assets via SQL!');
                        console.log(AllData);
                    }

                }
            });
        },
        GetDBStats() {
            ServerAPI.GetData({
                view: 'TableTotals',
                OnData: function (err, AllData) {
                    if (err) {
                        console.warn('Error in API!', err);
                    } else {
                        console.log('Database stats...!');
                        console.log(AllData);
                    }

                }
            });
        }

    }

};

const DebugUI = {

    //Build an HTML table with all the api help.. 
    SetHelpTable() {
        DebugUI.DisplayTestingActions = document.getElementById("DisplayTestingActions");
        DebugUI.DisplayTestingResults = document.getElementById("DisplayTestingResults");
        DebugUI.DisplayTestingHelp = document.getElementById("DisplayTestingHelp");


        DebugUI.DisplayTestingResults.innerHTML = "Ready to display testing results!"
        DebugUI.DisplayTestingHelp.innerHTML = "Ready to display dynamic api help..."


        //Clear any old stuff...
        DebugUI.DisplayTestingActions.innerHTML = "";

        // debugger;

        for (var n in debugdata.apidata) {
            const namespace = debugdata.apidata[n];
            AddTestingRow(n, namespace);
        }


        function AddTestingRow(NameSpace, RowData) {



            //for each test record we have....
            for (var t in RowData.test) {
                const test = RowData.test[t];

                // console.log(test);

                const TestActionRow = document.createElement('tr');
                TestActionRow.title = "NameSpace:" + NameSpace;

                const TestActionColA = document.createElement('td');
                const TestActionColB = document.createElement('td');

                TestActionColA.innerHTML = test.text;
                TestActionColB.innerHTML = test.title;

                TestActionColA.className = "buttonclick";

                //Let children reference the test record....
                TestActionRow.DataRecord = test;

                //Set DOM links for easy scripting access....
                TestActionColA.RowElement = TestActionRow;
                TestActionColB.RowElement = TestActionRow;


                //User clicked on me!!!! ??
                TestActionColA.onclick = function () {
                    // console.log(this.RowElement);
                    // debugger;
                    console.log(this.RowElement.DataRecord);
                    try {
                        window.eval(this.RowElement.DataRecord.cmd);
                    } catch (errEval) {
                        console.warn('Bad Eval!', errEval);
                        debugger;

                    }
                }

                TestActionRow.appendChild(TestActionColA);
                TestActionRow.appendChild(TestActionColB);
                DebugUI.DisplayTestingActions.appendChild(TestActionRow);


            }



            // const rowHTML = `            
            //     <td>
            //     <b>${NameSpace}</b>
            //     </td>
            //     <td>${RowData.notes}</td>            
            // `;
            // const TR = document.createElement('tr');
            // TR.innerHTML = rowHTML;
            // DebugUI.DisplayTestingActions.appendChild(TR);

        }


    },
    //Show the server info via HTML in a componet fashion....
    SetSysInfo() {
        const SystemInfo = document.getElementById("SystemInfo");

        //Setup a simple function to add html to our DOM... super simple!!!!!!!!!
        function AddInfoElement(InfoText, InfoTip, ElementData) {
            const NewEL = document.createElement('div');
            NewEL.innerHTML = '<b>' + InfoText + '</b> : ' + ElementData;
            NewEL.title = InfoTip;
            NewEL.className = "FooterSysInfo";
            SystemInfo.appendChild(NewEL);
        }

        AddInfoElement('Start Date', 'The date the server started', debugdata.ST.toLocaleDateString() + " " + debugdata.ST.toLocaleTimeString());
        AddInfoElement('Port', 'APIServer TCP/IP Port', debugdata.port);
        AddInfoElement('Host', 'The hostname of this server',
            '' + window.location.hostname + '');

    },
    /*
        Fill the side bar with options we can use in our debugger...
    */
    FillSideBar() {

        const dbSidebar = document.getElementById('debugger-sidbar');
        const DebugVerbList = dbSidebar.querySelector("#DebugVerbList");

        //When the user selects something different...
        DebugVerbList.onchange = function () {
            const SelOpt = this.selectedOptions[0];

            UIHelper.AceEditor.setValue(JSON.stringify(SelOpt.RecordData.sample, null, "\t"));

            //Set the cursor so the user can start over again...
            UIHelper.AceEditor.moveCursorTo(0);
        };

        var apidataCntr = 0;
        for (var n in debugdata.apidata) {
            //We don't add the default here!
            if (n != "default") {
                const namespaceData = debugdata.apidata[n];

                const optEl = document.createElement('option');
                optEl.RecordData = namespaceData;
                // optEl.value = n;
                optEl.innerHTML = n;

                DebugVerbList.appendChild(optEl);

                //Set default edtor data...
                if (apidataCntr == 0) {
                    UIHelper.AceEditor.setValue(JSON.stringify(optEl.RecordData.sample, null, "\t"));

                    //Set the cursor so the user can start over again...
                    UIHelper.AceEditor.moveCursorTo(0);
                }

                apidataCntr++;



            }
        }



    },
    OpenDialog() {

    },
    RunDebug() {
        console.info('DBUG')
    },
    //Pop a window to show the code!
    ExportCode(TypeOfCode) {
        const languages_supported = {
            'curl': {
                code: `curl --request GET --data '{ "service": "data", "view": "AllAssets" }' http://localhost:9118/api`,
                help: 'Check out the man page for curl for more information.',
            },
            'javascript-fetch': {
                code: ``,
                help: 'You can use xhr but I guess fetch is the new thing.',
            },
            'javascript-http-request': {
                code: ``,
                help: 'Check out the man page for curl for more information.',
            },            
            'python 3': {
                code: ` ** No Python experts helping us out with this?`,
                help: 'Check out the man page for curl for more information.',
            }            
        };

        const active_lang = languages_supported[TypeOfCode];
        if (!active_lang) {
            console.warn('somebody update something? TypeOfCode"' + TypeOfCode + '" not found!');
        } else {




            const modalWindow = document.querySelector('#mastermodal');
            const modalWindowTitle = modalWindow.querySelector('.modal-title');
            const modalWindowBody = modalWindow.querySelector('.modal-body');

            modalWindowTitle.innerHTML = "Client Example Code";


            modalWindowBody.SampleCode = `
                <pre><code>cccc</code></pre>        
                `;



            modalWindowBody.HHHHHHHH = `
                <div> DDDD </div>
                `;


            modalWindowBody.innerHTML = `
                <div>Please help us improve this!</div>
                ${modalWindowBody.SampleCode}
                `;




            $('#mastermodal').modal({
                show: true
            });

        }//End if right type of code...
    }
};


const UIHelper = {
    AceEditor: null, //Set this in code when you are ready...
    ShowTab(Tab2Show) {

        // debugger;
        if (typeof (Tab2Show) == "string") {
            Tab2Show = document.getElementById(Tab2Show);
        }

        if (!UIHelper.ActiveTab) {
            UIHelper.ActiveTab = Tab2Show;
        } else {
            UIHelper.ActiveTab.style.display = "none";
            UIHelper.ActiveTab = Tab2Show;
        }
        UIHelper.ActiveTab.style.display = "block";
    }
};



/*
    After page has loaded, you can be sure that everything you need
    is already loaded and ready to go...
*/
window.onload = function () {

    //Ace Editor is awesome!
    UIHelper.AceEditor = ace.edit("editor");
    UIHelper.AceEditor.setOption("mode", "ace/mode/json");
    UIHelper.AceEditor.$blockScrolling = Infinity;

    //Setup our UI parts...
    DebugUI.SetHelpTable();
    DebugUI.SetSysInfo();
    DebugUI.FillSideBar();



    console.info('The API Client has loaded.Feel free to explore this object in the console.');

    /*
        This is only available to the debug client. We 
        don't put this in normal requests from users... 
    */
    console.info(`
    
        Use : "ServerAPI" for easy code to help with testing.
        Use : "debugdata" in the console for the api data help.
    
    `);


    //Which screen do you want to show first? Are you debugging the debugger? lol
    // UIHelper.ShowTab('TabMain');
    UIHelper.ShowTab('TabDebugger');




};
