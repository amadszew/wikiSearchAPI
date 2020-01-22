import React from 'react';
import './App.scss'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      wikiSearchTerms: '',
      wikiSearchReturnValues: [],
      wikiReplaceTerms: ''
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
              queryResultPageTitle: response.query.search[key].title,
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

  wikiReplaceEngine = (e) => {
    e.preventDefault();
    
    const replaceTerm = document.getElementById('replaceInput')
    const snippet = document.querySelector(".searchmatch");
    
    snippet.innerHTML = replaceTerm.value;  
  }

  changeWikiReplaceTerms = (e) => {
    this.setState({
      wikiReplaceTerms: e.target.value
    })
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
            <span className="search-result__link">
              <a href={this.state.wikiSearchReturnValues[key3].queryResultPageFullURL}>
                  {this.state.wikiSearchReturnValues[key3].queryResultPageFullURL}
                </a>
            </span>
            <p className="search-result__description" dangerouslySetInnerHTML={{__html: this.state.wikiSearchReturnValues[key3].queryResultSnippet}}>
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

          <input type='text' defaultValue={this.state.wikiReplaceTerms} onChange={this.changeWikiReplaceTerms} placeholder="Replace" id='replaceInput' />
          <button type='submit' onClick={this.wikiReplaceEngine}>Replace</button>
        </form>
        {wikiSearchResults}
      </div>
    );
  }
}

export default App;