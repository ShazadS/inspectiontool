import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';

import PropTypes from 'prop-types';
import {createContainer} from 'meteor/react-meteor-data';
import {ChecklistTemplates} from '../../api/checklisttemplates.js';
import {ChecklistValues} from '../../api/checklistvalues.js';
import {Locations} from '../../api/locations.js';
import {VehicleTypes} from '../../api/vehicletypes.js';
import {Dealers} from '../../api/dealers.js';
import {PropData} from '../../utilities/propdata.js';
import ChecklistTemplate from '../generator/ChecklistTemplate.jsx';
import PlzLogin from './PlzLogin.jsx';

import classnames from 'classnames';

var Scroll = require('react-scroll');
var Link = Scroll.Link;
var scroll = Scroll.animateScroll;

/**
 *  This componenet calls ChecklistTemplates, to build the checklist page
 *  and
 *  saves values to Mongo (function: saveValuesToMongo) collections: checklistmains and checklistvalues
 *
 */
class CheckList extends Component {
    constructor(props) {
        super(props);
        // console.log("CheckList constructor " ); // + JSON.stringify(props));
        this.state = {
            "numDone": "",
            "topWorkCursor": "not set",
            "openSections": false
        };

        Session.set("server", props.servername);
    }

    checkAccessRights(role, company, dealer, isImporter, pdiApproved, checklistValues) {
        let companyTrimmed = company.trim().toLocaleUpperCase();
        let dealerTrimmed = dealer.trim().toLocaleUpperCase();
        let company2Trimmed = checklistValues && checklistValues[0] ? checklistValues[0].make.trim().toLocaleUpperCase() : "";
        let dealer2Trimmed = checklistValues && checklistValues[0] ? checklistValues[0].dealerName.trim().toLocaleUpperCase() : "";

        // console.log("checkAccessRights " + companyTrimmed);
        // console.log("checkAccessRights " + dealerTrimmed);
        // console.log("checkAccessRights " + company2Trimmed);
        // console.log("checkAccessRights " + dealer2Trimmed);
        let hasAccess = true;
        switch (role) {
            case ("Technician"):
            case ("Service Manager"):
                hasAccess = (companyTrimmed == company2Trimmed)
                    && ((dealerTrimmed == "ALL") || isImporter || (dealerTrimmed == dealer2Trimmed));
                break;
            case ("Admin System"):
                hasAccess = ((companyTrimmed == "ALL") || companyTrimmed == company2Trimmed);
                if (dealerTrimmed != "ALL") {
                    console.log("Error: Admin System should have dealer= 'ALL' but has " + dealerTrimmed);
                }
                break;
            case ("Admin Dealer"):
                hasAccess = (companyTrimmed == company2Trimmed)
                    && ((dealer == checklistValues[0].dealerName));
                break;
            default:
                hasAccess = false;
                console.log("Error: New role??? " + role);
        }
        // console.log("checkAccessRights " + hasAccess);
        return hasAccess;
    }

    scrollToTop() {
        scroll.scrollToTop();

        this.setState({
            "openSections": false
        });
    }

    goToUndoneClicked() {
        // console.log("goToUndoneClicked ");
        this.setState({
            "openSections": true
        });
    }

    checkValuesForChanges(recentValueslist, oldValueslist) {
        // console.log("checkValuesForChanges ");
        // console.log("oldValueslist    " + JSON.stringify(oldValueslist));

        let changed = recentValueslist.some(function (recentItem) {
            // console.log("checking name " + JSON.stringify(recentItem.name));
            // console.log("checking name " + JSON.stringify(recentItem.dbfield));
            let oldItem = _.find(oldValueslist, function (ovi) {
                return recentItem.name == ovi.name;
            });

            if (oldItem && oldItem.value.constructor === Array) {
                let subChanged = recentItem.value.some(function (subRecentItem) {
                    // console.log("subRecentItem " + JSON.stringify(subRecentItem))


                    let subOldItem = _.find(oldItem.value, function (sovi) {
                        return subRecentItem.name == sovi.name;
                    });
                    if (!subOldItem.okValue) { // normal check
                        // console.log("subOldItem " + JSON.stringify(subOldItem));
                        // if (!subOldItem) {
                        //     console.log("UNEQUAL! array " + subRecentItem.name + " does not exist in old")
                        // }
                        // if (subRecentItem.value != subOldItem.value) {
                        //     console.log("UNEQUAL! array ");
                        //     console.log("subrecent " + JSON.stringify(subRecentItem));
                        //     console.log("subold    " + JSON.stringify(subOldItem));
                        // }

                        return (!subOldItem || subOldItem.value != subRecentItem.value);


                    } else {
                        // exterior checklist
                        // okValue
                        // repairedValue
                        // failedValue
                        // commentValue
                        // photo
                        // console.log("COMPARE ======== ");
                        // console.log("subOldItem " + JSON.stringify(subOldItem));
                        // console.log("subRecentItem " + JSON.stringify(subRecentItem));
                        // console.log("================ ");

                        return (!subOldItem
                            || (!(!subOldItem.status && !subRecentItem.status))
                            || subOldItem.status != subRecentItem.status
                            || subOldItem.commentValue != subRecentItem.commentValue
                            || (!(!subOldItem.photo && !subOldItem.photo)
                                || (subOldItem.photo && subOldItem.photo && (subOldItem.photo.length != subRecentItem.photo.length))
                            ));
                    }
                });
                return subChanged;
            } else {
                if (!oldItem) {
                    // console.log("recent UNEQUAL !old " + JSON.stringify(recentItem));
                } else {
                    // if (recentItem.value != oldItem.value) {
                    //     console.log("UNEQUAL");
                    //     console.log("recent " + JSON.stringify(recentItem));
                    //     console.log("old    " + JSON.stringify(oldItem));
                    // }
                }
                return (!oldItem || recentItem.value != oldItem.value);
            }
        });
        return changed;
    }

    saveValuesToMongo(lastUpdated, historyUpdate, valueslist, status, numDone, signaturePic, signatureManPic) {
        // console.log("saveValuesToMongo "); //  + JSON.stringify(valueslist));
        // let nowDate = new Date();

        if (this.props.checklistvalues && this.props.checklistvalues[0]) {
            let id = this.props.checklistvalues[0].id;
            let _id = this.props.checklistvalues[0]._id;
            let vin = this.props.checklistvalues[0].vin;
            let make = this.props.checklistvalues[0].make;
            let dealerName = this.props.checklistvalues[0].dealerName;

            // console.log("Checklist SAVE????? " + this.props.checklistvalues[0].status);

            let different = this.props.checklistvalues[0].status != status;
            if (!different) {
                different = this.checkValuesForChanges(valueslist, this.props.checklistvalues[0].valueslist);
            }
            // console.log("saveValuesToMongo different ? " + JSON.stringify(different));
            if (different == true) {
                Meteor.call('checklistvalues.upsertAll', {
                        '_id': _id
                    }, id, vin, valueslist, status, numDone, lastUpdated, signaturePic, signatureManPic,
                    this.props.currentuserid, this.props.currentusername, this.props.currentdealer, dealerName, make, historyUpdate);

                // checklistvalues.upsertAll'(query_object, id, vin, valueslist, status, numDone, dateTimeNow, signaturePic, signatureManPic, lastEditUserId, lastEditUserName,
                // lastEditUserDealer, dealerName,
                //     make, historyUpdate) {
            }
        } else {
            console.log("Error: values not defined");
        }
    }

    // this.props.updateStatus(null, null, "technician submitted", this.props.numDone);
    updateStatus(lastUpdated, fast, valuesList, oldStatus, oldNumDone, signaturePic, signatureManPic) {

        let oldTopWorkCursor = this.state.topWorkCursor;
        // console.log("CheckList updateStatus " + oldStatus);
        let status = oldStatus;
        let numDone = oldNumDone;
        let historyUpdate = false;
        if (oldStatus.includes("submitted")) {

            if (oldStatus == this.state.oldStatus) {
                // do nothing = NO  saving to Mongo
                return;
            }

            // simple setting of status

            // console.log("CheckList updateStatus " + oldStatus);
            this.setState({
                "oldStatus": oldStatus,
                "status": oldStatus,
                "numDone": oldNumDone,
                "topWorkCursor": "submitButton"
            });
        } else {
            // recompute

            let results = this.countChecksAndRequired(fast, valuesList, oldStatus);
            if (oldStatus != results.newStatus || oldNumDone != results.newNumDone || oldTopWorkCursor != results.topWorkCursor) {

                status = results.newStatus;
                numDone = results.newNumDone;
                // console.log("CheckList updateStatus NEW STATE!!!");
                this.setState({
                    "oldStatus": results.newStatus,
                    "status": results.newStatus,
                    "numDone": results.newNumDone,
                    "topWorkCursor": results.topWorkCursor
                });
            }
            if (oldStatus != results.newStatus) {
                historyUpdate = true;
            }
        }
        this.saveValuesToMongo(lastUpdated, historyUpdate, valuesList, status, numDone, signaturePic, signatureManPic)
    }

    countChecksAndRequired(fast, newValuesList, oldStatus) {
        // console.log("countChecksAndRequired old " + oldStatus);
        let checksResults = {};
        checksResults.checksTotal = 0;
        checksResults.checksNumNa = 0;
        checksResults.checksNumOk = 0;
        checksResults.checksNumFailed = 0;
        checksResults.checksNumAdjusted = 0;
        checksResults.checksNumUnset = 0;
        checksResults.requiredTotal = 0;
        checksResults.requiredNumMissing = 0;
        checksResults.newStatus = "pending";
        checksResults.topWorkCursor = "not set";

        let failedWorkCursor = "not set";
        // console.log("countChecksAndRequired value list " + JSON.stringify(newValuesList));
        newValuesList.some((valelement) => {

            if (valelement.value.constructor === Array) {
                // console.log("countChecksAndRequired in array check ");
                let unset = true;
                valelement.value.map((postfixelement) => {
                    // console.log("postfixelement " + JSON.stringify(postfixelement));
                    if (postfixelement.ok) {
                        if (postfixelement.value == true) {
                            checksResults.checksNumOk++;
                            unset = false;
                        }
                    } else if (postfixelement.failed == 0 || postfixelement.failed == 1) {
                        // console.log("postfixelement failed exists" + JSON.stringify(postfixelement.failed));
                        if (postfixelement.value == true) {
                            // console.log("FAILED");
                            checksResults.checksNumFailed++;
                            unset = false;
                            if (failedWorkCursor == "not set") {
                                failedWorkCursor = valelement.name;
                            }
                        }
                    } else if (postfixelement.na) {
                        if (postfixelement.value == true) {
                            checksResults.checksNumNa++;
                            unset = false;
                        }
                    } else if (postfixelement.adjusted == true) {
                        if (postfixelement.value) {
                            checksResults.checksNumAdjusted++;
                            unset = false;
                        }
                    }

                });
                checksResults.checksTotal++;
                // console.log("countChecksAndRequired " + JSON.stringify(valelement.name));
                // console.log("countChecksAndRequired " + JSON.stringify(unset));
                if (unset) {
                    // console.log("countChecksAndRequired " + JSON.stringify(valelement));
                    checksResults.checksNumUnset++;
                    // checksResults.topWorkPosition = valelement.name < checksResults.topWorkPosition ? valelement.name : checksResults.topWorkPosition;
                    if (checksResults.topWorkCursor == "not set") {
                        checksResults.topWorkCursor = valelement.name;
                        // console.log("top work cursor set to " + checksResults.topWorkCursor);
                    }
                }
            } else {
                if (valelement.required) {
                    checksResults.requiredTotal++;
                    // console.log("countChecksAndRequired " + JSON.stringify(valelement));
                    if (!valelement.value) {
                        checksResults.requiredNumMissing++;
                        if (checksResults.topWorkCursor == "not set") {
                            checksResults.topWorkCursor = valelement.name;
                        }
                    }

                }
                // todo if required must be len > 0
            }
            if (checksResults.checksNumFailed > 0 && (checksResults.checksNumUnset > 0 || checksResults.requiredNumMissing > 0)) {
                checksResults.newStatus = "failed-pending";
                return fast && true;
            }
            // console.log("countChecksAndRequired topWorkCursor" + JSON.stringify(checksResults.topWorkCursor));
            return false;
        });
        
	// console.log("checkIfOkOrFailed " + JSON.stringify(checksResults));
        /*
        Commented by SS
	if (checksResults.checksNumFailed == 0) {
            if (checksResults.checksNumUnset == 0 && checksResults.requiredNumMissing == 0) {
                checksResults.newStatus = "ready to submit";
            } else {
                if (oldStatus == "new"
                    && checksResults.checksTotal == checksResults.checksNumUnset
                    && checksResults.requiredTotal == checksResults.requiredNumMissing) {
                    checksResults.newStatus = "new";
                } else {
                    checksResults.newStatus = "pending";
                }
            }
        } else {
            // failed
            checksResults.newStatus = "failed-pending";
        }
	*/
	
        if (checksResults.checksNumUnset == 0 && checksResults.requiredNumMissing == 0 && checksResults.checksNumFailed == 0) {
            checksResults.newStatus = "ready to submit";
        }
        else if (oldStatus == "new" && checksResults.checksTotal == checksResults.checksNumUnset && checksResults.requiredTotal == checksResults.requiredNumMissing) {
            checksResults.newStatus = "new";
        }
        else if(checksResults.checksNumFailed != 0) {
            checksResults.newStatus = "failed";
        }
        else{
            console.log('checksResults.checksNumFailed');
            console.log(checksResults.checksNumFailed);
            checksResults.newStatus = "pending";
        }


        if (failedWorkCursor != "not set" && checksResults.checksNumUnset == 0) {
            checksResults.topWorkCursor = failedWorkCursor;
        }

        checksResults.newNumDone = "" + (checksResults.checksTotal - checksResults.checksNumUnset) + "/" + checksResults.checksTotal;

        // console.log("countChecksAndRequired " + JSON.stringify(checksResults));
        return checksResults;
    }

    componentWillMount() { // only called one time
        this.setState({
            "oldStatus": this.props.checklistvalues.status
        })
    }

    componentDidMount() {
        // console.log("componentDidMount ");
        let chList = this.props.checklistvalues;
        // console.log("componentDidMount values " + JSON.stringify(chList));
        if (chList.length > 0) {
            let templ = chList[0];
            let valueslist = (templ && templ.template && templ.template.valueslist) ? templ.template.valueslist : {};
            // console.log("valueslist " + JSON.stringify(valueslist));
        }
    }

    // readValues(valuesList, newValuesList) {
    //     valuesList.map((valelement) => {
    //
    //         if (valelement.value.constructor === Array) {
    //             let subListOuter = _.find(newValuesList, function (ele) {
    //                 return ele.name == valelement.name
    //             });
    //
    //             if (!subListOuter) {
    //                 console.log("Error!:  " + valelement.name + " not found in value list");
    //
    //             } else {
    //                 valelement.value.map(checkelement => {
    //
    //                     let subList = _.find(subListOuter.value, function (ele) {
    //                         return ele.name == checkelement.name
    //                     });
    //                     if (document.getElementById(checkelement.name)) {
    //                         subList.value = document.getElementById(checkelement.name).checked;
    //                         // console.log("array element FOUND in DOM - " + postfixelement.name)
    //                     } else {
    //                         subList.value = false;
    //                         // console.log("no array element found in DOM - " + postfixelement.name)
    //                     }
    //                 });
    //             }
    //         } else {
    //             let subList = _.find(newValuesList, function (ele) {
    //                 return ele.name == valelement.name
    //             });
    //             // console.log("submit " + JSON.stringify(subList));
    //             // console.log("submit " + valelement.name + " getelement " + document.getElementById(valelement.name));
    //             if (document.getElementById(valelement.name)) {
    //                 // console.log("element FOUND in DOM - " + valelement.name)
    //                 if (subList) {
    //                     subList.value = document.getElementById(valelement.name).value;
    //                 } else {
    //                     subList.value = '';
    //                     console.log("Error: " + valelement.name);
    //                 }
    //
    //             } else {
    //                 subList.value = '';
    //                 // console.log("no element found in DOM - " + valelement.name)
    //             }
    //         }
    //     });
    //     return newValuesList;
    // }

    clone(obj) {
        let copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    renderCheckListTemplate(status, numDone, vin, chType) {
        // console.log("CheckList renderCheckListTemplate" + " num done " + this.state.numDone);
        let chValuesWhole = this.props.checklistvalues;

        if (chValuesWhole && chValuesWhole.length > 0 && chValuesWhole[0].valueslist) {

            let chTemplate = this.props.checklisttemplates;
            let chLocations = this.props.locations;

            // console.log("num templates " + JSON.stringify(chTemplate.length));
            if (chTemplate && chTemplate.length > 0 && chTemplate[0]) {

                let record = chValuesWhole[0];
                let id = record._id;
                // let valueslist = chValuesWhole[0].valueslist;

                // todo user id

                ////   if (this.props.checklistvalues && this.props.checklistvalues[0]) {
                // console.log("record from values " + JSON.stringify(record));
                let version = record.version ? record.version : "";

                let valuesId = chValuesWhole[0].id;
                let template = chTemplate[0];

                let dealerName = record.dealerName ? record.dealerName : "loading dealer name";
                let make = record.make ? record.make : "loading make";

                let lastUpdated = record.updatedAt ? record.updatedAt : new Date(1753, 0, 1, 12, 0, 0, 0);
                let lastEditUserId = record.lastEditUserId ? record.lastEditUserId : "loading user id";
                let lastEditUserName = record.lastEditUserName ? record.lastEditUserName : "loading user name";
                let lastEditUserDealer = record.lastEditUserDealer ? record.lastEditUserDealer : "";
                // console.log("record from values " + JSON.stringify(lastEditUserDealer));

                // add key to locations
                let locations = [];
                chLocations.forEach(function (ll) {
                    ll.key = ll._id;
                    locations.push(ll);
                });

                let techUserName = record.techUserName ? record.techUserName : "";
                let smanUserName = record.smanUserName ? record.smanUserName : "";
                // todo current user id

                let techDateSigned = record.techDateSigned ? record.techDateSigned : new Date(1753, 0, 1, 12, 0, 0, 0);
                let smanDateSigned = record.smanDateSigned ? record.smanDateSigned : new Date(1753, 0, 1, 12, 0, 0, 0);
                let signaturePic = record.signaturePic ? record.signaturePic : "";
                let signatureManPic = record.signatureManPic ? record.signatureManPic : "";

                let valueslist = record.valueslist ? record.valueslist : [];

                if (valueslist && valueslist.length > 0 && valueslist[0]) {

                    // (role, company, dealer, pdiApproved, checklistValues) {
                    this.checkAccessRights(this.props.currentrole, this.props.currentcompany, this.props.currentdealer, this.props.isImporter, this.props.currentpdiapproved,
                        this.props.checklistvalues);

                    return (
                        <ChecklistTemplate
                            key={id}
                            valuesid={id}
                            currentuserid={this.props.currentuserid}
                            currentusername={this.props.currentusername}
                            currentdealername={this.props.currentdealer}
                            currentrole={this.props.currentrole}
                            currentpdiapproved={this.props.currentpdiapproved}
                            checklisttype={chType}
                            checklistversion={version}
                            // checklistid={valuesId}
                            checklisttemplate={template}
                            openSections={this.state.openSections}
                            status={status}
                            numDone={numDone}
                            vin={vin}
                            dealerName={dealerName}
                            bodyType={this.props.bodyType}
                            make={make}
                            locations={locations}
                            lastUpdated={lastUpdated}
                            techDateSigned={techDateSigned}
                            smanDateSigned={smanDateSigned}

                            lastEditUserId={lastEditUserId}
                            lastEditUserName={lastEditUserName}
                            lastEditUserDealer={lastEditUserDealer}
                            techUserName={techUserName}
                            smanUserName={smanUserName}
                            signaturePic={signaturePic}
                            signatureManPic={signatureManPic}

                            valueslist={valueslist}
                            updateStatus={this.updateStatus.bind(this)}
                        />
                    );

                }
            } else {
                return (
                    <h4> Waiting for data... </h4>
                )
            }

        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    render() {
        // console.log("Checklist render ");
        // console.log("Checklist render currentusername" + JSON.stringify(this.props.currentusername));
        // console.log("Checklist render Meteor.user" + JSON.stringify(Meteor.user()));


        if (!(this.props.readyData && this.props.readyUser)) {
            return <div id="loader"></div>
        } else {
            if (this.props.currentusername == "not logged in") {
                window.location.assign("/");
                return (
                    <PlzLogin/>
                );
            } else {

                // console.log("Checklist - render  this.props.currentdealer " + this.props.currentdealer);

                // console.log("server " + JSON.stringify(this.props.servername));
                Session.set("server", this.props.servername);
                let vin = "loading vin";
                let numDone = this.state.numDone;
                let status = this.state.status;
                let topWorkCursor = this.state.topWorkCursor;

                let type = this.props.checklisttype ? this.props.checklisttype : "not defined";
                type = type == "PDI-COMM" ? "PDI-Commercial" : type;

                if (this.props.checklistvalues && this.props.checklistvalues[0]) {
                    let record = this.props.checklistvalues[0];

                    // set vin from data
                    vin = record.vin ? record.vin : vin;

                    // set status from data if not in state
                    if (!status) {
                        status = record.status ? record.status : "computing ...";
                    }

                    // compute num done from data if not set yet
                    let valueslist = record.valueslist;
                    if ((!numDone || numDone.length == 0) && (valueslist && valueslist.length > 0)) {
                        let results = this.countChecksAndRequired(false, valueslist, status);
                        numDone = results.newNumDone;
                        topWorkCursor = results.topWorkCursor;
                    }
                    topWorkCursor = status.includes('submit') ? "submitButton" : topWorkCursor;
                }

                return (
                    <div className={classnames('PdiHyundai')} ref='PdiHyundai'>

                        <div className="container">
                            {this.renderCheckListTemplate(status, numDone, vin, type)}
                        </div>

                        <div className="row displayInfo">
                            <div className="container">

                                <ul className="displayHdrArea">
                                    <li>

                                        <ul>
                                            <li className="displayStat">{vin}</li>
                                        </ul>

                                    </li>
                                    <li>
                                        <ul>
                                            <li className="displayStat"> {type}</li>
                                        </ul>

                                    </li>
                                    <li>
                                        <ul>

                                            <li>
                                                <Link activeClass="active" to={topWorkCursor}
                                                      className="btn waves-effect waves-light darken-3 teal"
                                                      onClick={this.goToUndoneClicked.bind(this)} spy={true}
                                                      smooth={true}
                                                      offset={-50} duration={200}>
                                                    <i className="material-icons left">playlist_add_check</i>{numDone}
                                                </Link>

                                            </li>

                                        </ul>

                                    </li>
                                    <li>
                                        <ul>
                                            <li className="displayStat"><i
                                                className="material-icons left">done</i>{status}
                                            </li>

                                        </ul>

                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="scrollingToTop" id="scrollTest">
                            <a onClick={this.scrollToTop.bind(this)}>
                                <img src="images/up_arrow.png" width="48" height="48" alt=""/>
                            </a>
                        </div>
                    </div>
                );
            }
        }

    }
}

CheckList.propTypes = {
    currentuserid: PropTypes.string.isRequired,
    currentusername: PropTypes.string.isRequired,
    currentrole: PropTypes.string,
    currentcompany: PropTypes.string,
    currentdealer: PropTypes.string,
    isImporter: PropTypes.bool,
    currentpdiapproved: PropTypes.bool,

    checklisttype: PropTypes.string.isRequired,
    checklistversion: PropTypes.string.isRequired,

    readyData: PropTypes.bool.isRequired,
    readyUser: PropTypes.bool.isRequired,

    checklistvalues: PropTypes.array.isRequired,
    checklisttemplates: PropTypes.array.isRequired,
    locations: PropTypes.array.isRequired,
    bodyType: PropTypes.string.isRequired,
    propvalues: PropTypes.array.isRequired,
    servername: PropTypes.string.isRequired
};

function GetURLParameter(sParam, sUrl) {
    let pp = "not set";
    let sUrlVariables = sUrl.split('&');
    for (let i = 0; i < sUrlVariables.length; i++) {
        let sName = sUrlVariables[i].split('=');
        if (sName[0] == sParam) {
            return sName[1];
        }
    }
    return pp;
}

function userIsReady() {
    let aUser = Meteor.user();
    return (!(typeof aUser === 'undefined'));
}

export default CheckListContainer = createContainer(({params}) => {
    //console.log("current user " + JSON.stringify(Meteor.user()));

    let sPageURL = window.location.search.substring(1);
    // let vinVal = GetURLParameter(vinName, sPageURL);
    let versionVal = GetURLParameter("version", sPageURL);
    let typeVal = GetURLParameter("type", sPageURL);

    let idVal = GetURLParameter("mid", sPageURL);
    // let id = vinVal + "-" + typeVal; // todo
    const checklistvaluesHandle = Meteor.subscribe('checklistvalues.oneChecklist', idVal);
    const checklisttemplatesHandle = Meteor.subscribe('checklisttemplates');
    const locationsHandle = Meteor.subscribe('locations');
    const dealersHandle = Meteor.subscribe('dealers');
    const vehicletypesHandle = Meteor.subscribe('vehicletypes');
    const propdataHandle = Meteor.subscribe('propdata');

    const {vin} = {params};

    let aUser = Meteor.user();
    let userReady = (!(typeof aUser === 'undefined'));
    // console.log("aUser " + JSON.stringify(aUser));
    let currentUserName = userReady ? (aUser == null ? "not logged in" :
        (aUser.profile.first + " " + aUser.profile.last) + " ( " + aUser.username + " )") : "user not ready";
    let currentUserId = userReady ? (aUser == null ? "not logged in" :
        ///*aUser.name*/
        aUser._id) : "user not ready";
    let currentDealer = userReady ? (aUser == null ? "" :
        aUser.profile.dealer) : "";
    let currentRole = userReady ? (aUser == null ? "" :
        aUser.profile.role) : "";
    let currentCompany = userReady ? (aUser == null ? "" :
        aUser.profile.company) : "";

    let currentPdiApproved = userReady ? (aUser == null ? false :
        aUser.profile.pdiApproved) : false;

    let isImporter = false;
    if (currentDealer.length > 0 && dealersHandle.ready()) {
        let dealer = Dealers.findOne({"dealer": currentDealer});
        isImporter = (dealer && dealer.Importer && dealer.Importer == 1) ? true : false;
    }

    let chValues = [];
    let dealerName = "";
    let modelName = "";
    let bodyType = "SUV";

    if (checklistvaluesHandle.ready()) {
        chValues = ChecklistValues.find({
            'id': idVal
        }).fetch();


        if (chValues && chValues.length > 0 && chValues[0]) {
            dealerName = chValues[0].dealerName;
            modelName = chValues[0].modelName;

            if (modelName && vehicletypesHandle.ready()) {

                // console.log("VehicleTypes.find query " + JSON.stringify({"modelName": modelName}));
                let vehicletypes = VehicleTypes.find({"modelName": modelName}).fetch();
                // console.log("VehicleTypes.find vehicletype " + JSON.stringify(vehicletypes));
                if (vehicletypes && vehicletypes.length > 0) {
                    bodyType = vehicletypes[0].bodyType ? vehicletypes[0].bodyType : bodyType;
                }
                // console.log("VehicleTypes.find bodyType " + JSON.stringify(bodyType));

            }
        }
    }

    let serverName = "";
    if (propdataHandle.ready()) {

        propsData = PropData.find({"type": "servername"}).fetch();
        // console.log("props: " + JSON.stringify(propsData));
        serverName = propsData && propsData.length > 0 ? propsData[0].prop : "";
    }

    // console.log("CheckListContainer: " + JSON.stringify(propsData));
    // console.log("CheckListContainer: dealer name " + JSON.stringify(dealerName));
    return {
        currentuserid: currentUserId,
        currentusername: currentUserName,
        currentrole: currentRole,
        currentcompany: currentCompany,
        currentdealer: currentDealer,
        isImporter: isImporter,
        currentpdiapproved: currentPdiApproved,
        checklisttype: typeVal,
        checklistversion: versionVal,
        //  checklistid: id,

        readyData: checklistvaluesHandle.ready() && checklisttemplatesHandle.ready() && locationsHandle.ready()
        && propdataHandle.ready() && vehicletypesHandle.ready(),
        readyUser: userReady,
        checklistvalues: ChecklistValues.find({
            'id': idVal
        }).fetch(),
        checklisttemplates: ChecklistTemplates.find({
            'checklisttype': typeVal,
            'version': versionVal
        }).fetch(),
        locations: Locations.find({
            'dealer': dealerName
        }).fetch(),
        bodyType: bodyType,
        propvalues: PropData.find({"type": "servername"}).fetch(),
        servername: serverName
    };
}, CheckList);
