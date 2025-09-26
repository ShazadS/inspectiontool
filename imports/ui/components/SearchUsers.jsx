import React, {Component, PropTypes} from 'react';
import Griddle from 'griddle-react';

class SearchUsers extends Component {

    constructor(props) {
        super(props);
        // console.log("constructor " + JSON.stringify(this.props.status));
        this.state = {"userlist": []};
    }

    avoidReloadPage(event) {
        event.preventDefault();
        // console.log("avoidReloadPage ");
        return false;
    }

    componentWillMount() { // only called one time
        var that = this;
        Meteor.call('users.listusers', this.props.currentcompany, this.props.currentdealer, function (err, res) {
            var list = [];
            res.forEach(function (line) {
                var rline = {
                    "username": line.username,
                    "role": line.profile.role,
                    "company": line.profile.company,
                    "dealer": line.profile.dealer,
                    "dealercode": line.profile.dealercode,
                    "pdiApproved": "" + line.profile.pdiApproved,
                    "pdiNo": line.profile.pdiNo,
                    "first": line.profile.first,
                    "last": line.profile.last
                };
                list.push(rline);
            });
            that.setState({"userlist": list});
            // console.log("componentWillMount " + JSON.stringify(res));
        });
    }

    render() {
        //  console.log("SearchUsers " + JSON.stringify(this.props.userlist));
        return (
            <div className="Search">
                <div className="container">
                    <div className="row">
                        <form onSubmit={this.avoidReloadPage.bind(this)}>

                            <div className="col m12 s12 input-field">
                                <span className="grey-text text-lighten-1"><i>(Search all columns or click column header to search in one column only) </i> </span>

                                <Griddle results={this.state.userlist} tableClassName="table bordered"
                                         showFilter={true} resultsPerPage={10} enableInfiniteScroll={false}
                                         useFixedHeader={true}
                                         bodyHeight={990}
                                         showSettings={false} showPager={true}
                                         columns={["username", "role", "company", "dealer",
                                             "dealercode", "pdiApproved", "pdiNo", "first", "last"]}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
SearchUsers.propTypes = {
    currentusername: React.PropTypes.string,
    currentcompany: React.PropTypes.string,
    currentdealer: React.PropTypes.string,
    currentrole: React.PropTypes.string,
    currentpdiapproved: React.PropTypes.bool
};

export default SearchUsers;

