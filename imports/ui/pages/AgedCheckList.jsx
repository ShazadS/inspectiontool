//import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {ChecklistTemplates} from '../../api/checklisttemplates.js';
import {ChecklistValues} from '../../api/checklistvalues.js';
import ChecklistTemplate from '../generator/ChecklistTemplate.jsx';
import classnames from 'classnames';

class AgedCheckList extends Component {

    constructor(props) {
        super(props);
        this.state = {"valueList": {}};
        console.log("AgedCheckList checklistname " + JSON.stringify(this.props.checklistname));
    }

    componentDidMount() {
        // console.log("componentDidMount ");
        var chList = this.props.checklistvalues;
        // console.log("componentDidMount values " + JSON.stringify(chList));
        if (chList.length > 0) {
            var templ = chList[0];
            var values = (templ && templ.template && templ.template.values) ? templ.template.values : {};
            // console.log("valueList " + JSON.stringify(values));
            this.setState({"valueList": values});
        }
    }

    renderCheckListTemplate() {
        // console.log("CheckList renderCheckListTemplate ");
        var chValues = this.props.checklistvalues;

        console.log("AGED num values " + JSON.stringify(chValues.length));
        if (chValues && chValues.length > 0 && chValues[0].values) {
            var chTemplate = this.props.checklisttemplates;
            console.log("AGED num templates " + JSON.stringify(chTemplate.length));
            // console.log("AGED renderCheckListTemplate templates " + JSON.stringify(tempList));
            if (chTemplate && chTemplate.length > 0 && chTemplate[0]) {

                //console.log("chList[0] " + JSON.stringify(chList[0]));
                let id = chValues[0]._id;
                let valuesList = chValues[0].values;
                // console.log("renderCheckListTemplate values " + JSON.stringify(valuesList));
                let template = chTemplate[0];
                // todo user access
                //console.log("CheckList renderCheckListTemplate " + JSON.stringify(valuesList));

                return (
                    <ChecklistTemplate
                        key={id}
                        checklistname='AGE_7days_Test'
                        checklisttemplate={template}
                        checklistvaluelist={valuesList}
                    />
                );
            }
        }
    }

    render() {
        return (
            <div className={classnames('PdiHyundai')} ref='PdiHyundai'>


                <div className="container">
                    {this.renderCheckListTemplate()}
                </div>






                <div className="container">
                    <div className="row suv">








                            <div className="col m12">
                                <div className="row center-align">
                                    <div className="col m12 car-left offset-m1">
                                        <div className="m6 left-top"><a href="#"></a> </div>
                                        <div className="m6 right-top"><a href="#"></a></div>
                                        <div className="clear"></div>
                                        <div className="m6 bottom-left"><a href="#"></a></div>
                                        <div className="m6 bottom-right"><a href="#"></a></div>
                                    </div>
                                </div>
                            </div>


















                        <div className="col m12 ">
                            <div className="row">
                                <div className="col m12 car-right offset-m1">
                                    <div className="m6 left-top"><a href="#"></a></div>
                                    <div className="m6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>

                        <div className="col m12">
                            <div className="row">
                                <div className="col m12 car-top offset-m1">
                                    <div className="m6 left-top"><a href="#"></a></div>
                                    <div className="m6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>






                        <div className="col m6">
                            <div className="row">
                                <div className="col m12 car-front">
                                    <div className="m6 left-top"><a href="#"></a></div>
                                    <div className="m6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>

                        <div className="col m6">
                            <div className="row">
                                <div className="col m12 car-back">
                                    <div className="m6 left-top"><a href="#"></a></div>
                                    <div className="m6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>


                    </div>




                    <div className="row van">
                        <div className="col m12">
                            <div className="row">
                                <div className="col m12 car-left offset-m1">
                                    <div className="m6 left-top"><a href="#"></a></div>
                                    <div className="m6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>


                        <div className="col m12">
                            <div className="row">
                                <div className="col m12 car-right offset-m1">
                                    <div className="m6 left-top"><a href="#"></a></div>
                                    <div className="m6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>

                        <div className="col m12">
                            <div className="row">
                                <div className="col m12 car-top offset-m1">
                                    <div className="m6 left-top"><a href="#"></a></div>
                                    <div className="m6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>





                        <div className="col m6">
                            <div className="row">
                                <div className="col m12 car-front">
                                    <div className="m6 left-top"><a href="#"></a></div>
                                    <div className="m6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>


                        <div className="col m6">
                            <div className="row">
                                <div className="col m12 car-back">
                                    <div className="m6 left-top"><a href="#"></a></div>
                                    <div className="m6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>



                    </div>





                    <div className="row wagon">
                        <div className="col m12">
                            <div className="row">
                                <div className="col m12 car-left offset-m1">
                                    <div className="m6 left-top"><a href="#"></a></div>
                                    <div className="m6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>


                        <div className="col m12">
                            <div className="row">
                                <div className="col m12 car-right offset-m1">
                                    <div className="m6 left-top"><a href="#"></a></div>
                                    <div className="m6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>

                        <div className="col m12">
                            <div className="row">
                                <div className="col m12 car-top offset-m1">
                                    <div className="m6 left-top"><a href="#"></a></div>
                                    <div className="m6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>




                        <div className="col m6">
                            <div className="row">
                                <div className="col m12 car-front">
                                    <div className="m6 s6 left-top"><a href="#"></a></div>
                                    <div className="m6 s6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 s6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 s6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>


                        <div className="col s6">
                            <div className="row">
                                <div className="col m12 car-back">
                                    <div className="m6 s6 left-top"><a href="#"></a></div>
                                    <div className="m6 s6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 s6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 s6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>


                    </div>





                    <div className="row hatch">
                        <div className="col s12">
                            <div className="row">
                                <div className="col s12 m12 car-left offset-m1">
                                    <div className="m6 s6 left-top"><a href="#"></a></div>
                                    <div className="m6 s6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 s6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 s6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>


                        <div className="col s12">
                            <div className="row">
                                <div className="col s12 m12 car-right offset-m1">
                                    <div className="m6 s6 left-top"><a href="#"></a></div>
                                    <div className="m6 s6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 s6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 s6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>

                        <div className="col s12">
                            <div className="row">
                                <div className="col m12 s12 car-top offset-m1">
                                    <div className="m6 s6 left-top"><a href="#"></a></div>
                                    <div className="m6 s6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 s6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 s6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>



                        <div className="col s6">
                            <div className="row">
                                <div className="col s12 m12 car-front">
                                    <div className="m6 s6 left-top"><a href="#"></a></div>
                                    <div className="m6 s6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 s6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 s6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>

                        <div className="col s6">
                            <div className="row">
                                <div className="col m12 car-back">
                                    <div className="m6 s6 left-top"><a href="#"></a></div>
                                    <div className="m6 s6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 s6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 s6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>


                    </div>





                    <div className="row sedan">
                        <div className="col s12">
                            <div className="row">
                                <div className="col s12 m12 car-left offset-m1">
                                    <div className="m6 s6 left-top"><a href="#"></a></div>
                                    <div className="m6 s6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 s6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 s6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>


                        <div className="col s12">
                            <div className="row">
                                <div className="col s12 m12 car-right offset-m1">
                                    <div className="m6 s6 left-top"><a href="#"></a></div>
                                    <div className="m6 s6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 s6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 s6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>

                        <div className="col s12">
                            <div className="row">
                                <div className="col m12 s12 car-top offset-m1">
                                    <div className="m6 s6 left-top"><a href="#"></a></div>
                                    <div className="m6 s6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 s6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 s6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>

                        <div className="col s6">
                            <div className="row">
                                <div className="col s12 m12 car-front">
                                    <div className="m6 s6 left-top"><a href="#"></a></div>
                                    <div className="m6 s6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 s6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 s6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>
                        <div className="col s6">
                            <div className="row">
                                <div className="col m12 car-back">
                                    <div className="m6 s6 left-top"><a href="#"></a></div>
                                    <div className="m6 s6 right-top"><a href="#"></a></div>
                                    <div className="clear"></div>
                                    <div className="m6 s6 bottom-left"><a href="#"></a></div>
                                    <div className="m6 s6 bottom-right"><a href="#"></a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

AgedCheckList.propTypes = {
    checklistname: PropTypes.string.isRequired,
    checklisttemplates: PropTypes.array.isRequired,
    checklistvalues: PropTypes.array.isRequired,
    // incompleteCount: PropTypes.number.isRequired,
    valuesList: PropTypes.object,
    currentUser: PropTypes.object
};

export default createContainer(() => {
    Meteor.subscribe('checklistvalues');
    Meteor.subscribe('checklisttemplates');
    return {
        checklistname: 'AGE_7days_Test',
        checklistvalues: ChecklistValues.find({ 'checklisttype': 'AGE-07Days',
            'version': 'Vers.0.1'}).fetch(),
        checklisttemplates: ChecklistTemplates.find({ 'checklisttype': 'AGE-07Days',
            'version': 'Vers.0.1'}).fetch(),
        // todo user access
        currentUser: Meteor.user()
    };
}, AgedCheckList);

