import {Meteor} from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
// import Griddle from 'griddle-react';
import {createContainer} from 'meteor/react-meteor-data';
import {ChecklistValues} from '../../api/checklistvalues.js';
import Search from '../components/Search.jsx';
import PlzLogin from './PlzLogin.jsx';

class PdiHome extends Component {

    constructor(props) {
        super(props);
    }

    render() {
      //  if(!(this.props.ready && this.props.readyUser)){

        if(!(this.props.readyUser)){
            return <div id="loader"></div>
        } else {
            var currentUser = Meteor.user();
            if (currentUser == null) {
                return (
                    <PlzLogin/>
                );
            } else {
                return (
                    <SearchForPdfPrint currentuser={this.props.currentuser}/>
                );
            }
        }
    }
}

PdiHome.propTypes = {
  //  ready: React.PropTypes.bool.isRequired,
    readyUser: React.PropTypes.bool.isRequired,
    currentUser: PropTypes.object
};

function userIsReady() {
    var aUser = Meteor.user();
    // console.log("user is ready? " + JSON.stringify(aUser));
    return (!(typeof aUser === 'undefined'));
}

export default PdiHomeContainer = createContainer(() => {
    const checklistvaluesHandle = Meteor.subscribe('checklistvalues');

    return {
       // ready: checklistvaluesHandle.ready(),
        readyUser: userIsReady(),
        // todo user access
        currentuser: Meteor.user()
    };
}, PdiHome);




