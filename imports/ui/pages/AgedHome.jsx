import {Meteor} from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import Griddle from 'griddle-react';
import {createContainer} from 'meteor/react-meteor-data';
import {ChecklistValues} from '../../api/checklistvalues.js';

class AgedHome extends Component {

    constructor(props) {
        super(props);
        this.state = {"valueList": {}};
        console.log("AgedHome checklistname " + JSON.stringify(this.props.checklistname));
    }

    // componentDidMount() {
    //     // console.log("componentDidMount ");
    //     var chList = this.props.checklistvalues;
    //     // console.log("componentDidMount values " + JSON.stringify(chList));
    //     if (chList.length > 0) {
    //         var templ = chList[0];
    //         var values = (templ && templ.template && templ.template.values) ? templ.template.values : {};
    //         // console.log("valueList " + JSON.stringify(values));
    //         this.setState({"valueList": values});
    //     }
    // }

    transformChecklistValueList(rows) {
        let tableList = [];
        // console.log("transform" + JSON.stringify(rows));
        rows.map(function(row) {

            if (row.values) {
                // console.log("transform" + JSON.stringify(row.values));
                let newrow = {};
                row.values.map(function(value) {

                    newrow[value.searchheader] = value.value;
                });
             tableList.push(newrow);
            }
        });
        // console.log("AgedHome transformChecklistValueList " + JSON.stringify(tableList));
        return tableList;
    }

    getColumnHeaders(oneRow) {
        // console.log("AgedHome getColumnHeaders ");
        let columnList = [];
        let ii = 0;
        if (oneRow.values) {
            oneRow.values.map(function(value) {
                if (value.searchheader) {
                    if (ii < 5) {
                        columnList.push(value.searchheader);
                        ii++;
                    }
                }
            });
        }
        return columnList;
    }

    render() {
        var chList = this.props.checklistvalues;
        console.log("render numvalues " + JSON.stringify(chList.length));
        if (!chList || chList.length == 0 || !chList[0]) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col s12 m12">
                            <h2> No Data! </h2>
                        </div>
                    </div>
                </div>
            )
        } else {
            var tablelist = this.transformChecklistValueList(chList);
            var columns = this.getColumnHeaders(chList[0]);
            return (

            <div className="container">
                <div className="row">
                    <div className="col s12 m12">
                        <Griddle results={tablelist} tableClassName="table bordered" showFilter={false} resultsPerPage={5}
                                 enableInfiniteScroll={true} bodyHeight={400}
                                 showSettings={true} showPager={false}
                                 columns={columns}/>
                    </div>
                </div>
            </div>
            )
        }
    }
}

AgedHome.propTypes = {
    pagename: PropTypes.string.isRequired,
    checklistvalues: PropTypes.array.isRequired,
    currentUser: PropTypes.object
};

export default createContainer(() => {
    Meteor.subscribe('checklistvalues');
    return {
        pagename: 'AGE_Home',
        checklistvalues: ChecklistValues.find({'checklisttype': 'AGE-07Days',
            'version': 'Vers.0.1'}).fetch(),
        // todo user access
        currentUser: Meteor.user()
    };
}, AgedHome);

