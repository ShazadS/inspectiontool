import TrackerReact from 'meteor/ultimatejs:tracker-react';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import PlzLogin from './PlzLogin.jsx';

import {Roles} from '../../api/roles.js';
import {DealersShort} from '../../api/dealersshort.js';
import {Companies} from '../../api/companies.js';
import SweetAlert from 'react-bootstrap-sweetalert';
// import {Users} from '../../api/User.js';

class CreateAccount extends TrackerReact(React.Component) {

    constructor(props) {
        super(props);
        //const subscription = Meteor.subscribe('userData');
        const subscriptionDealersShort = Meteor.subscribe('dealersshort');
        const subscriptionCompanies = Meteor.subscribe('companies');

        let initializeSystem = false;
        let disabledEntry = !(props.currentrole.includes("Admin") || initializeSystem);
        // console.log("constructor " + disabledEntry + " curr role " + props.currentrole)
        this.state = {
            initializeSystem: initializeSystem,
            // subscription: subscription,
            subscriptionDealersShort: subscriptionDealersShort,
            subscriptionCompanies: subscriptionCompanies,
            userSet: {
                userName: "",
                firstName: "",
                lastName: "",
                email: "",
                role: "",
                company: "",
                dealer: "",
                roles: [],
                companies: [],
                dealersshort: [],
                pdiApproved: false,
                pdiApprovedNo: "",
                password: "",
                password2: ""
            },
            inputOK: false,
            disabledentry: false, // diabledE
            disabledpdinoentry: true // diabledEntry
        };
        Meteor.call("dealersshort.hallo");
    }

    componentWillUnmount() {
        // this.state.subscription.stop();
        this.state.subscriptionCompanies.stop();
        this.state.subscriptionDealersShort.stop();
    }

    handleUserNameChange(event) {
        let text = event.target.value;

    };

    handleFirstNameChange(event) {
        let text = event.target.value;

    };

    handleLastNameChange(event) {
        let text = event.target.value;
    };

    handleEmailChange(event) {
        let text = event.target.value;
    };

    handleRoleChange(event) {
        // console.log("handleRoleChange");

        let text = event.target.value;
        let newUserSet = this.state.userSet;
        newUserSet.role = text;

        // set companies new + ALL if current is ALL
        if (this.state.initializeSystem) {
            newUserSet.roles = [{key: 1, dealer: "Admin System"}];
            newUserSet.role = "Admin System";
            newUserSet.companies = [{key: 1, dealer: "HYUNDAI"}];
            newUserSet.dealer = "ALL";
            newUserSet.dealersshort = [{key: 1, dealer: "ALL"}];
            newUserSet.pdiApproved = true;
        } else {
            if (text == "Admin System") {
                if (this.props.currentcompany.localeCompare("ALL") == 0) {
                    // also ALL if it is a Admin Syste
                    newUserSet.companies = Companies.find({}).fetch();
                    newUserSet.company = newUserSet.companies[0] ? newUserSet.companies[0].company.toUpperCase() : "";
                } else {
                    newUserSet.companies = [{key: 1, company: this.props.currentcompany.toUpperCase()}];
                    newUserSet.company = newUserSet.companies[0] ? newUserSet.companies[0].company.toUpperCase() : "";
                }
                newUserSet.dealersshort = DealersShort.find({company: "ALL"}).fetch();
                newUserSet.pdiApproved = true;
            }
            if (text == "Admin Dealer") {
                newUserSet.pdiApproved = false;
                if (this.props.currentcompany.localeCompare("ALL") == 0) {
                    newUserSet.companies = Companies.find({company: {$ne: "ALL"}}).fetch();

                } else {
                    newUserSet.companies = [{key: 1, company: this.props.currentcompany}];
                }
                if (this.props.currentdealer.localeCompare("ALL") == 0) {
                    newUserSet.company = newUserSet.companies[0] ? newUserSet.companies[0].company : "";
                    newUserSet.dealersshort = DealersShort.find({company: newUserSet.company}).fetch();
                } else {
                    newUserSet.dealersshort = DealersShort.find({company: this.props.currentcompany, "dealer": this.props.currentdealer}).fetch();
                }
            }
            if (text == "Service Manager") {
                if (this.props.currentcompany.localeCompare("ALL") == 0) {
                    newUserSet.companies = Companies.find({company: {$ne: "ALL"}}).fetch();

                } else {
                    newUserSet.companies = [{key: 1, company: this.props.currentcompany}];

                }
                if (this.props.currentdealer.localeCompare("ALL") == 0) {
                    newUserSet.company = newUserSet.companies[0] ? newUserSet.companies[0].company.toUpperCase() : "";
                    newUserSet.dealersshort = DealersShort.find({company: newUserSet.company.toUpperCase()}).fetch();
                } else {
                    newUserSet.dealersshort = DealersShort.find({company: this.props.currentcompany.toUpperCase(), "dealer": this.props.currentdealer}).fetch();
                }
            }
            if (text == "Technician") {
                if (this.props.currentcompany.localeCompare("ALL") == 0) {
                    newUserSet.companies = Companies.find({company: {$ne: "ALL"}}).fetch();

                } else {
                    newUserSet.companies = [{key: 1, company: this.props.currentcompany.toUpperCase()}];

                }
                if (this.props.currentdealer.localeCompare("ALL") == 0) {
                    newUserSet.company = newUserSet.companies[0] ? newUserSet.companies[0].company : "";
                    newUserSet.dealersshort = DealersShort.find({company: newUserSet.company.toUpperCase()}).fetch();
                } else {
                    newUserSet.dealersshort = DealersShort.find({company: this.props.currentcompany, "dealer": this.props.currentdealer}).fetch();
                }
            }
            newUserSet.company = newUserSet.companies[0] ? newUserSet.companies[0].company : "";
            newUserSet.dealer = newUserSet.dealersshort[0] ? newUserSet.dealersshort[0].dealer : "";
            newUserSet.dealerCode = newUserSet.dealersshort[0] ? (newUserSet.dealersshort[0])["Dealer Code"] : "";

        }

        this.setState({"userSet": newUserSet});
    };

    handleCompanyChange(event) {
        // console.log("handleCompanyChange");
        let text = event.target.value;
        let newUserSet = this.state.userSet;
        newUserSet.company = text;
        if (newUserSet.company != "ALL") {
            newUserSet.dealersshort = DealersShort.find({"company": newUserSet.company}).fetch();
            newUserSet.dealer = newUserSet.dealersshort && newUserSet.dealersshort[0] ? newUserSet.dealersshort[0].dealer : "";
            newUserSet.dealerCode = newUserSet.dealersshort && newUserSet.dealersshort[0] ? newUserSet.dealersshort[0]["Dealer Code"] : "";
        }
        // console.log("dealersshort " + JSON.stringify(newUserSet.dealersshort));
        // console.log("deacode " + JSON.stringify(newUserSet.dealerCode));
        this.setState({"userSet": newUserSet});
    };

    handleDealerChange(event) {
        // console.log("handleDealerChange");
        let text = event.target.value;
        let newUserSet = this.state.userSet;
        newUserSet.dealer = text;
        newUserSet.dealersshort.forEach(function (dd) {
            if (dd.dealer == newUserSet.dealer) {
                newUserSet.dealerCode = dd["Dealer Code"];
            }
        });
        this.setState({"userSet": newUserSet});
    };

    handlePdiChange(event) {
        event.preventDefault();
        // console.log("handleSearchPending " + JSON.stringify(_.keys(event.target.checked)));
        let newUserSet = this.state.userSet;
        newUserSet.pdiApproved = !this.state.userSet.pdiApproved;
        setTimeout(() => this.setState({
            "userSet": newUserSet
        }));
    };

    handlePdiNoChange(event) {
        event.preventDefault();
        let text = event.target.value;

        // console.log("handleSearchPending " + JSON.stringify(_.keys(event.target.checked)));
        setTimeout(() => this.setState({
            "userSet.pdiApprovedNo": text
        }));
    };

    handlePasswordChange(event) {
        let text = event.target.value;


    };

    handlePassword2Change(event) {
        let text = event.target.value;


    };

    avoidReloadPage(event) {
        event.preventDefault();
        // console.log("avoidReloadPage ");
        return false;
    }

    doNothing() {
        this.setState({submitalert: null});
    }

    validateEmail(email) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    validateInput(input, password2) {
        if (input.profile.role == "Admin System" && !(input.profile.company == "ALL" && input.profile.pdiApproved)) {
            this.setState({
                submitalert: <SweetAlert
                    custom
                    confirmBtnText="Close"
                    confirmBtnBsStyle="primary"
                    title="Admin System must have company='ALL and PDI approved"
                    onConfirm={this.doNothing.bind(this)}>
                </SweetAlert>,

                pdiApproved: true,
                company: "ALL"
            });
        }
        if (input.profile.role == "Admin Dealer" && (input.profile.company == "ALL" || input.profile.pdiApproved)) {
            this.setState({
                submitalert: <SweetAlert
                    custom
                    confirmBtnText="Close"
                    confirmBtnBsStyle="primary"
                    title="Admin Dealer CANNOT be PDI approved"
                    onConfirm={this.doNothing.bind(this)}>
                </SweetAlert>,

                pdiApproved: false,
                company: this.props.currentcompany
            });
            return false;
        }

        if (input.profile.company.toUpperCase() == "HYUNDAI" && input.profile.role == "Technician"
        && input.profile.pdiApproved && (!input.profile.pdiNo || (input.profile.pdiNo && input.profile.pdiNo.length == 0))) {
            this.setState({
                submitalert: <SweetAlert
                    custom
                    confirmBtnText="Close"
                    confirmBtnBsStyle="primary"
                    title="If PDI approved - needs PDI Code"
                    onConfirm={this.doNothing.bind(this)}>

                    Technician with PDI approved: Please enter PDI Code.
                </SweetAlert>,
                pdiApproved: false,
                company: this.props.currentcompany
            });
            return false;
        }
        if (!input.username || input.username.length == 0) {
            this.setState({
                submitalert: <SweetAlert
                    custom
                    confirmBtnText="Close"
                    confirmBtnBsStyle="Primary"
                    title="Username Required"
                   onConfirm={this.doNothing.bind(this)}>
                    Please enter Username
                </SweetAlert>
            });
            return false;
        } else {
            if (!input.profile.first || input.profile.first.length == 0 || !input.profile.last || input.profile.last.length == 0) {
                this.setState({
                    submitalert: <SweetAlert
                        custom
                        confirmBtnText="Close"
                        confirmBtnBsStyle="primary"
                        title="Name missing"
                        onConfirm={this.doNothing.bind(this)}>
                        Please enter First and Last name.
                    </SweetAlert>
                });
                return false;
            } else {

                if (input.email && input.email.length > 0 && !this.validateEmail(input.email)) {
                    this.setState({
                        submitalert: <SweetAlert
                            custom
                            confirmBtnText="Close"
                            confirmBtnBsStyle="primary"
                            title="Invalid email"
                            onConfirm={this.doNothing.bind(this)}>
                            Please enter Valid Email.
                        </SweetAlert>
                    });
                    return false;
                } else {
                    if (input.password != password2) {
                        this.setState({
                            submitalert: <SweetAlert
                                custom
                                confirmBtnText="Close"
                                confirmBtnBsStyle="primary"
                                title="Passwords do not match"
                                onConfirm={this.doNothing.bind(this)}>
                                Please enter matching passwords.
                            </SweetAlert>
                        });
                        return false;
                    } else {
                        if (input.password.length < 5) {
                            this.setState({
                                submitalert: <SweetAlert
                                    custom
                                    confirmBtnText="Close"
                                    confirmBtnBsStyle="primary"
                                    title="Password too short"
                                    onConfirm={this.doNothing.bind(this)}>
                                    Password length min 5. characters.
                                </SweetAlert>
                            });
                            return false;
                        }
                    }

                }
                //}
            }
        }

        // console.log("validate " + JSON.stringify(input));
        // console.log(input.username.substring(0, (input.profile.dealercode.length)));
        // console.log(input.username.substring(input.username.length - input.profile.pdiNo.length, input.username.length));
        // console.log(input.username.substring(0, input.profile.dealercode.length) != ("" + input.profile.dealercode));
        // console.log(input.username.substring(input.username.length - input.profile.pdiNo.length, input.username.length) != input.profile.pdiNo);

        if (input.profile.company.toUpperCase() == "HYUNDAI" && input.profile.role == "Technician"
            && (input.username.substring(0, input.profile.dealercode.length) != ("" + input.profile.dealercode)
            || input.username.substring(input.username.length - input.profile.pdiNo.length, input.username.length) != input.profile.pdiNo)) {
            // console.log("wrong user name ");
            this.setState({
                submitalert: <SweetAlert
                    custom
                    confirmBtnText="Close"
                    confirmBtnBsStyle="primary"
                    title="Wrong user name"
                    onConfirm={this.doNothing.bind(this)}>
                    Username of Hyundai Technician must <br/> be (DealerCode)(PDI code)
                </SweetAlert>
            });
            return false;
        }
        return true;
    }

    doCreateUser() {
        let dealercode = this.refs.dealercode.value ? this.refs.dealercode.value : "";
        let newUser = {
            "username": this.refs.userName.value,
            password: this.refs.password.value,
            email: this.refs.email.value,
            profile: {
                "first": this.refs.firstName.value,
                "last": this.refs.lastName.value,
                "company": this.refs.company.value,
                "dealer": this.refs.dealer.value,
                "dealercode": dealercode,
                "role": this.refs.role.value,
                "pdiApproved": this.refs.pdiApproved.checked,
                "pdiNo": this.refs.pdiNo.value
            }
        };

        if (this.validateInput(newUser, this.refs.password2.value)) {
            // console.log("new user " + JSON.stringify(newUser));

            // console.log("Accounts " + JSON.stringify(_.keys(Accounts)));
            // ["_options","connection","users","_onLoginHook","_onLoginFailureHook","_onLogoutHook","_loggingIn",
            //     "_loggingInDeps","_loginServicesHandle","_pageLoadLoginCallbacks","_pageLoadLoginAttemptInfo",
            //     "_autoLoginEnabled","_accountsCallbacks","LOGIN_TOKEN_KEY","LOGIN_TOKEN_EXPIRES_KEY","USER_ID_KEY",
            //     "_lastLoginTokenWhenPolled","_pollIntervalTimer","_hashPassword",
            //     "createUser","changePassword","forgotPassword","resetPassword","verifyEmail","ui","_loginButtonsSession"]
            let that = this;
            Meteor.call("userdata.createUserFromAdmin",
                // Accounts.createUser(
                newUser, function testError(err) {
                    if (err) {
                        // console.log("Error " + err.message);
                        that.setState({
                            submitalert: <SweetAlert
                                custom
                                confirmBtnText="Close"
                                confirmBtnBsStyle="primary"
                                title={err.reason}
                                onConfirm={that.doNothing.bind(that)}>
                                Please change field.
                            </SweetAlert>
                        });
                    } else {
                        // console.log("no error");
                        that.setState({
                            submitalert: <SweetAlert
                                custom
                                confirmBtnText="Continue"
                                confirmBtnBsStyle="primary"
                                title="New User Account Created"
                                onConfirm={that.doNothing.bind(that)}>
                                Press Continue to return to account form.
                            </SweetAlert>,
                            password: "",
                            password2: ""
                        });
                    }
                });
        }

    }

    handleSubmit(event) {
        // console.log("handle submit props.status " + this.props.status);
        event.preventDefault();
        if (!(this.props.currentrole == "Admin Dealer" || this.props.currentrole == "Admin System" || this.props.currentrole == "Service Manager")) {
            this.setState({
                submitalert: <SweetAlert
                    custom
                    confirmBtnText="Close"
                    confirmBtnBsStyle="primary"
                    title="No Access for User Creation"
                    onConfirm={this.doNothing.bind(this)}>
                    Your role needs to be Admin Dealer, Admin System or Service Manager.
                </SweetAlert>
            });
            return false;
        }
        this.doCreateUser();

        let newUserSet = this.state.userSet;
        newUserSet.password = "";
        newUserSet.password2 = "";
        this.setState({"userSet": newUserSet});
    }

    doClose(event) {

        // console.log("do nothing");
        // event.preventDefault();
        this.setState({submitalert: null});
        // todo USE ROUTER to go to home page
        // todo
        // todo
        window.location.assign("/");
    }

    handleClose(event) {
        event.preventDefault();
        // console.log("handle close ");
        // let different = this.checkValuesForChanges(this.state.updatedValues, this.state.savedValues);
        //
        // if (different) {
        //
        //     this.setState({
        //         submitalert: <SweetAlert
        //             custom
        //             showCancel
        //             allowOutsideClick="true"
        //             cancelBtnText="Close without Save"
        //             confirmBtnText="Save and Close"
        //             cancelBtnBsStyle="default"
        //             confirmBtnBsStyle="primary"
        //             title="Save and Close"
        //             onCancel={this.doClose.bind(this)}
        //             onConfirm={this.saveForClose.bind(this)}>
        //
        //             Save before Close?
        //         </SweetAlert>
        //     });
        // } else {
        this.doClose(event);
        // }

        // todo goto home page doNothing -> doClose
        return true;
    }

    checkParams(set) {
        if ((set.role == "Admin System" && !(set.pdiApproved && set.dealer == "ALL")) || this.state.initializeSystem) {
            console.log("Error: role:" + set.role + " pdiApproved:" + set.pdiApproved + " dealer:" + set.dealer);
            return false;
        }
        return true;
    }


    render() {
        // console.log("USERNAME " + this.props.currentusername);
        // console.log("COMPANY  " + this.props.currentcompany);
        // console.log("ROLE     " + this.props.currentrole);
        // console.log("DEALER   " + this.props.currentdealer);

        // console.log("readyDealersShort   " + this.props.readyDealersShort);
        // console.log("readyUser   " + this.props.readyUser);
        // console.log("readyCompanies   " + this.props.readyCompanies);

        if (!(this.props.readyCompanies && this.props.readyDealersShort && this.props.readyRoles && this.props.readyUser)
            || this.props.currentusername == "user not ready") {
            return <div id="loader"></div>
        } else {

            if (this.props.currentusername == "not logged in" && !this.state.initializeSystem) {
                window.location.assign("/");
                return (
                    <PlzLogin/>
                );
            } else {

                let userSet = this.state.userSet;
                if (this.state.initializeSystem) {
                    userSet.roles = [{key: 1, role: "Admin System"}];
                    userSet.role = "Admin System";
                    userSet.companies = [{key: 1, company: "ALL"}];
                    userSet.company = "ALL";
                    // console.log("dealer query 1 " + JSON.stringify({
                    //         "company": userSet.company,
                    //         dealer: "ALL"}));
                    userSet.dealersshort = DealersShort.find({
                        "company": userSet.company.toUpperCase(),
                        dealer: "ALL"}).fetch();
                    userSet.dealer = "ALL";
                    userSet.pdiApproved = true;
                } else {


                    if (userSet.roles.length == 0) {
                        let rolesQuery = {};
                        if (!this.state.initializeSystem) {
                            rolesQuery[this.props.currentrole] = "TRUE";
                        }
                        // console.log("roles query " + JSON.stringify(rolesQuery));
                        userSet.roles = Roles.find(rolesQuery).fetch()
                    }
                    if (userSet.role == "") {
                        userSet.role = userSet.roles[0] ? userSet.roles[0].role : "";
                    }

                    if (userSet.companies.length == 0) {
                        // Admin Dealer can create role for
                        // company=<company> the same company only
                        if (this.props.currentrole.localeCompare("Admin Dealer") == 0
                            || this.props.currentrole.localeCompare("Service Manager") == 0) {
                            userSet.companies = [{key: 1, company: this.props.currentcompany.toUpperCase()}];
                        }
                        // Admin System can create role for
                        // company=ALL, all companies
                        // company=<company> the same company only
                        if (this.props.currentrole.localeCompare("Admin System") == 0 || this.state.initializeSystem) {
                            if (this.props.currentcompany.localeCompare("ALL") == 0 || this.state.initializeSystem) {
                                // also ALL if it is a Admin System
                                if (userSet.role.localeCompare("Admin System") == 0) {
                                    userSet.companies = Companies.find({}).fetch();
                                    newUserSet.dealer = "ALL";
                                    // console.log("dealer query 2 " + JSON.stringify({
                                    //         "company": userSet.company,
                                    //         dealer: "ALL"}));
                                    newUserSet.dealersshort =  DealersShort.find({
                                        "company": userSet.company.toUpperCase(),
                                        dealer: "ALL"}).fetch();
                                } else {
                                    userSet.companies = Companies.find({company: {$ne: "ALL"}}).fetch();
                                    userSet.companies.forEach(function(cc){ cc.company = cc.company.toUpperCase()});
                                    // console.log("companies " + JSON.stringify(userSet.companies));
                                }
                            } else {
                                userSet.companies = [{key: 1, company: this.props.currentcompany.toUpperCase()}];
                            }
                        }
                    }

                    if (userSet.company == "") {
                        userSet.company = userSet.companies[0] ? userSet.companies[0].company.toUpperCase() : "";
                    }
                    if (userSet.dealersshort.length == 0 || // no dealers yet
                        (userSet.dealersshort.length == 1 && userSet.dealersshort[0].dealer.length == 0 ) // funny setting
                        || (userSet.company != this.state.userSet.company)) { // company was just changed

                        if (this.props.currentdealer.localeCompare("ALL") == 0 || this.state.initializeSystem) {
                            // can define roles for all dealers and also "ALL"

                            // console.log("dealer query 3 " + JSON.stringify({"company": userSet.company.toUpperCase()}));
                            userSet.dealersshort = DealersShort.find({"company": userSet.company.toUpperCase(), "isActive": true}).fetch();
                        } else {
                            if (this.props.isImporter == true) {
                                // can define roles for all dealers but not "ALL"
                                // console.log("dealer query 4 " + JSON.stringify({
                                //         "company": userSet.company.toUpperCase(),
                                //         dealer: {$ne: "ALL"}
                                //     }));
                                userSet.dealersshort = DealersShort.find({
                                    "company": userSet.company.toUpperCase(),
                                    dealer: {$ne: "ALL"},  "isActive": true
                                }).fetch();
                            } else {
                                // can only define roles for same dealer
                                // console.log("dealer query 5 " + JSON.stringify({
                                //         "company": userSet.company.toUpperCase(),
                                //         dealer: this.props.currentdealer}));
                                userSet.dealersshort = DealersShort.find({
                                    "company": userSet.company.toUpperCase(),
                                    dealer: this.props.currentdealer,  "isActive": true}).fetch();

                            }
                        }
                    }

                    if (userSet.dealer == "") {
                        userSet.dealer = userSet.dealersshort[0] ? userSet.dealersshort[0].dealer : "";
                        userSet.dealerCode = userSet.dealersshort[0] ? (userSet.dealersshort[0])["Dealer Code"] : "";
                    }
                    if (userSet.dealerCode == "") {
                        userSet.dealerCode = userSet.dealer && userSet.dealersshort[0] ? (userSet.dealersshort[0])["Dealer Code"] : "";
                    }
                }
                let disabledentry = this.state.disabledentry;
                let pdinodisabledentry = disabledentry || this.state.pdinodisabledentry || !userSet.pdiApproved;

                let paramsOK = this.checkParams(userSet);
                if (!paramsOK) {
                    console.log("Error in input!");
                }

                return (

                    <div className="container">

                        <form onSubmit={this.avoidReloadPage.bind(this)}>
                            <div className="row">
                                <div className="col s12 m12">
                                    <h1> Create Account: </h1>
                                    <div className="row">
                                        <div className="row">

                                            <div className='col m6 s6 input-field'>
                                                <select ref="role" id="Acc_Role"
                                                        onChange={this.handleRoleChange.bind(this)}
                                                        defaultValue={userSet.role}
                                                        required>
                                                    {
                                                        userSet.roles.map(function (ll) {
                                                            return <option key={ll.key}
                                                                           value={ll.role}>{ll.role}</option>;
                                                        })
                                                    }
                                                </select>
                                                <label className="active" htmlFor="Acc_Role">Role</label>
                                            </div>

                                            <div className='col m6 s6 input-field'>
                                                <select ref="company" id="Acc_Company"
                                                        onChange={this.handleCompanyChange.bind(this)}
                                                        defaultValue={userSet.company} required>
                                                    {
                                                        userSet.companies.map(function (ll) {
                                                            return <option key={ll.key}
                                                                           value={ll.company}>{ll.company}</option>;
                                                        })
                                                    }
                                                </select>
                                                <label className="active" htmlFor="Acc_Company">Company</label>
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className='col m6 s6 input-field'>
                                                <input ref="dealercode" id="Acc_DealerCode"
                                                       value={userSet.dealerCode} disabled="true"/>
                                                <label className="active" htmlFor="Acc_DealerCode">Dealer Code</label>
                                            </div>

                                            <div className='col m6 s6 input-field'>
                                                <select ref="dealer" id="Acc_Dealership"
                                                        onChange={this.handleDealerChange.bind(this)}
                                                        defaultValue={userSet.dealer} required>
                                                    {
                                                        userSet.dealersshort.map(function (ll) {
                                                            return <option key={ll.key}
                                                                           value={ll.dealer}>{ll.dealer}</option>;
                                                        })
                                                    }
                                                </select>
                                                <label className="active" htmlFor="Acc_Dealership">Dealership</label>
                                            </div>


                                        </div>

                                        <div className="row">
                                            <div className='col m12 s12 text-left'>
                                                <div className="row checkReactive">
                                                    <div className="col l3 m6 s6 input-field">
                                                        <input type="checkbox" id="pdiApproved" ref="pdiApproved"
                                                               name="pdiApproved"
                                                               checked={userSet.pdiApproved}
                                                               onChange={this.handlePdiChange.bind(this)}
                                                               disabled={this.state.disabledentry}/>
                                                        <label htmlFor="pdiApproved">PDI approved</label>
                                                    </div>
                                                    <div className="col l3 m6 s6 input-field">
                                                        <input type="text" id="pdiNo" ref="pdiNo"
                                                               name="pdiNo"
                                                               onChange={this.handlePdiNoChange.bind(this)}
                                                               defaultValue={userSet.pdiApprovedNo}required
                                                               disabled={this.state.disabledentry}/>

                                                        <label className="active" htmlFor="pidNo">PDI Code</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className='col m6 s6 input-field'>
                                                <input type="text" ref="userName" id="Acc_User_Name"
                                                       onChange={this.handleUserNameChange.bind(this)}
                                                       defaultValue={userSet.userName} required
                                                       disabled={this.state.disabledentry}/>
                                                <label className="active" htmlFor="Acc_User_Name">Enter Username</label>
                                            </div>
                                            <div className='col m6 s6 input-field'>
                                                <input type="text" ref="email" id="Acc_Email"
                                                       onChange={this.handleEmailChange.bind(this)}
                                                       defaultValue={userSet.email} required
                                                       disabled={this.state.disabledentry}/>
                                                <label className="active" htmlFor="Acc_Email">Email</label>
                                            </div>

                                            <div className='col m6 s6 input-field'>
                                                <input type="text" ref="firstName" id="Acc_First_Name"
                                                       onChange={this.handleFirstNameChange.bind(this)}
                                                       defaultValue={userSet.firstName} required
                                                       disabled={this.state.disabledentry}/>
                                                <label className="active" htmlFor="Acc_First_Name">First Name</label>
                                            </div>
                                            <div className='col m6 s6 input-field'>
                                                <input type="text" ref="lastName" id="Acc_Last_Name"
                                                       onChange={this.handleLastNameChange.bind(this)}
                                                       defaultValue={userSet.lastName} required
                                                       disabled={this.state.disabledentry}/>
                                                <label className="active" htmlFor="Acc_Last_Name">Last Name</label>
                                            </div>

                                            <div className='col m6 s6 input-field'>
                                                <input type="password" ref="password" id="Acc_Role"
                                                       onChange={this.handlePasswordChange.bind(this)}
                                                       defaultValue={userSet.password} required
                                                       disabled={this.state.disabledentry}/>
                                                <label className="active" htmlFor="Acc_Password">Password</label>
                                            </div>
                                            <div className='col m6 s6 input-field'>
                                                <input type="password" ref="password2" id="Acc_Role"
                                                       onChange={this.handlePassword2Change.bind(this)}
                                                       defaultValue={userSet.password2} required
                                                       disabled={this.state.disabledentry}/>
                                                <label className="active" htmlFor="Acc_Password2">Re-type
                                                    Password</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col right marginTop" name="submitButton" id="submitButton">

                                            <a className="waves-effect waves-light amber darken-2  btn-large"
                                               href="PdiHome"
                                               type="cancel"
                                               name="cancel" onClick={this.handleClose.bind(this)}>Close</a>

                                            <a className="btn waves-effect waves-light blue btn-large active" href="/"
                                               onClick={this.handleSubmit.bind(this)}
                                               disabled={this.state.disabledentry}>Submit</a>

                                        </div>
                                    </div>
                                    {this.state.submitalert}
                                </div>
                            </div>
                        </form>

                    </div>
                );

            }
        }
    }
}

CreateAccount.propTypes = {
    readyUser: React.PropTypes.bool.isRequired,
    currentusername: React.PropTypes.string.isRequired,
    currentcompany: React.PropTypes.string.isRequired,
    currentdealer: React.PropTypes.string.isRequired,
    currentrole: React.PropTypes.string.isRequired,
    isImporter: React.PropTypes.bool.isRequired,
    readyCompanies: React.PropTypes.bool.isRequired,
    readyDealersShort: React.PropTypes.bool.isRequired,
    readyRoles: React.PropTypes.bool.isRequired,

};

export default CreateAccountContainer = createContainer(({params}) => {


    //const userDataHandle = Meteor.subscribe('userdata');
    const rolesHandle = Meteor.subscribe('roles');
    const dealersshortHandle = Meteor.subscribe('dealersshort');
    const companiesHandle = Meteor.subscribe('companies');


    const {vin} = {params};
    let aUser = Meteor.user();

    let userReady = (!(typeof aUser === 'undefined'));
    let currentUserName = userReady
        ? (aUser == null ? "not logged in" : aUser.profile.first + " " + aUser.profile.last)
        : "user not ready";
    let currentCompany = userReady ? (aUser == null ? "" :
            aUser.profile.company.toUpperCase()) : "";
    let currentDealer = userReady ? (aUser == null ? "" :
            aUser.profile.dealer) : "";
    let currentRole = userReady ? (aUser == null ? "not loaded" :
            aUser.profile.role) : "not loaded";
    let isImporter = false;

    if (currentDealer && currentDealer.length > 0 && dealersshortHandle.ready() && currentDealer != "ALL") {
        let dealer = DealersShort.findOne({"dealer": currentDealer});
        console.log("dealer  " + JSON.stringify(dealer));
        isImporter = dealer && dealer.Importer && (dealer.Importer == 1) ? true : false;
        // console.log("isImporter SET " + isImporter);
    }

    return {
        readyUser: userReady,
        currentusername: currentUserName,
        currentcompany: currentCompany,
        currentdealer: currentDealer,
        currentrole: currentRole,
        isImporter: isImporter,
        readyCompanies: companiesHandle.ready(),
        readyDealersShort: dealersshortHandle.ready(),
        readyRoles: rolesHandle.ready(),
    };
}, CreateAccount);
