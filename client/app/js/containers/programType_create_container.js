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

class ProgramTypeCreateContainer extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      // programTypeDetails: {}
      programTypeName: '',
      msg: 'New program type has been added successfully!',
      url: '/programTypes',
    };

    this.onChangeByKey = this.onChangeByKey.bind(this);
    this.onSelectByKey = this.onSelectByKey.bind(this);

    this.submitCreateProgramType = this.submitCreateProgramType.bind(this);

  }

  componentDidMount() {
    let component = this;
    validate (this.form, {
      rules: {
        programTypeName: {
          required: true,
        },
      },
      messages: {
        programTypeName: {
          required: 'Please insert program type name.',
        },
      },
      submitHandler() { component.submitCreateProgramType(); }
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

  submitCreateProgramType() {

    let formData = {
      programTypeName: this.state.programTypeName,
    };

    console.log("Form Data", formData);
    this.props.createProgramType(formData);

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.createProgramTypeStatus) {
      this.refs.modalTemp.show();
    }
  }

  render() {

    console.log("createProgramTypeStatus:", this.props.createProgramTypeStatus);

    var noneDisplayStyle = {
      display: 'none'
    };

    return (

      <div className="rightMain">
        <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
          <div className="rghtHeadTop clearfix">
            <h1>Add a Program Type</h1>
          </div>
          <div className="rghtCalCntnr clearfix dashboard">

            <div className="rccInr">
              <h5 className="addCnt_title">Program Types > Add a Program Type</h5>
              <div className="addCnt">
                <Link to='/programTypes'>Back to Lists</Link>
              </div>
            </div>
          </div>
          <div className="rghtCntTop clearfix"></div>
          <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
              <div className="addcnt_info">
                <div className="addcnt_detail">
                  <div className="addcnt_title">
                    <h2>program type details</h2>
                  </div>
                  <div className="cnt_detail">
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Name*</label>
                      <input type="text" placeholder="" id="cnt_programtypename" name="programTypeName" className="cnt_programtypename cnt_input form-control" value={this.state.programTypeName} ref={programTypeName => (this.programTypeName = programTypeName)} onChange={(e) => this.onChangeByKey("programTypeName", e)} />
                    </div>
                  </div>
                </div>

                <div className="cnt_submit">
                  <label>* These fields are required.</label>
                  <br/>
                  <Button type="submit" className="btn_submit">
                    Add new program type
                  </Button>
                  <Link to='/programTypes'>Cancel</Link>
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
    createProgramTypeStatus: state.createProgramTypeStatus
  }
};

function matchDispatchToProps(dispatch){
  return bindActionCreators({
    createProgramType: DashboardAction.createProgramType
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ProgramTypeCreateContainer);
