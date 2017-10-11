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
import Modal                        from "simple-react-modal";
import BaseComponent                from '../components/base_component';
import ModalTemplate                from '../components/ModalTemplate';

import { Link }                     from 'react-router';

import validate                     from '../startup/validate';
import FooterContainer              from './footer_container';

class ReportingCategoryCreateContainer extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      // reportingCategoryDetails: {}
      reportingCategoryName: '',
      locationCode: '',
      msg: 'New reporting category has been added successfully!',
      url: '/reportingCategories',
    };

    this.onChangeByKey = this.onChangeByKey.bind(this);
    this.onSelectByKey = this.onSelectByKey.bind(this);

    this.submitCreateReportingCategory = this.submitCreateReportingCategory.bind(this);

  }

  componentDidMount() {
    let component = this;
    validate (this.form, {
      rules: {
        reportingCategoryName: {
          required: true,
        },
      },
      messages: {
        reportingCategoryName: {
          required: 'Please insert reporting category name.',
        },
      },
      submitHandler() { component.submitCreateReportingCategory(); }
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
  }

  submitCreateReportingCategory() {

    let formData = {
      reportingCategoryName: this.state.reportingCategoryName,
      locationCode: this.state.locationCode,
    };

    console.log("Form Data", formData);
    this.props.createReportingCategory(formData);

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.createReportingCategoryStatus) {
      this.refs.modalTemp.show();
    }
  }

  render() {

    console.log("createReportingCategoryStatus:", this.props.createReportingCategoryStatus);

    var noneDisplayStyle = {
      display: 'none'
    };

    return (

      <div className="rightMain">
        <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
          <div className="rghtHeadTop clearfix">
            <h1>Add a Reporting Category</h1>
          </div>
          <div className="rghtCalCntnr clearfix dashboard">

            <div className="rccInr">
              <h5 className="addCnt_title">Reporting Categories > Add a Reporting Category</h5>
              <div className="addCnt">
                <Link to='/reportingCategories'>Back to Lists</Link>
              </div>
            </div>
          </div>
          <div className="rghtCntTop clearfix"></div>
          <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
              <div className="addcnt_info">
                <div className="addcnt_detail">
                  <div className="addcnt_title">
                    <h2>reporting catetory details</h2>
                  </div>
                  <div className="cnt_detail">
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Name*</label>
                      <input type="text" placeholder="" id="cnt_reportingcategoryname" name="reportingCategoryName" className="cnt_reportingcategoryname cnt_input form-control" value={this.state.reportingCategoryName} ref={reportingCategoryName => (this.reportingCategoryName = reportingCategoryName)} onChange={(e) => this.onChangeByKey("reportingCategoryName", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Code</label>
                      <input type="text" placeholder="" id="cnt_locationcode" name="locationCode" className="cnt_locationcode cnt_input form-control" value={this.state.locationCode} ref={locationCode => (this.locationCode = locationCode)} onChange={(e) => this.onChangeByKey("locationCode", e)} />
                    </div>
                  </div>
                </div>

                <div className="cnt_submit">
                  <label>* These fields are required.</label>
                  <br/>
                  <Button type="submit" className="btn_submit">
                    Add new reporting category
                  </Button>
                  <Link to='/reportingCategories'>Cancel</Link>
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
    createReportingCategoryStatus: state.createReportingCategoryStatus
  }
};

function matchDispatchToProps(dispatch){
  return bindActionCreators({
    createReportingCategory: DashboardAction.createReportingCategory
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ReportingCategoryCreateContainer);
