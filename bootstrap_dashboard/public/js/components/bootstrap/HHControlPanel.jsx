import React from 'react';
import ReactDOM from 'react-dom';
import './css/dashboard.css';
import $ from 'jquery';

var HHControlPanel = React.createClass({
    getInitialState: function() {
      return { current_price: 0 };
    },
    loadDatasFromServer: function() {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        cache: false,
        success: function(data) {
            this.setState(data);
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
      this.setState({current_price: event.target.value}, function() {
        $.ajax({
          method: 'POST',
          url: this.props.url,
          dataType: 'json',
          data: this.state,
          cache: false
        })
      });
    },

    render: function() {
        var control_data = this.state;

        return (
          <div className="control-panel">
            <div className="col-lg-12">
              <div className="col-lg-3 col-md-6">
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
                        <input type="text" className="form-control" id="update" placeholder={this.state.current_price} onChange={this.updatePrice} autocomplete="off" />
                        <div className="input-group-addon">¢/kWh</div>
                      </div>
                    </div>
                  </form>
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
