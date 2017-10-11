import React, {Component}           from 'react';
import {connect}                    from 'react-redux';
import AtomicForm                   from "atomic-form";
import { bindActionCreators }       from 'redux';
import { browserHistory }           from 'react-router';
import { RadioGroup, Radio }        from 'react-radio-group'
import { Button }                   from 'react-bootstrap'
import ReactSelect                  from 'react-select';
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

class ProgramCreateContainer extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      // programDetails: {}
      programName: '',
      programCode: '',
      programDescription: '',
      program_type: '',
      reporting_category: '',
      programDuration: '',
      default_product: '',
      default_instructor: '',
      default_farm: '',
      default_location: '',
      msg: 'New program has been added successfully!',
      url: '/programs',
    };

    this.onChangeByKey = this.onChangeByKey.bind(this);
    this.onSelectByKey = this.onSelectByKey.bind(this);

    this.submitCreateProgram = this.submitCreateProgram.bind(this);

  }

  componentDidMount() {
    let component = this;
    validate (this.form, {
      rules: {
        programName: {
          required: true,
        },
      },
      messages: {
        programName: {
          required: 'Please insert program name.',
        },
      },
      submitHandler() { component.submitCreateProgram(); }
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
    this.props.getProgramTypes();
    this.props.getReportingCategories();
    this.props.getProducts();
    this.props.getInstructors();
    this.props.getFarms();
    this.props.getLocations();
  }

  submitCreateProgram() {

    let formData = {
      programName: this.state.programName,
      programCode: this.state.programCode,
      programDescription: this.state.programDescription,
      program_type: this.state.program_type,
      reporting_category: this.state.reporting_category,
      programDuration: this.state.programDuration,
      default_product: this.state.default_product,
      default_instructor: this.state.default_instructor,
      default_farm: this.state.default_farm,
      default_location: this.state.default_location
    };

    console.log("Form Data", formData);
    this.props.createProgram(formData);

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.createProgramStatus) {
      this.refs.modalTemp.show();
    }
  }

  render() {

    console.log("ALL DATA:", this.props);
    console.log("createProgramStatus:", this.props.createProgramStatus);

    var noneDisplayStyle = {
      display: 'none'
    };

    const options_programType = [];
    Object.keys(this.props.programTypes).map(key => {
      var tmp = {value: this.props.programTypes[key].id, label: this.props.programTypes[key].program_type_name};
      options_programType.push(tmp);
    });

    const options_reportingCategory = [];
    Object.keys(this.props.reportingCategories).map(key => {
      var tmp = {value: this.props.reportingCategories[key].id, label: this.props.reportingCategories[key].reporting_category_name};
      options_reportingCategory.push(tmp);
    });

    const options_defaultProduct = [];
    Object.keys(this.props.products).map(key => {
      var tmp = {value: this.props.products[key].id, label: this.props.products[key].product_name};
      options_defaultProduct.push(tmp);
    });

    const options_defaultInstructor = [];
    Object.keys(this.props.instructors).map(key => {
      var tmp = {value: this.props.instructors[key].id, label: this.props.instructors[key].instructor_name};
      options_defaultInstructor.push(tmp);
    });
    
    const options_defaultFarm = [];
    Object.keys(this.props.farms).map(key => {
      var tmp = {value: this.props.farms[key].id, label: this.props.farms[key].farm_name};
      options_defaultFarm.push(tmp);
    });

    const options_defaultLocation = [];
    Object.keys(this.props.locations).map(key => {
      var tmp = {value: this.props.locations[key].id, label: this.props.locations[key].location_name};
      options_defaultLocation.push(tmp);
    });

    return (

      <div className="rightMain">
        <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
          <div className="rghtHeadTop clearfix">
            <h1>Add a Program</h1>
          </div>
          <div className="rghtCalCntnr clearfix dashboard">

            <div className="rccInr">
              <h5 className="addCnt_title">Programs > Add a Program</h5>
              <div className="addCnt">
                <Link to='/programs'>Back to Lists</Link>
              </div>
            </div>
          </div>
          <div className="rghtCntTop clearfix"></div>
          <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
              <div className="addcnt_info">
                <div className="addcnt_detail">
                  <div className="addcnt_title">
                    <h2>program details</h2>
                  </div>
                  <div className="cnt_detail">
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Name*</label>
                      <input type="text" placeholder="" id="cnt_programname" name="programName" className="cnt_programname cnt_input form-control" value={this.state.programName} ref={programName => (this.programName = programName)} onChange={(e) => this.onChangeByKey("programName", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Code</label>
                      <input type="text" placeholder="" id="cnt_program_code" name="programCode" className="cnt_programcode cnt_input form-control" value={this.state.programCode} ref={programCode => (this.programCode = programCode)} onChange={(e) => this.onChangeByKey("programCode", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Description</label>
                      <input type="text" placeholder="" id="cnt_program_description" name="programDescription" className="cnt_programdescription cnt_input form-control" value={this.state.programDescription} ref={programDescription => (this.programDescription = programDescription)} onChange={(e) => this.onChangeByKey("programDescription", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <div className="program_type">
                        <label className="cnt_label">Type</label>
                        <ReactSelect
                          name="program_type"
                          className="cnt_select"
                          value={this.state.program_type}
                          options={options_programType}
                          onChange={(e) => this.onSelectByKey("program_type", e)}
                          clearable={false}
                          simpleValue={true}
                          searchable={false}
                        />
                      </div>
                    </div>
                    <div className="padding_bottom_25">
                      <div className="reporting_category">
                        <label className="cnt_label">Reporting Category</label>
                        <ReactSelect
                          name="reporting_category"
                          className="cnt_select"
                          value={this.state.reporting_category}
                          options={options_reportingCategory}
                          onChange={(e) => this.onSelectByKey("reporting_category", e)}
                          clearable={false}
                          simpleValue={true}
                          searchable={false}
                        />
                      </div>
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Duration</label>
                      <input type="number" placeholder="" id="cnt_programduration" name="programDuration" className="cnt_programduration cnt_input form-control" value={this.state.programDuration} ref={programDuration => (this.programDuration = programDuration)} onChange={(e) => this.onChangeByKey("programDuration", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <div className="default_product">
                        <label className="cnt_label">Product</label>
                        <ReactSelect
                          name="default_product"
                          className="cnt_select"
                          value={this.state.default_product}
                          options={options_defaultProduct}
                          onChange={(e) => this.onSelectByKey("default_product", e)}
                          clearable={false}
                          simpleValue={true}
                          searchable={false}
                        />
                      </div>
                    </div>
                    <div className="padding_bottom_25">
                      <div className="default_instructor">
                        <label className="cnt_label">Instructor</label>
                        <ReactSelect
                          name="default_instructor"
                          className="cnt_select"
                          value={this.state.default_instructor}
                          options={options_defaultInstructor}
                          onChange={(e) => this.onSelectByKey("default_instructor", e)}
                          clearable={false}
                          simpleValue={true}
                          searchable={false}
                        />
                      </div>
                    </div>
                    <div className="padding_bottom_25">
                      <div className="default_farm">
                        <label className="cnt_label">Farm</label>
                        <ReactSelect
                          name="default_farm"
                          className="cnt_select"
                          value={this.state.default_farm}
                          options={options_defaultFarm}
                          onChange={(e) => this.onSelectByKey("default_farm", e)}
                          clearable={false}
                          simpleValue={true}
                          searchable={false}
                        />
                      </div>
                    </div>
                    <div className="padding_bottom_25">
                      <div className="default_location">
                        <label className="cnt_label">Location</label>
                        <ReactSelect
                          name="default_location"
                          className="cnt_select"
                          value={this.state.default_location}
                          options={options_defaultLocation}
                          onChange={(e) => this.onSelectByKey("default_location", e)}
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
                    Add new program
                  </Button>
                  <Link to='/programs'>Cancel</Link>
                </div>
              </div>
            </form>
        </div>
        <footer>
          <div className="footTop"><span><img src="assets/footerIcn.png" alt="Footer Icon" /></span></div>
          <div className="footBtm"></div>
        </footer>
        
        <FooterContainer/>
        
        <ModalTemplate ref="modalTemp" msg={this.state.msg} url={this.state.url} />

      </div>


    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    programTypes: state.programTypes,
    reportingCategories: state.reportingCategories,
    products: state.products,
    instructors: state.instructors,
    farms: state.farms,
    locations: state.locations,
    createProgramStatus: state.createProgramStatus
  }
};

function matchDispatchToProps(dispatch){
  return bindActionCreators({
    getProgramTypes: DashboardAction.getProgramTypes,
    getReportingCategories: DashboardAction.getReportingCategories,
    getProducts: DashboardAction.getProducts,
    getInstructors: getInstructors,
    getFarms: DashboardAction.getFarms,
    getLocations: getLocations,
    createProgram: DashboardAction.createProgram
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ProgramCreateContainer);
