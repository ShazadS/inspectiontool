import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import Griddle from 'griddle-react';
//import { _ } from 'meteor/underscore';


//import Pager from './Pager.jsx';


export default class FailedInspection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            failedInspectionTableData: []
        };
    }

    //getInitialState() {
    //    return {
    //        failedInspectionTableData: []
    //    };
    //}

    componentDidMount() {
        this.serverRequest= $.get('/test/data.json', function(result){
            this.setState({
                failedInspectionTableData : result
        })
        }.bind(this));
    }

    componentWillUnMount() {
        this.serverRequest.abort();
    }

    render() {

        return (
            <Griddle results={this.state.failedInspectionTableData} tableClassName="table bordered" showFilter={false} resultsPerPage={5} enableInfiniteScroll={true} bodyHeight={400}
                     showSettings={true} showPager={false} columns={["vin", "registration", "year", "inspectionType", "status"]} />
        )

        //return (
        //    <Griddle results={this.state.failedInspectionTableData} tableClassName="table" showFilter={true}
        //             showSettings={true} useCustomPagerComponent="true" customPagerComponent={Pager} />
        //)

    }

}
// export default FailedInspection;




