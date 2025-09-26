import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Search from '../components/Search.jsx';
import PlzLogin from './PlzLogin.jsx';
import {Dealers} from '../../api/dealers.js';
import {Typeofchecks} from '../../api/typeofchecks.js';

class LSHome extends Component {

    constructor(props) {
        // console.log("LSHome constructor ");
        super(props);
        // Meteor.call('checklistvalues.halloserver', "LSHome-constructor");
        this.state = {"params": {}};
    }

    createChecklistFunc(mains_record, mains_id, checklisttype) {
        //console.log("createChecklistFunc " + JSON.stringify(mains_id));
        // console.log("createChecklistFunc checklisttype " + checklisttype);
        // console.log("methods on server? " + JSON.stringify(_.keys(Meteor.server.method_handlers)));
        // console.log("createChecklistFunc " + JSON.stringify(mains_id));
        // console.log("createChecklistFunc " + JSON.stringify(checklisttype));

        mains_record.checklisttype = checklisttype;
        this.setState({
            "params": {
                "mains_record": mains_record,
                "mains_id": mains_id,
                "lastEditUserId": this.props.currentuserid,
                "lastEditUserName": this.props.currentusername,
                "typegroup": "LS",
                "ptype": checklisttype  // helps to set checklisttype
            }
        });
    }

    render() {
        // console.log("LSHome USERNAME " + this.props.currentusername);
        // console.log("LSHome COMPANY  " + this.props.currentcompany);
        // console.log("LSHome DEALER   " + this.props.currentdealer);
        // console.log("LSHome ROLE     " + this.props.currentrole);
        // console.log("readyMains " + this.props.readyMains);
        // console.log("readyUser " + this.props.readyUser);
        if (!this.props.readyUser || !this.props.readyMains) {
            return <div id="loader"></div>
        } else {
            // console.log("LS HOME RENDER checklisttypes " + JSON.stringify(this.props.checklisttypes));
            if (this.state.params && this.state.params.mains_record) {
                Meteor.call('checklistvalues.generateValues', this.state.params, function (err, res) {
                    if (err) {
                        console.log("Error: " + err);
                    } else {
                        // console.log("Result: " + JSON.stringify(res));
                        if (("" + res.version) != "undefined") {
                            window.location.assign("/Checklist?mid=" + res.mid + "&type=" + res.checklisttype + "&version=" + res.version);
                        }
                    }
                });
            }

            var currentUser = Meteor.user();
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
                            checklisttypegroup="LS"
                            initChecks={this.props.initChecks}
                            createChecklistFunc={this.createChecklistFunc.bind(this)}/>
                );
            }
        }
    }
}

LSHome.propTypes = {
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

export default LSHomeContainer = createContainer(() => {
    //  const checklistmainsHandle = Meteor.subscribe('checklistmains.perQuery');
    let mainsReady = true; // checklistmainsHandle.ready();
    let aUser = Meteor.user();
    let userReady = (!(typeof aUser === 'undefined'));
    const dealersHandle = Meteor.subscribe('dealers');
    let dealersReady = dealersHandle.ready();
    const typeofchecksHandle = Meteor.subscribe('typeofchecks');
    let typeofchecksReady = typeofchecksHandle.ready();
    // console.log("LSHome typeofchecksReady " + typeofchecksReady);

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
    if (currentDealer && currentDealer.length > 0 && dealersReady) {
        let dealer = Dealers.findOne({"dealer": currentDealer});
        isImporter = dealer && dealer.Importer && (dealer.Importer == 1) ? true : false;
        // console.log("isImporter SET " + isImporter);
    }
    let checklisttypes = [];
    let checklisttype = "";
    if (typeofchecksReady) {
        checklisttypes = Typeofchecks.find({"checklisttypegroup": "LS"}).fetch();
        // console.log("LS HOME checklisttypes " + JSON.stringify(checklisttypes));
        checklisttype = checklisttypes && checklisttypes.length > 0 ? checklisttypes[0].checklisttype : "";
    }
console.log("LSHome checklisttype " + checklisttype);
    let initchecks = [];
    return {
        readyUser: userReady,
        readyMains: mainsReady && dealersReady && typeofchecksReady,
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
}, LSHome);




