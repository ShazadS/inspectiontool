import '../imports/startup/server/main.js';
import '../imports/api/repair.js';
import '../imports/api/checklisttemplates.js';
import '../imports/api/checklistmains.js';
import '../imports/api/checklistvalues.js';
import '../imports/api/server/checklistvalues_methods.js';
import '../imports/api/history.js';
import '../imports/api/vehicles.js';
import '../imports/api/locations.js';
import '../imports/api/roles.js';
import '../imports/api/dealers.js';
import '../imports/api/dealersshort.js';
import '../imports/api/companies.js';
import '../imports/api/typeofchecks.js';
import '../imports/api/userdata.js';
import '../imports/api/lostdataafterphotoproblem.js';
import '../imports/api/checkfordealerchangedwrongly.js';

import '../imports/api/uploading.js';
import '../imports/utilities/pdfprint.js';
import '../imports/utilities/users.js';
import '../imports/utilities/propdata.js';
import {ChecklistValues} from '../imports/api/checklistvalues.js';
import {ChecklistMains} from '../imports/api/checklistmains.js';

import {ChecklistTemplates} from '../imports/api/checklisttemplates.js';
import {Dealers} from '../imports/api/dealers.js';
import {DealersShort} from '../imports/api/dealersshort.js';

import PropertiesReader from 'properties-reader';
import {pdfTemplateFromMongo} from '../imports/utilities/pdfprint.js';
import {checklistvaluesFind} from '../imports/api/checklistvalues.js';
import {Accounts} from 'meteor/accounts-base';

Meteor.startup(() => {

    if (Meteor.isServer) {
        console.log("startup START server");
    } else {
        console.log("startup START client");
    }

    // mail server
    smtp = {
        username: 'ib4t',         // not needed
        password: 'Ib4t2050',     // not needed
        server: '192.168.175.127',
        port: 25
    };

    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port + '/';

    var properties = PropertiesReader(process.env.PWD + '/../properties.prop');

    var servername = properties.get('main.servername');

    console.log("servername " + servername);
    Meteor.call("propdata.upsert.servername", servername);
    //Session.set("server",servername);

    ChecklistMains._ensureIndex({
        '_id': 1
    });
    ChecklistValues._ensureIndex({
        'id': 1
    });
    ChecklistMains._ensureIndex({
        'checklisttypegroup': 1,
        "vinLast": 1,
        "status": 1,
        "make": 1
    });
    ChecklistMains._ensureIndex({
        'checklisttypegroup': 1,
        "vin": 1,
        "status": 1,
        "make": 1
    });
    ChecklistMains._ensureIndex({
        'checklisttypegroup': 1,
        "vinLast": 1,
        "status": 1,
        "dealerName": 1,
        "make": 1
    });
    ChecklistMains._ensureIndex({
        'checklisttypegroup': 1,
        "vinLast": 1,
        "status": 1,
        "lastEditUserDealer": 1,
        "make": 1,
        "dealerName": 1
    });

    ChecklistMains._ensureIndex({
        'checklisttypegroup': 1,
        "vin": 1,
        "status": 1,
        "dealerName": 1,
        "make": 1
    });

    // FOR open Checklist
    ChecklistMains._ensureIndex({
        'checklisttype': 1,
        "vin": 1,
        "version": 1
    });

    ChecklistValues._ensureIndex({
        'id': 1
    });

    Dealers._ensureIndex({
        'dealer': 1
    });
    ChecklistValues._ensureIndex({
        "vin": 1,
        "status": 1
    });


    // todo Incadea
    // dbincadea = [];
    // // todo set isuzu db name
    // //dbincadea["isuzu"] = "[Hyundai Motors New Zealand Ltd$";
    // dbincadea["hyundai"] = "[Hyundai Motors New Zealand Ltd"; // properties.get('hyundai.incadeaDatabase'); // Meteor.settings.incadeaDatabaseHyundai;// "[Hyundai Motors New Zealand Ltd";
    // mssqlsettings = {
    //     "database": {
    //         "server": "10.92.40.7",  // .26
    //         "database": "HNZNAV1", // HNZNAVDEV
    //         "user": "webhaven",
    //         "password": "w3bhav3n",
    //         "options": {
    //             "useUTC": false,
    //             "appName": "MeteorApp"
    //         }
    //     }
    // };


    // block writing over profile in users
    Meteor.users.deny({
        update() {
            return true;
        }
    });


    Accounts.config({forbidClientAccountCreation: true});

    console.log("Accounts.config");

    // console.log("main.js BASE_URL " + servername); // Meteor.settings.BASE_URL);

    Accounts.emailTemplates.resetPassword.text = function (user, url) {
        // console.log("Accounts.emailTemplates.resetPassword servername " + servername);
        // console.log("Accounts.emailTemplates.resetPassword url " + url);
        // console.log("Accounts.emailTemplates.resetPassword user " + JSON.stringify(user));
        if (servername != "") {
            url = url.replace('localhost:3000', servername);
        }
        // console.log("Accounts.emailTemplates.resetPassword BASE_URL " + url);

        return "Dear " + user.profile.first + ",\n\n" +
            "Please click the following link to set your new password:\n\n" +
            url + "\n\n" +
            "If you still have issues, please contact support using the email address below.\n\n\n" +
            "Kind regards,\n" +
            "Inspection Tool Support\n" +
            "sdsouza@ib4t.co";
    };

    Accounts.validateLoginAttempt(function (attempt) {
        // console.log("validateLoginAttempt " + JSON.stringify(attempt.user.profile));
        if (attempt.user && attempt.user.profile.isActive == false) {
            attempt.allowed = false;
            throw new Meteor.Error(403, "User account is inactive!");
        }
        return true;
    });

    if (Meteor.isServer) {
        Picker.route('/pdfprint/:tempid/:id/:vin', function (params, req, res, next) {
            var doc = new PDFDocument({size: 'A4', margin: 50});

            // console.log("/pdfprint/" + params.tempid + "/" + params.id + "/" + params.vin);
            doc.registerFont('HyundaiFont', process.env.PWD + '/public/fonts/Hyundai_L.ttf', process.env.PWD + '/public/fonts/Hyundai.ttf');
            doc.font('HyundaiFont');

            pdfTemplateFromMongo(doc, {"tempid": params.tempid, "id": params.id});
            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=PDF_' + params.tempid + params.vin + '.pdf'
            });
            res.end(doc.outputSync());
        });

        Picker.route('/checklists/:vin/:token', function (params, req, response, next) {
            // console.log("vin:" + params.vin);
            // console.log("token:" + params.token);
            // todo check hashtoken
            // const hashToken = Accounts._hashLoginToken(loginToken);
            // // check if user in user list
            // const service = Services.find(
            //     {
            //         'hashedToken': hashToken,
            //     });
            let result = {"error": "No access rights!"};
            if (params.token == "matomatokjdhakhd") {

                // preset as default
                let checklists = [];
                result = {"vin": params.vin, "checklists": checklists};


                // console.log("===== Time 0: " + (new Date()));
                let checks = checklistvaluesFind({
                    "vin": params.vin,
                    "status": "service manager submitted"
                });

                if (typeof checks != "undefined" && checks.length > 0) {
                    checks.forEach(function (check) {
                        let oneCheck = {};
                        // console.log("===== Time 1: " + (new Date()));
                        let template = ChecklistTemplates.findOne({
                            "checklisttype": check.checklisttype,
                            "version": check.version
                        });
                        // console.log("===== Time 2: " + (new Date()));
                        let template_id = template && template._id ? template._id : "";
                        let odoElement = _.find(check.valueslist, function (ele) {
                            if (ele.dbfield) {
                                // console.log("ele: " + JSON.stringify(ele));
                            }
                            return ele.dbfield && (ele.dbfield == "odometer");
                        });
                        // console.log("odoElement:" + JSON.stringify(odoElement));
                        let odometer = odoElement ? odoElement.value : "";


                        let ronElement = _.find(check.valueslist, function (ele) {
                            return ele.dbfield && (ele.dbfield == "roNumber");
                        });
                        //console.log("ronElement:" + JSON.stringify(ronElement));
                        let roNumber = ronElement ? ronElement.value : "";

                        // console.log("===== Time 3: " + (new Date()));
                        let dealer = DealersShort.findOne({
                            "company": check.make,
                            "dealer": check.lastEditUserDealer
                        });
                        // console.log("===== Time 4: " + (new Date()));
                        //console.log("API dealer found " + JSON.stringify(dealer));
                        let dealerCode = dealer ? dealer["Dealer Code"] : "notFound";
                        let filepath = 'https://' + servername + '/pdfprint/'
                            + template_id + "/" + check._id + "/" + params.vin;
                        oneCheck = {
                            "id": check.id,
                            "roNumber": roNumber,
                            "type": check.checklisttype,
                            "filePath": filepath,
                            "vin": check.vin,
                            "DealerRequestCode": check.dealer ? check.dealer : "notFound",
                            "DealerCode": dealerCode,
                            "status": check.status,
                            "odometer": odometer,
                            "make": check.make,
                            "techUserName": (check.techUserName ? check.techUserName : ""),
                            "techDateSigned": (check.techDateSigned ? check.techDateSigned : ""),
                            "smanUserName": (check.smanUserName ? check.smanUserName : ""),
                            "smanDateSigned": (check.smanDateSigned ? check.smanDateSigned : ""),
                            "dateEndValid": (check.smanDateSigned ? check.smanDateSigned : "")
                        };
                        result.checklists.push(oneCheck);
                    });
                }
            }
            let resultStr = JSON.stringify(result);
            response.writeHead(200, {
                'Content-Length': Buffer.byteLength(resultStr),
                'Content-Type': 'text/plain'
            });
            response.end(resultStr);

        });
        // console.log("methods on server? " + JSON.stringify(_.keys(Meteor.server.method_handlers)));
        SyncedCron.start();
    }

});
