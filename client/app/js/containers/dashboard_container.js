import React, {Component}             from 'react';
import {connect}                      from 'react-redux';
import AtomicForm                     from "atomic-form";
import { bindActionCreators }         from 'redux';
import  LessonAction                  from '../actions/lesson';
import Modal                          from "simple-react-modal";
import BaseComponent                  from '../components/base_component';
import { Link } from 'react-router';
import FooterContainer                from './footer_container';

class DashboardContainer extends BaseComponent {
  constructor(props, context){
    super(props, context);
  }

  componentWillMount(){
    this.props.getClients();
  }

  render() {
    console.log('clients data', this.props.clients);

    let { clients } = this.props;

    return (
        <div className="rightMain">
          <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
            <div className="rghtHeadTop clearfix">
              <h1>Dashboard</h1>
            </div>
            <div className="rghtHeadTop rghtHeadMid clearfix">
              <div className="rhtSrch dashboardLstBtn">
                <div className="bbsnglBtn primaryBtn">
                  <Link to='/makeup_lessons'>Makeup Lessons</Link>
                </div>
              </div>
              <div className="rhtSrch dashboardLstBtn">
                <div className="bbsnglBtn primaryBtn">
                  <Link to='/sections'>Sections</Link>
                </div>
              </div>
            </div>
            <div className="rghtHeadTop rghtHeadMid clearfix">
              <div className="rhtSrch dashboardLstBtn">
                <div className="bbsnglBtn primaryBtn">
                  <Link to='/programs'>Programs</Link>
                </div>
              </div>
              <div className="rhtSrch dashboardLstBtn">
                <div className="bbsnglBtn primaryBtn">
                  <Link to='/programTypes'>Program Types</Link>
                </div>
              </div>
            </div>
            <div className="rghtHeadTop rghtHeadMid clearfix">
              <div className="rhtSrch dashboardLstBtn">
                <div className="bbsnglBtn primaryBtn">
                  <Link to='/reportingCategories'>Reporting Categories</Link>
                </div>
              </div>
              <div className="rhtSrch dashboardLstBtn">
                <div className="bbsnglBtn primaryBtn">
                  <Link to='/dashboard'>Instructors</Link>
                </div>
              </div>
            </div>
            <div className="rghtHeadTop rghtHeadMid clearfix">
              <div className="rhtSrch dashboardLstBtn">
                <div className="bbsnglBtn primaryBtn">
                  <Link to='/locations'>Locations</Link>
                </div>
              </div>
              <div className="rhtSrch dashboardLstBtn">
                <div className="bbsnglBtn primaryBtn">
                  <Link to='/horses'>Horses</Link>
                </div>
              </div>
            </div>
            <div className="rghtHeadTop rghtHeadMid clearfix">
              <div className="rhtSrch dashboardLstBtn">
                <div className="bbsnglBtn primaryBtn">
                  <Link to='/horsesWorkload'>Horses Workload</Link>
                </div>
              </div>
            </div>
          </div>

          <FooterContainer/>

        </div>
      );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    clients: state.clients
  }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({getClients: LessonAction.getClients, }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(DashboardContainer);
