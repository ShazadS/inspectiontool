import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Search from '../components/Search.jsx';
import PlzLogin from './PlzLogin.jsx';
import {Dealers} from '../../api/dealers.js';

class PdiHome extends Component {

    constructor(props) {

        console.log("PdiHome constructor ");
        console.log(props);
        super(props);
        // Meteor.call('checklistvalues.halloserver', "PdiHome-constructor");
        this.state = {"params": {}};
    }

    createChecklistFunc(mains_record, mains_id, checklisttype) {
        // console.log("createChecklistFunc " + JSON.stringify(mains_id));
        // console.log("methods on server? " + JSON.stringify(_.keys(Meteor.server.method_handlers)));

        this.setState({
            "params": {
                "mains_record": mains_record,
                "mains_id": mains_id,
                "lastEditUserId": this.props.currentuserid,
                "lastEditUserName": this.props.currentusername,
                "typegroup": "PDI",
                "ptype": null // checklisttype is read in mongo depending on modelName
            }
        });
    }

    render() {
        // console.log("PdiHome USERNAME " + this.props.currentusername);
        // console.log("PdiHome COMPANY  " + this.props.currentcompany);
        // console.log("PdiHome DEALER   " + this.props.currentdealer);
        // console.log("PdiHome ROLE     " + this.props.currentrole);

        //  if(!(this.props.ready && this.props.readyUser)){
        // console.log("PdiHome render 1 ");
        if (!(this.props.readyUser && this.props.readyMains)) {
            return <div id="loader"></div>
        } else {

            if (this.state.params && this.state.params.mains_record) {
                // Meteor.call('checklistvalues.halloserver', "before generate");
                // Meteor.apply('checklistvalues.generateValues', [this.state.params], {"onResultReceived": true}
                Meteor.call('checklistvalues.generateValues', this.state.params

                    , function (err, res) { // , mains_id, this.props.currentuserid, this.props.currentusername, "H100", "H-Promise", function(err, res){
                        if (err) {
                            console.log("Error: " + err);
                        } else {
                            // console.log("Result: " + JSON.stringify(res));
                            window.location.assign("/Checklist?mid=" + res.mid + "&type=" + res.checklisttype + "&version=" + res.version);
                        }
                    });
            }
            // console.log("PdiHome render 2 ");

            let currentUser = Meteor.user();
            if (currentUser == null) {
                window.location.assign("/");
                return (
                    <PlzLogin/>
                );
            } else {
                return (

                    <Search currentuserid={this.props.currentuserid}
                            currentusername={this.props.currentusername}
                            currentcompany={this.props.currentcompany}
                            currentdealer={this.props.currentdealer}
                            isImporter={this.props.isImporter}
                            checklisttypes={this.props.checklisttypes}
                            checklisttype={this.props.checklisttype}
                            currentrole={this.props.currentrole}
                            currentpdiapproved={this.props.currentpdiapproved}
                            checklisttypegroup="PDI"
                            initChecks={this.props.initChecks}
                            createChecklistFunc={this.createChecklistFunc.bind(this)}/>
                );
            }
        }
    }
}

PdiHome.propTypes = {
    readyUser: React.PropTypes.bool.isRequired,
    readyMains: React.PropTypes.bool.isRequired,
    initChecks: React.PropTypes.array.isRequired,
    currentuserid: React.PropTypes.string,
    currentusername: React.PropTypes.string,
    currentcompany: React.PropTypes.string,
    currentdealer: React.PropTypes.string,
    isImporter: React.PropTypes.bool,
    checklisttypes: React.PropTypes.array.isRequired,
    checklisttype: React.PropTypes.string.isRequired,
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool
};

export default PdiHomeContainer = createContainer(() => {
    //  const checklistmainsHandle = Meteor.subscribe('checklistmains.perQuery');
    let mainsReady = true; // checklistmainsHandle.ready();
    let aUser = Meteor.user();
    let userReady = (!(typeof aUser === 'undefined'));
    const dealersHandle = Meteor.subscribe('dealers');
    let dealersReady = dealersHandle.ready();

    let currentUserName = userReady ? (aUser == null ? "not logged in" :
        ///*aUser.name*/
        aUser.profile.first + " " + aUser.profile.last) : "user not ready";
    let currentUserId = userReady ? (aUser == null ? "not logged in" :
        ///*aUser.name*/
        aUser._id) : "user not ready";
    let currentCompany = userReady ? (aUser == null ? "" :
        aUser.profile.company) : "";
    let currentDealer = userReady ? (aUser == null ? "" :
        aUser.profile.dealer) : "";
    let currentRole = userReady ? (aUser == null ? "" :
        aUser.profile.role) : "";
    let currentPdiApproved = userReady ? (aUser == null ? false :
        aUser.profile.pdiApproved) : false;
    let isImporter = false;
    if (currentDealer && currentDealer.length > 0 && dealersReady) {
        let dealer = Dealers.findOne({"dealer": currentDealer});
        isImporter = dealer && dealer.Importer && (dealer.Importer == 1) ? true : false;
        // console.log("isImporter SET " + isImporter);
    }

    let checklisttypes = []; // checklisttype depends on modelName of vehicle
    let checklisttype = "";

    let initchecks = [];
    return {
        readyUser: userReady,
        readyMains: mainsReady && dealersReady,
        initChecks: initchecks,
        currentuserid: currentUserId,
        currentusername: currentUserName,
        currentcompany: currentCompany,
        currentdealer: currentDealer,
        isImporter: isImporter,
        checklisttypes: checklisttypes,
        checklisttype: checklisttype,
        currentrole: currentRole,
        currentpdiapproved: currentPdiApproved
    };
}, PdiHome);




