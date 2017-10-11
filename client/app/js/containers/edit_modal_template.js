import React, {Component}           from 'react';
import {connect}                    from 'react-redux';
import  LessonAction                from '../actions/lesson';
import { bindActionCreators }       from 'redux';
import BaseComponent                from '../components/base_component';
import moment                       from 'moment';
import AtomicForm                   from "atomic-form";
import ReactSelect                  from 'react-select';
import Api                          from '../actions/api';
import { getLocations }             from '../actions/location';
import { getLessonStatus }          from '../actions/lesson_status';
import { getSections }              from '../actions/section';
import { getInstructors }           from '../actions/instructor';
import { getStudents }              from '../actions/student';
import DatePicker                   from 'react-datepicker';
import TimePicker                   from 'rc-time-picker';
import Modal                        from "simple-react-modal";
import LessonHorsesList             from './lesson_horses_list';
import LessonStudentsList           from './lesson_students_list';
import InstructorDropdown           from './instructor_dropdown';
import HorseListDropdown            from './horse_list_dropdown';
import AttendeesList                from './attendees_list';
import AssignedHorseList            from './assigned_horse_list';

import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';
let horseIconIndex = -1;
let iconIndex = -1;
const studentIcons = ['green_user','blue_user','red_user'];

class EditModalTemplate extends BaseComponent {
    
  constructor(props, context){
    super(props, context);
    this._bind('afterValidation','doSubmit','selectStudent',
      'createStudentLessonList','getSelectedHourseId','removeStudent',
      'addHorseToLesson','removeHourse','lessonHorseList','changeEnStatus',
      'changeHourse','changePaidStatus','updateStudentAssingStatus',
      'editScheduledStartDate','editScheduledEndDate','startTimeChange',
      'endTimeChange','duplicateLesson','discardChanges',
      'createLocationList','changeLocation','getSelectedStudent','deleteLesson',
      'getSelectedPaidStatus','setRecuringUpdate','markAllPaid',
      'updateLessonName','changeInstructor');

    this.state={initialData: {}, includedStudents: [], lessonStudents: {},
                selectedHorses: {}, lessonStudentArray: {}, isRecuring: false,
                lessonPeopleStates: [], openDeleteLessonPopup: false,
                recurring_update_option: 'current_occurrence',
              selectedHorseIds: [], currentSelectedHorse: {}, horsesList: [],
              studentList: [], assignedHorseList: []}
  }

  componentWillMount(){
    this.props.getLessonStatus();
  }

  componentDidMount(){
    var lessonDateTime = this.props.lessonDateTime.lesson_people || [];
    var selectedHorseIds = [];
    var currentSelectedHorse = {};
    _.each(lessonDateTime, function(val, key){
      if(val.horse_id){
        selectedHorseIds.push(val.horse_id);
        currentSelectedHorse[val.student_id] = val.horse_id;
      }
    });

    this.setState({lessonPeopleStates: lessonDateTime,
    selectedHorseIds: selectedHorseIds, currentSelectedHorse: currentSelectedHorse});

    setTimeout(()=>{
      $('.selectpicker-common').each(function(){
        var val = $(this).val();
        var tmpIds = selectedHorseIds.slice(0);
        var that = this;
        var idx = tmpIds.indexOf(parseInt(val));
        if(idx > -1){
          tmpIds.splice(idx, 1);
        }else{
          tmpIds = selectedHorseIds.slice(0);
        }
        _.each(tmpIds, function(id){
          $(that).find('.horse-'+id).hide();
        });
        $(this).selectpicker('refresh');
      });
    },1000);
  }

  componentWillReceiveProps(nextProps){
    var lessonDateTime = nextProps.lessonDateTime || {}
    var peoples = [];
    var lessonStudentArray = {};
    if(lessonDateTime && lessonDateTime.lesson_people){
      _.each(lessonDateTime.lesson_people, function(people){
        peoples.push(people.student_id)
        lessonStudentArray[people.student_id] = {
          enrollment_status_id: people.enrollment_status_id,
          horse_id: people.horse_id,
          student_id: people.student_id,
          paid: people.paid
        }
      });
    }

    var lessonStatus = _.find(nextProps.lesson_status, function(status){
      return status.lesson_status_name.toLowerCase() == 'scheduled'
    });

    lessonDateTime.lesson_status_id = lessonStatus ? lessonStatus.id : null;
    this.setState({initialData: lessonDateTime,
      lessonStudentArray: lessonStudentArray,
      lessonPeopleStates: lessonDateTime.lesson_people,
      startTime: moment(lessonDateTime.scheduled_starttime).utc(),
      endTime: moment(lessonDateTime.scheduled_endtime).utc(),
      scheduledStartDate: moment(lessonDateTime.scheduled_date),
      scheduledEndDate: moment(lessonDateTime.scheduled_end_date),
      endMinDate: moment(lessonDateTime.scheduled_date),
      locationId: lessonDateTime.location_id,
      isRecuring: lessonDateTime.is_recuring,
      lessonName: lessonDateTime.name,
      lessonNotes: lessonDateTime.lesson_notes,
      newLessonStatus: lessonDateTime.lesson_status_id,
      instructor_id: lessonDateTime.instructor_id,
      sectionId: lessonDateTime.section_id
    });

    if(lessonDateTime && lessonDateTime.lesson_date_time_horses){
      var horseIds = _.map(lessonDateTime.lesson_date_time_horses, function(horse){ 
        return horse.horse_id.toString()
      });
      var defaultSelectedHorses = {};
      _.each(lessonDateTime.lesson_date_time_horses, function(val){
        defaultSelectedHorses[val.horse_id] = {id: val.horse_id, horse_name: val.horse_name}
      });
      this.selectStudent('edit', peoples, true, 'no', false);
      this.addHorseToLesson(true, horseIds);
      this.setState({selectedHorses: defaultSelectedHorses, init: _.keys(defaultSelectedHorses).length > 0});
    }
  }

  changeEnStatus(e, student){
    var data = this.state.lessonStudentArray;
    var horse_id = data[student] && data[student]['horse_id'] ? data[student]['horse_id'] : null;
    var paid = data[student] && data[student]['paid'] ? data[student]['paid'] : false;
    data[student] = {enrollment_status_id: e.target.value, horse_id: horse_id, paid: paid};
    var lessonArray = this.updateStudentAssingStatus(student, 'enrollment_status_id', e.target.value);
    this.setState({lessonStudentArray: data, lessonPeopleStates: lessonArray})
  }

  changeHourse(e, student){
    var currentVal = e.target.value;
    var currentSelectedHorse = this.state.currentSelectedHorse;
    var selectedHorseIds = this.state.selectedHorseIds;

    var data = this.state.lessonStudentArray;
    var enrollment_status_id = data[student] && data[student]['enrollment_status_id'] ? data[student]['enrollment_status_id'] : null;
    var paid = data[student] && data[student]['paid'] ? data[student]['paid'] : false;
    data[student] = {horse_id: e.target.value, enrollment_status_id: enrollment_status_id, paid: paid}
    var lessonArray = this.updateStudentAssingStatus(student, 'horse_id', e.target.value);
    this.setState({lessonStudentArray: data, lessonPeopleStates: lessonArray});

    $('.selectpicker-common').each(function(){
      $(this).selectpicker('refresh');
      if(!$(this).hasClass('selectpicker-'+student)){
        $(this).find('.horse-'+e.target.value).hide();
        $(this).selectpicker('refresh');
      }
    });

    $('.horse-'+currentSelectedHorse[student]).show();
    var idx = selectedHorseIds.indexOf(currentSelectedHorse[student]);
    if (idx !== -1) {
      selectedHorseIds.splice(idx, 1);
    }
    if(selectedHorseIds.indexOf(currentVal) == -1){
      selectedHorseIds.push(currentVal);
    }
    currentSelectedHorse[student] = currentVal;
    this.setState({selectedHorseIds: selectedHorseIds, currentSelectedHorse: currentSelectedHorse});
  }

  changePaidStatus(e, student){
    var data = this.state.lessonStudentArray;
    var isChecked = e.target.checked ? 1 : 0;
    var enrollment_status_id = data[student] && data[student]['enrollment_status_id'] ? data[student]['enrollment_status_id'] : null;
    var horse_id = data[student] && data[student]['horse_id'] ? data[student]['horse_id'] : null;
    data[student] = {horse_id: horse_id, enrollment_status_id: enrollment_status_id, paid: isChecked}
    var lessonPeopleStates = this.state.lessonPeopleStates;
    var lessonArray = this.updateStudentAssingStatus(student, 'paid', isChecked);
    this.setState({lessonStudentArray: data, lessonPeopleStates: lessonArray})
  }

  setRecuringUpdate(e){
    this.setState({recurring_update_option: e.target.value});
  }

  updateStudentAssingStatus(student, field, val){
    var lessonArray = [];
    _.each(this.state.lessonPeopleStates, function(lesson){
      if(lesson.student_id == student){
        lesson[field] = val
      }
      lessonArray.push(lesson)
    });
    return lessonArray;
  }

  afterValidation(formValidations) {
    $('.nameField').removeClass('lessonSectionField');
    $('#edit-lesson').animate({ scrollTop: 0 }, 'slow');
    _.each(formValidations, function(val, key){
      if(!val.isValid && key == 'name'){
        $('.nameField').addClass('lessonSectionField');
      }
    });

    this.setState({validations: formValidations, errorBox: true});
  }

  validationMessage(field) {
    if (this.state.validations && this.state.validations[field]) {
      if (!this.state.validations[field].isValid) {
        return _.map(this.state.validations[field].message, (message,idx) => {
          return <span key={idx}>{message}</span>;
        });
      }
    }
    return <div/>;
  }

  duplicateLesson(status){
    var data = {
      name: this.state.lessonName,
      lesson_notes: this.state.lessonNotes,
      lesson_satus_id: this.state.newLessonStatus,
      instructor_id: this.state.instructor_id,
      section_id: this.state.sectionId
    }
    this.doSubmit(data);
    this.props.duplicateLesson();
  }

  deleteLesson(e, type){
    var check = confirm("Are you sure you want to delete?");
    var that = this;
    if(check){
      var id = this.props.lessonDateTime.id;
      Api.delete(`/lesson_date_times/${id}?delete_all=${type}`).then(function(res,err){
        if(res.notice == 'delete successfully'){
          that.props.updateDetetedLesson(res.lesson_date_times);
        }
      });
    }
  }

  doSubmit(formData){
    var that = this;
    var studentData = [];
    _.each(this.state.lessonStudentArray, function(value,key){
      value['student_id'] = key
      studentData.push(value)
    });

    var dataToUpdate = { lesson_date_time: {
      name: formData.name,
      is_recuring: this.state.isRecuring,
      location_id: this.state.locationId,
      lesson_people_attributes: studentData,
      lesson_notes: formData.lesson_notes,
      lesson_status_id: formData.lesson_status_id,
      section_id: formData.section_id,
      location_id: this.state.locationId,
      instructor_id: this.state.instructor_id,
      scheduled_starttime: this.state.startTime.format(),
      scheduled_endtime: this.state.endTime.format(),
      scheduled_end_date: this.state.scheduledEndDate.format(),
      scheduled_date: this.state.scheduledStartDate.format(),
      recurring_update_option: this.state.recurring_update_option}
    }

    if(Object.keys(this.state.selectedHorses).length){
      var lessonHorse = [];
      _.each(this.state.selectedHorses, function(value,key){
        lessonHorse.push({horse_id: key,lesson_date_time_id: that.props.lessonDateTime.id})
      });

      dataToUpdate['lesson_date_time']['lesson_date_time_horses_attributes'] = lessonHorse;
    }

    Api.put(`/lesson_date_times/${this.props.lessonDateTime.id}`,dataToUpdate).then(function(res,err){
      if(res.notice == 'successfully updated'){
        that.props.updateDetetedLesson(res.lesson_date_times);
      }
    });
  }

  createOptions(status,field){
    return <option value={status.id} key={status.id}>{status[field]}</option>
  }

  createOptionsStudent(status){
    return <option value={status.id} key={status.id}>{status.student_name}</option>
  }

  selectStudent(type, e, initialValue, deltedId, removed){
    var that = this;
    var lessonStudents = this.state.lessonStudents;
    var lessonStudentArray = this.state.lessonStudentArray;
    var lessonPeopleStates = this.state.lessonPeopleStates;
    // var options = initialValue ? initialValue : $(e.target).val();
    var options = e;
    var lastId = options && options[options.length-1];

    var enrollmentStatuse = _.find(that.props.enrollmentStatuses, function(enroll){
      return enroll.enrollment_status_name.toLowerCase() == 'scheduled'
    });

    var selectedHorseIds = this.state.selectedHorseIds;
    var currentSelectedHorse = this.state.currentSelectedHorse;

    

    setTimeout(()=>{
      _.each(options, function (option, key1) {
      _.find(that.props.students, function (value, key) {
            if(value.id == option && !lessonStudents[value.id]){ 
              lessonStudents[value.id] = value
              if(!initialValue){
                lessonStudentArray[value.id] = {paid: 0, enrollment_status_id: enrollmentStatuse ? enrollmentStatuse.id : null,
                horse_id: null, student_id: null }
                lessonPeopleStates.push({student_id: option, paid: 0, enrollment_status_id: enrollmentStatuse ? enrollmentStatuse.id : null})
              }
            }
        });
      });

      $('.selectpicker').selectpicker();
      $('.check-mark').on('click',function(e){
        var lessonStudents = that.state.lessonStudents;
        var lessonPeopleStates = this.state.lessonPeopleStates;
        var studentId = $(e.target).parent().attr('class');
        delete lessonStudents[studentId];
        that.setState({lessonStudents: lessonStudents });
        var students = _.remove(lessonPeopleStates, function(stu) {
          return stu.student_id == studentId;
        });
        this.setState({lessonPeopleStates: lessonPeopleStates, studentList: e});
      })

      if(initialValue){
        $('.selectpickerStudents').selectpicker('val',initialValue);
      }

     _.each(lessonStudents, function(value,key){
        if(options && options.indexOf(key) == -1 && !initialValue){
          delete lessonStudents[key]
          delete lessonStudentArray[key]
        }
      });

      if(initialValue && this.props.lessonDateTime && this.props.lessonDateTime.lesson_people){
        _.each(this.props.lessonDateTime.lesson_people, function(val, key){
          lessonStudentArray[val.student_id] = {paid: val.paid, enrollment_status_id: val.enrollment_status_id,
                                          horse_id: val.horse_id, student_id: val.student_id }
        })
      }


      if(!options || options.length == 0){
        lessonStudentArray = {};
        lessonPeopleStates = [];
        lessonStudents = {};
        selectedHorseIds = [];
        currentSelectedHorse = {};
      }
      var hash = lessonPeopleStates;
      if(removed){
        var hash = [];
        var ids = []
        _.each(lessonPeopleStates, function(val){
          var stdId = val.student_id;
          if(options.indexOf(stdId.toString()) > -1 && parseInt(val.student_id) != parseInt(deltedId) && ids.indexOf(val.student_id) == -1){
            hash.push(val);
            ids.push(val.student_id)
          }
        });
      }
      this.setState({lessonStudents: lessonStudents,
        lessonStudentArray: lessonStudentArray, lessonPeopleStates: hash,
        selectedHorseIds: selectedHorseIds,
        currentSelectedHorse: currentSelectedHorse });
    },100)
    
    setTimeout(()=>{
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker();
      if(!initialValue){
        _.each(this.state.selectedHorseIds, function(id){
          $('.selectpicker-'+lastId).find('.horse-'+id).hide();
        });
        $('.selectpicker-'+lastId).selectpicker('refresh')
      }
    },500);
  }

  getSelectedHourseId(student, field){
    var selectedField = "";
    _.each(this.state.lessonPeopleStates, function(people){
      if(student.id == people.student_id){
        selectedField = people[field];
      }
    })
    return selectedField;
  }

  getSelectedPaidStatus(student){
    var selectedField = "";
    _.each(this.state.lessonPeopleStates, function(people){
      if(student.id == people.student_id){
        selectedField = people.paid;
      }
    })
    return selectedField;
  }

  getSelectedStudent(student){
    var selectedField = "a";
    _.each(this.state.lessonPeopleStates, function(people){
      if(student.id == people.student_id){
        selectedField = people.enrollment_status_id;
      }
    });
    return selectedField;
  }

  removeStudent(e,student){
    var studentData = this.state.lessonStudents;
    delete studentData[student];
    var lessonStudentArray = this.state.lessonStudentArray;
    delete studentData[student];
    delete lessonStudentArray[student];
    // $('.selectpickerStudents').find('[value='+student+']').remove();
    var selectedStudentIds = _.keys(studentData);
    $('.selectpickerStudents').selectpicker('val',selectedStudentIds);
    $('.selectpickerStudents').selectpicker('refresh');
   

    var currentSelectedHorse = this.state.currentSelectedHorse;
    var selectedHorseIds = this.state.selectedHorseIds;
    var idx = selectedHorseIds.indexOf(currentSelectedHorse[student]);
    var deletedHorse = currentSelectedHorse[student];
    if(idx >-1){
      selectedHorseIds.splice(idx, 1);
    }
    $('.horse-'+deletedHorse).show();
    delete currentSelectedHorse[student];
    if($('.selectpicker-common').length == 0){
      currentSelectedHorse = {};
      selectedHorseIds = [];
    }

    var studentList = this.state.studentList;
    var index = studentList.indexOf(student.toString());
    if(index > -1){
      studentList.splice(index, 1);
    }

     this.setState({lessonStudents: studentData,
     lessonStudentArray: lessonStudentArray, studentList: studentList, deletedStudent: student});
  }

  createHorsesList(horse){
    return <option value={horse.id} key={horse.id} className={`horse-list horse-${horse.id} userImage ${studentIcons[iconIndex]}`}>{horse.horse_name}</option>    
  }

  createenrollmentStatusesList(status){
    return <option value={status.id} key={status.id}>{status.enrollment_status_name}</option>    
  }

  addHorseToLesson(initialData, e, currentVal, type){
    var that = this;
    var selectedHorses = this.state.selectedHorses;
    // var selectedValues = initialData ? e : $(e.target).val();
    var selectedValues = e;
    _.each(selectedValues, function (horse, key1) {
      _.find(that.props.horses, function (value, key) {
          if(value.id == horse){ 
            selectedHorses[horse] = value
          }
      });
    });

    _.each(selectedHorses, function(value,key){
      var keyVal = key;
      if(selectedValues && selectedValues.indexOf(keyVal.toString()) == -1){
        delete selectedHorses[key]
      }
    });

    selectedHorses = selectedValues ? selectedHorses : {};
    this.setState({selectedHorses: selectedHorses, horsesList: e, init: false});

    setTimeout(()=>{
      if(initialData){
        $('.selectpickerLessonHorse').selectpicker('val',selectedValues);
      }
      $('.assignedHorses').selectpicker('refresh');
    },400);
  }

  removeHourse(e, horseId){
    var selectedHorses = this.state.selectedHorses;
    delete selectedHorses[horseId];
    this.setState({selectedHorses: selectedHorses});
    var selectedValues = Object.keys(selectedHorses);
    $('.selectpickerLessonHorse').selectpicker('val',selectedValues);
    var lessonStudentArray = this.state.lessonStudentArray;
    var t = _.map(lessonStudentArray, function(val, key){
      if(val.horse_id == horseId){
        val.horse_id = null;
      }
      return val;
    });
    this.setState(lessonStudentArray);
    $('.selectpickerLessonHorse').selectpicker('refresh');
    setTimeout(()=>{
      $('.assignedHorses').selectpicker('refresh');
    },500);


    var selectedHorseIds = this.state.selectedHorseIds;
    var currentSelectedHorse = this.state.currentSelectedHorse;

    if($('option .horse-'+horseId).length > 0){
      $('option .horse-'+horseId).remove();
    }

    var idx = selectedHorseIds.indexOf(horseId);
    if(idx > -1){
      selectedHorseIds.splice(idx, 1);
    }

   var horsesList = this.state.horsesList;
    var index = horsesList.indexOf(horseId.toString());
    if(index > -1){
      horsesList.splice(index, 1);
    }

    _.each(currentSelectedHorse, function(val, key){
      if(val == horseId){
        delete currentSelectedHorse[key];
      }
    });
    this.setState({currentSelectedHorse: currentSelectedHorse,
    selectedHorseIds: selectedHorseIds, horseDeleted: horseId,
    horsesList: horsesList, init: false})
    $('.selectpicker-common').selectpicker('refresh');
  }

  editScheduledStartDate(date){
    this.setState({scheduledStartDate: date, endMinDate: moment(date),
      scheduledEndDate: moment(date)})
  }

  editScheduledEndDate(date){
    this.setState({scheduledEndDate: date})
  }

  startTimeChange(time){
    if(time){
      this.setState({startTime: moment(time), endTime: moment(time).add(60, 'minutes')});
    }    
  }

  endTimeChange(time){
    if(time){
      var endtime = time;
      // console.log(moment(this.state.startTime).isAfter(moment(time)))
      if(moment(time) <= moment(this.state.startTime)){
        endtime = moment(this.state.startTime).add(60, 'minutes')
      }
      this.setState({endTime: moment(endtime)}) 
    }  
  }


  discardChanges(e){
    // var that = this;
    // Api.get('/lesson_date_times/'+148).then(function(res,err){
    //   console.log('yyyyyyyyyy',res.lesson_date_time) 
    //   that.setState({lessonDateTime: res.lesson_date_time, initialData: res.lesson_date_time})
    // });
    // console.log('aaaaaaaaaa',this.props.lessonDateTime)
  }

  changeLocation(e, location){
    this.setState({locationId: location})
  }

  markAllChecked(students, field, enrollmentStatuse){
    var results = _.map(students, function(student){
      if(field == 'paid'){
        student.paid = 1;
      }else if(parseInt(student.enrollment_status_id) == 8){
        student.enrollment_status_id = enrollmentStatuse.id.toString();
      }
      return student;
    });
    return results;
  }

  markAllPaid(e, field){
    if(e.target.checked){
      var hash = {};
      var selectedStudents = this.state.lessonPeopleStates;
      var enrollmentStatuse = _.find(this.props.enrollmentStatuses, function(enroll){
        return enroll.enrollment_status_name.toLowerCase() == 'attended'
      });

      hash = {};
      _.each(this.state.lessonStudentArray, function(val, key){
        if(field == 'paid'){
          val.paid = 1;
        }else{
          if(val.enrollment_status_id == 8){
           val.enrollment_status_id = enrollmentStatuse.id;
          }
        }
        hash[key] = val;
      });

      var students = this.markAllChecked(selectedStudents, field, enrollmentStatuse);
      if(field != 'paid'){
        $('.enrollStatus').each(function(){
          if($(this).val() == 8){
            $(this).selectpicker('val',enrollmentStatuse.id);
          }
        })
      }
      this.setState({lessonPeopleStates: students, lessonStudentArray: hash});
      $('.enrollStatus').selectpicker('refresh');
    }
  }

  lessonHorseList(horse){
    return <div className="snglClDtl" key={horse.id}>
            <div className="clntNmeImg">
              <div className="clientImg"><img src="/assets/horse_avatar_01.svg" alt="Client Image" /></div>
                <div className="clntName">{horse.horse_name}</div>
              </div>
            <div className="adhCross" onClick={(e)=> {this.removeHourse(e, horse.id)}}>
          <button></button>
      </div>
    </div>
  }

  createLocationList(location){
    return <div key={location.id} className="snglChck"><label>{location.location_name}
    <input checked={this.state.locationId == location.id} onChange={(e)=>{this.changeLocation(e, location.id)}} type="radio" name="location" /><span></span></label></div>
  }

  createStudentLessonList(student){
    var horseIds = [];

    if(this.props.lessonDateTime && this.props.lessonDateTime.lesson_people){
      horseIds = _.map(this.props.lessonDateTime.lesson_people, function(val){
        return val.horse_id
      });
    }
    var selectedHourse = this.getSelectedHourseId(student,'horse_id');
    var selectedEnrollStatus = this.getSelectedStudent(student);
    var paidStatus = this.getSelectedPaidStatus(student);
    var horses = _.map(this.state.selectedHorses, this.createHorsesList);
    var enrollmentStatuses = _.map(this.props.enrollmentStatuses, this.createenrollmentStatusesList);
    paidStatus = paidStatus == 0 ? false : true;
    var selectpickerCls = "selectpicker assignedHorses selectpicker-common"+ " selectpicker-"+student.id;

    return <div className="snglClDtl stdHorseList" key={student.id}>
          <div className="clntNmeImg">
            <div className="clientImg"><img src="/assets/client_avatar_01.svg" alt="Client Image"/></div>
            <div className="clntName">{student.student_name}</div>
          </div>
          <div className="adhCross" onClick={(e) =>{this.removeStudent(e,student.id)}}>
            <button></button>
          </div>
          <div className="psaCnt">
            <div className="psacInr">
              <div className="paidUnpaidChk">
                <label>Paid</label>
                  <div className="cstmChck">
                    <label>
                      <input type="checkbox" defaultValue={paidStatus} onChange={(e) => 
                        {this.changePaidStatus(e, student.id)}} checked={paidStatus}/>
                      <span></span>
                    </label>
                  </div>
                </div>
              <div className="slct_cnt dblSelect clearfix">
                <div className="snglFld">
                  <label>Status</label>
                    <select className="selectpicker enrollStatus" onChange={(e) => {this.changeEnStatus(e,student.id)}} value={selectedEnrollStatus}>
                      {enrollmentStatuses}
                    </select>
                </div>
                <div className="snglFld">
                  <label>Assigned to</label>
                    <AssignedHorseList
                      group1List={this.state.selectedHorses}
                      deletedAssignedHorse={this.state.deletedAssignedHorse}
                      assignedHorseList = {this.state.assignedHorseList}
                      changeHourse={this.changeHourse}
                      student={student.id}
                      className={selectpickerCls}
                      type="edit"
                      width='790px'
                      horseIds={horseIds}
                      lessonDateTime={this.props.lessonDateTime}
                    />
                </div>
              </div>
          </div>
        </div>
      </div>
  }

  createHorseGroupList(horse){
    if(horseIconIndex > 1){
      horseIconIndex = -1
    }
    horseIconIndex++;
    return <option value={horse.id} key={horse.id} className={`userImage ${studentIcons[horseIconIndex]}`}>{horse.horse_name}</option>
  }

  createStudentGroupList(student){
    if(iconIndex > 1){
      iconIndex = -1
    }
    iconIndex++;
    return <option value={student.id} key={student.id} className={`userImage ${studentIcons[iconIndex]}`}>{student.student_name}</option>
  }

  updateLessonName(e){
    this.setState({lessonName: e.target.value});
  }

  updateLessonNotes(e){
    this.setState({lessonNotes: e.target.value});
  }

  updateLessonStatus(e){
    this.setState({newLessonStatus: e.target.value}); 
  }

  changeInstructor(e){
    this.setState({instructor_id: e.target.value});
  }

  render() {
    var lessonDetail = this.props.lessonDateTime;
    var that = this;
    var lessonStatus = _.map(this.props.lesson_status, (data)=>{ return this.createOptions(data,'lesson_status_name')});
    var sections = _.map(this.props.sections , (data)=>{ return this.createOptions(data,'section_name')});
    var instructors = _.map(this.props.instructors, (data)=>{ return this.createOptions(data,'instructor_name')});
    var students = _.map(this.props.students, this.createOptionsStudent);
    var lessonStudentList = _.map(this.state.lessonStudents, this.createStudentLessonList);
    var horses = _.map(this.props.horses, this.createHorsesList);
    var lessonHorses = _.map(this.state.selectedHorses, this.lessonHorseList);
    var locations = _.map(this.props.locations, this.createLocationList);

    var horseList = this.props.horses || [];
    var groupHorse1 = horseList.slice(0,4);
    var groupHorse2 = horseList.slice(4);

    let horsesGroup1 = _.map(groupHorse1, this.createHorseGroupList);
    let horsesGroup2 = _.map(groupHorse2, this.createHorseGroupList);

    var studentsList = this.props.students || [];
    var group1 = studentsList.slice(0,4);
    var group2 = studentsList.slice(4);

    let studentsGroup1 = _.map(group1, this.createStudentGroupList);
    let studentsGroup2 = _.map(group2, this.createStudentGroupList);

      return (
        <div>
          { lessonDetail &&
            <AtomicForm ref="editLessonForm" initialData={this.state.initialData} 
              doSubmit={this.doSubmit} afterValidation={this.afterValidation}
              >
            <div className="blgCnt blgFull grayBg">
              <div className="blgCntInr">
                <button id="closepopover" type="button" className="close" aria-hidden="true" onClick={this.props.hideModal}>&times;</button>
                <div className="topOrngStrip"></div>
                <div className="blgFullCntnr">
                  <div className="bglHead">
                    <h1>
                      <span>Beginner Lesson Group 1</span>
                      <div className="blgHeadDrop">
                        <div className="dropdown">
                          <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"></button>
                          <ul className="dropdown-menu">
                            <li><a href="javascript:void(0)" onClick={(e)=>{this.duplicateLesson(e)}}>Duplicate lesson</a></li>
                            {lessonDetail.series &&
                              <li><a href="javascript:void(0)" onClick={(e)=>{ this.deleteLesson(e, 'single') }}>Delete Only This Occurrence </a></li>
                            }
                            {lessonDetail.series && 
                              <li><a href="javascript:void(0)" onClick={(e)=>{ this.deleteLesson(e,'true') }}>Delete All In Series</a></li>
                            }
                            {lessonDetail.series &&
                              <li><a href="javascript:void(0)" onClick={(e)=>{ this.deleteLesson(e,'future') }}>Delete All Future lessons</a></li>
                            }
                            {!lessonDetail.series &&
                              <li><a href="javascript:void(0)" onClick={(e)=>{ this.deleteLesson(e,null) }}>Delete Lesson</a></li>
                            }
                          </ul>
                        </div>
                      </div>
                    </h1>
                  </div>
                  <div className="snglBlck">
                    <div className="blckHead">Lesson details</div>
                    <div className="popBody">
                     {this.state.errorBox &&
                        <div className="addAlertMsg addErrorMsg">
                         <div className="amInr">
                            <div className="amTop">
                            <p>Whoa there. Please fill in the information indicated below</p>
                          </div>
                         </div>
                        </div>
                      }
                      <div className="slct_cnt">
                        <div className="snglFld">
                          {lessonDetail.section_name}
                        </div>
                      </div>

                      <div className="snglFld nameField">
                        <label>Lesson name</label>
                        <input type="text" ref="name" validate={
                        [{
                        message: "*Required",
                        validate: "isPresent",
                        }]} onChange={(e)=>{this.updateLessonName(e)}}/>
                        {this.validationMessage("name")}
                      </div>
                      <div className="slct_cnt">
                        <div className="snglFld">
                          <label>Status</label>
                          <select className="selectpicker onChange={(e){this.updateLessonStatus(e)}} selectpickerStatus" ref="lesson_status_id">
                            {lessonStatus}
                          </select>
                        </div>
                      </div>

                      <div className="slct_cnt">
                       <InstructorDropdown
                          instructors={this.props.instructors}
                          changeInstructor={this.changeInstructor}
                          defaultInstructor={lessonDetail.instructor_id}
                          instructorName={lessonDetail.instructor_name}
                        />
                      </div>
                      <div className="snglFld">
                        <label>Location</label>
                          {locations}
                      </div>
                    </div>
                  </div>
                  <div className="snglBlck">
                    <div className="blckHead">Date and time</div>
                    <div className="popBody">
                      <div className="slct_cnt dblSelect clearfix">
                        <label>Starts</label>
                        <div className="snglFld">
                        <DatePicker
                           selected={this.state.scheduledStartDate}
                           onChange={this.editScheduledStartDate}
                           dateFormat="MMMM DD , YYYY"
                           minDate='0'
                           readOnly={true}
                        />
                        </div>
                        <div className="snglFld input-group bootstrap-timepicker timepicker">
                         <TimePicker 
                          format="hh:mm A"
                          showSecond={false}
                          onChange={this.startTimeChange}
                          value={this.state.startTime}
                          use12Hours={true}
                          className="starttimepicker"
                          popupClassName="starttimepickerpopup"
                          allowEmpty={false}
                         />
                        </div>
                      </div>
                      <div className="slct_cnt dblSelect clearfix">
                        <label>Ends</label>
                        <div className="snglFld">
                        <DatePicker
                           selected={this.state.scheduledEndDate}
                           onChange={this.editScheduledEndDate}
                           dateFormat="MMMM DD , YYYY"
                           minDate={this.state.endMinDate}
                           readOnly={true}

                        />
                        </div>
                        <div className="snglFld input-group bootstrap-timepicker timepicker">
                          <TimePicker 
                          format="hh:mm A"
                          showSecond={false}
                          onChange={this.endTimeChange}
                          defaultValue={this.state.endTime}
                          use12Hours={true}
                          className="endtimepicker"
                          popupClassName="endtimepickerpopup"
                          allowEmpty={false}
                          value={this.state.endTime}
                         />
                        </div>
                      </div>
                      <div className="snglFld">
                        <label>Is this lesson recurring</label>
                        <div className="snglChck">
                          <label>
                          NO
                          <input type="radio" name="rcrng1" onChange={(e)=> this.changeRecuring(e)} checked={this.state.isRecuring == false}/> 
                          <span></span>
                          </label>
                        </div>
                        <div className="snglChck">
                          <label>
                          YES
                          <input type="radio" name="rcrng1" onChange={(e)=> this.changeRecuring(e)} checked={this.state.isRecuring == true}/> 
                          <span></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="snglBlck">
                    <div className="blckHead">Lesson horses</div>
                    <div className="popBody">
                      <HorseListDropdown
                        groupHorse1={groupHorse1}
                        groupHorse2={groupHorse2}
                        addHorseToLesson={this.addHorseToLesson}
                        horsesList={this.state.horsesList}
                        className = 'selectpickerLessonHorse'
                        horseDeleted = {this.state.horseDeleted}
                        type='edit'
                        selectedHorses={this.state.selectedHorses}
                        init={this.state.init}
                      />

                      {lessonHorses && lessonHorses.length > 0 && 
                        <div className="addedHrse">
                          <div className="adhInr">
                            {lessonHorses}
                          </div>
                        </div>
                      } 
                    </div>
                  </div>
                  <div className="snglBlck">
                    <div className="blckHead">Lesson attendees</div>
                    <div className="popBody">
                      <div className="slct_cnt">
                        
                         <AttendeesList
                          list1={group1}
                          list2={group2}
                          selectStudent={this.selectStudent}
                          deletedStudent = {this.state.deletedStudent}
                          studentList={this.state.studentList}
                          className='selectpickerStudents'
                          type='edit'
                          lessonPeople = {lessonDetail.lesson_people}
                          />

                      </div>
                      {lessonStudentList.length > 0 &&
                        <div className="snglFld">
                          <div className="chkbxCnt">
                            <div className="cbSngl">
                              <label>
                              <p>Mark everyone as paid.</p>
                              <input type="checkbox" onChange={(e)=> {this.markAllPaid(e, 'paid')}}/>
                              <span></span> 
                            </label>
                            </div>
                          </div>

                          <div className="chkbxCnt">
                            <div className="cbSngl">
                              <label>
                              <p>Indicate everyone attended this lesson.</p>
                              <input type="checkbox" onChange={(e)=> {this.markAllPaid(e, 'enrollment_status_id')}}/>
                              <span></span> 
                            </label>
                            </div>
                          </div>
                        </div>
                      }
                      <div className="addedHrse">
                        <div className="adhInr">
                          {lessonStudentList}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="snglBlck">
                    <div className="blckHead">LESSON NOTES</div>
                    <div className="popBody">
                      <div className="lnText">    
                        <label>Add a note visible to client and staff assigned to this lesson (optional)</label>
                        <textarea rows="6" ref="lesson_notes" onChange={(e)=>{this.updateLessonNotes(e)}}></textarea>
                      </div>
                    </div>
                  </div>
                  {lessonDetail.series &&
                    <div className="snglBlck">
                      <div className="blckHead">EDIT RECURING LESSS</div>
                      <div className="popBody">
                        <div className="snglFld">
                          <label>Select edit option</label>
                          <div className="snglChck">
                            <label>
                            Only update this lesson.
                            <input type="radio" name="recurring-update" value="current_occurrence" checked={this.state.recurring_update_option == 'current_occurrence'} onChange={(e)=>{this.setRecuringUpdate(e)}}/> 
                            <span></span>
                            </label>
                          </div>
                          <div className="snglChck">
                            <label>
                            Update this lesson and all future occurrences of this lesson.
                            <input type="radio" name="recurring-update" value="all_occurrence" checked={this.state.recurring_update_option == 'all_occurrence'} onChange={(e)=>{this.setRecuringUpdate(e)}}/> 
                            <span></span>
                            </label>
                          </div>
                          <div className="snglChck">
                            <label>
                            Only update future occurrences of this lesson.
                            <input type="radio" name="recurring-update" value="future_occurrence" checked={this.state.recurring_update_option == 'future_occurrence'} onChange={(e)=>{this.setRecuringUpdate(e)}}/> 
                            <span></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  }

                  <div className="btmBtns">
                    <div className="bbsnglBtn primaryBtn">
                        <button type="submit">Save changes</button>
                    </div>
                    <div className="bbsnglBtn orangeBtn">
                        <button type="submit" onClick={(e)=> {this.duplicateLesson(e)}}>Duplicate Lesson</button>
                    </div>
                    <div className="bbsnglBtn defaultBtn">
                       {/* <a href="javascript:void(0)" onClick={(e)=> {this.discardChanges(e) }}>Discard changes</a>*/}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AtomicForm>
          }
        </div>
      );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    lessonDateTime: state.lessonDateTime,
    lesson_status: state.lesson_status,
    sections: state.sections,
    instructors: state.instructors,
    students: state.students,
    horses: state.horses,
    enrollmentStatuses: state.enrollment_statuses,
    lessonPeople: state.lessonPeople,
    lessonHorses: state.lessonHorses,
    locations: state.locations
  }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({getLocations: getLocations,
    getLessonStatus: getLessonStatus,getSections: getSections, 
    getInstructors: getInstructors, getStudents: getStudents,
    addLesson: LessonAction.addLesson,getLessons :LessonAction.getLessons,
    getLesson: LessonAction.getLesson, getStudent: LessonAction.getStudent,
    getHorses: LessonAction.getHorses, 
    getEnrollmentStatuses: LessonAction.getEnrollmentStatuses,
    getLessonPeople:  LessonAction.getLessonPeople,
    updateLesson: LessonAction.updateLesson,
    deleteLesson: LessonAction.deleteLesson },dispatch);
}


export default connect(mapStateToProps, matchDispatchToProps)(EditModalTemplate);
