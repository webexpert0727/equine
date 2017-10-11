import React, {Component}             from 'react';
import {connect}                      from 'react-redux';
import AtomicForm                     from "atomic-form";
import { bindActionCreators }         from 'redux';
import  LessonAction                  from '../actions/lesson';
import  DashboardAction               from '../actions/dashboard';
import Modal                          from "simple-react-modal";
import BaseComponent                  from '../components/base_component';
import ModalTemplateMakeupLesson      from '../components/ModalTemplateMakeupLesson';
import { Link }                       from 'react-router';

import DatePicker                     from 'react-datepicker';
import moment                         from 'moment';
import TimePicker                     from 'rc-time-picker';

import 'react-datepicker/dist/react-datepicker.css';
import Pagination                     from 'react-js-pagination'
import FooterContainer                from './footer_container';

class MakeupLessonsContainer extends BaseComponent {
  constructor(props, context){
    super(props, context);
    this.state = {
      lesson_people_id: 0,
      student_id: 0,
      lesson_date_time_id: 0,
      btnType: '',
      showExpiryDate: false,
      defaultExpiryDate: moment(),
      msgExpiryDate: 'Please select expiry date.',
      msg: '',
      activePage: 1,
      tableData: [],
    };

    this.showExpiryDate = this.showExpiryDate.bind(this);
    this.closeExpiryDate = this.closeExpiryDate.bind(this);
    this.handleExpiryDate = this.handleExpiryDate.bind(this);

    this.handleClickStatusBtn = this.handleClickStatusBtn.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);

  }

  componentWillMount(){
    this.props.getMakeupLessons();
  }

  handleClickStatusBtn(lesson_people_id, student_id, lesson_date_time_id, btnType) {
    this.setState({lesson_people_id: lesson_people_id});
    this.setState({student_id: student_id});
    this.setState({lesson_date_time_id: lesson_date_time_id});
    this.setState({btnType: btnType});
    if(btnType == 'yes') this.setState({showExpiryDate: true});
    else {
      let formData = {
        btnType: btnType,
        student_id: student_id,
        lesson_people_id: lesson_people_id,
        lesson_date_time_id: lesson_date_time_id,
        defaultExpiryDate: this.state.defaultExpiryDate.format('YYYY-MM-DD'),
      };

      console.log("Form Data", formData);
      this.props.submitStatusBtn(formData);

    }
  }

  showExpiryDate() {
    this.setState({showExpiryDate: true});
  }

  closeExpiryDate() {
    this.setState({showExpiryDate: false});

    let formData = {
      btnType: this.state.btnType,
      lesson_people_id: this.state.lesson_people_id,
      student_id: this.state.student_id,
      lesson_date_time_id: this.state.lesson_date_time_id,
      defaultExpiryDate: this.state.defaultExpiryDate.format('YYYY-MM-DD'),
    };

    console.log("Form Data", formData);
    this.props.submitStatusBtn(formData);
  }

  handleExpiryDate(date) {
    this.setState({defaultExpiryDate: date});
  }

  getYearText(dateText = new Date().toString()) {
    var dateText01 = dateText.split("T")[0];
    var dateYearText = dateText01.split("-")[0];
    return dateYearText;
  }

  getMonthText(dateText = new Date().toString()) {
    var dateText01 = dateText.split("T")[0];
    var dateMonthText = dateText01.split("-")[1];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(dateMonthText)-1];
  }

  getDateText(dateText = new Date().toString()) {
    var dateText01 = dateText.split("T")[0];
    var dateDateText = dateText01.split("-")[2];
    return dateDateText;
  }

  getDayText(dateText = new Date().toString()) {
    var dateText01 = dateText.split("T")[0];
    var dateYearText = dateText01.split("-")[0];
    var dateMonthText = dateText01.split("-")[1];
    var dateDateText = dateText01.split("-")[2];
    var d = new Date(dateYearText + "-" + dateMonthText + "-" + dateDateText);
    var n = d.getDay();
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[n];
  }

  getHourAMPM(timeText = new Date().toString()) {
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
    this.state.makeupLessons.map((item, index) => {
      if(index >=  (pageNumber-1) * 10 && index < (pageNumber) * 10){
        pageData.push(item);
      }
    });
    this.setState({tableData: pageData});
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextprops', nextProps);

    this.state.makeupLessons = nextProps.makeupLessons;
    this.state.length = nextProps.makeupLessons.length;
    this.handlePageChange(this.state.activePage);

    if(nextProps.submitStatusBtnStatus == 'ok_success') {
      this.setState({ msg: 'Makeup awarded!' });
      this.refs.modalTemp.show();
    }
    if(nextProps.submitStatusBtnStatus == 'deny_success') {
      this.setState({msg: 'Makeup denied!'});
      this.refs.modalTemp.show();
    }
  }

  render() {
    console.log('makupLessons data', this.props.makeupLessons);

    var okBtnStyle = {
      margin: '20px 0px 0px',
    };

    return (
        <div className="rightMain">
          <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
            <div className="rghtHeadTop clearfix">
              <h1>Makeup Lessons</h1>
              <div className="rhtSrch">
                <form>
                  <input type="text" placeholder="Search clients" className="test"/>
                  <button type="submit"></button>
                </form>
              </div>
            </div>
            <div className="rghtHeadTop rghtHeadMid clearfix">
              <div className="rhtSrch rtClientRight">
                <div className="addLsn rtClient">
                  <Link to='/dashboard'>Back to Dashboard</Link>
                </div>
              </div>
            </div>

            <div className="rghtCalCntnr">
              <div className="rccInr">
                <div className="loginCnt">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Lessondatetime name</th>
                        <th>Student</th>
                        <th>Scheduled Date</th>
                        <th>Start time</th>
                        <th>Action</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      { this.state.tableData.map((makeupLesson, index) => {
                          return (
                              <tr key={index}>
                                <td>{makeupLesson.name}</td>
                                <td>{makeupLesson.person_name}</td>
                                <td>{this.getDayText(makeupLesson.scheduled_date) + ", " + this.getMonthText(makeupLesson.scheduled_date) + " " + this.getDateText(makeupLesson.scheduled_date) + ", " + this.getYearText(makeupLesson.scheduled_date)}</td>
                                <td>{this.getHourAMPM(makeupLesson.scheduled_starttime) + " - " + this.getHourAMPM(makeupLesson.scheduled_starttime)}</td>
                                <td>
                                  <button onClick={() => this.handleClickStatusBtn(makeupLesson.id, makeupLesson.student_id, makeupLesson.lesson_date_time_id, 'yes')} className="makeupYesBtn btn btn-primary">Yes</button>
                                </td>
                                <td>
                                  <button onClick={() => this.handleClickStatusBtn(makeupLesson.id, makeupLesson.student_id, makeupLesson.lesson_date_time_id, 'no')} className="makeupYesBtn btn btn-danger">No</button>
                                </td>
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

          <Modal show={this.state.showExpiryDate}>
            <div className="row">
              <div className="panel panel-login">
                <div className="panel-body">
                  <div className="row expiryDateModal">
                    <div className="col-lg-12 text-center">
                      <hr/>
                      <label className="text-center">{this.state.msgExpiryDate}</label>
                    </div>
                    <br/>
                    <DatePicker
                      name="expirydate"
                      className="cnt_input form-control expiryDate"
                      selected={this.state.defaultExpiryDate}
                      onChange={this.handleExpiryDate}
                      dateFormat="LL"
                    />
                    <div className="col-lg-12 text-center">
                      <a onClick={this.closeExpiryDate} className="btn btn-primary" style={okBtnStyle}>OK</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          <FooterContainer/>
          
          <ModalTemplateMakeupLesson ref="modalTemp" msg={this.state.msg} />

        </div>
      );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    makeupLessons: state.makeupLessons,
    submitStatusBtnStatus: state.submitStatusBtnStatus,
  }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({
      getMakeupLessons: LessonAction.getMakeupLessons,
      submitStatusBtn: DashboardAction.submitStatusBtn,
    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(MakeupLessonsContainer);
