import React from 'react';
import classNames from 'classnames';
import VehicleInspectionCheck from '../components/VehicleInspectionCheck.jsx';


function InspectionForm() {
  return (
    <div className={classNames('InspectionForm')}>
      <div className="container">
          <h1>Inspection Check List</h1>
          <VehicleInspectionCheck />
      </div>
    </div>
  );
}

export default InspectionForm;
