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

class ProgramsContainer extends BaseComponent {
  constructor(props, context){
    super(props, context);
    this.state = {
      activePage: 1,
      tableData: [],
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillMount(){
    this.props.getPrograms();
  }

  handlePageChange(pageNumber) {
    console.log('active page is', pageNumber);
    this.setState({activePage: pageNumber});
    let pageData = [];
    this.state.programs.map((item, index) => {
      if(index >=  (pageNumber-1) * 10 && index < (pageNumber) * 10){
        pageData.push(item);
      }
    });
    this.setState({tableData: pageData});
   }

  componentWillReceiveProps(nextProps) {
    this.state.programs = nextProps.programs;
    this.state.length = nextProps.programs.length;
    this.handlePageChange(this.state.activePage);
  }

  render() {
    console.log('programs data', this.props.programs);

    return (
        <div className="rightMain">
          <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
            <div className="rghtHeadTop clearfix">
              <h1>Programs</h1>
              <div className="rhtSrch">
                <form>
                  <input type="text" placeholder="Search programs" className="test"/>
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
                  <Link to='/program_create'>Add a Program</Link>
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
                        <th>Code</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Reporting Category</th>
                        <th>Duration</th>
                        <th>Product</th>
                        <th>Instructor</th>
                        <th>Location</th>
                        <th>Farm</th>
                      </tr>
                    </thead>
                    <tbody>
                      { this.state.tableData.map((program, index) => {
                          return (
                              <tr key={index}>
                                <td>{ program.program_name }</td>
                                <td>{ program.program_code }</td>
                                <td>{ program.program_desc }</td>
                                <td>{ program.program_type_name }</td>
                                <td>{ program.reporting_category_name }</td>
                                <td>{ program.duration }</td>
                                <td>{ program.default_product_name }</td>
                                <td>{ program.default_instructor_name }</td>
                                <td>{ program.location_name }</td>
                                <td>{ program.farm_name }</td>
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
    programs: state.programs
  }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({getPrograms: DashboardAction.getPrograms, }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ProgramsContainer);
