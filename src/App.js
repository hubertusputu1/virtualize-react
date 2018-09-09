import React, { Component } from 'react';
import moment from 'moment'
import ReactInterval from 'react-interval';
import { List } from 'react-virtualized';
import 'react-virtualized/styles.css';

import './App.css';

const rowCount = 4000;
const listHeight = 900;
const rowHeight = 90;
const rowWidth = 500;

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      doneFetch: false,
      enabled: true,
      timeout: 10000,
    }

    this.renderRow = this.renderRow.bind(this)
    this.renderList = this.renderList.bind(this)
  }

  setEmptyState = () => {
    this.setState({ 
      users: [],
      doneFetch: false,
    })
  }

  fetchApi = () => {
    fetch('http://188.166.251.140:4000/data')
    .then(response => {
      return response.json()
    })
    .then((users) => {
      this.setState({ 
        users: users,
        doneFetch: true
      })
    })
  }

  componentDidMount() {
    this.fetchApi()
  }

  renderStatus = (isBotOn) => {
    if(isBotOn){
      return <span className='dot__online'></span>
    }
    return <span className='dot__offline'></span>
  }
  
  renderRow = ({ index, key, style }) => {
    return (
      <div key={key} style={style} className='row listBorder'>
        <div className='col-2 image'>
          <img src={this.state.users[index].profilepic} alt='' />
        </div>
        <div className='col-7 content'>
          <div>{this.state.users[index].full_name}</div>
          <div className='message'>{this.state.users[index].lastMsg}</div>
        </div>
        <div className='col detail'>
          <div className='lastMessage'>{moment().startOf(this.state.users[index].lastMsgTime).fromNow()}</div>
          <div className='float-right'>{this.renderStatus(this.state.users[index].isBotOn)}</div>
        </div>
      </div>
    );
  }

  renderList() {
    return (
      <div className='list'>
        <List
        width={rowWidth}
        height={listHeight}
        rowHeight={rowHeight}
        rowRenderer={this.renderRow}
        rowCount={rowCount}
        overscanRowCount={1}
        sortBy='lastMsgTime' />
      </div>
    )
  }
  
  render() {
    const { timeout, enabled, doneFetch } = this.state
    return (
      <div className='App'>
        <ReactInterval {...{timeout, enabled}}
          callback={() => this.fetchApi()} />
        {doneFetch ? 
          this.renderList()
          : null}
      </div>
    );
  }
}

export default App;
