import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      wikiSearchTerms: '',
      wikiSearchReturnValues: [],
    }
  }

  changeWikiSearchTerms = (e) => {
    this.setState({
      wikiSearchTerms: e.target.value
    })
  }

  wikiSearchEngine = (e) => {
    e.preventDefault();
    this.setState({
      wikiSearchReturnValues: []
    })

    const pointerToThis = this;

    var url = "https://en.wikipedia.org/w/api.php"; 

    var params = {
        action: "query",
        list: "search",
        srsearch: this.state.wikiSearchTerms,
        format: "json"
    };

    url = url + "?origin=*";
    Object.keys(params).forEach((key) => {
      url += "&" + key + "=" + params[key];
    });

    fetch(url)
      .then(
        function(response) {
          return response.json();
        })
      .then(
        function(response) {
          for (const key in response.query.search) {
            pointerToThis.state.wikiSearchReturnValues.push({
              queryResultPageFullURL: 'no link',
              queryResultPageID: response.query.search[key].pageid,
              queryResultPage: response.query.search[key].title,
              queryResultSnippet: response.query.search[key].snippet
            });
          }
      })
      .then(
        function(response) {
          for (const key2 in pointerToThis.state.wikiSearchReturnValues) {
            let page = pointerToThis.state.wikiSearchReturnValues[key2];
            let pageID = page.queryResultPageID;
            let urlForRetrievingingpageURLByPageID = `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids=${pageID}&inprop=url&format=json`;


            fetch(urlForRetrievingingpageURLByPageID)
              .then(
                function(response) {
                  return response.json();
                }
              )
              .then(
                function (response) {
                  page.queryResultPageFullURL = response.query.pages[pageID].fullurl;

                  pointerToThis.forceUpdate();
                }
              )
          }
        }
      )
  }


  render() {
    let wikiSearchResults = [];

    for (const key3 in this.state.wikiSearchReturnValues) {
      wikiSearchResults.push(
          <div className="search-result" key={key3}>
            <h3>
              <a href={this.state.wikiSearchReturnValues[key3].queryResultPageFullURL}>
                {this.state.wikiSearchReturnValues[key3].queryResultPageTitle}
              </a>
            </h3>
            <span className="link">
              <a href={this.state.wikiSearchReturnValues[key3].queryResultPageFullURL}>
                  {this.state.wikiSearchReturnValues[key3].queryResultPageFullURL}
                </a>
            </span>
            <p className="description" dangerouslySetInnerHTML={{__html: this.state.wikiSearchReturnValues[key3].queryResultSnippet}}>
            </p>
          </div>
      );
    }

    return (
      <div className="App">
        <h1>Wikipedia Search</h1>
        <form>
          <input type="text" defaultValue={this.state.wikiSearchTerms} onChange={this.changeWikiSearchTerms} placeholder='Search in Wikipedia' />
          <button type="submit" onClick={this.wikiSearchEngine}>Search</button>
        </form>
        {wikiSearchResults}
      </div>
    );
  }
}

export default App;
