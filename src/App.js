import React from 'react';
import {Route, Switch} from 'react-router-dom';

import './App.css';

import Home from './pages/Home';
import Rooms from './pages/Rooms';
import SingleRoom from './pages/SingleRoom';
import Error from './pages/Error';

import Navbar from './components/Navbar';
function App() {
  return (
    <>
    {/*<Switch> is unique in that it renders a route 
      exclusively. In contrast,
      every <Route> that matches the location renders
       inclusively. */}
    <Navbar></Navbar>
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route exact path="/rooms" component={Rooms}/>
      <Route exact path="/rooms/:slug"  component={SingleRoom}/>
      <Route component={Error}/>
    </Switch>
    </>
  );
}

export default App;
