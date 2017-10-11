import React, {Component} from 'react';

export default class LessonHorsesList extends Component {
    render() {
      var className = 'selectpicker '+ this.props.className;
      return <div className="snglFld">
        <label>Add horse to lesson</label>
          <select className={className} multiple onChange={(e)=> {this.props.addHorseToLesson(false, e)}}> 
            <optgroup label="Section 1 horses" className="topHeadSel">
              <option>section 1 </option>
            </optgroup>
            <optgroup label="Add all Section 1 horses" className="midHead">
              {this.props.list1}
            </optgroup>
            <optgroup label="All horses" className="lastHead">
              {this.props.list2}
            </optgroup>
          </select>
      </div>
    }
}
