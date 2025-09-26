import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Router} from 'react-router';

export default class LoginButtons extends React.Component {
  shouldComponentUpdate() {
    return true;
  }

  render() {

      // console.log("LoginButtons render Router.configureBodyParsers " + Router.configureBodyParsers);



      return <Blaze template="loginButtons" align={this.props.align} />
  }
}

LoginButtons.propTypes = {
  align: React.PropTypes.string
};

Accounts.config({forbidClientAccountCreation: true});
Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL', // 'USERNAME_AND_EMAIL',
});
 console.log("Accounts.ui.config");

LoginButtons.defaultProps = {
  align: 'right'
};
