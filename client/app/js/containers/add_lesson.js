import React, {Component}           from 'react';
import {connect}                    from 'react-redux';
import  LessonAction                from '../actions/lesson';
import { bindActionCreators }       from 'redux';
import BaseComponent                from '../components/base_component';
import DatePicker                   from 'react-datepicker';
import TimePicker                   from 'rc-time-picker';
import moment                       from 'moment';
import AtomicForm                   from "atomic-form";
import { getSections }              from '../actions/section';
import { getInstructors }           from '../actions/instructor';
import { getLocations }             from '../actions/location';
import LessonHorsesList             from './lesson_horses_list';
import LessonStudentsList           from './lesson_students_list';
import InstructorDropdown           from './instructor_dropdown';
import HorseListDropdown            from './horse_list_dropdown';
import AttendeesList                from './attendees_list'
import AssignedHorseList            from './assigned_horse_list';

import 'react-datepicker/dist/react-datepicker.css';
import 'rc-time-picker/assets/index.css';
const RepeatDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const studentIcons = ['green_user','blue_user','red_user'];
var iconIndex = -1;
var horseIconIndex = -1;

class AddLesson extends BaseComponent {
    
  constructor(props, context){
    super(props, context);
    this.state={initialData: {}, startTime: props.startTime || moment(new Date()), 
      endTime: props.endTime || moment(new Date()).add(60, 'minutes'),
      scheduledStartDate:  props.scheduledStartDate || moment(new Date()),
      scheduledEndDate: props.scheduledEndDate || moment(new Date()),
      isRecuring: false, period: 'day',frequency: 1,
      repeatTime: 1, selectedHorses: {}, lessonStudents: {},
      lessonStudentArray:{}, repeatStart: moment(new Date()),
      repeatEnd: 'on',
      endRepeatDate: moment(new Date()).add(1, 'days'),
      endRepeatMinDate: moment(new Date()).add(1, 'days'),
      weekDays: [], studentCopied: false,
      btnText: 'and fill in details later',hideFillExtraDetailBtn: true,
      endMinDate: props.scheduledStartDate || moment(new Date()),
      selectedHorseIds: [], currentSelectedHorse: {},
      horsesList: [], horseDeleted: false, deletedStudent: false, studentList: [],
      assignedHorseList: []}

    this._bind('addScheduledStartDate','addScheduledEndDate','endTimeChange',
      'startTimeChange','afterValidation','doSubmit','createLocationList',
      'changeRecuring','changeLocation','selectRepeat','selectRepeatEvery',
      'fillMoreDetails','addHorseToLesson','lessonHorseList','removeHourse',
      'selectStudent','createStudentLessonList','changeEnStatus',
      'changeHourse','changePaidStatus','updateStudentAssingStatus',
      'changeRepeatStartDate','changeRepeatEndDate','endRepeatOccurance',
      'changeEndRepeatDate','addWeekDays','shouldStudentCopied','addName',
      'addSection','changeInstructor');
  }

  componentWillMount(){
  	this.setState({locationId: this.props.locations ? this.props.locations[0].id : null});
  }

  componentDidMount(){
    setTimeout(()=>{
      $('.selectpicker').selectpicker();
    },100);
    var enrollmentStatuse = _.find(this.props.enrollmentStatuses, function(enroll){
      return enroll.enrollment_status_name == 'scheduled'
    });

    this.setState({defaultEnrollmentStatus: enrollmentStatuse ? enrollmentStatuse.id : null});

    

    // $('.mutliSelect ul li').on('click', function(){
    //   console.log($(this))
    // })

    // $(".dropdown dd ul li a").on('click', function () {
    //     $(".dropdown dd ul").hide();
    // });

    // function getSelectedValue(id) {
    //     return $("#" + id).find("dt a span.value").html();
    // }

    // $(document).bind('click', function (e) {
    //   var $clicked = $(e.target);
    //   if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
    // });


    // $('.mutliSelect li, input[type="checkbox"]').on('click', function (e) {
    //   // debugger
    //   var title
    //   if($(e.target).attr('type') == 'checkbox'){
    //     e.stopPropagation();
    //       title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val()
    //       // debugger
    //       // ,
    //         // title = $(this).val() + ",";
    //   }else{
    //     // debugger
    //     if($(this).find('input[type="checkbox"]').is(":checked")){
    //       $(this).find('input[type="checkbox"]').prop('checked' , false);
    //     }else{
    //       $(this).find('input[type="checkbox"]').prop('checked' , true);
    //     }
    //     title = $(this).find('input[type="checkbox"]').attr('name')
    //     // ,
    //         // title = $(this).find('input[type="checkbox"]').val() + ",";
    //   }

    //     console.log('yyy',title)
    //     if ($(this).find('input[type="checkbox"]').is(':checked') || $(this).is(':checked')) {
    //         var html = '<span title="' + title + '">' + title + '</span>';
    //         $('.multiSel').append(html);
    //         $(".hida").hide();
    //     } else {
    //         $('span[title="' + title + '"]').remove();
    //         var ret = $(".hida");
    //         $('.dropdown dt a').append(ret);
    //     }
    // });
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      startTime: nextProps.calenderClicked ? nextProps.startTime : moment(new Date()), 
      endTime: nextProps.calenderClicked ? nextProps.endTime : moment(new Date()).add(60, 'minutes'), 
      scheduledStartDate:  nextProps.calenderClicked ? nextProps.scheduledStartDate : moment(new Date()),
      scheduledEndDate: nextProps.calenderClicked ? nextProps.scheduledEndDate : moment(new Date()),
      locationId: nextProps.locations ? nextProps.locations[0].id : 0
    });
  }

  doSubmit(formData){
  	var that = this;
    var data = {lesson_date_time: {
      name: formData.name,
      section_id: formData.section_id,
      instructor_id: this.state.instructorId,
      scheduled_starttime: this.state.startTime.toLocaleString(),
      scheduled_endtime: this.state.endTime.toLocaleString(),
      scheduled_end_date: this.state.scheduledEndDate.toLocaleString(),
      scheduled_date: this.state.scheduledStartDate.toLocaleString(),
      location_id: this.state.locationId,
      is_recuring: this.state.isRecuring,
      lesson_notes: formData.lesson_notes
    }};

    if(this.state.isRecuring){
      data.lesson_date_time.period    = this.state.period
      data.lesson_date_time.frequency = this.state.frequency
      data.lesson_date_time.starttime = this.state.repeatStart._d
      data.lesson_date_time.endtime   =  this.state.endRepeatDate._d
      data.lesson_date_time.repeat_end_status = this.state.repeatEnd
      data.lesson_date_time.occurence = this.state.occurenceVal
      data.lesson_date_time.week_recuring_days = this.state.weekDays
      data.lesson_date_time.is_data_copied = this.state.studentCopied
    }

    if(this.state.extraLessonDetail){
	   	var studentData = [];
	    _.each(this.state.lessonStudentArray, function(value,key){
	      value['student_id'] = key
	      studentData.push(value)
	    });

      if(Object.keys(this.state.selectedHorses).length){
        var lessonHorse = [];
        _.each(this.state.selectedHorses, function(value,key){
          lessonHorse.push({horse_id: key})
        });
        data['lesson_date_time']['lesson_date_time_horses_attributes'] = lessonHorse;
      }
      data['lesson_date_time']['lesson_people_attributes'] = studentData;
    }
    this.props.addLesson(data);
  }

  validationMessage(field) {
    if (this.state.validations && this.state.validations[field]) {
      if (!this.state.validations[field].isValid) {
        return _.map(this.state.validations[field].message, (message,idx) => {
          return <span className="customValidationError" key={idx}>{message}</span>;
        });
      }
    }
    return <div/>;
  }

  afterValidation(formValidations) {
    $('.nameField').removeClass('lessonSectionField');
    $('.sectionField').removeClass('lessonSectionField');
    $('#add-new-lesson').animate({ scrollTop: 0 }, 'slow');
    console.log('xxxxxxxxxxxxxxxx',formValidations)
    this.setState({validations: formValidations, errorBox: true});
    _.each(formValidations, function(val, key){
      if(!val.isValid && key == 'name'){
        $('.nameField').addClass('lessonSectionField');
      }
      if(!val.isValid && key == 'section_id'){
        $('.sectionField').addClass('lessonSectionField');
      }
    });
  }

  addScheduledStartDate(date){
    var startDate = {};
    startDate.scheduledStartDate = date;
    startDate.endMinDate = moment(date);
    // if(moment(this.state.scheduledEndDate) < moment(date)){
      startDate.scheduledEndDate = date
    // }
    if(date){
      this.setState(startDate)
    }
  }

  addScheduledEndDate(date){
    this.setState({scheduledEndDate: date});
  }

  changeEndRepeatDate(date){
    this.setState({endRepeatDate: date});
  }

  startTimeChange(time){
    if(time){
      this.setState({startTime: moment(time), endTime: moment(time).add(60, 'minutes')});
    }  
  }

  endTimeChange(time){
    if(time){
      var endtime = time;
      if(moment(time) <= moment(this.state.startTime)){
        endtime = moment(this.state.startTime).add(60, 'minutes')
      }
      this.setState({endTime: moment(endtime)}) 
    }    
  }

  changeRecuring(e,val){
    this.setState({isRecuring: val});
    setTimeout(()=>{
      $('.selectpickerRecuring').selectpicker()
    },100)
  }

  changeLocation(e, location){
    this.setState({locationId: location});
  }

  selectRepeat(e){
    this.setState({period: e.target.value});
  }

  selectRepeatEvery(e){
    this.setState({frequency: e.target.value});
  }

  selectRepeatTime(e){
    this.setState({repeatTime: e.target.value}) 
  }

  fillMoreDetails(e){
    if(this.state.lessonName && this.state.sectionId){
      if(!this.state.extraLessonDetail){
        this.setState({btnText: '', hideFillExtraDetailBtn: false, validations: {}});
        // e.preventDefault();
      }else{
        this.setState({btnText: 'and fill in details later'});
      }
  	 this.setState({extraLessonDetail: true});
   
    	setTimeout(()=>{
        $('.selectpickerLessonHorse, .selectpickerStudents').selectpicker();
      },200);
    }
  }

  addName(e){
    this.setState({lessonName: e.target.value})
  }

  addSection(e){
    this.setState({sectionId: e.target.value})
  }

  addHorseToLesson(status, e, horseId, type){
    var that = this;
    var selectedHorses = this.state.selectedHorses;
    // var selectedValues = $(e.target).val();
    var selectedValues = e;
    _.each(selectedValues, function (horse, key1) {
      _.find(that.props.horses, function (value, key) {
          if(value.id == horse){
            selectedHorses[horse] = value
          }
      });
    });

    _.each(selectedHorses, function(value,key){
      if(selectedValues && selectedValues.indexOf(key) == -1){
        delete selectedHorses[key]
      }
    })
    var lessonStudentArray = this.state.lessonStudentArray;

    var hash = {};
    if(status){
      _.map(lessonStudentArray, function(val, key){
        if(parseInt(val.horse_id) == parseInt(horseId)){
          val.horse_id = null;
        }
        hash[key] = val;
      });
    }else{
      hash = lessonStudentArray;
    }
    selectedHorses = selectedValues ? selectedHorses : {};
    this.setState({selectedHorses: selectedHorses, horsesList: e, horseDeleted: false});
    setTimeout(()=>{
      $('.selectpicker').selectpicker('refresh');
    },300);
  };

  changeEnStatus(e, student){
    var data = this.state.lessonStudentArray;
    var horse_id = data[student] && data[student]['horse_id'] ? data[student]['horse_id'] : null;
    var paid = data[student] && data[student]['paid'] ? data[student]['paid'] : false;
    data[student] = {enrollment_status_id: e.target.value, horse_id: horse_id, paid: paid};
    var lessonArray = this.updateStudentAssingStatus(student, 'enrollment_status_id', e.target.value);
    this.setState({lessonStudentArray: data, lessonPeopleStates: lessonArray})
  };

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
    var that = this;
    $('.selectpicker-common').each(function(){
      $(this).selectpicker('refresh');
      if(!$(this).hasClass('selectpicker-'+student)){
        $(this).find('.horse-'+e.target.value).hide();
        $(this).selectpicker('refresh');
      }
    });

    $('.horse-'+currentSelectedHorse[student]).show();
    // var idx = selectedHorseIds.indexOf(currentSelectedHorse[student]);
    // if (idx !== -1) {
    //   selectedHorseIds.splice(idx, 1);
    // }
    // if(selectedHorseIds.indexOf(currentVal) == -1){
    //   selectedHorseIds.push(currentVal);
    // }
    selectedHorseIds.push(e.target.value);
    selectedHorseIds = _.uniq(selectedHorseIds)

    currentSelectedHorse[student] = currentVal;
    this.setState({selectedHorseIds: selectedHorseIds, currentSelectedHorse: currentSelectedHorse});
  };

  changePaidStatus(e, student){
    var data = this.state.lessonStudentArray;
    var isChecked = e.target.checked ? 1 : 0;
    var enrollment_status_id = data[student] && data[student]['enrollment_status_id'] ? data[student]['enrollment_status_id'] : null;
    var horse_id = data[student] && data[student]['horse_id'] ? data[student]['horse_id'] : null;
    data[student] = {horse_id: horse_id, enrollment_status_id: enrollment_status_id, paid: isChecked}
    var lessonPeopleStates = this.state.lessonPeopleStates;
    var lessonArray = this.updateStudentAssingStatus(student, 'paid', isChecked);
    this.setState({lessonStudentArray: data, lessonPeopleStates: lessonArray})
  };

  updateStudentAssingStatus(student, field, val){
    var lessonArray = [];
    _.each(this.state.lessonPeopleStates, function(lesson){
      if(lesson.student_id == student){
        lesson[field] = val
      }
      lessonArray.push(lesson);
    });
    return lessonArray;
  };

  selectStudent(type, e, status, stu){
    var assignedIds = this.state.selectedHorseIds;
    var currentSelectedHorse = this.state.currentSelectedHorse;
    var deletedStudentHorseId = currentSelectedHorse[stu];
    if(status && deletedStudentHorseId){
      $('.horse-'+deletedStudentHorseId).show();
    }
    var that = this;
    var lessonStudents = this.state.lessonStudents;
    var lessonStudentArray = this.state.lessonStudentArray;
    var enrollmentStatuse = _.find(that.props.enrollmentStatuses, function(enroll){
      return enroll.enrollment_status_name == 'scheduled'
    });
    // var options = $(e.target).val();
    var options = e;
    var lastId = options && options[options.length-1];
    _.each(options, function (option, key1) {
      _.find(that.props.students, function (value, key) {
          if(value.id == option && !lessonStudents[value.id]){ 
            lessonStudents[value.id] = value
            lessonStudentArray[value.id] = {paid: 0, enrollment_status_id: enrollmentStatuse ? enrollmentStatuse.id : null,
                                            horse_id: null, student_id:null }
          }
      });
    });

    setTimeout(()=>{
      $('.selectpicker').selectpicker();
      $('.check-mark').on('click',function(e){
        var lessonStudents = that.state.lessonStudents;
        var studentId = $(e.target).parent().attr('class');
        delete lessonStudents[studentId];
        that.setState({lessonStudents: lessonStudents });
      });

     _.each(lessonStudents, function(value,key){
        if(options && options.indexOf(key) == -1){
          delete lessonStudents[key]
        }
      });

      var selectedIds = [];
      var currentSelected = {};
      $('.attendeesList').each(function(){
        var stu = $(this).attr('id');
        var horse = $(this).find('.selectpicker-common').val();
        if(horse){
          selectedIds.push(horse);
          currentSelected[stu] = horse;
        }
      });

      if(!options){
        lessonStudents = {};
        assignedIds = [];
        currentSelectedHorse = {};
      }

      if(status){
        delete lessonStudentArray[stu];
      }
      this.setState({lessonStudents: lessonStudents,
      lessonStudentArray: lessonStudentArray, assignedIds: selectedIds,
      currentSelectedHorse: currentSelected, deletedStudent: false,
      studentList: e });

      _.each(assignedIds, function(id){
        $('.selectpicker-'+lastId).find('.horse-'+id).hide();
      });

      $('.selectpicker').selectpicker();
      $('.selectpicker-'+lastId).selectpicker('refresh');
    },200);
  };

  removeStudent(e,student){
    var studentData = this.state.lessonStudents;
    delete studentData[student];
    var lessonStudentArray = this.state.lessonStudentArray;
    delete studentData[student];
    delete lessonStudentArray[student];
    var selectedStudentIds = _.keys(studentData);

    $('.selectpickerStudents').selectpicker('val',selectedStudentIds);
    $('.selectpickerStudents').selectpicker('refresh');
    this.setState({lessonStudents: studentData,
    lessonStudentArray: lessonStudentArray, selectedStudentIds: selectedStudentIds});
    
    var currentSelectedHorse = this.state.currentSelectedHorse;
    var selectedHorseIds = this.state.selectedHorseIds;

    var idx = selectedHorseIds.indexOf(currentSelectedHorse[student]);
    var deletedHorse = currentSelectedHorse[student];
    if(idx >-1){
      selectedHorseIds.splice(idx, 1);
    }
    delete currentSelectedHorse[student];
    if(selectedStudentIds.length == 0){
      currentSelectedHorse = {};
      selectedHorseIds = [];
    }

    setTimeout(()=>{
      $('.horse-'+deletedHorse).show();
    },200);

    var studentList = this.state.studentList;
    var index = studentList.indexOf(student.toString());
    if(index > -1){
      studentList.splice(index, 1);
    }

    this.setState({currentSelectedHorse: currentSelectedHorse,
    selectedHorseIds: selectedHorseIds, deletedStudent: student, studentList: studentList});
  };

  addWeekDays(e){
    var checked = e.target.checked;
    var val = e.target.value;
    var weekDays = this.state.weekDays;
    var index = weekDays.indexOf(val);
    if(index == -1 && checked){
      weekDays.push(val)
    }else{
      weekDays.splice(index, 1)
    }
    this.setState({weekDays: weekDays})
  };

  shouldStudentCopied(e, val){
    this.setState({studentCopied: val});
  };

  createOptions(data, field){
    return <option value={data.id} key={data.id}>{data[field]}</option> 
  };

  changeInstructor(e){
    this.setState({instructorId: e.target.value});
  }

  createLocationList(location){
    return <div key={location.id} className="snglChck"><label>{location.location_name}
    <input checked={this.state.locationId == location.id} onChange={(e)=>{this.changeLocation(e, location.id)}} type="radio" name="location" /><span></span></label></div>
  };

  createRepeatOptions(times){
    return _.range(1, times).map(value => <option key={value} value={value}>{value}</option>)
  };

  dayCheckBoxes(times){
    return _.range(0, times).map((value,key) => <div key={key} className="cbSngl"><label><p>{RepeatDays[key]}</p><input type="checkbox" value={key} onChange={(e)=>{this.addWeekDays(e)}}/><span></span></label></div>)
  };

  createHorsesList(horse){
    return <option value={horse.id} key={horse.id} className={`horse-list horse-${horse.id} userImage ${studentIcons[iconIndex]}`}>{horse.horse_name}</option> 
  };

  lessonHorseList(horse){
    var avatar = horse.avatar ? horse.avatar : 'horse_avatar_01.svg';
    return <div className="snglClDtl" key={horse.id}>
            <div className="clntNmeImg">
              <div className="clientImg"><img src={`/assets/${avatar}`} alt="Client Image" /></div>
                <div className="clntName">{horse.horse_name}</div>
              </div>
            <div className="adhCross" onClick={(e)=> {this.removeHourse(e, horse.id)}}>
          <button></button>
      </div>
    </div>
  };

  removeHourse(e, horseId){
    var selectedHorsesList = this.state.selectedHorses;
    delete selectedHorsesList[horseId];
    this.setState({selectedHorses: selectedHorsesList});
    var selectedValues = Object.keys(selectedHorsesList);
    $('.selectpickerLessonHorse').selectpicker('val',selectedValues);
    setTimeout(()=>{
      $('.selectpickerLessonHorse').selectpicker('refresh');
      $('.selectpicker').selectpicker('refresh');
    })

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

    this.setState({horseDeleted: horseId, horsesList: horsesList,
    currentSelectedHorse: currentSelectedHorse, 
    selectedHorseIds: selectedHorseIds});
    var lessonStudentArray = this.state.lessonStudentArray;
    var hash = {};
    lessonStudentArray = _.map(lessonStudentArray, function(val, key){
      if(parseInt(val.horse_id) == parseInt(horseId)){
        val.horse_id = null;
      }
      hash[key] = val;
    });

    _.each($('.selectpicker-common'), function(a){
        var id = $(a).find('p.multiSelAssigned').find('span').attr('id');
        if(id){
          if(parseInt(id) == horseId){
            $(a).find('p.multiSelAssigned').find('span').text('');
            $('.selectpicker-common').selectpicker('refresh');
          }
        }
    })
    $('.selectpicker-common').selectpicker('refresh');
  };

  createOptionsStudent(status){
    return <option value={status.id} key={status.id}>{status.student_name}</option>
  };

  createenrollmentStatusesList(status){
    return <option value={status.id} key={status.id}>{status.enrollment_status_name}</option>    
  };

  changeRepeatStartDate(date){
    var endRepeatMinDate = this.state.endRepeatMinDate;
    var endRepeat = this.state.endRepeatDate;
    var tmpDate = date;
    var state = {repeatStart: date};
    if(moment(endRepeat) <= moment(date)){
      state.endRepeatDate = moment(date).clone().add(1, 'days');
    }
    state.endRepeatMinDate = moment(date).clone().add(1, 'days');
    this.setState(state);
  };

  changeRepeatEndDate(e){
    this.setState({repeatEnd: e.target.value});
  };

  endRepeatOccurance(e){
   var occurenceVal = 1;
   const re = /^[0-9\b]+$/;
    if (e.target.value == '' || re.test(e.target.value)) {
     occurenceVal = e.target.value
    }
    this.setState({occurenceVal: occurenceVal});
  };

  createStudentLessonList(student){
    var horses = _.map(this.state.selectedHorses, this.createHorsesList);
    var enrollmentStatuses = _.map(this.props.enrollmentStatuses, this.createenrollmentStatusesList);
    var selectpickerCls = "selectpicker selectpicker-common"+ " selectpicker-"+student.id;
    return <div className="snglClDtl attendeesList" key={student.id} id={student.id}>
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
                      <input type="checkbox" onChange={(e) => 
                        {this.changePaidStatus(e, student.id)}}/>
                      <span></span>
                    </label>
                  </div>
                </div>
              <div className="slct_cnt dblSelect clearfix">
                <div className="snglFld">
                  <label>Status</label>
                    <select className="selectpicker" value={this.state.defaultEnrollmentStatus} onChange={(e) => {this.changeEnStatus(e,student.id)}}>
                      <option value="">Select Status</option>
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
                    width = '336px'
                  />

                </div>
              </div>
          </div>
        </div>
      </div>
  }
  
  // markEveryOnePaid(e){
  //   var data = this.state.lessonStudentArray;
  //   var isChecked = e.target.checked ? 1 : 0;
  //   var lessonArray = this.updateStudentAssingStatus(student, 'paid', 1);
  //   this.setState({lessonStudentArray: data, lessonPeopleStates: lessonArray})
  // }

  createStudentGroupList(student){
    if(iconIndex > 1){
      iconIndex = -1
    }
    iconIndex++;
    return <option value={student.id} key={student.id} className={`userImage ${studentIcons[iconIndex]}`}>{student.student_name}</option>
  }

  createHorseGroupList(horse){
    if(horseIconIndex > 1){
      horseIconIndex = -1
    }
    horseIconIndex++;
    return <option value={horse.id} key={horse.id} className={`userImage ${studentIcons[horseIconIndex]}`}>{horse.horse_name}</option>
  }

  render() {
    var lessonStudents = this.props.students || [];
    var group1 = lessonStudents.slice(0,4);
    var group2 = lessonStudents.slice(4);

    var lessonHorses = this.props.horses || [];
    var groupHorse1 = lessonHorses.slice(0,4);
    var groupHorse2 = lessonHorses.slice(4);


    var locations = _.map(this.props.locations, this.createLocationList);
    var sections = _.map(this.props.sections, (data)=>{ return this.createOptions(data,'section_name')});
    var instructors = _.map(this.props.instructors, this.createInstructorList);
    var horses = _.map(this.props.horses, this.createHorsesList);
    var lessonHorses = _.map(this.state.selectedHorses, this.lessonHorseList);
    var students = _.map(this.props.students, this.createOptionsStudent);
    var lessonStudentList = _.map(this.state.lessonStudents, this.createStudentLessonList);

    let studentsGroup1 = _.map(group1, this.createStudentGroupList);
    let studentsGroup2 = _.map(group2, this.createStudentGroupList);

    // let horsesGroup1 = _.map(groupHorse1, this.createHorseGroupList);
    // let horsesGroup2 = _.map(groupHorse2, this.createHorseGroupList);

    return (
      <div className="addLsnPop">
        <AtomicForm ref="editLessonForm" initialData={this.state.initialData} 
          doSubmit={this.doSubmit} afterValidation={this.afterValidation}>
          <div className="alpInr">
            <div className="popHead">
              <h2>Add a lesson</h2>
            </div>
            <div className="closePop" onClick={()=>{this.props.closeModal()}}><span></span></div>
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

              <div className="snglFld sectionField">
                <label>Section</label>
                <select id="lessonSection" className="selectpicker lesson" 
                ref="section_id" validate={
                  [{
                    message: "*Required",
                    validate: "isPresent",
                    }
                  ]} onChange={(e)=>{this.addSection(e)}}>
                  <option value="">Select Section</option>
                  {sections}
                </select>
                <span>{this.state.nameRequired}</span>
                {this.validationMessage("section_id")}
              </div>
              <div className="snglFld nameField">
                <label>Lesson name</label>
                <input type="text" ref="name" validate={[{
                  message: "*Required",
                  validate: "isPresent",
                  }]} onChange={(e)=>{this.addName(e)}}/>
                {this.validationMessage("name")}
                <span>{this.state.sectionRequired}</span>
              </div>
              <div className="slct_cnt dblSelect clearfix">
                <label>Starts</label>
                <div className="snglFld">
                  <DatePicker
                    selected={this.state.scheduledStartDate}
                    onChange={this.addScheduledStartDate}
                    dateFormat="MMMM DD , YYYY"
                    minDate='0'
                    ref="startDate"
                    readOnly={true}
                   />
                </div>
                <div className="snglFld">
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
                   onChange={this.addScheduledEndDate}
                   dateFormat="MMMM DD , YYYY"
                   minDate={this.state.endMinDate}
                   readOnly={true}
                   validate={[{
                     message: "End date is required",
                      validate: "isPresent",
                    }]}/>
                    {this.validationMessage("endDate")}
                </div>
                <div className="snglFld">
                  <TimePicker 
                    format="hh:mm A"
                    showSecond={false}
                    onChange={this.endTimeChange}
                    value={this.state.endTime}
                    use12Hours={true}
                    className="endtimepicker"
                    popupClassName="endtimepickerpopup"
                    allowEmpty={false}
                    />
                </div>
              </div>
              <div className="snglFld">
                <label>Is this lesson recurring</label>
                <div className="snglChck">
                  <label>
                  NO<input type="radio" checked={this.state.isRecuring == false} name="rcrng" onChange={(e)=>{this.changeRecuring(e, false)}}/>
                  <span></span>
                  </label>
                </div>
                <div className="snglChck">
                  <label>
                  YES<input type="radio" checked={this.state.isRecuring == true} name="rcrng" onChange={(e)=>{this.changeRecuring(e, true)}}/>
                  <span></span>
                  </label>
                </div>
              </div>
              {this.state.isRecuring &&
                <div className="rcrngYes">
                  <div className="slct_cnt clearfix">
                    <label>Lesson repeats</label>
                    <div className="snglFld">
                      <select value={this.state.period} className="selectpicker selectpickerRecuring" onChange={(e)=> {this.selectRepeat(e)}}>
                        <option value="day">Daily</option>
                        <option value="week">Weekly</option>
                      </select>
                    </div>
                  </div>

                  <div className="slct_cnt dblSelect clearfix">
                    <label>Starts repeat on</label>
                    <div className="snglFld">
                      <DatePicker selected={this.state.repeatStart} onChange={this.changeRepeatStartDate} dateFormat="MMMM DD , YYYY" readOnly={true} />
                    </div>
                  </div>

                  <div className="rcrngRdo">
                    <label>Ends repeat</label>
                    <div className="snglFld">
                      <div className="snglChck">
                        <label>
                          <p>Never</p>
                          <input type="radio" name="repeat" value="never"
                          onChange={(e)=>{this.changeRepeatEndDate(e)}} checked={this.state.repeatEnd == 'never'}/>
                          <span></span>
                        </label>
                      </div>
                    </div>
                    <div className="snglFld">
                      <div className="snglChck">
                        <label>
                          <input type="radio" name="repeat" value="after"
                          onChange={(e)=>{this.changeRepeatEndDate(e)}} checked={this.state.repeatEnd == 'after'}/>
                          <span></span>
                        </label>
                        <div className="aftrOcnc">
                          <span>After</span> {this.state.repeatEnd == 'after' &&
                          <div className="aoInpt">
                            <input type="text" value={this.state.occurenceVal} onChange={(e)=>{this.endRepeatOccurance(e)}}/>
                          </div>
                          }
                          <span>Occurences</span>
                        </div>
                      </div>
                    </div>
                    <div className="snglFld">
                      <div className="snglChck">
                        <label>
                          <input type="radio" name="repeat" value="on" 
                          onChange={(e)=>{this.changeRepeatEndDate(e)}} checked={this.state.repeatEnd == 'on'}/>
                          <span></span>
                        </label>
                        <div className="aftrOcnc">
                          <span>On</span>
                          <div className="slct_cnt">
                            <div className="snglFld">
                              {this.state.repeatEnd == 'on' &&
                              <DatePicker selected={this.state.endRepeatDate} onChange={this.changeEndRepeatDate} dateFormat="MMMM DD , YYYY" minDate={this.state.endRepeatMinDate} readOnly={true} /> }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="snglFld">
                      <label>Current students and horses also should be copied ?</label>
                      <div className="snglChck">
                        <label>
                        NO<input type="radio" checked={this.state.studentCopied == false} name="stucp" onChange={(e)=>{this.shouldStudentCopied(e, false)}}/>
                        <span></span>
                        </label>
                      </div>
                      <div className="snglChck">
                        <label>
                        YES<input type="radio" checked={this.state.studentCopied == true} name="stucp" onChange={(e)=>{this.shouldStudentCopied(e, true)}}/>
                        <span></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              }
              <InstructorDropdown
                instructors={this.props.instructors}
                changeInstructor={this.changeInstructor}
              />
              <div className="snglFld">
                <label>Location</label>
                {locations}
              </div>
              <div className="snglFld">
                {this.state.extraLessonDetail &&
  	              <div>
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
                          type='add'
                        />


  									    <div className="addedHrse">
  									      <div className="adhInr">
  									        {lessonHorses}
  									      </div>
  									    </div>
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
                            type='add'
                            />
  									    </div>
                        {lessonStudentList && lessonStudentList.length > 0 && 
    									    <div className="addedHrse">
    									      <div className="adhInr">
    									        {lessonStudentList}
    									      </div>
    									    </div>
                        }
  									  </div>
  									</div>
  									<div className="snglBlck">
  									  <div className="blckHead">LESSON NOTES</div>
  									  <div className="popBody">
  									    <div className="lnText">
  									      <label>Add a note visible to client and staff assigned to this lesson (optional)</label>
  									      <textarea rows="6" ref="lesson_notes"></textarea>
  									    </div>
  									  </div>
  									</div>
  								</div>
  							}
              <div className="btmBtns">
                <div className="bbsnglBtn primaryBtn">
                  {this.state.hideFillExtraDetailBtn &&
                    <button type="submit" onClick={(e)=>{this.fillMoreDetails(e)}}>Add Students/Horses to Lesson</button>
                  }
                </div>
                <div className="bbsnglBtn orangeBtn">
                  <button type="submit">Save lesson {this.state.btnText}</button>
                </div>
                <div className="bbsnglBtn defaultBtn">
                  <a href="javascript:void(0)" onClick={(e)=> this.props.closeModal()}>Cancel</a>
                </div>
              </div>
            </div>

            </div>
          </div>
        </AtomicForm>
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    sections: state.sections,
    instructors: state.instructors,
    locations: state.locations,
    horses: state.horses,
    students: state.students,
    enrollmentStatuses: state.enrollment_statuses
  }
};

function matchDispatchToProps(dispatch){
  return bindActionCreators({getLesson: LessonAction.getLesson,
  addLesson: LessonAction.addLesson,
  getSections: getSections, getInstructors: getInstructors,
  getLocations: getLocations},dispatch);
}



export default connect(mapStateToProps, matchDispatchToProps)(AddLesson);
