import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import UpdateModelName from '../components/UpdateModelName.jsx';
import PlzLogin from './PlzLogin.jsx';
import {Roles} from '../../api/roles.js';
import {Companies} from '../../api/companies.js';
import {DealersShort} from '../../api/dealersshort.js';
import {Dealers} from '../../api/dealers.js';

class ListModelNames extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        // console.log("ListModelNames render ");
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
                return (
                    <UpdateModelName currentusername={this.props.currentusername}
                                 currentcompany={this.props.currentcompany}
                                 currentdealer={this.props.currentdealer}
                                 currentrole={this.props.currentrole}
                                 currentpdiapproved={this.props.currentpdiapproved}
                                 ready={this.props.ready}
                                />
                );
            }
        }
    }
}

ListModelNames.propTypes = {
    readyUser: React.PropTypes.bool.isRequired,
    currentusername: React.PropTypes.string,
    currentcompany: React.PropTypes.string,
    currentdealer: React.PropTypes.string,
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool,
    ready: React.PropTypes.bool.isRequired
};

function userIsReady() {
    let aUser = Meteor.user();
    // console.log("user is ready? " + JSON.stringify(aUser));
    return (!(typeof aUser === 'undefined'));
}

export default ListModelNamesContainer = createContainer(() => {

    let aUser = Meteor.user();
    let userReady = (!(typeof aUser === 'undefined'));
    let currentUserName = userReady ? (aUser == null ? "not logged in" :
        ///*aUser.name*/
        aUser.profile.first + " " + aUser.profile.last) : "user not ready";
    let currentCompany = userReady ? (aUser == null ? "" :
        aUser.profile.company) : "";
    let currentDealer = userReady ? (aUser == null ? "" :
        aUser.profile.dealer) : "";
    let currentDealerCode = userReady ? (aUser == null ? "" :
        aUser.profile.dealercode) : "";
    let currentRole = userReady ? (aUser == null ? "" :
        aUser.profile.role) : "";
    let currentPdiApproved = userReady ? (aUser == null ? false :
        aUser.profile.pdiApproved) : false;
    const dealersHandle = Meteor.subscribe('dealers');

    // let isImporter = "";
    // if (currentDealer.length > 0) {
    //     if (currentDealer.localeCompare("ALL") == 0) {
    //         isImporter = "true";
    //     } else {
    //         if (currentDealer.length > 0 && dealersHandle.ready()) {
    //             let dealer = Dealers.findOne({"dealer": currentDealer});
    //             // console.log("ListModelNames dealer " + JSON.stringify(dealer));
    //             isImporter = "" + (dealer && dealer.Importer && dealer.Importer == 1);
    //         }
    //     }
    // }

     return {
        readyUser: userReady,
        currentusername: currentUserName,
        currentcompany: currentCompany,
        currentdealer: currentDealer,
        currentrole: currentRole,
        currentpdiapproved: currentPdiApproved,
        ready: userReady && dealersHandle.ready() // && isImporter.length > 0
    };
}, ListModelNames);




