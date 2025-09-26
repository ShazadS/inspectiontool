import React, {Component, PropTypes} from 'react';
import {MeteorCamera} from 'meteor/mdg:camera';
import classnames from 'classnames';
import Modal from '../simplemodal/simple-modal'
import 'simple-react-modal'

import ExteriorInspectionDisplay from '../generator/ExteriorInspectionDisplay.jsx';
import ExteriorInspectionDisplayAll from '../generator/ExteriorInspectionDisplayAll.jsx';

// ExteriorInspection component - represents a exterior inspection with car graphics and photos
export default class ExteriorInspection extends Component {


    constructor(props) {
        super(props);

        // console.log("constructor " + JSON.stringify(this.props.element.name));
        // console.log("constructor " + JSON.stringify(this.props.valueArrayLoadedFromDb));
        this.state = {
            elements: [],
            status: props.status,
            valueLoadedFromDb: props.valueLoadedFromDb,
            valueArrayLoadedFromDb: props.valueArrayLoadedFromDb,
            failedArray: [],
            showExtModal: false,
            writingOnGraphicStyleFailed: {
                color: "red"
            },
            writingOnGraphicStyleOk: {
                color: "black",
            }
        };
    };


    onClickAll(carView) {
        let setttingView = '';
        let setttingViewTitle = '';
        if(carView === "LEFTALL"){
            setttingView = 'left';
            setttingViewTitle = 'Left';
        }
        if(carView === "RIGHTALL"){
            setttingView = 'right';
            setttingViewTitle = 'Right';
        }
        if(carView === "TOPALL"){
            setttingView = 'top';
            setttingViewTitle = 'Top';
        }
        if(carView === "FRONTALL"){
            setttingView = 'front';
            setttingViewTitle = 'Front';
        }
        if(carView === "REARALL") {
            setttingView = 'back';
            setttingViewTitle = 'Back';
        }

        let currentModalQuarter = {"name":setttingView+"topleft","headerText":setttingViewTitle+" View, Top Left Quarter","okValue":true,"repairedValue":false,"failedValue":false,"commentValue":"","photo":null,"status":"OK","writingOnGraphicStyle":{"color":"black"}};
        let quarterName = setttingView+"topleft";
        let hereQuarter = this.state.valueArrayLoadedFromDb.find(function (qrt) {
            return qrt.name == quarterName
        });

        Object.assign(hereQuarter, currentModalQuarter);

        this.setState({
            "modalQuarter": currentModalQuarter,
            "valueArrayLoadedFromDb": this.state.valueArrayLoadedFromDb
        });

        currentModalQuarter = {"name":setttingView+"bottomleft","headerText":setttingViewTitle+" View, Bottom Left Quarter","okValue":true,"repairedValue":false,"failedValue":false,"commentValue":"","photo":null,"status":"OK","writingOnGraphicStyle":{"color":"black"}};
        quarterName = setttingView+"bottomleft";
        hereQuarter = this.state.valueArrayLoadedFromDb.find(function (qrt) {
            return qrt.name == quarterName
        });

        Object.assign(hereQuarter, currentModalQuarter);

        this.setState({
            "modalQuarter": currentModalQuarter,
            "valueArrayLoadedFromDb": this.state.valueArrayLoadedFromDb
        });

        currentModalQuarter = {"name":setttingView+"topright","headerText":setttingViewTitle+" View, Top Right Quarter","okValue":true,"repairedValue":false,"failedValue":false,"commentValue":"","photo":null,"status":"OK","writingOnGraphicStyle":{"color":"black"}};
        quarterName = setttingView+"topright";
        hereQuarter = this.state.valueArrayLoadedFromDb.find(function (qrt) {
            return qrt.name == quarterName
        });

        Object.assign(hereQuarter, currentModalQuarter);

        this.setState({
            "modalQuarter": currentModalQuarter,
            "valueArrayLoadedFromDb": this.state.valueArrayLoadedFromDb
        });


        currentModalQuarter = {"name":setttingView+"bottomright","headerText":setttingViewTitle+" View, Bottom Right Quarter","okValue":true,"repairedValue":false,"failedValue":false,"commentValue":"","photo":null,"status":"OK","writingOnGraphicStyle":{"color":"black"}};
        quarterName = setttingView+"bottomright";
        hereQuarter = this.state.valueArrayLoadedFromDb.find(function (qrt) {
            return qrt.name == quarterName
        });

        Object.assign(hereQuarter, currentModalQuarter);


        this.setState({
            "modalQuarter": currentModalQuarter,
            "valueArrayLoadedFromDb": this.state.valueArrayLoadedFromDb
        });


        let valueArrayLoadedFromDb = {};
        let DoSetFail = false;
        let that = this;
        _.keys(this.state.valueArrayLoadedFromDb).forEach(function (ss) {
            valueArrayLoadedFromDb = that.state.valueArrayLoadedFromDb[ss];
            if(valueArrayLoadedFromDb['status'] == "FAILED"){
                DoSetFail = true;
            }

            if(DoSetFail){
                if(typeof valueArrayLoadedFromDb['failed'] !== 'undefined'){
                    that.state.valueArrayLoadedFromDb[ss]['failed'] = 1;
                    that.state.valueArrayLoadedFromDb[ss]['value'] = true;
                }
                if(typeof valueArrayLoadedFromDb['ok'] !== 'undefined'){
                    that.state.valueArrayLoadedFromDb[ss]['ok'] = 0;
                    that.state.valueArrayLoadedFromDb[ss]['value'] = false;
                }

            }
            else{

                if(typeof valueArrayLoadedFromDb['failed'] !== 'undefined') {
                    that.state.valueArrayLoadedFromDb[ss]['failed'] = 0;
                    that.state.valueArrayLoadedFromDb[ss]['value'] = false;
                }

                if(typeof valueArrayLoadedFromDb['ok'] !== 'undefined') {
                    that.state.valueArrayLoadedFromDb[ss]['ok'] = 1;
                    that.state.valueArrayLoadedFromDb[ss]['value'] = true;
                }
            }
        });

        if(DoSetFail) {
            this.props.setFailedArray(this.props.element.name, true);
        }
        else{
            this.props.setFailedArray(this.props.element.name, false);
        }

        let checkedUndefined;
        let variationUndefined;
        this.props.handleFieldChange(this.props.lastUpdated, this.props.element, this.props.element.name, this.state.valueArrayLoadedFromDb, checkedUndefined, variationUndefined);


    }


    onClickBody(carView, topOrButtom, leftOrRight) {

            let quarterName = carView.toLowerCase() + topOrButtom.toLowerCase() + leftOrRight.toLowerCase();
            let quarter = this.state.valueArrayLoadedFromDb.find(function (qrt) {
                return qrt.name == quarterName
            });
            // console.log("quarter " + JSON.stringify(quarter));
            quarter.headerText = "" + carView + " View, " + topOrButtom + " " + leftOrRight + " Quarter";

            this.showModal(quarter, carView, topOrButtom, leftOrRight);

    }

    showModal(quarter, carView, topOrButtom, leftOrRight) {
        //console.log("quarter " + JSON.stringify(quarter));

        // clone quarter
        let oldModalQuarter = _.clone(quarter);

        this.setState({
            showExtModal: true,
            modalQuarter: quarter,
            oldModalQuarter: oldModalQuarter,
            carView: carView.toLowerCase(),
            topOrButtom: topOrButtom.toLowerCase(),
            leftOrRight: leftOrRight.toLowerCase()

        })
    }

    closeModal() {
        event.preventDefault();
        // console.log("close modal");
        // debugger;


        if (!_.isEqual(this.state.modalQuarter, this.state.oldModalQuarter)) {
            let checkedUndefined;
            let variationUndefined;
            this.props.handleFieldChange(this.props.lastUpdated, this.props.element, this.props.element.name, this.state.valueArrayLoadedFromDb, checkedUndefined, variationUndefined);
        }

        this.setState({
            showExtModal: false,
            valueArrayLoadedFromDb: this.state.valueArrayLoadedFromDb
        });

    }


    handleModalCommentChange(event) {
        // console.log("handleModalCommentChange " + event.target.id);
        // console.log("handleModalCommentChange " + event.target.value);

        let modalQuarter = this.state.modalQuarter;
        modalQuarter.commentValue = event.target.value;

        let variation; // undefined because is not check field
        let checked; // undefined because is not check field
        // todo !!!!this.props.handleFieldChange(that.props.element, id, modalQuarter, checked, variation);
        // todo
        modalQuarter["writingOnGraphicStyle"] = modalQuarter["status"] == "FAILED" ?
            this.state.writingOnGraphicStyleFailed : this.state.writingOnGraphicStyleOk;
        this.setState({
            "modalQuarter": modalQuarter
        })
    }

    readModalFields(quarter) {
        let commentField = this.refs.modalComment; // ref="modalText"
        // console.log("submit modal text " + JSON.stringify(commentField.value));
        // let headerField = this.refs.modalHeader; // ref="modalHeader"
        // console.log("submit modal header " + JSON.stringify(headerField.value));
        quarter.commentValue = commentField.value;
        return quarter;
    }

    handleSubmitScratchReport(event) {
        if (event) {
            event.preventDefault();
        }

        // console.log("handleSubmitScratchReport");
        // console.log("handleSubmitScratchReport modalQuarter " + JSON.stringify(this.state.modalQuarter));
        let newQuarter = this.readModalFields(this.state.modalQuarter);

        // change field
        let quarterName = this.state.carView.toLowerCase() + this.state.topOrButtom.toLowerCase() + this.state.leftOrRight.toLowerCase();
        let hereQuarter = this.state.valueArrayLoadedFromDb.find(function (qrt) {
            return qrt.name == quarterName
        });

        Object.assign(hereQuarter, newQuarter);
        this.closeModal();
        // this.setState({
        //     showExtModal: false,
        //     valueArrayLoadedFromDb: this.state.valueArrayLoadedFromDb
        // });

        //     this.props.updateStatus(null, null, "service manager submitted", this.props.numDone, this.props.signaturePic, signatureManPic);
        //     this.changeLocalState(this.state.updatedValues, "service manager submitted", this.props.numDone,
        //         this.props.signaturePic, signatureManPic);
        // }
    }

    handleModalCheckboxRadioChange(event) {
        // event.preventDefault();
        // console.log("handleModalCheckboxRadioChange element this.props" + JSON.stringify(this.props));
        // console.log("handleModalCheckboxRadioChange element this.props" + JSON.stringify(this.props));

        let chckName = event.target.name;
        let chckId = event.target.id;
        let chckChecked = event.target.checked;

        // copy into modal data
        // if one is set unset all other
        // if set one is clicked unclick it -> all unclicked

        let currentModalQuarter = {};
        let that = this;
        _.keys(this.state.modalQuarter).forEach(function (kk) {
            currentModalQuarter[kk] = that.state.modalQuarter[kk];
        });

        // console.log("handleModalCheckboxRadioChange currentModalQuarter " + JSON.stringify(currentModalQuarter));
        let variation = ["ok", "repaired", "failed"];
        let currentname = chckId;
        let currentvalue = currentModalQuarter[chckId];

        // extra: record change to failed
        let oldFailed = currentModalQuarter["failedValue"];
        let newFailed = oldFailed;

        // case -> change to checked
        if (chckChecked) {
            // console.log("handleModalCheckboxRadioChange change to CHECK ");
            // uncheck all others and change current
            variation.map((vari) => {
                let lname = vari + "Value";
                let subEle = document.getElementById(lname);


                // console.log("handleModalCheckboxRadioChange subElechecked " + JSON.stringify(subEle.checked));
                if (lname != currentname) {
                    // console.log("handleModalCheckboxRadioChange lname " + JSON.stringify(lname));
                    if (subEle) {
                        subEle.checked = false
                    }
                    currentModalQuarter[lname] = false;
                    if (vari == "failed") {
                        newFailed = false;
                    }
                } else { // lname == currentname)
                    // console.log("handleModalCheckboxRadioChange SET  " + lname + " TO " + JSON.stringify(!currentvalue));
                    // if (subEle) {
                    //     document.getElementById(lname).checked = !currentvalue;
                    // }
                    currentModalQuarter[lname] = !currentvalue;
                    if (vari == "failed") { // current is failed  value
                        newFailed = !currentvalue;
                    }
                }
            });
        }
        // else {
        currentModalQuarter["status"] = currentModalQuarter["failedValue"] == true ? "FAILED" :
            (currentModalQuarter["okValue"] == true ? "OK" : (currentModalQuarter["repairedValue"] == true ? "REPAIRED" : ""));
        // console.log("handleModalCheckboxRadioChange status " + JSON.stringify(currentModalQuarter[status]));
        // console.log("handleModalCheckboxRadioChange AFTER " + JSON.stringify(currentModalQuarter));

        currentModalQuarter["writingOnGraphicStyle"] = currentModalQuarter["status"] == "FAILED" ?
            this.state.writingOnGraphicStyleFailed : this.state.writingOnGraphicStyleOk;



        let quarterName = this.state.carView.toLowerCase() + this.state.topOrButtom.toLowerCase() + this.state.leftOrRight.toLowerCase();
        let hereQuarter = this.state.valueArrayLoadedFromDb.find(function (qrt) {
            return qrt.name == quarterName
        });

        Object.assign(hereQuarter, currentModalQuarter);

        this.setState({
            "modalQuarter": currentModalQuarter,
            "valueArrayLoadedFromDb": this.state.valueArrayLoadedFromDb
        });

        // update ok or failed and failed array

        this.updateLocalStatus(this.props.element.name, this.state.valueArrayLoadedFromDb);
    }

    updateLocalStatus(elementName, valueArrayLoadedFromDb) {
        // console.log("updateLocalStatus start");
        // console.log("updateLocalStatus valueArrayLoadedFromDb -- " + JSON.stringify(valueArrayLoadedFromDb));


        let oldFailed = false;
        let findFailed = valueArrayLoadedFromDb.find(function (aa) {
            return aa.name == elementName + "failed";
        });
        if (!findFailed) {
            console.log("Error! Structure of exterior inspection wrong!");
            return;
        } else {
            oldFailed = findFailed.value;
        }

        let findOk = valueArrayLoadedFromDb.find(function (aa) {
            return aa.name == elementName + "ok";
        });
        if (!findOk) {
            console.log("Error! Structure of exterior inspection wrong!");
            return;
        }

        let countOk = 0;
        let countFailed = 0;
        for (ii = 0; ii < 20; ii++) {
            if (countOk >= 0 && (valueArrayLoadedFromDb[ii].okValue == true || valueArrayLoadedFromDb[ii].repairedValue == true)) {
                countOk++;
            } else {
                countOk = -1; // stop counting
                // console.log("ii valueArrayLoadedFromDb[ii].failedValue " + ii + " " + valueArrayLoadedFromDb[ii].failedValue);
                if (valueArrayLoadedFromDb[ii].failedValue == true) {
                    // console.log("ii failed " + ii + " " + true);
                    countFailed++;
                }
            }
            if (countOk < 0 && countFailed > 0) {
                break;
            }
        }

        findOk.value = countOk == 20;
        findFailed.value = countFailed > 0;

        if (findFailed.value != oldFailed) {

            this.props.setFailedArray(this.props.element.name, findFailed.value);
        }
        // console.log("updateLocalStatus ok " + findOk.value + " failed " + findFailed.value);

    }

    takePhoto(event) {
        event.preventDefault();


        // let quarter = this.readModalFields(this.state.modalQuarter);
        let currentModalQuarter = {};
        let that = this;


        _.keys(this.state.modalQuarter).forEach(function (kk) {
            currentModalQuarter[kk] = that.state.modalQuarter[kk];
        });

        // console.log("currentModalQuarter " + JSON.stringify(currentModalQuarter));

        this.setState({showExtModal: false});
        let id = event.target.id;
        // console.log("takePhoto " + JSON.stringify(id));
        let cameraOptions = {
            quality: 490,
            width: 4000,
            height: 3000
        };


        MeteorCamera.getPicture(cameraOptions, function (error, newPhoto) {
            if (error) {
                console.log("photo error " + JSON.stringify(error));
            }
            if (newPhoto) {

                // console.log("newpicture " + newPhoto.length);

                let variation; // undefined because is not check field
                let checked; // undefined because is not check field
                /// todo that.props.handleFieldChange(that.props.element, id, newPhoto, checked, variation);


                // that.state.modalQuarter.photo = newPhoto;
                // that.state.modalQuarter.photoTaken = " - PHOTO";
                // that.state.modalQuarter["writingOnGraphicStyle"] = that.state.modalQuarter["status"] == "FAILED" ?
                //     that.state.writingOnGraphicStyleFailed : that.state.writingOnGraphicStyleOk;
                // that.setState({
                //     modalQuarter: that.state.modalQuarter
                // });

                currentModalQuarter.photo = newPhoto;
                currentModalQuarter.photoTaken = " - Photo Attached";
                currentModalQuarter["writingOnGraphicStyle"] = currentModalQuarter["status"] == "FAILED" ?
                    that.state.writingOnGraphicStyleFailed : that.state.writingOnGraphicStyleOk;
                let quarterName = that.state.carView.toLowerCase() + that.state.topOrButtom.toLowerCase() + that.state.leftOrRight.toLowerCase();
                let hereQuarter = that.state.valueArrayLoadedFromDb.find(function (qrt) {
                    return qrt.name == quarterName
                });

                Object.assign(hereQuarter, currentModalQuarter);

                that.setState({
                    modalQuarter: currentModalQuarter,
                    valueArrayLoadedFromDb: that.state.valueArrayLoadedFromDb
                });
                let checkedUndefined;
                let variationUndefined;

                // console.log("close modal --- handleFieldChange");
                that.props.handleFieldChange(that.props.lastUpdated, that.props.element, that.props.element.name, that.state.valueArrayLoadedFromDb, checkedUndefined, variationUndefined);

            } else {
                that.setState({showExtModal: true});
            }
        });
    };

    /* Utility function to convert a canvas to a BLOB */
    dataURLToBlob(dataURL) {
        var BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            var parts = dataURL.split(',');
            var contentType = parts[0].split(':')[1];
            var raw = parts[1];

            return new Blob([raw], {type: contentType});
        }

        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;

        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {type: contentType});
    }

    readImageFileURL(event) {
        // event.preventDefault();
        let id = this.props.element.name;
        // debugger;
        // console.log("readImageFileURL " +  id);

        // var preview = document.querySelector('img');
        let file = document.querySelector('input[type=file]').files[0];
        let reader = new FileReader();

        let that = this;
        reader.onloadend = function () {

            // console.log("ONLOADEND");
            let newPhoto = reader.result;
            if (newPhoto) {
                // console.log("new photo" + newPhoto);
                let variation; // undefined because is not check field
                let checked; // undefined because is not check field
                // todo that.props.handleFieldChange(that.props.element, id, newPhoto, checked, variation);
                // console.log("new photo" + JSON.stringify(newPhoto));
                that.state.modalQuarter.photo = newPhoto;
                that.state.modalQuarter.photoTaken = " - Photo Attached";
                that.setState({
                    modalQuarter: that.state.modalQuarter
                });
            } else {
                this.setState({showExtModal: true});
            }
        };
        reader.onload = function (readerEvent) {
            // debugger;
            // console.log("ONLOAD");
            let image = new Image();
            image.onload = function (imageEvent) {

                // Resize the image
                let canvas = document.createElement('canvas'),
                    max_size = 544,// TODO : pull max size from a site config
                    width = image.width,
                    height = image.height;
                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                let dataUrl = canvas.toDataURL('image/jpeg');
                let resizedImage = that.dataURLToBlob(dataUrl);
                //  console.log("resizedImage" + JSON.stringify(resizedImage));
                // todo that.props.handleFieldChange(that.props.element, id, resizedImage, checked, variation);
                that.state.modalQuarter.photo = newPhoto;
                that.state.modalQuarter.photoTaken = " - Photo Attached";
                that.setState({
                    modalQuarter: that.state.modalQuarter
                });
                $.event.trigger({
                    type: "imageResized",
                    blob: resizedImage,
                    url: dataUrl
                });
            };
            image.src = readerEvent.target.result;
        };


        if (file) {
            reader.readAsDataURL(file);
        } else {
            //preview.src = "";
        }
        return false;
    }

    render() {
        // console.log("render this.state.modalQuarter " + JSON.stringify(this.state.modalQuarter));
        // console.log("render whole obj " + JSON.stringify(this.state.valueArrayLoadedFromDb));
        // console.log("render " + JSON.stringify(this.props.valueArrayLoadedFromDb));
        // console.log("render bodyType " + this.props.bodyType);
        let bodytype = this.props.bodyType;
        let bodytypesmall = bodytype.toLowerCase();

        let onecheck = this.props.element;
        // this.debugprint(onecheck);

        let disabledIfSubmitted = this.props.status.includes("submitted");// || this.props.currentrole == "Admin Dealer" || !(this.props.currentpdiapproved);

        let classs = "PdiHyundai";

        let containerStyle = {
            width: "960px"

        };


        let modalHeader = "modalHeader";
        let modalOkName = "okValue";
        let modalFailedName = "failedValue";
        let modalRepairedName = "repairedValue";
        let modalComment = "modalComment";
        let modalTextActive = (this.state.modalQuarter && this.state.modalQuarter.commentValue && this.state.modalQuarter.commentValue.length > 0) ? "active" : "nonactive";

        let mheaderText = this.state.modalQuarter && this.state.modalQuarter.headerText ? this.state.modalQuarter.headerText : "";
        let mokValue = this.state.modalQuarter && this.state.modalQuarter.okValue ? this.state.modalQuarter.okValue : "";
        let mokChecked = mokValue ? true : false;
        // console.log("render mokChecked " + JSON.stringify(mokChecked));
        // let testChecked = true;
        let mrepairedValue = this.state.modalQuarter && this.state.modalQuarter.repairedValue ? this.state.modalQuarter.repairedValue : "";
        let mrepairedChecked = mrepairedValue ? true : false;

        let mfailedValue = this.state.modalQuarter && this.state.modalQuarter.failedValue ? this.state.modalQuarter.failedValue : "";
        let mfailedChecked = mfailedValue ? true : false;

        let mcommentValue = this.state.modalQuarter && this.state.modalQuarter.commentValue ? this.state.modalQuarter.commentValue : "";

        let mphoto = this.state.modalQuarter && this.state.modalQuarter.photo ? this.state.modalQuarter.photo : "";
        let mNoPhotoTaken = !(mphoto && mphoto.length > 0);
        // console.log("render mNoPhotoTaken " + mNoPhotoTaken);

        if (disabledIfSubmitted || (mcommentValue && mcommentValue.length > 0)) {
            editButtonDisabled = true;
        }
        let valueArray = this.state.valueArrayLoadedFromDb;
        //console.log("render valueArray[0] " + JSON.stringify(valueArray[0]));
        return (

            <div className={classs} ref='PdiHyundai'>

                <div className="container vehSchematic">

                    <div className={classnames('row', bodytypesmall)} id={onecheck.name}>

                        <div className="col m12 s12">
                            <div className="row">
                                <ExteriorInspectionDisplayAll carView="LEFTALL" offset="5" displayText="LEFT ALL OK" onClickAll={this.onClickAll.bind(this)} />
                            </div>
                            <div className="row">
                                <div className="col m12 s12 car-left">
                                    <ExteriorInspectionDisplay quartervalues={valueArray[0]}
                                                               carView="Left" topOrButtom="Top" leftOrRight="Left" positionClass="left-top" onClickBody={this.onClickBody.bind(this)} />
                                    <ExteriorInspectionDisplay quartervalues={valueArray[1]}
                                                               carView="Left" topOrButtom="Top" leftOrRight="Right" positionClass="right-top" onClickBody={this.onClickBody.bind(this)} />

                                    <div className="clear"></div>

                                    <ExteriorInspectionDisplay quartervalues={valueArray[2]}
                                                               carView="Left" topOrButtom="Bottom" leftOrRight="Left" positionClass="bottom-left" onClickBody={this.onClickBody.bind(this)} />
                                    <ExteriorInspectionDisplay quartervalues={valueArray[3]}
                                                               carView="Left" topOrButtom="Bottom" leftOrRight="Right" positionClass="bottom-right" onClickBody={this.onClickBody.bind(this)} />

                                </div>
                            </div>
                        </div>

                        <div className="col m12 s12">
                            <div className="row">
                                <ExteriorInspectionDisplayAll carView="RIGHTALL" offset="5" displayText="RIGHT ALL OK" onClickAll={this.onClickAll.bind(this)} />
                            </div>
                            <div className="row">
                                <div className="col m12 s12 car-right">

                                    <ExteriorInspectionDisplay quartervalues={valueArray[4]}
                                                               carView="Right" topOrButtom="Top" leftOrRight="Left" positionClass="left-top" onClickBody={this.onClickBody.bind(this)} />
                                    <ExteriorInspectionDisplay quartervalues={valueArray[5]}
                                                               carView="Right" topOrButtom="Top" leftOrRight="Right" positionClass="right-top" onClickBody={this.onClickBody.bind(this)} />


                                    <div className="clear"></div>

                                    <ExteriorInspectionDisplay quartervalues={valueArray[6]}
                                                               carView="Right" topOrButtom="Bottom" leftOrRight="Left" positionClass="bottom-left" onClickBody={this.onClickBody.bind(this)} />
                                    <ExteriorInspectionDisplay quartervalues={valueArray[7]}
                                                               carView="Right" topOrButtom="Bottom" leftOrRight="Right" positionClass="bottom-right" onClickBody={this.onClickBody.bind(this)} />

                                </div>
                            </div>
                        </div>

                        <div className="col m12 s12">
                            <div className="row">
                                <ExteriorInspectionDisplayAll carView="TOPALL" offset="5" displayText="TOP ALL OK" onClickAll={this.onClickAll.bind(this)} />
                            </div>
                            <div className="row">
                                <div className="col m12 s12 car-top">

                                    <ExteriorInspectionDisplay quartervalues={valueArray[8]}
                                                               carView="Top" topOrButtom="Top" leftOrRight="Left" positionClass="left-top" onClickBody={this.onClickBody.bind(this)} />
                                    <ExteriorInspectionDisplay quartervalues={valueArray[9]}
                                                               carView="Top" topOrButtom="Top" leftOrRight="Right" positionClass="right-top" onClickBody={this.onClickBody.bind(this)} />

                                    <div className="clear"></div>

                                    <ExteriorInspectionDisplay quartervalues={valueArray[10]}
                                                               carView="Top" topOrButtom="Bottom" leftOrRight="Left" positionClass="bottom-left" onClickBody={this.onClickBody.bind(this)} />
                                    <ExteriorInspectionDisplay quartervalues={valueArray[11]}
                                                               carView="Top" topOrButtom="Bottom" leftOrRight="Right" positionClass="bottom-right" onClickBody={this.onClickBody.bind(this)} />


                                </div>
                            </div>
                        </div>

                        <div className="col m6 s12 noMarginPadding">
                            <div className="row">
                                <ExteriorInspectionDisplayAll carView="FRONTALL" offset="4" displayText="FRONT ALL OK" onClickAll={this.onClickAll.bind(this)} />
                            </div>
                            <div className="row">
                                <div className="col m12 s12 car-front noMarginPadding">

                                    <ExteriorInspectionDisplay quartervalues={valueArray[12]}
                                                               carView="Front" topOrButtom="Top" leftOrRight="Left" positionClass="left-top" onClickBody={this.onClickBody.bind(this)} />
                                    <ExteriorInspectionDisplay quartervalues={valueArray[13]}
                                                               carView="Front" topOrButtom="Top" leftOrRight="Right" positionClass="right-top" onClickBody={this.onClickBody.bind(this)} />


                                    <div className="clear"></div>

                                    <ExteriorInspectionDisplay quartervalues={valueArray[14]}
                                                               carView="Front" topOrButtom="Bottom" leftOrRight="Left" positionClass="bottom-left" onClickBody={this.onClickBody.bind(this)} />
                                    <ExteriorInspectionDisplay quartervalues={valueArray[15]}
                                                               carView="Front" topOrButtom="Bottom" leftOrRight="Right" positionClass="bottom-right" onClickBody={this.onClickBody.bind(this)} />


                                </div>
                            </div>
                        </div>

                        <div className="col m6 s12 noMarginPadding">
                            <div className="row">
                                <ExteriorInspectionDisplayAll carView="REARALL" offset="4" displayText="REAR ALL OK" onClickAll={this.onClickAll.bind(this)} />
                            </div>
                            <div className="row">
                                <div className="col m12 s12 car-back noMarginPadding">

                                    <ExteriorInspectionDisplay quartervalues={valueArray[16]}
                                                               carView="Back" topOrButtom="Top" leftOrRight="Left" positionClass="left-top" onClickBody={this.onClickBody.bind(this)} />
                                    <ExteriorInspectionDisplay quartervalues={valueArray[17]}
                                                               carView="Back" topOrButtom="Top" leftOrRight="Right" positionClass="right-top" onClickBody={this.onClickBody.bind(this)} />

                                    <div className="clear"></div>

                                    <ExteriorInspectionDisplay quartervalues={valueArray[18]}
                                                               carView="Back" topOrButtom="Bottom" leftOrRight="Left" positionClass="bottom-left" onClickBody={this.onClickBody.bind(this)} />
                                    <ExteriorInspectionDisplay quartervalues={valueArray[19]}
                                                               carView="Back" topOrButtom="Bottom" leftOrRight="Right" positionClass="bottom-right" onClickBody={this.onClickBody.bind(this)} />

                                </div>
                            </div>
                        </div>

                        {/*<ExteriorInspectionDisplay*/}
                        {/*key={xxtestkey}*/}
                        {/*quarter={xxtestquarter}*/}
                        {/*/>*/}
                        {/*/!*{this.renderFilledOutScratchReports()}*!/*/}

                    </div>
                </div>



                <Modal
                    containerStyle={containerStyle}
                    show={this.state.showExtModal}
                    onClose={this.closeModal.bind(this)}>

                    <h4 ref={modalHeader}>{mheaderText}</h4>
                    <div className="row">
                        <div className='col m12 s12 text-left'>
                            <div className="col checkReactive m12">
                                <div className="col s12 m4">
                                    <input type="radio" id={modalOkName} ref={modalOkName} name={onecheck.name}
                                           className="radioCheck" defaultChecked={mokChecked}
                                           onClick={this.handleModalCheckboxRadioChange.bind(this)}
                                           disabled={disabledIfSubmitted}/>
                                    <label htmlFor={modalOkName}>OK</label>
                                </div>
                                <div className="col s12 m4">
                                    <input type="radio" id={modalRepairedName} ref={modalRepairedName}
                                           name={onecheck.name}
                                           className="radioCheck" defaultChecked={mrepairedChecked}
                                           onClick={this.handleModalCheckboxRadioChange.bind(this)}
                                           disabled={disabledIfSubmitted}/>
                                    <label htmlFor={modalRepairedName}>Repaired</label>
                                </div>
                                <div className="col s12 m4">
                                    <input type="radio" id={modalFailedName} ref={modalFailedName} name={onecheck.name}
                                           className="radioCheck" defaultChecked={mfailedChecked}
                                           onClick={this.handleModalCheckboxRadioChange.bind(this)}
                                           disabled={disabledIfSubmitted}/>
                                    <label className="radioWarning" htmlFor={modalFailedName}>Failed</label>
                                </div>
                            </div>


                            <div className='col m12 s12 input-field commentBoxPlaceholder'>
                                <textarea type="text" ref={modalComment} id={modalComment}
                                       defaultValue={mcommentValue} className="materialize-textarea"
                                       onChange={this.handleModalCommentChange.bind(this)}
                                       required disabled={disabledIfSubmitted}/>
                                <label className={modalTextActive} htmlFor={modalComment}>Describe
                                    Fault:</label>
                            </div>
                        </div>
                        <a className="btn waves-effect waves-light blue btn"
                           onClick={this.handleSubmitScratchReport.bind(this)}>Close </a>
                    </div>
                    { mNoPhotoTaken ?


                            <div className="row">
                                <div className="col m12 battryBtn checkReactive">
                                    <div className="col s6 m6">
                                        <input type="button" className="waves-effect cyan waves-light btn-large"
                                               id={onecheck.name}
                                               onClick={this.takePhoto.bind(this)} value="TAKE PHOTO AND CLOSE"
                                               required
                                               disabled={disabledIfSubmitted}/>
                                    </div>
                                    <div className="col s6 m6">
                                        <input type="file"
                                               id={onecheck.name} name="photoimage" defaultValue="Upload Photo"
                                               required accept=".jpg,.jpeg,.png,capture=camera"
                                               onChange={this.readImageFileURL.bind(this)}
                                               disabled={disabledIfSubmitted}/>
                                    </div>
                                </div>


                            </div>
                        :
                        <div>
                            <div className="row">
                                <div className="col m12 battryBtn checkReactive">
                                    <div className="col s6 m6">
                                        <input type="button" className="waves-effect cyan waves-light btn-large"
                                               id={onecheck.name}
                                               onClick={this.takePhoto.bind(this)} value="TAKE PHOTO AND CLOSE"
                                               disabled={disabledIfSubmitted}/>
                                    </div>
                                    <div className="col s6 m6">
                                        <input type="file"
                                               id={onecheck.name} name="photoimage" defaultValue="Upload Photo"
                                               required accept=".jpg,.jpeg,.png,capture=camera"
                                               onChange={this.readImageFileURL.bind(this)}
                                               disabled={disabledIfSubmitted}/>
                                    </div>
                                    <ul className="ulPhoto">


                                        <li>
                                            <img className="takephoto" src={mphoto}/>
                                        </li>
                                    </ul>
                                </div>


                            </div>
                        </div>

                    }

                </Modal>
            </div>
        );

    }
}


// // An object that could be one of many types
// optionalUnion: React.PropTypes.oneOfType([
//     React.PropTypes.string,
//     React.PropTypes.number,
//     React.PropTypes.instanceOf(Message)
// ]),

ExteriorInspection.propTypes = {
    // This component gets the checklisttemplate to display through a React prop.
    // We can use propTypes to indicate it is required
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool,
    element: PropTypes.object.isRequired,
    status: PropTypes.string.isRequired,
    locations: PropTypes.array.isRequired,
    openSections: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.instanceOf(Date).isRequired,
    lastEditUserName: PropTypes.string.isRequired,
    lastEditUserDealer: PropTypes.string.isRequired,
    valueLoadedFromDb: PropTypes.string.isRequired,
    valueArrayLoadedFromDb: PropTypes.array.isRequired,
    valueslist: PropTypes.array.isRequired,
    setFailedArray: PropTypes.func,
    handleFieldChange: PropTypes.func.isRequired,
    bodyType: PropTypes.string.isRequired

};
