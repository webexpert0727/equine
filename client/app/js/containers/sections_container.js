import React, {Component}             from 'react';
import {connect}                      from 'react-redux';
import AtomicForm                     from "atomic-form";
import { bindActionCreators }         from 'redux';
import  LessonAction                  from '../actions/lesson';
import Modal                          from "simple-react-modal";
import  DashboardAction               from '../actions/dashboard';
import { getSections }                from '../actions/section';
import BaseComponent                  from '../components/base_component';
import { Link }                       from 'react-router';
import Pagination                     from 'react-js-pagination'
import FooterContainer                from './footer_container';

class SectionsContainer extends BaseComponent {
  constructor(props, context){
    super(props, context);
  }

  componentWillMount(){
    this.props.getSections();
    this.state = {
      activePage: 1,
      tableData: [],
    };

    this.handlePageChange = this.handlePageChange.bind(this);

  }

  getYearText(dateText = new Date().toString()) {
    if(dateText == null) return '';
    var dateText01 = dateText.split("T")[0];
    var dateYearText = dateText01.split("-")[0];
    return dateYearText;
  }

  getMonthText(dateText = new Date().toString()) {
    if(dateText == null) return '';
    var dateText01 = dateText.split("T")[0];
    var dateMonthText = dateText01.split("-")[1];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(dateMonthText)-1];
  }

  getDateText(dateText = new Date().toString()) {
    if(dateText == null) return '';
    var dateText01 = dateText.split("T")[0];
    var dateDateText = dateText01.split("-")[2];
    return dateDateText + ',';
  }

  getHourAMPM(timeText = new Date().toString()) {
    if(timeText == null) return '';
    var timeText01 = timeText.split("T")[1];
    var dateHour = parseInt(timeText01.split(":")[0]);
    var dateMinute = parseInt(timeText01.split(":")[1]);
    var ampm = dateHour >= 12 ? 'PM' : 'AM';
    dateHour = dateHour % 12;
    dateHour = dateHour ? dateHour : 12; // the hour '0' should be '12'
    dateMinute = dateMinute < 10 ? '0' + dateMinute : dateMinute;
    var strTime = dateHour + ':' + dateMinute + ' ' + ampm;
    return strTime;
  }

  handlePageChange(pageNumber) {
    console.log('active page is', pageNumber);
    this.setState({activePage: pageNumber});
    let pageData = [];
    this.state.sections.map((item, index) => {
      if(index >=  (pageNumber-1) * 10 && index < (pageNumber) * 10){
        pageData.push(item);
      }
    });
    this.setState({tableData: pageData});
  }

  componentWillReceiveProps(nextProps) {
    this.state.sections = nextProps.sections;
    this.state.length = nextProps.sections.length;
    this.handlePageChange(this.state.activePage);
  }

  render() {
    console.log('sections data', this.props.sections);

    return (
        <div className="rightMain">
          <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
            <div className="rghtHeadTop clearfix">
              <h1>Sections</h1>
              <div className="rhtSrch">
                <form>
                  <input type="text" placeholder="Search sections" className="test"/>
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
                  <Link to='/section_create'>Add a Section</Link>
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
                        <th>Program</th>
                        <th>Start date</th>
                        <th>End date</th>
                        <th>Start time</th>
                        <th>End time</th>
                        <th>Repeat type</th>
                        <th>Day of week</th>
                        <th>Instructor</th>
                        <th>Location</th>
                        <th>Max enrollment</th>
                      </tr>
                    </thead>
                    <tbody>
                      { this.state.tableData.map((section, index) => {
                          return (
                              <tr key={index}>
                                <td>{ section.section_name }</td>
                                <td>{ section.program_name }</td>
                                <td>{this.getMonthText(section.startdate) + " " + this.getDateText(section.startdate) + " " + this.getYearText(section.startdate)}</td>
                                <td>{this.getMonthText(section.enddate) + " " + this.getDateText(section.enddate) + " " + this.getYearText(section.enddate)}</td>
                                <td>{this.getHourAMPM(section.starttime)}</td>
                                <td>{this.getHourAMPM(section.endtime)}</td>
                                <td>{ section.repeat_type_name }</td>
                                <td>{ section.day_of_week_name }</td>
                                <td>{ section.instructor_name }</td>
                                <td>{ section.location_name }</td>
                                <td>{ section.max_enrollment }</td>
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
    sections: state.sections
  }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({getSections: getSections, }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(SectionsContainer);
