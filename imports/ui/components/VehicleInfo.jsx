import React from 'react';
import classNames from 'classnames';





export default class VehicleInfo extends React.Component {


    //constructor(props) {
    //    super(props);
    //}
    //
    //
    //showResults(response){
    //    this.setState({
    //        vehicleInfoData: response
    //    });
    //}
    //
    //
    //LoadData(URL) {
    //    var that = this;
    //    $.ajax({
    //        type: 'GET',
    //        dataType: 'json',
    //        url: URL,
    //        success: function(response){
    //            that.showResults(response);
    //        }
    //    })
    //}
    //
    //
    //componentDidMount() {
    //    this.LoadData('/test/data.json').bind(this);
    //}




    render() {
        return (
            <div className="row">
                <h4 className="header box valign-wrapper">Vehicle</h4>
                <div className="row input-field col s12 m6">
                    /*<select>
                        <option value="" disabled selected>Select Make</option>
                        <option value="1">Hatchback</option>
                        <option value="2">Sedan</option>
                        <option value="3">Wagon</option>
                        <option value="4">SUV</option>
                        <option value="5">Utility</option>
                        <option value="5">Van</option>
                    </select>*/
                    <label htmlFor="make">Make</label>
                </div>
                <div className="row input-field col s12 m6">
                    /*<select>
                        <option value="" disabled selected>Select Year</option>
                        <option value="1">2000</option>
                        <option value="2">2001</option>
                        <option value="3">2002</option>
                        <option value="4">2003</option>
                        <option value="5">2004</option>
                        <option value="6">2005</option>
                    </select>*/
                    <label>Year</label>
                </div>

                <div className="row input-field col s12 m6">
                    /*<select>
                        <option value="" disabled selected>Select Model</option>
                        <option value="1">Accent</option>
                        <option value="2">Coupe</option>
                        <option value="3">Elantra</option>
                        <option value="4">Genesis</option>
                        <option value="5">Getz</option>
                    </select>*/
                    <label htmlFor="make">Model</label>
                </div>
                <div className="row input-field col s12 m6">
                    <input value=""/*{this.state.vehicleInfoData.registration}*/ type="text" id="registration" />
                    <label htmlFor="registration">Registration</label>
                </div>


                <div className="row input-field col s12 m6">
                    <input value="" type="text"/>
                    <label>Odometer</label>
                </div>
                <div className="row input-field col s12 m6">
                    <input value="" type="text"/>
                    <label>VIN</label>
                </div>


                <div className="row input-field col s12 m6">
                    <input value="" type="text" className=" validate"/>
                    <label>Engine</label>
                </div>
                <div className="row input-field col s12 m6">
                    <select>
                        <option value="" disabled selected>Select Colour</option>
                        <option value="1">Red</option>
                        <option value="2">blue</option>
                        <option value="3">Black</option>
                        <option value="4">Grey</option>
                        <option value="5">White</option>
                    </select>
                    <label>Colour</label>
                </div>

            </div>
        );
    }
}
// export default VehicleInfo;