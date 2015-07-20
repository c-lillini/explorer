/** @jsx React.DOM */
var assert = require('chai').assert;
var expect = require('chai').expect;
var _ = require('lodash');
var sinon = require('sinon');
var Select = require('../../../../../client/js/app/components/common/select.js');
var Visualization = require('../../../../../client/js/app/components/explorer/visualization/index.js');
var Chart = require('../../../../../client/js/app/components/explorer/visualization/chart.js');
var React = require('react/addons');
var AppDispatcher = require('../../../../../client/js/app/dispatcher/AppDispatcher');
var ExplorerUtils = require('../../../../../client/js/app/utils/ExplorerUtils');
var ExplorerConstants = require('../../../../../client/js/app/constants/ExplorerConstants');
var ExplorerActions = require('../../../../../client/js/app/actions/ExplorerActions');
var NoticeActions = require('../../../../../client/js/app/actions/NoticeActions');
var TestUtils = React.addons.TestUtils;
var TestHelpers = require('../../../../support/TestHelpers');

describe('components/explorer/visualization/index', function() {

  beforeEach(function() {
    this.client = TestHelpers.createClient();
    this.model = TestHelpers.createExplorerModel();
    this.model.id = 10;
    this.project = TestHelpers.createProject();

    var datavizStub = sinon.stub(Keen, 'Dataviz').returns(TestHelpers.createDataviz());
    this.chartOptionsStub = sinon.stub(ExplorerUtils, 'getChartTypeOptions').returns([]);
    this.component = TestUtils.renderIntoDocument(<Visualization client={this.client} model={this.model} project={this.project} persistence={null} />);

    this.getOptionsFromComponent = function(component) {
      var chartTypeSelect = TestUtils.findRenderedDOMComponentWithClass(component, 'chart-type').getDOMNode();
      var optionNodes = chartTypeSelect.childNodes[0].childNodes;
      return _.map(optionNodes, function(optionNode) {
        return optionNode.textContent;
      });
    };
  });

  afterEach(function () {
    Keen.Dataviz.restore();
    ExplorerUtils.getChartTypeOptions.restore();
  });

  describe('setup', function() {
    it('is of the right type', function() {
      assert.isTrue(TestUtils.isCompositeComponentWithType(this.component, Visualization));
    });
    it('has one chart child component', function(){
      assert.lengthOf(TestUtils.scryRenderedComponentsWithType(this.component, Chart), 1);
    });

    describe('without persistence', function () {
      it('should not show the AddFav button', function () {
        assert.isUndefined(this.component.refs['add-fav']);
      });
    });

    describe('with persistence', function () {
      it('should show the AddFav button', function () {
        this.component.setProps({ persistence: {} });
        assert.isDefined(this.component.refs['add-fav']);
      });
    });
  });

  describe('interactions', function () {
    it('should call props.addClick when the add fav button is clicked', function () {
      var stub = sinon.stub();
      this.component.setProps({ persistence: {}, addFavoriteClick: stub });
      TestUtils.Simulate.click(this.component.refs['add-fav'].getDOMNode());
      assert.isTrue(stub.calledOnce);
    });
  });

  describe('chart types select', function() {

    describe('populates with the right chart types based on the dataviz capabilities', function() {
      it('basic options', function(){
        this.model.result = 50;
        this.chartOptionsStub.returns([
          'metric',
          'JSON'
        ]);
        this.component.forceUpdate();
        var options = this.getOptionsFromComponent(this.component);
        assert.sameMembers(options, ['JSON', 'Metric']);
      });

    });

    it('it is not disabled when the model is not loading', function(){
      this.model.loading = false;
      this.component.forceUpdate();
      var select = TestUtils.findRenderedDOMComponentWithClass(this.component, 'chart-type').getDOMNode().childNodes[0];
      assert.isFalse(select.disabled);
    });

    it('it is disabled when the model is actively loading', function(){
      this.model.loading = true;
      this.component.forceUpdate();
      var select = TestUtils.findRenderedDOMComponentWithClass(this.component, 'chart-type').getDOMNode().childNodes[0];
      assert.isTrue(select.disabled);
    });

  });

});