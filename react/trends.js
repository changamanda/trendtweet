var React = require('react');
var ReactDOM = require('react-dom');

var TweetBox = React.createClass({
  getInitialState: function(){
    return { title: "", tweets: [] }
  },
  handleTrendClickFromBox: function(title, tweets){
    var updated = [];
    tweets.length === 0 ? updated = ["Couldn't find any Tweets!"] : updated = tweets
    this.setState({title: `Retweet about ${title}`, tweets: updated});
  },
  render: function(){
    var tweetsElements = this.state.tweets.map(function(tweet){
      if (tweet === "Couldn't find any Tweets!"){
        debugger
        return (<h3>{ tweet }</h3>)
      }
      return <Tweet user={ tweet.user.name } id={ tweet.id_str }>{ tweet.text }</Tweet>
    })

    return (<div>
      <h1>Trend Tweet</h1>
      <TrendsList handleTrendClickFromBox={ this.handleTrendClickFromBox } />
      <h2>{ this.state.title }</h2>
      { tweetsElements }
    </div>);
  }
})

var Tweet = React.createClass({
  retweet: function(){
    var self = this;
    $.ajax({
      method: "POST",
      url: "/tweets/retweet/" + this.props.id,
    })
      .done(function(response) {
        console.log(response);
      });
  },
  render: function(){
    return (<div>
        <p>{ this.props.children } ({this.props.user}) <i onClick={ this.retweet } className="fa fa-retweet" aria-hidden="true"></i></p>
      </div>
    )
  }
})

var TrendsList = React.createClass({
  getInitialState: function(){
    return {trends: []}
  },
  componentDidMount: function(){
    this.loadTrends();
  },
  loadTrends: function(){
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
      return <Trend handleTrendClick={ self.props.handleTrendClickFromBox } key={ trend.name } query={ trend.query }>{ trend.name }</Trend>;
    });
    return (
      <div>
        <h4>Click to explore a trend! <i onClick={ this.loadTrends } className="fa fa-refresh" aria-hidden="true"></i></h4>
        <div className="row">
          { trendsTags }
          <CustomTrend handleTrendClick={ self.props.handleTrendClickFromBox } />
        </div>
      </div>
    )
  }
})

var Trend = React.createClass({
  getInitialState: function(){
    return {tweets: []};
  },
  getTweets: function(){
    var self = this;
    $.ajax({
      method: "GET",
      url: "/tweets/" + this.props.query,
    })
      .done(function(response) {
        console.log(response);
        self.setState({tweets: response}, function(){
          self.props.handleTrendClick(self.props.children, self.state.tweets);
        });
      });
  },
  render: function() {
    return (
      <div className="col-md-4">
        <a href="#" className="btn btn-primary" onClick={ this.getTweets }>{ this.props.children }</a>
      </div>
    )
  }
});

var CustomTrend = React.createClass({
  getInitialState: function(){
    return {tweets: [], title: ""};
  },
  editTitle: function(e){
    this.setState({title: e.target.value});
  },
  getTweets: function(){
    var self = this;
    $.ajax({
      method: "GET",
      url: "/tweets/" + escape(this.state.title),
    })
      .done(function(response) {
        self.setState({tweets: response}, function(){
          self.props.handleTrendClick(self.state.title, self.state.tweets);
        });
      });
  },
  _onKeyPress: function(e){
    if (e.key === 'Enter') {
      this.getTweets();
    }
  },
  render: function() {
    return (
      <div className="col-md-4" id="custom-col">
        <div className="custom-trend-box">
          <input className="custom-trend" onChange={ this.editTitle } onEnter={ this.getTweets } onKeyPress={ this._onKeyPress } type="text" placeholder="Choose a Trend!" />
          <i className="fa fa-check-circle-o" onClick={ this.getTweets } aria-hidden="true"></i>
        </div>
      </div>
    )
  }
});

$(document).ready(function(){
  ReactDOM.render(<TweetBox />, document.getElementById('trends'));
});
