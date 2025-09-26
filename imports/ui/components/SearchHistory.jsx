import TrackerReact from 'meteor/ultimatejs:tracker-react';
import React, {Component, PropTypes} from 'react';
import Griddle from 'griddle-react';
import {History} from '../../api/history.js';

class SearchHistory extends TrackerReact(React.Component) {

    constructor() {
        super();
        // console.log("constructor " + JSON.stringify(this.props.status));
        const subscription = Meteor.subscribe('history');
        this.state = {
            selectedFromGriddle: false,
            historySet: {},
            vinSearch: "",
            pdi: {},
            ready: subscription.ready(),
            subscription: subscription,
            selectedRowId: 0,
            searchPending: false,
            searchSubmitted: false
        };
    }

    componentWillUnmount() {
        this.state.subscription.stop();
    }

    handleSubmit(event) {
        window.location.assign("/Checklist?vin=" + this.refs.vin.value + "&type=" + this.refs.checklisttype.value + "&version=" + this.refs.version.value);
    }

    selectPdiChecklist(gridRow) {
        // console.log("selectPdiChecklist row  " + JSON.stringify(_.keys(gridRow.props.data)));
        var historySet = {
            'checklisttype': gridRow.props.data.checklisttype,
            "vin": gridRow.props.data.vin,
            'version': gridRow.props.data.version,
            'dealerName': gridRow.props.data.dealerName,
            'lastEditUserName': gridRow.props.data.lastEditUserName,
            'lastUpdated': gridRow.props.data.updatedAt,
            'status': gridRow.props.data.status,
        };
        // console.log("selectPdiChecklist row    " + JSON.stringify(historySet));
        // console.log("selectPdiChecklist state  " + JSON.stringify(this.state.historySet));
        if (!(this.state.historySet.checklisttype && historySet.checklisttype == this.state.historySet.checklisttype
                && this.state.historySet.vin && historySet.vin == this.state.historySet.vin
                && this.state.historySet.version && historySet.version == this.state.historySet.version
                && this.state.historySet.dealerName && historySet.dealerName == this.state.historySet.dealerName
                && this.state.historySet.lastEditUserName && historySet.lastEditUserName == this.state.historySet.lastEditUserName
                && this.state.historySet.lastUpdated && historySet.lastUpdated == this.state.historySet.lastUpdated
                && this.state.historySet.status && historySet.status == this.state.historySet.status
            )
        ) {
            // console.log("selectPdiChecklist SELECT IT  ");
            // selected a different pdi
            this.setState({
                "selectedFromGriddle": true,
                "historySet": historySet,
                "selectedRowId": gridRow.props.data.id
            });


        }
        // console.log("selectPdiChecklist refs test="
        //     + "/Checklist?vin=" + this.state.vin
        //     + "&type=" + this.refs.checklisttype.value + "&version=" + this.refs.version.value); // + JSON.stringify(values) )

        //window.location.assign("/Checklist?vin=" + this.state.vin + "&type=" + this.refs.checklisttype.value + "&version=" + this.refs.version.value)
    }

    handleChangeSearchHistoryVin(e) {
        // console.log("handleChangeSearchHistoryVin " + e.target.value);

        this.setState({
            "selectedFromGriddle": false,
            "historySet": {},
            "searchVin": e.target.value.toUpperCase()
        });
    }

    avoidReloadPage(event) {
        event.preventDefault();
        // console.log("avoidReloadPage ");
        return false;
    }


    handleSearchPending(event) {
        event.preventDefault();
        // console.log("handleSearchPending " + JSON.stringify(_.keys(event.target.checked)));
        let newState = !this.state.searchPending;
        // console.log("handleSearchPending " + JSON.stringify(newState));
        setTimeout(() => this.setState({
            "searchPending": newState
        }));
    }

    handleSearchSubmitted(event) {
        event.preventDefault();
        // console.log("handleSearchSubmitted " + JSON.stringify(_.keys(event.target.checked)));
        let newState = !this.state.searchSubmitted;
        setTimeout(() => this.setState({
            "searchSubmitted": newState
        }));
    }


    render() {
        // console.log("render SearchHistory "); // + JSON.stringify(this.state.selectedFromGriddle));
        let pdi = [];
        var searchStrType = "^PDI";
        var query1 = {};
        if (this.props.currentrole == "Admin System") {
            if (this.props.currentcompany == "ALL") {
                query1 = {
                    'Type': {$regex: searchStrType},
                }
            } else {
                query1 = {
                    'Type': {$regex: searchStrType},
                    "Make": this.props.currentcompany.toUpperCase()
                }
            }
        } else {
            if (this.props.currentrole == "Service Manager") {
                if (this.props.currentdealer == "ALL") {
                    query1 = {
                        'Type': {$regex: searchStrType},
                        "Make": this.props.currentcompany.toUpperCase()
                    }
                } else {
                    query1 = {
                        'Type': {$regex: searchStrType},
                        "Make": this.props.currentcompany.toUpperCase(),
                        "Dealer": this.props.currentdealer
                    }
                }
            } else {
                if (this.props.currentrole == "Technician") {
                    query1 = {
                            'Type': {$regex: searchStrType},
                            "Make": this.props.currentcompany.toUpperCase(),
                            "Dealer": this.props.currentdealer,
                           // "lastEditUserName": this.props.currentusername
                        };
                }
            }
        }

        pdi = History.find(query1).fetch();
        // console.log("render all data found      " + JSON.stringify(pdi));

        return (

         <div className="Search">
                <div className="container">
                    <div className="row">
                        <form onSubmit={this.avoidReloadPage.bind(this)}>
                            <div className="col m12 s12 input-field">
                                <div className="row">
                                    <div className='col m12 s12 text-left'>
                                        <ul className="checkReactive">
                                            <li>
                                                <input type="checkbox" id="searchPending" name="searchPending"
                                                       checked={this.state.searchPending}
                                                       onChange={this.handleSearchPending.bind(this)}
                                                       disabled={this.state.disabledentry}/>
                                                <label htmlFor="searchPending">Pending</label>
                                            </li>
                                            <li>
                                                <input type="checkbox" id="searchSubmitted" name="searchSubmitted"
                                                       checked={this.state.searchSubmitted}
                                                       onChange={this.handleSearchSubmitted.bind(this)}
                                                       disabled={this.state.disabledentry}/>
                                                <label htmlFor="searchSubmitted">Submitted</label>
                                            </li>


                                        </ul>
                                    </div>
                                </div>
                                <span className="grey-text text-lighten-1"><i>(Search all columns or click column header to search in one column only) </i> </span>

                                <Griddle results={pdi} tableClassName="table bordered"
                                         showFilter={true} resultsPerPage={10} enableInfiniteScroll={false}
                                         useFixedHeader={true}
                                         bodyHeight={800}
                                         showSettings={false} showPager={true}
                                         columns={["VIN", "Dealer", "Status", "User", "Date Updated"]}
                                         onRowClick={this.selectPdiChecklist.bind(this)}/>


                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )

    }
}
SearchHistory.propTypes = {
    currentusername: React.PropTypes.string,
    currentcompany: React.PropTypes.string,
    currentdealer: React.PropTypes.string,
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool
};

export default SearchHistory;

