import React from 'react';
import ReactDOM from 'react-dom';
import './css/dashboard.css';
import $ from 'jquery';

var HHControlPanel = React.createClass({
    getInitialState: function() {
      return { control_data: { current_price: 0 }, disruption_notified: false };
    },
    loadDatasFromServer: function() {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        cache: false,
        success: function(data) {
            this.setState({control_data: data});
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
    componentDidMount: function() {
        this.loadDatasFromServer();
        setInterval(this.loadDatasFromServer, this.props.pollInterval);
        $(".control-toggle").click(function(e) {
          e.preventDefault();

          $("#react-HHControlPanel").fadeToggle("fast");
        });
    },
    updatePrice: function(event) {
      this.setState({control_data: {current_price: event.target.value}}, function() {
        $.ajax({
          method: 'POST',
          url: this.props.url,
          dataType: 'json',
          data: this.state.control_data,
          cache: false
        })
      });
    },
    notifyDisruption: function(event) {
      this.setState({disruption_notified: true}, function() {
        $.ajax({
          method: 'POST',
          url: this.props.url,
          dataType: 'json',
          data: {disruption: true},
          cache: false
        })
      });
    },

    render: function() {
        var control_data = this.state.control_data;

        return (
          <div className="control-panel">
            <div className="col-lg-12">

              <div className="current-price col-lg-3 col-md-6">
                <div className="panel panel-primary">
                  <div className="panel-heading">
                    <div className="row">
                      <div className="col-xs-3">
                        <i className="fa fa-usd fa-5x"></i>
                      </div>
                      <div className="col-xs-9 text-right">
                        <div className="large">
                          {control_data['current_price']}¢/kWh
                        </div>
                        Current Price
                      </div>
                    </div>
                  </div>
                  <form className="panel-footer form-inline">
                    <div className="form-group">
                      <div className="input-group">
                        <input type="text" className="form-control" id="update" placeholder={this.state.control_data.current_price} onChange={this.updatePrice} autoComplete="off" />
                        <div className="input-group-addon">¢/kWh</div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="disruption col-lg-3 col-md-6">
                <div className="panel panel-warning">
                  <div className="panel-heading">
                    <div className="row">
                      <div className="col-xs-3">
                        <i className="fa fa-exclamation fa-5x"></i>
                      </div>
                      <div className="col-xs-9 text-right">
                        <div className="large">
                          Service Disruption
                        </div>
                      </div>
                    </div>
                  </div>
                  {(() => {
                    if(this.state.disruption_notified) {
                      return (<div className="panel-footer">
                        <span className="pull-left">Hubs Notified</span>
                        <div className="clearfix"></div>
                      </div>);
                    } else {
                      return (<a href="#" onClick={this.notifyDisruption}>
                        <div className="panel-footer">
                          <span className="pull-left">Notify Hubs</span>
                          <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
                          <div className="clearfix"></div>
                        </div>
                    </a>);
                    }
                  })()}
                </div>
              </div>

            </div>
          </div>
        );
    }
})

ReactDOM.render(
  <HHControlPanel url="/control/data" pollInterval={2000} />,
  document.getElementById('react-HHControlPanel')
);
