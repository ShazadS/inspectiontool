import React, {Component} from 'react';
// import Blaze from 'meteor/gadicc:blaze-react-component';

export default class PlzLogin extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Search">
                <div className="container">
                    <div className="row">
                        <div className="col s12 m12">
                            <h1> Please, sign in to continue  </h1>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

