import React, {Component, PropTypes} from 'react';
import Griddle from 'griddle-react';

class SearchOverview extends Component {

    constructor(props) {
        super(props);
        // console.log("constructor " + JSON.stringify(this.props));
        let disabledEntry = (this.props.currentrole == "Admin Dealer"); // || (this.props.checklisttypegroup == "PDI" && !this.props.currentpdiapproved);
        let disabledEntryText = (<div></div>);
        if (disabledEntry) {
            disabledEntryText = (<div>Not sufficient access rights, current role: {this.props.currentrole}, is PDI
                approved: {this.props.currentpdiapproved}</div> )
        }
        let selecttypes = [
            {"key": 1, "type": "All types"},
            {"key": 2, "type": "PDI"},
            {"key": 3, "type": "H100"},
            {"key": 4, "type": "Body"},
            {"key": 5, "type": "LS"}

        ];

        // console.log("constructor " + disabledEntry);
        this.state = {

            selecttypes: selecttypes,
            selectedType: "All types",
            numRecordsFound: "0",
            searchVin: "",
            searchDealer: "",
            chks: [],
            disabledentry: disabledEntry,
            disabledentrytext: disabledEntryText
        };
    }

    avoidReloadPage(event) {
        event.preventDefault();
        // console.log("avoidReloadPage ");
        return false;
    }

    componentWillMount() { // only called one time
        this.loadChecklists(this.state.searchDealer, this.state.searchVin, this.state.selectedType);
    }

    componentWillUnmount() {
        this.state.subscription.stop();
    }

    setChecklistsInState(chks, searchDealer, searchVin, selectedType) {
        let numRecordsFound = "0";
        if (chks && chks.length > 0) {
            // console.log("chks[0] " + JSON.stringify(chks[0]));
            numRecordsFound = "" + chks.length;
        }

        this.setState({
            "chks": chks,
            "numRecordsFound": numRecordsFound,
            "searchDealer": searchDealer,
            "searchVin": searchVin,
            "selectedType": selectedType
        });
    }

    buildQuery(searchDealer, searchVin, selectedType) {
        let searchStringVin = searchVin ? "^" + searchVin : "";
        let statusList = ["service manager submitted", "technician submitted"];

        let query = {
            "status": {$in: statusList}
        };
        // prepare searchQuery
        if (this.props.currentrole == "Admin System") {
            if (this.props.currentcompany != "ALL") {
                query["make"] = this.props.currentcompany.toUpperCase()

            }
        } else {
            if (this.props.currentrole == "Service Manager" || this.props.currentrole == "Technician") {
                if (this.props.currentdealer == "ALL" || this.props.isImporter) {
                    query["make"] = this.props.currentcompany
                } else {
                    query["make"] = this.props.currentcompany;
                    query["lastEditUserDealer"] = this.props.currentdealer
                }
            }
        }


        if (searchStringVin.length <= 7) { // // <=7  because "^" + search string
            query["vinLast"] = {$regex: searchStringVin};
        } else {
            query["vin"] = {$regex: searchStringVin};
        }

        if (searchDealer.length > 0) {
            query['lastEditUserDealer'] = {$regex: searchDealer}
        }
        if (selectedType.length > 0 && selectedType != "All types") {
            query['checklisttypegroup'] = selectedType
        }
        return query;
    }

    loadChecklists(searchDealer, searchVin, selectedType) {
        // console.log("searchVehicles vin " + searchVin + " pending " + searchPending
        //     + " submitted " + searchSubmitted + " pdi " + searchPDI + " h100 " + searchH100);

        let query = this.buildQuery(searchDealer, searchVin, selectedType);
        // console.log("searchVehicles query " + JSON.stringify(query));

        let that = this;
        Meteor.call('checklistmains.findChecklists100', query, function (err, chks) {
            if (err) {
                console.log("Error: " + err);
            } else {
                // console.log("handleSearch after find " + JSON.stringify(newState));
                // console.log("Result: " + JSON.stringify(chks));

                that.setChecklistsInState(chks, searchDealer, searchVin, selectedType);
            }
        });

        // console.log("grouped chk how many found " + chks.length); // + JSON.stringify(chks));

        return;
    }

    handleChangeSearchVin(event) {
        let searchVin = event.target.value.toUpperCase();
        // console.log("handleChangeSearchVin " + JSON.stringify(searchVin));
        //   searchVehicles(searchVin, searchLatest, searchPDI, searchH100) {
        let res = this.loadChecklists(this.state.searchDealer, searchVin, this.state.selectedType);

    }

    handleChangeSearchDealer(event) {
        let searchDealer = event.target.value;
        // console.log("handleChangeSearchDealer " + JSON.stringify(searchDealer));
        let res = this.loadChecklists(searchDealer, this.state.searchVin, this.state.selectedType);

    }

    handleChangeSelectedType(event) {
        let selectedType = event.target.value;
        // console.log("handleChangeSearchDealer " + JSON.stringify(selectedType));
        let res = this.loadChecklists(this.state.searchDealer, this.state.searchVin, selectedType);

    }

    render() {
        // console.log("render SearchOverview ");
        // console.log("SearchOverview USERNAME    " + this.props.currentusername);
        // console.log("SearchOverview COMPANY     " + this.props.currentcompany);
        // console.log("SearchOverview DEALER      " + this.props.currentdealer);
        // console.log("SearchOverview ROLE        " + this.props.currentrole);
        // console.log("SearchOverview PDIapproved " + this.props.currentpdiapproved);

        if (!this.props.mainsReady) {
            return (
                <div id="loader"></div>
            )
        } else {
            // disable entry according to role
            // if (this.state.chks.length == 0) {
            //     chks = this.searchVehiclesFromRender(this.state.searchVin, this.state.searchPending,
            //         this.state.searchSubmitted, this.state.searchPDI, this.state.searchH100);
            // } else {
            let chks = this.state.chks;
            // console.log("state " + JSON.stringify(chks));
            //     console.log("state-chks");
            //   }
            let infoText = "Shows max 100 checklists.";

            if (!this.state.disabledentry) {

                const rowMetadata = {
                    bodyCssClassName: rowData => (rowData.id === this.state.selectedRowId ? 'selected' : ''),
                };
                let metadata = [{"columnName": "vin", "cssClassName": "iconBlue"}];


                // console.log("state " + JSON.stringify(this.state));
                return (
                    <div className="SearchOverview">
                        <div className="container">
                            <div className="row">
                                <form onSubmit={this.avoidReloadPage.bind(this)}>

                                    <div className='col m4 s4 input-field'>
                                        <span className="grey-text text-lighten-1"><i>(Select dealer)</i></span>
                                        <select ref="dealerexisting" id="Dlr_Name_Existing"
                                                onChange={this.handleChangeSearchDealer.bind(this)}
                                                defaultValue={this.state.searchDealer} required>
                                            {
                                                this.props.dealersshort.map(function (ll) {
                                                    return <option key={ll.key}
                                                                   value={ll.dealer}>{ll.dealer}</option>;
                                                })
                                            }
                                        </select>
                                        <label className="active" htmlFor="Dlr_Name_Existing">Filter Dealer</label>
                                    </div>

                                    {/*<div className="col s12 m12 input-field">*/}
                                    {/*<span className="grey-text text-lighten-1"><i>(Enter any part of dealername)</i></span>*/}
                                    {/*<input value={this.state.searchDealer} type="text"*/}
                                    {/*onChange={this.handleChangeSearchDealer.bind(this)}*/}
                                    {/*/>*/}
                                    {/*<label htmlFor="vin" className="active">Filter Dealer Name</label>*/}

                                    {/*</div>*/}

                                    <div className="col s3 m3 input-field">
                                        <span className="grey-text text-lighten-1"><i>(Last digits or complete VIN)</i></span>
                                        <input value={this.state.searchVin} type="text"
                                               onChange={this.handleChangeSearchVin.bind(this)}
                                        />
                                        <label htmlFor="vin" className="active">Filter Vin</label>
                                    </div>



                                        <div className='col s3 m3 input-field'>
                                            <span className="grey-text text-lighten-1"><i>(PDI, H100, ..)</i></span>

                                            <select id="Dlr_Type"
                                                    onChange={this.handleChangeSelectedType.bind(this)}
                                                    defaultValue={this.state.selectedType} required>
                                                {
                                                    this.state.selecttypes.map(function (ll) {
                                                        return <option key={ll.key}
                                                                       value={ll.type}>{ll.type}</option>;
                                                    })
                                                }
                                            </select>
                                            <label className="active" htmlFor="Dlr_Type">Type</label>
                                    </div>

                                    <div className="row">
                                        <div className="col m12 s12 input-field">
                                            <span className="grey-text text-lighten-1"><i>{infoText}</i> </span>

                                            <Griddle results={chks} tableClassName="table bordered"
                                                     showFilter={false} resultsPerPage={16} enableInfiniteScroll={false}
                                                     useFixedHeader={true}
                                                     bodyHeight={800}
                                                     showSettings={false} showPager={true}
                                                     columns={["Dealer", "VIN", "Submitted Date", "Status", "Service Manager", "Technician"]}
                                            />
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                )
            }

        }
    }
}

SearchOverview.propTypes = {
    currentuserid: React.PropTypes.string.isRequired,
    currentusername: React.PropTypes.string.isRequired,
    currentcompany: React.PropTypes.string.isRequired,
    currentdealer: React.PropTypes.string.isRequired,
    isImporter: React.PropTypes.bool,
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool,
    checklisttypegroup: React.PropTypes.string,
    createChecklistFunc: PropTypes.func,
    mainsReady: React.PropTypes.bool.isRequired,
    dealersshort: React.PropTypes.array.isRequired
};

export default SearchOverview;
