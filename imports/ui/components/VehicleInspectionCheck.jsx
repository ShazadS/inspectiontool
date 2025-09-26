import React from 'react';
import { Link } from 'react-router';

import VehicleInfo from './VehicleInfo.jsx';

//import LoginButtons from './LoginButtons.jsx';

export default class VehicleInspectionCheck extends React.Component {
    render() {
        return (
            <div className="vehicleInspectionCheck">
                <form>



                    <VehicleInfo />






                    <div className="row">
                        <h4 className="header">Engine</h4>
                        <div className="row col s12 m4">
                            <input type="checkbox" className="filled-in" id="oil-level" />
                            <label htmlFor="oil-level">Oil Level</label>
                        </div>
                        <div className="row col s12 m4">
                            <input type="checkbox" className="filled-in" id="smoke-and-fume" />
                            <label htmlFor="smoke-and-fume">Smoke &amp; Fumes</label>
                        </div>
                        <div className="row col s12 m4">
                            <input type="checkbox" className="filled-in" id="performance" />
                            <label htmlFor="performance">Performance</label>
                        </div>
                    </div>




                    <div className="row">
                        <h4 className="header">Transmission</h4>
                        <div className="row col s12 m4">
                            <input type="checkbox" className="filled-in" id="operation" />
                            <label htmlFor="operation">Operation</label>
                        </div>
                        <div className="row col s12 m4">
                            <input type="checkbox" className="filled-in" id="noise" />
                            <label htmlFor="noise">Noise</label>
                        </div>
                        <div className="row col s12 m4">
                            <input type="checkbox" className="filled-in" id="clutch" />
                            <label htmlFor="clutch">Clutch</label>
                        </div>
                        <div className="row col s12 m4">
                            <input type="checkbox" className="filled-in" id="cv-joint" />
                            <label htmlFor="cv-joint">CV Joints</label>
                        </div>
                        <div className="row col s12 m4">
                            <input type="checkbox" className="filled-in" id="wheel-bearings" />
                            <label htmlFor="wheel-bearings">Wheel Bearings</label>
                        </div>
                    </div>





                    <div className="row">
                        <h4 className="header">Tyres</h4>
                        <div className="row input-field col s12 m3">
                            <input value="" type="text" />
                            <label htmlFor="">Left Front</label>
                        </div>
                        <div className="row input-field col s12 m3">
                            <input value="" type="text" />
                            <label htmlFor="">Right Front</label>
                        </div>
                        <div className="row input-field col s12 m3">
                            <input value="" type="text" />
                            <label htmlFor="">Left Rear</label>
                        </div>
                        <div className="row input-field col s12 m3">
                            <input value="" type="text" />
                            <label htmlFor="">Right Rear</label>
                        </div>
                        <div className="row input-field col s12 m3">
                            <input value="" type="text" />
                            <label htmlFor="">Spare</label>
                        </div>
                    </div>



                    <div className="row">
                        <h4>Body Condition</h4>
                        <div className="row input-field col s12 m6">
                            <textarea id="front-body" className="materialize-textarea"></textarea>
                            <label htmlFor="front-body">Front</label>
                        </div>
                        <div className="row input-field col s12 m6">
                            <textarea id="back-body" className="materialize-textarea"></textarea>
                            <label htmlFor="back-body">Back</label>
                        </div>
                        <div className="row input-field col s12 m6">
                            <textarea id="left-body" className="materialize-textarea"></textarea>
                            <label htmlFor="left-body">Left</label>
                        </div>
                        <div className="row input-field col s12 m6">
                            <textarea id="right-body" className="materialize-textarea"></textarea>
                            <label htmlFor="right-body">Right</label>
                        </div>
                    </div>



                    <div className="row">
                        <h4 className="header">Interior</h4>
                        <div className="row col s12 m3">
                            <input type="checkbox" className="filled-in" id="seat" />
                            <label htmlFor="seat">Seat</label>
                        </div>
                        <div className="row col s12 m3">
                            <input type="checkbox" className="filled-in" id="carpets" />
                            <label htmlFor="carpets">Carpets</label>
                        </div>
                        <div className="row col s12 m3">
                            <input type="checkbox" className="filled-in" id="panels" />
                            <label htmlFor="panels">Panels</label>
                        </div>
                        <div className="row col s12 m3">
                            <input type="checkbox" className="filled-in" id="dashboard" />
                            <label htmlFor="dashboard">Dashboard</label>
                        </div>
                    </div>





                    <div className="row">
                        <div className="input-field col s12 m6">
                            <input value="" type="text" />
                            <label htmlFor="name">Submitted By</label>
                        </div>
                        <div className="input-field col s12 m6">
                            <label htmlFor="date">Date</label>
                            <input id="date" type="text" className="datepicker" />
                        </div>
                    </div>

                    <div className="row right">
                        <a className="waves-effect waves-light amber darken-2  btn-large" type="cancel" name="cancel" >Cancel</a>
                        <a className="btn waves-effect waves-light teal btn-large" type="save" name="action">Save</a>
                        <a className="btn waves-effect waves-light blue btn-large" type="submit" name="action">Submit</a>
                    </div>


                </form>
            </div>
        );
    }
}
// export default VehicleInspectionCheck;