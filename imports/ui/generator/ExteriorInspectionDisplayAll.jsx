import React, {Component, PropTypes} from 'react';
import {MeteorCamera} from 'meteor/mdg:camera';

// ExteriorInspectionDisplay component - represents a exterior inspection with car graphics and photos
export default class ExteriorInspectionDisplayAll extends Component {

    constructor(props) {
        super(props);
        // console.log("ExteriorInspectionDisplay constructor " + JSON.stringify(this.props.quarter));

    };

    render() {

        return (
            <div className={"col m12 s12 offset-m"+this.props.offset+ " offset-m"+this.props.offset} onClick={() => this.props.onClickAll(this.props.carView)}>
                <a className="btn btn-small blue">{this.props.displayText}</a>
            </div>
        );
    }
}

ExteriorInspectionDisplayAll.propTypes = {
    carView: PropTypes.string.isRequired,
    displayText:PropTypes.string.isRequired,
    offset:PropTypes.string.isRequired,
    onClickAll: PropTypes.func.isRequired
};
