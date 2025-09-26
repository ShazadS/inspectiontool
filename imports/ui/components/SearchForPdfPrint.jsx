import TrackerReact from 'meteor/ultimatejs:tracker-react';
import React, {Component, PropTypes} from 'react';
import Griddle from 'griddle-react';
import {ChecklistValues} from '../../api/checklistvalues.js';

class Search extends TrackerReact(React.Component) {

    constructor() {
        super();
        // console.log("constructor " + JSON.stringify(this.props.status));
        const subscription = Meteor.subscribe('checklistvalues');
        this.state = {
            selectedFromGriddle: false,
            pdiSubset: {},
            vinSearch: "",
            pdi: {},
            ready: subscription.ready(),
            subscription: subscription,
            selectedRowId: 0
        };
    }

    componentWillUnmount() {
        this.state.subscription.stop();
    }

    handleSubmit(event) {
        window.location.assign("/Checklist?vin=" + this.refs.vin.value + "&type=" + this.refs.checklisttype.value + "&version=" + this.refs.version.value);
    }

    selectPdiChecklist(gridRow) {
        // console.log("selectPdiChecklist row  " + JSON.stringify(_.keys(gridRow.props.data)));
        var pdiSubset = {
            'checklisttype': gridRow.props.data.checklisttype,
            "vin": gridRow.props.data.vin,
            'version': gridRow.props.data.version,
            'rego': gridRow.props.data.rego,
            'make': gridRow.props.data.make,
            'modelName': gridRow.props.data.modelName,
            'colour': gridRow.props.data.colour,
            'keyNo': gridRow.props.data.keyNo,
            'dealerName': gridRow.props.data.dealerName,
            'lastEditUserName': gridRow.props.data.lastEditUserName,
            'lastUpdated': gridRow.props.data.updatedAt,
            'status': gridRow.props.data.status,
        };
        // console.log("selectPdiChecklist row    " + JSON.stringify(pdiSubset));
        // console.log("selectPdiChecklist state  " + JSON.stringify(this.state.pdiSubset));
        if (! (this.state.pdiSubset.checklisttype && pdiSubset.checklisttype == this.state.pdiSubset.checklisttype
                && this.state.pdiSubset.vin && pdiSubset.vin == this.state.pdiSubset.vin
                && this.state.pdiSubset.version && pdiSubset.version == this.state.pdiSubset.version
                && this.state.pdiSubset.rego && pdiSubset.rego == this.state.pdiSubset.rego
                && this.state.pdiSubset.make && pdiSubset.make == this.state.pdiSubset.make
                && this.state.pdiSubset.modelName && pdiSubset.modelName == this.state.pdiSubset.modelName
                && this.state.pdiSubset.colour && pdiSubset.colour == this.state.pdiSubset.colour
                && this.state.pdiSubset.keyNo && pdiSubset.keyNo == this.state.pdiSubset.keyNo
                && this.state.pdiSubset.dealerName && pdiSubset.dealerName == this.state.pdiSubset.dealerName
                && this.state.pdiSubset.lastEditUserName && pdiSubset.lastEditUserName == this.state.pdiSubset.lastEditUserName
                && this.state.pdiSubset.lastUpdated && pdiSubset.lastUpdated == this.state.pdiSubset.lastUpdated
                && this.state.pdiSubset.status && pdiSubset.status == this.state.pdiSubset.status
            )
        ) {
            // console.log("selectPdiChecklist SELECT IT  ");
            // selected a different pdi
            this.setState({
                "selectedFromGriddle": true,
                "pdiSubset": pdiSubset,
                "selectedRowId": gridRow.props.data.id
            });


        }
        // // console.log("selectPdiChecklist refs test="
        //     + "/Checklist?vin=" + this.state.vin
        //     + "&type=" + this.refs.checklisttype.value + "&version=" + this.refs.version.value); // + JSON.stringify(values) )

        //window.location.assign("/Checklist?vin=" + this.state.vin + "&type=" + this.refs.checklisttype.value + "&version=" + this.refs.version.value)
    }

    handleChangeSearchVin(e) {
        // console.log("handleChangeSearchVin " + e.target.value);

        this.setState({
            "selectedFromGriddle": false,
            "pdiSubset": {},
            "searchVin": e.target.value
        });
    }

    avoidReloadPage(event) {
        event.preventDefault();
        // console.log("avoidReloadPage ");
        return false;
    }

    render() {
        // console.log("render vin " + JSON.stringify(this.state.selectedFromGriddle));
        let pdi = [];
        var pdiSubset = this.state.pdiSubset;

            var searchStrType = "^PDI";
            let searchStrVinOrRego = "^" + this.state.searchVin;

            if (searchStrVinOrRego.length <= 7 && searchStrVinOrRego.length > 2) {
                pdi = ChecklistValues.find({
                    'checklisttype': {$regex: searchStrType},
                    "vinLast": {$regex: searchStrVinOrRego},
                }).fetch();
            }
            if (!(pdi && pdi.length > 0) && searchStrVinOrRego.length > 2) {
                pdi = ChecklistValues.find({
                    'checklisttype': {$regex: searchStrType},
                    "vin": {$regex: searchStrVinOrRego},
                }).fetch();
            }

            if (pdi && pdi.length > 0) {
                if (!this.state.selectedFromGriddle) {
                    var pdiSubset = {
                        'checklisttype': pdi[0].checklisttype,
                        'version': pdi[0].version,
                        "vin": pdi[0].vin,
                        'rego': pdi[0].rego,
                        'make': pdi[0].make,
                        'modelName': pdi[0].modelName,
                        'colour': pdi[0].colour,
                        'keyNo': pdi[0].keyNo,
                        'dealerName': pdi[0].dealerName,
                        'lastEditUserName': pdi[0].lastEditUserName,
                        'lastUpdated': pdi[0].updatedAt,
                        'status': pdi[0].status,
                    };
                }
            }

        // console.log("render selected " + JSON.stringify(this.state.selectedFromGriddle));
        // console.log("render vin      " + pdiSubset.vin);
        // console.log("render vin      " + JSON.stringify(this.state.pdiSubset));
        var that = this;
        if (pdiSubset.vin && (this.state.selectedFromGriddle || pdi.length == 1)) {
            // <Select id="vinselect" ref="vinselect" name="vinselect" onChange={this.handleChangeSearchVin.bind(this)} options={this.state.options}
            // />

            const rowMetadata = {
                bodyCssClassName: rowData => (rowData.id === this.state.selectedRowId ? 'selected' : ''),
            };
            var metadata = [{"columnName":"vin", "cssClassName": "iconBlue"}];
            // console.log("render data \n" + JSON.stringify(pdiSubset));
            return (
                    <div className="Search">
                        <div className="container">
                            <div className="row">
                                <form onSubmit={this.avoidReloadPage.bind(this)}>

                                    <div className="col s12 input-field">
                                        <span className="grey-text text-lighten-1"><i>(Enter last digits of a VIN or complete VIN)</i></span>
                                        <input id="vin" value={this.state.searchVin} type="text" onChange={this.handleChangeSearchVin.bind(this)}/>
                                        <label htmlFor="vin" className="active">Search VIN</label>

                                    </div>

                                    <div className="col s6 m4 input-field">
                                        <input type="text" id="pdihomemake" ref="vin"
                                               value={pdiSubset.vin} disabled className="blue-text lighten-1" />
                                        <label className="active" htmlFor="pdihomemake">VIN</label>
                                    </div>

                                    <div className="col s6 m4 input-field">
                                        <input type="text" id="pdihomemake" ref="rego"
                                               value={pdiSubset.rego} disabled className="blue-text lighten-1" />
                                        <label className="active" htmlFor="pdihomemake">Rego</label>
                                    </div>

                                    <div className="col s6 m4 input-field">
                                        <input type="text" id="pdihomemake"
                                               value={pdiSubset.make} disabled className="blue-text lighten-1" />
                                        <label className="active" htmlFor="pdihomemake">Make</label>
                                    </div>

                                    <div className="col s6 m4 input-field">
                                        <input type="text" id="pdihomemodel"
                                               value={pdiSubset.modelName} disabled className="blue-text lighten-1" />
                                        <label className="active" htmlFor="pdihomemodel">Model</label>
                                    </div>

                                    <div className="col s6 m4 input-field">
                                        <input type="text" id="pdihomecolour"
                                               value={pdiSubset.colour} disabled className="blue-text lighten-1" />
                                        <label className="active" htmlFor="pdihomecolour">Colour</label>
                                    </div>

                                    <div className="col s6 m4 input-field">
                                        <input type="text" id="pdihomekeyno"
                                               value={pdiSubset.keyNo} disabled className="blue-text lighten-1" />
                                        <label className="active" htmlFor="pdihomekeyno">Key No.</label>
                                    </div>


                                    <div className="col s6 m4 input-field">
                                        <input type="text" id="pdihomekeyno"
                                               value={pdiSubset.dealerName} disabled className="blue-text lighten-1" />
                                        <label className="active" htmlFor="pdihomekeyno">Dealer</label>
                                    </div>

                                    <div className="col s6 m4 input-field">
                                        <input type="text" id="pdihomekeyno"
                                               value={pdiSubset.lastEditUserName} disabled className="blue-text lighten-1" />
                                        <label className="active" htmlFor="pdihomekeyno">Last User</label>
                                    </div>

                                    <div className="col s6 m4 input-field">
                                        <input type="text" id="pdihomemake"
                                               value={pdiSubset.lastUpdated} disabled className="blue-text lighten-1" />
                                        <label className="active" htmlFor="pdihomemake">Last Updated</label>
                                    </div>

                                    <div className="col s6 m4 input-field">
                                        <input type="text" id="pdihomemake"
                                               value={pdiSubset.status} disabled className="blue-text lighten-1" />
                                        <label className="active" htmlFor="pdihomemake">Status</label>
                                    </div>

                                    <div className="col s6 m4 input-field">
                                        <input type="text" id="pdihomemake" ref="checklisttype"
                                               value={pdiSubset.checklisttype} disabled className="blue-text lighten-1" />
                                        <label className="active" htmlFor="pdihomemake">Type</label>
                                    </div>

                                    <div className="col s6 m4 input-field">
                                        <input type="text" id="pdihomemake" ref="version"
                                               value={pdiSubset.version} disabled className="blue-text lighten-1" />
                                        <label className="active" htmlFor="pdihomemake">Version</label>
                                    </div>

                                    <a className="btn waves-effect waves-light blue btn-large active"
                                       onClick={this.handleSubmit.bind(this)} >Edit PDI</a>

                                    <div className="col m12 s12 input-field">
                                        <h3>Click to Select PDI Checklist </h3>

                                        <Griddle ref="myGriddle" results={pdi} tableClassName="table bordered"
                                                 showFilter={false} resultsPerPage={2} enableInfiniteScroll={true} useFixedHeader={true}
                                                 bodyHeight={300}
                                                 showSettings={false} showPager={false}
                                                 columns={["vin","checklisttype",  "status", "modelName", "colour"]}
                                                 rowMetadata={rowMetadata}
                                                 onRowClick={this.selectPdiChecklist.bind(this)}/>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                );
            } else {
                return (
                    <div className="Search">
                        <div className="container">
                            <div className="row">
                                <form onSubmit={this.avoidReloadPage.bind(this)}>

                                    <div className="col s12 input-field">
                                        <input id="vin" type="text" onChange={this.handleChangeSearchVin.bind(this)}/>
                                        <label htmlFor="vin" value={this.state.vinSearch} className="active">VIN</label>
                                        <span className="grey-text text-lighten-1"><i>(Enter last digits of a VIN or complete VIN)</i></span>
                                    </div>

                                    <div className="col m12 s12 input-field">
                                        <h3>Click to Select PDI Checklist</h3>

                                        <Griddle results={pdi} tableClassName="table bordered"
                                                 showFilter={false} resultsPerPage={2} enableInfiniteScroll={true} useFixedHeader={true}
                                                 bodyHeight={300}
                                                 showSettings={false} showPager={false}
                                                 columns={["vin","checklisttype",  "status", "modelName", "colour"]}
                                                 onRowClick={this.selectPdiChecklist.bind(this)}/>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                )
            }

    }
}
Search.propTypes = {
    currentuser: PropTypes.object
};

export default Search;

// res = ["results",
//     "tableClassName",
//     "showFilter",
//     "resultsPerPage",
//     "enableInfiniteScroll",
//     "bodyHeight",
//     "showSettings",
//     "showPager",
//     "columns",
//     "onRowClick",
//     "gridMetadata",
//     "columnMetadata",
//     "rowMetadata",
//     "initialSort",
//     "gridClassName",
//     "customRowComponentClassName",
//     "settingsText",
//     "filterPlaceholderText",
//     "nextText",
//     "previousText",
//     "maxRowsText",
//     "enableCustomFormatText",
//     "childrenColumnName",
//     "metadataColumns",
//     "useCustomRowComponent",
//     "useCustomGridComponent",
//     "useCustomPagerComponent",
//     "useCustomFilterer",
//     "useCustomFilterComponent",
//     "useGriddleStyles",
//     "useGriddleIcons",
//     "customRowComponent",
//     "customGridComponent",
//     "customPagerComponent",
//     "customFilterComponent",
//     "customFilterer",
//     "globalData",
//     "enableToggleCustom",
//     "noDataMessage",
//     "noDataClassName",
//     "customNoDataComponent",
//     "allowEmptyGrid",
//     "showTableHeading",
//     "useFixedHeader",
//     "useExternal",
//     "externalSetPage",
//     "externalChangeSort",
//     "externalSetFilter",
//     "externalSetPageSize",
//     "externalMaxPage",
//     "externalCurrentPage",
//     "externalSortColumn",
//     "externalSortAscending",
//     "externalLoadingComponent", "e" +
//     "xternalIsLoading",
//     "paddingHeight",
//     "rowHeight",
//     "infiniteScrollLoadTreshold",
//     "useFixedLayout",
//     "isSubGriddle",
//     "enableSort",
//     "sortAscendingClassName",
//     "sortDescendingClassName",
//     "parentRowCollapsedClassName",
//     "parentRowExpandedClassName",
//     "settingsToggleClassName",
//     "nextClassName",
//     "previousClassName",
//     "headerStyles",
//     "sortAscendingComponent",
//     "sortDescendingComponent",
//     "sortDefaultComponent",
//     "parentRowCollapsedComponent",
//     "parentRowExpandedComponent",
//     "settingsIconComponent",
//     "nextIconComponent",
//     "previousIconComponent",
//     "isMultipleSelection",
//     "selectedRowIds", "uniqueIdentifier"]
//

