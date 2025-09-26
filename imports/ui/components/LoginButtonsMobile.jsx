import React from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';

export default class LoginButtonsMobile extends React.Component {
  shouldComponentUpdate() {
    return true;
  }

  render() {
    return (
        <a className="navbar-btn pull-right panel-body"><b><Blaze id="lm" template="loginButtons"
               align={this.props.align} /></b></a>
    )
  }
}

LoginButtonsMobile.propTypes = {
  align: React.PropTypes.string
};

//Accounts.config({ forbidClientAccountCreation : true });

LoginButtonsMobile.defaultProps = {
  align: 'left'
};
