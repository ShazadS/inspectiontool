var getFlowStageSugarCRMSelectNewVehicleDataStr = function () {
    var selectstr = "SELECT TOP (3) " +
        "[RecordID] AS 'rowversion', " +
        "[VIN] AS 'vin', " +
        "[RegistrationNumber] AS 'rego', " +
        "' ' AS [Purchase Invoice Date], " +
        "[PurchaseReceiptDate] AS [Purchase Receipt Date], " +
        "[CreationDate] AS [Creation Date], " +
        "[ModelName] AS 'modelName', " +
        "[Colour] as 'colour', " +
        "' ' AS 'KeyNo', " +
        "[DealerCode] AS 'Dealer Request Code', " +
        "[DealerName] AS 'Incadea Dealer Name', " +
        "[DealerNumber] AS 'Incadea Dealer No', " +
        "[DealerCity] AS 'Incadea City', " +
        "[Make] AS 'make', " +
        "GETDATE() AS 'Updated by Cron Job AT', " +
        "'SugarCRM-FlowStage-DB' AS 'DataSource' " +
        "FROM [IncadeaSugarCRMStaging].[dbo].[SugarCRMInspectionToolVehicles] " +
        "WHERE [SyncStatus] = '1' and  [Make] = 'HYUNDAI';";

    console.log("SELECTSTR : " + selectstr);

    return selectstr;
};

if (Meteor.isServer) {
    SyncedCron.start();
    SyncedCron.add({
        name: 'Get Hyundai new Vehicles Data for Inspection via FlowStage',
        schedule: function (parser) {
            return parser.text("every 5 minutes");
        },
        job: function () {
            let data = [];
            Sql.connection = new Sql.driver.Connection({
                server: "10.92.43.18",
                database: "IncadeaSugarCRMStaging",
                user: "IncadeaSugarCRM",
                password: "IncadeaSugarCRM786!",
                options: {
                    useUTC: false,
                    appName: "MeteorApp"
                },
                connectionTimeout: 300000,
                requestTimeout: 300000,
                pool: {
                    idleTimeoutMillis: 300000,
                    max: 100
                }
            }, Meteor.bindEnvironment(function (err) {
                if (err) {
                    console.error("1. Can't connect to FlowStage DB: ", err);
                    return;
                } else {
                    var selectstr = getFlowStageSugarCRMSelectNewVehicleDataStr();
                    try {
                        data = Sql.q(selectstr);
                        if (data && data.length > 0) {
                            console.log("new vehicle data / num: " + data.length);
                            //console.dir(data[0], { depth: null, colors: true }); 
                            console.log("new vehicle data / first: " + JSON.stringify(data[0]));
                            let numAdded = 0;
                            let vins = data.map(record => record.vin);
                            data.forEach(function (added) {
                                Meteor.call('vehiclesadded.update', added);
                                numAdded++;
                            });

                            // Update SyncStatus to 2 for all VINs in a single query
                            let updateStr = "UPDATE [IncadeaSugarCRMStaging].[dbo].[SugarCRMInspectionToolVehicles] " +
                                "SET [SyncStatus] = '2' " +
                                "WHERE [VIN] IN ('" + vins.join("','") + "');";
                            try {
                                Sql.q(updateStr);
                                console.log("Updated SyncStatus to 2 for VINs: " + vins.join(", "));
				console.log("UPDATESTR : " + updateStr);
                            } catch (updateError) {
                                console.error("Error updating SyncStatus for VINs: ", updateError);
                            }

			/* let uploadUser = { "id": "uploadid",  "username": "upload",
                            "role":"Admin System", "pdiApproved": true, "company": "ALL", "dealer": "ALL"}
                            Meteor.call('uploading.uploadAndUpdateNewVehicles', ["PDI", "H100", "Body", "LS"],
                                uploadUser.id, uploadUser.username,
                                uploadUser.role, uploadUser.pdiApproved,
                                uploadUser.company, uploadUser.dealer);
			*/	

                        } else {
                            console.log("No data found in FlowStage DB");
                        }
	
			let uploadUser = { "id": "uploadid",  "username": "upload",
                            "role":"Admin System", "pdiApproved": true, "company": "ALL", "dealer": "ALL"}
                            Meteor.call('uploading.uploadAndUpdateNewVehicles', ["PDI", "H100", "Body", "LS"],
                                uploadUser.id, uploadUser.username,
                                uploadUser.role, uploadUser.pdiApproved,
                                uploadUser.company, uploadUser.dealer);

                    } catch (e) {
                        console.error("Error executing query for new vehicle data shazad: ", e);
                    }
                }
            }));
        }
    });
}
