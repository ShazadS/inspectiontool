import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import ChecklistElement from './ChecklistElement.jsx';
import SweetAlert from 'react-bootstrap-sweetalert';
import SignaturePad from 'react-signature-pad';
import Modal from '../simplemodal/simple-modal';
import 'simple-react-modal'

// ChecklistTemplate component - represents a single checklisttemplate template
export default class ChecklistTemplate extends Component {

    constructor(props) {
        // console.log("ChecklistTemplate constructor "); // + JSON.stringify(props));
        super(props);
        let savedValues = this.clone(props.valueslist);
        let updatedValues = this.clone(props.valueslist);
        let lastUserId = props.lastEditUserId;
        let lastUserName = props.lastEditUserName;
        let lastUpdated = props.lastUpdated;
        let numDone = props.numDone;
        if (!props.numDone || props.numDone.length == 0) {
            let results = this.recomputeStatus(false, updatedValues);
            numDone = results.newNumDone;
        }
        let options = {
            weekday: "short", year: "numeric", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };
        let techDateSignedStr = (typeof props.techDateSigned === null ) ? "" : props.techDateSigned.toLocaleTimeString("en-NZ", options);
        let smanDateSignedStr = (typeof props.smanDateSigned === null ) ? "" : props.smanDateSigned.toLocaleTimeString("en-NZ", options);

        switch (props.status) {
            case 'service manager submitted': {
                this.state = {
                    "updatedValues": updatedValues,
                    "numDone": numDone,
                    "savedValues": savedValues,
                    "controlledModalOpen": false,
                    "showModal": false,
                    "showManModal": false,
                    "showPdfModal": false,
                    "signatureText": " TECHNICIAN ( " + props.techUserName + " ) ",
                    "signatureDate": techDateSignedStr,
                    "signatureManText": " SERVICE MANAGER ( " + props.smanUserName + " ) ",
                    "signatureManDate": smanDateSignedStr
                }
            }
                break;
            case 'technician submitted': {
                this.state = {
                    "updatedValues": updatedValues,
                    "numDone": numDone,
                    "savedValues": savedValues,
                    "controlledModalOpen": false,
                    "showModal": false,
                    "showManModal": false,
                    "showPdfModal": false,
                    "signatureText": " TECHNICIAN ( " + props.techUserName + " ) ",
                    "signatureDate": techDateSignedStr,
                    "signatureManText": "",
                    "signatureManDate": ""
                }
            }
                break;
            case 'ready to submit':
            case 'pending':
            case 'failed-pending':
            case 'failed':
            case 'new': {
                this.state = {
                    "updatedValues": updatedValues,
                    "numDone": numDone,
                    "savedValues": savedValues,
                    "controlledModalOpen": false,
                    "showModal": false,
                    "showManModal": false,
                    "showPdfModal": false,
                    "signatureText": "NOT SIGNED YET ",
                    "signatureDate": "",
                    "signatureManText": "",
                    "signatureManDate": ""
                }
            }
                break;
            default: {
                console.log("ERROR wrong status name " + props.status);
            }
        }
        this.state.lastUpdated = props.lastUpdated;
        this.state.status = props.status;
    }

    doNothing(event) {
        if (event) {
            event.preventDefault();
        }
        this.setState({submitalert: null});
        return false;
    }

    doReload(event) {
        console.log("doReload ");
        location.reload();
        return true;
    }

    changeLocalState(lastUpdated, valueslist, status, numDone, signaturePic, signatureManPic) {
        // console.log("changeLocalState " + this.props.currentusername);

        let nowDate = new Date();

        let cloneUpdated = this.clone(this.state.updatedValues);
        let changedState = {
            "numDone": numDone,
            "savedValues": cloneUpdated,
            "controlledModalOpen": false,
            "showModal": false,
            "showManModal": false,
            "signaturePic": signaturePic,
            "signatureManPic": signatureManPic
        };
        let options = {
            weekday: "short", year: "numeric", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };
        let techDateSignedStr = (typeof this.props.techDateSigned === null )
            ? "" : this.props.techDateSigned.toLocaleTimeString("en-NZ", options);

        switch (status) {
            case 'service manager submitted': {
                changedState.signatureText = " TECHNICIAN ( " + this.props.techUserName + " ) ";
                changedState.signatureDate = techDateSignedStr;
                changedState.signatureManText = " SERVICE MANAGER ( " + this.props.smanUserName + " ) ";
                changedState.signatureManDate = nowDate.toLocaleTimeString("en-NZ", options);
            }
                break;
            case 'technician submitted': {
                changedState.signatureText = " TECHNICIAN ( " + this.props.techUserName + " ) ";
                changedState.signatureDate = nowDate.toLocaleTimeString("en-NZ", options);
                ;
                changedState.signatureManText = "";
                changedState.signatureManDate = "";
            }
                break;
            case 'ready for submit':
            case 'pending':
            case 'failed-pending':
            case 'new': {
                changedState.signatureText = "NOT SIGNED YET ";
                changedState.signatureDate = "";
                changedState.signatureManText = "";
                changedState.signatureManDate = "";
            }
                break;
            default: {
                console.log("ERROR wrong status name " + this.props.status);
            }
        }

        changedState["showModal"] = false;
        changedState["lastUpdated"] = lastUpdated ? lastUpdated : this.props.lastUpdated;
        changedState["status"] = status;
        this.setState(changedState);
    }

    printPdf(event) {
        event.preventDefault();

        // don't need to save if submtted because
        // submission process saves the values
        if (!(this.props.status == "technician submitted" || this.props.status == "service manager submitted")) {
            let undefineddate;
            this.changeLocalState(undefineddate, this.state.updatedValues, this.props.status, this.props.numDone,
                this.selectSignaturePic(this.state.signaturePic, this.props.signaturePic), this.selectSignaturePic(this.state.signatureManPic, this.props.signaturePic));
        }

        let theHref = 'https://' + Session.get("server") + '/pdfprint/' + this.props.checklisttemplate._id + "/" + this.props.valuesid + "/" + this.props.vin;
        window.location.assign(theHref);
        return true;
    };


    resetForClose(event) {
        // console.log("resetForClose ");
        this.setState({
            "updatedValues": this.state.savedValues,
            submitalert: null
        });
        // todo this.context.router.transitionTo('/');
        return true;
    }

    saveForClose(event) {
        // console.log("saveForClose ");

        let undefineddate;
        this.changeLocalState(undefineddate, this.state.updatedValues, this.props.status, this.props.numDone, null);
        this.setState({
            submitalert: <SweetAlert
                custom
                showCancel
                allowOutsideClick="false"
                confirmBtnText="Continue to Close"
                confirmBtnBsStyle="primary"
                cancelBtnText="Cancel"
                cancelBtnBsStyle="default"
                title="SAVED"
                onConfirm={this.doClose.bind(this)}
                onCancel={this.doNothing.bind(this)}>
                All Data Entry Saved to Database
            </SweetAlert>
        });

        return true;
    }

    doClose(event) {
        this.setState({submitalert: null});
        // todo USE ROUTER to go to home page
        // todo
        // todo

        window.location.assign("/");
    }

    handleClose(event) {
        event.preventDefault();
        this.doClose(event);

        return true;
    }

    showModal(event) {
        event.preventDefault();
        this.setState({showModal: true})
    }

    showManModal(event) {
        event.preventDefault();
        this.setState({showManModal: true})
    }

    showPdfModal(event) {
        event.preventDefault();
        this.setState({showPdfModal: true})
    }

    handleCloseSignature(event) {
        event.preventDefault();
        // console.log("handle close signature");
        this.setState({showModal: false});
        this.setState({submitalert: null});
    }

    handleCloseManSignature(event) {
        event.preventDefault();
        // console.log("handle close signature");
        this.setState({showManModal: false});
        this.setState({submitalert: null});
    }

    handleSubmitSignature(event) {
        event.preventDefault();
        // console.log("handleSubmitSignature signature");
        let sign = this.refs.signature;
        if (sign.isEmpty()) {
            this.setState({
                "showModal": false,
                "submitalert": <SweetAlert
                    custom
                    confirmBtnText="Back to Data Entry"
                    confirmBtnBsStyle="primary"
                    title="Not Submitted"
                    onConfirm={this.doNothing.bind(this)}>
                    Signature was empty - Please add signature.
                </SweetAlert>
            });
        } else {
            let signaturePic = sign.toDataURL();
            let lastUpdated = new Date();

            // console.log("handleSubmitSignature save signature " + signaturePic);
            this.props.updateStatus(lastUpdated, null, null, "technician submitted", this.props.numDone, signaturePic, null);
            this.changeLocalState(lastUpdated, this.state.updatedValues, "technician submitted", this.props.numDone, signaturePic, null);
        }
    }

    handleSubmitManSignature(event) {
        event.preventDefault();
        // console.log("submit signature");
        let sign = this.refs.manSignature;
        if (sign.isEmpty()) {
            this.setState({
                "showManModal": false,
                "submitalert": <SweetAlert
                    custom
                    confirmBtnText="Cancel"
                    confirmBtnBsStyle="primary"
                    title="Not Submitted"
                    onConfirm={this.doNothing.bind(this)}>
                    Signature was empty - Please add signature.
                </SweetAlert>
            });
        } else {
            let signatureManPic = sign.toDataURL();
            let lastUpdated = new Date();
            this.props.updateStatus(lastUpdated, null, null, "service manager submitted", this.props.numDone, this.props.signaturePic, signatureManPic);
            this.changeLocalState(lastUpdated, this.state.updatedValues, "service manager submitted", this.props.numDone,
                this.props.signaturePic, signatureManPic);
        }
    }

    handleSubmit(event) {
        // console.log("handle submit props.status " + this.props.status);
        event.preventDefault();

        //Commented by SS: if (this.props.status != "ready to submit" && this.props.status != "technician submitted") {
	if (this.props.status != "ready to submit" && this.props.status != "failed" && this.props.status != "technician submitted") {
            if (this.props.status == "failed-pending") {
                this.setState({
                    submitalert: <SweetAlert
                        custom
                        confirmBtnText="Back to Data Entry"
                        confirmBtnBsStyle="primary"
                        title="Failed - Not Ready for Submission"
                        onConfirm={this.doNothing.bind(this)}>
                        Some checks are marked as failed and maybe not all required data is entered yet.
                    </SweetAlert>
                });
            } else {
                this.setState({
                    submitalert: <SweetAlert
                        custom
                        confirmBtnText="Continue Data Entry"
                        confirmBtnBsStyle="primary"
                        title="Not Ready for Submission"
                        onConfirm={this.doNothing.bind(this)}>
                        Not all required data entered – <br/>Please enter required information.
                    </SweetAlert>
                });
            }

        } else {
            //Commented by SS: if (this.props.status == "ready to submit") {
            if (this.props.status == "ready to submit" ||  this.props.status == 'failed') {
		    // console.log("show modal ");
                this.showModal(event);
            } else {
                // this.props.status == "technician submitted"
                // console.log("show MANAGER modal ");
                this.showManModal(event);
            }
        }
    }

    clone(obj) {
        let copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (let attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    updateValue(name, value) {
        // console.log("updateValue name: " + name + " / value: " + value);
        let valelement = _.find(this.state.updatedValues, function (ele) {
            return ele.name == name
        });

        // console.log("updateValue valelement: " + JSON.stringify(valelement));
        valelement.value = value;
        this.setState({"updatedValues": this.state.updatedValues});
    }


    updateCheckListValue(name, id, value, variation) {
        let valelement = _.find(this.state.updatedValues, function (ele) {
            return ele.name == name
        });

        if (valelement.value.constructor === Array) {
            let subListElement = _.find(valelement.value, function (subele) {
                return subele.name == id;
            });

            if (!subListElement) {
                console.log("Error!:  " + id + " not found in value list");
            } else {
                subListElement.value = value;
                if (value) {
                    // set all other to false
                    _.forEach(valelement.value, (function (subele) {
                        if (subele.name != id) {
                            subele.value = false;
                            // console.log("name " + subele.name  + " = false");
                        }
                    }));
                }
            }
        }
        this.setState({"updatedValues": this.state.updatedValues});
    }

    updateCheckListCommentValue(name, id, value) {

        // console.log("updateCheckListCommentValue");
        // find the element in values
        let valelement = _.find(this.state.updatedValues, function (ele) {
            return ele.name == name
        });

        // must have array
        if (valelement.value.constructor === Array) {
            let subListElement = _.find(valelement.value, function (subele) {
                return subele.name == id;
            });

            if (!subListElement) {
                console.log("Error!:  " + id + " not found in value list");
            } else {
                subListElement.value = value;
                // console.log("updateCheckListCommentValue " + value);
            }
        } else {
            console.log("Error comments of checklist of name " + name + " should have array as value")
        }
        this.setState({"updatedValues": this.state.updatedValues});

    }

    handleFieldChange(lastUpdated, element, id, value, isChecked, variation) {
        // console.log("handleFieldChange status  " + JSON.stringify(lastUpdated));
        if (this.props.status && this.props.status != "service manager submitted") {
            // console.log("handleFieldChange element  " + JSON.stringify(element));
            // console.log("handleFieldChange id  " + id);
            // console.log("handleFieldChange value  " + value);
            // console.log("handleFieldChange isChecked  " + isChecked );
            // console.log("handleFieldChange variation  " + variation );

            if (element.name == id) {
                // field with one value
                this.updateValue(element.name, value);
            } else {
                // checklist
                if (id.includes("comment")) {
                    this.updateCheckListCommentValue(element.name, id, value);
                } else {
                    this.updateCheckListValue(element.name, id, isChecked, variation);
                }
            }
            this.setState({
                lastUpdated: lastUpdated
            });
            this.props.updateStatus(lastUpdated, false, this.state.updatedValues, this.props.status, this.props.numDone, null, null);
        }
    }

    renderChecklistElements() {
        // console.log("ChecklistTemplate renderChecklistElements ");
        // console.log("ChecklistTemplate renderChecklistElements " + JSON.stringify(this.props.checklisttemplate));
        // console.log("ChecklistTemplate renderChecklistElements props.status " + JSON.stringify(this.props.status));
        // console.log("ChecklistTemplate renderChecklistElements state.status " + JSON.stringify(this.state.updatedStatustatus));
        let elements = this.props.checklisttemplate
        && this.props.checklisttemplate.elements
        && (this.props.checklisttemplate.elements.length > 0) ? this.props.checklisttemplate.elements : [];
        // console.log("renderChecklistElements elements " + JSON.stringify(elements));


        let valueslist = this.props.valueslist ? this.props.valueslist : [];

        // console.log("renderChecklistElements valueslist " + JSON.stringify(valueslist));
        return elements.map((element) => {
            // console.log("renderChecklistElements element " + JSON.stringify(element.name));
            let elementInValues = valueslist.find(function (valuecombo) {
                return valuecombo.name == element.name;
            });

            let val = elementInValues && elementInValues.valuelist ? (elementInValues.valuelist.constructor === Array ? '' : elementInValues.valuelist) : '';
            let valArray = elementInValues && elementInValues.valuelist ? (elementInValues.valuelist.constructor === Array ? elementInValues.valuelist : []) : [];

            // console.log("renderChecklistElements values[" + element.name + "]= " + JSON.stringify(valueI));
            return (
                <ChecklistElement
                    key={element.name}
                    currentrole={this.props.currentrole}
                    currentpdiapproved={this.props.currentpdiapproved}
                    element={element}
                    status={this.props.status}
                    openSections={this.props.openSections}
                    locations={this.props.locations}
                    bodyType={this.props.bodyType}
                    lastUpdated={this.props.lastUpdated}
                    techDateSigned={this.props.techDateSigned}
                    smanDateSigned={this.props.smanDateSigned}
                    lastEditUserId={this.props.lastEditUserId}
                    lastEditUserName={this.props.lastEditUserName}
                    lastEditUserDealer={this.props.lastEditUserDealer}
                    techUserName={this.props.techUserName}
                    smanUserName={this.props.smanUserName}
                    valueLoadedFromDb={val}
                    valueArrayLoadedFromDb={valArray}
                    valueslist={valueslist}
                    handleFieldChange={this.handleFieldChange.bind(this)}
                />
            );
        });
    }

    selectSignaturePic(statePic, propsPic) {
        let signaturePic;
        if (statePic || propsPic) {
            signaturePic = statePic ? statePic : propsPic;
        }
        return signaturePic;
    }

    renderSignaturePic(statePic, propsPic) {
        let signaturePic = this.selectSignaturePic(statePic, propsPic);
        if (signaturePic) {
            // console.log("renderSignaturePic value" + signaturePic);
            return (
                <img src={signaturePic} height="150" width="200" alt="" className="img-rounded"/>
            )
        }
    }

    closeModal() {
        event.preventDefault();
        this.setState({showModal: false})
    }

    closeManModal() {
        event.preventDefault();
        this.setState({showManModal: false})
    }

    closePdfModal() {
        event.preventDefault();
        this.setState({showPdfModal: false})
    }

    componentWillReceiveProps() {
        // console.log("ChecklistTemplate - componentWillReceiveProps ");
    }

    componentWillUnmount() {
        // console.log("componentWillUnmount");

        let changed = this.checkValuesForChanges(this.state.updatedValues, this.state.savedValues);
        // console.log("componentWillUnmount - changed " + changed);
    }

    avoidReloadPage(event) {
        event.preventDefault();
        // console.log("avoidReloadPage ");
        return false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log("shouldComponentUpdate");
        return true;
    }

    // onDocumentLoad({total}) {
    //     this.setState({total});
    // }
    //
    // onPageLoad({pageIndex, pageNumber}) {
    //     this.setState({pageIndex, pageNumber});
    // }

    render() {
        // console.log("ChecklistTemplate render  state status:" + this.state.status);
        // console.log("ChecklistTemplate render  props date:" + this.props.status);
        // console.log("record from values " + JSON.stringify(this.props.lastEditUserDealer));

        let behind = false;
        if (this.props.status == "technician submitted" || this.props.status == "service manager submitted") {
            behind = this.state.status != this.props.status;
        } else {
            behind = this.state.lastUpdated.getTime() < this.props.lastUpdated.getTime();
        }

        // console.log("ChecklistElement render  type:" + this.props.element.labeltext);
        // console.log("ChecklistTemplate render BEHIND:" + behind);

        // console.log("ChecklistTemplate render ");
        // console.log("ChecklistTemplate render dealer" + this.props.currentdealername);
        let signature = "signature";
        let manSignature = "manSignature";

        let disabledIfSubmitted = (this.props.status.includes("submitted") || this.props.currentrole == "Admin Dealer" || !this.props.currentpdiapproved); //  ? "disabled" : "";

        let disabledIfManSubmitted = (this.props.status == "service manager submitted"
            || (this.props.status == "technician submitted" && this.props.currentrole != "Service Manager" && this.props.currentrole != "Admin System")); // ? "disabled" : "";
        // console.log("ChecklistTemplate - render disabledIfManSubmitted " + disabledIfManSubmitted);
        // console.log("ChecklistTemplate - render disabledIfSubmitted " + disabledIfSubmitted);
        // console.log("ChecklistTemplate - props.status " + this.props.status);
        // console.log("ChecklistTemplate - state.status " + this.state.status);

        return (
            <div>
                <form>
                    <div className="col right marginTopNegative">

                        <a className="waves-effect waves-light blue darken-3 btn-large"
                           type="action"

                           name="printpdf" onClick={this.printPdf.bind(this)} target="_blank">
                            <i className="material-icons left">file_download</i>PDF</a>

                    </div>
                    {this.renderChecklistElements()}
                    <div className="row padTopBtm">
                        <div className="col s12 m6">
                            <div>{this.renderSignaturePic(this.state.signaturePic, this.props.signaturePic)}</div>
                            <div>{this.state.signatureText}</div>
                            <div>{this.state.signatureDate}</div>
                        </div>
                        <div className="col s12 m6">
                            <div>{this.renderSignaturePic(this.state.signatureManPic, this.props.signatureManPic)}</div>
                            <div>{this.state.signatureManText}</div>
                            <div>{this.state.signatureManDate}</div>
                        </div>
                    </div>
                    <div className="row btmPadBtn">
                        <div className="col right marginTop" name="submitButton" id="submitButton">


                            <a className="waves-effect waves-light amber darken-2  btn-large" href="PdiHome"
                               type="cancel"
                               name="cancel" onClick={this.handleClose.bind(this)}><i className="material-icons left">close</i>Close</a>


                            {disabledIfManSubmitted ?
                                <div></div>
                                :
                                <a className="btn waves-effect waves-light blue btn-large active" href="/"
                                   onClick={this.handleSubmit.bind(this)}><i
                                    className="material-icons left">arrow_forward</i>Submit</a>
                            }

                        </div>
                    </div>
                    {this.state.submitalert}
                    {behind ? <SweetAlert
                            custom
                            confirmBtnText="Reload"
                            confirmBtnBsStyle="primary"
                            title="Please Reload Window"
                            onConfirm={this.doReload.bind(this)}>
                            Data has changed on server. Checklist is open in another window and has been changed. Please
                            reload the browser.
                        </SweetAlert>
                        : <div></div>
                    }
                </form>

                <Modal
                    show={this.state.showModal}
                    onClose={this.closeModal.bind(this)}>

                    <h4>Technician:</h4>
                    <h5>Please sign here:</h5>
                    <div>
                        <SignaturePad clearButton="true" ref={signature} name={signature} id={signature}/>
                        <a className="waves-effect waves-light amber darken-2  btn" href="PdiHome"
                           type="cancel" name="cancel" onClick={this.handleCloseSignature.bind(this)}>Cancel</a>
                        <a className="btn waves-effect waves-light blue btn"
                           onClick={this.handleSubmitSignature.bind(this)}>Submit</a>
                    </div>
                </Modal>

                <Modal
                    show={this.state.showManModal}
                    onClose={this.closeManModal.bind(this)}>

                    <h4>Service Manager:</h4>
                    <h5>Please sign here:</h5>
                    <div>
                        <SignaturePad clearButton="true" ref={manSignature} name={manSignature} id={manSignature}/>
                        <a className="waves-effect waves-light amber darken-2  btn"
                           type="cancel" name="cancel" onClick={this.handleCloseManSignature.bind(this)}>Cancel</a>
                        <a className="btn waves-effect waves-light blue btn"
                           onClick={this.handleSubmitManSignature.bind(this)}>Submit</a>
                    </div>
                </Modal>


            </div>
        );
        //   }
    }

    //The provided value 'moz-chunked-arraybuffer' is not a valid enum value of type XMLHttpRequestResponseType.

    clone(obj) {
        let copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (let attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }
}

ChecklistTemplate.propTypes = {
    valuesid: PropTypes.string.isRequired,
    currentuserid: PropTypes.string.isRequired,
    currentusername: React.PropTypes.string.isRequired,
    currentdealername: React.PropTypes.string.isRequired,
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool,

    checklisttype: PropTypes.string.isRequired,
    checklistversion: PropTypes.string.isRequired,
    checklisttemplate: PropTypes.object.isRequired,
    openSections: PropTypes.bool.isRequired,
    status: PropTypes.string.isRequired,
    numDone: PropTypes.string.isRequired,
    vin: PropTypes.string.isRequired,
    dealerName: PropTypes.string.isRequired,
    bodyType: PropTypes.string.isRequired,
    make: PropTypes.string.isRequired,
    locations: PropTypes.array.isRequired,
    lastUpdated: PropTypes.instanceOf(Date).isRequired,
    techDateSigned: PropTypes.instanceOf(Date).isRequired,
    smanDateSigned: PropTypes.instanceOf(Date).isRequired,
    signaturePic: PropTypes.string.isRequired,
    signatureManPic: PropTypes.string.isRequired,
    lastEditUserId: PropTypes.string.isRequired,
    lastEditUserName: PropTypes.string.isRequired,
    lastEditUserDealer: PropTypes.string.isRequired,
    techUserName: PropTypes.string.isRequired,
    smanUserName: PropTypes.string.isRequired,

    valueslist: PropTypes.array.isRequired,
    updateStatus: PropTypes.func.isRequired
};
