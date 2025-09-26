import React, {Component, PropTypes} from 'react';
import Griddle from 'griddle-react';

class Search extends Component {

    constructor(props) {
        super(props);
        // console.log("constructor " + JSON.stringify(this.props.status));
        let disabledEntry = (this.props.currentrole == "Admin Dealer") || (this.props.checklisttypegroup == "PDI" && !this.props.currentpdiapproved);
        disabledEntryText = (<div></div>);
        if (disabledEntry) {
            disabledEntryText = (
                <div>Not sufficient access rights, current role: {this.props.currentrole}, is NOT PDI approved</div> )
        }

        // console.log("constructor checklisttype " + JSON.stringify(this.props.checklisttype));
        this.state = {
            selectedFromGriddle: false,
            firstSearchDone: false,
            chkSubset: {},
            numRecordsFound: "0",
            chk_id: "",
            searchVin: "",
            chks: this.props.initChecks,
            optionChks: [],
            checklisttype: this.props.checklisttype,
            selectedRowId: 0,
            searchPending: false,
            searchTSubmitted: false,
            searchSSubmitted: false,
            disabledentry: disabledEntry,
            disabledentrytext: disabledEntryText,
            pendingExists: true
        };


    }

    avoidReloadPage(event) {
        event.preventDefault();
        // console.log("avoidReloadPage ");
        return false;
    }

    componentWillMount() {
        // console.log("componentWillMount role " + JSON.stringify(this.props.currentrole));
        // console.log("componentWillMount ");
        if (this.props.currentrole == "Service Manager") {
            let newState = _.clone(this.state);
            newState.searchPending = false;
            newState.searchTSubmitted = true;
            newState.searchSSubmitted = false;

            // buildQuery(currentState, searchVin, searchPending, searchTSubmitted, searchSSubmitted) {
            newState = this.buildQuery(newState, newState.searchVin, newState.searchPending, newState.searchTSubmitted, newState.searchSSubmitted);
            console.log("componentWillMount newState " + JSON.stringify(newState));

            let that = this;
            Meteor.call('checklistmains.findVehicles', newState
                , function (err, chks) {
                    if (err) {
                        console.log("Error: " + err);
                    } else {
                        // console.log("componentWillMount after find " + JSON.stringify(newState));
                        // console.log("Result: " + JSON.stringify(chks.length));
                        setTimeout(() => that.callSetStateFunction(that, newState, chks, that.state.optionChks));
                    }
                });
        }
    }

    setChecksFunction(err, chks) { // , mains_id, this.props.currentuserid, this.props.currentusername, "H100", "H-Promise", function(err, res){
        if (err) {
            console.log("Error: " + err);
        } else {
            // console.log("handleSearch after find " + JSON.stringify(newState));
            // console.log("Result: " + JSON.stringify(chks));
            setTimeout(() => this.setState(this.buildNewState(newState, chks, null, null,
                this.state.searchVin, this.state.searchPending, this.state.searchTSubmitted, this.state.searchSSubmitted, [])));
        }
    }

    callSetStateFunction(that, newState, chks, optionChks) {
        // console.log("callSetStateFunction searchPending " + JSON.stringify(newState.searchPending));
        // console.log("callSetStateFunction searchTSubmitted " + JSON.stringify(newState.searchTSubmitted));
        // console.log("callSetStateFunction searchSSubmitted " + JSON.stringify(newState.searchSSubmitted));

        that.setState(that.buildNewState(newState, chks, null, null,
            newState.searchVin, newState.searchPending, newState.searchTSubmitted, newState.searchSSubmitted, optionChks));
    }

    handleChecklisttypeChange(event) {
        event.preventDefault();
        this.setState({"checklisttype": event.target.value});
    }

    handleSearch(event) {
        event.preventDefault();
        //console.log("SSJ handleSearch " + JSON.stringify(this.state.query));
        let newState = this.buildQuery(this.state, this.state.searchVin, this.state.searchPending, this.state.searchTSubmitted, this.state.searchSSubmitted);

        newState.firstSearchDone = true;
        // console.log("handleSearch " + JSON.stringify(newState.query));
        //console.log("SSJ handleSearch newState " + JSON.stringify(newState));

        let that = this;
        Meteor.call('checklistmains.findVehicles', newState

            , function (err, chks) { // , mains_id, this.props.currentuserid, this.props.currentusername, "H100", "H-Promise", function(err, res){
                if (err) {
                    console.log("Error: " + err);
                } else {
                    // console.log("handleSearch after find " + JSON.stringify(newState));
                    // console.log("Result: " + JSON.stringify(chks.length));
                    newState.firstSearchDone = true;
                    setTimeout(() => that.callSetStateFunction(that, newState, chks, that.state.optionChks));
                }
            });
    }

    handleBack(event) {
        event.preventDefault();

        // console.log("handleBack ));
        let newState = {
            selectedFromGriddle: false,
            chkSubset: {},
            numRecordsFound: "0",
            chk_id: "",
            searchVin: "",
            chks: this.props.initChecks,
            checklisttype: this.props.checklisttype,
            selectedRowId: 0,
            searchPending: (this.props.currentrole == "Service Manager") ? false : true,
            searchTSubmitted: (this.props.currentrole == "Service Manager") ? true : false,
            searchSSubmitted: false,
            disabledentry: this.state.disabledentry,
            disabledentrytext: this.state.disabledEntryText,
            pendingExists: true
        };
        if (this.props.currentrole == "Service Manager") {
            
			newState = this.buildQuery(newState, newState.searchVin, newState.searchPending, newState.searchTSubmitted, newState.searchSSubmitted);

            let that = this;
            Meteor.call('checklistmains.findVehicles', newState
                , function (err, chks) {
                    if (err) {
                        console.log("Error: " + err);
                    } else {
                        // console.log("componentWillMount after find " + JSON.stringify(newState));
                        // console.log("Result: " + JSON.stringify(chks.length));
                        setTimeout(() => that.callSetStateFunction(that, newState, chks, that.state.optionChks));
                    }
                });
        } else {
            this.setState(newState);
        }
    }

    handleSubmit(event) {
        // console.log("handleSubmit mains_record " + JSON.stringify(this.state.chkSubset));
        // console.log("handleSubmit mains_record " + JSON.stringify(this.state.chkSubset));
        // console.log("handleSubmit mains_record " + JSON.stringify(this.state.checklisttype));

        if (this.state.chks.length != "0" && this.state.chkSubset) {
            if (!this.state.chkSubset.mid || this.state.chkSubset.mid.length == 0 || this.state.chkSubset.status.includes("Check done yet")) {
                event.preventDefault();
                // console.log("typofcheck " + this.state.typofcheck);
                this.props.createChecklistFunc(this.state.chkSubset, this.state.chk_id, this.state.checklisttype);
            }
        }
        // window.location.assign("/Checklist?mid=" + mid + "&type=" + this.refs.checklisttype.value + "&version=" + this.refs.version.value);
    }

    handleCreateSubmit(event) {
        event.preventDefault();
        // console.log("handleCreateSubmit this.state.checklisttype " + this.state.checklisttype);
        // console.log("handleCreateSubmit this.props.checklisttype " + this.props.checklisttype);

        if (this.state.chks.length != "0" && this.state.chkSubset) {
            // always create new
            // do set _id to null to create new mains and not overwrite old
            let ptype = ("" + this.state.checklisttype == "undefined") ? this.props.checklisttype : this.state.checklisttype;
            this.props.createChecklistFunc(this.state.chkSubset, null, this.state.checklisttype);
        }
    }

    testIfPendingExists(chkSubset) {
        // console.log("testIfPendingExists");
        let pendingExists = false;
        let noCreateList = ["new", "pending", "failed-pending", "ready to submit", "technician submitted"];
        let that = this;
        if (_.find(noCreateList, function (st) {
                return st == chkSubset.status
            })) {
            // pendingExists = true;
            setTimeout(() => that.setState({"pendingExists": true}));
        } else {
            let testQuery = {
                'checklisttypegroup': this.props.checklisttypegroup,
                "vin": chkSubset.vin,
                "status": {$in: noCreateList}
            };
            if (this.props.currentcompany.toUpperCase() != "ALL") {
                testQuery.make = this.props.currentcompany.toUpperCase();
            }
            // console.log("testIfPendingExists query " + JSON.stringify(testQuery));

            Meteor.call('checklistmains.findOne', testQuery
                , function (err, chks) { // , mains_id, this.props.currentuserid, this.props.currentusername, "H100", "H-Promise", function(err, res){
                    if (err) {
                        console.log("Error: " + err);
                    } else {
                        // console.log("Result: " + JSON.stringify(chks));

                        setTimeout(() => that.setState({"pendingExists": (chks && !_.isUndefined(chks))}));
                    }
                });
        }
        // console.log("testIfPendingExists pendingExists  " + pendingExists);
        // return pendingExists;
    }

    selectChecklistFromGriddle(gridRow) {
        // console.log("selectChecklistFromGriddle"); //  row  " + JSON.stringify(gridRow.props.data));

        // todo cloning with omit _id
        let chkSubset = _.omit(gridRow.props.data, "_id");

        let chk_id = gridRow.props.data._id;
        let numRecordsFound = 1;
        let chks = [chkSubset];

        let pendingExists = true;

        this.testIfPendingExists(chkSubset);

        setTimeout(() => this.setState({
            "selectedFromGriddle": true,
            "chks": chks,
            "chkSubset": chkSubset,
            "chk_id": chk_id,
            "numRecordsFound": numRecordsFound,
            "searchVin": chkSubset.vin,
            "selectedRowId": gridRow.props.data.id

            // "pendingExists": pendingExists
        }));
    }

    buildNewState(currentState, chks, query, fullQuery, searchVin, searchPending, searchTSubmitted, searchSSubmitted, optionChks) {
        // console.log("buildNewState state ");
        let newChk_id;
        let newChkSubset = {};
        let newNumRecordsFound = "0";
        if (chks && chks.length > 0) {
            // console.log("chks[0] " + JSON.stringify(chks[0]));
            newNumRecordsFound = "" + chks.length;
            if (!currentState.selectedFromGriddle) {
                newChkSubset = _.omit(chks[0], '_id');
                newChk_id = chks[0]._id;
            }
        }
        let newPendingExists = false;
        if (newNumRecordsFound && newNumRecordsFound == "1") {
            newPendingExists = this.testIfPendingExists(newChkSubset);
        }

        // offer options only for last 6 digits and only when exactly 6
        let newOptionChks = searchVin.length == 6 ? optionChks : [];

        // if only one go to selected from griddle
        let selectForTechnician = searchPending && !searchTSubmitted && !searchSSubmitted;
        let newSelectedFromGriddle = selectForTechnician && chks && chks.length == 1;
        if (newSelectedFromGriddle) {
            newChkSubset = chks[0];
        }


        let newState = {};

        newState["selectedFromGriddle"] = newSelectedFromGriddle;
         newState["chkSubset"] = newChkSubset;
        newState["numRecordsFound"] = newNumRecordsFound;
        newState["chk_id"] = newChk_id;
        newState["optionChks"] = newOptionChks;
        newState["pendingExists"] = newPendingExists;
        newState["searchVin"] = searchVin;
        newState["chks"] = chks;
        newState["firstSearchDone"] = currentState.firstSearchDone;
        newState["checklisttype"] = currentState.checklisttype;
        newState["selectedRowId"] = currentState.selectedRowId;
        newState["searchPending"] = currentState.searchPending;
        newState["searchTSubmitted"] = currentState.searchTSubmitted;
        newState["searchSSubmitted"] = currentState.searchSSubmitted;
        newState["disabledentry"] = currentState.disabledentry;
        newState["disabledEntryText"] = currentState.disabledEntryText;

        // console.log("buildNewState searchPending " + JSON.stringify(searchPending));
        // console.log("buildNewState searchTSubmitted " + JSON.stringify(searchTSubmitted));
        // console.log("buildNewState searchSSubmitted " + JSON.stringify(searchSSubmitted));
        //
        // console.log("buildNewState searchPending state " + JSON.stringify(currentState.searchPending));
        // console.log("buildNewState searchTSubmitted state " + JSON.stringify(currentState.searchTSubmitted));
        // console.log("buildNewState searchSSubmitted state " + JSON.stringify(currentState.searchSSubmitted));
        // console.log("buildNewState " + JSON.stringify(selectForTechnician));
        // console.log("buildNewState " + JSON.stringify(chks.length));
        // console.log("buildNewState selectedFromGriddle " + JSON.stringify(newSelectedFromGriddle));

        return newState;
    }

    buildQuery(currentState, searchVin, searchPending, searchTSubmitted, searchSSubmitted) {
        // console.log("searchVehicles vin " + searchVin + " pending " + searchPending + " submitted " + searchTSubmitted);
        // console.log("buildQuery");
        // console.log("buildQuery searchPending " + JSON.stringify(searchPending));
        // console.log("buildQuery searchTSubmitted " + JSON.stringify(searchTSubmitted));
        // console.log("buildQuery searchSSubmitted " + JSON.stringify(searchSSubmitted));

        // debugger;
        let chks = [];

        let newState = _.clone(currentState);

        // build query
        // *****************
        let searchStrVin = searchVin ? "^" + searchVin : "";

        let statusList = [];
        let statusPendingList = [];
        if (searchVin != "") {

            statusPendingList = ["No Body Check done yet", "No PDI Check done yet", "No H100 Check done yet", "No LS Check done yet",
                "new", "pending", "failed-pending",  "failed","ready to submit"];
        }
        else {
            statusPendingList = ["pending", "failed-pending", "ready to submit"];
        }

        let statusTechnicianSubmittedList = ["technician submitted"];
        let statusServiceMSubmittedList = ["service manager submitted"];
        if (searchPending) {
            statusList = statusList.concat(statusPendingList);
        }

        if (searchTSubmitted) {
            statusList = statusList.concat(statusTechnicianSubmittedList);
        }
        if (searchSSubmitted) {
            statusList = statusList.concat(statusServiceMSubmittedList);
        }

        if (!searchPending && !searchTSubmitted && !searchSSubmitted) {
            // avoid not selecting any if none are clicked
            statusList = statusList.concat(statusPendingList);
            statusList = statusList.concat(statusTechnicianSubmittedList);
            statusList = statusList.concat(statusServiceMSubmittedList);
        }

        // init queries with no result query
        let query = {"xx": 1};
        let fullVinQuery = {"xx": 1};

        if (searchStrVin.length <= 7) { // // <=7  because "^" + search string
            // prepare searchQuery for last 6 digits

            if (this.props.currentcompany == "ALL" && this.props.currentrole == "Admin System") {
                // only Admin System with compny "ALL" can access al companies cars
                query = {
                    'checklisttypegroup': this.props.checklisttypegroup,
                    "vinLast": {$regex: searchStrVin},
                    "status": {$in: statusList},
                }
            } else {
                query = {
                    'checklisttypegroup': this.props.checklisttypegroup,
                    "vinLast": {$regex: searchStrVin},
                    "status": {$in: statusList},
                    "make": this.props.currentcompany.toUpperCase()
                }
            }

            if (this.props.currentrole == "Service Manager") {
               
		console.log('current role');
		console.log(this.props.currentrole); 
					
                if (this.props.currentdealer == "ALL") { // } || this.props.isImporter) {

                } else {                    
		    console.log('this.props.currentdealer');		
		    console.log(this.props.currentdealer);
                    //query = {"lastEditUserDealer": this.props.currentdealer}
 		    query.lastEditUserDealer=this.props.currentdealer  //eugeny

					//query["$or"] = [{"dealerName": this.props.currentdealer}, {"lastEditUserDealer": this.props.currentdealer}];
                }
            } else {
                if (this.props.currentrole == "Technician") {
                    if (this.props.currentdealer == "ALL") { // || this.props.isImporter) {

                    } else {
                        // query["dealerName"] = this.props.currentdealer;
                        query["$or"] = [{"dealerName": this.props.currentdealer}, {"lastEditUserDealer": this.props.currentdealer}];
                    }
                }
            }

             console.log("search query " + JSON.stringify(query));
            newState = this.buildNewState(currentState, chks, query, null, searchVin, searchPending, searchTSubmitted, searchSSubmitted, []);
        } else {
			
            query = {
                'checklisttypegroup': this.props.checklisttypegroup,
                "vin": {$regex: searchStrVin},
                "status": {$in: statusList},
            };
            fullVinQuery = {
                'checklisttypegroup': this.props.checklisttypegroup,
                "vin": searchVin,
                "status": {$in: statusList}
            };
            if (!(this.props.currentcompany == "ALL" && this.props.currentrole == "Admin System")) {
                query["make"] = this.props.currentcompany.toUpperCase();
                fullVinQuery["make"] = this.props.currentcompany.toUpperCase();
            }

            if (!(this.props.currentdealer == "ALL")) { // || this.props.isImporter)) {
                // query["dealerName"] = this.props.currentdealer;
                query["$or"] = [{"dealerName": this.props.currentdealer}, {"lastEditUserDealer": this.props.currentdealer}];
                // full vin query searches all cars of all dealers
            }

            // console.log("searchVehicles vin " + searchVin + " pending " + searchPending + " technician " + searchTSubmitted
            //     + " manager " + searchSSubmitted);

            newState = this.buildNewState(currentState, chks, query, fullVinQuery, searchVin, searchPending, searchTSubmitted, searchSSubmitted, []);
        }

        // console.log("buildQuery query " + JSON.stringify(query));
        newState.query = query;
        newState.fullVinQuery = fullVinQuery;
        return newState;
    }

    findWithLastSix(searchVin) {
        // console.log("findWithLastSix ");
        let newState = _.clone(this.state);
        newState = this.buildQuery(newState, searchVin, newState.searchPending, newState.searchTSubmitted, newState.searchSSubmitted);
        // console.log("findWithLastSix " + JSON.stringify(newState.query));
        // console.log("findWithLastSix newState " + JSON.stringify(newState));

        let that = this;
        Meteor.call('checklistmains.findVehicles', newState

            , function (err, chks) { // , mains_id, this.props.currentuserid, this.props.currentusername, "H100", "H-Promise", function(err, res){
                if (err) {
                    console.log("Error: " + err);
                } else {
                    let optionChks = [];
                    let key = 1;
                    chks.forEach(function (chk) {
                        optionChks.push({"vin": chk.vin, "key": key++});
                        // console.log("Result: " + JSON.stringify(chk));
                    });
                    // console.log("Result: " + JSON.stringify(chks.length));
                    // console.log("findWithLastSix Result: " + JSON.stringify(optionChks));

                    setTimeout(() => that.callSetStateFunction(that, newState, chks, optionChks));
                }
            });
    }


    handleChangeSearchVin(event) {

        let searchVin = event.target.value.toUpperCase();
        this.setState({searchVin: searchVin, "optionChks": []});
        /*SSJ
        console.log("handleChangeSearchVin " + JSON.stringify(searchVin));

        if (searchVin.length == 6) {
            this.findWithLastSix(searchVin);
        } else {
            //setTimeout(() => this.setState({searchVin: searchVin, "optionChks": []}));
            this.setState({searchVin: searchVin, "optionChks": []});
        }
        */
    }

    handleSearchPending(event) {
        event.preventDefault();
        // console.log("handleSearchPending " + JSON.stringify(_.keys(event.target.checked)));
        let newStatePending = !this.state.searchPending;
        let newState = this.state; // this.setState(this.buildQuery(this.state, this.state.searchVin, newStatePending, this.state.searchTSubmitted, this.state.searchSSubmitted));

        newState.selectedFromGriddle = false;
        newState.firstSearchDone = false;
        newState.searchPending = newStatePending;

        setTimeout(() => this.setState(newState));
    }

    handleSearchTSubmitted(event) {
        event.preventDefault();
        // console.log("handleSearchTSubmitted " + JSON.stringify(_.keys(event.target.checked)));
        let newStateTSubmitted = !this.state.searchTSubmitted;
        let newState = this.state; // this.buildQuery(this.state, this.state.searchVin, this.state.searchPending, newStateTSubmitted, this.state.searchSSubmitted);

        newState.selectedFromGriddle = false;
        newState.firstSearchDone = false;
        newState.searchTSubmitted = newStateTSubmitted;

        setTimeout(() => this.setState(newState));
    }

    handleSearchSSubmitted(event) {
        event.preventDefault();
        // console.log("handleSearchSSubmitted " + JSON.stringify(_.keys(event.target.checked)));
        let newStateSSubmitted = !this.state.searchSSubmitted;
        let newState = this.state; // this.buildQuery(this.state, this.state.searchVin, this.state.searchPending, this.state.searchTSubmitted, newStateSSubmitted);
        newState.selectedFromGriddle = false;
        newState.firstSearchDone = false;
        newState.searchSSubmitted = newStateSSubmitted;

        setTimeout(() => this.setState(newState));
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.checklisttype != this.props.checklisttype) {
            // console.log("checklisttypes don't match state:" + nextState.checklisttype + " props: " + this.props.checklisttype);
        }
        return true;
    }

    render() {
        // console.log("render Search "+ JSON.stringify(this.state.firstSearchDone));
        // console.log("Search USERNAME    " + this.props.currentusername);
        // console.log("Search COMPANY     " + this.props.currentcompany);
        // console.log("Search DEALER      " + this.props.currentdealer);
        // console.log("Search ROLE        " + this.props.currentrole);
        // console.log("Search PDIapproved " + this.props.currentpdiapproved);
        // console.log("Search isImporter        " + this.props.isImporter);
        // disable entry according to role

        // console.log("render Search optionChks" + JSON.stringify(this.state.optionChks));

        let pageTitle = this.props.checklisttypegroup;
        let pageTitleStep2 = this.props.checklisttypegroup;

        if(this.props.checklisttypegroup == "Body"){
            pageTitle = "Body Inspection: Search for vehicle";
            pageTitleStep2 = "Body Check";
        }
        if(this.props.checklisttypegroup == "LS"){
            pageTitle = "Long Storage: Search for vehicle";
            pageTitleStep2 = "Long Storage Check";
        }
        if(this.props.checklisttypegroup == "PDI"){
            pageTitle = "Pre-delivery Inspection: Search for vehicle";
            pageTitleStep2 = "Pre-delivery Inspection Check";
        }
        if(this.props.checklisttypegroup == "H100"){
            pageTitle = "H-Promise inspection: Search for vehilce";
            pageTitleStep2 = "H-Promise Inspection Check";
        }

        let hasOptions = this.state.optionChks.length > 0;


            // console.log("Search this.state        " + this.state);
        let chks = this.state.chks;
        let chkSubset = this.state.chkSubset;

        // if pending only select - no griddle table!!!
        let selectForTechnician = this.state.searchPending && !this.state.searchTSubmitted && !this.state.searchSSubmitted;

        let numRecordsFound = this.state.numRecordsFound;

        let infoText = "";
        if (this.state.firstSearchDone) {

            if (selectForTechnician) {
            // no griddle table for pending only selected
            infoText = (!chkSubset || numRecordsFound == "0") ? "No vehicle found - Please enter the complete VIN" :
                ( numRecordsFound == "1" ? "1 " + this.props.checklisttypegroup + "-check found"
                        : ( (numRecordsFound == 30) ? "" + numRecordsFound + " or more " + this.props.checklisttypegroup + "  checks found - Please enter the complete VIN" :
                                "" + numRecordsFound + " " + this.props.checklisttypegroup + " checks found - Please enter the complete VIN"
                        )
                );

            } else {

                infoText = (!chkSubset || numRecordsFound == "0") ? "(No vehicles found)" :
                    ( numRecordsFound == "1" ? "1 " + this.props.checklisttypegroup + "-check found)"
                            : ( (numRecordsFound == 30) ? "(" + numRecordsFound + " " + this.props.checklisttypegroup + " (= max-num) checks found - Click to select vehicle)" :
                                    "(" + numRecordsFound + " " + this.props.checklisttypegroup + " checks found - Click to select vehicle)"
                            )
                    );
            }
        }
        let btnCreateContinueText = "Start/Continue " + this.props.checklisttypegroup + "-check";
        let btnContinueText = chkSubset.status == "service manager submitted" ? "View " + this.props.checklisttypegroup + "-check"
            : "Continue " + this.props.checklisttypegroup + "-check";
        let btnCreateText = "Start NEW " + this.props.checklisttypegroup + "-check";
        let btnNoCreateText = "Cannot create NEW " + this.props.checklisttypegroup + "-check - Pending checklist exists";

        // console.log("render selected " + JSON.stringify(this.state.selectedFromGriddle));
        // console.log("render vin      " + chkSubset.vin);
        // console.log("render vin      " + JSON.stringify(this.state.chkSubset));

        let typeIsPdi = this.props.checklisttypegroup == "PDI";
        // console.log("render typeIsPdi      " + typeIsPdi +" type group " + this.props.checklisttypegroup);

        // first checklist or PDI
        let oneChecklistPerVehicle = (this.props.checklisttypegroup == "PDI")
            || (chkSubset && chkSubset.status && chkSubset.status.indexOf("Check done yet") > 0);

        // select checklisttype possible
        let selectChecklisttype = (this.props.checklisttypes && this.props.checklisttypes.length > 1);
        // only relevant if selectChecklisttype is true
        let defaultChecklisttype = this.state.checklisttype;

        if (!this.state.disabledentry && (chkSubset.vin && (this.state.selectedFromGriddle))) { // || numRecordsFound == 1))) {
            if (this.state.selectedFromGriddle) {
                //SSJinfoText = "(Selected " + this.props.checklisttypegroup + " check)";
                infoText = this.props.checklisttypegroup + " Check";
            }
            let hrefVar = "Checklist?mid=" + chkSubset.mid + "&type=" + chkSubset.checklisttype + "&version=" + chkSubset.version;
            // console.log("hrefVar " + hrefVar);
            const rowMetadata = {
                bodyCssClassName: rowData => (rowData.id === this.state.selectedRowId ? 'selected' : ''),
            };
            let metadata = [{"columnName": "vin", "cssClassName": "iconBlue"}];
            // console.log("render data \n" + JSON.stringify(chkSubset));
            // console.log("render data \n" + JSON.stringify(this.state.searchVin));

            let noPendingExists = !this.state.pendingExists;
            return (
                <div className="Search FontFormat">
                    <div className="container">
                        {/*{this.state.disabledentrytext}*/}
                        {/*<h2 className="headingcolor">{infoText}</h2>*/}
                        <h2 className="headingcolor">{pageTitleStep2}</h2>
                        <div className="row">
                            <form onSubmit={this.avoidReloadPage.bind(this)}>
                                {/*SSJ*/}
                                {/*<div className="col m12 s12 input-field gridBtmMargin">*/}
                                    {/*<span className="grey-text text-lighten-1"><i>{infoText} </i></span>*/}
                                    {/*<Griddle ref="myGriddle" results={chks} tableClassName="table bordered"*/}
                                             {/*showFilter={false} resultsPerPage={2} enableInfiniteScroll={true}*/}
                                             {/*useFixedHeader={true}*/}
                                             {/*bodyHeight={60}*/}
                                             {/*showSettings={false} showPager={false}*/}
                                             {/*columns={["VIN", "Model Name", "Status", "Date Approved", "System Manager", "Technician", "Dealer"]}*/}
                                             {/*rowMetadata={rowMetadata}*/}
                                             {/*onRowClick={this.selectChecklistFromGriddle.bind(this)}/>*/}
                                {/*</div>*/}

                                <div className="col s6 m4 input-field">
                                    <input type="text" id="chkvin" ref="vin"
                                           defaultValue={chkSubset.vin} disabled className="blue-text lighten-1"/>
                                    <label className="active mediumFont" htmlFor="chkvin">VIN</label>
                                </div>

                                <div className="col s6 m4 input-field">
                                    <input type="text" id="chkrego" ref="rego"
                                           defaultValue={chkSubset.rego} disabled className="blue-text lighten-1"/>
                                    <label className="active mediumFont" htmlFor="chkrego">Rego</label>
                                </div>

                                <div className="col s6 m4 input-field">
                                    <input type="text" id="chkhomemake"
                                           defaultValue={chkSubset.make} disabled className="blue-text lighten-1"/>
                                    <label className="active mediumFont" htmlFor="chkhomemake">Make</label>
                                </div>

                                <div className="col s6 m4 input-field">
                                    <input type="text" id="chkhomemodel"
                                           defaultValue={chkSubset.modelName} disabled className="blue-text lighten-1"/>
                                    <label className="active mediumFont" htmlFor="chkhomemodel">Model</label>
                                </div>

                                <div className="col s6 m4 input-field">
                                    <input type="text" id="chkhomecolour"
                                           defaultValue={chkSubset.colour} disabled className="blue-text lighten-1"/>
                                    <label className="active mediumFont" htmlFor="chkhomecolour">Colour</label>
                                </div>


                                {typeIsPdi ?
                                    <div className="col s6 m4 input-field">
                                        <input type="text" id="chkhomedealer"
                                               defaultValue={chkSubset.dealerName} disabled
                                               className="blue-text lighten-1"/>
                                        <label className="active mediumFont" htmlFor="chkhomedealer">Dealer</label>
                                    </div>
                                    :
                                    <div></div>
                                }

                                <div className="col s6 m4 input-field">
                                    <input type="text" id="chkhomedealerup"
                                           defaultValue={chkSubset.lastEditUserDealer} disabled
                                           className="blue-text lighten-1"/>
                                    <label className="active mediumFont" htmlFor="chkhomedealerup">Last Updated
                                        Dealer</label>
                                </div>


                                {selectChecklisttype ?
                                    <div className='col m4 s6 input-field'>
                                        <select ref="typeofcheck" id="ID_typeofcheck"
                                                className="blue-text lighten-1 selectFont"
                                                onChange={this.handleChecklisttypeChange.bind(this)}
                                                defaultValue={defaultChecklisttype} required>
                                            {
                                                this.props.checklisttypes.map(function (ll) {
                                                    return <option key={ll.key}
                                                                   value={ll.checklisttype}>{ll.checklisttype}</option>;
                                                })
                                            }
                                        </select>
                                        <label className="active mediumFont" htmlFor="ID_typeofcheck">Type of
                                            Check</label>
                                    </div>
                                    :
                                    <div></div>
                                }


                                <div className="col m12 s12">
                                    <a className="btn waves-effect waves-light green btn-large active" href={hrefVar}
                                       onClick={this.handleBack.bind(this)}
                                       disabled={this.state.disabledentry}>Back</a>
                                    {oneChecklistPerVehicle ?
                                        <a className="btn waves-effect waves-light blue btn-large active" href={hrefVar}
                                           onClick={this.handleSubmit.bind(this)}
                                           disabled={this.state.disabledentry}>{btnCreateContinueText}</a>
                                        :
                                        <div>
                                            <a className="btn waves-effect waves-light blue btn-large active"
                                               href={hrefVar}
                                               onClick={this.handleSubmit.bind(this)}
                                               disabled={this.state.disabledentry}>{btnContinueText}</a>


                                            {noPendingExists ?

                                                <a className="btn waves-effect waves-light blue btn-large active"
                                                   onClick={this.handleCreateSubmit.bind(this)}
                                                   disabled={this.state.disabledentry}>{btnCreateText}</a>
                                                :
                                                <a className="btn waves-effect waves-light red btn-large active"
                                                   disabled="true">{btnNoCreateText}</a>

                                            }
                                        </div>
                                    }
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            );
        } else {
            // console.log("state " + JSON.stringify(this.state));
            return (
                <div className="Search FontFormat">
                    <div className="container">
                        <div className="row">
                            <h2 className="headingcolor">{pageTitle}</h2>
                            <form onSubmit={this.avoidReloadPage.bind(this)}>

                                <div className="row">
                                    <div className="yellow-text text-darken-3 right">
                                        Enter the complete VIN
                                    </div>
                                    <div className="col s12 m12 input-field">
                                        {hasOptions ?
                                            <div>
                                                <input list="vinsfound" value={this.state.searchVin} type="text"
                                                       onChange={this.handleChangeSearchVin.bind(this)}
                                                />
                                                <datalist id="vinsfound">
                                                {
                                                    this.state.optionChks.map(function (ll) {
                                                        return <option key={ll.key}
                                                                       value={ll.vin}>{ll.vin}</option>;
                                                    })
                                                }
                                                </datalist>
                                                    <label htmlFor="vin" className=" mediumFont">&nbsp;&nbsp;VIN</label>
                                            </div>
                                            :
                                            <div>
                                                <input value={this.state.searchVin} type="text"
                                                       onChange={this.handleChangeSearchVin.bind(this)}
                                                />
                                                <label htmlFor="vin" className=" mediumFont">&nbsp;&nbsp;VIN</label>
                                            </div>

                                        }

                                    </div>


                                    <div className='col s12 m12 text-left'>
                                        <span
                                            className="grey-text text-lighten-1 mediumFont">Filter checklists:</span>

                                        <ul className="checkReactive">
                                            <li>
                                                <input type="checkbox" id="searchPending" name="searchPending"
                                                       checked={this.state.searchPending}
                                                       onChange={this.handleSearchPending.bind(this)}
                                                       disabled={this.state.disabledentry}/>
                                                <label htmlFor="searchPending">All Pending</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="searchTSubmitted" name="searchTSubmitted"
                                                       checked={this.state.searchTSubmitted}
                                                       onChange={this.handleSearchTSubmitted.bind(this)}
                                                       disabled={this.state.disabledentry}/>
                                                <label htmlFor="searchTSubmitted">Awaiting Approval</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="searchSSubmitted" name="searchSSubmitted"
                                                       checked={this.state.searchSSubmitted}
                                                       onChange={this.handleSearchSSubmitted.bind(this)}
                                                       disabled={this.state.disabledentry}/>
                                                <label htmlFor="searchSSubmitted">Approved</label>
                                            </li>
                                        </ul>


                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col m12 s12">
                                        <div
                                            className="yellow-text text-darken-3 mediumFont">Please tick one or more checkboxes to narrow your search
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col m12 s12">
                                        <a className="btn waves-effect waves-light blue btn-large active"
                                           onClick={this.handleSearch.bind(this)}
                                           disabled={this.state.disabledentry}>Update Search</a>
                                    </div>
                                </div>
                                {selectForTechnician || !this.state.firstSearchDone ?
                                    <h2>{infoText}</h2>
                                    :
                                    <div className="col m12 s12 input-field">
                                    <span className="grey-text text-lighten-1"><i>{infoText}</i> </span>

                                    <Griddle results={chks} tableClassName="table bordered"
                                             showFilter={false} resultsPerPage={10} enableInfiniteScroll={false}
                                             useFixedHeader={true}
                                             bodyHeight={990}
                                             showSettings={false} showPager={true}

                                    columns={["VIN", "Status", "Model Name", "Date Approved", "Service Manager", "Technician", "Dealer"]}
                                    onRowClick={this.selectChecklistFromGriddle.bind(this)}/>
                                    </div>

                                }
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

Search.propTypes = {
    currentuserid: React.PropTypes.string,
    currentusername: React.PropTypes.string,
    currentcompany: React.PropTypes.string,
    currentdealer: React.PropTypes.string,
    isImporter: React.PropTypes.bool,
    checklisttypes: React.PropTypes.array.isRequired,
    checklisttype: React.PropTypes.string.isRequired,
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool,
    checklisttypegroup: React.PropTypes.string,
    initChecks: React.PropTypes.array,
    createChecklistFunc: PropTypes.func
};

export default Search;
