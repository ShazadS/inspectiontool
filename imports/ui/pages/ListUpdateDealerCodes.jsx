import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import UpdateDealerCode from '../components/UpdateDealerCode.jsx';
import PlzLogin from './PlzLogin.jsx';
import {DealersShort} from '../../api/dealersshort.js';

class ListUpdateDealerCodes extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        // console.log("ListUpdateDealerCodes render ");
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
                    <UpdateDealerCode currentusername={this.props.currentusername}
                                      currentcompany={this.props.currentcompany}
                                      currentdealer={this.props.currentdealer}
                                      currentrole={this.props.currentrole}
                                      currentpdiapproved={this.props.currentpdiapproved}
                                      ready={this.props.ready}
                                      dealersshort={this.props.dealersshort}
                    />
                );
            }
        }
    }
}

ListUpdateDealerCodes.propTypes = {
    readyUser: React.PropTypes.bool.isRequired,
    currentusername: React.PropTypes.string,
    currentcompany: React.PropTypes.string,
    currentdealer: React.PropTypes.string,
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool,
    ready: React.PropTypes.bool.isRequired,
    dealersshort: React.PropTypes.array.isRequired
};

function userIsReady() {
    let aUser = Meteor.user();
    // console.log("user is ready? " + JSON.stringify(aUser));
    return (!(typeof aUser === 'undefined'));
}

export default ListUpdateDealerCodesContainer = createContainer(() => {

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

    const dealersshortHandle = Meteor.subscribe('dealersshort');
    let dealersshort = [{"dealer": "Add New Dealer", "Dealer Code": "", "key": "9978"}];

    if (userReady && currentCompany && dealersshortHandle.ready()) {
        let query = {};
        if (currentCompany && currentCompany != "ALL") {
            query.company = currentCompany;
        }
        // console.log("ListUpdateDealerCodesContainer query" + JSON.stringify(query));
        let dss = DealersShort.find(query, {sort: {dealer: 1}}).fetch();
        if (dss) {
            dss.forEach(function (ds){
                dealersshort.push(ds);
            });
        }
    }

    return {
        readyUser: userReady,
        currentusername: currentUserName,
        currentcompany: currentCompany,
        currentdealer: currentDealer,
        currentrole: currentRole,
        currentpdiapproved: currentPdiApproved,
        ready: userReady && dealersHandle.ready() && dealersshortHandle.ready(), // && isImporter.length > 0,
        dealersshort: dealersshort
    };
}, ListUpdateDealerCodes);




