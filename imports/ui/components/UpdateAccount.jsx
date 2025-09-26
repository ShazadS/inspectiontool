import React, {Component, PropTypes} from 'react';
import Griddle from 'griddle-react';
import SweetAlert from 'react-bootstrap-sweetalert';

class UpdateAccount extends Component {

    constructor(props) {
        super(props);
        // console.log("constructor " + JSON.stringify(this.props.status));
        this.state = {
            disabledentry: false,
            selectedFromGriddle: false,
            usrSubset: {},
            numRecordsFound: "0",
            usr_id: "",
            usrs: [],
            roles: props.roles,
            companies: props.companies,
            dealersshort: props.dealersshort
        };
    }

    avoidReloadPage(event) {
        event.preventDefault();
        // console.log("avoidReloadPage ");
        return false;
    }

    loadUsers() { // only load once
        // console.log("loadUsers");
        let that = this;
        Meteor.call('users.listusers', this.props.currentcompany, this.props.currentdealer, function (err, res) {
            let usrs = [];
            let numRecordsFound = res.length;
            if (err) {
                console.log("Error when reading user account data: " + err.message);

            } else {
                res.forEach(function (line) {
                    // console.log("loadUsers line " + JSON.stringify(line));
                    // columns={["User Name", "Role", "Company", "Dealer",
                    //     "Dealer Code", "PDI Approved", "PDI No", "First", "Last"]}
                    let rline = {
                        "User Name": line.username,
                        "Email": line.emails && line.emails[0] ? line.emails[0].address : "",
                        "Role": line.profile.role,
                        "Company": line.profile.company,
                        "Dealer": line.profile.dealer,
                        "Dealer Code": line.profile.dealercode,
                        "PDI Approved": "" + line.profile.pdiApproved,
                        "PDI No": line.profile.pdiNo,
                        "First": line.profile.first,
                        "Last": line.profile.last,
                        "Active": line.profile.isActive ? line.profile.isActive : true,
                        "password": "not changed atall",
                        "password2": "not changed atall",
                        "_id": line._id
                    };
                    usrs.push(rline);
                });
                // console.log("componentWillMount " + JSON.stringify(that.props.roles));
            }
            that.setState({
                // disabledentry: false,
                selectedFromGriddle: false,
                usrs: usrs,
                usrSubset: {},
                numRecordsFound: "" + numRecordsFound,
                usr_id: "",
                roles: that.state.roles && that.state.roles.length > 0 ? that.state.roles : that.props.roles,
                companies: that.state.companies && that.state.companies.length > 0 ? that.state.companies : that.props.companies,
                dealersshort: that.state.dealersshort && that.state.dealersshort.length > 0 ? that.state.dealersshort : that.props.dealersshort
            });
            // console.log("componentWillMount " + JSON.stringify(res));
        });
    }

    componentWillMount() { // only called one time
        this.loadUsers();
    }

    handleUserNameChange(event) {
        // var text = event.target.value;
    };

    handleFirstNameChange(event) {
        // var text = event.target.value;

    };

    handleLastNameChange(event) {
        // var text = event.target.value;
    };

    handleEmailChange(event) {
        // var text = event.target.value;
    };

    handleRoleChange(event) {
        event.preventDefault();

        // console.log("handleRoleChange");

        let newRole = event.target.value;
        let newCompanies = this.state.companies;
        let newDealersshort = this.state.dealersshort;
        let newCompany = this.state.usrSubset.company;
        let newDealer = this.state.usrSubset.dealer;
        let newDealercode = this.state.usrSubset.dealercode;
        let newPdiApproved = newRole.localeCompare("Admin Dealer") == 0 ? false : this.state.pdiApproved;

        if (newRole.localeCompare(this.state.usrSubset.role) != 0) {
            // set companies
            if (newRole.localeCompare("Admin System") == 0) {
                // take every company from props
                newCompanies = this.props.companies;
            } else {
                if (this.state.role.localeCompare("Admin System") == 0) {
                    // avoid ALL
                    newCompanies = [];
                    this.props.companies.forEach(function (company) {
                        if (company.company.localeCompare("ALL") != 0) {
                            newCompanies.push(company);
                        }
                    });
                    if (this.state.usrSubset.company.localeCompare("ALL") == 0) {
                        newCompany = newCompanies && newCompanies[0] ? newCompanies[0] : {};
                    }
                }
            }

            //set dealers
            if (newRole.localeCompare("Admin System") == 0) {
                // take every company from props
                newDealersshort = this.props.dealersshort;
            } else {
                if (this.state.usrSubset.role.localeCompare("Admin System") == 0) {
                    // avoid ALL
                    newDealers = [];
                    this.props.dealersshort.forEach(function (dd) {
                        if (dd.dealer.localeCompare("ALL") != 0) {
                            newDealers.push(dd);
                        }
                    });
                    if (this.state.usrSubset.dealer.localeCompare("ALL") == 0) {
                        newDealer = newDealers && newDealers[0] ? newDealers[0].dealer : "";
                        newDealercode = newDealers && newDealers[0] && newDealers[0]["Dealer Code"] ? newDealers[0]["Dealer Code"] : "";
                    }
                }
            }

            this.setState({
                "companies": companies,
                "dealersshort": dealersshort,
                "usrSubset": {
                    role: newRole,
                    company: newCompany,
                    dealer: newDealer,
                    dealercode: newDealercode,
                    pdiApproved: newPdiApproved,
                    pdiApprovedNo: this.state.usrSubset.pdiApprovedNo
                }
            });
        }
    };

    handleCompanyChange(event) {
        // console.log("handleCompanyChange");
        let newCompany = event.target.value;
        let newDealersShort = this.state.dealersshort;
        let newDealer = this.state.usrSubset.dealer;
        let newDealercode = this.state.usrSubset.dealercode;
        if (newCompany.localeCompare(this.state.usrSubset.company) != 0) {
            if (newCompany != "ALL") {
                newDealersShort = [];
                this.props.dealers.forEach(function (dd) {
                    if (dd.company.localeCompare(newCompany) == 0) {
                        newDealersShort.push(dd);
                    }
                });
                newDealer = newDealersShort && newDealersShort[0] ? newDealersShort[0].dealer : "";
                newDealercode = newDealersShort && newDealersShort[0] && newDealersShort[0]["Dealer Code"] ? newDealersShort[0]["Dealer Code"] : "";

            } else {
                newDealersShort = this.props.dealersshort;
                newDealer = newDealersShort && newDealersShort[0] ? newDealersShort[0].dealer : "";
                newDealercode = newDealersShort && newDealersShort[0] && newDealersShort[0]["Dealer Code"] ? newDealersShort[0]["Dealer Code"] : "";
            }
            this.setState({
                "companies": companies,
                "dealersshort": dealersshort,
                "usrSubset": {
                    role: this.state.usrSubset.role,
                    company: newCompany,
                    dealer: newDealer,
                    dealercode: newDealercode,
                    pdiApproved: this.state.usrSubset.pdiApproved,
                    pdiApprovedNo: this.state.usrSubset.pdiApprovedNo
                }
            });
        }
        // console.log("dealersshort " + JSON.stringify(newusrSubset.dealersshort));
        // console.log("deacode " + JSON.stringify(newusrSubset.dealercode));
    };

    handleDealerChange(event) {
        // console.log("handleDealerChange");
        let newDealer = event.target.value;
        let newUsrSubset = this.state.usrSubset;
        // dealer has changed get new code
        if (newDealer.localeCompare(newUsrSubset.dealer) != 0) {
            this.state.dealersshort.forEach(function (dd) {
                if (dd.dealer.localeCompare(newDealer) == 0) {
                    newUsrSubset.dealercode = dd["Dealer Code"];
                }
            });
            newUsrSubset.dealer = newDealer;

            this.setState({
                "usrSubset": newUsrSubset
            });
            // console.log("handleDealerChange " + JSON.stringify(newUsrSubset))
        }
    };

    handlePdiChange(event) {
        event.preventDefault();
        let newUsrSubset = this.state.usrSubset;
        newUsrSubset.pdiApproved = !this.state.usrSubset.pdiApproved;
        setTimeout(() => this.setState({
            "usrSubset": newUsrSubset
        }));
    };

    handlePdiNoChange(event) {
        event.preventDefault();
        var text = event.target.value;

        // console.log("handleSearchPending " + JSON.stringify(_.keys(event.target.checked)));
        setTimeout(() => this.setState({
            "usrSubset.pdiApprovedNo": text
        }));
    };

    handlePasswordChange(event) {
        event.preventDefault();
        let newUsrSubset = this.state.usrSubset;
        newUsrSubset.password = event.target.value;
        setTimeout(() => this.setState({
            "usrSubset": newUsrSubset
        }));
    };

    handlePassword2Change(event) {
        event.preventDefault();
        let newUsrSubset = this.state.usrSubset;
        newUsrSubset.password2 = event.target.value;
        setTimeout(() => this.setState({
            "usrSubset": newUsrSubset
        }));
    };

    handleIsActiveChange(event) {
            event.preventDefault();
            let newUsrSubset = this.state.usrSubset;
            newUsrSubset.isActive = !this.state.usrSubset.isActive;
            setTimeout(() => this.setState({
                "usrSubset": newUsrSubset
            }));
    };

    avoidReloadPage(event) {
        event.preventDefault();
        // console.log("avoidReloadPage ");
        return false;
    }

    doNothing() {
        console.log("doNothing ");
        this.setState({submitalert: null});
    }

    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    validateUpdatedAccountData(input) {
        // debugger;
        console.log("validateUpdatedAccountData ");
        if (input.profile.role == "Admin System" && !(input.profile.company == "ALL")) {
            this.setState({
                submitalert: <SweetAlert
                    custom
                    confirmBtnText="Close"
                    confirmBtnBsStyle="primary"
                    title="Must be company='ALL'"
                    onConfirm={this.doNothing.bind(this)}>
                    Please set value to 'ALL' or change role.
                </SweetAlert>,

            });
            return false;
        }
        if (input.profile.role == "Admin System" && !(input.profile.pdiApproved)) {
            this.setState({
                submitalert: <SweetAlert
                    custom
                    confirmBtnText="Close"
                    confirmBtnBsStyle="primary"
                    title="Must be PDI aproved"
                    onConfirm={this.doNothing.bind(this)}>
                    Please set value to PDI approved or change role.
                </SweetAlert>,

                pdiApproved: true,
                company: "ALL"
            });
            return false;
        }
        if (input.profile.role == "Admin Dealer" && (input.profile.company == "ALL" || input.profile.pdiApproved)) {
            this.setState({
                submitalert: <SweetAlert
                    custom
                    confirmBtnText="Close"
                    confirmBtnBsStyle="primary"
                    title="Admin Dealer CANNOT be PDI approved"
                    onConfirm={this.doNothing.bind(this)}>
                    Please set value to NOT PDI approved or change role.
                </SweetAlert>,

                pdiApproved: false,
                company: this.props.currentcompany
            });
            return false;
        }

        // if (input.profile.pdiApproved && (!input.profile.pdiNo || (input.profile.pdiNo && input.profile.pdiNo.length == 0))) {
        //     this.setState({
        //         submitalert: <SweetAlert
        //             custom
        //             confirmBtnText="Close"
        //             confirmBtnBsStyle="primary"
        //             title="If PDI approved - needs PDI Code"
        //             onConfirm={this.doNothing.bind(this)}>
        //
        //             Please enter PDI Code.
        //         </SweetAlert>,
        //         pdiApproved: false,
        //         company: this.props.currentcompany
        //     });
        // }
        if (!input.username || input.username.length == 0) {
            this.setState({
                submitalert: <SweetAlert
                    custom
                    confirmBtnText="Close"
                    confirmBtnBsStyle="primary"
                    title="Username missing"
                    onConfirm={this.doNothing.bind(this)}>
                    Please enter a Username.
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
                            Please enter valid email.
                        </SweetAlert>
                    });
                    return false;
                } else {
                    if (input.password != input.password2) {
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
                    Username of Hyundai Technician must <br/> be (Dealer Code)(PDI code)
                </SweetAlert>
            });
            return false;
        }
        return true;
    }

    doUpdateUser() {
        let isUpdated = false;
        let newUser = {
            username: this.refs.userName.value,
            // password: "stays same",
            email: this.refs.email.value,
            profile: {
                "first": this.refs.firstName.value,
                "last": this.refs.lastName.value,
                "company": this.refs.company.value,
                "dealer": this.refs.dealer.value,
                "dealercode": this.refs.dealercode.value ? this.refs.dealercode.value : "",
                "role": this.refs.role.value,
                "pdiApproved": this.refs.pdiApproved.checked,
                "pdiNo": this.refs.pdiNo.value,
                "isActive": this.refs.isActive.checked,
            },
            "password": this.refs.password.value,
            "password2": this.refs.password2.value
        };
        // console.log("new user " + JSON.stringify(newUser.profile));
        if (this.validateUpdatedAccountData(newUser)) {

            var that = this;
            Meteor.call("userdata.userUpdate", this.state.usr_id, newUser, function testError(err) {
                    if (err) {
                        console.log("Error " + err.message);
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
                        isUpdated = true;
                        // console.log("no error");
                        that.setState({
                            isUpdated: true,
                            submitalert: <SweetAlert
                                custom
                                confirmBtnText="Continue"
                                confirmBtnBsStyle="primary"
                                title="User Account Updated"
                                onConfirm={that.doNothing.bind(that)}>
                                Press Continue to return to account list.
                            </SweetAlert>
                        });
                    }
                });
        } else {
            return false;
        }
      return isUpdated;
    }

    handleSave(event) {
        // console.log("handle submit props.status " + this.props.status);
        event.preventDefault();
        if (!(this.props.currentrole == "Admin Dealer" || this.props.currentrole == "Admin System" || this.props.currentrole == "Service Manager")) {
            this.setState({
                submitalert: <SweetAlert
                    custom
                    confirmBtnText="Close"
                    confirmBtnBsStyle="primary"
                    title="No Access for User Update"
                    onConfirm={this.doNothing.bind(this)}>
                    Your role needs to be Admin Dealer, Admin System or Service Manager.
                </SweetAlert>
            });
            return false;
        }
        let isUpdated = this.doUpdateUser();
        console.log("handleSave " + isUpdated);
        if (isUpdated) {
            this.loadUsers();
        }
        // let newUsrSubset = this.state.usrSubset;
        // newUsrSubset.password = "";
        // newUsrSubset.password2 = "";
        // this.setState({"usrSubset": newUsrSubset});
    }

    handleCancel(event) {
        event.preventDefault();
        this.loadUsers();
        return true;
    }

    checkParams(set) {
        if ((set.role == "Admin System" && !(set.pdiApproved && set.dealer == "ALL")) || this.state.initializeSystem) {
            console.log("Error: role:" + set.role + " pdiApproved:" + set.pdiApproved + " dealer:" + set.dealer);
            return false;
        }
        return true;
    }

    selectUserFromGriddle(gridRow) {
        console.log("selectUserFromGriddle row  " + JSON.stringify(gridRow.props.data));
        let numRecordsFound = 1;
        console.log("selectUserFromGriddle " + JSON.stringify(gridRow.props.data));

        let newUsrSubset = {
            "username": gridRow.props.data["User Name"],
            "email": gridRow.props.data["Email"],
            "role": gridRow.props.data["Role"],
            "company": gridRow.props.data["Company"],
            "dealer": gridRow.props.data["Dealer"],
            "dealercode": gridRow.props.data["Dealer Code"],
            "pdiApproved": gridRow.props.data["PDI Approved"],
            "pdiNo": gridRow.props.data["PDI No"],
            "first": gridRow.props.data["First"],
            "last":gridRow.props.data["Last"],
            "isActive": gridRow.props.data["Active"],
            "password": gridRow.props.data["password"],
            "password2": gridRow.props.data["password2"]
        };

        console.log("selectUserFromGriddle " + JSON.stringify(newUsrSubset));
        let usr_id = gridRow.props.data._id;
        let usrs = [newUsrSubset];
        this.setState({
            "selectedFromGriddle": true,
            "usrs": usrs,
            "usrSubset": newUsrSubset,
            "usr_id": usr_id,
            "numRecordsFound": "" + numRecordsFound,
            "selectedRowId": gridRow.props.data.id
        });

    }

    render() {
        // console.log("UpdateAccount render ");
        // console.log("UpdateAccount render dealershort " + JSON.stringify(this.props.dealersshort));

        if (!(this.props.ready)) {
            return <div id="loader"></div>
        } else {

            let roleOptions = [];
            // console.log("UpdateAccount render roles PROPS" + JSON.stringify(this.props.roles));
            // console.log("UpdateAccount render roles STATE" + JSON.stringify(this.state.roles));
            let kk = 1;
            let that = this;
            if (!this.state.roles || this.state.roles.length == 0) {
                roleOptions.push({"value": this.state.usrSubset.role, "selected": this.state.usrSubset.role, "key": "1"});
            } else {
                this.state.roles.forEach(function (rr) {
                    let selected = rr.role.localeCompare(that.state.usrSubset.role) == 0 ? "selected" : "";
                    roleOptions.push({"value": rr.role, "selected": selected, "key": "" + kk});
                    kk++;
                });
            }

            let usrSubset = this.state.usrSubset;

            const rowMetadata = {
                bodyCssClassName: rowData => (rowData.id === this.state.selectedRowId ? 'selected' : ''),
            };
            // console.log("usrSubset.role " + usrSubset.role);
            if (usrSubset.role && (this.state.selectedFromGriddle)) {
                return (
                    <div className="Search">
                        <div className="container">
                            {/*<div className="row">*/}
                                {/*<form onSubmit={this.avoidReloadPage.bind(this)}>*/}

                                    {/*<div className="col m12 s12 input-field">*/}
                                        {/*<span className="grey-text text-lighten-1"><i>(Search all columns or click column header to search in one column only) </i> </span>*/}

                                        {/*<Griddle results={this.state.usrs} tableClassName="table bordered"*/}
                                                 {/*showFilter={true} resultsPerPage={5} enableInfiniteScroll={false}*/}
                                                 {/*useFixedHeader={true}*/}
                                                 {/*bodyHeight={495}*/}
                                                 {/*showSettings={false} showPager={true}*/}
                                                 {/*columns={["username", "role", "company", "dealer",*/}
                                                     {/*"dealercode", "pdiApproved", "pdiNo", "first", "last"]}*/}
                                                 {/*rowMetadata={rowMetadata}*/}
                                                 {/*onRowClick={this.selectUserFromGriddle.bind(this)}/>*/}
                                    {/*</div>*/}
                                {/*</form>*/}
                            {/*</div>*/}


                            <form onSubmit={this.avoidReloadPage.bind(this)}>
                                <div className="row">
                                    <div className="col s12 m12">
                                        <h1> Update Account: </h1>
                                        <div className="row">
                                            <div className="row">

                                                <div className='col m6 s6 input-field'>

                                                    {/*<Select className='col m6 s6 input-field' ref="role" id="Acc_Role"  name="Acc_Role"*/}
                                                        {/*value={usrSubset.role}*/}
                                                        {/*options={roleOptions}*/}
                                                        {/*onChange={this.handleRoleChange.bind(this)}*/}
                                                        {/*/>*/}


                                                    <select ref="role" id="Acc_Role"
                                                            onChange={this.handleRoleChange.bind(this)}
                                                            defaultValue={usrSubset.role}
                                                            required>
                                                        {
                                                            roleOptions.map(function (ll) {
                                                                return <option key={ll.key}
                                                                               value={ll.value} >{ll.value}</option>
                                                            })
                                                        }
                                                    </select>
                                                    <label className="active" htmlFor="Acc_Role">Role</label>
                                                </div>

                                                <div className='col m6 s6 input-field'>
                                                    <select ref="company" id="Acc_Company"
                                                            onChange={this.handleCompanyChange.bind(this)}
                                                            defaultValue={usrSubset.company} required>
                                                        {
                                                            this.props.companies.map(function (ll) {
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
                                                    <input ref="dealercode" id="Acc_Dealercode"
                                                           value={usrSubset.dealercode} disabled="true"/>
                                                    <label className="active" htmlFor="Acc_Dealercode">Dealer Code</label>
                                                </div>

                                                <div className='col m6 s6 input-field'>
                                                    <select ref="dealer" id="Acc_Dealership"
                                                            onChange={this.handleDealerChange.bind(this)}
                                                            defaultValue={usrSubset.dealer} required>
                                                        {
                                                            this.props.dealersshort.map(function (ll) {
                                                                return <option key={ll.key}
                                                                               value={ll.dealer}>{ll.dealer}</option>;
                                                            })
                                                        }
                                                    </select>
                                                    <label className="active"
                                                           htmlFor="Acc_Dealership">Dealership</label>
                                                </div>


                                            </div>

                                            <div className="row">
                                                <div className='col m12 s12 text-left'>
                                                    <div className="row checkReactive">
                                                        <div className="col l3 m6 s6 input-field">
                                                            <input type="checkbox" id="pdiApproved" ref="pdiApproved"
                                                                   name="pdiApproved"
                                                                   checked={usrSubset.pdiApproved}
                                                                   onChange={this.handlePdiChange.bind(this)}
                                                                   disabled={this.state.disabledentry}/>
                                                            <label htmlFor="pdiApproved">PDI approved</label>
                                                        </div>
                                                        <div className="col l3 m6 s6 input-field">
                                                            <input type="text" id="pdiNo" ref="pdiNo"
                                                                   name="pdiNo"
                                                                   onChange={this.handlePdiNoChange.bind(this)}
                                                                   defaultValue={usrSubset.pdiNo} required
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

                                                           defaultValue={usrSubset.username} required
                                                           disabled={this.state.disabledentry}/>
                                                    <label className="active" htmlFor="Acc_User_Name">Enter
                                                        Username</label>
                                                </div>
                                                <div className='col m6 s6 input-field'>
                                                    <input type="text" ref="email" id="Acc_Email"
                                                           onChange={this.handleEmailChange.bind(this)}
                                                           defaultValue={usrSubset.email} required
                                                           disabled={this.state.disabledentry}/>
                                                    <label className="active" htmlFor="Acc_Email">Email</label>
                                                </div>

                                                <div className='col m6 s6 input-field'>
                                                    <input type="text" ref="firstName" id="Acc_First_Name"
                                                           onChange={this.handleFirstNameChange.bind(this)}
                                                           defaultValue={usrSubset.first} required
                                                           disabled={this.state.disabledentry}/>
                                                    <label className="active" htmlFor="Acc_First_Name">First
                                                        Name</label>
                                                </div>
                                                <div className='col m6 s6 input-field'>
                                                    <input type="text" ref="lastName" id="Acc_Last_Name"
                                                           onChange={this.handleLastNameChange.bind(this)}
                                                           defaultValue={usrSubset.last} required
                                                           disabled={this.state.disabledentry}/>
                                                    <label className="active" htmlFor="Acc_Last_Name">Last Name</label>
                                                </div>

                                                <div className='col m6 s6 input-field'>
                                                    <input type="password" ref="password" id="Acc_Password"
                                                           onChange={this.handlePasswordChange.bind(this)}
                                                           defaultValue={usrSubset.password} required
                                                           disabled={this.state.disabledentry}/>
                                                    <label className="active" htmlFor="Acc_Password">Password</label>
                                                </div>
                                                <div className='col m6 s6 input-field'>
                                                    <input type="password" ref="password2" id="Acc_Password2"
                                                           onChange={this.handlePassword2Change.bind(this)}
                                                           defaultValue={usrSubset.password2} required
                                                           disabled={this.state.disabledentry}/>
                                                    <label className="active" htmlFor="Acc_Password2">Re-type
                                                        Password</label>
                                                </div>

                                                <div className='col m6 s6 input-field'>
                                                    <input type="checkbox" ref="isActive" id="Acc_IsActive"
                                                           name="Acc_IsActive"
                                                           checked={usrSubset.isActive}
                                                           onChange={this.handleIsActiveChange.bind(this)}
                                                           disabled={this.state.disabledentry}/>
                                                    <label htmlFor="Acc_IsActive">Active User</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col right marginTop" name="submitButton" id="submitButton">

                                                <a className="waves-effect waves-light amber darken-2  btn-large"
                                                   href="/"
                                                   type="cancel"
                                                   name="cancel" onClick={this.handleCancel.bind(this)}>Cancel</a>

                                                <a className="btn waves-effect waves-light blue btn-large active"
                                                   href="/"
                                                   onClick={this.handleSave.bind(this)}
                                                   disabled={this.state.disabledentry}>Save</a>

                                            </div>
                                        </div>
                                        {this.state.submitalert}
                                    </div>
                                </div>
                            </form>

                        </div>

                    </div>
                )
            } else {
                return (
                    <div className="Search">
                        <div className="container">
                            <div className="row">
                                <form onSubmit={this.avoidReloadPage.bind(this)}>

                                    <div className="col m12 s12 input-field">
                                        <span className="grey-text text-lighten-1"><i>(Search all columns or click column header to search in one column only) </i> </span>

                                        <Griddle results={this.state.usrs} tableClassName="table bordered"
                                                 showFilter={true} resultsPerPage={10} enableInfiniteScroll={false}
                                                 useFixedHeader={true}
                                                 bodyHeight={495}
                                                 showSettings={false} showPager={true}
                                                 columns={["User Name", "Role", "Company", "Dealer",
                                                     "Dealer Code", "PDI Approved", "PDI No", "First", "Last"]}
                                                 rowMetadata={rowMetadata}
                                                 onRowClick={this.selectUserFromGriddle.bind(this)}/>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        }
    }
}


UpdateAccount.propTypes = {
    currentusername: React.PropTypes.string,
    currentcompany: React.PropTypes.string,
    currentdealer: React.PropTypes.string,
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool,
    ready: React.PropTypes.bool.isRequired,
    roles: React.PropTypes.array.isRequired,
    companies: React.PropTypes.array.isRequired,
    dealersshort: React.PropTypes.array.isRequired
};


export default UpdateAccount;

