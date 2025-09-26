import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import UpdateAccount from '../components/UpdateAccount.jsx';
import PlzLogin from './PlzLogin.jsx';
import {Roles} from '../../api/roles.js';
import {Companies} from '../../api/companies.js';
import {DealersShort} from '../../api/dealersshort.js';
import {Dealers} from '../../api/dealers.js';

class ListUpdateAccounts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // console.log("ListUpdateAccounts render ");
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
                    <UpdateAccount currentusername={this.props.currentusername}
                                   currentcompany={this.props.currentcompany}
                                   currentdealer={this.props.currentdealer}
                                   currentrole={this.props.currentrole}
                                   currentpdiapproved={this.props.currentpdiapproved}
                                   ready={this.props.ready}
                                   roles={this.props.roles}
                                   companies={this.props.companies}
                                   dealersshort={this.props.dealersshort}/>
                );
            }
        }
    }
}

ListUpdateAccounts.propTypes = {
    readyUser: React.PropTypes.bool.isRequired,
    currentusername: React.PropTypes.string,
    currentcompany: React.PropTypes.string,
    currentdealer: React.PropTypes.string,
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool,
    ready: React.PropTypes.bool.isRequired,
    roles: React.PropTypes.array.isRequired,
};

function userIsReady() {
    let aUser = Meteor.user();
    // console.log("user is ready? " + JSON.stringify(aUser));
    return (!(typeof aUser === 'undefined'));
}

function getRolesList(currentRole, isImporter) {
    let roles = [];
    let rolesQuery = {};
    switch (currentRole) {
        case "Admin System": {
            if (isImporter) {
                rolesQuery[currentRole] = "TRUE";
                roles = Roles.find(rolesQuery).fetch();

            } else {
                rolesQuery["Admin Dealer"] = "TRUE";
                roles = Roles.find(rolesQuery).fetch();
            }
        }
            break;
        case "Admin Dealer":
        case "Service Manager":
        case "Technician": {
            rolesQuery[currentRole] = "TRUE";
            roles = Roles.find(rolesQuery).fetch();
        }
            break;
        default: {
            console.log("Error - role not defined");
        }
    }
    return roles;
}

function getCompaniesList(currentRole, currentCompany) {
    let companies = [];
    switch (currentRole) {
        case "Admin System": {
            if (currentCompany.localeCompare("ALL") == 0) {
                companies = Companies.find({company: {$ne: "ALL"}}).fetch();
                companies.push({key: 9999, company: "ALL"})
            } else {
                companies = [{key: 1, company: currentCompany.toUpperCase()}];
            }
        }
            break;
        case "Admin Dealer":
        case "Service Manager":
        case "Technician": {
            companies = [{key: 1, company: currentCompany.toUpperCase()}];
        }
            break;
        default: {
            console.log("Error - role not defined");
        }
    }

    return companies;
}

function getDealersList(currentRole, currentCompany, currentDealer, currentDealerCode) {
    //nconsole.log("getDealersList " + currentCompany);
    let dealersshort = [];

    switch (currentRole) {
        case "Admin System": {
            if (currentDealer.localeCompare("ALL") == 0) {
                if (currentCompany.localeCompare("ALL") == 0) {
                    dealersshort = DealersShort.find({dealer: {$ne: "ALL"}}).fetch();
                    dealersshort.push({key: 9999, company: "ALL", dealer: "ALL", "Dealer Code": "0"});
                    // todo add ALL for each company also
                } else {
                    dealersshort = DealersShort.find({company: currentCompany, dealer: {$ne: "ALL"}}).fetch();
                    dealersshort.push({key: 9999, company: currentCompany, dealer: "ALL", "Dealer Code": "0"});
                }
            } else {
                dealersshort = [{
                    key: 1,
                    company: currentCompany,
                    dealer: currentDealer,
                    "Dealer Code": currentDealerCode
                }];
            }
        }
            break;
        case "Admin Dealer":
        case "Service Manager":
        case "Technician": {
            dealersshort = [{key: 1, company: currentCompany, dealer: currentDealer, "Dealer Code": currentDealerCode}];
        }
            break;
        default: {
            console.log("Error - role not defined");
        }
    }
    return dealersshort;
}

export default ListUpdateAccountsContainer = createContainer(() => {

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
    let roles = [];
    let companies = [];
    let dealersshort = [];
    const rolesHandle = Meteor.subscribe('roles');
    const companiesHandle = Meteor.subscribe('companies');
    const dealersshortHandle = Meteor.subscribe('dealersshort');
    const dealersHandle = Meteor.subscribe('dealers');

    let isImporter = "";
    if (currentDealer.length > 0) {
        if (currentDealer.localeCompare("ALL") == 0) {
            isImporter = "true";
        } else {
            if (currentDealer.length > 0 && dealersHandle.ready()) {
                let dealer = Dealers.findOne({"dealer": currentDealer});
                // console.log("ListUpdateAccounts dealer " + JSON.stringify(dealer));
                isImporter = "" + (dealer && dealer.Importer && dealer.Importer == 1);
            }
        }
    }
    if (currentRole.length > 0 && currentCompany.length > 0 && currentDealer.length > 0 && isImporter.length > 0) {
        if (rolesHandle.ready()) {
            roles = getRolesList(currentRole, isImporter)
        }
        if (currentCompany.length > 0) {
            if (companiesHandle.ready()) {
                companies = getCompaniesList(currentRole, currentCompany);
                // console.log("ListUpdateAccounts companies " + JSON.stringify(companies));
            }
        }
        if (currentDealer.length > 0) {
            if (dealersshortHandle.ready()) {
                dealersshort = getDealersList(currentRole, currentCompany, currentDealer, currentDealerCode)
                // console.log("ListUpdateAccounts dealersshort " + JSON.stringify(dealersshort));
            }
        }
    }
    // console.log("ListUpdateAccounts currentDealer " + currentDealer + " isImporter " + JSON.stringify(isImporter));
    // company = companies[0] ? companies[0].company : "";
    // dealer = dealersshort[0] ? dealersshort[0].dealer : "";
    // dealerCode = dealersshort[0] ? (dealersshort[0])["Dealer Code"] : "";

    // console.log("ListUpdateAccounts currentDealer " + currentDealer + " isImporter " + JSON.stringify(isImporter));
    return {
        readyUser: userReady,
        currentusername: currentUserName,
        currentcompany: currentCompany,
        currentdealer: currentDealer,
        currentrole: currentRole,
        currentpdiapproved: currentPdiApproved,
        ready: rolesHandle.ready() && companiesHandle.ready() && dealersshortHandle.ready() && dealersHandle.ready() && isImporter.length > 0,
        roles: roles,
        companies: companies,
        dealersshort: dealersshort
    };
}, ListUpdateAccounts);

