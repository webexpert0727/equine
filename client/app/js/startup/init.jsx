import 'babel-polyfill';
import React from 'react';
import ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import allReducers from '../reducers';
import App from '../components/App';
import Login from '../components/Login';
import ForgetPassword from '../components/ForgetPassword';
import Register from '../components/Register';
import Calender from '../components/Calender';
import Horse from '../components/Horse';
import Horses from '../components/Horses';
import HorseCreate from '../components/Horse_create';

import Dashboard from '../components/Dashboard';
import MakeupLessons from '../components/MakeupLessons';

import Clients from '../components/Clients';
import ClientDetails from '../components/Client_details';
import ClientAdd from '../components/Client_add';
import LessonView from '../components/Lesson_view';

import Programs from '../components/Programs';
import ProgramCreate from '../components/Program_create';

import ProgramTypes from '../components/ProgramTypes';
import ProgramTypeCreate from '../components/ProgramType_create';

import ReportingCategories from '../components/ReportingCategories';
import ReportingCategoryCreate from '../components/ReportingCategory_create';

import Locations from '../components/Locations';
import LocationCreate from '../components/Location_create';

import Sections from '../components/Sections';
import SectionCreate from '../components/Section_create';

import { Router, Route, Link, browserHistory, IndexRoute  } from 'react-router';
import SettingsStore from '../settings';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import 'react-select/dist/react-select.css';
import 'react-super-select/lib/react-super-select.css';
import NotFound from '../components/NotFound';

const logger = createLogger();
const store = createStore(
    allReducers,
    applyMiddleware(thunk, promise, logger)
);
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
    <Provider store={store}>
      <Router history = {history}>
        <Route path = "/" component = {App}>
          <Route path = "/login" component = {Login} onEnter={checkLogin}/>
          <Route path = "/register" component = {Register} onEnter={checkLogin}/>
          <Route path = "/dashboard" component = {Dashboard} onEnter={needLogin}/>
          <Route path = "/makeup_lessons" component = {MakeupLessons} onEnter={needLogin}/>
          <Route path = "/programs" component = {Programs} onEnter={needLogin}/>
          <Route path = "/program_create" component = {ProgramCreate} onEnter={needLogin}/>

          <Route path = "/programTypes" component = {ProgramTypes} onEnter={needLogin}/>
          <Route path = "/programType_create" component = {ProgramTypeCreate} onEnter={needLogin}/>

          <Route path = "/reportingCategories" component = {ReportingCategories} onEnter={needLogin}/>
          <Route path = "/reportingCategory_create" component = {ReportingCategoryCreate} onEnter={needLogin}/>

          <Route path = "/locations" component = {Locations} onEnter={needLogin}/>
          <Route path = "/location_create" component = {LocationCreate} onEnter={needLogin}/>

          <Route path = "/sections" component = {Sections} onEnter={needLogin}/>
          <Route path = "/section_create" component = {SectionCreate} onEnter={needLogin}/>

          <Route path = "/calender" component = {Calender} onEnter={needLogin}/>

          <Route path = "/horsesWorkload" component = {Horse} onEnter={needLogin}/>
          <Route path = "/horses" component = {Horses} onEnter={needLogin}/>
          <Route path = "/horse_create" component = {HorseCreate} onEnter={needLogin}/>

          <Route path = "/clients" component = {Clients} onEnter={needLogin}/>
          <Route path = "/client_add" component = {ClientAdd} onEnter={needLogin}/>
          <Route path = "/client_details" component = {ClientDetails} onEnter={needLogin}/>
          <Route path = "/lesson_view" component = {LessonView} onEnter={needLogin}/>

          <Route path = "/api/v1/password/edit" component = {ForgetPassword} />
          <Route path="*" component={NotFound} />
        </Route>
      </Router>
    </Provider>,
    document.getElementById('root')
);


function isLogin(nextState, replace) {
    let loggedIn = SettingsStore.currentUser();
    if(nextState.location.pathname == '/' && !loggedIn){
      replace({
        pathname: '/login',
      })
    }
}

function checkLogin(nextState, replace) {
  let loggedIn = SettingsStore.currentUser();
  if((nextState.location.pathname == '/register' || nextState.location.pathname == '/login') && loggedIn){
    replace({
      pathname: '/',
    })
  }
}

function needLogin(nextState, replace) {
    let loggedIn = SettingsStore.currentUser();
    if(!loggedIn){
      replace({
        pathname: '/login',
      })
    }
}