import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import './App.css';

import Info from './info';
import MeetingManage from './MeetingManage'; 
import { HashRouter } from 'react-router-dom/cjs/react-router-dom.min';

class App extends React.Component {
  render() {
    return (
      <>
        <Router>
        <div className="App">
          {/* 可以在这里添加应用的顶部导航栏或其他元素 */}
          <HashRouter basename="/manage"> 
            <Switch>
            <Route exact path="/" component={MeetingManage} />
            <Route path="/info" component={Info} /> {/* 添加 Info 组件的路由 */}
            </Switch>
          </HashRouter>
         
        </div>
      </Router>
      </>

    );
  }
}

export default App