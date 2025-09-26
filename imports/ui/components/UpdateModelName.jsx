import React, {Component, PropTypes} from 'react';
import Griddle from 'griddle-react';
import SweetAlert from 'react-bootstrap-sweetalert';

class UpdateModelName extends Component {

    constructor(props) {
        super(props);
        // console.log("constructor " + JSON.stringify(this.props.status));
        this.state = {
            disabledentry: false,
            selectedFromGriddle: false,
            mdlSubset: {},
            numRecordsFound: "0",
            usr_id: "",
            mdls: []
        };
    }

    avoidReloadPage(event) {
        event.preventDefault();
        // console.log("avoidReloadPage ");
        return false;
    }

    loadModelNames() { // only load once
        // console.log("loadModelNames");
        let that = this;
        Meteor.call('uploading.listnewmodels', this.props.currentcompany, this.props.currentdealer, function (err, mdls) {
           let numRecordsFound = mdls.length;
            if (err) {
                console.log("Error when reading upload errors data: " + err.message);
            } else {
                that.setState({
                    // disabledentry: false,
                    selectedFromGriddle: false,
                    mdls: mdls,
                    mdlSubset: {},
                    numRecordsFound: "" + numRecordsFound,
                    usr_id: ""

                });
            }
            // console.log("loadModelNames " + JSON.stringify(mdls));
        });
    }

    componentWillMount() { // only called one time
        this.loadModelNames();
    }


    handleVehTypeChange(event) {
        event.preventDefault();

     };

    handleBodyTypeChange(event) {
        // console.log("handleBodyTypeChange");

    };

    handlePdiTypeChange(event) {
        event.preventDefault();
        // let newMdlSubset = this.state.mdlSubset;
        // newMdlSubset.pdiApproved = !this.state.mdlSubset.pdiApproved;
        // setTimeout(() => this.setState({
        //     "mdlSubset": newMdlSubset
        // }));
    };

    handleH100TypeChange(event) {
        event.preventDefault();
        // let newMdlSubset = this.state.mdlSubset;
        // newMdlSubset.pdiApproved = !this.state.mdlSubset.pdiApproved;
        // setTimeout(() => this.setState({
        //     "mdlSubset": newMdlSubset
        // }));
    };

    handleLSTypeChange(event) {
        event.preventDefault();
        // let newMdlSubset = this.state.mdlSubset;
        // newMdlSubset.pdiApproved = !this.state.mdlSubset.pdiApproved;
        // setTimeout(() => this.setState({
        //     "mdlSubset": newMdlSubset
        // }));
    };

    avoidReloadPage(event) {
        event.preventDefault();
        // console.log("avoidReloadPage ");
        return false;
    }

    doNothing() {
        this.setState({submitalert: null});
    }

    validateAddedModelName(input) {


        if (input.modelName.toLowerCase().indexOf("ioniq") > -1 && input.pdiType != "PDI-IONIQ") {

                this.setState({
                    submitalert: <SweetAlert
                        custom
                        confirmBtnText="SAVE"
                        cancelBtnText="Back"
                        confirmBtnBsStyle="primary"
                        cancelBtnBsStyle="default"
                        title="Ioniq PDI?"
                        onCancel={this.doNothing.bind(this)}
                        onConfirm={this.doNothing.bind(this)}>
                        Model name contains 'ioniq'. Does it need PDI-IONIQ checklist?
                    </SweetAlert>

                });
                return false;
        }

        if (input.modelName.toLowerCase().indexOf("genesis") > -1 && input.pdiType != "PDI-GENESIS") {

            this.setState({
                submitalert: <SweetAlert
                    custom
                    confirmBtnText="SAVE"
                    cancelBtnText="Back"
                    confirmBtnBsStyle="primary"
                    cancelBtnBsStyle="default"
                    title="Genesis PDI?"
                    onCancel={this.doNothing.bind(this)}
                    onConfirm={this.doNothing.bind(this)}>
                    Model name contains 'ioniq'. Does it need PDI-GENESIS checklist?
                </SweetAlert>

            });
            return false;
        }
        return true;
    }

    doUpdateVehicletype() {
        let newModelName = {
            modelName: this.refs.modelName.value,
            vehicleType: this.refs.vehicleType.value,
            bodyType: this.refs.bodyType.value,
            pdiType: this.refs.pdiType.value,
            h100Type: this.refs.h100Type.value,
            lsType: this.refs.lsType.value
        };
        // console.log("new user " + JSON.stringify(newUser));
        if (this.validateAddedModelName(newModelName)) {

            var that = this;
            Meteor.call("vehicletypes.upsertModelName", newModelName, function (err) {
                if (err) {
                    console.log("Error " + err.message);
                    that.setState({
                        submitalert: <SweetAlert
                            custom
                            confirmBtnText="Close"
                            confirmBtnBsStyle="primary"
                            title={err.reason}
                            onConfirm={that.doNothing.bind(that)}>
                            Model {newModelName.modelName} could not be saved. Speak with your System Administrator.
                        </SweetAlert>
                    });
                } else {
                    // console.log("no error");
                    that.setState({
                        submitalert: <SweetAlert
                            custom
                            confirmBtnText="Continue"
                            confirmBtnBsStyle="primary"
                            title="Model Name stored in Data Base"
                            onConfirm={that.doNothing.bind(that)}>
                            Model name stored/updated in data base.
                        </SweetAlert>
                    });
                }
            });
        }
    }

    handleSave(event) {
        // console.log("handleSave " );
        event.preventDefault();
        if (this.props.currentrole != "Admin System") {
            this.setState({
                submitalert: <SweetAlert
                    custom
                    confirmBtnText="Close"
                    confirmBtnBsStyle="primary"
                    title="No Access for Adding Model"
                    onConfirm={this.doNothing.bind(this)}>
                    Your role needs to be Admin System to add new Models.
                </SweetAlert>
            });
            return false;
        }
        this.doUpdateVehicletype();
        this.loadModelNames();
    }

    handleCancel(event) {
        event.preventDefault();
        this.loadModelNames();
        return true;
    }

    checkParams(set) {
        if ((set.role == "Admin System" && !(set.pdiApproved && set.dealer == "ALL")) || this.state.initializeSystem) {
            console.log("Error: role:" + set.role + " pdiApproved:" + set.pdiApproved + " dealer:" + set.dealer);
            return false;
        }
        return true;
    }

    selectModelNameFromGriddle(gridRow) {
        // console.log("selectModelNameFromGriddle row  " + JSON.stringify(gridRow.props.data));
        // select the clicked user and reduce the userlist to one

        // let newUser = _.omit(gridRow.props.data, "_id");
        let numRecordsFound = 1;
        // console.log("selectModelNameFromGriddle " + JSON.stringify(gridRow.props.data));

        let newMdlSubset = {
            "modelName": gridRow.props.data["Model Name"],
            "numVehicles" : gridRow.props.data["Num Vehicles"],
            "status" : gridRow.props.data["Status"],
            "vehicleType": gridRow.props.data["vehicleType"]? gridRow.props.data["vehicleType"]: "",
            "bodyType": gridRow.props.data["bodyType"]? gridRow.props.data["bodyType"]: "HATCH",
            "pdiType": gridRow.props.data["pdiType"]? gridRow.props.data["pdiType"]: "PDI",
            "h100Type": gridRow.props.data["h100Type"]? gridRow.props.data["h100Type"]: "H-Promise",
            "lsType": gridRow.props.data["lsType"]? gridRow.props.data["lsType"]: "LongStorage",
        };

        // console.log("selectModelNameFromGriddle " + JSON.stringify(newUser));
        this.setState({
            "selectedFromGriddle": true,
            "mdlSubset": newMdlSubset
        });

    }

    render() {
        // console.log("UpdateModelName render ");
        // console.log("UpdateModelName render " + JSON.stringify(this.state.mdlSubset))
        if (!(this.props.ready)) {
            return <div id="loader"></div>
        } else {

            // let roleOptions = [];
            // // console.log("UpdateModelName render roles PROPS" + JSON.stringify(this.props.roles));
            // // console.log("UpdateModelName render roles STATE" + JSON.stringify(this.state.roles));
            // // this.state.roles.forEach(function(rr){
            // //    roleOptions.push({"value": rr.role, "label": rr.role});
            // // });
            // let kk = 1;
            // let that = this;
            // this.state.roles.forEach(function(rr){
            //     let selected = rr.role.localeCompare(that.state.mdlSubset.role) == 0 ? "selected" : "" ;
            //     roleOptions.push({"value": rr.role, "selected": selected, "key": "" + kk});
            //     kk++;
            // });


            let mdlSubset = this.state.mdlSubset;
            // console.log(" render mdlSubset " + JSON.stringify(mdlSubset));
            //  {"username":"gabi","role":"Admin System","company":"ALL","dealer":"ALL","dealercode":"","pdiApproved":"true","pdiNo":"","first":"gabi","last":"schmidberger"}
            const rowMetadata = {
                bodyCssClassName: rowData => (rowData.id === this.state.selectedRowId ? 'selected' : ''),
            };
            // console.log("mdlSubset.role " + mdlSubset.role);
            if (this.state.selectedFromGriddle) {
                return (
                    <div className="Search">
                        <div className="container">

                            <form onSubmit={this.avoidReloadPage.bind(this)}>
                                <div className="row">
                                    <div className="col s12 m12">
                                        <h1> Add New Model Name: </h1>


                                            <div className="row">
                                                <div className='col m6 s6 input-field'>
                                                    <input type="text" ref="modelName" id="Mdl_Name"
                                                           defaultValue={mdlSubset.modelName} required
                                                           disabled="true"/>
                                                    <label className="active" htmlFor="Mdl_Name">Model Name</label>
                                                </div>

                                                <div className='col m3 s3 input-field'>
                                                    <input type="text"  id="Mdl_NumVehs"
                                                          defaultValue={mdlSubset.numVehicles} required
                                                           disabled="true"/>
                                                    <label className="active" htmlFor="Mdl_NumVehs">Num Vehicles</label>
                                                </div>

                                                <div className='col m3 s3 input-field'>
                                                    <input type="text"  id="Mdl_Status"
                                                           defaultValue={mdlSubset.status} required
                                                           disabled="true"/>
                                                    <label className="active" htmlFor="Mdl_Status">Status</label>
                                                </div>

                                            </div>

                                        <div className="row">

                                                <div className='col m6 s6 input-field'>

                                                    <input ref="vehicleType" id="Mdl_VehType"
                                                            onChange={this.handleVehTypeChange.bind(this)}
                                                            value={mdlSubset.vehicleType}>

                                                    </input>
                                                    <label className="active" htmlFor="Mdl_VehType">2-digit Vehicle Type (optional)</label>
                                                </div>

                                                <div className='col m6 s6 input-field'>
                                                    <select ref="bodyType" id="Mdl_Body"
                                                            onChange={this.handleBodyTypeChange.bind(this)}
                                                            defaultValue={mdlSubset.bodyType} required>
                                                        <option key="HATCH" value="HATCH">HATCH</option>;
                                                        <option key="SUV" value="SUV">SUV</option>;
                                                        <option key="VAN" value="VAN">VAN</option>;
                                                        <option key="TRUCK" value="TRUCK">TRUCK</option>;
                                                        <option key="SEDAN" value="SEDAN">SEDAN</option>;
                                                        <option key="WAGON" value="WAGON">WAGON</option>;
                                                    </select>
                                                    <label className="active" htmlFor="Mdl_Body">Body Type</label>
                                                </div>
                                            </div>


                                        <div className="row">

                                            <div className='col m4 s4 input-field'>
                                                <select ref="pdiType" id="Mdl_PdiType"
                                                        onChange={this.handlePdiTypeChange.bind(this)}
                                                        defaultValue={mdlSubset.pdiType} required>
                                                    <option key="PDI" value="PDI">PDI</option>;
                                                    <option key="PDI-Commercial" value="PDI-Commercial">PDI-Commercial</option>
                                                    <option key="PDI-GENESIS" value="PDI-GENESIS">PDI-GENESIS</option>
                                                    <option key="PDI-IONIQ" value="PDI-IONIQ">PDI-IONIQ</option>
                                                </select>
                                                <label className="active" htmlFor="Mdl_PdiType">PDI Type</label>
                                            </div>
                                            <div className='col m4 s4 input-field'>
                                                <select ref="h100Type" id="Mdl_HType"
                                                        onChange={this.handleH100TypeChange.bind(this)}
                                                        defaultValue={mdlSubset.h100Type} required>
                                                    <option key="H-Promise" value="H-Promise">H-Promise</option>

                                                </select>
                                                <label className="active" htmlFor="Mdl_HType">H100 Type</label>
                                            </div>
                                            <div className='col m4 s4 input-field'>
                                                <select ref="lsType" id="Mdl_LSType"
                                                        onChange={this.handleLSTypeChange.bind(this)}
                                                        defaultValue={mdlSubset.lsType} required>
                                                    <option key="LongStorage" value="LongStorage">LongStorage</option>

                                                </select>
                                                <label className="active" htmlFor="Mdl_LSType">LS Type</label>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="col right marginTop" name="submitButton" id="submitButton">

                                                <a className="waves-effect waves-light amber darken-2  btn-large"
                                                   href="/"
                                                   type="cancel"
                                                   name="cancel" onClick={this.handleCancel.bind(this)}>Cancel</a>

                                                <a className="btn waves-effect waves-light blue btn-large active"
                                                   href="/"
                                                   onClick={this.handleSave.bind(this)}
                                                   disabled={this.state.disabledentry}>Save</a>

                                            </div>
                                        </div>
                                        {this.state.submitalert}
                                    </div>
                                </div>
                            </form>

                        </div>

                    </div>
                )
            } else {
                return (
                    <div className="Search">
                        <div className="container">
                            <div className="row">
                                <form onSubmit={this.avoidReloadPage.bind(this)}>

                                    <div className="col m12 s12 input-field">
                                        <span className="grey-text text-lighten-1"><i>(Search all columns or click column header to search in one column only) </i> </span>

                                        <Griddle results={this.state.mdls} tableClassName="table bordered"
                                                 showFilter={true} resultsPerPage={5} enableInfiniteScroll={false}
                                                 useFixedHeader={true}
                                                 bodyHeight={495}
                                                 showSettings={false} showPager={true}
                                                 columns={["Model Name", "Num Vehicles", "Status"]}
                                                 rowMetadata={rowMetadata}
                                                 onRowClick={this.selectModelNameFromGriddle.bind(this)}/>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        }
    }
}

UpdateModelName.propTypes = {
    currentusername: React.PropTypes.string,
    currentcompany: React.PropTypes.string,
    currentdealer: React.PropTypes.string,
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool,
    ready: React.PropTypes.bool.isRequired
};

export default UpdateModelName;

