import React, {Component}           from 'react';
import {connect}                    from 'react-redux';
import AtomicForm                   from "atomic-form";
import { bindActionCreators }       from 'redux';
import { browserHistory }           from 'react-router';
import { RadioGroup, Radio }        from 'react-radio-group'
import { Button }                   from 'react-bootstrap'
import ReactSelect                  from 'react-select';
import DatePicker                   from 'react-datepicker';
import moment                       from 'moment';
import TimePicker                   from 'rc-time-picker';

import 'react-datepicker/dist/react-datepicker.css';

import ReactSuperSelect             from 'react-super-select'
import  LessonAction                from '../actions/lesson';
import  DashboardAction             from '../actions/dashboard';
import { getInstructors }           from '../actions/instructor';
import { getLocations }             from '../actions/location';
import Modal                        from "simple-react-modal";
import BaseComponent                from '../components/base_component';
import ModalTemplate                from '../components/ModalTemplate';

import { Link }                     from 'react-router';

import validate                     from '../startup/validate';
import FooterContainer              from './footer_container';

class SectionCreateContainer extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      // sectionDetails: {}
      sectionName: '',
      program: '',
      startdate: moment(),
      enddate: moment(),
      starttime: moment(),
      endtime: moment(),
      repeat_type_value: '',
      day_of_week_value: '',
      instructor_id: '',
      location_id: '',
      max_enrollment: '',
      duration: '',
      repeat_number: '',
      product_id: '',
      current_enrollment: '',
      farm_id: '',
      msg: 'New section has been added successfully!',
      url: '/sections',
    };

    this.onChangeByKey = this.onChangeByKey.bind(this);
    this.onSelectByKey = this.onSelectByKey.bind(this);

    this.submitCreateSection = this.submitCreateSection.bind(this);

    this.handleChangeByKey = this.handleChangeByKey.bind(this);

  }

  componentDidMount() {
    let component = this;
    validate (this.form, {
      rules: {
        sectionName: {
          required: true,
        },
      },
      messages: {
        sectionName: {
          required: 'Please insert section name.',
        },
      },
      submitHandler() { component.submitCreateSection(); }
    });
  }

  handleChangeByKey(key, e) {
    this.setState({
      [key]: e
    });
  }

  onChangeByKey(key, e) {
    this.setState({ [key]: e.target.value });
  }

  onSelectByKey(key, value) {
    if(value) this.setState({ [key]: value, [`create${_.capitalize(key)}`]: false, [`selected${_.capitalize(key)}`]: true });
    else this.setState({ [`create${_.capitalize(key)}`]: true, [`selected${_.capitalize(key)}`]: true });
  }

  componentWillMount(){
    this.props.getPrograms();
    this.props.getRepeatTypes();
    this.props.getDayOfWeeks();
    this.props.getInstructors();
    this.props.getLocations();
    this.props.getProducts();
    this.props.getFarms();
  }

  submitCreateSection() {

    let formData = {
      sectionName: this.state.sectionName,
      program: this.state.program,
      startdate: this.state.startdate.format('YYYY-MM-DD'),
      enddate: this.state.enddate.format('YYYY-MM-DD'),
      starttime: this.state.starttime.format('HH:mm'),
      endtime: this.state.endtime.format('HH:mm'),
      repeat_type_value: this.state.repeat_type_value,
      day_of_week_value: this.state.day_of_week_value,
      instructor_id: this.state.instructor_id,
      location_id: this.state.location_id,
      max_enrollment: this.state.max_enrollment,
      duration: this.state.duration,
      repeat_number: this.state.repeat_number,
      product_id: this.state.product_id,
      current_enrollment: this.state.current_enrollment,
      farm_id: this.state.farm_id,
  };

    console.log("Form Data", formData);
    this.props.createSection(formData);

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.createSectionStatus) {
      this.refs.modalTemp.show();
    }
  }

  render() {

    console.log("createSectionStatus:", this.props.createSectionStatus);

    var noneDisplayStyle = {
      display: 'none'
    };

    const options_program = [];
    Object.keys(this.props.programs).map(key => {
      var tmp = {value: this.props.programs[key].id, label: this.props.programs[key].program_name};
      options_program.push(tmp);
    });

    const options_repeatType = [];
    Object.keys(this.props.repeatTypes).map(key => {
      var tmp = {value: this.props.repeatTypes[key].repeat_type_value, label: this.props.repeatTypes[key].repeat_type_name};
      options_repeatType.push(tmp);
    });

    const options_dayOfWeek = [];
    Object.keys(this.props.dayOfWeeks).map(key => {
      var tmp = {value: this.props.dayOfWeeks[key].day_of_week_value, label: this.props.dayOfWeeks[key].day_of_week_name};
      options_dayOfWeek.push(tmp);
    });

    const options_instructor = [];
    Object.keys(this.props.instructors).map(key => {
      var tmp = {value: this.props.instructors[key].id, label: this.props.instructors[key].instructor_name};
      options_instructor.push(tmp);
    });

    const options_location = [];
    Object.keys(this.props.locations).map(key => {
      var tmp = {value: this.props.locations[key].id, label: this.props.locations[key].location_name};
      options_location.push(tmp);
    });

    const options_farm = [];
    Object.keys(this.props.farms).map(key => {
      var tmp = {value: this.props.farms[key].id, label: this.props.farms[key].farm_name};
      options_farm.push(tmp);
    });

    const options_product = [];
    Object.keys(this.props.products).map(key => {
      var tmp = {value: this.props.products[key].id, label: this.props.products[key].product_name};
      options_product.push(tmp);
    });

    var datePickerStyle = {
      width: '30%', display: 'inline-block'
    };

    var timePickerStyle = {
      width: '20%', display: 'inline-block', margin: '0px 30px'
    };

    return (

      <div className="rightMain">
        <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
          <div className="rghtHeadTop clearfix">
            <h1>Add a Section</h1>
          </div>
          <div className="rghtCalCntnr clearfix dashboard">

            <div className="rccInr">
              <h5 className="addCnt_title">Sections > Add a Section</h5>
              <div className="addCnt">
                <Link to='/sections'>Back to Lists</Link>
              </div>
            </div>
          </div>
          <div className="rghtCntTop clearfix"></div>
          <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
              <div className="addcnt_info">
                <div className="addcnt_detail">
                  <div className="addcnt_title">
                    <h2>section details</h2>
                  </div>
                  <div className="cnt_detail">
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Name*</label>
                      <input type="text" placeholder="" id="cnt_sectionname" name="sectionName" className="cnt_sectionname cnt_input form-control" value={this.state.sectionName} ref={sectionName => (this.sectionName = sectionName)} onChange={(e) => this.onChangeByKey("sectionName", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <div className="program">
                        <label className="cnt_label">Program</label>
                        <ReactSelect
                          name="program"
                          className="cnt_select"
                          value={this.state.program}
                          options={options_program}
                          onChange={(e) => this.onSelectByKey("program", e)}
                          clearable={false}
                          simpleValue={true}
                          searchable={false}
                        />
                      </div>
                    </div>
                    <div className="padding_bottom_25" style={datePickerStyle}>
                      <label className="cnt_label">Start date</label>
                      <DatePicker
                        name="startdate"
                        className="cnt_input form-control"
                        selected={this.state.startdate}
                        onChange={(e) => this.handleChangeByKey("startdate", e)}
                        dateFormat="LL"
                       />
                    </div>
                    <div className="padding_bottom_25" style={timePickerStyle}>
                      <label className="cnt_label">Start time</label>
                      <TimePicker
                        name="starttime"
                        value={this.state.starttime}
                        showSecond={false}
                        onChange={(e) => this.handleChangeByKey("starttime", e)}
                      />
                    </div><br/>
                    <div className="padding_bottom_25" style={datePickerStyle}>
                      <label className="cnt_label">End date</label>
                      <DatePicker
                        name="enddate"
                        className="cnt_input form-control"
                        selected={this.state.enddate}
                        onChange={(e) => this.handleChangeByKey("enddate", e)}
                        dateFormat="LL"
                       />
                    </div>
                    <div className="padding_bottom_25" style={timePickerStyle}>
                      <label className="cnt_label">End time</label>
                      <TimePicker
                        name="endtime"
                        value={this.state.endtime}
                        showSecond={false}
                        onChange={(e) => this.handleChangeByKey("endtime", e)}
                      />
                    </div>
                    <div className="padding_bottom_25">
                      <div className="repeat_type">
                        <label className="cnt_label">Repeat type</label>
                        <ReactSelect
                          name="repeat_type"
                          className="cnt_select"
                          value={this.state.repeat_type_value}
                          options={options_repeatType}
                          onChange={(e) => this.onSelectByKey("repeat_type_value", e)}
                          clearable={false}
                          simpleValue={true}
                          searchable={false}
                        />
                      </div>
                    </div>
                    <div className="padding_bottom_25">
                      <div className="day_of_week">
                        <label className="cnt_label">Day Of Week</label>
                        <ReactSelect
                          name="day_of_week"
                          className="cnt_select"
                          value={this.state.day_of_week_value}
                          options={options_dayOfWeek}
                          onChange={(e) => this.onSelectByKey("day_of_week_value", e)}
                          clearable={false}
                          simpleValue={true}
                          searchable={false}
                        />
                      </div>
                    </div>
                    <div className="padding_bottom_25">
                      <div className="instructor">
                        <label className="cnt_label">Instructor</label>
                        <ReactSelect
                          name="instructor"
                          className="cnt_select"
                          value={this.state.instructor_id}
                          options={options_instructor}
                          onChange={(e) => this.onSelectByKey("instructor_id", e)}
                          clearable={false}
                          simpleValue={true}
                          searchable={false}
                        />
                      </div>
                    </div>
                    <div className="padding_bottom_25">
                      <div className="location">
                        <label className="cnt_label">Location</label>
                        <ReactSelect
                          name="location"
                          className="cnt_select"
                          value={this.state.location_id}
                          options={options_location}
                          onChange={(e) => this.onSelectByKey("location_id", e)}
                          clearable={false}
                          simpleValue={true}
                          searchable={false}
                        />
                      </div>
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Max enrollment</label>
                      <input type="number" placeholder="" id="cnt_maxenrollment" name="max_enrollment" className="cnt_maxenrollment cnt_input form-control" value={this.state.max_enrollment} ref={max_enrollment => (this.max_enrollment = max_enrollment)} onChange={(e) => this.onChangeByKey("max_enrollment", e)} />
                    </div>

                    <div className="padding_bottom_25">
                      <label className="cnt_label">Duration</label>
                      <input type="number" placeholder="" id="cnt_duration" name="duration" className="cnt_duration cnt_input form-control" value={this.state.duration} ref={duration => (this.duration = duration)} onChange={(e) => this.onChangeByKey("duration", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Repeat number</label>
                      <input type="number" placeholder="" id="cnt_repeatnumber" name="repeat_number" className="cnt_repeatnumber cnt_input form-control" value={this.state.repeat_number} ref={repeat_number => (this.repeat_number = repeat_number)} onChange={(e) => this.onChangeByKey("repeat_number", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <div className="product">
                        <label className="cnt_label">Product</label>
                        <ReactSelect
                          name="product"
                          className="cnt_select"
                          value={this.state.product_id}
                          options={options_product}
                          onChange={(e) => this.onSelectByKey("product_id", e)}
                          clearable={false}
                          simpleValue={true}
                          searchable={false}
                        />
                      </div>
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Current enrollment</label>
                      <input type="number" placeholder="" id="cnt_currentenrollment" name="current_enrollment" className="cnt_currentenrollment cnt_input form-control" value={this.state.current_enrollment} ref={current_enrollment => (this.current_enrollment = current_enrollment)} onChange={(e) => this.onChangeByKey("current_enrollment", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <div className="farm">
                        <label className="cnt_label">Farm</label>
                        <ReactSelect
                          name="farm"
                          className="cnt_select"
                          value={this.state.farm_id}
                          options={options_farm}
                          onChange={(e) => this.onSelectByKey("farm_id", e)}
                          clearable={false}
                          simpleValue={true}
                          searchable={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="cnt_submit">
                  <label>* These fields are required.</label>
                  <br/>
                  <Button type="submit" className="btn_submit">
                    Add new section
                  </Button>
                  <Link to='/sections'>Cancel</Link>
                </div>
              </div>
            </form>
        </div>
        
        <FooterContainer/>
        
        <ModalTemplate ref="modalTemp" msg={this.state.msg} url={this.state.url} />

      </div>

    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    programs: state.programs,
    repeatTypes: state.repeatTypes,
    dayOfWeeks: state.dayOfWeeks,
    instructors: state.instructors,
    locations: state.locations,
    products: state.products,
    farms: state.farms,
    createSectionStatus: state.createSectionStatus
  }
};

function matchDispatchToProps(dispatch){
  return bindActionCreators({
    getPrograms: DashboardAction.getPrograms,
    getRepeatTypes: DashboardAction.getRepeatTypes,
    getDayOfWeeks: DashboardAction.getDayOfWeeks,
    getInstructors: getInstructors,
    getLocations: getLocations,
    getProducts: DashboardAction.getProducts,
    getFarms: DashboardAction.getFarms,
    createSection: DashboardAction.createSection
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(SectionCreateContainer);
