import React, {Component} from 'react';
import BaseComponent      from '../components/base_component';

export default class AttendeesList extends BaseComponent {
  constructor(props, context){
    super(props, context);
    this.state={selectedStudents: []}
    this._bind('createList','changestudent');
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.deletedStudent){
      var selectedStudents = this.state.selectedStudents;
      var idx = selectedStudents.indexOf(nextProps.deletedStudent.toString());
      if(idx > -1){
        selectedStudents.splice(idx, 1)
      }
      this.setState(selectedStudents);

      $('span#newstudent-'+nextProps.deletedStudent).remove();
      $('#studentId-'+nextProps.deletedStudent).prop('checked',false)
    }
    if(nextProps.studentList.length == 0 && nextProps.type == 'add'){
      $('.studentOption').remove();
      var ret = $(".hida-student");
      $('.dropdown-student dt a').append(ret);
    }
  }

  componentDidMount(){
    var that = this;
    var selectedStudents = this.state.selectedStudents;

    $(".dropdown-student dt a.student-list").on('click', function () {
      $(".dropdown-student dd ul").show();
    });

    $(".dropdown-student dd ul li a").on('click', function () {
        $(".dropdown-student dd ul").hide();
    });

    function getSelectedValue(id) {
        return $("#" + id).find("dt a span.value").html();
    }

    $(document).bind('click', function (e) {
        var $clicked = $(e.target);
        if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
      });
      $('.mutliSelectStudent li, input[type="checkbox"]').on('click', function (e) {
    });

    var selectedStudents = this.state.selectedStudents;
    if(this.props.type == 'edit' && this.props.lessonPeople && this.props.lessonPeople.length){
      _.each(this.props.lessonPeople, function(val){
        var stdId = val.student_id;
        selectedStudents.push(stdId.toString());
        $('#studentId-'+val.student_id).prop('checked', true);
        var html = '<span class="studentOption" id="newstudent-'+val.student_id+'" title="' + val.student_name + '">' + val.student_name + '</span>';
        $('.multiSelStudents').append(html);
        $(".hida-student").hide();
      });
      selectedStudents = _.uniq(selectedStudents);
      this.setState(selectedStudents);
    }
  }

  changestudent(e){
    var selectedStudents = this.state.selectedStudents;
    var title;
    var val;
    if($(e.target).attr('type') == 'checkbox'){
      e.stopPropagation();
      title = $(e.target).closest('.mutliSelect').find('input[type="checkbox"]').attr('class'),
      title = $(e.target).attr('class');
      val = $(e.target).val();
    }else{
      if($(e.target).find('input[type="checkbox"]').is(":checked")){
        $(e.target).find('input[type="checkbox"]').prop('checked' , false);
      }else{
        $(e.target).find('input[type="checkbox"]').prop('checked' , true);
      }
      title = $(e.target).find('input[type="checkbox"]').attr('class'),
      title = $(e.target).find('input[type="checkbox"]').attr('class');
      val   = $(e.target).find('input[type="checkbox"]').val();
    }
    if ($(e.target).find('input[type="checkbox"]').is(':checked') || $(e.target).is(':checked')) {
        var html = '<span class="studentOption" id="newstudent-'+val+'" title="' + title + '">' + title + '</span>';
        $('.multiSelStudents').append(html);
        $(".hida-student").hide();
    } else {
        $('span[title="' + title + '"]').remove();
        var ret = $(".hida-student");
        $('.dropdown-student dt a').append(ret);
    }
    
    var removed = true;
    if(selectedStudents.indexOf(val) == -1){
      selectedStudents.push(val);
      removed = false;
    }else{
      selectedStudents.splice(selectedStudents.indexOf(val), 1);
    }
    this.props.selectStudent(this.props.type, selectedStudents, false, val, removed);
  }

  createList(student){
    var uniqId = 'studentId-'+student.id;
    
    return <li key={student.id}>
      <label>
        <div className={student.student_name}>
          <input type="checkbox" id={uniqId} className={student.student_name} value={student.id} name={student.name} onClick={(e)=>{this.changestudent(e)}}/>
          <span className="chkstudent" ></span>
        </div>
        <div className="instructorImg"><img className="img-test" src="/assets/userImage.png"/></div>
        <p>{student.student_name}</p>
      </label>
    </li>
  }

  render() {
    var group1 = _.map(this.props.list1, this.createList);
    var group2 = _.map(this.props.list2, this.createList);
    var className = 'selectpicker '+ this.props.className;

    return <div className="slct_cnt clearfix">
          <label>Add client to lesson</label>
          <div className="snglFld custmSelect">
            <dl className="dropdown dropdown-student"> 
              <dt>
                <a href="#" className="student-list">
                  <span className="hida-student">Select student</span>    
                  <p className="multiSel multiSelStudents"></p>  
                </a>
                </dt>
                  <dd>
                    <div className="mutliSelect mutliSelectStudent">
                      <ul>
                        <li className="topHeadSel"><span>Section 1 clients</span></li>
                        <li className="midHead"><span>Add all Section 1 clients</span></li>
                          {group1}
                        <li className="lastHead"><span>All clients</span></li>
                          {group2}
                        </ul>
                    </div>
                </dd>
            </dl>
        </div>
    </div>
  }
}