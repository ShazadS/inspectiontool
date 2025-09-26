import { Meteor } from 'meteor/meteor';

import React from 'react';
import { Router, browserHistory } from 'react-router';
import ReactDOM from 'react-dom';

import routes from '../../router/routes.js';
import MainLayout from '../../ui/containers/MainLayout.jsx';



const rootRoute = {
  component: MainLayout,
  childRoutes: routes,
};

Router.configureBodyParsers = function() {

    Router.onBeforeAction(Router.bodyParser.urlencoded({
        extended: true,
        limit: '500mb'
    }));
}

Meteor.startup(() => {
    // console.log("Meteor.startup Router.configureBodyParsers " + Router.configureBodyParsers);

    ReactDOM.render(

    <Router history={browserHistory} routes={rootRoute} />,
    document.getElementById('app')
  );
});
