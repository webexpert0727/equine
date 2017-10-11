import React, {Component} from 'react';

export default class LessonStudentsList extends Component {
    
    componentDidMount(){
      setTimeout(()=>{
        $('.dropdown-header').addClass('lastHead');
      },1000);
    }

    render() {
      var className = 'selectpicker '+ this.props.className;
      return <div className="snglFld">
          <label>Add client to lesson</label>
          <select className={className} multiple onChange={(e)=> {this.props.selectStudent(e, false)}}>
            <optgroup label="Section 1 clients" className="topHeadSel">
              <option>section 1 </option>
            </optgroup>
            <optgroup label="Add all Section 1 clients" className="midHead">
              {this.props.list1}
            </optgroup>
            <optgroup label="All clients">
              {this.props.list2}
            </optgroup>
        </select>
      </div>
    }
}
