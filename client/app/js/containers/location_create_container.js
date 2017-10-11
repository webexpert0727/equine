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

class LocationCreateContainer extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      // locationDetails: {}
      locationName: '',
      locationCode: '',
      farm: '',
      msg: 'New location has been added successfully!',
      url: '/locations',
    };

    this.onChangeByKey = this.onChangeByKey.bind(this);
    this.onSelectByKey = this.onSelectByKey.bind(this);

    this.submitCreateLocation = this.submitCreateLocation.bind(this);

  }

  componentDidMount() {
    let component = this;
    validate (this.form, {
      rules: {
        locationName: {
          required: true,
        },
      },
      messages: {
        locationName: {
          required: 'Please insert location name.',
        },
      },
      submitHandler() { component.submitCreateLocation(); }
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
    this.props.getFarms();
  }

  submitCreateLocation() {

    let formData = {
      locationName: this.state.locationName,
      locationCode: this.state.locationCode,
      farm: this.state.farm,
    };

    console.log("Form Data", formData);
    this.props.createLocation(formData);

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.createLocationStatus) {
      this.refs.modalTemp.show();
    }
  }

  render() {

    console.log("createLocationStatus:", this.props.createLocationStatus);

    var noneDisplayStyle = {
      display: 'none'
    };

    const options_farm = [];
    Object.keys(this.props.farms).map(key => {
      var tmp = {value: this.props.farms[key].id, label: this.props.farms[key].farm_name};
      options_farm.push(tmp);
    });

    return (

      <div className="rightMain">
        <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
          <div className="rghtHeadTop clearfix">
            <h1>Add a Location</h1>
          </div>
          <div className="rghtCalCntnr clearfix dashboard">

            <div className="rccInr">
              <h5 className="addCnt_title">Locations > Add a Location</h5>
              <div className="addCnt">
                <Link to='/locations'>Back to Lists</Link>
              </div>
            </div>
          </div>
          <div className="rghtCntTop clearfix"></div>
          <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
              <div className="addcnt_info">
                <div className="addcnt_detail">
                  <div className="addcnt_title">
                    <h2>location details</h2>
                  </div>
                  <div className="cnt_detail">
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Name*</label>
                      <input type="text" placeholder="" id="cnt_locationname" name="locationName" className="cnt_locationname cnt_input form-control" value={this.state.locationName} ref={locationName => (this.locationName = locationName)} onChange={(e) => this.onChangeByKey("locationName", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Code</label>
                      <input type="text" placeholder="" id="cnt_locationcode" name="locationCode" className="cnt_locationcode cnt_input form-control" value={this.state.locationCode} ref={locationCode => (this.locationCode = locationCode)} onChange={(e) => this.onChangeByKey("locationCode", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <div className="farm">
                        <label className="cnt_label">Farm</label>
                        <ReactSelect
                          name="farm"
                          className="cnt_select"
                          value={this.state.farm}
                          options={options_farm}
                          onChange={(e) => this.onSelectByKey("farm", e)}
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
                    Add new location
                  </Button>
                  <Link to='/locations'>Cancel</Link>
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
    farms: state.farms,
    createLocationStatus: state.createLocationStatus
  }
};

function matchDispatchToProps(dispatch){
  return bindActionCreators({
    getFarms: DashboardAction.getFarms,
    createLocation: DashboardAction.createLocation
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(LocationCreateContainer);
