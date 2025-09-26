import React, {Component, PropTypes} from 'react';
//import { Link } from 'react-router';
import LoginButtons from './LoginButtons.jsx';
import {createContainer} from 'meteor/react-meteor-data';


class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {"Header currentUser": Meteor.user()};
    }



    render() {
        // console.log("render ");
        if (!(this.props.readyUser)) {
            return <div id="loader"></div>
        } else {

            let sysAdmin = (this.props.currentrole == "Admin System");
            return (
                <header className="Header navbar-fixed">
                     <nav className="white" role="navigation">
                        <div className="nav-wrapper container">
                            <a id="logo-container" href="/" className="brand-logo"><img src="hyundai_logo.png" width="285" height="51"/></a>

                            <a href="#" data-activates="nav-mobile" className="button-collapse iconBlue"><i className="material-icons">menu</i></a>

                            <ul className="right">
                                <li><a href="/" className="hide-on-med-and-down">Home</a></li>
                                <li>
                                    <a href="#" className="hide-on-med-and-down">Menu</a>
                                    <ul>
                                        <li><a href="/PdiHome" className="hide-on-med-and-down">PDI</a></li>
                                        <li><a href="/LSHome" className="hide-on-med-and-down">Long Storage</a></li>
                                        <li><a href="/BodyHome" className="hide-on-med-and-down">Body Inspection</a></li>
                                        <li><a href="/HPromise" className="hide-on-med-and-down">H-Promise</a></li>
                                        <li><a href="/Overview" className="hide-on-med-and-down">Overview</a></li>
                                    </ul>
                                </li>
                                <li><a href="#" className="hide-on-med-and-down">Admin
                                    </a>
                                    {sysAdmin ?
                                        <ul>
                                            <li><a href="CreateAccount">Create Account</a></li>
                                            {/*<li><a href="ListAccounts">List Accounts</a></li>*/}
                                            <li><a href="ListUpdateAccounts">Update Accounts</a></li>
                                            <li><a href="ListUpdateModelNames">Add/Update Models</a></li>
                                            <li><a href="ListUpdateDealerCodes"> Add/Update Dealer</a></li>
                                            <li><a href="LoadCsvFile">Upload CSV-file</a></li>
                                        </ul>

                                        :

                                        <ul>
                                            <li><a href="CreateAccount">Create Account</a></li>
                                            {/*<li><a href="ListAccounts">List Accounts</a></li>*/}
                                            <li><a href="ListUpdateAccounts">Update Accounts</a></li>
                                            <li><a href="LoadCsvFile">Upload CSV-file</a></li>
                                        </ul>
                                    }
                                    {/*<li><a href="History">History</a></li>*/}
                                            {/*<li><a href="Checklist?vin=TESTPDI&type=PDI&version=Vers.1.0">Test PDI</a></li>*/}
                                            {/*<li><a href="Checklist?vin=TESTPDICOMM2&type=PDI-Commercial&version=Vers.1.0">Test PDI-Commercial</a></li>*/}
                                            {/*<li><a href="Checklist?vin=TESTPDIGEN&type=PDI-Genesis&version=Vers.1.0">Test PDI-Genesis</a></li>*/}
                                            {/*<li><a href="Checklist?vin=TESTPDIIONIQ&type=PDI-IONIQ&version=Vers.1.0">Test PDI-IONIQ</a></li>*/}
                                            {/*<li><a href="Checklist?vin=TESTPDI&type=H-Promise&version=Vers.0.1">Test H-Promise</a></li>*/}
                                            {/*<li><a href="AgedCheckList">Test AGE-7 Days</a></li>*/}

                                </li>
                                <LoginButtons />
                            </ul>
                            <ul id="nav-mobile" className="side-nav">
                                <li><a href="/">Home</a></li>
                                <li><a href="#">Admin</a>
                                    <ul>
                                        <li><a href="CreateAccount">Create Account</a></li>
                                        {/*<li><a href="ListAccounts">List Accounts</a></li>*/}
                                        <li><a href="ListUpdateAccounts">Update Accounts</a></li>
                                        {/*<li><a href="History">History</a></li>*/}
                                        {/*<li><a href="Checklist?vin=TESTPDI&type=PDI&version=Vers.1.0">Test PDI</a></li>*/}
                                        {/*/!*<li><a href="Checklist?vin=TESTPDICOMM2&type=PDI-Commercial&version=Vers.1.0">Test PDI-Commercial</a></li>*!/*/}
                                        {/*<li><a href="Checklist?vin=TESTPDIGEN&type=PDI-Genesis&version=Vers.1.0">Test*/}
                                            {/*PDI-Genesis</a></li>*/}
                                        {/*<li><a href="Checklist?vin=TESTPDIIONIQ&type=PDI-IONIQ&version=Vers.1.0">Test PDI-IONIQ</a></li>*/}
                                        {/*<li><a href="AgedCheckList">Test AGE-7 Days</a></li>*/}
                                    </ul>
                                </li>
                            </ul>

                            { /* <a href="#" data-activates="nav-mobile" className="button-collapse iconBlue"><i
                                className="material-icons">menu</i></a> */ }
                        </div>
                    </nav>
                </header>
            );

        }
    }
}

Header.propTypes = {
    readyUser: React.PropTypes.bool.isRequired,
    currentuser: PropTypes.object.isRequired,
    currentrole: PropTypes.string.isRequired,
};

function userIsReady() {
    var aUser = Meteor.user();
    // console.log("user is ready? " + JSON.stringify(aUser));
    return (!(typeof aUser === 'undefined'));
}

export default HeaderContainer = createContainer(({params}) => {

    var aUser = Meteor.user();
    var userReady = (!(typeof aUser === 'undefined'));

    var currentRole = userReady ? (aUser == null ? "" : aUser.profile.role) : "";

    return {
        readyUser: userReady,
        currentuser: aUser ? aUser : {},
        currentrole: currentRole
    };
}, Header);
// export default Header;