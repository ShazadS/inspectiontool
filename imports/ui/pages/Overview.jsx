import {Meteor} from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import SearchOverview from '../components/SearchOverview.jsx';
import PlzLogin from './PlzLogin.jsx';
import {Dealers} from '../../api/dealers.js';
import {DealersShort} from '../../api/dealersshort.js';

class Overview extends Component {

    constructor(props) {
        super(props);
    }

    // createChecklistFunc(mains_record, mains_id) {
    //     // console.log("createChecklistFunc " + JSON.stringify(mains_record));
    //     // console.log("createChecklistFunc _id " + JSON.stringify(mains_id));
    //
    //     Meteor.call('checklistvalues.generateValues', mains_record, mains_id,
    //         this.props.currentuserid, this.props.currentusername, "PDI", null, function(err, res){
    //             if (err) {
    //                 console.log("Error: " + err);
    //             } else {
    //                 // console.log("Result: " + JSON.stringify(res));
    //                 window.location.assign("/Checklist?mid=" + res.mid + "&type=" + res.checklisttype + "&version=" + res.version);
    //             }
    //         });
    //
    // }

    render() {
        // console.log("Overview USERNAME " + this.props.currentusername);
        // console.log("Overview COMPANY  " + this.props.currentcompany);
        // console.log("Overview DEALER   " + this.props.currentdealer);
        // console.log("Overview ROLE     " + this.props.currentrole);

        if (!this.props.readyUser || !this.props.mainsReady) {
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
                    <SearchOverview currentuserid={this.props.currentuserid}
                                    currentusername={this.props.currentusername}
                                    currentcompany={this.props.currentcompany}
                                    currentdealer={this.props.currentdealer}
                                    isImporter={this.props.isImporter}
                                    currentrole={this.props.currentrole}
                                    currentpdiapproved={this.props.currentpdiapproved}
                                    mainsReady={this.props.mainsReady}
                                    dealersshort={this.props.dealersshort}
                        //  createChecklistFunc={this.createChecklistFunc.bind(this)}
                    />
                );
            }
        }
    }
}

Overview.propTypes = {
    readyUser: React.PropTypes.bool.isRequired,
    currentuserid: React.PropTypes.string,
    currentusername: React.PropTypes.string,
    currentcompany: React.PropTypes.string,
    currentdealer: React.PropTypes.string,
    isImporter: React.PropTypes.bool,
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool,
    dealersshort: React.PropTypes.array.isRequired
};

function userIsReady() {
    var aUser = Meteor.user();
    // console.log("user is ready? " + JSON.stringify(aUser));
    return (!(typeof aUser === 'undefined'));
}

export default OverviewContainer = createContainer(() => {

    let mainsReady = true;
    var aUser = Meteor.user();
    const dealersHandle = Meteor.subscribe('dealers');
    let dealersReady = dealersHandle.ready();
    const dealersshortHandle = Meteor.subscribe('dealersshort');
    let dealersshortReady = dealersshortHandle.ready();

    var userReady = (!(typeof aUser === 'undefined'));
    var currentUserName = userReady ? (aUser == null ? "not logged in" :
            ///*aUser.name*/
            aUser.profile.first + " " + aUser.profile.last) : "user not ready";
    var currentUserId = userReady ? (aUser == null ? "not logged in" :
            ///*aUser.name*/
            aUser._id) : "user not ready";
    var currentCompany = userReady ? (aUser == null ? "" :
            aUser.profile.company) : "";
    var currentDealer = userReady ? (aUser == null ? "" :
            aUser.profile.dealer) : "";
    var currentRole = userReady ? (aUser == null ? "" :
            aUser.profile.role) : "";
    var currentPdiApproved = userReady ? (aUser == null ? false :
            aUser.profile.pdiApproved) : false;
    let isImporter = false;
    if (currentDealer.length > 0 && dealersHandle.ready()) {
        let dealer = Dealers.findOne({"dealer": currentDealer});
        isImporter = dealer && dealer.Importer && dealer.Importer == 1;
    }

    let dealersshort = [{"dealer": "", "Dealer Code": "", "key": "99978"}];
    if (userReady && currentCompany && dealersshortHandle.ready()) {
        let query = {"isActive": true};
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
        currentuserid: currentUserId,
        currentusername: currentUserName,
        currentcompany: currentCompany,
        currentdealer: currentDealer,
        isImporter: isImporter,
        currentrole: currentRole,
        currentpdiapproved: currentPdiApproved,
        mainsReady: mainsReady && dealersReady && dealersshortReady,
        dealersshort: dealersshort

    };

}, Overview);




