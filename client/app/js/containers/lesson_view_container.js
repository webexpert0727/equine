import React, {Component}             from 'react';
import {connect}                      from 'react-redux';
import AtomicForm                     from "atomic-form";
import { bindActionCreators }         from 'redux';
import  LessonAction                from '../actions/lesson';
import Modal                        from "simple-react-modal";
import BaseComponent                from '../components/base_component';
import { Link, browserHistory } from 'react-router';

class LessonViewContainer extends BaseComponent {
  constructor(props, context){
    super(props, context);
  }

  componentWillMount(){
    let query = browserHistory.getCurrentLocation();
    query = parseInt(query.query.client_id);
    this.props.getLessonsData(query);
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

  render() {
    let { lessons } = this.props;

    console.log('lessons ->lessons data', lessons.lessons);

    return (
      <div className="rightMain">
        <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">

          {/* Start >>> Header of Right Content */}
          <div className="rghtHeadTop clearfix">
            <h1>Client Lessons</h1>
          </div>

          <div className="rghtHeadTop rghtHeadMid clearfix">
            <h3>Clients &#x3e; {lessons.student.student_name}</h3>
            <div className="rhtSrch">
              <div className="addLsn rtClient"><Link to={'/client_details?client_id=' + lessons.student.id}>Back to Details</Link></div>
            </div>
          </div>
          {/* End >>> Header of Right Content */}

          {/* Start >>> Content of Right Content */}
          <div className="rghtContent clearfix">

            {/* Start >> Top */}
            <div className="rghtContentHeader row">
              <div className="col-lg-2 col-sm-2">
                <img className="clientLogo img-circle" src="/assets/userImage.png" alt="Client Logo" width="150" height="150" />
              </div>
              <div className="clientName col-lg-3 col-sm-3">
                <span>{lessons.student.student_name}</span>
              </div>
            </div>
            {/* End >> Top */}

            {/* Start >> Lessons */}
            <div className="rghtContentSection row">
              <div className="col-lg-12 col-sm-12">
                <div className="sectionHeader">
                  <h3>LESSONS</h3>
                  <div className="rhtSrch lessonSrch">
                    <form>
                      <input type="text" placeholder="Search lessons" className="test"/>
                      <button type="submit"></button>
                    </form>
                  </div>
                </div>
                <div className="sectionContent">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date and Time</th>
                        <th>Lesson Name</th>
                        <th>Instructor</th>
                        <th>Assigned to</th>
                        <th>Status</th>
                        <th>Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                    { lessons.lessons.map((lesson, index) => {
                        return (
                          <tr key={index}>
                            <td><span className="first">{this.getDayText(lesson.scheduled_date)}, {this.getMonthText(lesson.scheduled_date)} {this.getDateText(lesson.scheduled_date)}, {this.getYearText(lesson.scheduled_date)}</span><br/>{this.getHourAMPM(lesson.scheduled_starttime)} - {this.getHourAMPM(lesson.scheduled_endtime)}</td>
                            <td><a href="javascript:;"><span className="first">{lesson.name}</span></a></td>
                            <td>
                              <div className="clientIcn staffIcn"><img className="clientIcn staffIcn" src="/assets/staffIcn.png" alt="Client Icon" /></div>
                              <span>{lesson.instructor_name}</span>
                            </td>
                            <td>
                              <div className="clientIcn hrseIcn"><img className="clientIcn hrseIcn" src="/assets/hrseIcn.png" alt="Client Icon" /></div>
                              <span>{lesson.horse_name}</span>
                            </td>
                            <td>{lesson.lesson_status_name}</td>
                            <td>
                              {lesson.paid ? <span className="checkMark">&#10004;</span> : ''}
                            </td>
                          </tr>
                        );
                      })
                    }
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
            {/* End >> Lessons */}

            {/* Start >> Buttons */}
            <div className="rghtContentSection row">
              <div className="bbsnglBtn orangeBtn">
                <Link to={'/client_details?client_id=' + lessons.student.id}>Back to Details</Link>
              </div>
            </div>
            {/* End >> Buttons */}

          </div>
          {/* End >>> Content of Right Content */}
        </div>

        {/* Start >>> Footer of Right Content */}
        <footer>
          <div className="footTop"><span><img src="assets/footerIcn.png" alt="Footer Icon" /></span></div>
          <div className="footBtm"></div>
        </footer>
        {/* End >>> Footer of Right Content */}

        </div>
      );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    lessons: state.lessons
  }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({getLessonsData: LessonAction.getLessonsData, }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(LessonViewContainer);
