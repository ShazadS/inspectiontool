import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {VehicleTypes} from './vehicletypes.js';
import {Dealers} from './dealers.js';
import {ChecklistTemplates} from './checklisttemplates.js';
import {ChecklistValues} from './checklistvalues.js';

export const Vehicles = new Mongo.Collection('vehicles');
export const VehiclesAdded = new Mongo.Collection('vehiclesadded');
if (Meteor.isServer) {
    // let db1 = new MongoInternals.RemoteCollectionDriver('mongodb://localhost:27017/vinspectiontool');
    // coll = new Mongo.Collection('vehicles',  {_driver: db1});

    // This code only runs on the server
    // Only publish vehicles that are public or belong to the current user
    Meteor.publish('vehicles', function vehiclesPublication() {
        return Vehicles.find({make: "HYUNDAI"});
    });
}

//  'checklistvalues.create'(query_object, valueslist, status, dateTimeNow, signaturePic, lastEditUserId, lastEditUserName) {
function generatePdiValuesForOneVehicle(vehicle, vinField, modelField, dealerField, lastEditUserId, lastEditUserName) {
    let status = "new";
    let message = "No message";
    // console.log("generateValuesForOneVehicle " + JSON.stringify(vehicle));

    // todo access rights check
    // Make sure the user is logged in before inserting a task
    // if (! userid) { // } Meteor.userId()) {
    //     throw new Meteor.Error('not-authorized');
    // }

    let modelName = vehicle[modelField];
    let dealerCode = vehicle[dealerField];

    // pdi-type <- get with model from vehicletypes
    // console.log("generateValuesForOneVehicle query " + JSON.stringify({
    //         "modelName": modelName
    //     }));
    let typesList = VehicleTypes.findOne({"modelName": modelName});
    let pdiType = typesList && typesList.pdiType ? typesList.pdiType : null;
    // console.log("generateValuesForOneVehicle vin: " + vehicle[vinField]);
    if (!pdiType) {
        console.log("ERROR! No model name found model: " + modelName + " vin: " + vehicle[vinField]);
    } else {
        // check if checklistvalues already exist
        //console.log("TEST if , checklist already exists: " + pdiType + " vin: " + vehicle[vinField] + "query "
        //    + JSON.stringify({"vin": vehicle[vinField], "type": pdiType}));
        let valExisting = ChecklistValues.findOne({"vin": vehicle[vinField], "checklisttype": pdiType},{"vin":1});
        let vin = vehicle[vinField].toUpperCase();
        if (valExisting && valExisting.vin == vehicle[vinField]) {
            console.log("NOTE not generating values, checklist already exists: " + pdiType + " vin: " + vin);
            Meteor.call('vehiclesadded.removeOne', vin);
        } else {


            let dealerRecord = Dealers.findOne({"Incadea Dealer Code": dealerCode});
            // console.log("generateValuesForOneVehicle dealerecord: " + JSON.stringify(dealerRecord));
            let dealerName = dealerRecord && dealerRecord["dealer"] ? dealerRecord["dealer"] : null;
            // console.log("generateValuesForOneVehicle dealer: " + dealerName);
            if (!dealerName) {
                console.log("Error: No dealer code found dealer code: " + dealerCode + " vin: " + vehicle[vinField]);
            } else {

                // get template for pdi-type
                let templateList = ChecklistTemplates.find({"checklisttype": pdiType}).fetch();
                // get newest template
                if (templateList && templateList.length > 0) {
                    let newestVersionTemplate = getNewestVersionTemplate(templateList);
                    // console.log("newest Template  " + JSON.stringify(newestVersionTemplate.version));
                    if (newestVersionTemplate) {
                        // compute checklistvalues report for pdi

                        let nowDate = new Date();

                        let valuesRecord = _.clone(vehicle);
                        valuesRecord["type"] = pdiType;
                        valuesRecord["version"] = newestVersionTemplate.version;
                        valuesRecord["status"] = "new";
                        valuesRecord["numDone"] = "new";

                        valuesRecord["signaturePic"] = "";
                        valuesRecord["signatureManPic"] = "";
                        valuesRecord["updatedAt"] = nowDate;
                        valuesRecord["techDateSigned"] = null;
                        valuesRecord["smanDateSigned"] = null;
                        valuesRecord["techUserName"] = "";
                        valuesRecord["smanUserName"] = "";
                        valuesRecord["lastEditUserDealer"] = "";
                        valuesRecord["lastEditUserName"] = "";
                        valuesRecord["lastEditUserId"] = -1;
                        valuesRecord["dealer"] = dealerCode;
                        valuesRecord["dealerName"] = dealerName;
                        valuesRecord["id"] = vehicle[vinField] + "-" + pdiType;

                        let len = vehicle[vinField].length;
                        valuesRecord["vinLast"] = vehicle[vinField].substr(len - 6, 6);

                        // console.log("generateValuesForOneVehicle " +  JSON.stringify(vehicle));

                        let generatedValues = [];
                        let createdAt = nowDate;
                        generatedValues = generateValueRecord(valuesRecord, newestVersionTemplate.elements, createdAt, generatedValues);

                        // console.log("generated values " + JSON.stringify(generatedValues));

                        Meteor.call('checklistvalues.create', {
                            'checklisttype': valuesRecord["type"],
                            'version': valuesRecord["version"],
                            "vin": valuesRecord[vinField],
                            "vinLast": valuesRecord["vinLast"],
                            'id': valuesRecord["id"],
                            'rego': valuesRecord["rego"],
                            'make': valuesRecord["make"],
                            'modelName': valuesRecord["modelName"],
                            'colour': valuesRecord["colour"],
                            'keyNo': valuesRecord["keyNo"],
                            'dealer': valuesRecord["dealer"],
                            'dealerName': valuesRecord["dealerName"]
                        }, generatedValues, valuesRecord.status, nowDate, null, lastEditUserId, lastEditUserName);

                        let newVehicle = _.clone(vehicle);

                        newVehicle["type"] = pdiType;
                        newVehicle["version"] = newestVersionTemplate.version;
                        newVehicle["status"] = "new";
                        newVehicle["numDone"] = "new";
                        newVehicle["createdAt"] = nowDate;
                        Meteor.call('vehicles.create', vehicle);
                        Meteor.call('vehiclesadded.removeOne', vehicle.vin);
                        // write checklistvalues report for pdi
                    } else {
                        status = "Error";
                        message = " No Checklist Template found for PDI type: " + pdiType;
                    }
                } else {
                    status = "Error";
                    message = " No Checklist Template found for PDI type: " + pdiType;
                }
            }
        }
    }


// todo change status in vehicles

    // let updated = valueslist;
    // updated[modelField] =
    //     updated.updatedAt = new Date();
    // updated.status = status;
    //
    // updated.createdAt = new Date();
    // Vehicles.upsert(queryObject, {$set: updated});

    // todo - later produce aged-checklist

}

function generateH100ValForOneVehicle(vehicle, vinField, modelField, vehicleTypeField, lastEditUserId, lastEditUserName) {
    let status = "new";
    let message = "No message";
    console.log("generateH100ValForOneVehicle " + JSON.stringify(vehicle));

    // todo access rights check
    // Make sure the user is logged in before inserting a task
    // if (! userid) { // } Meteor.userId()) {
    //     throw new Meteor.Error('not-authorized');
    // }

    let modelName = vehicle[modelField];
    let vehicleType = vehicle[vehicleTypeField];

    // get template
    let templateList = ChecklistTemplates.find({"checklisttype": "H-Promise"}).fetch();

    // get newest template
    if (templateList && templateList.length > 0) {
        let newestVersionTemplate = getNewestVersionTemplate(templateList);
        // console.log("newest Template  " + JSON.stringify(newestVersionTemplate));
        if (newestVersionTemplate) {
            // compute checklistvalues report for pdi

            let nowDate = new Date();

            vehicle["type"] = "H-Promise";
            vehicle["version"] = newestVersionTemplate.version;
            vehicle["status"] = "new";
            vehicle["numDone"] = "new";

            vehicle["signaturePic"] = "";
            vehicle["signatureManPic"] = "";
            vehicle["updatedAt"] = nowDate;
            vehicle["techDateSigned"] = null;
            vehicle["smanDateSigned"] = null;
            vehicle["techUserName"] = "";
            vehicle["smanUserName"] = "";

            vehicle["lastEditUserName"] = "";
            vehicle["lastEditUserDealer"] = "";
            vehicle["lastEditUserId"] = -1;

            vehicle["id"] = vehicle[vinField] + "-" + "H-Promise";

            let len = vehicle[vinField].length;
            vehicle["vinLast"] = vehicle[vinField].substr(len - 6, 6);

            // console.log("generateValuesForOneVehicle " +  JSON.stringify(vehicle));

            let generatedValues = [];
            let createdAt = nowDate;
            generatedValues = generateValueRecord(vehicle, newestVersionTemplate.elements, createdAt, generatedValues);

            //        console.log("generated values " + JSON.stringify(generatedValues));


            let dateTimeNow = new Date();
            Meteor.call('checklistvalues.create', {
                'checklisttype': vehicle["type"],
                'version': vehicle["version"],
                "vin": vehicle[vinField],
                "vinLast": vehicle["vinLast"],
                'id': vehicle["id"],
                'rego': vehicle["rego"],
                'make': vehicle["make"],
                'modelName': vehicle["modelName"],
                'colour': vehicle["colour"],
                'keyNo': vehicle["keyNo"],
                'dealerName': vehicle["dealerName"]
            }, generatedValues, vehicle.status, dateTimeNow, null, lastEditUserId, lastEditUserName);
        }
    } else {
        console.log("Error vehicles.generateH100Values template type " + "H-Promise" + " NOT FOUND");
    }

    // write checklistvalues report for pdi


    // todo change status in vehicles

    // let updated = valueslist;
    // updated[modelField] =
    //     updated.updatedAt = new Date();
    // updated.status = status;
    //
    // updated.createdAt = new Date();
    // Vehicles.upsert(queryObject, {$set: updated});

    // todo - later produce aged-checklist
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
                    break
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
                    singleValue.name = ele.name;

                    // console.log("generateValueRecord dbfield " + ele.dbfield + " name: " + ele.name);

                    // set Status first
                    if (ele.dbfield) {
                        // console.log("generateValueRecord dbfield " + ele.dbfield);
                        singleValue.value = vehicle[ele.dbfield] ? vehicle[ele.dbfield] : '';
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

                case "exterior_check":
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

Meteor.methods({
    'vehicles.updateStatus'(query_object, status) {
        console.log("vehicles.updateStatus ");
        // todo access rights check
        // Make sure the user is logged in before inserting a task
        // if (! userid) { // } Meteor.userId()) {
        //     throw new Meteor.Error('not-authorized');
        // }

        let updated = {};
        updated.status = status;
        updated.updatedAt = new Date();

        Vehicles.upsert(query_object, {$set: updated});
    },
    // Meteor.call('vehicles.generateValues', "vin", "modelName", "vehicleTypeCode", currentUserId, currentUserName, currentRole, currentPdiApproved,
    // currentCompany, currentDealer);
    'vehicles.generateValues'(currentUserId, currentUserName, currentRole, currentPdiApproved,
                              currentCompany, currentDealer) {
        // console.log("vehicles.generateValues ");
        var query = {};
        if (currentRole != "Admin System") {
            query.dontfindanything = "YES";
        }
        if (currentCompany != "ALL") {
            query.make = currentCompany;
        }
        if (currentDealer != "ALL") {
            query.dealerName = currentDealer;
        }

        // console.log("Vehicles.find( " + JSON.stringify(query));
        let vehs = Vehicles.find(query).fetch();
        // console.log("vehicles" + JSON.stringify(vehs));
        if (vehs) {
            vehs.forEach(function (vehicle) {
                console.log("generate VIN " + JSON.stringify(vehicle.vin));
                generatePdiValuesForOneVehicle(vehicle, "vin", "modelName", "Dealer Request Code", currentUserId, currentUserName);
            });
        }
    },
    'vehicles.generateAddedValues'(currentUserId, currentUserName, currentRole, currentPdiApproved,
                              currentCompany, currentDealer) {
        // console.log("vehicles.generateAddedValues ");
        var query = {};
        if (currentRole != "Admin System") {
            query.dontfindanything = "YES";
        }
        if (currentCompany != "ALL") {
            query.make = currentCompany;
        }
        if (currentDealer != "ALL") {
            query.dealerName = currentDealer;
        }

        // console.log("VehiclesAdded.find( " + JSON.stringify(query));
        let vehs = VehiclesAdded.find(query).fetch();
        // console.log("vehicles" + JSON.stringify(vehs));
        if (vehs) {
            vehs.forEach(function (vehicle) {
                console.log("generate VIN " + JSON.stringify(vehicle.vin));
                generatePdiValuesForOneVehicle(vehicle, "vin", "modelName", "Dealer Request Code", currentUserId, currentUserName)
            });
        }
    },

    'vehicles.generateAddedValues'(currentUserId, currentUserName, currentRole, currentPdiApproved,
                                   currentCompany, currentDealer) {
        // console.log("vehicles.generateAddedValues ");
        var query = {};
        if (currentRole != "Admin System") {
            query.dontfindanything = "YES";
        }
        if (currentCompany != "ALL") {
            query.make = currentCompany;
        }
        if (currentDealer != "ALL") {
            query.dealerName = currentDealer;
        }

        // console.log("VehiclesAdded.find( " + JSON.stringify(query));
        let vehs = VehiclesAdded.find(query).fetch();
        // console.log("vehicles" + JSON.stringify(vehs));
        if (vehs) {
            vehs.forEach(function (vehicle) {
                console.log("generate VIN " + JSON.stringify(vehicle.vin));
                generatePdiValuesForOneVehicle(vehicle, "vin", "modelName", "Dealer Request Code", currentUserId, currentUserName)
            });
        }
    },

    'vehicles.generateH100Values'(vin, vinField, modelField, vehicleTypeField, currentUserId, currentUserName, currentRole, currentPdiApproved,
                                  currentCompany, currentDealer) {
        console.log("vehicles.generateH100Values " + modelField + "/" + vehicleTypeField);
        let query = {"vin": vin};


        // todo add below checks for access rights

        // if (currentRole != "Admin System") {
        //     query.dontfindanything = "YES";
        // }
        //
        // if (currentCompany != "ALL") {
        //     query.make = currentCompany;
        // }
        // if (currentDealer != "ALL") {
        //     query.dealerName = currentDealer;
        // }

        //console.log("Vehicles.findOne( " + JSON.stringify(query));
        let veh = Vehicles.findOne(query);
        console.log("vehicles" + JSON.stringify(veh));
        if (veh) {
            console.log("generate H-100 for VIN " + JSON.stringify(veh.vin));
            generateH100ValForOneVehicle(veh, vinField, modelField, vehicleTypeField, currentUserId, currentUserName)
        } else {
            console.log("vehicles.generateH100Values vehicle vin " + vin + " NOT FOUND");
        }

    },
    'vehicles.create'(vehicle) {
        // console.log("vehicles.create");
        Vehicles.insert(vehicle);
    },
    'vehicles.update'(vehicle) {
        // console.log("vehicles.update");

        Vehicles.upsert({"vin": vehicle.vin}, {$set: vehicle});
    },
    'vehiclesadded.update'(vehicle) {
        // console.log("vehiclesadded.update");
        VehiclesAdded.upsert({"vin": vehicle.vin}, {$set: vehicle});
    },
    'vehiclesadded.removeOne'(vin) {
        // console.log("vehiclesadded.removeOne");
        VehiclesAdded.remove({"vin": vin});
    },
    'vehicles.removeall'() {
        // console.log("removeall");
        Vehicles.remove({});
    }
});