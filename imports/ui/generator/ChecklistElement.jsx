import React, {Component, PropTypes} from 'react';
import Collapsible from 'react-collapsible';
import {MeteorCamera} from 'meteor/mdg:camera';
import ExteriorInspection from './ExteriorInspection.jsx';

let Scroll = require('react-scroll');
let Element = Scroll.Element;

// ChecklistElement component - represents a single checklisttemplate template element like
// a header text or a check or comments
export default class ChecklistElement extends Component {

    constructor(props) {
        super(props);
        // console.log("ChecklistElement constructor " + JSON.stringify(this.props.element.name));

        let lengthComment = 0;
        let shouldHide = true;
        if (props.valueArrayLoadedFromDb.length > 0) {

            let commentText = _.find(props.valueArrayLoadedFromDb, function (subele) {
                return subele.name.includes("comment");
            });
            lengthComment = commentText && commentText.value ? commentText.value.length : 0;
            shouldHide = lengthComment == 0;
        }

        this.state = {
            elements: [],
            status: props.status,
            valueLoadedFromDb: props.valueLoadedFromDb,
            valueArrayLoadedFromDb: props.valueArrayLoadedFromDb,
            lengthComment: lengthComment,
            shouldHide: shouldHide,
            failedArray: []
        };

        // console.log("ChecklistElement constructor END shouldHide " + JSON.stringify(shouldHide));
    };

    setFailedArray(name, failedValue) {
        // console.log("setFailedArray - called from " + name + " at: " + this.props.element.type);
        // console.log("setFailedArray in  " + this.props.element.name + "  " + JSON.stringify(this.state.failedArray));
        // console.log("setFailedArray in  " + this.props.element.name + "  " + JSON.stringify(this.props.failedArray));
        if (this.props.element.type == "exterior_inspection") {
            this.props.setFailedArray(name, failedValue);
        } else {
            let failedArray = _.clone(this.state.failedArray);

            let found = false;
            failedArray.forEach(function (a) {
                if (a.name == name) {
                    a.failedValue = failedValue;
                    found = true;
                }
            });
            if (!found) {
                if (failedValue) {
                    failedArray.push({"name": name, "failedValue": failedValue})
                }
            }
            this.setState({"failedArray": failedArray})
        }
    }

    onClickCommentButton(event) {
        event.preventDefault();
        if (!this.state.shouldHide) {
            this.setState({
                shouldHide: true
            })
        }
        else {
            this.setState({
                shouldHide: false
            })
        }
    };

    renderElements(key, sublist) {
        // console.log("renderElements "); //  + key + " elements:" + JSON.stringify(sublist));


        if (sublist.length > 0) {

            let valueslist = this.props.valueslist;


            return sublist.map((element) => {

                if (element) {
                    let elementInValues = valueslist.find(function (valuecombo) {
                        return valuecombo.name == element.name;
                    });

                    let val = elementInValues ? (elementInValues.value.constructor === Array ? '' : elementInValues.value) : '';
                    let valArray = elementInValues ? (elementInValues.value.constructor === Array ? elementInValues.value : []) : [];

                    // console.log("renderElements " + this.props.element.type);
                    if (element.type != "ignore_element") {
                        if (element.type == "simple_check" || element.type == "simple_check_no_NA" || element.type == "exterior_inspection") {
                            return (
                                <ChecklistElement
                                    key={element.name}
                                    element={element}
                                    currentrole={this.props.currentrole}
                                    currentpdiapproved={this.props.currentpdiapproved}
                                    openSections={this.props.openSections}
                                    status={this.props.status}
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
                                    setFailedArray={this.setFailedArray.bind(this)}
                                    handleFieldChange={this.props.handleFieldChange}
                                />
                            );
                        } else {
                            return (
                                <ChecklistElement
                                    key={element.name}
                                    element={element}
                                    currentrole={this.props.currentrole}
                                    currentpdiapproved={this.props.currentpdiapproved}
                                    openSections={this.props.openSections}
                                    status={this.props.status}
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
                                    handleFieldChange={this.props.handleFieldChange}
                                />
                            );
                        }
                    }
                }
            });
        }
    }

    renderExteriorInspection(element) {
        // console.log("renderExteriorInspection element:" + JSON.stringify(element));

        if (element) {
            // assert element.type == "exterior_inspection"
            let elementInValues = this.props.valueslist.find(function (valuecombo) {
                return valuecombo.name == element.name;
            });

            let val = elementInValues ? (elementInValues.value.constructor === Array ? '' : elementInValues.value) : '';
            let valArray = elementInValues ? (elementInValues.value.constructor === Array ? elementInValues.value : []) : [];

            let kk = "ex" + element.name;
            return (
                <ExteriorInspection
                    key={kk}
                    element={element}
                    currentrole={this.props.currentrole}
                    currentpdiapproved={this.props.currentpdiapproved}
                    openSections={this.props.openSections}
                    status={this.props.status}
                    locations={this.props.locations}
                    lastUpdated={this.props.lastUpdated}
                    lastEditUserName={this.props.lastEditUserName}
                    lastEditUserDealer={this.props.lastEditUserDealer}
                    valueLoadedFromDb={val}
                    valueArrayLoadedFromDb={valArray}
                    valueslist={this.props.valueslist}
                    setFailedArray={this.setFailedArray.bind(this)}
                    handleFieldChange={this.props.handleFieldChange}
                    bodyType={this.props.bodyType}
                />
            );
        }
    }

    handleTextChange(event) {
        // if (this.props.element.labeltext == "RO #:") {
        //       console.log("HANDLETEXTCHANGE " + event.target.value);
        // }

        let lastUpdated = new Date();
        this.setState({
            "valueLoadedFromDb": event.target.value,
            "lastUpdated": lastUpdated
        });
        let variation; // undefined because is not check field
        this.props.handleFieldChange(lastUpdated, this.props.element, event.target.id, event.target.value, event.target.checked, variation);
    }

    handleCheckCommentChange(event) {
        // console.log("handleCheckCommentChange " + event.target.id);
        // console.log("handleCheckCommentChange " + event.target.value);
        // let commentName = this.props.element.name + "comment";
        // let commentEle = this.state.valueArrayLoadedFromDb.find(function (ele) {
        //     return ele.name == commentName;
        // });
        // let commentValue;
        // if (commentEle && commentEle.value) {
        //     commentValue = commentEle.value;
        // }
        //
        let lastUpdated = new Date();
        this.setState({
            "lengthComment": event.target.value.length,
            "lastUpdated": lastUpdated
        });
        let variation; // undefined because is not check field
        this.props.handleFieldChange(lastUpdated, this.props.element, event.target.id, event.target.value, event.target.checked, variation);
    }

    handleCheckboxRadioChange(event) {
        // console.log("handleCheckboxRadioChange element " + JSON.stringify(this.props.element));

        chckName = event.target.name;
        chckId = event.target.id;
        chckChecked = event.target.checked;

        // if one is set unset all other
        //
        let currentValueList = this.props.valueArrayLoadedFromDb;
        let variation = ["na", "ok", "adjusted", "failed"];
        let currentValue = currentValueList.find(function (ele) {
            return ele.name == chckId
        }).value;


        // failed
        let lIdfailed = chckName + "failed";

        let oldFailed = currentValueList.find(function (ele) {
            return ele.name == lIdfailed;
        }).value;
        // console.log("handleCheckboxRadioChange oldFailed " + JSON.stringify(oldFailed));

        let newFailed = oldFailed;

        if (chckChecked) {
            variation.map((vari) => {
                let lId = chckName + vari;
                if (lId != chckId) {
                    // console.log("handleCheckboxRadioChange lId " + JSON.stringify(lId));
                    let subEle = document.getElementById(lId);
                    if (subEle) {
                        subEle.checked = false
                    };

                    let subValue = currentValueList.find(function (ele) {
                        return ele.name == lId
                    });
                    if (subValue) {
                        subValue.value = false;
                    }
                    if (subValue && vari == "failed") {
                        newFailed = false;
                    }
                } else {
                    document.getElementById(lId).checked = !currentValue;
                    let subValue = currentValueList.find(function (ele) {
                        return ele.name == lId
                    });
                    if (subValue) {
                        subValue.value = false;
                    }
                    if (subValue && vari == "failed") {
                        newFailed = !currentValue;
                    }
                }
            });
        } else {
            variation.map((vari) => {
                let lId = chckName + vari;
                if (lId == chckId) {
                    let subEle = document.getElementById(lId);

                    if (subEle) {
                        subEle.checked = false
                    }
                    ;
                    let subValue = currentValueList.find(function (ele) {
                        return ele.name == lId
                    });
                    if (subValue) {
                        subValue.value = false;
                    }
                    if (subValue && vari == "failed") {
                        newFailed = false;
                    }
                }
            });
        }
        // console.log("handleCheckboxRadioChange newFailed " + JSON.stringify(newFailed));
        if (newFailed != oldFailed) {
            this.props.setFailedArray(chckName, newFailed);
        }
        // console.log("handleCheckboxRadioChange event.target.value " + JSON.stringify(event.target.value));
        let lastUpdated = new Date();
        this.setState({
            // "lengthComment": event.target.value.length,
            "lastUpdated": lastUpdated
        });

        this.props.handleFieldChange(lastUpdated, this.props.element, event.target.id, event.target.value, event.target.checked, variation);


    }

    takePhoto(event) {
        event.preventDefault();
        let id = event.target.id;
        // console.log("takePhoto " + JSON.stringify(id));
        let cameraOptions = {
            quality: 50, // 490,
            width: 1000, // 4000,
            height: 750, // 3000
        };

        let that = this;
        MeteorCamera.getPicture(cameraOptions, function (error, newPhoto) {
            if (error) {
                console.log("photo error " + JSON.stringify(error));
            }
            if (newPhoto) {

                //let resizedPhoto = that.dataURLToBlob(newPhoto);
                //   let dataUrl = canvas.toDataURL('image/jpeg');
                // let resizedImage = that.dataURLToBlob(dataUrl);

                // console.log("takePhoto typeof " + (typeof newPhoto));
                // console.log("takePhoto typeof " + (typeof resizedPhoto));
                // console.log("takePhoto length of string " + (JSON.stringify(newPhoto).length));

                let variation; // undefined because is not check field
                let checked; // undefined because is not check field
                let lastUpdated = new Date();
                that.props.handleFieldChange(lastUpdated, that.props.element, id, newPhoto, checked, variation);
                that.setState({
                    valueLoadedFromDb: newPhoto,
                    lastUpdated: lastUpdated
                });
            }
        });
    };

    /* Utility function to convert a canvas to a BLOB */
    dataURLToBlob(dataURL) {
        console.log("dataURLToBlob ");
        let BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            let parts = dataURL.split(',');
            let contentType = parts[0].split(':')[1];
            let raw = parts[1];

            return new Blob([raw], {type: contentType});
        }

        let parts = dataURL.split(BASE64_MARKER);
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;

        let uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {type: contentType});
    }

    readImageFileURL(event) {
        let id = this.props.element.name;
        // debugger;
        console.log("readImageFileURL " +  id);

        // let preview = document.querySelector('img');
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
                let lastUpdated = new Date();
                that.props.handleFieldChange(lastUpdated, that.props.element, id, newPhoto, checked, variation);
                // console.log("new photo" + JSON.stringify(newPhoto));
                that.setState({
                    valueLoadedFromDb: newPhoto,
                    lastUpdated: lastUpdated
                });
            }
        };
        reader.onload = function (readerEvent) {
            // debugger;
            //console.log("ONLOAD");
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
                // console.log("resizedImage" + JSON.stringify(resizedImage));
                // let variation; // undefined because is not check field
                // let checked; // undefined because is not check field

                // console.log("ONLOAD typeof image " + (typeof resizedImage)); was object
                // that.props.handleFieldChange(lastUpdated, that.props.element, id, resizedImage, checked, variation);
                // that.setState({
                //     valueLoadedFromDb: resizedImage,
                // });
                $.event.trigger({
                    type: "imageResized",
                    blob: resizedImage,
                    url: dataUrl
                });
            };
            image.src = readerEvent.target.result;
        };


        if (file) {
            // console.log(" reader.readAsDataURL(file);");
            // debugger;
            reader.readAsDataURL(file);
        } else {
            //preview.src = "";
        }
        return false;
    }

    debugprint(onecheck) {
        let txt = "CHECK,";
        let comps = ["type", "subtype", "labeltext", "valuetype", "classNameLabel", "className", "className2", "name", "order"];
        comps.forEach(function (attr) {

            if (!onecheck[attr]) {
                txt = txt + ","
            } else {
                txt = txt + "," + onecheck[attr]
            }
        });
        // console.log(txt);
    };

    componentWillMount() {

        let that = this;
        let onecheck = this.props.element;
        let initvalue = "";
        switch (onecheck.type) {
            case "location_select": {
                if (!status.includes("submitted")) {
                    // has to be set the first value in the list
                    let locations = this.props.locations ? this.props.locations : [];
                    if (locations.length > 0) {
                        initvalue = locations[0].location;
                    }
                    let variationUndefined; // undefined because is not check field
                    let checkedUndefined;   // undefined because is not check field
                    this.props.handleFieldChange(this.props.lastUpdated, this.props.element, onecheck.name, initvalue, checkedUndefined, variationUndefined);
                }
            }
                break;
            case "group_collapsable": {
                let failedArray = this.state.failedArray;
                let that = this;
                onecheck.elements.forEach(function (element) {
                    if (element) {
                        if (element.type == "simple_check" || element.type == "simple_check_no_NA" || element.type == "exterior_inspection") {

                            let elementInValues = that.props.valueslist.find(function (valuecombo) {
                                return valuecombo.name == element.name;
                            });
                            let valueArray = elementInValues ? (elementInValues.value.constructor === Array ? elementInValues.value : []) : [];

                            let failedName = element.name + "failed";
                            let failedValue = valueArray.find(function (ele) {
                                return ele.name == failedName;
                            });
                            let newFailed = (failedValue && failedValue.value) ? true : false;
                            if (newFailed) {
                                let found = false;
                                failedArray.forEach(function (a) {
                                    if (a.name == element.name) {
                                        a.failedValue = newFailed;
                                        found = true;
                                    }
                                });
                                if (!found) {
                                    if (failedValue) {
                                        failedArray.push({"name": element.name, "failedValue": newFailed})
                                    }
                                }
                            }

                        }
                    }
                });
                this.setState({"failedArray": failedArray});
            }
            default: {
                // do nothing for other elements
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // if (nextProps.element.labeltext == "RO #:") {
        //     console.log("ChecklistElement shouldComponentUpdate  this value:" + this.props.valueLoadedFromDb);
        //     console.log("ChecklistElement shouldComponentUpdate  next value:" + nextProps.valueLoadedFromDb);
        // }

        // return true;
        // console.log("shouldComponentUpdate " + nextProps.element.name);
        let valueChanged = true;

        if (this.props.element.elements) {
            return true;
        }
        if (this.state.shouldHide != nextState.shouldHide) {
            return true;
        }
        if (nextProps.status.includes("submitted") && nextProps.status != this.props.status) {
            return true;
        }
        if (["status_display", "text_last_user_display", "text_last_dealer_display", "date_last_updated_display", "take_photo_required"].find(function (type) {
                return nextProps.element.type == type
            })) {
            return true;
        }

        if (this.props.valueArrayLoadedFromDb.length == 0) {
            if (this.props.valueLoadedFromDb == nextProps.valueLoadedFromDb) {
                valueChanged = false;
            }
        } else {
            this.props.valueArrayLoadedFromDb.map((check) => {
                // console.log("shouldComponentUpdate go through array " + JSON.stringify(check));

                // let nextCheck = _.find(nextProps.valueArrayLoadedFromDb, function (subele) {
                //     return subele.name == check.name;
                // });

                // valueChanged = !(nextCheck && (nextCheck.value == check.value));
                valueChanged = (this.state.lengthComment != nextState.lengthComment)
                    && ((this.state.lengthComment == 0) || (nextState.lengthComment == 0));

            });
        }
        // if (nextProps.element.labeltext == "RO #:") {
        //     console.log("shouldComponentUpdate " + nextProps.element.labeltext + " - " + valueChanged);
        // }
        // console.log("ChecklistElement shouldComponentUpdate  update:" + valueChanged);

        return valueChanged;
    }

    renderCollapsibleHeaderText(text) {
        //console.log("renderCollapsibleHeaderText " + text + " failedArray:" + JSON.stringify(this.state.failedArray));
        let failedStatus = false;
        let failedNum = 0;
        this.state.failedArray.forEach(function (a) {
            if (a.failedValue == true) {
                failedStatus = true;
                failedNum++;
            }
        });
        if (failedStatus) {
            failedtext = text + "   .. failed: " + failedNum;
            return (<span style={{color: 'red'}}>{failedtext}</span>);
        } else {

            return (<span style={{color: 'black'}}>{text}</span>);
        }
    }


    render() {
        // console.log("ChecklistElement render  type:" + this.props.element.labeltext);
        let valueLoadedFromDb = this.state.lastUpdaded > this.props.lastUpdated ? this.state.valueLoadedFromDb : this.props.valueLoadedFromDb;
        // let valueArrayLoadedFromDb = this.state.lastUpdaded > this.props.lastUpdated ? this.state.valueArrayLoadedFromDb : this.props.valueArrayLoadedFromDb;

        // if (this.props.element.labeltext == "RO #:") {
        //     // console.log("ChecklistElement render  type:" + this.props.element.labeltext);
        //     // console.log("ChecklistElement render  props value:" + this.props.valueLoadedFromDb);
        //     // console.log("ChecklistElement render  state value:" + this.state.valueLoadedFromDb);
        //     // console.log("ChecklistElement render  VALUE:" + valueLoadedFromDb);
        // }

        // console.log("render  name:" + this.props.element.name + " failedArray:" + JSON.stringify(this.state.failedArray));
        // console.log("render  current dealer:" + this.props.lastEditDealerName);

        let onecheck = this.props.element;
        // this.debugprint(onecheck);

        let disabledIfSubmitted = this.props.status.includes("submitted");// || this.props.currentrole == "Admin Dealer" || !(this.props.currentpdiapproved);

        let checkelement =
         <div>
         </div>;

        // console.log("render name " + onecheck.name + " type " + onecheck.type );

        switch (onecheck.type) {
            case "end_group_headerfields":
            case "end_group_collapsable":
            case "end_body_collapsable":
            case "ignore_element": {
                checkelement =
                    <div>
                    </div>
            }
                break;

            case "body_collapsable": {
                checkelement =
                    <div>
                        {this.renderElements(onecheck.name, onecheck.elements)}
                    </div>
            }
                break;
            case "group_headerfields": {
                checkelement =
                    <div className="row">
                        {this.renderElements(onecheck.name, onecheck.elements)}
                    </div>
            }
                break;
            case "group_collapsable": {
                // console.log("render collapsible " + boolTrue);
                let pos = parseInt(onecheck.name.substr(3, 5));
                let text = onecheck.labeltext;
                checkelement =
                    <Collapsible trigger={this.renderCollapsibleHeaderText(text)} open={this.props.openSections}
                                 triggerDisabled={this.props.openSections}
                                 accordionPosition={pos}>
                        {this.renderElements(onecheck.name, onecheck.elements)}
                    </Collapsible>
            }
                break;

            case "header_checklist": {
                checkelement =
                        <div className='col m12 s12 headingcolor'>
                            <h2> {onecheck.labeltext}</h2>
                        </div>
            }
                break;
            case "status_display": {
                // console.log("status_display  header " + onecheck.headertype + " status= " + this.props.status);
                checkelement =
                    <div className='col m4 s4 input-field'>
                        <input type="text" ref={onecheck.name} id={onecheck.name}
                               value={this.props.status} disabled className="blue-text lighten-1"/>
                        <label className="active" htmlFor={onecheck.name}>{onecheck.labeltext}</label>
                    </div>
            }
                break;

            case "text_input":
            case "text_input_required": {
                let act = this.state.valueLoadedFromDb.length > 0 ? "active" : "nonactive";
                // console.log("text_input " + act);
                checkelement =
                    <div className='col m4 s4 input-field'>
                        <input type="text" ref={onecheck.name} id={onecheck.name}
                               onChange={this.handleTextChange.bind(this)}
                               value={this.state.valueLoadedFromDb} disabled={disabledIfSubmitted}/>
                        <label className={act} htmlFor={onecheck.name}>{onecheck.labeltext}</label>
                    </div>

            }
                break;
            case "number_input_required": {
                let act = this.state.valueLoadedFromDb.length > 0 ? "active" : "nonactive";
                // console.log("text_input " + act);
                checkelement =
                    <div className='col m4 s4 input-field'>
                        <input type="number" ref={onecheck.name} id={onecheck.name}
                               onChange={this.handleTextChange.bind(this)}
                               defaultValue={this.state.valueLoadedFromDb} required disabled={disabledIfSubmitted}/>
                        <label className={act} htmlFor={onecheck.name}>{onecheck.labeltext}</label>
                    </div>
                //odometer
            }
                break;
            case "location_select": {
                let locations = this.props.locations ? this.props.locations : [];
                checkelement =
                    <div className='col m4 s4 input-field'>
                        <select ref={onecheck.name} id={onecheck.name} defaultValue={this.state.valueLoadedFromDb}
                                disabled={disabledIfSubmitted}>
                            {
                                locations.map(function (ll) {
                                    return <option key={ll.key} value={ll.location}>{ll.location}</option>;
                                })
                            }
                        </select>

                        <label className="active" htmlFor={onecheck.name}>{onecheck.labeltext}</label>
                    </div> // location
            }
                break;

            case "text_display": {
                checkelement =
                    <div className='col m4 s4 input-field'>
                        <input type="text" ref={onecheck.name} id={onecheck.name}
                               value={this.state.valueLoadedFromDb} disabled className="blue-text lighten-1"/>
                        <label className="active" htmlFor={onecheck.name}>{onecheck.labeltext}</label>
                    </div>
            }
                break;
            case "text_last_user_display": {
                // console.log("text_last_user_display");
                let lstuser = (this.props.status == "technician submitted" || this.props.status == "service manager submitted") && this.props.techUserName
                    ? this.props.techUserName : this.props.lastEditUserName;
                let lstuserlabel = (this.props.status == "technician submitted" || this.props.status == "service manager submitted") ? "Submitted By Technician:" : onecheck.labeltext;

                checkelement =
                    <div className='col m4 s4 input-field'>
                        <input type="text" ref={onecheck.name} id={onecheck.name}
                               value={lstuser} disabled className="blue-text lighten-1"/>
                        <label className="active" htmlFor={onecheck.name}>{lstuserlabel}</label>
                    </div>
            }
                break;
            case "text_approved_user_display": {
                // console.log("text_approved_user_display " + this.props.smanUserName);
                let smanUserName = this.props.smanUserName ? this.props.smanUserName : "";
                checkelement =
                    <div className='col m4 s4 input-field'>
                        <input type="text" ref={onecheck.name} id={onecheck.name}
                               value={smanUserName} disabled className="blue-text lighten-1"/>
                        <label className="active" htmlFor={onecheck.name}>{onecheck.labeltext}</label>
                    </div>
            }
                break;

            case "text_last_dealer_display": {
                // console.log("text_last_dealer_display");
                let labeltext = (this.props.status == "technician submitted" || this.props.status == "service manager submitted")
                    ? "Submitting Dealer" : "Last Updating Dealer";
                checkelement =
                    <div className='col m4 s4 input-field'>
                        <input type="text" ref={onecheck.name} id={onecheck.name}
                               value={this.props.lastEditUserDealer} disabled className="blue-text lighten-1"/>
                        <label className="active" htmlFor={onecheck.name}>{labeltext}</label>
                    </div>
            }
                break;

            // case "date_input": {
            //     let act = this.props.valueLoadedFromDb.length > 0 ? "active" : "nonactive";
            //     // console.log("date_input value: " + this.props.valueLoadedFromDb + " active: " + act);
            //     checkelement =
            //         <div className='col m4 s6 input-field'>
            //             <input type="date" ref={onecheck.name} id={onecheck.name}
            //                    onChange={this.handleDateChange.bind(this)}
            //                    value={this.props.valueLoadedFromDb} required className="blue-text lighten-1"/>
            //             <label className={act} htmlFor={onecheck.name}>{onecheck.labeltext}</label>
            //         </div>
            // }
            //     break;
            case "date_last_updated_display": {
                // console.log("date_last_updated_display " + (typeof this.props.lastUpdated) + ("" + this.props.lastUpdated));
                let options = {
                    weekday: "short", year: "numeric", month: "short",
                    day: "numeric", hour: "2-digit", minute: "2-digit"
                };
                let date = (this.props.status == "technician submitted" || this.props.status == "service manager submitted") && this.props.techDateSigned ?
                    this.props.techDateSigned.toLocaleTimeString("en-NZ", options)
                    : this.props.lastUpdated.toLocaleTimeString("en-NZ", options);
                let label = (this.props.status == "technician submitted" || this.props.status == "service manager submitted") ?
                    "Submitted Date:" : onecheck.labeltext;
                checkelement =
                    <div className='col m4 s4 input-field'>
                        <input type="text" ref={onecheck.name} id={onecheck.name}
                               value={date} disabled className="blue-text lighten-1"/>
                        <label className="active" htmlFor={onecheck.name}>{label}</label>
                    </div>
            }
                break;

            case "date_approved_display": {
                // console.log("date_approved_display " + (typeof this.props.lastUpdated) + ("" + this.props.lastUpdated));
                let options = {
                    weekday: "short", year: "numeric", month: "short",
                    day: "numeric", hour: "2-digit", minute: "2-digit"
                };
                let date = this.props.status == "service manager submitted" && this.props.smanDateSigned ?
                    this.props.smanDateSigned.toLocaleTimeString("en-NZ", options) : "";
                checkelement =
                    <div className='col m4 s6 input-field'>
                        <input type="text" ref={onecheck.name} id={onecheck.name}
                               value={date} disabled className="blue-text lighten-1"/>
                        <label className="active" htmlFor={onecheck.name}>{onecheck.labeltext}</label>
                    </div>
            }
                break;


            case "date_display": {
                checkelement =
                    <div className='col m4 s6 text-left'>
                        <input type="date" ref={onecheck.name} id={onecheck.name}
                               value={this.state.valueLoadedFromDb} disabled className="blue-text lighten-1"/>
                        <label className="active" htmlFor={onecheck.name}>{onecheck.labeltext}</label>
                    </div>
            }
                break;

            case "empty_group_header": {
                let classs = "control-label";
                let labeltxt = "";
                checkelement =
                    <div>
                        <div className='col m12 s12'>
                            <label className={classs}> {labeltxt}</label>
                        </div>
                    </div>
            }
                break;
            case "group_header": {
                let classs = "control-label";
                checkelement =
                    <div>
                        <div className='col m12 s12'>
                            <label className={classs}> {onecheck.labeltext}</label>
                        </div>
                    </div>
            }
                break;
            case "take_photo_required": {
                let photo = this.state.valueLoadedFromDb;
                if (photo) {
                    checkelement =
                        <div>

                            <div className="row">
                                <div className="battryBtn">
                                    <ul className="checkReactive">
                                        <li>
                                            <input type="button" className="waves-effect cyan waves-light btn-large"
                                                   id={onecheck.name}
                                                   onClick={this.takePhoto.bind(this)} value={onecheck.labeltext}
                                                   required
                                                   disabled={disabledIfSubmitted}/>

                                        </li>
                                        <li>
                                            <input type="file"
                                                   id={onecheck.name} name="photoimage" defaultValue="Upload Photo"
                                                   required accept=".jpg,.jpeg,.png,capture=camera"
                                                   onChange={this.readImageFileURL.bind(this)}
                                                   disabled={disabledIfSubmitted}/>
                                        </li>
                                    </ul>

                                    <ul className="ulPhoto">

                                        <li></li>
                                        <li>
                                            <img className="takephoto" src={photo}/>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                } else {
                    checkelement =
                        <div className="row">
                            <div className="battryBtn">
                                <ul className="checkReactive">

                                    <li>
                                        <input type="button" className="waves-effect cyan waves-light btn-large"
                                               id={onecheck.name}
                                               onClick={this.takePhoto.bind(this)} value={onecheck.labeltext}
                                               disabled={disabledIfSubmitted}/>
                                    </li>
                                    <li>
                                        <input type="file"
                                               id={onecheck.name} name="photoimage" defaultValue="Upload Photo"
                                               required accept=".jpg,.jpeg,.png,capture=camera"
                                               onChange={this.readImageFileURL.bind(this)}
                                               disabled={disabledIfSubmitted}/>
                                    </li>
                                </ul>
                            </div>
                        </div>
                }
            }
                break;

            case "simple_check_no_NA": {
                // console.log("render simple_check_no_NA element " + JSON.stringify(this.props.element));
                // console.log("render simple_check_no_NA value " + JSON.stringify(this.state.valueArrayLoadedFromDb));
                let classs = "control-label";
                let okName = onecheck.name + "ok";
                // let editcomment = onecheck.comment + "edit";
                let adjustedName = onecheck.name + "adjusted";
                let failedName = onecheck.name + "failed";
                // let valArray = this.state.valueArrayLoadedFromDb;


                // console.log("naChecked " + JSON.stringify(naChecked));
                let okValue = this.state.valueArrayLoadedFromDb.find(function (ele) {
                    return ele.name == okName;
                });
                let okChecked = (okValue && okValue.value) ? true : false;

                let adjustedValue = this.state.valueArrayLoadedFromDb.find(function (ele) {
                    return ele.name == adjustedName;
                });
                let adjustedChecked = (adjustedValue && adjustedValue.value) ? true : false;

                let failedValue = this.state.valueArrayLoadedFromDb.find(function (ele) {
                    return ele.name == failedName;
                });
                let failedChecked = (failedValue && failedValue.value) ? true : false;

                let editButtonDisabled = false;
                let commentName = onecheck.name + "comment";
                let commentEle = this.state.valueArrayLoadedFromDb.find(function (ele) {
                    return ele.name == commentName;
                });
                let commentValue;
                if (commentEle && commentEle.value) {
                    commentValue = commentEle.value;
                }
                if (disabledIfSubmitted || (commentValue && commentValue.length > 0)) {
                    editButtonDisabled = true;
                }
                buttonText = "Comment";

                checkelement =
                    <div className="row">
                        <div className='col m12 s12'>
                            <label className={classs}> {onecheck.labeltext}</label>
                        </div>
                        <div className='col m12 s12 text-left'>
                            <ul className="checkReactive">

                                <li>
                                    <input type="radio" id={okName} name={onecheck.name}
                                           className="radioCheck" defaultChecked={okChecked}
                                           onClick={this.handleCheckboxRadioChange.bind(this)}
                                           disabled={disabledIfSubmitted}/>
                                    <label htmlFor={okName}>OK</label>
                                </li>
                                <li>
                                    <input type="radio" id={adjustedName} name={onecheck.name}
                                           className="radioCheck" defaultChecked={adjustedChecked}
                                           onClick={this.handleCheckboxRadioChange.bind(this)}
                                           disabled={disabledIfSubmitted}/>
                                    <label htmlFor={adjustedName}>Adjusted</label>
                                </li>
                                <li>
                                    <input type="radio" id={failedName} name={onecheck.name}
                                           className="radioCheck" defaultChecked={failedChecked}
                                           onClick={this.handleCheckboxRadioChange.bind(this)}
                                           disabled={disabledIfSubmitted}/>
                                    <label htmlFor={failedName}>Failed</label>
                                </li>
                            </ul>
                            <div className="row padTopBtm">
                                <div className="col s3 m3">
                                    <a className="waves-effect waves-light blue darken-2 btn"
                                       onClick={this.onClickCommentButton.bind(this)}
                                       disabled={editButtonDisabled}>{buttonText}</a>
                                </div>
                                <div className="col s7 m7">
                                        <textarea className={this.state.shouldHide ? 'hidden' : ''}
                                                  id={commentName}
                                                  onChange={this.handleCheckCommentChange.bind(this)}
                                                  defaultValue={commentValue}
                                                  disabled={disabledIfSubmitted} rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
            }
                break;

            case "exterior_inspection": {

                checkelement =
                    <div>
                        {this.renderExteriorInspection(onecheck)}
                    </div>
            }
                break;

            case "simple_check": {

                // console.log("ChecklistElement render  simple_check" + JSON.stringify(onecheck.name));

                let classs = "control-label";
                let naName = onecheck.name + "na";
                let okName = onecheck.name + "ok";
                // let editcomment = onecheck.comment + "edit";
                let adjustedName = onecheck.name + "adjusted";
                let failedName = onecheck.name + "failed";
                // let valArray = this.state.valueArrayLoadedFromDb;
                // console.log("valuearray " + JSON.stringify(valArray) + " naName " + naName);

                let naValue = this.state.valueArrayLoadedFromDb.find(function (ele) {
                    return ele.name == naName;
                });
                // console.log("render simple_check naValue.value " + naValue.value);
                let naChecked = (naValue && naValue.value) ? true : false;

                // console.log("naChecked " + JSON.stringify(naChecked));
                let okValue = this.state.valueArrayLoadedFromDb.find(function (ele) {
                    return ele.name == okName;
                });
                let okChecked = (okValue && okValue.value) ? true : false;

                let adjustedValue = this.state.valueArrayLoadedFromDb.find(function (ele) {
                    return ele.name == adjustedName;
                });
                let adjustedChecked = (adjustedValue && adjustedValue.value) ? true : false;

                let failedValue = this.state.valueArrayLoadedFromDb.find(function (ele) {
                    return ele.name == failedName;
                });
                let failedChecked = (failedValue && failedValue.value) ? true : false;

                let editButtonDisabled = false;
                let commentName = onecheck.name + "comment";
                let commentEle = this.state.valueArrayLoadedFromDb.find(function (ele) {
                    return ele.name == commentName;
                });
                let commentValue;
                if (commentEle && commentEle.value) {
                    commentValue = commentEle.value;
                }
                if (disabledIfSubmitted || (commentValue && commentValue.length > 0)) {
                    editButtonDisabled = true;
                }
                buttonText = "Comment";
                checkelement =
                    <div className="row">

                        <div className='col m12 s12'>
                            <Element name={onecheck.name}></Element>
                            <label className={classs}> {onecheck.labeltext}</label>
                            <a name={onecheck.name}/>
                        </div>
                        <div className='col m12 s12 text-left'>

                            <ul className="checkReactive">
                                <li>
                                    <input type="radio" id={naName} name={onecheck.name}
                                           className="radioCheck" defaultChecked={naChecked}
                                           onClick={this.handleCheckboxRadioChange.bind(this)}
                                           disabled={disabledIfSubmitted}/>
                                    <label htmlFor={naName}>NA</label>
                                </li>
                                <li>
                                    <input type="radio" id={okName} name={onecheck.name}
                                           className="radioCheck" defaultChecked={okChecked}
                                           onClick={this.handleCheckboxRadioChange.bind(this)}
                                           disabled={disabledIfSubmitted}/>
                                    <label htmlFor={okName}>OK</label>
                                </li>
                                <li>
                                    <input type="radio" id={adjustedName} name={onecheck.name}
                                           className="radioCheck" defaultChecked={adjustedChecked}
                                           onClick={this.handleCheckboxRadioChange.bind(this)}
                                           disabled={disabledIfSubmitted}/>
                                    <label htmlFor={adjustedName}>Adjusted</label>
                                </li>
                                <li>
                                    <input type="radio" id={failedName} name={onecheck.name}
                                           className="radioCheck" defaultChecked={failedChecked}
                                           onClick={this.handleCheckboxRadioChange.bind(this)}
                                           disabled={disabledIfSubmitted}/>
                                    <label className="radioWarning" htmlFor={failedName}>Failed</label>
                                </li>
                            </ul>
                            <div className="row padTopBtm">
                                <div className="col s3 m3">
                                    <a className="waves-effect waves-light blue darken-2 btn"
                                       onClick={this.onClickCommentButton.bind(this)}
                                       disabled={editButtonDisabled}>{buttonText}</a>
                                </div>
                                <div className="col s7 m7">
                        <textarea className={this.state.shouldHide ? 'hidden' : ''}
                                  id={commentName}
                                  onChange={this.handleCheckCommentChange.bind(this)}
                                  defaultValue={commentValue}
                                  disabled={disabledIfSubmitted} rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
            }

                break;
            case "NA_check": {
                // console.log("render NA_check " + JSON.stringify(onecheck));
                let classs = "control-label";
                let naName = onecheck.name + "na";
                let okName = onecheck.name + "ok";
                let adjustedName = onecheck.name + "adjusted";
                let failedName = onecheck.name + "failed";

                // check is NA therefore disabled
                let disableChecks = true;

                let naChecked = true;
                let okChecked = false;
                let adjustedChecked = false;
                let failedChecked = false;

                let naValue = true;
                let okValue = false;
                let adjustedValue = false;
                let failedValue = false;

                let editButtonDisabled = false;
                let commentName = onecheck.name + "comment";
                let commentValue = "";

                checkelement =
                    <div className="row">

                        <div className='col m12 s12'>
                            <Element name={onecheck.name}></Element>
                            <label className={classs}> NA {onecheck.labeltext}</label>
                            <a name={onecheck.name}/>
                        </div>
                        <div className='col m12 s12 text-left'>

                            <ul className="checkReactive">
                                <li>
                                    <input type="radio" id={naName} name={onecheck.name}
                                           className="radioCheck" defaultChecked={naChecked}
                                           disabled={disableChecks}/>
                                    <label htmlFor={naName}>NA</label>
                                </li>
                                <li>
                                    <input type="radio" id={okName} name={onecheck.name}
                                           className="radioCheck" defaultChecked={okChecked}
                                           disabled={disableChecks}/>
                                    <label htmlFor={okName}>OK</label>
                                </li>
                                <li>
                                    <input type="radio" id={adjustedName} name={onecheck.name}
                                           className="radioCheck" defaultChecked={adjustedChecked}
                                           disabled={disableChecks}/>
                                    <label htmlFor={adjustedName}>Adjusted</label>
                                </li>
                                <li>
                                    <input type="radio" id={failedName} name={onecheck.name}
                                           className="radioCheck" defaultChecked={failedChecked}
                                           disabled={disableChecks}/>
                                    <label className="radioWarning" htmlFor={failedName}>Failed</label>
                                </li>
                            </ul>

                        </div>
                    </div>
            }
                break;

            case "comments": {
                let xref = (node => this[onecheck.name] = node);
                let act = this.state.valueLoadedFromDb.length > 0 ? "active" : "nonactive";
                act = (this.props.status == "submitted") ? "active" : act;
                checkelement =


                    <div className="col s12 m12 input-field padTopBtm">

                        {/*
                         <input type="text" ref={onecheck.name} id={onecheck.name}
                         onChange={this.handleTextChange.bind(this)}
                         defaultValue={this.state.valueLoadedFromDb} required
                         disabled={disabledIfSubmitted}/>
                         */}
                        <textarea type="text" ref={onecheck.name} id={onecheck.name}
                                  onChange={this.handleTextChange.bind(this)}
                                  defaultValue={this.state.valueLoadedFromDb} required
                                  disabled={disabledIfSubmitted} rows="5"></textarea>

                        <label className={act} htmlFor={onecheck.name}>{onecheck.labeltext}</label>
                    </div>


            }
                break;

            case "comments_display": {
                let xref = (node => this[onecheck.name] = node);
                let act = this.state.valueLoadedFromDb.length > 0 ? "active" : "nonactive";
                checkelement =
                    <div className="row">

                        <div className="input-field col s12 m12">
                        <textarea className="materialize-textarea" value={this.state.valueLoadedFromDb}
                                  ref={xref} id={onecheck.name} disabled></textarea>
                            <label className={act} htmlFor={onecheck.name}>{onecheck.labeltext}</label>
                        </div>
                    </div>
            }
                break;

            case "concern_box": {
                checkelement =
                    <div className="row">

                        <div className="input-field col s12 m12">
                            <textarea className="materialize-textarea" id="textarea1"></textarea>

                            <label htmlFor="textarea1">{onecheck.labeltext}</label>
                        </div>
                    </div>

            }
                break;

            case "take_picture": {
                checkelement =
                    <div>
                        <input type="button" onClick={this.takePhoto.bind(this)} value="Take Photo!"/>
                        <img src={this.state.photo} height="200" width="200" alt="..." className="img-rounded"/>
                    </div>
            }
                break;

            default: {
                console.log("default Error in checklist generation - type:" + onecheck.type + ": does not exist");
                checkelement =
                    <h1> Error in checklist generation - type:{onecheck.type}: does not exist</h1>
            }
        }
        // }
        return (checkelement);
    }
}
// // An object that could be one of many types
// optionalUnion: React.PropTypes.oneOfType([
//     React.PropTypes.string,
//     React.PropTypes.number,
//     React.PropTypes.instanceOf(Message)
// ]),

ChecklistElement.propTypes = {
    // This component gets the checklisttemplate to display through a React prop.
    // We can use propTypes to indicate it is required
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool,
    element: PropTypes.object.isRequired,
    status: PropTypes.string.isRequired,
    locations: PropTypes.array.isRequired,
    bodyType: PropTypes.string.isRequired,
    openSections: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.instanceOf(Date).isRequired,
    techDateSigned: PropTypes.instanceOf(Date).isRequired,
    smanDateSigned: PropTypes.instanceOf(Date).isRequired,
    lastEditUserName: PropTypes.string.isRequired,
    lastEditUserDealer: PropTypes.string.isRequired,
    techUserName: PropTypes.string.isRequired,
    smanUserName: PropTypes.string.isRequired,
    valueLoadedFromDb: PropTypes.string.isRequired,
    valueArrayLoadedFromDb: PropTypes.array.isRequired,
    valueslist: PropTypes.array.isRequired,
    setFailedArray: PropTypes.func,
    handleFieldChange: PropTypes.func.isRequired

};
