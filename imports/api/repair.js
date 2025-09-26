import {Meteor} from 'meteor/meteor';
import {ChecklistMains} from './checklistmains.js';
import {ChecklistValues} from './checklistvalues.js';
import {Dealers} from './dealers.js';
import {LostDataAfterPhotoProblem} from './lostdataafterphotoproblem.js';
import {CheckForDealerChangedWrongly} from './checkfordealerchangedwrongly.js';
import {Vehicles} from './vehicles.js';

function shortDateString(dd) {
    let options = {
        year: "numeric", month: "2-digit",
        day: "2-digit"
    };
    let formattedDate = dd.toLocaleTimeString("en-NZ", options);
    let shortDate = formattedDate.substr(6, 4) + formattedDate.substr(3, 2) + formattedDate.substr(0, 2);
    // console.log("shortDate " + shortDate);
    return shortDate;
}

Meteor.methods({
    'repair.hallo': function (str) {
        console.log(" H A L L O  ---" + str);
        return {"result": str};
    },
    'repair.addLastEditUserDealer'(currentUserId, currentUserName, currentRole,
                                   currentCompany, currentDealer) {
        let updatingField = "lastEditUserDealer";
        let counter = {};
        counter[updatingField] = 0;

        // console.log("checklistvalues.repairDbfields");
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

        console.log("repair.addLastEditUserDealer checklistvalues " + JSON.stringify(query));
        let vals = ChecklistValues.find(query).fetch();

        if (vals) {
            console.log("repair.addLastEditUserDealer checklistvalues num " + vals.length);
            vals.forEach(function (vv) {
                // console.log("repair.addLastEditUserDealer  vin " + vv.vin);
                if (Meteor.isServer) {
                    if (!vv.lastEditUserDealer) {
                        // get dealer from user
                        let updateSet = {};
                        updateSet[updatingField] = "undefined";

                        let foundUser = Meteor.users.findOne({"_id": vv.lastEditUserId});
                        if (foundUser && foundUser.profile && foundUser.profile.dealer) {
                            updateSet[updatingField] = foundUser.profile.dealer;

                            counter[updatingField]++;
                            ChecklistValues.upsert({"_id": vv._id}, {$set: updateSet}, function (err, res) {
                                if (err) {
                                    console.log("Error at Checklistvalues update" + JSON.stringify(err.message));
                                } else {
                                    // console.log("repair.addLastEditUserDealer", JSON.stringify(res));
                                }
                            });
                            ChecklistMains.upsert({"mid": vv.id}, {$set: updateSet}, function (err, res) {
                                if (err) {
                                    console.log("Error at Checklistmains update" + JSON.stringify(err.message));
                                } else {
                                    // console.log("repair.addLastEditUserDealer", JSON.stringify(res));
                                }
                            });
                        }
                    }
                }
                // return true;
            });
        }
        query["lastEditUserName"] = "--";
        let mains = ChecklistMains.find(query).fetch();
        counter[updatingField] = 0;
        if (mains) {
            console.log("repair.addLastEditUserDealer checklistmains num " + mains.length);
            mains.forEach(function (mm) {
                // console.log("repair.addLastEditUserDealer  vin " + vv.vin);
                if (Meteor.isServer) {
                    if (!mm.lastEditUserDealer) {
                        // get dealer from user
                        let updateSet = {};
                        updateSet[updatingField] = "--";

                        counter[updatingField]++;

                        ChecklistMains.upsert({"_id": mm._id}, {$set: updateSet}, function (err, res) {
                            if (err) {
                                console.log("Error at Checklistmains update" + JSON.stringify(err.message));
                            } else {
                                // console.log("repair.addLastEditUserDealer", JSON.stringify(res));
                            }
                        });

                    }
                }
                // return true;
            });
        }
        console.log("repair.addLastEditUserDealer UPDATE field:" + updatingField + " times:  " + JSON.stringify(counter));
    },
    'repair.repairDealerName'(currentUserId, currentUserName, currentRole,
                              currentCompany, currentDealer) {
        let updatingField = "dealerName";
        let counter = {};
        counter[updatingField] = 0;

        // console.log("checklistvalues.repairDbfields");
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

        console.log("repair.repairDealerName checklistvalues " + JSON.stringify(query));
        let vals = ChecklistValues.find(query).fetch();

        if (vals) {
            console.log("repair.repairDealerName checklistvalues num " + vals.length);
            vals.forEach(function (vv) {
                // console.log("repair.repairDealerName  vin " + vv.vin);
                if (Meteor.isServer) {
                    let foundDealer = Dealers.findOne({"Incadea Dealer Code": vv.dealer});

                    if (foundDealer && foundDealer.dealer) {
                        let updateSet = {};
                        updateSet[updatingField] = foundDealer.dealer;

                        counter[updatingField]++;
                        ChecklistValues.upsert({"_id": vv._id}, {$set: updateSet}, function (err, res) {
                            if (err) {
                                console.log("Error at Checklistvalues update" + JSON.stringify(err.message));
                            } else {
                                // console.log("repair.repairDealerName", JSON.stringify(res));
                            }
                        });
                        ChecklistMains.upsert({"mid": vv.id}, {$set: updateSet}, function (err, res) {
                            if (err) {
                                console.log("Error at Checklistmains update" + JSON.stringify(err.message));
                            } else {
                                // console.log("repair.addLastEditUserDealer", JSON.stringify(res));
                            }
                        });
                    }

                }
                // return true;
            });
        }
        console.log("repair.repairDealerName UPDATE field:" + updatingField + " times:  " + JSON.stringify(counter));

        query["lastEditUserName"] = "--";
        let mains = ChecklistMains.find(query).fetch();
        counter[updatingField] = 0;
        if (mains) {
            console.log("repair.repairDealerName checklistmains num " + mains.length);
            mains.forEach(function (mm) {
                // console.log("repair.addLastEditUserDealer  vin " + mm.vin);
                if (Meteor.isServer) {
                    let foundDealer = Dealers.findOne({"Incadea Dealer Code": mm.dealer});

                    if (foundDealer && foundDealer.dealer) {
                        let updateSet = {};
                        updateSet[updatingField] = foundDealer.dealer;

                        counter[updatingField]++;
                        ChecklistValues.upsert({"_id": mm._id}, {$set: updateSet}, function (err, res) {
                            if (err) {
                                console.log("Error at Checklistvalues update" + JSON.stringify(err.message));
                            } else {
                                // console.log("repair.repairDealerName", JSON.stringify(res));
                            }
                        });
                        ChecklistMains.upsert({"mid": mm.id}, {$set: updateSet}, function (err, res) {
                            if (err) {
                                console.log("Error at Checklistmains update" + JSON.stringify(err.message));
                            } else {
                                // console.log("repair.addLastEditUserDealer", JSON.stringify(res));
                            }
                        });
                    }

                }
                // return true;
            });
        }
        console.log("repair.repairDealerName UPDATE field:" + updatingField + " times:  " + JSON.stringify(counter));
    },
    'repair.lostDataAfterPhotoProblem'(currentUserId, currentUserName, currentRole, currentCompany, currentDealer) {

        // repair Rama's or others checklists when the signature was lost
        // checks' OKs must be added by hand
        //
        // result - checklist is technician submitted
        //
        // read Collection LostDataAfterPhotoProblem, relevant fields:
        //
        // vinCopyFrom  -- vin where a signature of the technician is stored
        // vin -- vin of the repaired in status "ready to submit"
        // typePrefix start of checklisttype
        // updatedAt -- day the checklist was updated last is taken as signature time
        // techDealer -- dealer who had done the check
        // make
        // status == "ready to submit"

        // use fileds from vinCopyFrom-document in checklistmains
        // signaturePic
        // techDateSigned - from updatedAt in Collection LostDataAfterPhotoProblem
        // techUserName
        // lastEditUserDealer - from techDealer in Collection LostDataAfterPhotoProblem
        //

        // in checklistmains - changes made are on fields
        // signaturePic
        // techDateSigned - from updatedAt in Collection LostDataAfterPhotoProblem
        // techUserName
        // lastEditUserDealer - from techDealer in Collection LostDataAfterPhotoProblem
        //
        //


        let updatingField = "signaturePic";
        let counter = {};
        counter[updatingField] = 0;

        // --

        // console.log("checklistvalues.repairDbfields");
        var query = {};
        if (currentUserName != "upload" || currentRole != "Admin System") {
            query.dontfindanything = "YES";
        }
        if (currentCompany != "ALL") {
            query.make = currentCompany;
        }

        console.log("repair.lostDataAfterPhotoProblem " + JSON.stringify(query));
        let vinCopyFrom = "";
        let copyFromMains = {};

        let vals = LostDataAfterPhotoProblem.find(query).fetch();

        if (vals) {
            console.log("repair.lostDataAfterPhotoProblem " + vals.length);
            vals.forEach(function (vv) {
                // console.log("repair.repairDealerName  vin " + vv.vin);
                if (Meteor.isServer) {

                    // read data to use for repair from existing checklistmains document
                    if (vv.vinCopyFrom != vinCopyFrom) {
                        vinCopyFrom = vv.vinCopyFrom;

                        copyFromMains = {};

                        // vin -- vin of the repaired in status "ready to submit"
                        // updatedAt -- day the checklist was updated last is taken as signature time
                        // techDealer -- dealer who had done the check
                        // make

                        console.log("repair.lostDataAfterPhotoProblem new copyfrom " + JSON.stringify({"vin": vinCopyFrom, "status": "technician submitted"}));

                        let mains = ChecklistMains.find({"vin": vinCopyFrom, "status": {$regex: "submitted"}}).fetch();
                        //console.log("repair.lostDataAfterPhotoProblem mains " + JSON.stringify(mains));
                        if (mains && mains.length > 0) {
                            // console.log("repair.lostDataAfterPhotoProblem mains[0] " + JSON.stringify(mains[0]));
                        }
                        if (!(mains && mains.length > 0 && mains[0].techUserName && mains[0].vin
                                && mains[0].signaturePic)) {
                            copyFromMains = {"found": 0};
                        } else {
                            // console.log("repair.lostDataAfterPhotoProblem mains[0] " + JSON.stringify(mains[0]));
                            copyFromMains = {
                                "found": 1,
                                "signaturePic": mains[0].signaturePic,
                                "techUserName": mains[0].techUserName,
                                "vin": mains[0].vin,
                                // "updatedAt": mains[0].updatedAt,
                                // "techDealer": mains[0].techDealer
                            }
                        }
                    }

                    if (copyFromMains.found == 0) {
                        // not found the copyFrom document - put error
                        LostDataAfterPhotoProblem.update({_id: vv._id}, {$set: {"Error in repair.lostDataAfterPhotoProblem": "Model document not found in checklistmains"}});
                    } else {

                        let queryObject = {
                            "vin": vv.vin,
                            "checklisttype": {$regex: "^" + vv.typePrefix},
                            "status": "ready to submit"
                        };

                        let setObject = {
                            "signaturePic": copyFromMains.signaturePic,
                            "techUserName": copyFromMains.techUserName,
                            "techDateSigned": new Date(vv.updatedAt),
                            "lastEditUserDealer": vv.techDealer,
                            "status": "technician submitted",
                            "repairedByIB4T": 1

                        };

                        // console.log("repair.lostDataAfterPhotoProblem query " + JSON.stringify(queryObject));
                        // console.log("repair.lostDataAfterPhotoProblem setObject " + JSON.stringify(setObject));

                        counter[updatingField]++;
                        ChecklistMains.update(queryObject, {$set: setObject});
                        ChecklistValues.update(queryObject, {$set: setObject});

                        LostDataAfterPhotoProblem.remove({_id: vv._id});
                    }


                }
                // return true;
            });
        }
        console.log("repair.lostDataAfterPhotoProblem FINISHED updated num " + JSON.stringify(counter));
    },
    'repair.checkForDealerChangedWrongly'(currentUserId, currentUserName, currentRole, currentCompany, currentDealer) {
        let checkedField = "dealer";
        let counter = {};
        counter[checkedField] = 0;

        // --

        // console.log("repair.checkForDealerChangedWrongly");
        var query = {};
        if (currentUserName != "upload" || currentRole != "Admin System") {
            query.dontfindanything = "YES";
        }
        if (currentCompany != "ALL") {
            query.make = currentCompany;
        }


        let vehs = Vehicles.find(query).fetch();
        if (vehs) {
            /// !! leave log in
            console.log("repair.checkForDealerChangedWrongly num in vehicles " + JSON.stringify(vehs.length));
        }
        if (vehs) {
            vehs.forEach(function (vehicle) {
                // console.log("repair.checkForDealerChangedWrongly  -- checking  VIN " + JSON.stringify(vehicle.vin));

                // search for VIN and checklisttypegroup=PDI in checklistmains
                query["lastEditUserName"] = "--";
                let mains = ChecklistMains.find({"vin":vehicle.vin, "checklisttypegroup":"PDI"}).fetch();


                // compare dealerName == dealerName and "Dealer Request Code" == dealer

                if (mains && mains.length > 0 && (vehicle.dealerName != mains[0].dealerName || vehicle["Dealer Request Code"] != mains[0].dealer)) {
                    // different write into
                    // console.log("DIFFERENT vin " + vehicle.vin + " dealer name: " + vehicle.dealerName + " != mains " + mains[0].dealerName);
                    //console.log("DIFFERENT vin " + vehicle.vin + " dealer code: " + vehicle["Dealer Request Code"] + " != mains " + mains[0].dealer);
                    counter[checkedField]++;
                    counter[mains[0].dealer] = mains[0].dealer ? 1 : mains[0].dealer + 1;
                    let nameSame = vehicle.dealerName == mains[0].dealerName
                    CheckForDealerChangedWrongly.upsert({"vin":vehicle.vin, "checklisttypegroup":"PDI"},
                        {"vin":vehicle.vin, "checklisttypegroup":"PDI", "dealerName": vehicle.dealerName, "Dealer Request Code":vehicle["Dealer Request Code"],
                            "WRONGdealerName": mains[0].dealerName, "WRONGdealer": mains[0].dealer,
                            "status": mains[0].status,
                            "smanUserName": mains[0].smanUserName,
                            "techUserName": mains[0].techUserName,
                            "lastUserName": mains[0].lastUserName,
                            "nameSame": nameSame})

                }



            });
        }

    }

});
