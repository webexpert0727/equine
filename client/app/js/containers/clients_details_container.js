import React, {Component}             from 'react';
import {connect}                      from 'react-redux';
import AtomicForm                     from "atomic-form";
import { bindActionCreators }         from 'redux';
import  LessonAction                  from '../actions/lesson';
import Modal                          from "simple-react-modal";
import BaseComponent                  from '../components/base_component';
import { Link, browserHistory }       from 'react-router';
import FooterContainer              from './footer_container';

class ClientDetailsContainer extends BaseComponent {
  constructor(props, context){
    super(props, context);
  }

  componentWillMount(){
    let query = browserHistory.getCurrentLocation();
    query = parseInt(query.query.client_id);

    this.props.getClientData(query);
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
    let { client } = this.props;

    console.log('client data', client);

    var noneDisplayStyle = {
      display: 'none'
    };

    return (
      <div className="rightMain">
        <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">

          {/* Start >>> Header of Right Content */}
          <div className="rghtHeadTop clearfix">
            <h1>Client Details</h1>
          </div>

          <div className="rghtHeadTop rghtHeadMid clearfix">
            <h3>Clients &#x3e; {client.person.person_name}</h3>
            <div className="rhtSrch">
              <div className="addLsn rtClient"><Link to='/clients'>Back to Lists</Link></div>
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
                <span>{client.person.person_name}</span>
                <span className="custom_caret"><span className="caret"></span></span>
              </div>
              <div className="col-lg-7 col-sm-7">
                <div className="clientOptions row">
                  <div className="clientOption col-lg-4 col-sm-4">
                    <div className="optionHeader">
                      <span>MAKEUP LESSONS</span>
                    </div>
                    <div className="optionContent">
                      <span className="first">No Lesson</span><br/>
                      <span className="second">NO EXPIRE SOON</span>
                    </div>
                  </div>
                  <div className="clientOption col-lg-4 col-sm-4">
                    <div className="optionHeader">
                      <span>NEXT LESSON</span>
                    </div>
                    {client.next_lesson ?
                      <div className="optionContent">
                        <span className="first">{this.getDayText(client.next_lesson.scheduled_date) + ", " + this.getMonthText(client.next_lesson.scheduled_date) + " " + this.getDateText(client.next_lesson.scheduled_date) + ", " + this.getYearText(client.next_lesson.scheduled_date)}</span><br/>
                        <span className="second">{this.getHourAMPM(client.next_lesson.scheduled_starttime) + " - " + this.getHourAMPM(client.next_lesson.scheduled_endtime)}</span>
                      </div> : <div className="optionContent"><span className="first">No Lesson</span><br/><span className="second">No Time</span></div>
                    }
                  </div>
                </div>
              </div>
            </div>
            {/* End >> Top */}

            {/* Start >> Lessons */}
            <div className="rghtContentSection row">
              <div className="col-lg-8 col-sm-8">
                <div className="sectionHeader">
                  <h3>LESSONS</h3>
                  <div className="bbsnglBtn primaryBtn">
                    <button type="button" >Award makeup lesson</button>
                  </div>
                  <div className="bbsnglBtn orangeBtn">
                    <button type="button">Schedule a lesson</button>
                  </div>
                </div>
                <div className="sectionContent">
                  <h1>Last Lesson</h1>
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
                      {client.last_lesson ?
                        <tr>
                          <td><span className="first">{this.getDayText(client.last_lesson.scheduled_date)}, {this.getMonthText(client.last_lesson.scheduled_date)} {this.getDateText(client.last_lesson.scheduled_date)}, {this.getYearText(client.last_lesson.scheduled_date)}</span><br/>{this.getHourAMPM(client.last_lesson.scheduled_starttime)} - {this.getHourAMPM(client.last_lesson.scheduled_endtime)}</td>
                          <td><a href="javascript:;"><span className="first">{client.last_lesson.name}</span></a></td>
                          <td>
                            <div className="clientIcn staffIcn"><img className="clientIcn staffIcn" src="/assets/staffIcn.png" alt="Client Icon" /></div>
                            <span>{client.last_lesson.instructor_name}</span>
                          </td>
                          <td>
                            <div className="clientIcn hrseIcn"><img className="clientIcn hrseIcn" src="/assets/hrseIcn.png" alt="Client Icon" /></div>
                            <span>{client.last_lesson.horse_name}</span>
                          </td>
                          <td>{client.last_lesson.lesson_status_name}</td>
                          <td>
                            {client.last_lesson.paid ? <span className="checkMark">&#10004;</span> : ''}
                          </td>
                        </tr> : <tr></tr>
                      }
                    </tbody>
                  </table>

                  <h1>Upcoming Lessons</h1>
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
                    { client.upcoming_lessons.map((upcoming_lesson, index) => {
                      return (
                          <tr key={index}>
                            <td><span className="first">{this.getDayText(upcoming_lesson.scheduled_date)}, {this.getMonthText(upcoming_lesson.scheduled_date)} {this.getDateText(upcoming_lesson.scheduled_date)}, {this.getYearText(upcoming_lesson.scheduled_date)}</span><br/>{this.getHourAMPM(upcoming_lesson.scheduled_starttime)} - {this.getHourAMPM(upcoming_lesson.scheduled_endtime)}</td>
                            <td><a href="javascript:;"><span className="first">{upcoming_lesson.name}</span></a></td>
                            <td>
                              <div className="clientIcn staffIcn"><img className="clientIcn staffIcn" src="/assets/staffIcn.png" alt="Client Icon" /></div>
                              <span>{upcoming_lesson.instructor_name}</span>
                            </td>
                            <td>
                              <div className="clientIcn hrseIcn"><img className="clientIcn hrseIcn" src="/assets/hrseIcn.png" alt="Client Icon" /></div>
                              <span>{upcoming_lesson.horse_name}</span>
                            </td>
                            <td>{upcoming_lesson.lesson_status_name}</td>
                            <td>
                              {upcoming_lesson.paid ? <span className="checkMark">&#10004;</span> : ''}
                            </td>
                          </tr>
                      );
                    })
                    }
                    </tbody>
                  </table>

                  <h1>Makeup Lessons</h1>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Lesson Name</th>
                        <th>Missed Lesson</th>
                        <th>Makeup Lesson Expires On</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={noneDisplayStyle}>
                        <td><a href="javascript:;"><span className="first">Beginner Lesson Group 1</span></a></td>
                        <td><span className="first">Fri, Aug 25, 2017</span></td>
                        <td><span className="first">Fri, Sep 8, 2017</span></td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="bbsnglBtn primaryBtn">
                    {client.student ?
                      <Link to={'/lesson_view?client_id=' + client.student.id} className="btn btn-primary">View all lessons</Link>
                      :<a href="javascript:;" className="btn btn-primary">View all lessons</a>
                    }
                  </div>
        
                </div>
              </div>
              <div className="col-lg-4 col-sm-4">
                <div className="sectionHeader">
                  <h3>INCLUDED ON BILL</h3>
                </div>
                <div className="sectionContent">
                  <div className="contentTitle">
                    <span>Students</span>
                  </div>
                  <div className="contentItems">
                    { client.billings.map((billing, index) => {
                      return (
                          <div className="contentItem" key={index}>
                            <a href="javascript:;">
                              <div className="clientIcn">
                                <img className="clientIcn" src="/assets/clientIcn.png" alt="Client Icon" />
                              </div>
                              {billing.person_name}
                            </a>
                          </div>
                      );
                    })
                    }
                  </div>
                </div>
              </div>
            </div>
            {/* End >> Lessons */}

            {/* Start >> Notes */}
            <div className="rghtContentSection row">
              <div className="col-lg-12 col-sm-12">
                <div className="sectionHeader">
                  <h3>NOTES</h3>
                </div>
                <div className="sectionContent">
                  <div className="contentTitle">
                    <span>Notes are only visible to you</span>
                  </div>
                  <p></p>
                </div>
              </div>
            </div>
            {/* End >> Notes */}

            {/* Start >> Client & Billing details */}
            <div className="rghtContentSection row">
              <div className="col-lg-6 col-sm-6">
                <div className="sectionHeader">
                  <h3>CLIENT DETAILS</h3>
                </div>
                <div className="sectionContent">
                  <div className="contentTitle">
                    <span>Mailing Address</span>
                  </div>

                  <p>{client.person.address1}</p>
                  <p>{client.person.state_province}, {client.person.city} {client.person.country}</p>

                  <div className="contentTitle">
                    <span>Home Phone</span>
                  </div>

                  <p>{client.person.person_homephone}</p>

                  <div className="contentTitle">
                    <span>Cell Phone</span>
                  </div>

                  <p>{client.person.person_mobile}</p>

                  <div className="contentTitle">
                    <span>Emergency Contact</span>
                  </div>

                  <p></p>
                  <p></p>
                </div>
              </div>
              <div className="col-lg-6 col-sm-6">
                <div className="sectionHeader">
                  <h3>BILLING DETAILS</h3>
                </div>
                <div className="sectionContent">
                  <div className="contentTitle">
                    <span>Send all invoices and billing correspondence to</span>
                  </div>

                  <p>Client</p>

                  <div className="contentTitle">
                    <span>Preferred billing method</span>
                  </div>

                  <p>Check</p>
                </div>
              </div>
            </div>
            {/* End >> Client & Billing details */}

            {/* Start >> Buttons */}
            <div className="rghtContentSection row col-lg-offset-3 col-sm-offset-3">
              <div className="btmBtns col-lg-4 col-sm-4">
                <div className="bbsnglBtn primaryBtn">
                  <button type="button">Contact client</button>
                </div>
              </div>
              <div className="btmBtns col-lg-4 col-sm-4">
                <div className="bbsnglBtn orangeBtn">
                  <button type="button">Edit client</button>
                </div>
              </div>
            </div>
            {/* End >> Buttons */}

          </div>
          {/* End >>> Content of Right Content */}
        </div>

        <FooterContainer/>

        </div>
      );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    client: state.client
  }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({getClientData: LessonAction.getClientData, }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ClientDetailsContainer);
