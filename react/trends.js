var React = require('react');
var ReactDOM = require('react-dom');

var TweetBox = React.createClass({
  getInitialState: function(){
    return { title: "Hello!" }
  },
  handleTrendClickFromBox: function(title){
    this.setState({title: title});
  },
  render: function(){
    return (<div>
      <TrendsList handleTrendClickFromBox={ this.handleTrendClickFromBox } />
      <TrendTitle title={ this.state.title } />
    </div>);
  }
})

var TrendTitle = React.createClass({
  render: function(){
    return <h1>{ this.props.title }</h1>
  }
})

var TrendsList = React.createClass({
  getInitialState: function(){
    return {trends: []}
  },
  componentDidMount: function(){
    var self = this;
    $.ajax({
      method: "GET",
      url: "/tweets/trends",
    })
      .done(function(response) {
        console.log(response);
        self.setState({trends: response});
      });
  },
  render: function() {
    var self = this;
    var trendsTags = this.state.trends.map(function(trend){
      return <Trend handleTrendClick={ self.props.handleTrendClickFromBox } key={ trend.name }>{ trend.name }</Trend>;
    });
    return (
      <div>
        { trendsTags }
      </div>
    )
  }
})

var Trend = React.createClass({
  handleClick: function(){
    this.props.handleTrendClick(this.props.children);
  },
  render: function() {
    return <a href="#" className="btn btn-primary" onClick={ this.handleClick }>{ this.props.children }</a>
  }
});

ReactDOM.render(<TweetBox />, document.getElementById('trends'));
