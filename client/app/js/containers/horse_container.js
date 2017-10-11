import React, { Component }         from 'react';
import { connect }                  from 'react-redux';
import AtomicForm                   from 'atomic-form';
import { bindActionCreators }       from 'redux';
import LessonAction                 from '../actions/lesson';
import Modal                        from 'simple-react-modal';
import BaseComponent                from '../components/base_component';
import { Link }                     from 'react-router';
import FooterContainer              from './footer_container';

var flag = 0;
class HorseContainer extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.state = this.getState();
  }
  getState() {
    //Optional - Set form initial data.
    return {
      initialData: {
        horse_id: '',
        week: ''
      },
      openModel: false,
      setNohoursCount: 0,
      horsesReportCount: 0,
      isHorseSelected: false,
      value: null
    };
  }

  componentWillMount() {
    this.props.getHorses();
    this.props.getHorsesReport(this.state.initialData);
  }

  componentDidMount() {}

  onFilter(e) {
    var self = this
    const initialData = self.state.initialData;
    var key = e.target.name;
    initialData[key] = e.target.value;
    self.setState({isHorseSelected: true, initialData }, function() {
      this.props.getHorsesReport(initialData);
    });
    flag = 0;
    this.setState({isHorseSelected: e.target.value ? true : false})
  }

  averageDayPerHorse(chartData) {
    if (chartData) {
      if (chartData.day_off_count <= 0) {
        return 0;
      } else {
        return chartData.day_off_count / chartData.filter_data.used_horse_count;
      }
    }
  }

  generateBlankTr(horse, parentIndex){
    return (
      <tr key={horse.date}>
        { parentIndex === 0 && 
          <td className="rowTitle" rowSpan="7">
            <div className="iconWrap greenHorse">
              <img src={'/assets/hrseIcn.png'} className="" />
            </div>
              <span>{horse.horse_name}</span>
          </td>
        }
        <td>{horse.date}</td>            
        <td><img src={'/assets/noHorses.png'} className="noHorseImg" /></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    )
  }
  generateDataTr(horse, parentIndex, index) {
    return (
      <tr key={index}>
        { parentIndex === 0 && 
          <td className="rowTitle" rowSpan="7">
            <div className="iconWrap greenHorse">
              <img src={'/assets/hrseIcn.png'} className="" />
            </div>
              <span>{horse.horse_name}</span>
          </td>
        }
        <td>{horse.scheduled_date}<br />{horse.start_time} - {horse.end_time}</td>
        <td>{horse.lesson_name}</td>
        <td>
          <span className="user-icon redHorse"><img className="icon" src="/assets/staffIcn.png"/></span>
          <span>{horse.instructor_name}</span>
        </td>
        <td>{"-"}</td>
        <td>{horse.lesson_notes}</td>
      </tr>
    )
  }

  createHorsesDay(horseRecords, day) {
    const horseIndex = _.findIndex(horseRecords, function(o) {
      return o.day === day;
    });

    var horseRecord = '';
    if (horseIndex >= 0) {
      horseRecord = horseRecords[horseIndex];
    } else {
      horseRecord = [];
    }

    if (horseRecord.day === day && horseRecord !== []) {
      if (horseRecord.count > 2) {
        return (
          <td>
            <img src={'/assets/horseGreenBig.png'} className="horseGreenBig" />
            <img
              src={'/assets/horseGreenAddBig.png'}
              className="horseAddIcon"
            />
          </td>
        );
      } else {
        var indents = [];
        for (var i = 0; i < horseRecord.count; i++) {
          indents.push(
            <img
              key={i}
              src={'/assets/horseGreenBig.png'}
              className="horseGreenBig"
            />
          );
        }
        return <td>{indents}</td>;
      }
    } else {
      return (
        <td>
          <img src={'/assets/noHorses.png'} className="noHorseImg" />
        </td>
      );
    }
  }

  render() {
    var horses = _.map(this.props.horses);
    var week = _.map(this.props.week);
    var horsesReport = _.map(this.props.horsesReport);
    var horsesWeeklyReport = _.map(this.props.horsesWeeklyReport);
    var chartData = this.props.chartData;
    var startDate = this.props.startDate;
    var endDate = this.props.endDate;
    var daysWorkedCount = this.props.daysWorkedCount;
    var daysOffCount= this.props.daysOffCount;
    
    var App = React.createClass({
      getInitialState() {
        return {
          donutval: this.props.horseUse ?  parseInt(this.props.donutval) : parseFloat(parseFloat(this.props.donutval).toFixed(2))
        };
      },
      updateVal(e) {
        this.setState({ donutval: e.target.value });
      },

      render() {
        return (
          <div>
            <DonutChart
              isHorseUsedThisWeek={this.props.horseUse}
              totalHorses={this.props.totalHorses}
              value={this.state.donutval || 0}
            />
          </div>
          
        );
      }
    });

    const DonutChart = React.createClass({
      propTypes: {
        value: React.PropTypes.number, // value the chart should show
        valuelabel: React.PropTypes.string, // label for the chart
        size: React.PropTypes.number, // diameter of chart
        strokewidth: React.PropTypes.number // width of chart line
      },
      getDefaultProps() {
        return {
          value: 0,
          valuelabel: 'Completed',
          size: 100,
          strokewidth: 10
        };
      },
      createMarkup() {
        return { __html: '/' + this.props.totalHorses };
      },
      render() {
        const halfsize = this.props.size * 0.5;
        const radius = halfsize - this.props.strokewidth * 0.5;
        const circumference = 2 * Math.PI * radius;
        const strokeval = this.props.value * circumference / 10;
        const dashval = strokeval + ' ' + circumference;

        const trackstyle = { strokeWidth: this.props.strokewidth };
        const indicatorstyle = {
          strokeWidth: this.props.strokewidth,
          strokeDasharray: dashval
        };
        const rotateval = 'rotate(-90 ' + halfsize + ',' + halfsize + ')';

        return (
          <svg
            width={this.props.size}
            height={this.props.size}
            className="donutchart"
          >
            <circle
              r={radius}
              cx={halfsize}
              cy={halfsize}
              transform={rotateval}
              style={trackstyle}
              className="donutchart-track"
            />
            <circle
              r={radius}
              cx={halfsize}
              cy={halfsize}
              transform={rotateval}
              style={indicatorstyle}
              className="donutchart-indicator"
            />
            <text
              className="donutchart-text"
              x={halfsize}
              y={halfsize}
              style={{ textAnchor: 'middle' }}
            >
              <tspan className="donutchart-text-val">{this.props.value}</tspan>
              {this.props.isHorseUsedThisWeek ? (
                <tspan
                  className="donutchart-text-val"
                  dangerouslySetInnerHTML={this.createMarkup()}
                />
              ) : (
                ''
              )}
              <tspan
                className="donutchart-text-label"
                x={halfsize}
                y={halfsize + 10}
              />
            </text>
          </svg>
        );
      }
    });

    document.querySelector('#main');
    document.querySelector('#main1');

    return (
      <div className="rightMain">
        <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
          <div className="rghtHeadTop clearfix">
            <h1>Horses Workload</h1>
            <div className="rhtSrch">
              <form>
                <input
                  type="text"
                  placeholder="Search Horses"
                  className="test"
                />
                <button type="submit" />
              </form>
            </div>
          </div>
          <div className="rghtCalCntnr">
            <div className="rccInr">
              <div className="addHorseRowWrap">
                <div className="col-sm-6 col-xs-12 breadcrumbWrap">
                  <ol className="breadcrumb">
                    <li>
                      <a href="#">Horses</a>
                    </li>
                    <li className="active">Horse Workload</li>
                  </ol>
                </div>
                <div className="col-sm-6 col-xs-12 addHorsesWrap">
                  <div className="addLsn addHorses">
                    <Link to='/dashboard'>Back to Dashboard</Link>
                  </div>
                </div>
              </div>

              <div className="loginCnt">
                <div className="horseTableContainer">
                  <div className="filterRowWrap">
                    <h2 className="filterTitle">Details For {week}</h2>
                    <div className="horseSelectBoxWrap">
                      <h5>Week</h5>
                      <div className="form-group selectpicker">
                        <div className="input-group" id="DateDemo">
                          <input
                            type="text"
                            id="weeklyDatePicker"
                            placeholder="Select Week"
                            name="week"
                            onBlur={e => {
                              this.onFilter(e);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="filterBoxWrap">
                      <div className="filterBox">
                        <div className="titleBar">
                          <h4 className="text-uppercase">
                            horses used this week
                          </h4>
                        </div>
                        <div className="contentWrap">
                          <img
                            src={'/assets/chart-horse.png'}
                            className="chartHorseIcon"
                          />

                          <App
                            donutval={
                              chartData &&
                              chartData.filter_data.used_horse_count
                            }
                            totalHorses={chartData && chartData.total_horses}
                            horseUse="true"
                          />
                          <div id="main1" />
                        </div>
                      </div>
                      <div className="filterBox">
                        <div className="titleBar">
                          <h4 className="text-uppercase">
                            Average lessons per horse
                          </h4>
                        </div>
                        <div className="contentWrap">
                          <img
                            src={'/assets/chart-horse.png'}
                            className="chartHorseIcon"
                          />
                          <App
                            donutval={
                              chartData &&
                              chartData.filter_data.avarage_lessons_per_horse
                            }
                          />
                          <div id="main1" />
                        </div>
                      </div>
                      <div className="filterBox">
                        <div className="titleBar">
                          <h4 className="text-uppercase">
                            Average days off per horse
                          </h4>
                        </div>
                        <div className="contentWrap">
                          <img
                            src={'/assets/chart-horse.png'}
                            className="chartHorseIcon"
                          />
                          <App donutval={this.averageDayPerHorse(chartData)} />
                          <div id="main1" />
                        </div>
                      </div>
                      <div className="filterBox">
                        <div className="titleBar">
                          <h4 className="text-uppercase">
                            Horses with no days off
                          </h4>
                        </div>
                        <div className="contentWrap">
                          <img
                            src={'/assets/chart-horse.png'}
                            className="chartHorseIcon"
                          />

                          <App
                            donutval={
                              chartData && chartData.horse_with_no_days_off
                            }
                          />
                          <div id="main1" />
                        </div>
                      </div>
                      <div className="filterBox">
                        <div className="titleBar">
                          <h4 className="text-uppercase">
                            Horses with 10+ lessons
                          </h4>
                        </div>
                        <div className="contentWrap">
                          <img
                            src={'/assets/chart-horse.png'}
                            className="chartHorseIcon"
                          />
                          <App
                            donutval={chartData && chartData.more_than_10_count}
                          />
                          <div id="main1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <h2 className="filterTitle">Details For {week}</h2>
                  <div className="horseSelectBoxWrap">
                    <h5>Horse</h5>
                    <select
                      className="form-control horseSelectBox selectpicker"
                      onChange={e => {
                        this.onFilter(e);
                      }}
                      name="horse_id"
                    >
                      <option value="">All</option>
                      {horses.map(horse => (
                        <option key={horse.id} value={horse.id}>
                          {horse.horse_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {!this.state.isHorseSelected && 
                    <div>
                      <div className="table-responsive hidden-xs">
                        <table className="table horseTable">
                          <thead className="headRow">
                            <tr>
                              <th className="text-uppercase">lessons</th>
                              <th colSpan="7" />
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="columnTitle">Horse</td>
                              <td className="text-uppercase columnTitle">SUN</td>
                              <td className="text-uppercase columnTitle">MON</td>
                              <td className="text-uppercase columnTitle">TUE</td>
                              <td className="text-uppercase columnTitle">WED</td>
                              <td className="text-uppercase columnTitle">THU</td>
                              <td className="text-uppercase columnTitle">FRI</td>
                              <td className="text-uppercase columnTitle">SAT</td>
                            </tr>
                            {horsesReport.map((horse, index) => (
                              <tr key={index} data-status={horse[0]['horse_name']}>
                                <td className="rowTitle">
                                  <div className="iconWrap blueHorse">
                                    <img src={'/assets/hrseIcn.png'} className="" />
                                  </div>
                                  <span>{horse[0]['horse_name']}</span>
                                </td>
                                {this.createHorsesDay(horse, 'Sunday')}
                                {this.createHorsesDay(horse, 'Monday')}
                                {this.createHorsesDay(horse, 'Tuesday')}
                                {this.createHorsesDay(horse, 'Wednesday')}
                                {this.createHorsesDay(horse, 'Thursday')}
                                {this.createHorsesDay(horse, 'Friday')}
                                {this.createHorsesDay(horse, 'Saturday')}
                              </tr>
                            ))}
                            <tr>
                              <td className="textItalic">
                                {horsesReport.length} horses
                              </td>
                              <td colSpan="7" />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="table-responsive visible-xs">
                        <table className="table horseTable">
                          <thead className="headRow">
                            <tr>
                              <th className="text-uppercase">lessons</th>
                              <th colSpan="7" />
                            </tr>
                          </thead>
                          <tbody>
                            {horsesReport.map((horse, index) => (
                              <tr key={index}>
                                <td className="rowTitle">
                                  <div className="iconWrap blueHorse">
                                    <img src={'/assets/hrseIcn.png'} className="" />
                                  </div>
                                  <span>{horse[0]['horse_name']}</span>
                                </td>
                                <td>
                                  <span className="colorGreen">{horse.length}</span>
                                  <img
                                    src={'/assets/hrseIcnGreenSmall.png'}
                                    className=""
                                  />
                                </td>
                                <td>
                                  <span>{7 - horse.length}</span>
                                  <img
                                    src={'/assets/noHorses.png'}
                                    className="noHorseImg"
                                  />
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td className="textItalic">
                                {horsesReport.length} horses
                              </td>
                              <td colSpan="7" />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  }
                  {this.state.isHorseSelected && 
                    <div>
                      <div className="table-responsive">
                        <table className="table horseTable">
                          <thead className="headRow">
                            <tr>
                              <th className="text-uppercase">lessons</th>
                              <th colSpan="7" />
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="columnTitle">Horse</td>
                              <td className="columnTitle">Date and Time</td>
                              <td className="columnTitle">Lesson Name</td>
                              <td className="columnTitle">Instructor</td>
                              <td className="columnTitle">Assigned To</td>
                              <td className="columnTitle">Horse Notes</td>
                            </tr>
                            { horsesWeeklyReport.map((horses, parentIndex) => (
                              horses[0].date ? 
                                (
                                  this.generateBlankTr(horses[0], parentIndex)
                                ) : 
                                (
                                  horses.map((horse, index) => (
                                    this.generateDataTr(horse,parentIndex,index)
                                  )
                                )
                              )
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="filterBottomDetailWrap">
                        <div className="FilterbottomTable">
                          <div className="table-responsive">
                            <table className="table horseTable">
                              <tbody>
                                <tr>
                                  <td className="text-uppercase columnTitle">SUN</td>
                                  <td className="text-uppercase columnTitle">MON</td>
                                  <td className="text-uppercase columnTitle">TUE</td>
                                  <td className="text-uppercase columnTitle">WED</td>
                                  <td className="text-uppercase columnTitle">THU</td>
                                  <td className="text-uppercase columnTitle">FRI</td>
                                  <td className="text-uppercase columnTitle">SAT</td>
                                </tr>
                                {horsesReport.map((horse, index) => (
                                  <tr key={index}>
                                    {this.createHorsesDay(horse, 'Sunday')}
                                    {this.createHorsesDay(horse, 'Monday')}
                                    {this.createHorsesDay(horse, 'Tuesday')}
                                    {this.createHorsesDay(horse, 'Wednesday')}
                                    {this.createHorsesDay(horse, 'Thursday')}
                                    {this.createHorsesDay(horse, 'Friday')}
                                    {this.createHorsesDay(horse, 'Saturday')}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="horseFilterDetail">
                            <div className="blockRow">
                              <span className="nameDetail">
                                Lessons
                              </span>
                              <span className="numDetail">
                                {chartData &&
                                chartData.filter_data.total_lessons}                              
                              </span>
                            </div>
                            <div className="blockRow">
                              <span className="nameDetail">
                                Days Worked
                              </span>
                              <span className="numDetail">
                                {daysWorkedCount}
                              </span>
                            </div>
                            <div className="blockRow">                            
                              <span className="nameDetail">
                                Days Off
                              </span>
                              <span className="numDetail">
                                {daysOffCount}
                              </span>
                              </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
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
    horses: state.horses,
    horsesReport: state.horsesReport && state.horsesReport.horses_report,
    horsesWeeklyReport: state.horsesReport && state.horsesReport.horses_weekly_report,
    week: state.horsesReport && state.horsesReport.week,
    chartData: state.horsesReport && state.horsesReport.chart_data,
    startDate: state.horsesReport && state.horsesReport.start_date,
    endDate: state.horsesReport && state.horsesReport.end_date,
    daysOffCount:  state.horsesReport && state.horsesReport.days_off_count,
    daysWorkedCount:  state.horsesReport && state.horsesReport.days_worked_count
  };
};

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getHorses: LessonAction.getHorses,
      getHorsesReport: LessonAction.getHorsesReport
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(HorseContainer);
