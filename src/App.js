import React, { Component } from 'react';
import './App.css';
import moment from 'moment'
import { List } from 'react-virtualized';

const rowCount = 4000;
const listHeight = 900;
const rowHeight = 90;
const rowWidth = 500;

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: {},
      doneFetch: false,
    }

    this.renderRow = this.renderRow.bind(this)
    this.renderList = this.renderList.bind(this)
  }

  componentDidMount() {
    fetch('/data')
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

  renderStatus(isBotOn){
    if(isBotOn){
      return <span className='dot__online'></span>
    }
    return <span className='dot__offline'></span>
  }
  
  renderRow({ index, key, style }) {
    const { users } = this.state
    return (
      <div key={key} style={style} className='row listBorder'>
        <div className='col-2 image'>
          <img src={users[index].profilepic} alt='' />
        </div>
        <div className='col-7 content'>
          <div>{users[index].full_name}</div>
          <div className='message'>{users[index].lastMsg}</div>
        </div>
        <div className='col detail'>
          <div className='lastMessage'>{moment().startOf(users[index].lastMsgTime).fromNow()}</div>
          <div className='float-right'>{this.renderStatus(users[index].isBotOn)}</div>
        </div>
      </div>
    );
  }

  renderList() {
    const { doneFetch } = this.state
    if(doneFetch) {
      return (
        <div className='list'>
          <List
          width={rowWidth}
          height={listHeight}
          rowHeight={rowHeight}
          rowRenderer={this.renderRow}
          rowCount={rowCount}
          overscanRowCount={4000} />
        </div>
      )
    }
  }
  
  render() {
    return (
      <div className='App'>
        {this.renderList()}
      </div>
    );
  }
}

export default App;
