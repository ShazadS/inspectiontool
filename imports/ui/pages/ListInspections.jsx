import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Checklists } from '../../api/checklists.js';
//import ChecklistTemplate from '../generator/ChecklistTemplate.jsx';
import classnames from 'classnames';


class ListInspections extends Component {
    constructor(props) {
        super(props);
        // Meteor.call('checklisttemplates.removeall');
        // console.log("call update");
        // Meteor.call('checklisttemplates.update',"TEST2",text, "xxx");

        this.state = {
            hideCompleted: false,
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        // console.log("text" + text);
        // console.log("call update");
        // Meteor.call('checklisttemplates.update', "TEST2", text2, "xxx");

        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }

    renderListInspectionsTemplate() { {/* renderTasks */}
        console.log("renderListInspectionsTemplate ");
        var filteredChecklists = this.props.checklisttemplates;
        console.log("num templates " + JSON.stringify(filteredChecklists.length));
        // if (this.state.hideCompleted) {
        //     filteredTasks = filteredTasks.filter(task => !task.checked);
        // }
        // todo have only one template not like tasks many
        // if( Object.prototype.toString.call( filteredChecklists ) === '[object Array]' ) {
        //     console.log("filteredChecklists is " + 'Array!' );
        // }
        if (filteredChecklists.length > 0) {
            // console.log("filteredChecklists " + JSON.stringify(filteredChecklists));
            return filteredChecklists.map((templ) => {
                const currentUserId = this.props.currentUser && this.props.currentUser._id;
                const showPrivateButton = templ.owner === currentUserId;

                return (
                    <ChecklistTemplate
                        key={templ._id}
                        checklisttemplate={templ}
                        showPrivateButton={showPrivateButton}
                    />
                );
            });
        }
    }


    render() {
        return (
            <div className={classnames('PdiHyundai')}>
                <div className="container">
                    <header>
                        {/*<h1>Check List ({this.props.incompleteCount})</h1>*/}

                        {this.renderListInspectionsTemplate()}


                        {/*{ this.props.currentUser ?*/}
                        {/*<form className="new-task" onSubmit={this.handleSubmit.bind(this)} >*/}
                        {/*<input*/}
                        {/*type="text"*/}
                        {/*ref="textInput"*/}
                        {/*placeholder="Type to add new checklisttemplates"*/}
                        {/*/>*/}
                        {/*</form> : ''*/}
                        {/*/!*}*!/*/}
                    </header>

                    <div className="row right">
                        <a className="waves-effect waves-light amber darken-2  btn-large" type="cancel" name="cancel">Cancel</a>
                        <a className="btn waves-effect waves-light teal btn-large" type="save" name="action">Save</a>
                        <a className="btn waves-effect waves-light blue btn-large" type="submit"
                           name="action">Submit</a>
                    </div>

                </div>
            </div>

        );
    }
}

ListInspections.propTypes = {
    checklisttemplates: PropTypes.array.isRequired,
    // incompleteCount: PropTypes.number.isRequired,
    currentUser: PropTypes.object,
};

export default createContainer(() => {
    Meteor.subscribe('checklists');

    return {
        checklists: Checklists.find({} ).fetch(),
        currentUser: Meteor.user(),
    };
}, ListInspections);