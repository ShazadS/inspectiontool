import React from 'react';
import classNames from 'classnames';


function PdiHyundai() {
    return (
        <div className={classNames('PdiHyundai')}>


            <div className="container">
                <h2>Hyundai - Pre-Delivery Inspection Checklist</h2>
                <div className="row">
                    <div className="col m12 s12 input-field">
                            <input value="" type="text" id="vin" required/>
                            <label htmlFor="vin">VIN</label>
                    </div>

                    <div className="col m12 s12 input-field">
                        <input value="" type="text" id="model" required/>
                        <label htmlFor="model">Model:</label>
                    </div>

                    <div className="col m12 s12 input-field">
                        <input value="" type="text" id="model-variant" required/>
                        <label htmlFor="model-variant">Model Variant:</label>
                    </div>

                    <div className="col m12 s12 input-field">
                        <input value="" type="text" id="data-inspected"/>
                        <label htmlFor="date-inspected">Date Inspected:</label>
                    </div>

                </div>

                <ul className="collapsible" data-collapsible="accordion">


                <li>
                    <h2 className="collapsible-header">1. Vehicle Exterior</h2>

                    <div className="collapsible-body">
                        <div className="col m12 s12">
                            <label className="control-label">Check For Transportation Damages or Missing Vehicle Items</label>
                        </div>
                        <div className="col s12 m12 text-left">
                            <select name="cars" className="text-left">
                                <option value="empty">Select</option>
                                <option value="ok">OK/Adjusted</option>
                                <option value="notok">Failed</option>
                                <option value="na">N/A</option>
                            </select>
                        </div>

                        <div className="col s12 m12">
                            <label className="control-label">Enable Transportation Mode Switch</label>
                        </div>
                        <div className="col s12 m12">
                            <select name="cars" className="text-left">
                                <option value="empty">Select</option>
                                <option value="ok">OK/Adjusted</option>
                                <option value="notok">Failed</option>
                                <option value="na">N/A</option>
                            </select>
                        </div>
                    </div>
                </li>

                <li>
                    <h2 className="collapsible-header">2. Engine Compartment</h2>


                    <div className="collapsible-body">
                        <h3>Check Oil & Fluid Levels</h3>
                        <div className="col s12 m12">
                            <label className="control-label">- Engine Oil</label>
                        </div>
                        <div className="col s12 m12">
                            <select name="cars" className="text-left">
                                <option value="empty">Select</option>
                                <option value="ok">OK/Adjusted</option>
                                <option value="notok">Failed</option>
                                <option value="na">N/A</option>
                            </select>
                        </div>


                        <div className="col s12 m12">
                            <label className="control-label">- Power Steering Fluid (if Equipped)</label>
                        </div>
                        <div className="col s12 m12">
                            <select name="cars" className="text-left">
                                <option value="empty">Select</option>
                                <option value="ok">OK/Adjusted</option>
                                <option value="notok">Failed</option>
                                <option value="na">N/A</option>
                            </select>
                        </div>

                        <div className="col s12 m12">
                            <label className="control-label">Inspect For Fuel, Oil, Coolant, Brake or Other Fluid Leaks</label>
                        </div>
                        <div className="col s12 m12">
                            <select name="cars" className="text-left">
                                <option value="empty">Select</option>
                                <option value="ok">OK/Adjusted</option>
                                <option value="notok">Failed</option>
                                <option value="na">N/A</option>
                            </select>
                        </div>
                    </div>
                </li>

                </ul>

            <div className="row">
                <h2>Comments</h2>
                <div className="row">
                    <div className="input-field col s12 m12">
                      <textarea className="materialize-textarea" id="textarea1"></textarea>
                      <label htmlFor="textarea1">Message</label>
                    </div>
                </div>
            </div>
                <div className="row right">
                    <a className="waves-effect waves-light amber darken-2  btn-large" type="cancel" name="cancel" >Cancel</a>
                    <a className="btn waves-effect waves-light teal btn-large" type="save" name="action">Save</a>
                    <a className="btn waves-effect waves-light blue btn-large" type="submit" name="action">Submit</a>
                </div>


            </div>
        </div>
    );
}

export default PdiHyundai;








