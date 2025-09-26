import {Meteor} from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import SearchUsers from '../components/SearchUsers.jsx';
import PlzLogin from './PlzLogin.jsx';

class ListAccounts extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        if(!(this.props.readyUser)){
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
                    <SearchUsers currentusername={this.props.currentusername}
                                 currentcompany={this.props.currentcompany}
                                 currentdealer={this.props.currentdealer}
                                 currentrole={this.props.currentrole}
                                 currentpdiapproved={this.props.currentpdiapproved}/>
                );
            }
        }
    }
}

ListAccounts.propTypes = {
    readyUser: React.PropTypes.bool.isRequired,
    currentusername: React.PropTypes.string,
    currentcompany: React.PropTypes.string,
    currentdealer: React.PropTypes.string,
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool
};

function userIsReady() {
    var aUser = Meteor.user();
    // console.log("user is ready? " + JSON.stringify(aUser));
    return (!(typeof aUser === 'undefined'));
}

export default ListAccountsContainer = createContainer(() => {

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
}, ListAccounts);




