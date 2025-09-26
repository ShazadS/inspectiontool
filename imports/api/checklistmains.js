import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {ChecklistValues} from './checklistvalues.js';
import {Vehicles} from './vehicles.js';

export const ChecklistMains = new Mongo.Collection('checklistmains');

if (Meteor.isServer) {

    // ChecklistMains._ensureIndex({"checklisttypegroup":"text",
    //     "vin": "text",
    //     "vinLast": "text",
    //     "status": "text",
    //     "make": "text",
    //     "dealerName":"text"}
    //     );
    // ChecklistMains.createIndex({
    //     '_id': 1
    // });
    // ChecklistMains.createIndex({
    //     'id': 1
    // });
    //
    // ChecklistMains.createIndex({
    //     'checklisttypegroup': 1,
    //     "vinLast": 1,
    //     "status": 1
    // });
    // ChecklistMains.createIndex({
    //     'checklisttypegroup': 1,
    //     "vin": 1,
    //     "status": 1
    // });
    // ChecklistMains.createIndex({
    //     'checklisttypegroup': 1,
    //     "vinLast": 1,
    //     "status": 1,
    //     "make": 1
    // });
    // ChecklistMains.createIndex({
    //     'checklisttypegroup': 1,
    //     "vin": 1,
    //     "status": 1,
    //     "make": 1
    // });
    // ChecklistMains.createIndex({
    //     'checklisttypegroup': 1,
    //     "vinLast": 1,
    //     "status": 1,
    //     "dealerName": 1
    // });
    // ChecklistMains.createIndex({
    //     'checklisttypegroup': 1,
    //     "vin": 1,
    //     "status": 1,
    //     "dealerName": 1
    // });
    // ChecklistMains.createIndex({
    //     'checklisttypegroup': 1,
    //     "vinLast": 1,
    //     "status": 1,
    //     "dealerName": 1,
    //     "make": 1
    // });
    // ChecklistMains.createIndex({
    //     'checklisttypegroup': 1,
    //     "vin": 1,
    //     "status": 1,
    //     "dealerName": 1,
    //     "make": 1
    // });
    //
    // // FOR open Checklist
    // ChecklistMains.createIndex({
    //     'checklisttype': 1,
    //     "vin": 1,
    //     "version": 1
    // });


    //  Meteor.publish('checklistmains', function checklistmainsPublication() {
    //     return ChecklistMains.find({
    //         $or: [
    //             {private: {$ne: true}},
    //             {owner: this.userId},
    //         ],
    //     });
    // });
    // Meteor.publish('checklistmains.perQuery', function checklistmainsPublication(query) {
    //     return ChecklistMains.find(query);
    // });
    // Meteor.publish('checklistmains.perQueryOverview', function checklistmainsOverviewPublication(query) {
    //     return ChecklistMains.find(query);
    // });
}

function shortDateNZFormat(dd) {
    // console.log("shortDate " + (typeof dd));
    if ((typeof dd) == "string") {
        return dd;
    }
    let options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    };
    let formattedDate = dd.toLocaleTimeString("en-NZ", options);
    let shortDate =  formattedDate.substr(3, 2) +'-'+ formattedDate.substr(0, 2)+'-'+formattedDate.substr(6, 4);
    return shortDate;
}



function shortDateString(dd) {
    // console.log("shortDate " + (typeof dd));
    if ((typeof dd) == "string") {
        return dd;
    }
    let options = {
        year: "numeric", month: "2-digit",
        day: "2-digit"
    };
    let formattedDate = dd.toLocaleTimeString("en-NZ", options);
    let shortDate = formattedDate.substr(6, 4) + formattedDate.substr(3, 2) + formattedDate.substr(0, 2);
    // console.log("shortDate " + shortDate);
    return shortDate;
}

function getUserName(str) {

    let endOfName = str.lastIndexOf("(");
    return str.substr(0, endOfName);
}

Meteor.methods({
    'checklistmains.hallo'() {
        console.log(" H A L L O");
    },
    'checklistmains.findVehicles': function (param) {
        // console.log("checklistmains.findVehicles " + JSON.stringify(param));
        // console.log("checklistmains.findVehicles fullVinQuery" + JSON.stringify(param.fullVinQuery));

        let selectForTechnician = false; // param.searchPending && !param.searchTSubmitted && !param.searchSSubmitted;
        let chks = [];
        if (!(selectForTechnician && param.searchVin.length != 6)) {
            chks = ChecklistMains.find(param.query, {"limit": 30}).fetch();
            let num = chks ? chks.length : 0;
            // console.log("checklistmains.findVehicles num " + num);
        }
        if (!chks || chks.length == 0) {
            // search with full vin, no restrictions on same dealer only
            // console.log("search full  " + JSON.stringify(fullVinQuery));
            chks = ChecklistMains.find(param.fullVinQuery, {"limit": 30}).fetch();
            // console.log("ckecks found num full " + chks.length);
        }
        if (chks) {
            chks.forEach(function (cc) {
                cc.VIN = cc.vin;
                cc["Model Name"] = cc.modelName;
                cc["Status"] = cc.status;
                cc["Technician"] = cc.techUserName ? getUserName(cc.techUserName) : "";
                cc["Service Manager"] = cc.smanUserName ? getUserName(cc.smanUserName) : "";
                //cc["Date Approved"] = cc.smanDateSigned ? shortDateString(cc.smanDateSigned) : "";
                cc["Date Approved"] = cc.smanDateSigned ? shortDateNZFormat(cc.smanDateSigned) : "";
                cc["Dealer"] = cc.lastEditUserDealer && cc.lastEditUserDealer.length > 2 ? cc.lastEditUserDealer : (cc.dealerName ? cc.dealerName : "");
            })
        }
        return chks;
    },
    'checklistmains.findOne': function (query) {
        // console.log("checklistmains.findOne");
        let chk = ChecklistMains.findOne(query);
        return chk;
    },
    'checklistmains.findChecklists100': function (query) {
        // console.log("checklistmains.findChecklists100 " + JSON.stringify(query));
        let chks = ChecklistMains.find(query, {"limit": 100}).fetch();
        let checklistdata = [];
        chks.forEach(function (chk) {

            var options = {
                // weekday: "short",
                year: "numeric", month: "short",
                day: "numeric"// , hour: "2-digit", minute: "2-digit"
            };
        			
			let techDateSignedStr = (typeof chk.techDateSigned === null ) ? '' : shortDateNZFormat(chk.techDateSigned);
			let smanDateSignedStr = (typeof chk.smanDateSigned === null ) ? "" : shortDateNZFormat(chk.techDateSigned);
			
            let check = {
                "_id": chk._id,
                "Dealer": chk.lastEditUserDealer ? chk.lastEditUserDealer : "",
                "VIN": chk.vin ? chk.vin : "",
                "Submitted Date": (chk.status == "technician submitted") ? "" + techDateSignedStr : "" + smanDateSignedStr,
                "Status": (chk.status == "technician submitted") ? "Waiting Approval" : "Approved",
                "Service Manager": chk.smanUserName ? getUserName(chk.smanUserName) : "",
                "Technician": chk.techUserName ? getUserName(chk.techUserName) : ""
            };
            checklistdata.push(check);
        });
        // console.log("checklistmains.findChecklists100 checklistdata " + JSON.stringify(checklistdata));
        return checklistdata;
    },
    'checklistmains.addChecklistmains'(currentUserId, currentUserName, currentRole,
                                       currentCompany, currentDealer) {
        console.log("checklistmains.addChecklistmains");
        var query = {};
        if (currentUserName != "upload" || currentRole != "Admin System") {
            query.dontfindanything = "YES";
        }
        if (currentCompany != "ALL") {
            query.make = currentCompany;
        }
        if (currentDealer != "ALL") {
            query.dealerName = currentDealer;
        }

        console.log("checklistmains.addChecklistmains" + JSON.stringify(query));
        let vals = ChecklistValues.find(query).fetch();

        if (vals) {
            console.log("checklistmains.addChecklistmains  num " + vals.length);
            vals.forEach(function (vv) {
                let dateShort = shortDateString(vv.updatedAt);
                let query_object = {
                    'id': vv.checklisttypegroup + dateShort + vv.vin + "000"
                };
                let mains_object = {
                    "mid": vv._id,
                    "checklisttypegroup": vv.checklisttypegroup,
                    "checklisttype": vv.checklisttype,
                    "version": vv.version,
                    "vin": vv.vin,
                    "vinLast": vv.vinLast,
                    "vinLast3": vv.vinLast.substr(0, 3),
                    "vinLast4": vv.vinLast.substr(0, 4),
                    "vinLast5": vv.vinLast.substr(0, 5),
                    "rego": vv.rego ? vv.rego : "",
                    "make": vv.make,
                    "modelName": vv.modelName,
                    "colour": vv.colour,
                    "keyNo": vv.keyNo ? vv.keyNo : "",
                    "dealer": vv.dealer,
                    "dealerName": vv.dealerName,
                    "lastEditUserName": vv.lastEditUserName,
                    "lastEditUserId": vv.lastEditUserId,
                    "status": vv.status,
                    "createAt": vv.createdAt,
                    "updatedAt": vv.updatedAt,
                    "numDone": vv.numDone,
                    "techDateSigned": vv.techDateSigned,
                    "techUserName": vv.techUserName,
                    "smanDateSigned": vv.smanDateSigned,
                    "smanUserName": vv.smanUserName
                };
                if (Meteor.isServer) {
                    ChecklistMains.upsert(query_object, {$set: mains_object}, function (err, res) {
                        if (err) {
                            console.log("Error at ChecklistMains update" + mains_object["checklisttypegroup"])
                        } else {
                            // console.log("checklistmains.addChecklisttypegroup", JSON.stringify(res));

                            let query_objectH = {
                                'id': "H100" + "none" + vv.vin + "000"
                            };

                            mains_object["mid"] = "";
                            mains_object["checklisttypegroup"] = "H100";
                            mains_object["checklisttype"] = "H-Promise";
                            mains_object["version"] = "--";
                            mains_object["lastEditUserName"] = "--";
                            mains_object["lastEditUserId"] = "--";
                            mains_object["status"] = "No H100 Check done yet";
                            mains_object["createAt"] = "--";
                            mains_object["updatedAt"] = "--";
                            mains_object["numDone"] = "--";
                            mains_object["techDateSigned"] = "--";
                            mains_object["techUserName"] = "--";
                            mains_object["smanDateSigned"] = "--";
                            mains_object["smanUserName"] = "--";
                            ChecklistMains.upsert(query_objectH, {$set: mains_object}, function (err, res) {
                                if (err) {
                                    console.log("Error at ChecklistMains update" + mains_object["checklisttypegroup"])
                                } else {
                                    // console.log("checklistmains.addChecklisttypegroup", JSON.stringify(res));

                                    let query_objectLS = {
                                        'id': "LS" + "none" + vv.vin + "000"
                                    };
                                    mains_object["checklisttypegroup"] = "LS";
                                    mains_object["checklisttype"] = "--";
                                    mains_object["status"] = "No LS Check done yet";

                                    ChecklistMains.upsert(query_objectLS, {$set: mains_object}, function (err, res) {
                                        if (err) {
                                            console.log("Error at ChecklistMains update" + mains_object["checklisttypegroup"])
                                        } else {
                                            // console.log("checklistmains.addChecklisttypegroup", JSON.stringify(res));
                                        }
                                    });
                                }
                            });
                        }
                    });

                }
            });
        }
    },

    'checklistmains.addChecklistmainsH100'(currentUserId, currentUserName, currentRole,
                                           currentCompany, currentDealer) {
        console.log("checklistmains.addChecklistmainsH100");
        var query = {};
        if (currentUserName != "upload" || currentRole != "Admin System") {
            query.dontfindanything = "YES";
        }
        if (currentCompany != "ALL") {
            query.make = currentCompany;
        }
        if (currentDealer != "ALL") {
            query.dealerName = currentDealer;
        }

        console.log("checklistmains.addChecklistmainsH100" + JSON.stringify(query));
        let vals = ChecklistValues.find(query).fetch();

        if (vals) {
            console.log("checklistmains.addChecklistmainsH100  num " + vals.length);
            vals.forEach(function (vv) {
                let dateShort = shortDateString(vv.updatedAt);
                let query_object = {
                    'id': vv.checklisttypegroup + dateShort + vv.vin + "000"
                };
                let mains_object = {
                    "mid": vv._id,
                    "checklisttypegroup": vv.checklisttypegroup,
                    "checklisttype": vv.checklisttype,
                    "version": vv.version,
                    "vin": vv.vin,
                    "vinLast": vv.vinLast,
                    "vinLast3": vv.vinLast.substr(0, 3),
                    "vinLast4": vv.vinLast.substr(0, 4),
                    "vinLast5": vv.vinLast.substr(0, 5),
                    "rego": vv.rego ? vv.rego : "",
                    "make": vv.make,
                    "modelName": vv.modelName,
                    "colour": vv.colour,
                    "keyNo": vv.keyNo ? vv.keyNo : "",
                    "dealer": vv.dealer,
                    "dealerName": vv.dealerName,
                    "lastEditUserName": vv.lastEditUserName,
                    "lastEditUserId": vv.lastEditUserId,
                    "status": vv.status,
                    "createAt": vv.createdAt,
                    "updatedAt": vv.updatedAt,
                    "numDone": vv.numDone,
                    "techDateSigned": vv.techDateSigned,
                    "techUserName": vv.techUserName,
                    "smanDateSigned": vv.smanDateSigned,
                    "smanUserName": vv.smanUserName
                };
                if (Meteor.isServer) {
                    //ChecklistMains.upsert(query_object, {$set: mains_object}, function (err, res) {
                    //    if (err) {
                    //        console.log("Error at ChecklistMains update" + mains_object["checklisttypegroup"])
                    //    } else {
                    // console.log("checklistmains.addChecklisttypegroup", JSON.stringify(res));

                    let query_objectH = {
                        'id': "H100" + "none" + vv.vin + "000"
                    };

                    mains_object["mid"] = "";
                    mains_object["checklisttypegroup"] = "H100";
                    mains_object["checklisttype"] = "H-Promise";
                    mains_object["version"] = "--";
                    mains_object["lastEditUserName"] = "--";
                    mains_object["lastEditUserId"] = "--";
                    mains_object["status"] = "No H100 Check done yet";
                    mains_object["createAt"] = "--";
                    mains_object["updatedAt"] = "--";
                    mains_object["numDone"] = "--";
                    mains_object["techDateSigned"] = "--";
                    mains_object["techUserName"] = "--";
                    mains_object["smanDateSigned"] = "--";
                    mains_object["smanUserName"] = "--";
                    ChecklistMains.upsert(query_objectH, {$set: mains_object}, function (err, res) {
                        if (err) {
                            console.log("Error at ChecklistMainsH100 update" + mains_object["checklisttypegroup"])
                        } else {
                            // console.log("checklistmains.addChecklisttypegroup", JSON.stringify(res));

                            let query_objectLS = {
                                'id': "LS" + "none" + vv.vin + "000"
                            };
                            mains_object["checklisttypegroup"] = "LS";
                            mains_object["checklisttype"] = "--";
                            mains_object["status"] = "No LS Check done yet";

                            ChecklistMains.upsert(query_objectLS, {$set: mains_object}, function (err, res) {
                                if (err) {
                                    console.log("Error at ChecklistMainsH100 update" + mains_object["checklisttypegroup"])
                                } else {
                                    // console.log("checklistmains.addChecklisttypegroup", JSON.stringify(res));
                                }
                            });
                        }
                    });

                }
            });
        }
    },
    'checklistmains.addChecklistmainsLS'(currentUserId, currentUserName, currentRole,
                                         currentCompany, currentDealer) {
        console.log("checklistmains.addChecklistmainsLS");
        let counter = 0;
        let checklisttypegroup = "LS";
        let query = {};
        if (currentUserName != "upload" || currentRole != "Admin System") {
            query.dontfindanything = "YES";
        }
        if (currentCompany != "ALL") {
            query.make = currentCompany;
        }
        if (currentDealer != "ALL") {
            query.dealerName = currentDealer;
        }

        // query["checklisttypegroup"] = "PDI";
        console.log("checklistmains.addChecklistmainsLS" + JSON.stringify(query));
        if (Meteor.isServer) {
            let vehicleRecord;
            do {
                vehicleRecord = Vehicles.findOne({"LStype": {$exists: 0}});

                if (vehicleRecord && vehicleRecord.vin && vehicleRecord.vin.length > 0) {
                    // check if LS exists
                    let mainsRecord = ChecklistMains.findOne({"vin": vehicleRecord.vin, "checklisttype": "LS"});

                    if (mainsRecord) {

                        Vehicles.upsert({"_id": vehicleRecord._id}, {$set: {"LStype": 1}}, function (err, res) {
                            if (err) {
                                console.log("Error at Vehicles update" + mains_object["checklisttypegroup"])
                            } else {

                            }
                        });

                    } else {
                        let today = new Date();
                        let dateShort = shortDateString(today);

                        let len = vehicleRecord["vin"].length;
                        let vinLast = "" + vehicleRecord["vin"].substr(len - 6, 6);
                        let mains_object = {
                            "vin": vehicleRecord.vin,
                            "vinLast": vinLast,
                            "vinLast3": vinLast.substr(0, 3),
                            "vinLast4": vinLast.substr(0, 4),
                            "vinLast5": vinLast.substr(0, 5),
                            "rego": vehicleRecord.rego ? vehicleRecord.rego : "",
                            "make": vehicleRecord.make,
                            "modelName": vehicleRecord.modelName,
                            "colour": vehicleRecord.colour,
                            "keyNo": vehicleRecord.keyNo ? vehicleRecord.keyNo : "",
                            "dealer": vehicleRecord.dealer,
                            "dealerName": vehicleRecord.dealerName
                        };

                        mains_object["mid"] = "";
                        mains_object["checklisttypegroup"] = "LS";
                        mains_object["checklisttype"] = "--";
                        mains_object["version"] = "--";
                        mains_object["lastEditUserName"] = "--";
                        mains_object["lastEditUserId"] = "--";
                        mains_object["status"] = "No LS Check done yet";
                        mains_object["createAt"] = "--";
                        mains_object["updatedAt"] = "--";
                        mains_object["numDone"] = "--";
                        mains_object["techDateSigned"] = "--";
                        mains_object["techUserName"] = "--";
                        mains_object["smanDateSigned"] = "--";
                        mains_object["smanUserName"] = "--";

                        let query_objectLS = {
                            'id': "LS" + "none" + vehicleRecord["vin"] + "000"
                        };
                        counter++;
                        ChecklistMains.upsert(query_objectLS, {$set: mains_object}, function (err, res) {
                            if (err) {
                                console.log("Error at ChecklistMainsLS update" + mains_object["checklisttypegroup"])
                            } else {
                                console.log("LS entered for VIN " + vehicleRecord.vin);
                            }
                        });
                        Vehicles.upsert({"_id": vehicleRecord._id}, {$set: {"LStype": 1}}, function (err, res) {
                            if (err) {
                                console.log("Error at Vehicles update" + mains_object["checklisttypegroup"])
                            } else {

                            }
                        });

                    }
                }
            } while (vehicleRecord && counter < 50000);
            console.log(" added " + counter + "LS Records")
        }
    }

    //  Meteor.call('checklistmains.correctChecklistmains', currentUserId, currentUser.username,
//         this.props.currentrole,
//     this.props.currentcompany, this.props.currentdealer);
// }
    ,
    'checklistmains.addChecklistmainsBody'(currentUserId, currentUserName, currentRole,
                                           currentCompany, currentDealer) {
        console.log("checklistmains.addChecklistmainsBody");
        let counter = 0;
        let checklisttypegroup = "Body";
        let query = {};
        if (currentUserName != "upload" || currentRole != "Admin System") {
            query.dontfindanything = "YES";
        }
        if (currentCompany != "ALL") {
            query.make = currentCompany;
        }
        if (currentDealer != "ALL") {
            query.dealerName = currentDealer;
        }

        // query["checklisttypegroup"] = "PDI";
        console.log("checklistmains.addChecklistmainsBody" + JSON.stringify(query));
        if (Meteor.isServer) {
            let vehicleRecord;
            do {
                vehicleRecord = Vehicles.findOne({"BODYtype": {$exists: 0}});

                if (vehicleRecord && vehicleRecord.vin && vehicleRecord.vin.length > 0) {
                    console.log("Body ------- for VIN " + vehicleRecord.vin);
                    // check if Body record exists
                    let mainsRecord = ChecklistMains.findOne({"vin": vehicleRecord.vin, "checklisttypegroup": "Body"});

                    if (mainsRecord) {

                        Vehicles.upsert({"_id": vehicleRecord._id}, {$set: {"BODYtype": 1}}, function (err, res) {
                            if (err) {
                                console.log("Error at Vehicles update" + mains_object["checklisttypegroup"])
                            } else {

                            }
                        });


                    } else {

                        let today = new Date();
                        let dateShort = shortDateString(today);

                        let len = vehicleRecord["vin"].length;
                        let vinLast = "" + vehicleRecord["vin"].substr(len - 6, 6);
                        let mains_object = {
                            "vin": vehicleRecord.vin,
                            "vinLast": vinLast,
                            "vinLast3": vinLast.substr(0, 3),
                            "vinLast4": vinLast.substr(0, 4),
                            "vinLast5": vinLast.substr(0, 5),
                            "rego": vehicleRecord.rego ? vehicleRecord.rego : "",
                            "make": vehicleRecord.make,
                            "modelName": vehicleRecord.modelName,
                            "colour": vehicleRecord.colour,
                            "keyNo": vehicleRecord.keyNo ? vehicleRecord.keyNo : "",
                            "dealer": vehicleRecord.dealer,
                            "dealerName": vehicleRecord.dealerName
                        };

                        mains_object["mid"] = "";
                        mains_object["checklisttypegroup"] = "Body";
                        mains_object["checklisttype"] = "Body";
                        mains_object["version"] = "--";
                        mains_object["lastEditUserName"] = "--";
                        mains_object["lastEditUserId"] = "--";
                        mains_object["status"] = "No Body Check done yet";
                        mains_object["createAt"] = "--";
                        mains_object["updatedAt"] = "--";
                        mains_object["numDone"] = "--";
                        mains_object["techDateSigned"] = "--";
                        mains_object["techUserName"] = "--";
                        mains_object["smanDateSigned"] = "--";
                        mains_object["smanUserName"] = "--";

                        let query_objectB = {
                            'id': "Body" + "none" + vehicleRecord["vin"] + "000"
                        };
                        counter++;
                        ChecklistMains.upsert(query_objectB, {$set: mains_object}, function (err, res) {
                            if (err) {
                                console.log("Error at addChecklistmainsBody update" + mains_object["checklisttypegroup"])
                            } else {
                                console.log("Body entered for VIN " + vehicleRecord.vin);
                            }
                        });
                        Vehicles.upsert({"_id": vehicleRecord._id}, {$set: {"BODYtype": 1}}, function (err, res) {
                            if (err) {
                                console.log("Error at Vehicles update" + mains_object["checklisttypegroup"])
                            } else {

                            }
                        });

                    }
                }
            } while (vehicleRecord && counter < 40000);
            console.log(" added " + counter + "Body Records")
        }
    }

    //  Meteor.call('checklistmains.correctChecklistmains', currentUserId, currentUser.username,
//         this.props.currentrole,
//     this.props.currentcompany, this.props.currentdealer);
// }
    ,

    'checklistmains.correctChecklistmains'(currentUserId, currentUserName, currentRole,
                                           currentCompany, currentDealer) {
        //console.log("checklistmains.correctChecklistmains");
        var query = {"checklisttypegroup": "PDI"};
        if (currentUserName != "upload" || currentRole != "Admin System") {
            query.dontfindanything = "YES";
        }
        if (currentCompany != "ALL") {
            query.make = currentCompany;
        }
        if (currentDealer != "ALL") {
            query.dealerName = currentDealer;
        }

        // console.log("checklistmains.correctChecklistmains" + JSON.stringify(query));
        let mains = ChecklistMains.find(query).fetch();

        if (mains) {
            // console.log("checklistmains.correctChecklistmains  num " + mains.length);


            mains.forEach(function (mm) {
                let query_values = {"_id": mm.mid};

                let update_values_object = {
                    "id": mm.id,
                };
                if (Meteor.isServer) {
                    ChecklistValues.upsert(query_values, {$set: update_values_object}, function (err, res) {
                        if (err) {
                            console.log("Error at checklistmains.correctChecklistmains-values upsert" + JSON.stringify(err));
                        } else {
                            let query_mains = {
                                _id: mm._id
                            };
                            ChecklistMains.upsert(query_mains, {$set: {"mid": mm.id}}, function (err, res) {
                                if (err) {
                                    console.log("Error at checklistmains.correctChecklistmains-mains upsert" + JSON.stringify(err));
                                } else {
                                    // console.log("checklistmains.addChecklisttypegroup", JSON.stringify(res));

                                }
                            });

                        }
                    });
                }
            });
        }
    },
    'checklistmains.getlastchecklists'(query) {
        if (Meteor.isServer) {
            pdi = ChecklistMains.aggregate(
                {$match: query}, //{"vinLast": {$regex: searchStrVin}, "status": {$in: statusList}},
                {$sort: {"updatedAt": 1}},
                {$group: {"_id": '$vin', 'result': {$last: "$updatedAt"}}}
            );
            return pdi;
        }
    },
    'checklistmains.atUpdatedString'(currentUserId, currentUserName, currentRole,
                                     currentCompany, currentDealer) {
        let counter = {"last update": 0};

        // console.log("checklistvalues.atUpdatedString");
        var query = {};
        if (currentUserName != "upload" || currentRole != "Admin System") {
            query.dontfindanything = "YES";
        }
        if (currentCompany != "ALL") {
            query.make = currentCompany;
        }
        if (currentDealer != "ALL") {
            query.dealerName = currentDealer;
        }

        // console.log("checklistvalues.atUpdatedString" + JSON.stringify(query));
        let vals = ChecklistMains.find(query).fetch();

        if (vals) {
            console.log("checklistmains.atUpdatedString  num " + vals.length);
            vals.forEach(function (vv) {
                console.log("checklistmains.atUpdatedString  vin " + vv.vin);
                if (Meteor.isServer) {

                    let query_object = {
                        '_id': vv._id
                    };
                    let newVal = _.omit(vv, "_id");
                    // console.log(JSON.stringify(newVal.updatedAt));
                    // console.log(newVal.updatedAt.toString()); // shows 'Invalid Date'
                    // console.log(typeof newVal.updatedAt); // shows 'object'
                    // console.log(newVal.updatedAt instanceof Date);
                    let lastUpdate = "";
                    if ((typeof newVal.updatedAt) == "string") {
                        lastUpdate = newVal.updatedAt;
                    } else {
                        var options = {
                            weekday: "short", year: "numeric", month: "short",
                            day: "numeric", hour: "2-digit", minute: "2-digit"
                        };
                        lastUpdate = newVal.updatedAt.toLocaleTimeString("en-NZ", options);
                    }
                    newVal["last update"] = lastUpdate;
                    counter["last update"]++;
                    ChecklistMains.upsert(query_object, {$set: newVal}, function (err, res) {
                        if (err) {
                            console.log("Error at Checklistvalues update" + JSON.stringify(err.message));
                        } else {
                            // console.log("checklistvalues.addChecklisttypegroup", JSON.stringify(res));
                        }
                    });
                }

                // return true;
            });
        }
        console.log("checklistmains.atUpdatedString updated " + JSON.stringify(counter));

    },
    'checklistmains.upperCaseMake'(currentUserId, currentUserName, currentRole,
                                   currentCompany, currentDealer) {
        let counter = {"make": 0};

        // console.log("checklistmains.upperCaseMake");
        var query = {};
        if (currentUserName != "upload" || currentRole != "Admin System") {
            query.dontfindanything = "YES";
        }
        if (currentCompany != "ALL") {
            query.make = currentCompany;
        }
        if (currentDealer != "ALL") {
            query.dealerName = currentDealer;
        }

        // console.log("checklistmains.atUpdatedString" + JSON.stringify(query));
        let vals = ChecklistMains.find(query).fetch();

        if (vals) {
            console.log("checklistmains.upperCaseMake  num " + vals.length);
            vals.forEach(function (vv) {
                // console.log("checklistmains.upperCaseMake  vin " + vv.vin);
                if (Meteor.isServer) {

                    let query_object = {
                        '_id': vv._id
                    };
                    let newVal = _.omit(vv, "_id");
                    // !!! HYUNDAI
                    // !!! HYUNDAI
                    // !!! HYUNDAI

                    if (!vv["make"]) {
                        vv["make"] = "HYUNDAI";
                    }
                    newVal["make"] = vv["make"].toUpperCase();
                    counter["make"]++;
                    ChecklistMains.upsert(query_object, {$set: newVal}, function (err, res) {
                        if (err) {
                            console.log("Error at ChecklistMains update" + JSON.stringify(err.message));
                        } else {

                        }
                    });
                }

            });
        }
        console.log("upperCaseMake updated " + JSON.stringify(counter));

    }
    ,
    'checklistmains.updatedallVersions'(currentUserId, currentUserName, currentRole,
                                        currentCompany, currentDealer) {
        let counter = {"version": 0};

        console.log("checklistmains.updatedallVersions");
        var query = {};
        if (currentUserName != "upload" || currentRole != "Admin System") {
            query.dontfindanything = "YES";
        }
        if (currentCompany != "ALL") {
            query.make = currentCompany;
        }
        if (currentDealer != "ALL") {
            query.dealerName = currentDealer;
        }

        // console.log("checklistvalues.atUpdatedString" + JSON.stringify(query));
        let vals = ChecklistMains.find(query).fetch();

        if (vals) {
            console.log("checklistmains.updatedallVersions  num " + vals.length);
            vals.forEach(function (vv) {
                // console.log("checklistvalues.updatedallVersions  vin " + vv.vin);
                if (Meteor.isServer) {

                    let query_object = {
                        '_id': vv._id
                    };
                    let newVal = _.omit(vv, "_id");
                    newVal["version"] = "Vers.1.0";
                    counter["version"]++;
                    ChecklistMains.upsert(query_object, {$set: {"version": "Vers.1.0"}}, function (err, res) {
                        if (err) {
                            console.log("Error at Checklistmains update" + JSON.stringify(err.message));
                        } else {
                            // console.log("checklistmains.updatedallVersions", JSON.stringify(res));
                        }
                    });
                }

                // return true;
            });
        }
        console.log("updatedallVersions updated " + JSON.stringify(counter));
    }


});