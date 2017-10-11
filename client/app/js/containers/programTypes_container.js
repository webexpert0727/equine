import React, {Component}             from 'react';
import {connect}                      from 'react-redux';
import AtomicForm                     from "atomic-form";
import { bindActionCreators }         from 'redux';
import  LessonAction                  from '../actions/lesson';
import  DashboardAction               from '../actions/dashboard';
import Modal                          from "simple-react-modal";
import BaseComponent                  from '../components/base_component';
import { Link }                       from 'react-router';
import Pagination                     from 'react-js-pagination'
import FooterContainer                from './footer_container';

class ProgramTypesContainer extends BaseComponent {
  constructor(props, context){
    super(props, context);
    this.state = {
      activePage: 1,
      tableData: [],
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillMount(){
    this.props.getProgramTypes();
  }

  handlePageChange(pageNumber) {
    console.log('active page is', pageNumber);
    this.setState({activePage: pageNumber});
    let pageData = [];
    this.state.programTypes.map((item, index) => {
      if(index >=  (pageNumber-1) * 10 && index < (pageNumber) * 10){
        pageData.push(item);
      }
    });
    this.setState({tableData: pageData});
  }

  componentWillReceiveProps(nextProps) {
    this.state.programTypes = nextProps.programTypes;
    this.state.length = nextProps.programTypes.length;
    this.handlePageChange(this.state.activePage);
  }

  render() {
    console.log('program types data', this.props.programTypes);

    return (
        <div className="rightMain">
          <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
            <div className="rghtHeadTop clearfix">
              <h1>Program Types</h1>
              <div className="rhtSrch">
                <form>
                  <input type="text" placeholder="Search program types" className="test"/>
                  <button type="submit"></button>
                </form>
              </div>
            </div>
            <div className="rghtHeadTop rghtHeadMid clearfix">
              <div className="rhtSrch rtClientRight">
                <div className="addLsn rtClient primaryBtn">
                  <Link to='/dashboard'>Back to Dashboard</Link>
                </div>
              </div>
              <div className="rhtSrch rtClientRight">
                <div className="addLsn rtClient">
                  <Link to='/programType_create'>Add a Program Type</Link>
                </div>
              </div>
            </div>

            <div className="rghtCalCntnr">
              <div className="rccInr">
                <div className="loginCnt">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      { this.state.tableData.map((programType, index) => {
                          return (
                              <tr key={index}>
                                <td>{ programType.program_type_name }</td>
                              </tr>
                          );
                        })
                      }
                    </tbody>
                  </table>
                </div>
                <div className="text-right">
                  <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={this.state.length}
                    pageRangeDisplayed={10}
                    onChange={this.handlePageChange}
                  />
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
    programTypes: state.programTypes
  }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({getProgramTypes: DashboardAction.getProgramTypes, }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ProgramTypesContainer);
