import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {VehicleTypes} from './vehicletypes.js';
import {Dealers} from './dealers.js';
import {ChecklistTemplates} from './checklisttemplates.js';
import {ChecklistValues} from './checklistvalues.js';
import {ChecklistMains} from './checklistmains.js';
import {VehiclesAdded} from './vehicles.js';

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

function storeError(vin, errorStr, errorFieldName, errorFieldValue, errorCollectionName) {
    // console.log(errorStr);
    let updates = {
        "errorStr": errorStr,
        "errorFieldName": errorFieldName,
        "errorFieldValue": errorFieldValue,
        "errorCollectionName": errorCollectionName
    };
    VehiclesAdded.upsert({"vin": vin}, {$set: updates}, function (err, res) {
        if (err) {
            console.log("Error at store error for vehicle upload")
        } else {
            // console.log("uploading.generateAllMainsForOneVehicle", JSON.stringify(res));
        }
    });
}

// call with this  typeGroups = ["PDI", "H100", "LS"];

function generateAllMainsForOneVehicle(vehicleRecord, groupList, currentUserId, currentUserName) {

    // console.log("generateAllMainsForOneVehicle vin: " + vehicle["vin"]);

    // Vehicle must have the following fields
    //
    // "vin",
    // "make",
    // "modelName",
    // "Dealer Request Code" => stored in field dealer and to read dealerName from collection dealers

    if (!vehicleRecord || !vehicleRecord["vin"] || !vehicleRecord["make"] || !vehicleRecord["modelName"] || !vehicleRecord["Dealer Request Code"]) {

        let vin = vehicleRecord ? (vehicleRecord["vin"] ? vehicleRecord["vin"] : null) : null;
        let missingField = !vehicleRecord["vin"] ? "vin"
            : (!vehicleRecord["make"] ? "make"
                : (!vehicleRecord["modelName"] ? "modelName"
                    : (!vehicleRecord["Dealer Request Code"] ? "Dealer Request Code" : "empty record")));

        storeError(vehicleRecord["vin"],
            ("ERROR! Missing obligatory field: " + missingField),
            missingField, null, "vehiclesadded");

        return;

    }
    // use to set/update these fields
    // modelName
    // Dealer Request Code
    // dealer
    // keyNo
    // location
    // rego

    let nowDate = new Date();

    let typesList = VehicleTypes.findOne({"modelName": vehicleRecord["modelName"]});
    // console.log("Typeslist : " + JSON.stringify(typesList));
    if (!typesList) {

        storeError(vehicleRecord["vin"],
            ("ERROR! No model name found model: " + vehicleRecord["modelName"]),
            "modelName", vehicleRecord["modelName"], "vehicletypes");

    } else {
        // console.log("uploading: TypesList: " + JSON.stringify(typesList));
        let dealerRecord = Dealers.findOne({"Incadea Dealer Code": vehicleRecord["Dealer Request Code"]});
        // console.log("generateValuesForOneVehicle dealerecord: " + JSON.stringify(dealerRecord));
        let dealerName = dealerRecord && dealerRecord["dealer"] ? dealerRecord["dealer"] : null;
        // console.log("generateValuesForOneVehicle dealer: " + dealerName);
        if (!dealerName) {

            storeError(vehicleRecord["vin"],
                ("Error: No dealer code found dealer code. "),
                "Dealer Request Code", vehicleRecord["Dealer Request Code"], "dealers");

        } else {

            let allMainsAdded = true;
            groupList.forEach(function (group) {
                // let group = "PDI";
                let groupField = group.toLowerCase() + "Type";

                if (!typesList[groupField]) {

                    storeError(vehicleRecord["vin"],
                        ("ERROR! No model name found. "),
                        "modelName", vehicleRecord["modelName"], "vehicletypes");

                } else {

                    let chkType = typesList && typesList[groupField] ? typesList[groupField] : null;

                    // check if mains already exist
                    let pdiMainsExisting = ChecklistMains.findOne({
                        "vin": vehicleRecord["vin"],
                        "checklisttype": chkType
                    }, {"vin": 1});

                    let vin = vehicleRecord["vin"].toUpperCase();

                    if (pdiMainsExisting && pdiMainsExisting.vin == vehicleRecord["vin"]) {
                        // console.log("NOTE not generating " + group + " mains, already exists for: " + chkType + " vin: " + vin);
                        // todo gets removed? remove at end Meteor.call('vehiclesadded.removeOne', vin);
                    } else {
                        // get template for checklist-type
                        let templateList = ChecklistTemplates.find({"checklisttype": chkType}).fetch();
                        // get newest template
                        if (!(templateList && templateList.length > 0)) {
                            allMainsAdded = false;

                            storeError(vehicleRecord["vin"],
                                ("Error: Cannot find template. "),
                                "checklisttype", chkType, "checklisttemplate");

                        } else {
                            let newestVersionTemplate = getNewestVersionTemplate(templateList);
                            // console.log("newest Template  " + JSON.stringify(newestVersionTemplate.version));
                            if (newestVersionTemplate) {
                                // compute mains record report for checklist group

                                let mainsRecord = {};
                                mainsRecord["roNumber"] = "";
                                mainsRecord["odometer"] = "";
                                mainsRecord["vin"] = vehicleRecord["vin"]; //
                                mainsRecord["rego"] = vehicleRecord["rego"] ? vehicleRecord["rego"] : ""; //
                                mainsRecord["make"] = vehicleRecord["make"]; //
                                mainsRecord["modelName"] = vehicleRecord["modelName"]; //
                                mainsRecord["colour"] = vehicleRecord["colour"] ? vehicleRecord["colour"] : ""; //
                                mainsRecord["keyNo"] = vehicleRecord["keyNo"] ? vehicleRecord["keyNo"] : ""; //
                                mainsRecord["dealerName"] = dealerName; //
                                mainsRecord["updatedAt"] = "--"; //
                                mainsRecord["status"] = "No " + group + " Check done yet"; //
                                mainsRecord["checklisttype"] = chkType; //
                                mainsRecord["checklisttypegroup"] = group; //
                                mainsRecord["id"] = group + "none" + vehicleRecord["vin"];
                                //+"000"; //
                                mainsRecord["version"] = "--"; // try version later //  newestVersionTemplate.version;
                                mainsRecord["regoUpdated"] = "";
                                mainsRecord["location"] = "";
                                mainsRecord["uploadedAt"] = nowDate; //

                                mainsRecord["createdAt"] = "--"; //
                                mainsRecord["dealer"] = vehicleRecord["Dealer Request Code"];
                                mainsRecord["numDone"] = "--"; //
                                mainsRecord["signaturePic"] = "";
                                mainsRecord["signatureManPic"] = "";
                                mainsRecord["techDateSigned"] = "--"; //
                                mainsRecord["smanDateSigned"] = "--"; //
                                mainsRecord["techUserName"] = "--"; //
                                mainsRecord["smanUserName"] = "--"; //
                                mainsRecord["lastEditUserName"] = "--"; //
                                mainsRecord["lastEditUserId"] = "--"; //

                                mainsRecord["mid"] = ""; // set to empty string when no check of this group done yet for this vehicle

                                // todo do I need lastUpdated, should be updatedAt or?

                                let len = vehicleRecord["vin"].length;
                                mainsRecord["vinLast"] = vehicleRecord["vin"].substr(len - 6, 6);
                                mainsRecord["vinLast3"] = mainsRecord["vinLast"].substr(0, 3);
                                mainsRecord["vinLast4"] = mainsRecord["vinLast"].substr(0, 4);
                                mainsRecord["vinLast5"] = mainsRecord["vinLast"].substr(0, 5);

                                let query_object = {
                                    "id": mainsRecord["id"]
                                };
                                if (Meteor.isServer) {
                                    ChecklistMains.upsert(query_object, {$set: mainsRecord}, function (err, res) {
                                        if (err) {
                                            console.log("Error at uploading.generateAllMainsForOneVehicle - mains upsert ")
                                        } else {
                                            // console.log("uploading.generateAllMainsForOneVehicle", JSON.stringify(res));
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            });
            let newVehicle = _.clone(vehicleRecord);

            // todo which extra fields might be needed
            newVehicle["createdAt"] = nowDate;
            Meteor.call('vehicles.create', vehicleRecord);
            if (allMainsAdded) {
                Meteor.call('vehiclesadded.removeOne', vehicleRecord.vin);
            }
            // write checklistvalues report for pdi
        }
    }
}

function buildUpdateSet(existingMains, updatedMains) {
    // console.log("buildUpdateSet ");
    // console.log("buildUpdateSet " + JSON.stringify(existingMains));
    // console.log("buildUpdateSet " + JSON.stringify(updatedMains));
    let keyList = ["rego", "modelName", "colour", "keyNo", "dealer", "dealerName"];
    let keyListUppercase = ["make"];
    let set = {};
    let foundDifference = false;

    keyList.forEach(function (keyName) {
        if (updatedMains[keyName]) {
            if (!existingMains[keyName] || (existingMains[keyName] != updatedMains[keyName])) {
                set[keyName] = updatedMains[keyName];
                foundDifference = true;
            }
        }
    });

    keyListUppercase.forEach(function (keyName) {
        if (updatedMains[keyName]) {
            if (!existingMains[keyName] || (existingMains[keyName] != updatedMains[keyName].toUpperCase())) {
                set[keyName] = updatedMains[keyName].toUpperCase();
                foundDifference = true;
            }
        }
    });

    if (foundDifference == true) {
        return set;
    } else {
        return null;
    }
}

function updateInputFields(updatedKeys, updateValues, newValuesList) {

    updatedKeys.forEach(function(kk) {
       let vv = _.find(newValuesList, function(ele) {
           return ele["dbfield"] == kk;
       });
       let newValue = vv ? updateValues[kk] : null;
       if (newValue) { vv.value = newValue; }

    });
    return newValuesList;
}

function generateOrUpdateAllMainsAndValuesForOneVehicle(vehicleRecord, groupList, currentUserId, currentUserName) {

    console.log("generateOrUpdateAllMainsAndValuesForOneVehicle vin: " + vehicleRecord["vin"]);

    let statusesList = ["No PDI Check done yet", "No H100 Check done yet", "No LS Check done yet", "No Body Check done yet",
        "new", "pending", "failed-pending", "ready to submit"];

    let options = {
        weekday: "short", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    // Vehicle must have the following fields
    //
    // "vin",
    // "make",
    // "modelName",
    // "Dealer Request Code" => stored in field dealer and to read dealerName from collection dealers

    if (!vehicleRecord["Dealer Request Code"]) {
        vehicleRecord["Dealer Request Code"] = "HANZ";
    }
    if (!vehicleRecord["make"]) {
        vehicleRecord["make"] = "HYUNDAI";
    }


    if (!vehicleRecord || !vehicleRecord["vin"] || !vehicleRecord["make"] || !vehicleRecord["modelName"] || !vehicleRecord["Dealer Request Code"]) {

        let vin = vehicleRecord ? (vehicleRecord["vin"] ? vehicleRecord["vin"] : null) : null;
        let missingField = !vehicleRecord["vin"] ? "vin"
            : (!vehicleRecord["make"] ? "make"
                : (!vehicleRecord["modelName"] ? "modelName"
                    : (!vehicleRecord["Dealer Request Code"] ? "Dealer Request Code" : "empty record")));

        storeError(vehicleRecord["vin"],
            ("ERROR! Missing obligatory field. "),
            missingField, null, "vehiclesadded");

        return;

    }
    // use to set/update these fields
    // modelName
    // Dealer Request Code
    // dealer
    // keyNo
    // location
    // rego

    vehicleRecord["vin"] = vehicleRecord["vin"].toUpperCase();
    vehicleRecord["make"] = vehicleRecord["make"].toUpperCase();
    vehicleRecord["Dealer Request Code"] = vehicleRecord["Dealer Request Code"].toUpperCase();
    if (vehicleRecord["Dealer Request Code"].length == 0) {
        vehicleRecord["Dealer Request Code"] = "HANZ";
    }

    let nowDate = new Date();

    let typesList = VehicleTypes.findOne({"modelName": vehicleRecord["modelName"]});
    // console.log("Typeslist : " + JSON.stringify(typesList));
    if (!typesList) {

        storeError(vehicleRecord["vin"],
            ("ERROR! No model name found. "),
            "modelName", vehicleRecord["modelName"], "vehicletypes");

    } else {
        // console.log("uploading: TypesList: " + JSON.stringify(typesList));

        let dealerRecord = Dealers.findOne({"Incadea Dealer Code": vehicleRecord["Dealer Request Code"]});
        // console.log("generateOrUpdateAllMainsAndValuesForOneVehicle dealerecord: " + JSON.stringify(dealerRecord));
        let dealerName = dealerRecord && dealerRecord["dealer"] ? dealerRecord["dealer"] : null;
        // console.log("generateOrUpdateAllMainsAndValuesForOneVehicle dealer: " + dealerName);
        if (!dealerName) {

            storeError(vehicleRecord["vin"],
                ("Error: No dealer code found. "),
                "Dealer Request Code", vehicleRecord["Dealer Request Code"], "dealers");

        } else {
            vehicleRecord["dealerName"] = dealerName;
            let allMainsAdded = true;
            groupList.forEach(function (group) {
                // let group = "PDI";
                let chkTypeField = group.toLowerCase() + "Type";

                if (!typesList[chkTypeField]) {

                    storeError(vehicleRecord["vin"],
                        ("ERROR! No model name found. "),
                        "modelName", vehicleRecord["modelName"], "vehicletypes");

                } else {

                    let chkType = typesList && typesList[chkTypeField] ? typesList[chkTypeField] : null;
                    if (chkTypeField == 'bodyType'){ chkType = 'Body';}
		    vehicleRecord["checklisttype"] = chkType;

		

                    // check if mains already exist
                    let mainsExisting = ChecklistMains.find({
                        "vin": vehicleRecord["vin"],
                        "checklisttypegroup": group
                    }).fetch();

                    //
                    // UPDATE PART
                    //

                    if (mainsExisting && mainsExisting.length > 0) {
                        // console.log("generateOrUpdateAllMainsAndValuesForOneVehicle UPDATE"); // mains : " + JSON.stringify(mainsExisting));
                        mainsExisting.forEach(function (mainsRecord) {
                            if (chkType != mainsRecord["checklisttype"]) {

                                storeError(vehicleRecord["vin"],
                                    ("ERROR! Checklisttype changing from: " + mainsRecord["checklisttype"] + " to: " + vehicleRecord["checklisttype"]
                                    + " cannot update these changes"),
                                    "modelName", vehicleRecord["modelName"], "vehicletypes");

                            } else {
                                // only update not submitted
                                if (statusesList.indexOf(mainsRecord.status) >= 0) {
                                    let updateSet = buildUpdateSet(mainsRecord, vehicleRecord);
                                    // console.log("generateOrUpdateAllMainsAndValuesForOneVehicle updating " + JSON.stringify(updateSet));
                                    if (updateSet) {

                                        updateSet.updatedAt = new Date();
                                        updateSet["last update"] = updateSet.updatedAt.toLocaleTimeString("en-NZ", options);
                                        if (Meteor.isServer) {
                                            ChecklistMains.upsert({"_id": mainsRecord._id},
                                                {$set: updateSet}, function (err, res) {
                                                    if (err) {
                                                        console.log("Error at uploading.generateOrUpdateAllMainsAndValuesForOneVehicle - mains upsert ")
                                                    } else {
                                                    //     console.log("Updating mains " + group + " mains, update fields: " + JSON.stringify(updateSet)
                                                    //         + " vin: " + vehicleRecord["vin"]);
                                                    }
                                                });
                                        }

                                        //
                                        // update values records
                                        // ----------------------
                                        let updatedValues = _.pick(updateSet, "rego", "make", "modelName", "colour", "keyNo", "dealerName");
                                        let updatedKeys = _.keys(updatedValues);
                                        if (updatedKeys.length > 0) {
                                         if (Meteor.isServer) {
                                                let valuesRecord = ChecklistValues.findOne({"mid": mainsRecord["id"]});
                                                if (valuesRecord) {
                                                    newValuesList = updateInputFields(updatedKeys, updatedValues, valuesRecord["valueslist"]);
                                                    updatedValues["valueslist"] = newValuesList;

                                                    // console.log ("ChecklistMains.upsert UPD " + JSON.stringify({"_id": valuesRecord["_id"]}));
                                                    // console.log ("ChecklistMains.upsert UPD-set " + JSON.stringify(updatedValues));
                                                    
						    console.log("CHECKLISTMAINS UPDATE", {
  								collection: "ChecklistMains",
								operation: "update",
								recordId: mainsRecord._id,
								changes: updateSet,
								fullQuery: {
								    query: { _id: mainsRecord._id },
								    update: { $set: updateSet }
								}
							});
                                                    
                                                    ChecklistValues.upsert({"_id": valuesRecord["_id"]}, {$set: updatedValues}, function (err, res) {
                                                            if (err) {
                                                                console.log("Error at uploading.generateOrUpdateAllMainsAndValuesForOneVehicle - mains upsert ")
                                                            } else {
                                                                // console.log("Updating mains " + group + " mains, update fields: " + JSON.stringify(updateSet) + " vin: " + vin);
                                                            }
                                                        }
                                                    );
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        //
                        // update in vehicles collection
                        // ------------------------------
                        let updatedVehicle = _.omit(vehicleRecord, "_id");

                        // todo which extra fields might be needed
                        updatedVehicle["createdAt"] = nowDate;
                        updatedVehicle["created"] = updatedVehicle["createdAt"].toLocaleTimeString("en-NZ", options);
                        Meteor.call('vehicles.update', updatedVehicle);

                        // todo gets removed? remove at end Meteor.call('vehiclesadded.removeOne', vehicleRecord["vin"]);
                    } else {
                        // console.log("generateOrUpdateAllMainsAndValuesForOneVehicle NEW" + vehicleRecord["vin"]); // mains : " + JSON.stringify(mainsExisting));

                        // get template for checklist-type
                        let templateList = ChecklistTemplates.find({"checklisttype": chkType}).fetch();
                        // get newest template
                        if (!(templateList && templateList.length > 0)) {
                            allMainsAdded = false;

                            storeError(vehicleRecord["vin"],
                                ("Error: Cannot find template. "),
                                "checklisttype", chkType, "checklisttemplate");

                        } else {
                            let newestVersionTemplate = getNewestVersionTemplate(templateList);
                            // console.log("newest Template  " + JSON.stringify(newestVersionTemplate.version));
                            if (newestVersionTemplate) {
                                // compute mains record report for checklist group

                                let newMainsRecord = {};
                                newMainsRecord["roNumber"] = "";
                                newMainsRecord["odometer"] = "";
                                newMainsRecord["vin"] = vehicleRecord["vin"]; //
                                newMainsRecord["rego"] = vehicleRecord["rego"] ? vehicleRecord["rego"] : ""; //
                                newMainsRecord["make"] = vehicleRecord["make"]; //
                                newMainsRecord["modelName"] = vehicleRecord["modelName"]; //
                                newMainsRecord["colour"] = vehicleRecord["colour"] ? vehicleRecord["colour"] : ""; //
                                newMainsRecord["keyNo"] = vehicleRecord["keyNo"] ? vehicleRecord["keyNo"] : ""; //
                                newMainsRecord["dealerName"] = dealerName; //
                                newMainsRecord["updatedAt"] = "--"; //
                                newMainsRecord["status"] = "No " + group + " Check done yet"; //
                                newMainsRecord["checklisttype"] = chkType; //
                                newMainsRecord["checklisttypegroup"] = group; //
                                newMainsRecord["id"] = group + "none" + vehicleRecord["vin"];
                                // +"000"; //
                                newMainsRecord["version"] = newestVersionTemplate.version;
                                newMainsRecord["regoUpdated"] = "";
                                newMainsRecord["location"] = "";
                                newMainsRecord["uploadedAt"] = nowDate; //

                                newMainsRecord["createdAt"] = "--"; //
                                newMainsRecord["dealer"] = vehicleRecord["Dealer Request Code"];
                                newMainsRecord["numDone"] = "--"; //
                                newMainsRecord["signaturePic"] = "";
                                newMainsRecord["signatureManPic"] = "";
                                newMainsRecord["techDateSigned"] = "--"; //
                                newMainsRecord["smanDateSigned"] = "--"; //
                                newMainsRecord["techUserName"] = "--"; //
                                newMainsRecord["smanUserName"] = "--"; //
                                newMainsRecord["lastEditUserName"] = "--"; //
                                newMainsRecord["lastEditUserId"] = "--"; //

                                newMainsRecord["mid"] = ""; // set to empty string when no check of this group done yet for this vehicle

                                // todo do I need lastUpdated, should be updatedAt or?

                                let len = vehicleRecord["vin"].length;
                                newMainsRecord["vinLast"] = vehicleRecord["vin"].substr(len - 6, 6);
                                newMainsRecord["vinLast3"] = newMainsRecord["vinLast"].substr(0, 3);
                                newMainsRecord["vinLast4"] = newMainsRecord["vinLast"].substr(0, 4);
                                newMainsRecord["vinLast5"] = newMainsRecord["vinLast"].substr(0, 5);

                                let query_object = {
                                    "id": newMainsRecord["id"]
                                };

				console.log("CHECKLISTMAINS UPSERT (NEW RECORD)", {
  						collection: "ChecklistMains",
						operation: "upsert",
						query: query_object,
						data: newMainsRecord,
						  fullQuery: {
							   query: query_object,
							   update: { $set: newMainsRecord },
							   options: { upsert: true }
							  }
						});	

                                if (Meteor.isServer) {
                                    console.log ("ChecklistMains.upsert NEW " + JSON.stringify(query_object));
                                    ChecklistMains.upsert(query_object, {$set: newMainsRecord}, function (err, res) {
                                        if (err) {
                                            console.log("Error at uploading.generateOrUpdateAllMainsAndValuesForOneVehicle - mains upsert ")
                                        } else {
                                            // console.log("uploading.generateOrUpdateAllMainsAndValuesForOneVehicle NEW ", JSON.stringify(res));
                                        }
                                    });
                                }
                            }
                        }
                        let newVehicle = _.omit(vehicleRecord, "_id");
                        // console.log("generateOrUpdateAllMainsAndValuesForOneVehicle create vehicle " + JSON.stringify(newVehicle));

                        // todo which extra fields might be needed
                        newVehicle["createdAt"] = nowDate;
                        Meteor.call('vehicles.update', newVehicle);
                    }
                }
            });

            if (allMainsAdded) {
                Meteor.call('vehiclesadded.removeOne', vehicleRecord.vin);
            }
            // write checklistvalues report for pdi
        }
    }
}

Meteor.methods({
    'uploading.uploadNewVehicles'(groups, currentUserId, currentUserName, currentRole, currentPdiApproved,
                                  currentCompany, currentDealer) {
        // console.log("uploading.uploadNewVehicles ");
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
        if (vehs) {
            /// !! leave log in
            console.log("uploading.uploadNewVehicles num in vehiclesadded " + JSON.stringify(vehs.length));
        }
        if (vehs) {
            vehs.forEach(function (vehicle) {
                // console.log("upload VIN " + JSON.stringify(vehicle.vin));
                generateAllMainsForOneVehicle(vehicle, groups, currentUserId, currentUserName)
            });
        }
        /// !! leave log in
        console.log("uploading.uploadNewVehicles FINISHED ");
    },

    'uploading.uploadAndUpdateNewVehicles'(groups, currentUserId, currentUserName, currentRole, currentPdiApproved,
                                           currentCompany, currentDealer) {
        // console.log("uploading.uploadAndUpdateNewVehicles ");
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

	//SSJ code over write
	//query['Dealer Request Code']='WINGERAUCK';

        // console.log("VehiclesAdded.find( " + JSON.stringify(query));
        let vehs = VehiclesAdded.find(query).fetch();
        if (vehs) {
            console.log("uploading.uploadAndUpdateNewVehicles num in vehiclesadded " + JSON.stringify(vehs.length));
        }
        if (vehs) {
            vehs.forEach(function (vehicle) {
                console.log("upload VIN " + JSON.stringify(vehicle.vin));
		console.log("upload Dealer Request Code " + JSON.stringify(vehicle['Dealer Request Code']));
                generateOrUpdateAllMainsAndValuesForOneVehicle(vehicle, groups, currentUserId, currentUserName)
            });
        }
        console.log("uploading.uploadAndUpdateNewVehicles FINISHED ");
    },

    'uploading.listnewmodels'(groups, currentUserId, currentUserName, currentRole, currentPdiApproved,
                                           currentCompany, currentDealer) {
        // console.log("uploading.listnewmodels " + currentCompany);
        var query = {};
        if (currentCompany && currentCompany.length > 0 && currentCompany != "ALL") {
            query["make"] = currentCompany;
        }
        if (currentDealer && currentDealer.length > 0 && currentDealer != "ALL") {
            // find dealer all Dealer Request Code
            // "Dealer Request Code": {$in: ["PUKEKOHEWH", "TARAN"]}}
            // query["profile.dealer"] = currentDealer;
        }
        query["errorFieldName"] = "modelName";
        // console.log("uploading.listnewmodels query " + JSON.stringify(query));
        let modelList = VehiclesAdded.find(query).fetch();
        let result = [];

        let modelslist = [];
        modelList.forEach(function(nextModel) {
            // var fitCompany =  company == "ALL" || uu.profile.company == company;
            // var fitDealer =  dealer == "ALL" || uu.profile.dealer == dealer;
            // if (fitCompany && fitDealer) {

            // already in results?
            let given = _.find(result, function(rr) {
                return rr["Model Name"] == nextModel.errorFieldValue
            });

            if (given) {
                given["Num Vehicles"] = "" + (parseInt(given["Num Vehicles"]) + 1);
            } else {
                let rline = {
                    "Model Name": nextModel.errorFieldValue,
                    "Num Vehicles": "1",
                    "Status": "new"
                };
                result.push(rline);
                modelslist.push(nextModel.errorFieldValue);
            }

        });

        let vehicletypes = VehicleTypes.find({"modelName": {$in: modelslist}}).fetch();

        vehicletypes.forEach(function(vt){
            let found = _.find(result, function(rr) {
                return rr["Model Name"] == vt.modelName
            });
            if (found) {
                found.Status = "is in database";
                found.vehicleType = vt.vehicleType;
                    found.bodyType = vt.bodyType;
                    found.pdiType = vt.pdiType;
                    found.h100Type = vt.h100Type;
                    found.lsType = vt.lsType;
            }
        });

        // console.log("uploading.listnewmodels result " + JSON.stringify(result));
        return result;
    },
    'uploading.listnewincadeadealers'(groups, currentUserId, currentUserName, currentRole, currentPdiApproved,
                                      currentCompany, currentDealer) {

        // EXAMPLE:
        //     "make" : "HYUNDAI",
        //     "errorStr" : "Error: No dealer code found. ",
        //     "errorFieldName" : "Dealer Request Code",
        //     "errorFieldValue" : "MAJESTIC",
        //     "errorCollectionName" : "dealers"


        // "_id" : ObjectId("594c8f2b1a9bdf599c7916b4"),
        //         "Has account" : "YES",
        //         "Dealer Name Service Promise" : "Rotorua Hyundai",
        // *** >>  "Dealer Code" : "00120",
        // *** >>  "Active" : "Yes",
        // *** >>  "dealer" : "Rotorua Hyundai",
        //        "Dealer Name CCC" : "Rotorua Hyundai",
        // *** I   "Incadea Dealer Name" : "Rotorua Hyundai",
        // <III <  "Incadea Dealer Code" : "ROTORUA",
        //     I   "Dealer Type Incadea" : "Vehicle",
        // *** I   "Dealer No Incadea" : 13260,
        // *** I   "City Incadea" : "Rotorua",
        // ***    "Passenger or Commercial" : "",
        // <III <  "company" : "HYUNDAI",
        // *** >>  "Importer" : 0,
        // "Xxx" : "Xxx"

        
        var query = {};
        if (currentCompany && currentCompany.length > 0 && currentCompany != "ALL") {
            query["make"] = currentCompany;
        }
        if (currentDealer && currentDealer.length > 0 && currentDealer != "ALL") {
            // find dealer all Dealer Request Code
            // "Dealer Request Code": {$in: ["PUKEKOHEWH", "TARAN"]}}
            // query["profile.dealer"] = currentDealer;
        }
        query["errorFieldName"] = "Dealer Request Code";
        // console.log("uploading.listnewincadeadealers query " + JSON.stringify(query));
        let dealerErrorsList = VehiclesAdded.find(query).fetch();
        // console.log("uploading.listnewincadeadealers dealerErrorsList " + JSON.stringify(dealerErrorsList));

        let result = [];

        let dealerCodesList = [];
        dealerErrorsList.forEach(function(nextDealer) {

            // console.log("uploading.listnewincadeadealers dealerErrorsList " + JSON.stringify(nextDealer));
            // already in results?
            let given = _.find(result, function(rr) {
                return rr["Dealer Request Code"] == nextDealer.errorFieldValue
            });

            if (given) {
                given["Num Vehicles"] = "" + (parseInt(given["Num Vehicles"]) + 1);
                if (given["Incadea Dealer Name"].length == 0) {
                    given["Incadea Dealer Name"] = nextDealer["Incadea Dealer Name"] ? nextDealer["Incadea Dealer Name"] : ""
                }
                if (given["Incadea Dealer No"].length == 0) {
                    given["Incadea Dealer No"] = nextDealer["Incadea Dealer No"] ? nextDealer["Incadea Dealer No"] : ""
                }
                if (given["Incadea City"].length == 0) {
                    given["Incadea City"] = nextDealer["Incadea City"] ? nextDealer["Incadea City"] : ""
                }
            } else {
                let rline = {
                    "Dealer Request Code": nextDealer.errorFieldValue,
                    "Num Vehicles": "1",
                    "Status": "new",
                    "Incadea Dealer Name": nextDealer["Incadea Dealer Name"] ? nextDealer["Incadea Dealer Name"] : "",
                    "Incadea Dealer No": nextDealer["Incadea Dealer No"] ? nextDealer["Incadea Dealer No"] : "",
                    "Incadea City": nextDealer["Incadea City"] ? nextDealer["Incadea City"] : "",
                    "company": nextDealer["make"] ? nextDealer["make"] : "",
                    "Connected Dealer": ""
                };
                result.push(rline);
                // console.log("uploading.listnewincadeadealers rline " + JSON.stringify(rline));
                dealerCodesList.push(nextDealer.errorFieldValue);
            }
        });

        // check if already in collection
        let dealercodes = Dealers.find({"Incadea Dealer Code": {$in: dealerCodesList}}).fetch();
        console.log("uploading.listnewincadeadealers found " + JSON.stringify(dealercodes));

        if (dealercodes && dealercodes.length > 0) {
            dealercodes.forEach(function (vt) {
                console.log("uploading.listnewincadeadealers vt " + JSON.stringify(vt["Incadea Dealer Code"]));
                let found = _.find(result, function (rr) {
                    console.log("uploading.listnewincadeadealers rline " + JSON.stringify(rr));
                    return rr["Dealer Request Code"] == vt["Incadea Dealer Code"]
                });
                if (found) {
                    found.Status = "is in database";
                    found["Connected Dealer"] = vt.dealer;
                    found["Dealer Code"] = vt["Dealer Code"];
                    found["isActive"] = vt["isActive"];
                    found["isImporter"] = vt["Importer"] == 1;

                    console.log("uploading.listnewincadeadealers found " + JSON.stringify(found));

                }
            });
        }

        // console.log("uploading.listnewincadeadealers dealerErrorsList " + JSON.stringify(result));
        return result;

    }

});
