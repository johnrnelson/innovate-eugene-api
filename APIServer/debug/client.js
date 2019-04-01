/*
    Simple wrapper to test the API using the browser.

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

    } 
};

const DebugUI = {

    //Build an HTML table with all the api help.. 
    SetHelpTable() {
        DebugUI.DisplayTestingActions = document.getElementById("DisplayTestingActions");
        // DebugUI.DisplayTestingResults = document.getElementById("DisplayTestingResults");
        // DebugUI.DisplayTestingHelp = document.getElementById("DisplayTestingHelp");


        // DebugUI.DisplayTestingResults.innerHTML = "Ready to display testing results!"
        // DebugUI.DisplayTestingHelp.innerHTML = "Ready to display dynamic api help..."


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

                // TestActionColA.className = "buttonclick";

                //Let children reference the test record....
                TestActionRow.DataRecord = test;

                //Set DOM links for easy scripting access....
                TestActionColA.RowElement = TestActionRow;
                TestActionColB.RowElement = TestActionRow;


                // //User clicked on me!!!! ??
                // TestActionColA.onclick = function () {
                //     // console.log(this.RowElement);
                //     // debugger;
                //     console.log(this.RowElement.DataRecord);
                //     try {
                //         window.eval(this.RowElement.DataRecord.cmd);
                //     } catch (errEval) {
                //         console.warn('Bad Eval!', errEval);
                //         debugger;

                //     }
                // }

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


        //You are user!!!
        console.log(debugdata.UserInfo);

        if (debugdata.UserInfo.isAuthenticated) {
            AddInfoElement('Security Level', 'Level of permissions on the server', debugdata.UserInfo.SecurityLevel);
        } else {
            AddInfoElement('Security Status', 'Your current user status from the servers perspective.', 'Not Authenticated');

        }


        AddInfoElement('Host:Port', 'The hostname and port the server is using for the API',
            '' + window.location.hostname + ':' + debugdata.port);

        AddInfoElement('NodeVersion', 'The version of node on this server',
            debugdata.NodeVersion);
        AddInfoElement('Start Date', 'The date the server started', debugdata.ST.toLocaleDateString() + " " + debugdata.ST.toLocaleTimeString());


    },
    /*
        Fill the side bar with options we can use in our debugger...
    */
    FillSideBar() {

        const dbSidebar = document.getElementById('debugger-sidbar');
        const DebugVerbList = dbSidebar.querySelector("#DebugVerbList");
        const ExampleCodeList = dbSidebar.querySelector("#ExampleCodeList");

        //When the user selects something different...
        DebugVerbList.onchange = function () {
            const SelOpt = this.selectedOptions[0];



            //Quick clear the old stuff...
            ExampleCodeList.innerHTML = "";
            // debugger;



            ServerAPI.Fetch({
                service: 'help',
                data: {
                    topic: 'sample-code-list',
                    sampleid: SelOpt.value

                }
            })
                .then(data => {
                    console.log('Set default examples---...', data);

                    for (let index = 0; index < data.samples.length; index++) {
                        const sample = data.samples[index];
                        const opt = document.createElement('option');
                        opt.innerHTML = sample;
                        ExampleCodeList.appendChild(opt);
                    }

                    ExampleCodeList.onchange();

                }) // JSON-string from `response.json()` call
                .catch(error => {
                    console.error(error);
                    debugger;
                });


        };


        //When the user selects something different...
        ExampleCodeList.onchange = function () {

            const SelVerb = DebugVerbList.selectedOptions[0];

            const SelOpt = this.selectedOptions[0];

            ServerAPI.Fetch({
                service: 'help',
                data: {
                    topic: 'sample-code-fetch',
                    sampleid: SelOpt.innerHTML,
                    'target-service': SelVerb.innerHTML
                }
            })
                .then(data => {

                    if (data.err) {
                        debugger;
                        console.warn(data.err);
                    } else {

                        UIHelper.AceEditor.setValue(JSON.stringify(data.code, null, "\t"));

                        //Set the cursor so the user can start over again...
                        UIHelper.AceEditor.moveCursorTo(0);
                    }


                }) // JSON-string from `response.json()` call
                .catch(error => {
                    console.error(error);
                    debugger;
                });


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

        //Use the default....
        DebugVerbList.onchange();



    },
    OpenDialog(DialogInfo) {
        // debugger;



        const modalWindow = document.querySelector('#mastermodal');
        const modalWindowTitle = modalWindow.querySelector('.modal-title');
        const modalWindowBody = modalWindow.querySelector('.modal-body');

        modalWindowTitle.innerHTML = DialogInfo.title;
        modalWindowBody.innerHTML = DialogInfo.body;

        $('#mastermodal').modal({
            show: true
        });

    },
    RunDebug() {
        console.clear();
        console.info('\r\nRun the debug code : ');


        const APIDebugResults = document.getElementById("APIDebugResults");

        APIDebugResults.innerHTML = "";


        // debugger;
        //Get our contents from the editor...
        const JSONPayload = DebugUI.GetEditorJSON();

        if (JSONPayload) {
            ServerAPI.Fetch(JSONPayload)
                .then(data => {
                    var dispHTML;

                    if (data.debug) {
                        dispHTML = 'DBUG:' + JSON.stringify(data.debug) +
                            '<hr>';
                    }

                    if (data.err) {


                        DebugUI.OpenDialog({
                            title: "Error runing the service",
                            body: `
                            <div>Please report this to support!</div>
                            <b>Error Message</b>:${JSON.stringify(data.err)}
                            <br>
                            <b><i>OK then?</i></b>
                            `
                        });


                        dispHTML += "<b>Error Message</b>:" + JSON.stringify(data.err);
                        APIDebugResults.innerHTML = dispHTML;

                    } else {

                        dispHTML += 'RESULT:' +
                            JSON.stringify(data);
                        APIDebugResults.innerHTML = dispHTML;

                    }


                }) // JSON-string from `response.json()` call
                .catch(error => {
                    console.error(error);
                    debugger;
                });
        }


    },
    /*
        Toggle the result panel if we are too lazy to check out the 
        window console. lol  :-)
    */
    ToggleResult(ShowFlag) {

        const APIDebugResultsElement = document.getElementById("APIDebugResults");
        const AceEditorElement = document.getElementById("PayloadEditor");

        //Toggle if no falg defined!
        if (!ShowFlag) {
            if (APIDebugResultsElement.style.display == "none") {
                ShowFlag = true;
            } else {
                ShowFlag = false;
            }
        }

        if (ShowFlag) {
            APIDebugResultsElement.style.display = "";
            AceEditorElement.style.bottom = "200px";
        } else {
            APIDebugResultsElement.style.display = "none";
            AceEditorElement.style.bottom = "0";
        }

        //Make sure the Ace editor knows it's been resized...
        UIHelper.AceEditor.resize();
    },


    GetEditorJSON() {

        try {
            return JSONPayload = JSON.parse(UIHelper.AceEditor.getValue());


        } catch (errorJSON) {

            const modalWindow = document.querySelector('#mastermodal');
            const modalWindowTitle = modalWindow.querySelector('.modal-title');
            const modalWindowBody = modalWindow.querySelector('.modal-body');

            modalWindowTitle.innerHTML = "Error in JSON!";

            modalWindowBody.innerHTML = `
            <div>Fix the JSON errors before attempting to call the API!</div> 
            <br> 
            `;

            $('#mastermodal').modal({
                show: true
            });
            return null;
        }

    },
    //Pop a window to show the code!
    ExportCode(TypeOfCode) {


        //Get our contents from the editor...
        const JSONPayload = DebugUI.GetEditorJSON();

        /*
            Define the languages supported and how to help...
        */
        const languages_supported = {
            'curl': function () {

                return {
                    title: 'Command line "curl"',
                    code: `curl --request GET --data '${JSON.stringify(JSONPayload)}' ${window.location.href}`,
                    help: 'Check out the man page for curl for more information.',
                }
            },
            'javascript-fetch': function () {
                return {
                    title: 'Browser javascript',
                    code: `
                const url = document.URL + 'api/';<br>
                <br>
                <br>
                return fetch(url, {<br>
                    method: "PUT", // *GET, POST, PUT, DELETE, etc.<br>
                    mode: "cors", // no-cors, cors, *same-origin<br>
                    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached<br>
                    credentials: "same-origin", // include, *same-origin, omit<br>
                    <br>
                    <br>
                    headers: {<br>
                        "Content-Type": "application/json",<br>
                    },<br>
                    redirect: "follow", // manual, *follow, error<br>
                    referrer: "no-referrer", // no-referrer, *client<br>
                    body: JSON.stringify(data), // body data type must match "Content-Type" header<br>
                }).then(response => response.json()); // parses JSON response into native Javascript objects<br>
                <br>
                
                `,
                    help: 'You can use xhr but I guess fetch is the new thing.',
                }
            },
            'javascript-http-request': function () {
                return {
                    title: 'NodeJS HTTP Request',
                    code: `** SAMPLE CODE for npm "request" **`,
                    help: 'There are many ways to use request objects in Node.',
                }
            },
            'python 3': function () {
                return {
                    title: 'Python 3 Example',
                    code: `No Python experts helping us out with this?
<br>
Any Help at all?
                `,
                    help: 'Check out the man page for curl for more information.',
                }
            }
        };



        const active_lang = languages_supported[TypeOfCode]({
            jSON: 'data'
        });

        //User wants to use something we don't know about???
        if (!active_lang) {
            console.warn('somebody update something? Did you check git for the latest code? TypeOfCode"' + TypeOfCode + '" not found!');
        } else {

            DebugUI.OpenDialog({
                title: active_lang.title,
                body: `
                <div>Please help us improve this!</div>
                <pre><code>${active_lang.code}</code></pre>
                <br>
                <b><i>${active_lang.help}</i></b>
                `
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
    UIHelper.AceEditor = ace.edit("PayloadEditor");

    // Go here for more options... https://github.com/ajaxorg/ace/wiki/Configuring-Ace
    UIHelper.AceEditor.setOption("mode", "ace/mode/json");
    UIHelper.AceEditor.setOption("autoScrollEditorIntoView", true);
    UIHelper.AceEditor.setOption("showPrintMargin", false);
    UIHelper.AceEditor.setOption("fontSize", 15);
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
    UIHelper.ShowTab('TabMain');
    // UIHelper.ShowTab('TabDebugger');





};
