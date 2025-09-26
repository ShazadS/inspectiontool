import {PDFDocument} from 'meteor/pascoual:pdfkit';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {ChecklistTemplates} from '../api/checklisttemplates.js';
import {ChecklistValues} from '../api/checklistvalues.js';
import moment from 'moment';

// export const PdfPrint = new Mongo.Collection('pdfprint');

export function pdfTemplateFromMongo(doc, inargs) {


    let args = {};
    let template = ChecklistTemplates.findOne({"_id": inargs.tempid});
    if (!template) {
        let oid = new Meteor.Collection.ObjectID(inargs.tempid);
        template = ChecklistTemplates.findOne(oid);
    }
    if (template) {
        let record = ChecklistValues.findOne({"_id": inargs.id});
        if (!record) {
            let oid = new Meteor.Collection.ObjectID(inargs.id);
            record = ChecklistValues.findOne(oid);
        }
        // console.log("pdfTemplateFromMongo " + JSON.stringify("tempid " + inargs.tempid + " id " + inargs.id));
        // console.log("pdfTemplateFromMongo " + JSON.stringify("template" + template + " vals " + record));

        if (record) {
            args.elements = template.elements;

            if (record) {
                args.valueslist = record.valueslist;
                args.status = record.status ? record.status : "";
                args.updatedAt = record.updatedAt ? record.updatedAt : new Date(1753, 0, 1, 12, 0, 0, 0);
                args.lastEditUserDealer = record.lastEditUserDealer ? record.lastEditUserDealer : "";
                args.lastEditUserName = record.lastEditUserName ? record.lastEditUserName : "";
                args.smanDateSigned = record.smanDateSigned;
                args.techDateSigned = record.techDateSigned;
                args.smanUserName = record.smanUserName;
                args.techUserName = record.techUserName;
                args.checklisttype = template.checklisttype;
                args.signatureText = record.techUserName ? "TECHNICIAN ( " + record.techUserName + " ) " : "";
                args.signatureDate = record.techDateSigned ? record.techDateSigned : "";
                args.signaturePic = record.signaturePic ? record.signaturePic : "";
                args.signatureManText = record.smanUserName ? "SERVICE MANAGER ( " + record.smanUserName + " ) " : "";
                args.signatureManDate = record.smanDateSigned ? record.smanDateSigned : "";
                args.signatureManPic = record.signatureManPic ? record.signatureManPic : "";
            }
            console.log("pdfTemplateFromMongo checklisttype " + JSON.stringify(args.checklisttype));
            pdfTemplate(doc, args);
        } else {
            doc.text(" System Error: Values not found!");

        }
    } else {
        doc.text(" System Error: Template not found!");
    }
}
function declarationTxt(doc) {
    doc.text ("We certify that all items on this form have been checked and corrected for proper operation as required and understand that it is a requirement for this vehicle be retained in the Dealership Services files.", {
        //fontSize:(3),
        width: '590',
        //stroke: '1',
    });
   // return staticTxt;
}

function hpromiseLogo(doc, checklistLogoType) {
    if (checklistLogoType == "H-Promise") {
        //console.log("show me hpromise status");
        doc.image(process.env.PWD + '/public/images/hyundai_h_pdf_logo.png', 10, 20, {
            align: 'left',
            valign: 'top',
            fit: [120, 51]
        });
    } else {
        doc.image(process.env.PWD + '/public/images/hyundai_logo.png', 10, 20, {
            align: 'left',
            valign: 'top',
            fit: [120, 39]
        });
    }
};

function capsLetter(status) {
    let statusType = "unset";
    switch(status) {

        case "new": {
            statusType = "New";
        }
        break;
        case "ready to submit": {
            statusType = "Ready to Submit";
        }
        break;
        case "pending": {
            statusType = "Pending";
        }
        break;
        case "failed-pending": {
            statusType = "Failed Pending";
        }
            break;
        case "technician submitted": {
            statusType = "Technician Submitted";
        }
            break;
        case "service manager submitted": {
            statusType = "Service Manager Approved";
        }
            break;
        default: {

        }
    }
    return statusType;
};


function pdfTemplate(doc, args) {
    // console.log("pdfTemplate ");// + JSON.stringify(args));
    doc.font('HyundaiFont'); // setting font type ;
    let ypos = {
        y: 10,
        offset: 10,
        num: 0,
        col: 0,
        headerstr: '',
        subheaderstr: '',
        str: ''
    };
    if (args) {
        ypos = pdfListOfElements(doc, ypos, args);
    }
    // console.log("pdfTemplate - END ");

    declarationTxt(doc);
    // ypos.y += 20;

    
    if (args.signaturePic) {
        // console.log("pic");
        doc.image(new Buffer(args.signaturePic.replace('data:image/png;base64,', ''), 'base64'), {
            align: 'left',
            valign: 'top',
            //width: '50',
            fit: [180, 40]
        })//.moveDown(0.2);
    } else {
        doc.text(" ", {
            align: 'left',
            valign: 'top',
            fit: [160, 60]
        })//.moveDown(0.2);
    }
    if (args.signatureText) {
        doc.text((args.signatureText), {
            width: '200',
            align: 'left'
        })//.moveDown(0.2);
    }
    if (args.signatureDate) {
        doc.text((args.signatureDate), {
            width: '200',
            align: 'left'
        })//.moveDown(0.5);
    }






    if (args.signatureManPic) {
        // console.log("pic2")
        doc.image(new Buffer(args.signatureManPic.replace('data:image/png;base64,', ''), 'base64'), 400, ypos.y , {
            align: 'right',
            valign: 'top',
            fit: [160, 60]
        }).moveUp(2.5);//.moveDown(0.5);
    }
    if (args.signatureManText) {
        doc.text((args.signatureManText), {
            align: 'right',
        })//.moveUp(2.5);//.moveDown(0.2);
    }

    // if (args.signatureManText) {
    //     doc.text(args.signatureManText).moveDown(0.2);
    // }


    if (args.signatureManDate) {
        doc.text((args.signatureManDate), {
            align: 'right',
        })//.moveUp(2.5);//.moveDown(0.5);
    }
}





function pdfListOfElements(doc, yposarg, args) {
    let ypos = yposarg;
    // console.log("pdfListOfElements ** before " + JSON.stringify(yposarg));
    args.elements.forEach((element) => {

        let elementInValues = args.valueslist.find(function (valuecombo) {
            return valuecombo.name == element.name;
        });
        if (!elementInValues) {
            // console.log("Error: Value not found " + element.name);
        }
        let eArgs = {};
        eArgs.element = element;
        eArgs.status = args.status;
        eArgs.updatedAt = args.updatedAt;
        eArgs.lastEditUserDealer = args.lastEditUserDealer;
        eArgs.smanDateSigned = args.smanDateSigned;
        eArgs.techDateSigned = args.techDateSigned;
        eArgs.smanUserName = args.smanUserName;
        eArgs.techUserName = args.techUserName;
        eArgs.checklisttype = args.checklisttype;
        eArgs.val = elementInValues ? (elementInValues.value.constructor === Array ? '' : elementInValues.value) : '';
        eArgs.valArray = elementInValues ? (elementInValues.value.constructor === Array ? elementInValues.value : []) : [];
        eArgs.valueslist = args.valueslist;

        ypos = pdfElement(doc, ypos, eArgs);
        // console.log("pdfListOfElements *** after ypos label" + JSON.stringify(eArgs.element.labeltext) + " ypos.offset " + ypos.offset);

    });
    return ypos;
}

function printEndOfValues(yposargs) {
    let ypos = yposargs;
    if (ypos.col != 0) {
        ypos.col = 0;
        ypos.offset = 10;
        ypos.y += 32;
        //ypos.y += 32;
    }
    return ypos;
}

function printDisplayValue(doc, label, val, yposargs) {
    // console.log("printDisplayValue label: " + label + "  offset: " + yposargs.offset + "  col: " + yposargs.col);
    let ypos = yposargs;

    doc.fontSize(7);

    //doc..moveDown(1.0); //adding space below text
    let x = ypos.offset;
    let blk = " ";
    if (ypos.col == 0) {
        blk = "  ";
    }
    let vehicleInfo = blk + label + "  " + val;
    doc.text(vehicleInfo, x, ypos.y, {align: 'left', width: 570});
    //ypos.y += 9;
    //doc.fontSize(10);
    //doc.font('HyundaiFont') // adding font type ;
    //doc.text(val, x, ypos.y, {align: 'left'});
    //doc.text(val, x, ypos.y, {align: 'left', width: 590});
    //ypos.y -= 9;

    switch (ypos.col) {
        case (0): {
            doc.rect(10, ypos.y, 175, 14).stroke(1);
        }
        break;
        case (1): {
            doc.rect(10, ypos.y, 355, 14).stroke(1);
        }
            break;
        case (2): {
            doc.rect(10, ypos.y, 570, 14).stroke(1);
        }
            break;
        default: {

        }
            break;
    }

    ypos.offset += 180;
    ypos.col++;
    if (ypos.col == 3) {
        // doc.rect(10, ypos.y, 570, 14).stroke(1);
        // doc.rect(10, ypos.y, 350, 14).stroke(1);
        // doc.rect(10, ypos.y, 170, 14).stroke(1);

        ypos.col = 0;
        ypos.offset = 10;
        ypos.y += 15;
        //ypos.offset = 10;
        //ypos.y += 32;
    }
    // console.log("printDisplayValue label: " + label + "  offset: " + ypos.offset + "  col: " + ypos.col + " END");
    return ypos;
}

function getUserName(str) {

    if (str) {
        let endOfName = str.lastIndexOf("(");
        return str.substr(0, endOfName);
    } else {
        return "";
    }
}

function pdfElement(doc, yposarg, args) {
    let ypos = yposarg;
    // console.log("pdfElement ***      type " + args.element.type + "  label " + JSON.stringify(args.element.labeltext) + " ypos.offset " + ypos.offset);

    // console.log("pdfElement " + args.element.type + " name: " + args.element.name);
    let date;
    let dateStr = "";
    let onecheck = args.element;
    // console.log("y: " + ypos.y);
    // console.log("" + onecheck.type + ":");
    // console.log("element label ---- " + onecheck.labeltext);

    // finish off 3 column display

    if (!(onecheck.type == "status_display" || onecheck.type == "text_display" || onecheck.type == "text_last_user_display"
        || onecheck.type == "text_last_dealer_display" || onecheck.type == "date_display" || onecheck.type == "date_last_updated_display"
            || onecheck.type == "text_approved_user_display" || onecheck.type == "date_approved_display"
            || onecheck.type == "ignore_element"
            || onecheck.type == "location_select"
            || onecheck.type == "number_input_required"
            || onecheck.type == "text_input"
            || onecheck.type == "text_input_required"
        )) {

        ypos = printEndOfValues(ypos);
        // console.log("oops");
    }

    switch (onecheck.type) {
        case "ignore_element": {
            // print nothing
        }
            break;
        case "end_group_headerfields": {
            // print nothing but position after header field block
            ypos = printEndOfValues(ypos);
        }
            break;

        case "end_body_collapsable": {
            // print nothing
        }
            break;
        case "end_group_collapsable": {
            if (ypos.str.length > 0 || ypos.headerstr.length > 0 || ypos.subheaderstr.length > 0) {
                let heit = ypos.str.length > 0 ? (Math.ceil(ypos.num / 2)) * 10 : 0;
                let hheit = ypos.headerstr.length > 0 ? 15 : 0;
                let hsheit = ypos.subheaderstr.length > 0 ? 11 : 0;
                // console.log("sum " + (ypos.y + 2 + heit + hheit + hsheit));
                if ((ypos.y + 2 + heit + hheit + hsheit) > 825) {
                    // console.log("add page: " + ypos.y + " elementtype: " + args.element.type);
                    // doc.addPage(); //new page commented out by manoj
                    ypos.y = 10;




                    hpromiseLogo(doc, args.checklisttype);





                    // doc.image(process.env.PWD + '/public/images/hyundai_logo.png', 10, 20, {
                    //     align: 'left',
                    //     valign: 'top',
                    //     fit: [200, 39]
                    // });

                    // if (args.checklisttype == "H-Promise") {
                    //     console.log("show me hpromise status");
                    //     doc.image(process.env.PWD + '/public/images/hyundai_h_pdf_logo.png', 10, 20, {
                    //         align: 'left',
                    //         valign: 'top',
                    //         fit: [200, 51],
                    //     });
                    // } else {
                    //     doc.image(process.env.PWD + '/public/images/hyundai_logo.png', 10, 20, {
                    //         align: 'left',
                    //         valign: 'top',
                    //         fit: [200, 39],
                    //     });
                    // }

                };

                ypos.y += 2;

                if (ypos.headerstr.length > 0) {
                    doc.text(ypos.headerstr, 15, ypos.y, {align: 'left', width: 570});
                    doc.rect(10, ypos.y, 570, 12).stroke(1);
                    ypos.y += hheit;
                }

                if (ypos.subheaderstr.length > 0) {
                    doc.text(ypos.subheaderstr, 10, ypos.y, {align: 'left', width: 590});

                    doc.fontSize(7);
                    doc.text(args.val, 100, ypos.y, {align: 'left', width: 590});
                    ypos.y += hsheit;
                }

                if (ypos.str.length > 0) {
                    doc.fontSize(7);
                    doc.text(
                        ypos.str, 10, ypos.y, {
                            columns: 2,
                            columnGap: 15,
                            height: heit,
                            width: 570,
                            align: 'left'
                        }
                    ).stroke(1);
                    // console.log("print group: num " + ypos.num + " len: " + ypos.str.length);
                    // console.log("print group: " + ypos.str);
                }

                ypos.y += heit;
                ypos.headerstr = '';
                ypos.subheaderstr = '';
                ypos.str = '';
                ypos.num = 0;
            }
        }
            break;

        case "body_collapsable":

            let str = "ACTION: OK= OK / Adjusted= AJ / Repaired= RP / Not OK= XX / Not Applicable= NA / Not Set= --";
            doc.fontSize(7);
            ypos.y += 2;
            doc.text(str, 275, ypos.y, {align: 'left', width: 570});

            ypos.y += 10;

        case "group_headerfields": {
            listArgs = args;
            listArgs.elements = onecheck.elements;
            pdfListOfElements(doc, ypos, listArgs);
        }
            break;

        case "group_collapsable": {
            // if ( ypos.str.length > 0) {
            //     let heit = Math.ceil(ypos.num/2) * 9 + 10;
            //     doc.fontSize(7);
            //     doc.text(
            //         ypos.str, 10, ypos.y, {
            //             columns: 2,
            //             columnGap: 15,
            //             height: heit,
            //             width: 570,
            //             align: 'left'
            //         }
            //     ).stroke(1);
            //  ypos.y += heit; //let heit = height
            //  ypos.str ='';
            //  ypos.num = 0;
            // }
            //ypos.y += 12; //above header space

            // doc.font('HyundaiFont');// adding font type;
            // doc.text(onecheck.labeltext,15, ypos.y, {align: 'left', width: 570} );
            // doc.rect(10, ypos.y, 570, 12).stroke(1);
            // ypos.y += 15;
            ypos.headerstr = onecheck.labeltext;
            listArgs = args;
            listArgs.elements = onecheck.elements;
            pdfListOfElements(doc, ypos, listArgs);

        }
            break;

        case "header_checklist": {
            // <h2>
            console.log("is it h promise " + args.checklisttype);



            hpromiseLogo(doc, args.checklisttype);



            // doc.image(process.env.PWD + '/public/images/hyundai_h_pdf_logo.png', 10, 20, {
            //     align: 'left',
            //     valign: 'top',
            //     fit: [200, 39],
            // });



            // if (args.checklisttype == "H-Promise") {
            //     console.log("show me hpromise status");
            //     doc.image(process.env.PWD + '/public/images/hyundai_h_pdf_logo.png', 10, 20, {
            //         align: 'left',
            //         valign: 'top',
            //         fit: [200, 51],
            //     });
            // } else {
            //     doc.image(process.env.PWD + '/public/images/hyundai_logo.png', 10, 20, {
            //         align: 'left',
            //         valign: 'top',
            //         fit: [200, 39],
            //     });
            // }









            // if(args.checklisttye == "H-Promise") {
            //     doc.image(process.env.PWD + '/public/images/hyundai_logo.png', 10, 20, {
            //         align: 'left',
            //         valign: 'top',
            //         fit: [200, 39],
            //     });
            // } else {
            //         doc.image(process.env.PWD + '/public/images/hyundai_logo.png', 10, 20, {
            //             align: 'left',
            //             valign: 'top',
            //             fit: [200, 39],
            //         });
            //  };






            ypos.y += 40;
            //ypos.y += 80;
            doc.fontSize(13);
            //doc.fillColor('red');
            doc.text(onecheck.labeltext, 0, 30, {align: 'right', width: 550});
            //doc.text(onecheck.labeltext, 10, 80, {align: 'left', width: 590});
            //ypos.y += 20;
        }
            break;
        case "status_display": {
            // console.log("status_display " + JSON.stringify(args.status));
            ypos = printDisplayValue(doc, onecheck.labeltext, capsLetter(args.status), ypos);

        }
            break;
        case "text_display": {
            // console.log("text_display " + JSON.stringify(args));
            ypos = printDisplayValue(doc, onecheck.labeltext, args.val, ypos);
            // doc.rect(10, ypos.y, 570, 14).stroke(1);
            // doc.rect(10, ypos.y, 350, 14).stroke(1);
            // doc.rect(10, ypos.y, 170, 14).stroke(1);
        }
            break;

        case "comments_display":

            if (ypos.str.length > 0 || ypos.headerstr.length > 0) {
                ypos.subheaderstr = onecheck.labeltext;

            } else {

                doc.fontSize(7);
                doc.text(onecheck.labeltext, 10, ypos.y, {align: 'left', width: 590});
                ypos.y += 9;

            }0
            break;
        case "location_select":
        case "number_input_required":
        case "text_input":
        case "text_input_required": {
            // console.log("text_input_required label " + JSON.stringify(onecheck.labeltext));
            // console.log("text_input_required " + JSON.stringify(args.val));
            ypos = printDisplayValue(doc, onecheck.labeltext, args.val, ypos);
            // doc.fontSize(7);
            // // doc.text(onecheck.labeltext, 15, ypos.y, {align: 'left', width: 590});
            // // doc.text(("" + args.val), 80, ypos.y, {align: 'left', width: 590});
            // let txxt = onecheck.labeltext + "  " + args.val;
            // doc.text(txxt, 15, ypos.y, {align: 'left', width: 590});
            // doc.rect(10, ypos.y, 570, 14).stroke(1);
            //
            // ypos.y += 18;
        }
            break;
        case "text_last_user_display": {
            // console.log("text_last_user_display " + JSON.stringify(args));
            let lstuser = getUserName((args.status == "technician submitted" || args.status == "service manager submitted") && args.techUserName
                ? args.techUserName : (args.lastEditUserName ? args.lastEditUserName : ""));
            let lstuserlabel = (args.status == "technician submitted" || args.status == "service manager submitted") ? "Submitted By Technician:" : onecheck.labeltext;
            ypos = printDisplayValue(doc, lstuserlabel, lstuser, ypos);
        }
            break;
        case "text_approved_user_display": {
            // console.log("text_approved_user_display  *** before ypos" + JSON.stringify(ypos));

            // console.log("text_approved_user_display " + args.smanUserName);
            let smanUserName = args.smanUserName ? getUserName(args.smanUserName) : "";
            // console.log("text_approved_user_display " + smanUserName);
            ypos = printDisplayValue(doc, onecheck.labeltext, smanUserName, ypos);
        }
            break;

        case "text_last_dealer_display": {
            // console.log("text_last_dealer_display " + JSON.stringify(args));
            ypos = printDisplayValue(doc, onecheck.labeltext, args.lastEditUserDealer, ypos);
        }
            break;
        case "date_last_updated_display": {
            // console.log("status? " + args.status);
            //console.log ("SHOW UPDATED DATE" + args.updatedAt);
            //let newDateType = moment(args.updatedAt).format('MM dd YY');
            //console.log ("SHOW DATE" + newDateType);
            let options = {
                weekday: "short", year: "numeric", month: "short",
                day: "numeric", hour: "2-digit", minute: "2-digit"
            };
            dateStr = (args.status == "technician submitted" || args.status == "service manager submitted") && args.techDateSigned ?
                moment(args.techDateSigned).format("MM/DD/YYYY")
                //args.techDateSigned.toLocaleTimeString("en-NZ", options)
                : moment(args.updatedAt).format("MM/DD/YYYY");
            let label = (args.status == "technician submitted" || args.status == "service manager submitted") ?
                "Submitted Date:" : onecheck.labeltext;

            // console.log("date_last_updated_display " + date);
            // console.log("date_last_updated_display typeof " + (typeof date));
            // console.log("date_last_updated_display string " + date);
            ypos = printDisplayValue(doc, label, dateStr, ypos);
            dateStr = "";
        }
        break;
        case "date_approved_display": {
            // console.log("date_approved_display  *** before ypos" + JSON.stringify(ypos));

            let options = {
                weekday: "short", year: "numeric", month: "short",
                day: "numeric", hour: "2-digit", minute: "2-digit"
            };
            dateStr = args.status == "service manager submitted" && args.smanDateSigned ? args.smanDateSigned.toLocaleTimeString("en-NZ", options) : "";
            ypos = printDisplayValue(doc, onecheck.labeltext, dateStr, ypos);
            dateStr = "";
        }
            break;
        case "date_display": {
            if (!dateStr || dateStr.length == 0) {
                dateStr = args.val;
            }

            ypos = printDisplayValue(doc, onecheck.labeltext, dateStr, ypos);
            dateStr = "";
        }
            break;
        case "date_input": {
            if (!date) {
                date = args.val;
            }
            let options = {
                weekday: "short", year: "numeric", month: "short",
                day: "numeric", hour: "2-digit", minute: "2-digit"
            };
            dateStr = args.lastUpdated.toLocaleTimeString("en-NZ", options);
            doc.fontSize(10);
            doc.text(onecheck.labeltext, 45, ypos.y, {align: 'left', width: 590});


            doc.fontSize(10);
            doc.text(dateStr, 95, ypos.y, {align: 'left', width: 590});
            dateStr = "";
            ypos.y += 16;
        }
            break;

        case "empty_group_header": {
            // do nothing
        }
            break;
        case "group_header": {
            //doc.fontSize(10);
            //doc.font('HyundaiFont'); // adding font type ;
            //doc.text(onecheck.labeltext, 80, ypos.y, {align: 'left', width: 590});

            ypos.str += '    ' + onecheck.labeltext + '\n';
            ypos.num++;


            //doc.text(onecheck.labeltext, 80, ypos.y, {align: 'left', width: 590});
            //ypos.y += 16;
        }
            break;
        case "take_photo_required": {
            // photo is not put into pdf
        }
            break;

        case "exterior_inspection": {
            let text = "--";
            // console.log("Exterior Inpection array" + JSON.stringify(args.valArray));
            for (ii = 0; ii < 20; ii++) {
                let quarter = args.valArray[ii];

                if (quarter.okValue == true) {
                    text = "OK";
                } else {
                    if (quarter.repairedValue == true) {
                        text = "RP";
                    } else {
                        if (quarter.failedValue == true) {
                            text = "XX";
                        }
                    }
                }
                ypos.str += quarter.headerText + '\n';
                ypos.num++;
                let label = "      ";
                if (quarter.photo) {
                    label = "PHOTO ";
                }
                label = label + quarter.commentValue;
                ypos.str += text + ' ' + label + '\n';
                ypos.num++;
            }

        }
            break;
        case "NA_check": {

        }
            break;
        case "simple_check_no_NA": {
            let okName = onecheck.name + "ok";
            //let editcomment = onecheck.comment + "edit";
            let adjustedName = onecheck.name + "adjusted";
            let failedName = onecheck.name + "failed";


            let text = "--";

            let okValue = args.valArray.find(function (ele) {
                return ele.name == onecheck.name + "ok";
            });
            let adjustedValue = args.valArray.find(function (ele) {
                return ele.name == onecheck.name + "adjusted";
            });
            let failedValue = args.valArray.find(function (ele) {
                return ele.name == onecheck.name + "failed";
            });

            if (okValue && okValue.value) {
                text = "OK";
            } else {
                if (adjustedValue && adjustedValue.value) {
                    text = "AJ";
                } else {
                    if (failedValue && failedValue.value) {
                        text = "XX";
                    } else {

                    }
                }
            }


            //doc.fontSize(10);
            //doc.font('HyundaiFont'); // adding font type;
            ypos.str += text + ' ' + onecheck.labeltext + '\n';
            //doc.text(text, 10, ypos.y, {align: 'left', width: 590});

            //doc.fontSize(10);
            //doc.font('HyundaiFont'); // adding font type;
            //doc.text(onecheck.labeltext, 80, ypos.y, {align: 'left', width: 590});
            ypos.num++;
        }
            break;


        case "simple_check": {
            // console.log("print simple_check " + JSON.stringify(onecheck.labeltext));
            // console.log("print simple_check " + JSON.stringify(args.valArray));
            // console.log("print simple_check start" + JSON.stringify(ypos.y));

            // comment does not print in pdf

            let classs = "control-label";
            let naName = onecheck.name + "na";
            let okName = onecheck.name + "ok";
            //let editcomment = onecheck.comment + "edit";
            let adjustedName = onecheck.name + "adjusted";
            let failedName = onecheck.name + "failed";


            let text = "--";

            let naValue = args.valArray.find(function (ele) {
                return ele.name == onecheck.name + "na";
            });
            let okValue = args.valArray.find(function (ele) {
                return ele.name == onecheck.name + "ok";
            });
            let adjustedValue = args.valArray.find(function (ele) {
                return ele.name == onecheck.name + "adjusted";
            });
            let failedValue = args.valArray.find(function (ele) {
                return ele.name == onecheck.name + "failed";
            });

            if (naValue && naValue.value) {
                text = "NA";
            } else {
                if (okValue && okValue.value) {
                    text = "OK";
                } else {
                    if (adjustedValue && adjustedValue.value) {
                        text = "AJ";
                    } else {
                        if (failedValue && failedValue.value) {
                            text = "XX";
                        } else {

                        }
                    }
                }
            }


            //doc.fontSize(10);
            //doc.font('HyundaiFont'); // adding font type;
            ypos.str += text + ' ' + onecheck.labeltext + '\n';
            //doc.text(text, 10, ypos.y, {align: 'left', width: 590});

            //doc.fontSize(10);
            //doc.font('HyundaiFont'); // adding font type;
            //doc.text(onecheck.labeltext, 80, ypos.y, {align: 'left', width: 590});
            ypos.num++;
        }
            break;

        case "comments": {

            

            // if ( ypos.str.length > 0) {
            //     let heit = Math.ceil(ypos.num/2) * 9 + 10;
            //     doc.fontSize(7);
            //     doc.text(
            //         ypos.str, 10, ypos.y, {
            //             columns: 2,
            //             columnGap: 15,
            //             height: heit,
            //             width: 570,
            //             align: 'left'
            //         }
            //     );
            //     ypos.y += heit;
            //     ypos.str ='';
            //     ypos.num = 0;
            // }


            // ypos.y += 20; //above space for your comments

            if ((ypos.y + 16 + 7 * 3) > 775 ) {
                // console.log("add page: " + ypos.y + " elementtype: " + args.element.type);
                //doc.addPage(); //commented by manoj
                //ypos.y = 20; //commented by manoj
                //ypos.y = 80;

                // doc.image(process.env.PWD + '/public/images/hyundai_logo.png', 10, 20, {
                //     align: 'left',
                //     valign: 'top',
                //     fit: [200, 39]
                // });
            }

            doc.fontSize(10);
            doc.text(onecheck.labeltext, 10, ypos.y, {align: 'left', width: 500});

            ypos.y += 16;

            // console.log("commentsval:"+args.val+":");
            doc.fontSize(7);
            doc.text(args.val, 10, ypos.y, {align: 'left', width: 500});


            // lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus. Vestibulum ante ipsum primis in \n' +
            //     'faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl. Suspendisse rhoncus nisl posuere tortor tempus et dapibus elit porta. Cras leo neque, elementum a rhoncus ut, vestibulum non nibh. Phasellus pretium justo turpis. Etiam vulputate, odio vitae tincidunt ultricies, eros odio dapibus nisi, ut tincidunt lacus arcu eu elit. Aenean velit erat, vehicula eget lacinia ut, dignissim non tellus. Aliquam nec lacus mi, sed vestibulum nunc. Suspendisse potenti. Curabitur vitae sem turpis. Vestibulum sed neque eget dolor dapibus porttitor at sit amet sem. Fusce a turpis lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;'
            //
            // doc.text (
            //     lorem, {
            //         columns: 3,
            //         columnGap: 15,
            //         height: 100,
            //         width: 465,
            //         align: 'justify'
            //     }
            // );
            //ypos.y += 24;

        }
            break;

        case "concern_box": {
            // todo implement for LS (aged)
        }
            break;

        case "take_picture": {
            // do nothing
        }
            break;

        default: {
            doc.fontSize(16);
            doc.text("Error in checklist generation - type doesn't exit - type: " + onecheck.type, 200, 10, {
                align: 'left',
                width: 300
            });
            doc.text(args.type, 220, 10, {align: 'left', width: 590});
        }
    }
    // doc.writeSync(process.env.PWD + '/public/pdf/PDF_PDI.pdf');
    // console.log("pdfElement " + args.element.type + " name: " + args.element.name + " -- END");
    return ypos;
}

Meteor.methods({
    'pdfprint.test'(args) {

        let doc = new PDFDocument({size: 'A4', margin: 5});

        doc.fontSize(12);
        doc.text('PDFKit is not so simple', 10, 30, {align: 'left', width: 590});

        // doc.writeSync(process.env.PWD + '/public/pdf/PDFKitExample.pdf');

        doc.text('PDFKit is not so simple - 2', 10, 50, {align: 'left', width: 590});

        // Save it on myApp/public/pdf folder (or any place) with the Fibered sync methode:
        doc.writeSync(process.env.PWD + '/public/pdf/PDFKitExample.pdf');
    },
    'pdfprint.pdi'(args) {
        // console.log("pdfprint.pdi " + JSON.stringify(args));
        let doc = new PDFDocument({size: 'A4', margin: 5});  //SETS THE MARGIN OF THE PAGE

        // console.log("pdfprint.pdi " + JSON.stringify(_.keys(doc)));
        // console.log("pdfprint.pdi " + JSON.stringify(_.keys(PDFDocument)));
        // let stream = doc.pipe(Blob());
        doc.registerFont('HyundaiFont', process.env.PWD + '/public/fonts/Hyundai_L.ttf', process.env.PWD + '/public/fonts/Hyundai.ttf');
        pdfTemplate(doc, args);
        //      console.log("pdfprint.pdi writeSync");
        // doc.writeSync(process.env.PWD + '/public/pdf/PDF_PDI' + args.pdfname + '.pdf');
        doc.outputSync();
        // doc.end();
        // let blob = doc.outputSync(); // stream.toBlob('application/pdf');

        //   PdfPrint.upsert({vin: args.vin, "type": args.type}, {$set: {"blob": blob}});

        // console.log("url", url);
        //     stream.on 'finish', ->
        // # get a blob you can do whatever you like with
        //         blob = stream.toBlob('application/pdf')
        //         # or get a blob URL for display in the browser
        //     url = stream.toBlobURL('application/pdf')
        //     iframe.src = url
        //
    }
});
