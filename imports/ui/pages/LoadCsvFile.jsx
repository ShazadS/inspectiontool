import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import '../../api/vehicles.js';
import {createContainer} from 'meteor/react-meteor-data';

/** 1. read vehicles
 *  2. find pdi type for it
 *  3. and transform them into checklistvalues record
 *  */
class LoadCsvFile extends Component {

    constructor(props) {
        super(props);
    }

    readCsvFile() {
        var csv = Assets.getText('path/to/your.csv');
        // convert the csv to an array of arrays
        var rows = Papa.parse(csv).data;

        // show the first row
        console.log(rows[0]);
    }

    avoidReloadPage(e) {
        return false;
    }

    componentDidMount() {
        // console.log("componentDidMount ");
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    handleUpload(event) {
        console.log("handleUpload ");
        var csv = Assets.getText('path/to/your.csv');

        // convert the csv to an array of arrays
        var rows = Papa.parse(csv).data;

        // show the first row
        console.log(rows[0]);

    }

    render() {
        // console.log("LoadCsvFile - render ");
        var currentUser = Meteor.user();
        var userReady = (!(typeof currentUser === 'undefined'));
        // console.log("LoadCsvFile - render " + currentUser);
        if (!(this.props.readyUser)) {
            return <div id="loader"></div>
        } else {
            var currentUser = Meteor.user();
            if (currentUser == null) {
                window.location.assign("/");
                return (
                    <PlzLogin/>
                );
            } else {

                var currentUserId = userReady ? (currentUser == null ? "not logged in" :
                        currentUser._id) : "user not ready";

                // 'vehicles.generateValues'(vinField, modelField, vehicleTypeField, currentUserId, currentUserName,
                // currentRole, currentPdiApproved,
                // currentCompany, currentDealer) {

                if (currentUser.username == "upload") {
                    console.log("upload");

                    // Meteor.call('vehicles.generateAddedValues', currentUserId, this.props.currentusername,
                    //     this.props.currentrole, this.props.currentpdiapproved,
                    //     this.props.currentcompany, this.props.currentdealer);

                    // Meteor.call('checklistvalues.addChecklisttypegroup', currentUserId, currentUser.username,
                    //     this.props.currentrole,
                    //     this.props.currentcompany, this.props.currentdealer);

                    //  Meteor.call('checklistmains.addChecklistmains', currentUserId, currentUser.username,
                    //         this.props.currentrole,
                    //         this.props.currentcompany, this.props.currentdealer);

                    // Meteor.call('checklistmains.addChecklistmainsH100', currentUserId, currentUser.username,
                    //     this.props.currentrole,
                    //     this.props.currentcompany, this.props.currentdealer);



                    // Meteor.call('checklistmains.correctChecklistmains', currentUserId, currentUser.username,
                    //     this.props.currentrole,
                    //     this.props.currentcompany, this.props.currentdealer);

                    // Meteor.call('checklistvalues.repairDbfields',
                    //     currentUserId, currentUser.username, this.props.currentrole,
                    //     this.props.currentcompany, this.props.currentdealer);

                    // Meteor.call('checklistvalues.atUpdatedString',
                    //     currentUserId, currentUser.username, this.props.currentrole,
                    //     this.props.currentcompany, this.props.currentdealer);

                    // Meteor.call('checklistmains.atUpdatedString',
                    //     currentUserId, currentUser.username, this.props.currentrole,
                    //     this.props.currentcompany, this.props.currentdealer);

                    Meteor.call('checklistvalues.halloserver', "upload");
                    // Meteor.call('checklistvalues.updatedallVersions', currentUserId, currentUser.username,
                    //     this.props.currentrole,
                    //     this.props.currentcompany, this.props.currentdealer);
                    // Meteor.call('checklistmains.updatedallVersions', currentUserId, currentUser.username,
                    //     this.props.currentrole,
                    //     this.props.currentcompany, this.props.currentdealer);
                    //
                    // Meteor.call('checklistmains.upperCaseMake', currentUserId, currentUser.username,
                    //     this.props.currentrole,
                    //     this.props.currentcompany, this.props.currentdealer);

                    // Meteor.call('checklistvalues.upperCaseMake', currentUserId, currentUser.username,
                    //     this.props.currentrole,
                    //     this.props.currentcompany, this.props.currentdealer);

                    // upload new vehicles from vehiclesadded
                    // Meteor.call('uploading.uploadNewVehicles', ["PDI", "H100", "LS"],
                    //     currentUserId, currentUser.username,
                    //     this.props.currentrole, this.props.currentpdiapproved,
                    //     this.props.currentcompany, this.props.currentdealer);

                    // uploadAndUpdateNewVehicles
                    // Meteor.call('uploading.uploadAndUpdateNewVehicles', ["PDI", "H100"], // , "LS"],
                    //     currentUserId, currentUser.username,
                    //     this.props.currentrole, this.props.currentpdiapproved,
                    //     this.props.currentcompany, this.props.currentdealer);

                    // add dealer of last edit user to values and mains
                    // Meteor.call('repair.addLastEditUserDealer',
                    //     currentUserId, currentUser.username,
                    //     this.props.currentrole,
                    //     this.props.currentcompany, this.props.currentdealer);


                    // repair.repairDealerName
                    // Meteor.call('repair.repairDealerName',
                    //     currentUserId, currentUser.username,
                    //     this.props.currentrole,
                    //     this.props.currentcompany, this.props.currentdealer);
                    // Meteor.call('checklistmains.addChecklistmainsLS', currentUserId, currentUser.username,
                    //         this.props.currentrole,
                    //         this.props.currentcompany, this.props.currentdealer);
                    //
                    // Meteor.call('checklistmains.addChecklistmainsBody', currentUserId, currentUser.username,
                    //     this.props.currentrole,
                    //     this.props.currentcompany, this.props.currentdealer);


                   //  Meteor.call('uploading.uploadAndUpdateNewVehicles', ["PDI", "H100"], // , "LS"],
                   // currentUserId, currentUser.username,
                   //      this.props.currentrole,
                   //      this.props.currentcompany, this.props.currentdealer);
                   //  console.log("LoadCsvFile - render ==> repair.lostDataAfterPhotoProblem ");
                   //  Meteor.call('repair.lostDataAfterPhotoProblem', currentUserId, currentUser.username,
                   //      this.props.currentrole,
                   //      this.props.currentcompany, this.props.currentdealer);



                }

                const styles = {
                    thing: {
                        color: 'red'
                    }
                };

                // Meteor.call('vehicles.generateH100Values', "TESTPDI", "vin", "modelName", "vehicleTypeCode", currentUserId, this.props.currentusername,
                //     this.props.currentrole, this.props.currentpdiapproved,
                //     this.props.currentcompany, this.props.currentdealer);

                return (
                    <div className={classnames('PdiHyundai')} ref='PdiHyundai'>

                        <div className="container">

                        </div>

                        <div className="Search">
                            <div className="container">
                                <div className="row">
                                    <h3 style={styles.thing}>Automatic upload daily.</h3>
                                    <h3 style={styles.thing}>Manual upload not yet implemented!</h3>
                                    <h4>Enter CSV File name for vehicle data upload:</h4>
                                    <form onSubmit={this.avoidReloadPage.bind(this)}>

                                        <div className="col s12 input-field">
                                            <input id="vin" type="text" disabled/>
                                            <label htmlFor="vin" value="" className="active">File Name</label>
                                        </div>

                                        <div>
                                            <a className="btn waves-effect waves-light blue btn-large active"

                                               onClick={this.handleUpload.bind(this)}
                                               >UPLOAD</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="row displayInfo">
                            <div className="container">

                            </div>
                        </div>

                    </div>
                );
            }
        }
    }
}

LoadCsvFile.propTypes = {
    readyUser: React.PropTypes.bool.isRequired,
    currentusername: React.PropTypes.string,
    currentcompany: React.PropTypes.string,
    currentdealer: React.PropTypes.string,
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool
};

export default LoadCsvFileContainer = createContainer(() => {
    var aUser = Meteor.user();
    var userReady = (!(typeof aUser === 'undefined'));
    var currentUserName = userReady ? (aUser == null ? "not logged in" :
            ///*aUser.name*/
            aUser.profile.first + " " + aUser.profile.last) : "user not ready";
    var currentCompany = userReady ? (aUser == null ? "" :
            aUser.profile.company) : "";
    var currentDealer = userReady ? (aUser == null ? "" :
            aUser.profile.dealer) : "";
    var currentRole = userReady ? (aUser == null ? "" :
            aUser.profile.role) : "";
    var currentPdiApproved = userReady ? (aUser == null ? false :
            aUser.profile.pdiApproved) : false;
    return {
        readyUser: userReady,
        currentusername: currentUserName,
        currentcompany: currentCompany,
        currentdealer: currentDealer,
        currentrole: currentRole,
        currentpdiapproved: currentPdiApproved
    };
}, LoadCsvFile);
