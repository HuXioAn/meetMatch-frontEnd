import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import MeetingCreate from './MeetingCreate';
import Info from './info';
import meetmatchImage from './lib/fig/meetmatch.png';

class App extends React.Component {
  render() {
    return (
      <>
        <Router>
        <div className="App">
          {/* 可以在这里添加应用的顶部导航栏或其他元素 */}
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/MeetingCreate" component={MeetingCreate} />
            <Route path="/Info" component={Info} /> {/* 添加 Info 组件的路由 */}
          </Switch>
        </div>
      </Router>
      </>

    );
  }
}

function Home() {
  return (
    <div style={{
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'column', 
        height: '100vh', 
        textAlign: 'center'
      }}>
      {/* <p><Button_JumpToMain/></p> */}
      <div className="MeetMatch_Logo">
        <img src={meetmatchImage} alt="MeetMatch" />
      </div>
      <ul style={{ listStyleType: 'none', padding: 0 }} >
        <li style={{padding:10, fontSize:20}}>
          <Link to="/MeetingCreate">MeetingCreate</Link>
        </li>
      </ul>
    </div>
  );
}

export default App