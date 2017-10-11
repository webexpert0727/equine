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

class HorseCreateContainer extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      // horseDetails: {}
      horse_name: '',
      msg: 'New horse has been added successfully!',
      url: '/horses',
    };

    this.onChangeByKey = this.onChangeByKey.bind(this);
    this.onSelectByKey = this.onSelectByKey.bind(this);

    this.submitCreateHorse = this.submitCreateHorse.bind(this);
  }

  componentDidMount() {
    let component = this;
    validate (this.form, {
      rules: {
        horse_name: {
          required: true,
        },
      },
      messages: {
        horse_name: {
          required: 'Please insert horse name.',
        },
      },
      submitHandler() { component.submitCreateHorse(); }
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

  submitCreateHorse() {

    let formData = {
      horse_name: this.state.horse_name,
    };

    console.log("Form Data", formData);
    this.props.createHorse(formData);

  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.createHorseStatus) {
      this.refs.modalTemp.show();
      // location.href = "/horses";
    }
  }

  render() {

    console.log("createHorseStatus:", this.props.createHorseStatus);

    var noneDisplayStyle = {
      display: 'none'
    };

    return (

      <div className="rightMain">
        <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
          <div className="rghtHeadTop clearfix">
            <h1>Add a Horse</h1>
          </div>
          <div className="rghtCalCntnr clearfix dashboard">

            <div className="rccInr">
              <h5 className="addCnt_title">Horses > Add a Horse</h5>
              <div className="addCnt">
                <Link to='/horses'>Back to Lists</Link>
              </div>
            </div>
          </div>
          <div className="rghtCntTop clearfix"></div>
          <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
              <div className="addcnt_info">
                <div className="addcnt_detail">
                  <div className="addcnt_title">
                    <h2>horse details</h2>
                  </div>
                  <div className="cnt_detail">
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Name*</label>
                      <input type="text" placeholder="" id="cnt_horse_name" name="horse_name" className="cnt_horse_name cnt_input form-control" value={this.state.horse_name} ref={horse_name => (this.horse_name = horse_name)} onChange={(e) => this.onChangeByKey("horse_name", e)} />
                    </div>
                  </div>
                </div>

                <div className="cnt_submit">
                  <label>* These fields are required.</label>
                  <br/>
                  <Button type="submit" className="btn_submit">
                    Add new horse
                  </Button>
                  <Link to='/horses'>Cancel</Link>
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
    createHorseStatus: state.createHorseStatus
  }
};

function matchDispatchToProps(dispatch){
  return bindActionCreators({
    createHorse: LessonAction.createHorse
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(HorseCreateContainer);
