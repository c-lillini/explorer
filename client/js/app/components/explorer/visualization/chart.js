/**
 * @jsx React.DOM
 */

var _ = require('lodash');
var React = require('react/addons');
var Loader = require('../../common/loader.js');
var KeenViz = require('./keen_viz.js');
var ExplorerUtils = require('../../../utils/ExplorerUtils');
var FormatUtils = require('../../../utils/FormatUtils');

var Chart = React.createClass({

	// ***********************
	// Content building
	// ***********************

	buildVizContent: function() {
	  var model = this.props.model;

	  if (!model.result && model.result !== 0) {
	  	return (
	  	  <div ref="notice" className="big-notice">
	  	    <div className="alert alert-info">
	  	      {'Let\'s go exploring!'}
	  	    </div>
	  	  </div>
	  	);
	  }

	  if (!ExplorerUtils.resultCanBeVisualized(model)) {
	  	return (
	  	  <div ref="notice" className="big-notice">
	  	    <div className="alert alert-danger">
	  	      <span className="icon glyphicon glyphicon-info-sign error"></span>
	  	      Your query returned no results.
	  	    </div>
	  	  </div>
	  	);
	  }

	  if (ExplorerUtils.resultCanBeVisualized(model)) {
	    return this.buildViz();
	  } else {
	  	this.props.dataviz.destroy();
	  }
	},

	buildViz: function() {
		var chartContent;
		var msgContent;
		var analysisType = this.props.model.query.analysis_type;
		var wrapClasses = analysisType + '-viz';

	  if (ExplorerUtils.isJSONViz(this.props.model)) {
	  	var content = FormatUtils.prettyPrintJSON({
	  		result: this.props.model.result
	  	});
	  	chartContent = (
	  		<textarea ref='jsonViz' className="json-view" value={content} readOnly />
	  	);
	  } else {
	  	chartContent = (
	  		<KeenViz model={this.props.model} dataviz={this.props.dataviz} />
	  	);
	  }

    return (
      <div className={wrapClasses}>
        {chartContent}
      </div>
    );
	},

	buildVizMessage: function(){
		if (this.props.model.query.analysis_type === 'extraction') {
			return (
				<div className="alert alert-info alert-small text-center margin-bottom-tiny">
					<span className="icon glyphicon glyphicon-info-sign"></span>
					Preview is limited to {ExplorerUtils.EXRACTION_EVENT_LIMIT} events. Complete extractions are available by email.
				</div>
			);
		}
	},

	// ***********************
	// Lifecycle hooks
	// ***********************

  render: function() {
  	var vizMessage = this.buildVizMessage();
  	var vizContent = this.buildVizContent();

    return (
			<div className="chart-area">
				<Loader visible={this.props.model.loading} />
	      {vizContent}
	      {vizMessage}
			</div>
    );
  }
});

module.exports = Chart;
