import React, {Component, PropTypes} from 'react';
import {MeteorCamera} from 'meteor/mdg:camera';

// ExteriorInspectionDisplay component - represents a exterior inspection with car graphics and photos
export default class ExteriorInspectionDisplay extends Component {

    constructor(props) {
        super(props);
        // console.log("ExteriorInspectionDisplay constructor " + JSON.stringify(this.props.quarter));

    };

    render() {
        //console.log("ExteriorInspectionDisplay render " + JSON.stringify(this.props.positionClass));
        return (

            <div className={"col m6 s6 "+ this.props.positionClass} onClick={() => this.props.onClickBody(this.props.carView, this.props.topOrButtom, this.props.leftOrRight)}>
                <a className="cursorHand" style={this.props.quartervalues.writingOnGraphicStyle}>
                    <div className="row">
                        <div className="col m12 center-align">
                            {this.props.quartervalues.commentValue}
                        </div>
                        <div className="col m12 center-align">
                            {this.props.quartervalues.status && this.props.quartervalues.status.length > 0 ? this.props.quartervalues.status : "Please click and set status."}
                        </div>
                        <div className="col m12 center-align">
                            {this.props.quartervalues.photoTaken}
                        </div>
                    </div>
                </a>
            </div>
        );
    }
}

ExteriorInspectionDisplay.propTypes = {
    quartervalues: PropTypes.object.isRequired,
    carView: PropTypes.string.isRequired,
    topOrButtom: PropTypes.string.isRequired,
    leftOrRight: PropTypes.string.isRequired,
    positionClass: PropTypes.string.isRequired,
    onClickBody: PropTypes.func.isRequired
};
