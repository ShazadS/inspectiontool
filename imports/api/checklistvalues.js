import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Match} from 'meteor/check'
import {ChecklistMains} from './checklistmains.js';
import {ChecklistTemplates} from './checklisttemplates.js';
import {VehicleTypes} from './vehicletypes.js';

//let coll = 0;
export const ChecklistValues = new Mongo.Collection('checklistvalues');

if (!Meteor.isServer) {

} else {
    // ChecklistValues._ensureIndex({
    //     'id': 1
    // });

    //    ChecklistValues._ensureIndex({"id": "text"});


    function getNewestVersionTemplate(tempList) {
        let newestTemplate = tempList && tempList.length > 0 ? tempList[0] : null;
        let newestVersion = "0000000";

        tempList.forEach(function (temp) {
            if (temp.version.toLowerCase().localeCompare(newestVersion) == -1) {
                newestTemplate = temp;
                newestVersion = temp.version.toLowerCase();
            }
        });
        return newestTemplate;
    }


    Meteor.publish('checklistvalues', function checklistvaluesPublication() {
        return ChecklistValues.find({
            $or: [
                {private: {$ne: true}},
                {owner: this.userId},
            ],
        });
    });

    Meteor.publish('checklistvalues.perQuery', function checklistvaluesPublication(query) {
        return ChecklistValues.find(query,
            {
                "checklisttypegroup": 1,
                "checklisttype": 1,
                "version": 1,
                "vin": 1,
                "rego": 1,
                "make": 1,
                "modelName": 1,
                "colour": 1,
                "keyNo": 1,
                "dealerName": 1,
                "lastEditUserName": 1,
                "lastUpdated": 1,
                "status": 1
            });
    });
    Meteor.publish('checklistvalues.oneChecklist', function checklistvaluesPublication(id) {

        return ChecklistValues.find({
            "id": id
        });
    });
}

export function checklistvaluesFind(query) {
    let checks = ChecklistValues.find(query).fetch();
    return checks;
}

function generateValueRecord(vehicle, elements, createdAt, generatedValues) {

    // *** 1 ***
    // == element example
    //     {
//         'type': 'name_short_display',
//         'headertype': 'text_display',
//         'labeltext': 'Checklist Type:',
//         'classNameLabel': 'X',
//         'className': 'col s12 m12 input-field',
//         'name': 'pdi00004',
//         'order': 4
//         , 'searchheader': 'Type'
//     }

// == value example
//        {'name': 'pdi00004', 'value': 'PDI', 'searchheader': 'PDI'}


// , {
//         'type': 'text_display',
//             'labeltext': 'Vers:',
//             'classNameLabel': 'X',
//             'className': 'col s12 m12 input-field',
//             'name': 'pdi00007',
//             'order': 7
//             , 'searchheader': 'Version'
//     }

//     {'name': 'pdi00007', 'value': 'Vers.0.1', 'searchheader': 'Vers.0.1'}
// ,


    // ** 3 ***
// , {
//         'type': 'simple_check',
//             'labeltext': 'Check Correct Wheel Nut Torque (90~110Nm)',
//             'classNameLabel': 'col m12 s23',
//             'className': 'col s12 m12 text-left',
//             'name': 'pdi00090',
//             'order': 90
//     }
//
    // {'name': 'pdi00090', 'value':
    //     [{'name': 'pdi00090na', 'na': 1, 'value': true
    //     }, {
    //         'name': 'pdi00090ok', 'ok': 1, 'value': false
    //     }, {
    //         'name': 'pdi00090adjusted', 'adjusted': 1, 'value': false
    //     }, {
    //         'name': 'pdi00090failed', 'failed': 1, 'value': false
    //     }]
    // }

    // console.log("generateValueRecord vehicle " + JSON.stringify(vehicle));
    // var parent = "";
    elements.forEach(function (ele) {

        if (ele.elements) {
            generateValueRecord(vehicle, ele.elements, createdAt, generatedValues);

        } else {
            var singleValue = {};

            switch (ele.type) {

                case "group_header":
                    // parent = ele.name;
                    break;
                case "empty_group_header":

                case "header_checklist":
                case "body_collapsable":
                case "group_headerfields":
                case "group_collapsable":
                case "end_group_collapsable":
                case "header_checklist":
                case "group_headerfields":
                case "end_group_headerfields":
                case 'name_short_display':
                case "text_input_20_len":
                case "number_display_4_len":
                case "number_display_6_len":
                case "select_vehicle_model":
                case "select_rego":

                    break;
                case "text_input_required":
                case "number_input_required":
                case "take_photo_required":
                    singleValue.required = true;

                case "text_display":
                case "text_last_user_display":
                case "text_last_dealer_display":
                case "text_approved_user_display":
                case "date_approved_display":
                case "status_display":
                case "ignore_element":
                case "id_display":
                case "status_display":
                case "text_display":

                case "date_input":
                case "date_display":
                case "comments":
                case "comments_display":
                case "glas_signature":
                case "location_select":
                case "end_body_collapsable":
                case "text_input": {
                    // console.log("generateValueRecord type: " + ele.type + "\nelement " + JSON.stringify(ele));
                    // console.log("generateValueRecord + name: " + ele.name);
                    // console.log("generateValueRecord dbfield " + ele.dbfield + " name: " + ele.name);
                    singleValue.name = ele.name;


                    // set Status first
                    if (ele.dbfield) {
                        // console.log("generateValueRecord dbfield " + ele.dbfield);
                        // console.log("generateValueRecord dbfield value " + vehicle[ele.dbfield]);
                        singleValue.value = vehicle[ele.dbfield] ? vehicle[ele.dbfield] : '';
                        singleValue.dbfield = ele.dbfield;
                    } else {
                        singleValue.value = '';
                    }

                    // console.log("generateValueRecord searchHeader " + JSON.stringify(ele["searchHeader"]));
                    if (ele["searchHeader"]) {
                        singleValue["searchHeader"] = vehicle[ele.dbfield];
                    } else {

                    }
                    // console.log("generateValueRecord singleValue " + JSON.stringify(singleValue));
                    generatedValues.push(singleValue);
                }
                    break;

                case "date_last_updated_display": {
                    singleValue.name = ele.name;
                    singleValue.value = createdAt.toLocaleDateString() + " - " + createdAt.toLocaleTimeString();
                    // console.log("NOW " + singleValue.value);

                    generatedValues.push(singleValue);
                }
                    break;
                // case "empty_group_header":
                // case "group_header":

                case "exterior_inspection": {

                    // let valueArrayLoadedFromDb = [];
                    singleValue.name = ele.name;
                    singleValue.value = [];

                    // generate car quarters
                    var carpictures = ["Left", "Right", "Top", "Front", "Back"];
                    var quartertopbottom = ["Top", "Bottom"];
                    var quarterleftright = ["Left", "Right"];

                    carpictures.map((part1) => {
                        quartertopbottom.map((part2) => {
                            quarterleftright.map((part3) => {
                                let qqq = {};
                                qqq.name = part1.toLowerCase() + part2.toLowerCase() + part3.toLowerCase();
                                qqq.headerText = "" + part1 + " View, " + part2 + " " + part3 + " Quarter";

                                qqq.okValue = "";
                                qqq.repairedValue = "";
                                qqq.failedValue = "";
                                qqq.commentValue = "";
                                qqq.photo = null;
                                //
                                // below filled in render()
                                // qqq.headerText = "";
                                // qqq.status = "";
                                // qqq.photoTaken = "";
                                singleValue.value.push(qqq);
                            });
                        });
                    });
                    singleValue.value.push({"name": singleValue.name + 'ok', 'ok': 1, "value": false});
                    singleValue.value.push({"name": singleValue.name + 'failed', 'failed': 1, "value": false});

                    generatedValues.push(singleValue);
                }
                    break;

                case "simple_check_no_NA": {
                    // singleValue.parent = parent;
                    singleValue.name = ele.name;
                    singleValue.value = [];
                    singleValue.value.push({"name": singleValue.name + 'ok', 'ok': 1, "value": false});
                    singleValue.value.push({"name": singleValue.name + 'adjusted', 'adjusted': 1, "value": false});
                    singleValue.value.push({"name": singleValue.name + 'failed', 'failed': 1, "value": false});
                    singleValue.value.push({"name": singleValue.name + 'comment', "value": ""});
                    generatedValues.push(singleValue);
                }
                    break;
                case "simple_check": {
                    // console.log("generateValueRecord name: " + ele.name);
                    // singleValue.parent = parent;
                    singleValue.name = ele.name;
                    singleValue.value = [];
                    singleValue.value.push({"name": singleValue.name + 'na', 'na': 1, "value": false});
                    singleValue.value.push({"name": singleValue.name + 'ok', 'ok': 1, "value": false});
                    singleValue.value.push({"name": singleValue.name + 'adjusted', 'adjusted': 1, "value": false});
                    singleValue.value.push({"name": singleValue.name + 'failed', 'failed': 1, "value": false});
                    singleValue.value.push({"name": singleValue.name + 'comment', "value": ""});
                    if (ele.dbfield) {
                        // console.log("checklistvalues generateValueRecord dbfield " + ele.dbfield);
                        singleValue.value = vehicle[ele.dbfield] ? vehicle[ele.dbfield] : '';
                        singleValue.dbfield = ele.dbfield;
                    }
                    generatedValues.push(singleValue);
                }
                    break;
                case "NA_check": {
                    singleValue.name = ele.name;
                    singleValue.value = [];
                    singleValue.value.push({"name": singleValue.name + 'na', 'na': 1, "value": true});
                    generatedValues.push(singleValue);
                }
                    break;
                case "concern_box": {
                }
                    break;
                default: {
                    console.log("Error - field type not implemented type: " + ele.type);
                }
            }
            // console.log("singleValue " + JSON.stringify(singleValue));
        }
    });
    return generatedValues;
}

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

function setValueDbField(valueslist, num, dbfieldValue) {
    check(valueslist, [Match.Any]);
    check(num, Match.Integer);
    check(dbfieldValue, String);

    let numStr = "" + num;
    let numLen = numStr.length;
    let changeThisValue = valueslist.find(function (vv) {
        // console.log("setValueDbField " + (vv.name.substr(vv.name.length - numLen, numLen)) + " == " + numStr);
        return vv.name.substr(vv.name.length - numLen, numLen) == numStr;
    });
    if (changeThisValue.dbfield) {
        if (changeThisValue.dbfield != dbfieldValue) {
            console.log("Warning: Field dbfield has value " + changeThisValue.dbfield + " instead of " + dbfieldValue);
        } else {
            return 0;
        }
    }
    changeThisValue.dbfield = dbfieldValue;
    return 1;
}

function getIdForMains(typegroup, dateShort, vin) {
    let idStart = typegroup + dateShort + vin;
    let id = idStart + "000";
    let num = 0;
    for (num = 0; num < 1000; num++) {
        let helpStr = "000" + num;
        let numStr = helpStr.substr((helpStr.length - 3), 3);
        id = idStart + numStr;
        let mains = ChecklistMains.findOne({"id": id});
        if (!mains) {
            break
        }
    }
    if (num >= 1000) {
        num = 0
    }
    let helpStr = "000" + num;
    let numStr = helpStr.substr((helpStr.length - 3), 3);
    id = idStart + numStr;
    // console.log("getIdForMains id " + id);
    return id;
}

function doUpdateAll(query_object, id, vin, valueslist, status, numDone, lastUpdated,
                     signaturePic, signatureManPic, lastEditUserId, lastEditUserName, lastEditUserDealer, dealerName,
                     make, historyUpdate) {
    if (Meteor.isServer) {
        let updated = {};
        updated.status = status;
        updated.updatedAt = lastUpdated;
        updated.lastEditUserName = lastEditUserName;
        updated.lastEditUserId = lastEditUserId;
        updated.lastEditUserDealer = lastEditUserDealer;
        updated.dealerName = dealerName;
        updated.numDone = numDone;

        if (status == "technician submitted") {
            updated.techDateSigned = lastUpdated;
            updated.techUserName = lastEditUserName;
            updated.smanDateSigned = null;
            updated.smanUserName = null;
        } else {
            if (status == "service manager submitted") {
                updated.smanDateSigned = lastUpdated;
                updated.smanUserName = lastEditUserName;
            } else {
                updated.techDateSigned = null;
                updated.techUserName = null;
                updated.smanDateSigned = null;
                updated.smanUserName = null;
            }
        }

        if (signaturePic && signaturePic.length > 0) {
            updated.signaturePic = signaturePic;
        }
        if (signatureManPic && signatureManPic.length > 0) {
            updated.signatureManPic = signatureManPic;
        }

        let mains_query_object = {
            id: id
        };
        // console.log("checklistvalues.upsertAll mains_query_object query " + JSON.stringify(mains_query_object));
        ChecklistMains.upsert(mains_query_object, {$set: updated}, function (err, res) {
            if (err) {
                console.log("Error at Checklistmains update")
            }
        });

        if (valueslist) {
            updated.valueslist = valueslist;
        }

        if (Meteor.isServer) {
            // console.log("checklistvalues.upsertAll query " + JSON.stringify(query_object));
            // console.log("checklistvalues.upsertAll status " + status); // + " user name " + lastEditUserName + " record " + JSON.stringify(updated));
            ChecklistValues.upsert(query_object, {$set: updated}, function (err, res) {
                if (err) {
                    console.log("Error at Checklistvalues update " + err.message)
                }
            });
        }

        if (historyUpdate) {
            // console.log("history.upsertAll");
            Meteor.call('history.upsertAll', vin, query_object.checklisttype, query_object.version, dealerName, make, lastEditUserId, lastEditUserName,
                status, lastUpdated);
        }
    }
}

Meteor.methods({
    'checklistvalues.hallo': function (str) {
        console.log(" H A L L O  ---" + str);
        return {"result": str};
    },
    'checklistvalues.upsertAll'(query_object, id, vin, valueslist, status, numDone, lastUpdated, signaturePic, signatureManPic, lastEditUserId, lastEditUserName,
                                lastEditUserDealer, dealerName,
                                make, historyUpdate) {
        // console.log("checklistvalues.upsertAll" + JSON.stringify(query_object));
        // console.log("checklistvalues.upsertAll dealer" + JSON.stringify(lastEditUserDealer));


        // if (status == "technician submitted" || status == "service manager submitted") {
        //     console.log("checklistvalues.upsertAll SUBMITTED " + JSON.stringify(id));
        //     let mains_query_object = {
        //         id: id
        //     };
        //
        //     ChecklistMains.findOne(mains_query_object, {"status": 1}, function (err, res) {
        //         if (err) {
        //             console.log("Error at Checklistmains update - check submitted status " + err.message);
        //         } else {
        //             console.log("Found: " + JSON.stringify(res));
        //             if (res.status != status)
        //                 console.log("Status changed");
        //                 doUpdateAll(query_object, id, vin, valueslist, status, numDone, dateTimeNow, signaturePic, signatureManPic, lastEditUserId, lastEditUserName,
        //                     lastEditUserDealer, dealerName,
        //                     make, historyUpdate);
        //
        //
        //         }
        //     });
        // } else {
            doUpdateAll(query_object, id, vin, valueslist, status, numDone, lastUpdated, signaturePic, signatureManPic, lastEditUserId, lastEditUserName,
                lastEditUserDealer, dealerName,
                make, historyUpdate);
   //     }
        return {"result": "ok"}
    },
    'checklistvalues.upsert'(query_object, update_object) {
        // console.log("checklistvalues.upsert" + JSON.stringify(query_object));
        if (Meteor.isServer) {
            ChecklistValues.upsert(query_object, {$set: update_object}, function (err, res) {
                if (err) {
                    console.log("Error at Checklistvalues update")
                }
            });
        }
    },
    'checklistvalues.generateValues': function (params) { // }, mains_id, lastEditUserId, lastEditUserName, typegroup, ptype) {

        // console.log("checklistvalues.generateValues: params" + JSON.stringify(params));

        // mains_record must have:
        // vin
        // modelName

        if (Meteor.isServer) {
            let ptype = params.ptype;
            // console.log("checklistvalues.generateValues on server ptype 2a " + ptype);
            let result = {"type": params.ptype, "mid": ""};

            if (params.checklisttypegroup == "Body") {
                result.checklisttype = "Body";
                ptype = "Body";
            } else {
                if (!ptype || ptype.length == 0) {
                    let typesList = VehicleTypes.findOne({"modelName": params.mains_record["modelName"]});
                    // console.log("checklistvalues.generateValues typeslist " + JSON.stringify(typesList));
                    if (!typesList) {
                        console.log("ERROR! No model name found model: " + params.mains_record["modelName"] + " vin: " + params.mains_record["vin"]);
                        // console.log("generateValuesForOneVehicle vin: " + vehicle["vin"]);

                    } else {
                        let groupField = params.typegroup ? params.typegroup.toLowerCase() + "Type" : null;
                        // console.log("checklistvalues.generateValues groupField " + JSON.stringify(groupField));

                        ptype = typesList && params.typegroup ? typesList[groupField] : null;
                        result.checklisttype = ptype;
                        // console.log("checklistvalues.generateValues checklisttype " + JSON.stringify(ptype));
                    }
                } else {
                    result.checklisttype = ptype;
                }
            }
            // console.log("checklistvalues.generateValues: 2 ptype " + JSON.stringify(ptype));

            if (!ptype || _.isUndefined(ptype)) {
                console.log("ERROR! No checklisttype found ");

            } else {
                // get newest template template for ptype
                // console.log("checklistvalues.generateValues checklisttype find query " + ptype);
                let templateList = ChecklistTemplates.find({"checklisttype": ptype}).fetch();

                if (!(templateList && templateList.length > 0)) {
                    console.log("Error:  No Checklist Template found for Checklist type: " + ptype);
                } else {

                    // find newest template
                    let newestTemplate = templateList && templateList.length > 0 ? templateList[0] : null;
                    let newestVersion = "0000000";
                    // console.log("checklistvalues.generateValues num templates found " + templateList.length);
                    templateList.forEach(function (temp) {
                        if (temp.version.toLowerCase().localeCompare(newestVersion) == -1) {
                            newestTemplate = temp;
                            newestVersion = temp.version.toLowerCase();
                        }
                    });
                    let newestVersionTemplate = newestTemplate;
                    //
                    if (!newestVersionTemplate) {
                        Console.log("Error: No Checklist Template found for PDI type: " + ptype);
                    } else {

                        let mains_record = params.mains_record;
                        // compute checklistvalues for type
                        let nowDate = new Date();
                        // console.log("checklistvalues.generateValues _id " +  JSON.stringify(params.mains_record._id));

                        params.mains_record["type"] = ptype;
                        params.mains_record["checklisttype"] = ptype;
                        params.mains_record["version"] = newestVersionTemplate.version;
                        result.version = newestVersionTemplate.version;
                        params.mains_record["status"] = "new";
                        params.mains_record["numDone"] = "new";

                        params.mains_record["signaturePic"] = null;
                        params.mains_record["signatureManPic"] = null;
                        params.mains_record["updatedAt"] = nowDate;
                        params.mains_record["techDateSigned"] = null;
                        params.mains_record["smanDateSigned"] = null;
                        params.mains_record["techUserName"] = "";
                        params.mains_record["smanUserName"] = "";

                        params.mains_record["lastEditUserName"] = params.lastEditUserName;
                        params.mains_record["lastEditUserId"] = params.lastEditUserId;
                        params.mains_record["createdAt"] = nowDate;
                        params.mains_record["updatedAt"] = nowDate;
                        params.mains_record["vin"] = mains_record["vin"].toUpperCase();
                        let dateShort = shortDateString(nowDate);

                        // id contained "none" as date
                        let id = getIdForMains(params.typegroup, dateShort, params.mains_record["vin"]);

                        params.mains_record["id"] = id;
                        params.mains_record["mid"] = id;
                        // let prefix = "^" + params.typegroup + dateShort + mains_record["vin"];
                        // let lastMains = ChecklistMains.findOne({"id": {$regex: prefix}}, {sort: {"id": -1}});
                        // if (lastMains) {
                        //     console.log("last mains " + JSON.stringify(lastMains));
                        // }
                        ////console.log("checklistvalues.generateValues new id " + JSON.stringify(params.mains_record["id"]));

                        result.mid = id;

                        // console.log("checklistvalues.generateValues " +  JSON.stringify(vehicle));
                        let valuesList = [];
                        let createdAt = nowDate;
                        let generatedValues = generateValueRecord(mains_record, newestVersionTemplate.elements, createdAt, valuesList);
                        let values_record = _.omit(mains_record, "_id");

                        // console.log("generated values _id? " + JSON.stringify(values_record._id));

                        let query_object_values = {
                            "id": values_record["id"]
                        };
                        values_record.valueslist = valuesList;
                        // console.log("checklistvalues.generateValues checklisttype vvv" + JSON.stringify(values_record.checklisttype));
                        // console.log("checklistvalues.generateValues checklisttype mmm" + JSON.stringify(mains_record.checklisttype));
                        // console.log("checklistvalues.generateValues query values " + JSON.stringify(query_object_values));
                        // console.log("Error checklistvalues.generateValues upsert query_object_values " + JSON.stringify(query_object_values));
                        // console.log("Error checklistvalues.generateValues upsert $set " + JSON.stringify(values_record));
                        ChecklistValues.upsert(query_object_values, {$set: values_record}, function (err, res) {
                            if (err) {
                                console.log("Error checklistvalues.generateValues values upsert error " + JSON.stringify(err));
                                console.log("Error checklistvalues.generateValues upsert query_object_values " + JSON.stringify(query_object_values));
                                // console.log("Error checklistvalues.generateValues upsert $set " + JSON.stringify(values_record));
                            } else {
                                let query_object_mains = {};
                                if (params.mains_id) {
                                    query_object_mains["_id"] = params.mains_id;

                                    // console.log("checklistvalues.generateValues query mains " + JSON.stringify(query_object_mains));
                                    ChecklistMains.upsert(query_object_mains, {$set: mains_record}, function (err, res) {
                                        if (err) {
                                            console.log("Error checklistvalues.generateValues update mains" + JSON.stringify(err));
                                        } else {
                                            // console.log("result checklistvalues.generateValues update mains" + JSON.stringify(res));
                                        }
                                    });
                                } else {
                                    ChecklistMains.insert(mains_record, function (err, res) {
                                        if (err) {
                                            console.log("Error checklistvalues.generateValues insert new mains" + JSON.stringify(err));
                                        } else {
                                            // console.log("result checklistvalues.generateValues update mains" + JSON.stringify(res));
                                        }
                                    });
                                }
                            }
                        });

                    }
                }

                // console.log("checklistvalues.generateValues: return result " + JSON.stringify(result));
                return result;
            }
        }
        return null;
    },
    'checklistvalues.resetValues': function (params) { // }, mains_id, lastEditUserId, lastEditUserName, typegroup, ptype) {

        // console.log("checklistvalues.resetValues: params" + JSON.stringify(params));

        // mains_record must have:
        // _id_mains
        // _id_values
        // vin
        // modelName
        // ptype

        if (Meteor.isServer) {
            let ptype = params.ptype;
            // console.log("checklistvalues.generateValues on server ptype " + ptype);
            let result = {"type": params.ptype, "mid": ""};

            // getchecklisttype
            if (!ptype || ptype.length == 0) {
                let typesList = VehicleTypes.findOne({"modelName": params.mains_record["modelName"]});
                // console.log("checklistvalues.generateValues typeslist " + JSON.stringify(typesList));
                if (!typesList) {
                    console.log("ERROR! No model name found model: " + params.mains_record["modelName"] + " vin: " + params.mains_record["vin"]);
                    // console.log("generateValuesForOneVehicle vin: " + vehicle["vin"]);

                } else {
                    let groupField = params.typegroup ? params.typegroup.toLowerCase() + "Type" : null;
                    // console.log("checklistvalues.generateValues groupField " + JSON.stringify(groupField));

                    ptype = typesList && params.typegroup ? typesList[groupField] : null;
                    result.checklisttype = ptype;
                    // console.log("checklistvalues.generateValues checklisttype " + JSON.stringify(ptype));
                }
            } else {
                result.checklisttype = ptype;
            }
            // console.log("checklistvalues.generateValues: result " + JSON.stringify(result));

            if (!ptype || _.isUndefined(ptype)) {
                console.log("ERROR! No checklisttype found ");

            } else {
                // get newest template template for ptype
                // console.log("checklistvalues.generateValues checklisttype find query " + ptype);
                let templateList = ChecklistTemplates.find({"checklisttype": ptype}).fetch();

                if (!(templateList && templateList.length > 0)) {
                    console.log("Error:  No Checklist Template found for Checklist type: " + ptype);
                } else {

                    // find newest template
                    let newestTemplate = templateList && templateList.length > 0 ? templateList[0] : null;
                    let newestVersion = "0000000";
                    // console.log("checklistvalues.generateValues num templates found " + templateList.length);
                    templateList.forEach(function (temp) {
                        if (temp.version.toLowerCase().localeCompare(newestVersion) == -1) {
                            newestTemplate = temp;
                            newestVersion = temp.version.toLowerCase();
                        }
                    });
                    let newestVersionTemplate = newestTemplate;
                    //
                    if (!newestVersionTemplate) {
                        Console.log("Error: No Checklist Template found for PDI type: " + ptype);
                    } else {

                        let mains_record = params.mains_record;
                        // compute checklistvalues for type
                        let nowDate = new Date();
                        // console.log("checklistvalues.generateValues _id " +  JSON.stringify(params.mains_record._id));

                        params.mains_record["type"] = ptype;
                        params.mains_record["version"] = newestVersionTemplate.version;
                        result.version = newestVersionTemplate.version;
                        params.mains_record["status"] = "new";
                        params.mains_record["numDone"] = "new";

                        params.mains_record["signaturePic"] = null;
                        params.mains_record["signatureManPic"] = null;
                        params.mains_record["updatedAt"] = nowDate;
                        params.mains_record["techDateSigned"] = null;
                        params.mains_record["smanDateSigned"] = null;
                        params.mains_record["techUserName"] = "";
                        params.mains_record["smanUserName"] = "";

                        params.mains_record["lastEditUserName"] = params.lastEditUserName;
                        params.mains_record["lastEditUserId"] = params.lastEditUserId;
                        params.mains_record["createdAt"] = nowDate;
                        params.mains_record["updatedAt"] = nowDate;
                        params.mains_record["vin"] = mains_record["vin"].toUpperCase();
                        let dateShort = shortDateString(nowDate);

                        // id contained "none" as date
                        let id = getAndUpdateIdForMains(params.id, params.typegroup, dateShort, params.mains_record["vin"]);

                        params.mains_record["id"] = id;
                        params.mains_record["mid"] = id;
                        // let prefix = "^" + params.typegroup + dateShort + mains_record["vin"];
                        // let lastMains = ChecklistMains.findOne({"id": {$regex: prefix}}, {sort: {"id": -1}});
                        // if (lastMains) {
                        //     console.log("last mains " + JSON.stringify(lastMains));
                        // }
                        ////console.log("checklistvalues.generateValues new id " + JSON.stringify(params.mains_record["id"]));

                        result.mid = id;

                        // console.log("checklistvalues.generateValues " +  JSON.stringify(vehicle));
                        let valuesList = [];
                        let createdAt = nowDate;
                        let generatedValues = generateValueRecord(mains_record, newestVersionTemplate.elements, createdAt, valuesList);
                        let values_record = _.clone(mains_record);

                        // console.log("generated values " + JSON.stringify(valuesList));

                        let query_object_values = {
                            "id": values_record["id"]
                        };
                        values_record.valueslist = valuesList;

                        // console.log("checklistvalues.generateValues query values " + JSON.stringify(query_object_values));

                        ChecklistValues.remove({_id: _id_values}, function (err, res) {
                            if (err) {
                                console.log("Error removing checklistvalues.generateValues " + JSON.stringify(err.message));
                            } else {
                                ChecklistValues.upsert(query_object_values, {$set: values_record}, function (err, res) {
                                    if (err) {
                                        console.log("Error checklistvalues.generateValues upsert checklistvalues" + JSON.stringify(err));

                                    } else {
                                        let query_object_mains = {};
                                        if (params.mains_id) {
                                            query_object_mains["_id"] = params.mains_id;

                                            // console.log("checklistvalues.generateValues query mains " + JSON.stringify(query_object_mains));
                                            ChecklistMains.upsert(query_object_mains, {$set: mains_record}, function (err, res) {
                                                if (err) {
                                                    console.log("Error checklistvalues.generateValues update mains" + JSON.stringify(err));
                                                } else {
                                                    // console.log("result checklistvalues.generateValues update mains" + JSON.stringify(res));
                                                }
                                            });
                                        } else {
                                            ChecklistMains.insert(mains_record, function (err, res) {
                                                if (err) {
                                                    console.log("Error checklistvalues.generateValues insert new mains" + JSON.stringify(err));
                                                } else {
                                                    // console.log("result checklistvalues.generateValues update mains" + JSON.stringify(res));
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                }

                // console.log("checklistvalues.generateValues: return result " + JSON.stringify(result));
                return result;
            }
        }
        return null;
    },
    'checklistvalues.create'(query_object, valueslist, status, dateTimeNow, signaturePic, lastEditUserId, lastEditUserName) {
        // console.log("checklistvalues.upsertAll user=" + lastEditUserName ); //  + JSON.stringify(valueslist));

        // todo access rights check
        // Make sure the user is logged in before inserting a task
        // if (! userid) { // } Meteor.userId()) {
        //     throw new Meteor.Error('not-authorized');
        // }

        let updated = {};
        updated.status = status;
        updated.signaturePic = signaturePic;
        updated.createdAt = dateTimeNow;
        updated.updatedAt = dateTimeNow;
        updated.lastEditUserName = lastEditUserName;
        updated.lastEditUserId = lastEditUserId;
        Meteor.call('history.create', query_object.vin, query_object.checklisttype, query_object.version,
            query_object.dealerName, query_object.make, lastEditUserId, lastEditUserName,
            status, dateTimeNow);

        updated.valueslist = valueslist;

        ChecklistValues.upsert(query_object, {$set: updated});
        Meteor.call('history.create', query_object.vin, query_object.checklisttype, query_object.version,
            query_object.dealerName, query_object.make, lastEditUserId, lastEditUserName,
            status, dateTimeNow);
        Meteor.call('history.upsertAll', query_object.vin, query_object.checklisttype, query_object.version,
            query_object.dealerName, query_object.make, lastEditUserId, lastEditUserName,
            status, dateTimeNow);
        return "";
    }
    ,
    'checklistvalues.removeall'() {
        console.log("removeall");
        ChecklistValues.remove({});
    }
    ,
    'checklistvalues.addChecklisttypegroup'(currentUserId, currentUserName, currentRole,
                                            currentCompany, currentDealer) {
        console.log("checklistvalues.addChecklisttypegroup");
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
        query['checklisttype'] = {$regex: "^PDI"};
        console.log("checklistvalues.addChecklisttypegroup" + JSON.stringify(query));
        let vals = ChecklistValues.find(query).fetch();

        if (vals) {
            console.log("checklistvalues.addChecklisttypegroup  num " + vals.length);
            vals.forEach(function (vv) {
                let query_object = {
                    '_id': vv._id
                };
                let update_object = {
                    "checklisttypegroup": "PDI"
                };
                if (Meteor.isServer) {
                    ChecklistValues.upsert(query_object, {$set: update_object}, function (err, res) {
                        if (err) {
                            console.log("Error at Checklistvalues update")
                        } else {
                            console.log("checklistvalues.addChecklisttypegroup", JSON.stringify(res));
                        }
                    });
                }
            });
        }
    }
    ,
    'checklistvalues.addChecklistmains'(currentUserId, currentUserName, currentRole,
                                        currentCompany, currentDealer) {
        console.log("checklistvalues.addChecklistmains");
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

        console.log("checklistvalues.addChecklistmains" + JSON.stringify(query));
        let vals = ChecklistValues.find(query).fetch();

        if (vals) {
            console.log("checklistvalues.addChecklistmains  num " + vals.length);
            vals.forEach(function (vv) {
                let dateShort = shortDateString(vv.lastUpdated)
                let query_object = {
                    'id': vv.checklisttypegroup + dateShort + vv.vin
                };
                let mains_object = {
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
                    "dealerName": vv.dealerName,
                    "lastEditUserName": vv.lastEditUserName,
                    "lastUpdated": vv.lastUpdated,
                    "status": vv.status,
                    "createAt": vv.createdAt,
                    "updatedAt": vv.updatedAt,
                    "lastEditUserName": vv.lastEditUserName,
                    "lastEditUserId": vv.lastEditUserId,
                    "numDone": vv.numDone,
                    "techDateSigned": vv.techDateSigned,
                    "techUserName": vv.techUserName,
                    "smanDateSigned": vv.smanDateSigned,
                    "smanUserName": vv.smanUserName
                };
                if (Meteor.isServer) {
                    ChecklistMains.upsert(query_object, {$set: update_object}, function (err, res) {
                        if (err) {
                            console.log("Error at Checklistvalues update")
                        } else {
                            // console.log("checklistvalues.addChecklisttypegroup", JSON.stringify(res));
                        }
                    });
                }
            });
        }
    }
    ,
    'checklistvalues.repairDbfields'(currentUserId, currentUserName, currentRole,
                                     currentCompany, currentDealer) {
        let counter = {};
        counter.roNumber = 0;
        counter.odometer = 0;
        counter.vin = 0;
        counter.vin2 = 0;
        counter.rego = 0;
        counter.make = 0;
        counter.modelName = 0;
        counter.colour = 0;
        counter.keyNo = 0;
        counter.dealerName = 0;
        counter.lastEditUserName = 0;
        counter.updatedAt = 0;
        counter.status = 0;
        counter.checklisttype = 0;
        counter.id = 0;
        counter.version = 0;
        counter.regoUpdated = 0;
        counter.location = 0;

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

        // console.log("checklistvalues.repairDbfields" + JSON.stringify(query));
        let vals = ChecklistValues.find(query).fetch();

        if (vals) {
            console.log("checklistvalues.repairDbfields  num " + vals.length);
            vals.forEach(function (vv) {
                console.log("checklistvalues.repairDbfields  vin " + vv.vin);
                if (Meteor.isServer) {
                    if (vv.valueslist) {
                        let query_object = {
                            '_id': vv._id
                        };
                        let newVal = _.omit(vv, "_id");
                        let newValueslist = newVal.valueslist;
                        counter.roNumber += setValueDbField(newValueslist, 5, "roNumber");
                        counter.odometer += setValueDbField(newValueslist, 6, "odometer");

                        counter.vin += setValueDbField(newValueslist, 7, "vin");
                        counter.vin2 += setValueDbField(newValueslist, 9, "vin");
                        counter.rego += setValueDbField(newValueslist, 11, "rego");
                        counter.make += setValueDbField(newValueslist, 13, "make");
                        counter.modelName += setValueDbField(newValueslist, 15, "modelName");
                        counter.colour += setValueDbField(newValueslist, 17, "colour");
                        counter.keyNo += setValueDbField(newValueslist, 19, "keyNo");
                        counter.dealerName += setValueDbField(newValueslist, 21, "dealerName");
                        counter.lastEditUserName += setValueDbField(newValueslist, 23, "lastEditUserName");
                        counter.updatedAt += setValueDbField(newValueslist, 25, "updatedAt");
                        counter.status += setValueDbField(newValueslist, 27, "status");
                        counter.checklisttype += setValueDbField(newValueslist, 29, "checklisttype");
                        counter.id += setValueDbField(newValueslist, 31, "id");
                        counter.version += setValueDbField(newValueslist, 33, "version");
                        counter.regoUpdated += setValueDbField(newValueslist, 35, "regoUpdated");
                        counter.location += setValueDbField(newValueslist, 37, "location");
                        // return false;

                        ChecklistValues.upsert(query_object, {$set: newVal}, function (err, res) {
                            if (err) {
                                console.log("Error at Checklistvalues update" + JSON.stringify(err.message));
                            } else {
                                // console.log("checklistvalues.addChecklisttypegroup", JSON.stringify(res));
                            }
                        });
                    }
                }
                // return true;
            });
        }
        console.log(" updated " + JSON.stringify(counter));

    }
    ,
    'checklistvalues.atUpdatedString'(currentUserId, currentUserName, currentRole,
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
        let vals = ChecklistValues.find(query).fetch();

        if (vals) {
            console.log("checklistvalues.atUpdatedString  num " + vals.length);
            vals.forEach(function (vv) {
                console.log("checklistvalues.atUpdatedString  vin " + vv.vin);
                if (Meteor.isServer) {

                    let query_object = {
                        '_id': vv._id
                    };
                    let newVal = _.omit(vv, "_id");
                    var options = {
                        weekday: "short", year: "numeric", month: "short",
                        day: "numeric", hour: "2-digit", minute: "2-digit"
                    };
                    var lastUpdate = newVal.updatedAt.toLocaleTimeString("en-NZ", options);
                    newVal["last update"] = lastUpdate;
                    counter["last update"]++;
                    ChecklistValues.upsert(query_object, {$set: newVal}, function (err, res) {
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
        console.log("atUpdatedString updated " + JSON.stringify(counter));

    }
    ,
    'checklistvalues.updatedallVersions'(currentUserId, currentUserName, currentRole,
                                         currentCompany, currentDealer) {
        let counter = {"version": 0};

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
        let vals = ChecklistValues.find(query).fetch();

        if (vals) {
            console.log("checklistvalues.updatedallVersions  num " + vals.length);
            vals.forEach(function (vv) {
                // console.log("checklistvalues.updatedallVersions  vin " + vv.vin);
                if (Meteor.isServer) {

                    let query_object = {
                        '_id': vv._id
                    };
                    let newVal = _.omit(vv, "_id");
                    newVal["version"] = "Vers.1.0";
                    counter["version"]++;
                    ChecklistValues.upsert(query_object, {$set: newVal}, function (err, res) {
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
        console.log("updatedallVersions updated " + JSON.stringify(counter));

    }
    ,
    'checklistvalues.upperCaseMake'(currentUserId, currentUserName, currentRole,
                                    currentCompany, currentDealer) {
        let counter = {"make": 0};

        // console.log("checklistvalues.upperCaseMake");
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
        let vals = ChecklistValues.find(query).fetch();

        if (vals) {
            console.log("checklistvalues.upperCaseMake  num " + vals.length);
            vals.forEach(function (vv) {
                // console.log("checklistvalues.upperCaseMake  vin " + vv.vin);
                if (Meteor.isServer) {

                    let query_object = {
                        '_id': vv._id
                    };
                    let newVal = _.omit(vv, "_id");
                    // !!! HYUNDAI
                    // !!! HYUNDAI
                    // !!! HYUNDAI

// !!! HYUNDAI
// !!! HYUNDAI

                    if (!vv["make"]) {
                        vv["make"] = "HYUNDAI";
                    }
                    newVal["make"] = vv["make"].toUpperCase();
                    counter["make"]++;
                    ChecklistValues.upsert(query_object, {$set: newVal}, function (err, res) {
                        if (err) {
                            console.log("Error at Checklistvalues update" + JSON.stringify(err.message));
                        } else {

                        }
                    });
                }

            });
        }
        console.log("upperCaseMake updated " + JSON.stringify(counter));

    }
,
    'checklistvalues.find'(query) {
        let checks = ChecklistValues.find(query).fetch();
        return checks;
    }

    });