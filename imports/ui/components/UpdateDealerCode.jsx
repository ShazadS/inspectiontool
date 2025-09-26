import React, {Component, PropTypes} from 'react';
import Griddle from 'griddle-react';
import SweetAlert from 'react-bootstrap-sweetalert';

class UpdateDealerCode extends Component {

    constructor(props) {
        super(props);
        // console.log("constructor " + JSON.stringify(this.props.status));
        this.state = {
            disabledentry: false,
            selectedFromGriddle: false,
            dealrSubset: {},
            dealerexisting: "Add New Dealer",
            dealercodeexisting: "",
            numRecordsFound: "0",
            dealr_id: "",
            dealrs: []
        };
    }

    avoidReloadPage(event) {
        event.preventDefault();
        // console.log("avoidReloadPage ");
        return false;
    }

    loadDealerCodes() { // only load once
        // console.log("loadDealerCodes");
        let that = this;
        Meteor.call('uploading.listnewincadeadealers', this.props.currentcompany, this.props.currentdealer, function (err, dealrs) {
            let numRecordsFound = dealrs.length;
            if (err) {
                console.log("Error when reading upload errors (dealer) data: " + err.message);
            } else {
                that.setState({
                    // disabledentry: false,
                    selectedFromGriddle: false,
                    dealrs: dealrs,
                    dealrSubset: {},
                    numRecordsFound: "" + numRecordsFound,
                    dealr_id: "",
                    dealersshort: that.props.dealersshort
                });
            }
            // console.log("loadDealerCodes " + JSON.stringify(dealrs[0]));
        });
    }

    componentWillMount() { // only called one time
        this.loadDealerCodes();
    }

    handleDealerExistingChange(event) {
        // console.log("handleDealerExistingChange");
        let newDealerExisting = event.target.value;
        let newDealerCode = "";
        let newDealrSubset = this.state.dealrSubset;
        newDealrSubset.dealer = newDealerExisting == "Add New Dealer" ? "" : newDealerExisting;

        this.props.dealersshort.forEach(function (dd) {
            if (dd.dealer == newDealerExisting) {
                newDealerCode = dd["Dealer Code"];
                newDealrSubset.isActive = dd["isActive"] ? dd["isActive"] : true;
                newDealrSubset.isImporter = dd["Importer"] == 1;
                newDealrSubset.company = dd["company"];

            }
        });
        newDealrSubset.dealercode = newDealerCode;

        // console.log("handleDealerExistingChange newDealrSubset " + JSON.stringify(newDealrSubset));
        this.setState(
            {
                "dealerexisting": newDealerExisting,
                "dealercodeexisting": newDealerCode,
                "dealrSubset": newDealrSubset
            });
    };

    handleDealerChange(event) {
        event.preventDefault();
        let newDealrSubset = this.state.dealrSubset;
        newDealrSubset.dealer = event.target.value;
        this.setState({
            dealrSubset: newDealrSubset
        });
    };

    handleDealerCodeChange(event) {
        // console.log("handleDealerCodeChange");
        event.preventDefault();
        let newDealrSubset = this.state.dealrSubset;
        newDealrSubset.dealercode = event.target.value;
        this.setState({
            dealrSubset: newDealrSubset
        });
    };

    handleIsImporterChange(event) {
        event.preventDefault();

    };

    handleIsActiveChange(event) {
        console.log("handleIsActiveChange");
        event.preventDefault();
        let newDealrSubset = this.state.dealrSubset;
        newDealrSubset.isActive = !newDealrSubset.isActive;
        this.setState({
            dealrSubset: newDealrSubset
        });
    };

    avoidReloadPage(event) {
        event.preventDefault();
        // console.log("avoidReloadPage ");
        return false;
    }

    doNothing() {
        this.setState({submitalert: null});
    }

    validateAddedDealerCode(input, dealerexisting) {

        // dealername already existing?
        if (input.dealer != dealerexisting) {

            let newState = this.state;
            // no dealer name given
            if (input.dealer.length == 0) {

                newState.submitalert = <SweetAlert
                    custom
                    confirmBtnText="Close"
                    confirmBtnBsStyle="primary"
                    title="Enter Dealer Name"
                    onConfirm={this.doNothing.bind(this)}>
                    Please select existing dealer name or enter new dealer name
                </SweetAlert>;
                newState.selectedFromGriddle = true;
                this.setState(newState);
                return false;
            }

            // dealer name already exists
            let dealerExists = false;
            this.props.dealersshort.forEach(function (dd) {
                if (dd.dealer == input.dealer) {
                    dealerExists = true;
                }
            });

            if (dealerExists) {
                this.setState({
                    submitalert: <SweetAlert
                        custom
                        confirmBtnText="Continue"
                        confirmBtnBsStyle="primary"
                        title="Dealer Name exist"
                        onConfirm={this.doNothing.bind(this)}>
                        Dealer name already exists - Please connect with existing dealer or change name.
                    </SweetAlert>

                });
                return false;
            }

            // warning dealercode 5 digits


            // warning active dealercode not given?


            return true;
        }

        return true;
    }

    doUpdateDealerCodeAndDealer() {
        console.log("doUpdateDealerCodeAndDealer isImporter " + JSON.stringify(this.refs.isImporter.checked));
        console.log("doUpdateDealerCodeAndDealer isActive " + JSON.stringify(this.refs.isActive.checked));

        let newDealerCode = {
            // input
            "Dealer Code": this.refs.dealercode.value,
            "dealer": this.refs.dealer.value,

            // from Incadea
            "Incadea Dealer Name": this.refs.incadeadealername.value,
            "Incadea Dealer Code": this.refs.incadeadealercode.value,
            "Incadea Dealer No": this.refs.incadeadealerno.value,
            "Incadea City": this.refs.incadeacity.value,
            // "company" : this.refs.company.value,

            // input
            "Importer": this.refs.isImporter.checked ? 1 : 0,
            "isActive": this.refs.isActive.checked
        };

        let newDealerShort = {
            "Dealer Code": this.refs.dealercode.value,
            "dealer": this.refs.dealer.value,
            // "key" todo todo update keys?,
            "company": this.refs.company.value,
            "isActive": this.refs.isActive.checked,
            "Importer": this.refs.isImporter.checked ? 1 : 0
        };

        console.log("doUpdateDealerCodeAndDealer new dealer code " + JSON.stringify(newDealerCode));
        console.log("doUpdateDealerCodeAndDealer new dealer SHORT " + JSON.stringify(newDealerShort));

        if (!this.validateAddedDealerCode(newDealerCode, this.state.dealerexisting)) {

            return false;
        } else {

            var that = this;
            Meteor.call("dealers.upsertdealercode", newDealerCode, function (err) {
                if (err) {
                    console.log("Error " + err.message);
                    that.setState({
                        submitalert: <SweetAlert
                            custom
                            confirmBtnText="Close"
                            confirmBtnBsStyle="primary"
                            title="Error Storing Dealer Code"
                            onConfirm={that.doNothing.bind(that)}>
                            Incadea dealer code {newDealerCode["Incadea Dealer Code"]} could not be saved. Please, speak with your System
                            Administrator (Error Message: {err.message})
                        </SweetAlert>
                    });
                } else {
                    if (newDealerCode.dealer != that.state.dealerexisting) {
                        Meteor.call("dealersshort.upsertdealershort", newDealerShort, function (err) {
                            if (err) {
                                console.log("Error " + err.message);
                                that.setState({
                                    submitalert: <SweetAlert
                                        custom
                                        confirmBtnText="Close"
                                        confirmBtnBsStyle="primary"
                                        title="Error Storing Dealer"
                                        onConfirm={that.doNothing.bind(that)}>
                                        Dealer {newDealerShort.dealer} could not be saved. Please, speak with your System
                                        Administrator (Error Message: {err.message})
                                    </SweetAlert>
                                });
                            } else {
                                // console.log("no error");
                                that.setState({
                                    submitalert: <SweetAlert
                                        custom
                                        confirmBtnText="Continue"
                                        confirmBtnBsStyle="primary"
                                        title="Dealer stored in Data Base"
                                        onConfirm={that.doNothing.bind(that)}>
                                        Dealer Incadea code '{newDealerCode["Incadea Dealer Code"]}' stored/updated in data base.<br/>
                                        Connected to newly added Dealer '{newDealerShort["dealer"]}'.
                                    </SweetAlert>
                                });
                            }
                        });
                    } else {
                        that.setState({
                            submitalert: <SweetAlert
                                custom
                                confirmBtnText="Continue"
                                confirmBtnBsStyle="primary"
                                title="Dealer code stored in Data Base"
                                onConfirm={that.doNothing.bind(that)}>
                                Dealer Incadea code '{newDealerCode["Incadea Dealer Code"]}' stored/updated in data base.<br/>
                                Connected to existing Dealer '{newDealerShort["dealer"]}'.
                            </SweetAlert>

                        });
                    }

                }
            });
        }
        return true;

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
        let updated = this.doUpdateDealerCodeAndDealer();
        if (updated) {
            this.loadDealerCodes();
        }
    }

    handleCancel(event) {
        event.preventDefault();
        this.loadDealerCodes();
        return true;
    }

    checkParams(set) {
        if ((set.role == "Admin System" && !(set.pdiApproved && set.dealer == "ALL")) || this.state.initializeSystem) {
            console.log("Error: role:" + set.role + " pdiApproved:" + set.pdiApproved + " dealer:" + set.dealer);
            return false;
        }
        return true;
    }

    selectDealerCodeFromGriddle(gridRow) {
        // console.log("selectDealerCodeFromGriddle row  " + JSON.stringify(gridRow.props.data));

        if (this.props.currentrole != "Admin System" || this.props.currentcompany == "ALL") {
            this.setState({
                submitalert: <SweetAlert
                    custom
                    confirmBtnText="Close"
                    confirmBtnBsStyle="primary"
                    title="No Access for Editing"
                    onConfirm={this.doNothing.bind(this)}>
                    Your role needs to be Admin System and company unequal "ALL" to add new Models.
                </SweetAlert>
            });
            return;
        }

        let numRecordsFound = 1;
        // console.log("selectDealerCodeFromGriddle grid data " + JSON.stringify(gridRow.props.data));

        let dealrSubset = {
            "numVehicles": gridRow.props.data["Num Vehicles"],
            "status": gridRow.props.data["Status"],
            "dealerrequestcode": gridRow.props.data["Dealer Request Code"],
            "company": gridRow.props.data["company"],
            "incadeadealername": gridRow.props.data["Incadea Dealer Name"] ? gridRow.props.data["Incadea Dealer Name"] : "",
            "incadeadealerno": gridRow.props.data["Incadea Dealer No"] ? gridRow.props.data["Incadea Dealer No"] : "",
            "incadeacity": gridRow.props.data["Incadea City"] ? gridRow.props.data["Incadea City"] : "",

            "dealerexisting ": gridRow.props.data["Connected Dealer"] ? gridRow.props.data["Connected Dealer"] : "Add New Dealer",
            "dealercodexisting": gridRow.props.data["dealercode"] ? gridRow.props.data["dealercode"] : "",

            "dealer": gridRow.props.data["Connected Dealer"] ? gridRow.props.data["Connected Dealer"] : "",
            "dealercode": gridRow.props.data["Dealer Code"] ? gridRow.props.data["Dealer Code"] : "",

            "isActive": gridRow.props.data["isActive"] ? gridRow.props.data["isActive"] : false,
            "isImporter": gridRow.props.data["isImporter"] ? gridRow.props.data["isImporter"] : false,
        };

        this.setState({
            "selectedFromGriddle": true,
            "dealrSubset": dealrSubset,
            "dealers": this.props.dealers
        });
    }

    render() {
        // console.log("UpdateDealerCode render ");
        // console.log("UpdateDealerCode render dealrSubset " + JSON.stringify(this.state.dealrSubset))
        if (!(this.props.ready)) {
            return <div id="loader"></div>
        } else {

            let dealrSubset = this.state.dealrSubset;
            let addDealerblocked = this.state.dealerexisting != "Add New Dealer";

            const rowMetadata = {
                bodyCssClassName: rowData => (rowData.id === this.state.selectedRowId ? 'selected' : ''),
            };
            // console.log("UpdateDealerCode render dealer " + dealrSubset.dealer);
            // console.log("UpdateDealerCode render isImporter " + dealrSubset.isImporter);
            // console.log("UpdateDealerCode render dealr " + JSON.stringify(this.state.dealrs[0]))
            if (this.state.selectedFromGriddle) {
                return (
                    <div className="Search">
                        <div className="container">

                            <form onSubmit={this.avoidReloadPage.bind(this)}>
                                <div className="row">
                                    <div className="col s12 m12">
                                        <h1> Add New Model Name: </h1>

                                        <div className="row">

                                            <div className='col m3 s3 input-field'>
                                                <input type="text" ref="incadeadealercode" id="Dlr_IncadeaCode"
                                                       defaultValue={dealrSubset.dealerrequestcode} disabled
                                                       className="blue-text lighten-1"/>
                                                <label className="active" htmlFor="Dlr_IncadeaCode">Dealer Request
                                                    Code</label>
                                            </div>
                                            <div className='col m3 s3 input-field'>
                                                <input type="text" ref="company" id="Dlr_Company"
                                                       defaultValue={dealrSubset.company} disabled
                                                       className="blue-text lighten-1"/>
                                                <label className="active" htmlFor="Dlr_Company">Company</label>
                                            </div>

                                            <div className='col m3 s3 input-field'>
                                                <input type="text" id="Dlr_NumVehs"
                                                       defaultValue={dealrSubset.numVehicles} disabled
                                                       className="blue-text lighten-1"/>
                                                <label className="active" htmlFor="Dlr_NumVehs">Num Vehicles</label>
                                            </div>

                                            <div className='col m3 s3 input-field'>
                                                <input type="text" id="Dlr_Status"
                                                       defaultValue={dealrSubset.status} disabled
                                                       className="blue-text lighten-1"/>
                                                <label className="active" htmlFor="Dlr_Status">Status</label>
                                            </div>

                                            <div className='col m6 s6 input-field'>
                                                <input type="text" ref="incadeadealername" id="Dlr_IncadeaName"
                                                       defaultValue={dealrSubset.incadeadealername} disabled
                                                       className="blue-text lighten-1"/>
                                                <label className="active" htmlFor="Dlr_IncadeaName">Incadea Dealer
                                                    Name</label>
                                            </div>

                                            <div className='col m3 s3 input-field'>
                                                <input type="text" ref="incadeadealerno" id="Dlr_IncadeaNo"
                                                       defaultValue={dealrSubset.incadeadealerno} disabled
                                                       className="blue-text lighten-1"/>
                                                <label className="active" htmlFor="Dlr_IncadeaNo">Incadea Dealer
                                                    No</label>
                                            </div>

                                            <div className='col m3 s3 input-field'>
                                                <input type="text" ref="incadeacity" id="Dlr_IncadeaCity"
                                                       defaultValue={dealrSubset.incadeacity} disabled
                                                       className="blue-text lighten-1"/>
                                                <label className="active" htmlFor="Dlr_IncadeaCity">Incadea Dealer
                                                    City</label>
                                            </div>

                                        </div>
                                        <div className="row">

                                            <div className='col m6 s6 input-field'>
                                                <select ref="dealerexisting" id="Dlr_Name_Existing"
                                                        onChange={this.handleDealerExistingChange.bind(this)}
                                                        defaultValue={this.state.dealerexisting} required>
                                                    {
                                                        this.props.dealersshort.map(function (ll) {
                                                            return <option key={ll.key}
                                                                           value={ll.dealer}>{ll.dealer}</option>;
                                                        })
                                                    }
                                                </select>
                                                <label className="active" htmlFor="Dlr_Name_Existing">Select Existing Dealer</label>
                                            </div>
                                            <div className='col m6 s6 input-field'>

                                                <input ref="dealercodeexisting" id="Dlr_Code_Existing"
                                                       value={this.state.dealercodeexisting} disabled>

                                                </input>
                                                <label className="active" htmlFor="Dlr_Code_Existing">Dealer
                                                    Code </label>
                                            </div>

                                        </div>

                                        {addDealerblocked ?
                                            <div className="row">

                                                <h2> Connect Existing Dealer: </h2>
                                                <div className='col m6 s6 input-field'>

                                                    <input ref="dealer" id="Dlr_Name"
                                                           onChange={this.handleDealerChange.bind(this)}
                                                           value={dealrSubset.dealer} disabled={addDealerblocked}>

                                                    </input>
                                                    <label className="active" htmlFor="Dlr_Name">Dealer Name</label>
                                                </div>
                                                <div className='col m6 s6 input-field'>

                                                    <input ref="dealercode" id="Dlr_Code"
                                                           onChange={this.handleDealerCodeChange.bind(this)}
                                                           value={dealrSubset.dealercode}
                                                           disabled={addDealerblocked}>

                                                    </input>
                                                    <label className="active" htmlFor="Dlr_Code">Dealer Code (e.g
                                                        00400)</label>
                                                </div>
                                            </div>
                                            :
                                            <div className="row">

                                                <h2> Add New Dealer: </h2>
                                                <div className='col m6 s6 input-field'>

                                                    <input ref="dealer" id="Dlr_Name"
                                                           onChange={this.handleDealerChange.bind(this)}
                                                           value={dealrSubset.dealer} disabled={addDealerblocked}>

                                                    </input>
                                                    <label className="active" htmlFor="Dlr_Name">Dealer Name</label>
                                                </div>
                                                <div className='col m6 s6 input-field'>

                                                    <input ref="dealercode" id="Dlr_Code"
                                                           onChange={this.handleDealerCodeChange.bind(this)}
                                                           value={dealrSubset.dealercode}
                                                           disabled={addDealerblocked}>

                                                    </input>
                                                    <label className="active" htmlFor="Dlr_Code">Dealer Code (e.g
                                                        00400)</label>
                                                </div>
                                            </div>

                                        }


                                        <div className="row">
                                            <div className='col m6 s6 input-field'>
                                                <input type="checkbox" ref="isImporter" id="Acc_IsImporter"
                                                       name="Acc_IsActive"
                                                       checked={dealrSubset.isImporter}
                                                       onChange={this.handleIsImporterChange.bind(this)}
                                                       disabled={addDealerblocked}/>
                                                <label htmlFor="Acc_IsImporter">Is Importer</label>
                                            </div>
                                            <div className='col m6 s6 input-field'>
                                                <input type="checkbox" ref="isActive"
                                                       checked={dealrSubset.isActive}
                                                       onChange={this.handleIsActiveChange.bind(this)}
                                                       disabled={addDealerblocked}/>
                                                <label htmlFor="Acc_IsActive">Is Active</label>
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

                                        <Griddle results={this.state.dealrs} tableClassName="table bordered"
                                                 showFilter={true} resultsPerPage={10} enableInfiniteScroll={false}
                                                 useFixedHeader={true}
                                                 bodyHeight={990}
                                                 showSettings={false} showPager={true}
                                                 columns={["Dealer Request Code", "Num Vehicles", "Status", "Connected Dealer",
                                                     "Incadea Dealer Name", "Incadea Dealer No", "Incadea City"]}
                                                 rowMetadata={rowMetadata}
                                                 onRowClick={this.selectDealerCodeFromGriddle.bind(this)}/>
                                    </div>
                                    {this.state.submitalert}
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        }
    }
}

UpdateDealerCode.propTypes = {
    currentusername: React.PropTypes.string,
    currentcompany: React.PropTypes.string,
    currentdealer: React.PropTypes.string,
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool,
    ready: React.PropTypes.bool.isRequired,
    dealersshort: React.PropTypes.array.isRequired
};

export default UpdateDealerCode;

