import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import classNames from 'classnames';
import PlzLogin from './PlzLogin.jsx';
import { Router, browserHistory } from 'react-router';


class Home extends Component {
    constructor(props) {
        super(props);
        Router.configureBodyParsers = function() {
            Router.onBeforeAction(Router.bodyParser.urlencoded({
                extended : true,
                limit : '200mb'
            }));
        };

    }

    componentWillMount() {
       // console.log("Home componentWillMount Router.configureBodyParsers " + Router.configureBodyParsers);

    }

    render() {
        if (!this.props.readyUser) {
            return <div id="loader"></div>
        } else {
            if (this.props.currentusername == "not logged in") {
                return (
                    <PlzLogin/>
                );
            } else {

                return (
                    <div className={classNames('Home')}>
                        <div className="container">
                            <div id="inspectionBox" className="row">
                                <div className="col s12 m4 valign-wrapper">
                                    <div className="col s12 m12 z-depth-1 center row">
                                        <a href="PdiHome">
                                            <i className="material-icons pdi-icon center valign">playlist_add_check</i>
                                            <div className="valign center-align font-26">PDI</div>
                                        </a>
                                    </div>
                                </div>
                                <div className="col s12 m4 valign-wrapper">
                                    <div className="col s12 m12 z-depth-1 center row">
                                        <a href="LSHome">
                                            <i className="material-icons long-storage-icon center valign">access_time</i>
                                            <div className="valign center-align font-26">Long Storage</div>
                                        </a>
                                    </div>
                                </div>
                                <div className="col s12 m4 valign-wrapper">
                                    <div className="col s12 m12 z-depth-1 center row">
                                        <a href="BodyHome">
                                            <i className="material-icons pdi-icon center valign">directions_car</i>
                                            <div className="valign center-align font-26">Body Inspection</div>
                                        </a>
                                    </div>
                                </div>
                                <div className="col s12 m4 valign-wrapper">
                                    <div className="col s12 m12 z-depth-1 center row">
                                        <a href="HPromise">
                                            <div data-icon="h" className="icon-size"></div>
                                            <div className="valign center-align font-26">H-Promise</div>
                                        </a>
                                    </div>
                                </div>
                                <div className="col s12 m4 valign-wrapper">
                                    <div className="col s12 m12 z-depth-1 center row">
                                        <a href="Overview">
                                            {/*<i className="material-icons history-icon center valign">assessment</i>*/}
                                            <i className="material-icons history-icon center valign">multiline_chart</i>
                                            <span className="valign center-align font-26"> <br/>Overview</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                );
            }
        }
    }

}


export default HomeContainer = createContainer(({params}) => {

    var aUser = Meteor.user();
    var userReady = (!(typeof aUser === 'undefined'));
    var currentUserName = userReady ? (aUser == null ? "not logged in" :
            ///*aUser.name*/
            "John Tester") : "user not ready";

    return {
        readyUser: userReady,
        currentusername: currentUserName
    };
}, Home);
