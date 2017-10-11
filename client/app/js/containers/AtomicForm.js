import React           from "react";
import _               from "lodash";
import Validator       from "validator";

export default class AtomicForm extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.validateForm = this.validateForm.bind(this);
    this.allValid = this.allValid.bind(this);
    this.getFormValue = this.getFormValue.bind(this);
    this.recursiveCloneChildren = this.recursiveCloneChildren.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = this.getState();
  }

  getState() {
    if (this.props.getState) {
      return this.props.getState();
    } else {
      return {
        formData: this.props.initialData || {}
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((_.isEmpty(this.state.formData) && !_.isEmpty(nextProps.initialData)) || !_.isEqual(this.props.initialData, nextProps.initialData)) {
      this.setState({formData: nextProps.initialData});
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    var formData = this.state.formData;
    var values = {};
    _.each(formData, function(val, key){
      values[key] = val.trim()
    });
    var formValidation = this.validateForm(formData);
    if (this.allValid(formValidation)) {
      this.props.doSubmit(formData, formValidation);
    } else {
      this.props.afterValidation(formValidation);
      this.setState({formData:formData});
    }
  }

  allValid(formValidation) {
    return _.every(_.values(formValidation), function(v) { return v.isValid; });
  }

  validateForm() {
    var result = {};
    var values = {};
    _.each(this.state.formData, function(val, key){
      values[key] = val.trim()
    });

    this.setState({formData: values})
    _.each(this.refs, (val, ref) => {

      var validators = this.refs[ref].props.validate;
      result[ref] = {};
      result[ref].isValid = true;
      if(validators){
        if(_.isArray(validators)){
          _.forEach(validators, (validator) => {
            if(_.isFunction(validator.validate)){
              result[ref].isValid = result[ref].isValid && validator.validate(_.get(values, ref), values);
            } else if (validator.validate == "isPresent") {
              result[ref].isValid = result[ref].isValid && !!_.get(values, ref);
            } else {
              var args = validator.args || [];
              result[ref].isValid = result[ref].isValid && Validator[validator.validate](_.get(values, ref), ...args);
            }
            if (!result[ref].isValid) {
              result[ref].message = result[ref].message || [];
              result[ref].message.push(validator.message || "");
            }
          });
        } else {
          console.log("Validators must be an Array for form key: " + key);
        }
      }
    });

    return result;
  }

  getFormValue(ref) {
    return _.get(this.state.formData, ref);
  }

  // By default React will discard refs from the children. We override the behavior to include the refs
  // See: https://facebook.github.io/react/docs/clone-with-props.html
  recursiveCloneChildren(children) {
    return React.Children.map(children, child => {
      if(!_.isObject(child)) return child;
      var childProps = {};
      if(child.ref) {
        var oldOnChange = child.props.onChange;
        var valKey = child.props.type == "checkbox" || child.props.type == "radio" ? 'checked' : 'value';

        childProps.onChange = (...args) => {
          if (typeof oldOnChange == 'function') {
            oldOnChange(...args);
          }
           var values = {};
          _.each(this.state.formData, function(val, key){
            values[key] = val.trim();
          });

          this.setState({formData: values});
          var formData = _.cloneDeep(values);
          if(typeof child.props.__getOnChangeFormValue == 'function') {
            _.set(formData, child.ref, child.props.__getOnChangeFormValue(...args));
          } else {
            _.set(formData, child.ref, this.refs[child.ref][valKey]);
          }

          this.setState({formData: formData});
        };
        childProps.ref = child.ref;
        childProps[valKey] = _.get(this.state.formData, child.ref);
      }
      childProps.children = this.recursiveCloneChildren(child.props.children);
      return React.cloneElement(child, childProps);
    })
  }

  render(){
    return <form onSubmit={(e) => {this.handleSubmit(e)} }>
      {this.recursiveCloneChildren(this.props.children)}
    </form>;
  }

}