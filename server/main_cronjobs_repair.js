import fs from 'fs';
let dbincadea = [];
// // todo set isuzu db name
// //dbincadea["isuzu"] = "[Hyundai Motors New Zealand Ltd$";
dbincadea["hyundai"] = "[Hyundai Motors New Zealand Ltd"; // properties.get('hyundai.incadeaDatabase'); // Meteor.settings.incadeaDatabaseHyundai;// "[Hyundai Motors New Zealand Ltd";

var getIncadeaSelectNewVehicleDataStr = function (company, rowversionStr) {

    // let rowversionStr = "1379990472";
    var selstr =
        "SELECT "
        + " convert(bigint, " + dbincadea[company] + "$Vehicle].[timestamp]) AS 'rowversion',"
        + " " + dbincadea[company] + "$Vehicle].[VIN] AS 'vin',"
        + " " + dbincadea[company] + "$Vehicle].[License No_]  AS 'rego',"
        + " " + dbincadea[company] + "$Vehicle].[Purchase Invoice Date],"
        + " " + dbincadea[company] + "$Vehicle].[Purchase Receipt Date],"
        + " " + dbincadea[company] + "$Vehicle].[Creation Date],"
        + " " + dbincadea[company] + "$Vehicle].Model AS 'modelName',"
        + " " + dbincadea[company] + "$Vehicle Option].[Description] as colour,"
        + " ' ' AS 'KeyNo',"
        + " " + dbincadea[company] + "$Vehicle].[Dealer Request Code] as 'Dealer Request Code',"
        + " " + dbincadea[company] + "$Customer].[Name] as 'Incadea Dealer Name',"
        + " " + dbincadea[company] + "$Customer].[No_] as 'Incadea Dealer No',"
        + " " + dbincadea[company] + "$Customer].[City] as 'Incadea City',"
        + " 'HYUNDAI' as 'make'"
        + " FROM " + dbincadea[company] + "$Vehicle] "
        + " JOIN " + dbincadea[company] + "$Vehicle Option] "
        + " ON " + dbincadea[company] + "$Vehicle Option].[VIN] = " + dbincadea[company] + "$Vehicle].[VIN]"
        + " AND " + dbincadea[company] + "$Vehicle Option].[Option Type] = '1'"

        + " JOIN " + dbincadea[company] + "$Dealer Customer] "
        + " ON " + dbincadea[company] + "$Dealer Customer].[Dealer Code] = " + dbincadea[company] + "$Vehicle].[Dealer Request Code]"
        + " JOIN " + dbincadea[company] + "$Customer] "
        + " ON " + dbincadea[company] + "$Customer].[No_] = " + dbincadea[company] + "$Dealer Customer].[Customer No_]"
        + " WHERE " //+ dbincadea[company] + "$Vehicle].[timestamp] > CONVERT(ROWVERSION, " + rowversionStr + ") "
	 + " [Hyundai Motors New Zealand Ltd$Vehicle].vin in ('TMAJ3813MKJ824042','TMAJ3813MKJ824042','TMAJ3813MKJ824680','TMAJ3813MKJ824704') "
        + " ORDER BY " + dbincadea[company] + "$Vehicle].[timestamp]  ASC ";

    console.log("SELECTSTR : " + selstr);
    return selstr;
};

if (Meteor.isServer) {

    SyncedCron.start();
    SyncedCron.add({
        name: 'Check for overwritten dealernames in collection checklistmains ',
        schedule: function (parser) {
            // parser is a later.parse object
            return parser.recur().on(8,9,10,11,12,13,14,15,16,17,18,19,20,21,22).hour();
            //return parser.text("every 15 minutes");
        },
        job: function () {

            let uploadUser = { "id": "uploadid",  "username": "upload",
                "role":"Admin System", "pdiApproved": true, "company": "ALL", "dealer": "ALL"};
            Meteor.call('repair.checkForDealerChangedWrongly',uploadUser.id, uploadUser.username,uploadUser.role,uploadUser.company, uploadUser.dealer);

        }

    });
}
