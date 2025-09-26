import {Meteor} from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
// import Griddle from 'griddle-react';
import {createContainer} from 'meteor/react-meteor-data';
import SearchHistory from '../components/SearchHistory.jsx';
import PlzLogin from './PlzLogin.jsx';

class History extends Component {

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
                    <SearchHistory currentusername={this.props.currentusername}
                                   currentcompany={this.props.currentcompany}
                                   currentdealer={this.props.currentdealer}
                                   currentrole={this.props.currentrole}
                                   currentpdiapproved={this.props.currentpdiapproved}/>

                );
            }
        }
    }
}

History.propTypes = {
    ready: React.PropTypes.bool.isRequired,
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

export default HistoryContainer = createContainer(() => {
    const historyHandle = Meteor.subscribe('history');
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
        ready: historyHandle.ready(),
        readyUser: userReady,
        currentusername: currentUserName,
        currentcompany: currentCompany,
        currentdealer: currentDealer,
        currentrole: currentRole,
        currentpdiapproved: currentPdiApproved
    };
}, History);




