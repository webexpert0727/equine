import React, {Component}             from 'react';
import {connect}                      from 'react-redux';
import { login, resetPassword }       from '../actions/user';
import AtomicForm                     from "atomic-form";
import { bindActionCreators }         from 'redux';
import { Link, browserHistory  }      from 'react-router';
import Settings                       from '../settings';
import Modal                          from "simple-react-modal";
import BaseComponent                  from '../components/base_component';
import Utils                          from "../utils";
import Api                            from "../actions/api";

class UserLogin extends BaseComponent {
    
  constructor(props, context){
    super(props, context);
    this.state = this.getState();
    this._bind('afterValidation','resetPassword','clearMsg','rememberMe')
  }
 
  getState() {
    //Optional - Set form initial data. 
    return {
      initialData: {
        
      },
      openModel: false,
      emailSent: false,
      loading: false
    }
  }
 
  componentWillReceiveProps(nextProps){
    if(!nextProps.userLoginDetail.error){
      Settings.setUser(nextProps.userLoginDetail);
      location.href="/calender";
      // browserHistory.push('calender')
    }
  }

  afterValidation(formValidations) {
    $('.lrInputEmail, .lrInputPwd, .lrInputForgetPwd').removeClass('lessonNameField');
    this.setState({validations: formValidations});
    _.each(formValidations, function(val, key){
      if(!val.isValid && key == 'email'){
        $('.lrInputEmail').addClass('lessonNameField');
      }
      if(!val.isValid && key == 'password'){
        $('.lrInputPwd').addClass('lessonNameField');
      }
      if(!val.isValid && key == 'userEmail'){
        $('.lrInputForgetPwd').addClass('lessonNameField'); 
      }
    });
  }

  doSubmit(formData) {
    this.setState({validations: {}, responseErrors: ''});
    var data = {user:{ email: formData.email, password: formData.password}};
    this.props.login(data);
  }

  onInputChange() {
    //Optional - If we want to validate the form from an onChange callback. 
    var formData = this.refs.MainForm.formData();
    var formValidations = this.refs.MainForm.validateForm(formData);
    this.setState(validations: formValidations);
  }
 
  validationMessage(field) {
    if (this.state.validations && this.state.validations[field]) {
      if (!this.state.validations[field].isValid) {
        return _.map(this.state.validations[field].message, (message) => {
          return <span className="customValidationError">{message}</span>;
        });
      }
    }
    return <div/>;
  }

  forgetPassword(){
    this.setState({openModel: true, responseErrors: '',loading: false});
  }

  closeModal() {
    this.setState({openModel: false});
  }

  clearMsg(){
    setTimeout(()=>{
      this.setState({emailSent: false});
    },8000);
  }

  resetPassword(formDate){
    this.setState({loading: true})
    var data = {user: {email: formDate.userEmail}};
    var that = this;
    setTimeout(function(){
      Api.post('/password', data).then(function(res,err){
        that.setState({emailSent: true, openModel: false});
        that.clearMsg();
      },function(err){
        var errros = JSON.parse(err.responseText).errors;
        $('.lrInputForgetPwd').addClass('lessonNameField');
        that.setState({loading: false, emailSent: false, responseErrors: Utils.formatErrors(errros)});
      });
    })
  }

  rememberMe(e){
    this.setState({remember: e.target.checked})
  }

  render() {
    return (
      <div className="loginCnt regWrp">
        <div className="topLogo"><img src="/assets/smlLogo.png" alt="Logo" /><p><span>Powered by</span><strong>Equine Office</strong></p></div>
          {this.state.emailSent &&
            <span style={{color: 'red'}}>You will receive an email with instructions on how to reset your password in a few minutes</span>
          }
          <AtomicForm ref="LoginForm" initialData={this.state.initialData} 
        doSubmit={this.doSubmit.bind(this)} afterValidation={this.afterValidation}>
            <h1>Login</h1>
            <div className="lrInput lrInputEmail">
              <input type="text" placeholder="User name"ref="email" validate={[{
                message: "*Must be a valid Email.",
                validate: "isEmail",
              }
          ]} onChange={(e) => {this.onInputChange}}/>
          {this.validationMessage("email")}
          </div>
            <div className="lrInput lrInputPwd">
              <input type="password" placeholder="Password" ref="password" 
              validate={[{
                message: "*Password must be at least 5 characters long.",
                validate: "isLength",
                args: [5]
              }
            ]}/>
            {this.validationMessage("password")}
            </div>
            {this.props.userLoginDetail && this.props.userLoginDetail.error &&
              <div className="lrInput lessonNameField">
                <span className="customValidationError">{this.props.userLoginDetail && this.props.userLoginDetail.error}</span>
              </div>
            }
            
            <div className="lrDbl">
              <div className="rmbrMe">
                <label>
                <p>Remember me</p>
                <input type="checkbox" checked={this.state.remember} onChange={(e)=>{this.rememberMe(e)}}/>
                <span></span>
                </label>
              </div>
              <div className="forgtPass">
                <a href="javascript:void(0)" onClick={(e)=>{this.forgetPassword()}}>Forget password</a>
              </div>
            </div>
            <div className="lgBtn">
              <div className="lrsb orangeBtn"><button type="submit">Login</button></div>
              <div className="btmTextlgn">Not a member yet? <Link to='/register'>Sign up</Link></div>
              
            </div>
          </AtomicForm>
          <Modal id="forget-password" show={this.state.openModel} onClose={(e)=> { this.closeModal()}} containerStyle={{width: 596, padding: 'none'}}>
            <div className="loginCnt regWrp">
              <div className="topLogo"><img src="/assets/smlLogo.png" alt="Logo" />
                <p><span>Powered by</span><strong>Equine Office</strong></p>
              </div>
              <AtomicForm ref="forgetPasswordForm" doSubmit={this.resetPassword} afterValidation={this.afterValidation}>
                <h1>Forgot your password?</h1>
                <div className="lrInput lrInputForgetPwd">
                  <input type="text" placeholder="Email" ref="userEmail" 
                  validate={[
                    { message: "*Must be a valid Email.",
                     validate: "isEmail", 
                    }
                  ]} onChange={(e)=> {this.onInputChange}}/> 
                  {this.validationMessage("userEmail")}
                  {this.state.responseErrors &&
                    <span className="customValidationError">{this.state.responseErrors}</span>
                  }
                </div>
                <div className="lgBtn">
                  <div className="lrsb orangeBtn">
                    <button type="submit">Submit</button>
                  </div>
                </div>
                {this.state.loading &&
                  <img style={{marginLeft: '44%', height: '31px'}} className="loader" src="/assets/loader.gif"/>
                }
              </AtomicForm>
            </div>
          </Modal>
      </div>
      );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    userLoginDetail: state.userLoginDetail
  }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({login: login, resetPassword: resetPassword}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(UserLogin);
