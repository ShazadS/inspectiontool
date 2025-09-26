import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import {createContainer} from 'meteor/react-meteor-data';

/** 1. read vehicles
 *  2. find pdi type for it
 *  3. and transform them into checklistvalues record
 *  */
class LSHomeTemp extends Component {

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
                                    <h1 >Long term storage checklists</h1>
                                    <h1 style={styles.thing}>Coming soon!</h1>

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

LSHomeTemp.propTypes = {
    readyUser: React.PropTypes.bool.isRequired,
    currentusername: React.PropTypes.string,
    currentcompany: React.PropTypes.string,
    currentdealer: React.PropTypes.string,
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool
};

export default LSHomeTempContainer = createContainer(() => {
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
}, LSHomeTemp);
