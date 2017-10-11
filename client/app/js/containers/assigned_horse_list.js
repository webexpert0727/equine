import React, {Component} from 'react';
import BaseComponent      from '../components/base_component';

export default class AssignedHorseList extends BaseComponent {
  constructor(props, context){
    super(props, context);
    this.state={selectedHorseIds: []}
    this._bind('createList','changeHorse');
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.deletedAssignedHorse){
      $('span#newassigned-'+nextProps.deletedAssignedHorse).remove();
      $('#horseId-'+nextProps.deletedAssignedHorse).prop('checked',false)
    }
    if(nextProps.assignedHorseList.length == 0){
      $('.assignedOption').remove();
      var ret = $(".hida-assigned");
      $('.dropdown-assigned dt a').append(ret);
    }
  }

  componentDidMount(){
    if(this.props.type == 'edit' && this.props.lessonDateTime && this.props.lessonDateTime.lesson_people){
      var hash = {};
      var horseIds = [];
      _.each(this.props.lessonDateTime.lesson_people, function(lesson){
        if(lesson.student_id){
          hash[lesson.student_id] = lesson;
        }
        if(lesson.horse_id){
          horseIds.push(lesson.horse_id);
        }
      });

      setTimeout(()=>{
        $('.horse-list').show();
        $('.stdHorseList').find('.mutliSelectAssigned').each(function(){
          var id = $(this).attr('name');
          var horse = hash[id];
          if(horse){
            $(this).find('#assignedId-'+horse.horse_id).attr('value',horse.horse_id);
            $(this).find('#assignedId-'+horse.horse_id).prop('checked',true);
            var hidaAssigned = '.hida-assigned-'+id;
            $('#std-'+id).text(horse.horse_name);
            $('#std-'+id).attr('name', horse.horse_id);
            $(hidaAssigned).hide();
          }
        });

      $('.stdHorseList').each(function(){
        var val = $(this).find('.assigned-list > .multiSelAssigned').attr('name');
        var tmpIds = horseIds.slice(0);
        var that = this;
        _.each(tmpIds, function(id){
          if(parseInt(val) != id){
            $(that).find('.horse-'+id).hide();
          }
        });
          $(this).selectpicker('refresh');
        });
      },1000);
    }
    
    var that = this;

    $(".dropdown-assigned-"+this.props.student+" dt a.assigned-list").on('click', function () {
      $(this).parent().parent().find('dd ul').show();
    });
 
    function getSelectedValue(id) {
      return $("#" + id).find("dt a span.value").html();
    }

    $(document).bind('click', function (e) {
      var $clicked = $(e.target);
        if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
      });
      $('.mutliSelectAssigned li, input[type="checkbox"]').on('click', function (e) {
    });
  }

  changeHorse(e){
    $('.commonAssigned-'+this.props.student).prop('checked',false);
    $(e.target).prop('checked',true);
    var label = $(e.target).parent().attr('class');
    var stdClass = 'dropdown-assigned-'+this.props.student;
    var hidaAssigned = '.hida-assigned-'+this.props.student;

    $(e.target).parent().append('<span class="chkInst"></span>');
    var html = '<span id="'+e.target.value+'" title="' + label + '">' + label + '</span>';
    $('#std-'+this.props.student).html(html);
    $(hidaAssigned).hide();
    $("."+stdClass+" dd ul").hide();
    this.props.changeHourse(e, this.props.student);
  }

  createList(horse){
    var avatar = horse.avatar ? horse.avatar : 'horse_avatar_01.svg';
    var uniqId = 'assignedId-'+horse.id;
    return <li key={horse.id} className={`horse-list horse-${horse.id}`}>
      <label>
        <div className={horse.horse_name}>
          <input type="checkbox" id={uniqId} className={'commonAssigned-'+this.props.student} value={horse.id} name={horse.name} onClick={(e)=>{this.changeHorse(e)}}/>
          <span className="chkhorse" ></span>
        </div>
        <div className="instructorImg"><img className="img-test" src={`/assets/${avatar}`}/></div>
        <p >{horse.horse_name}</p>
      </label>
    </li>
  }

  render() {
    var group1 = _.map(this.props.group1List, this.createList);
    var className = 'selectpicker '+ this.props.className;
    var studentId = "std-"+this.props.student;
    var stdClass= "dropdown dropdown-assigned-"+this.props.student;
    var hidaAssigned = "hida-assigned-"+this.props.student;
    return <div className={`slct_cnt clearfix ${this.props.className}`}>
          <div className="snglFld custmSelect">
            <dl className={stdClass}> 
              <dt>
                <a href="#" className="assigned-list">
                  <span className={hidaAssigned}>Select horse</span>    
                  <p className="multiSel multiSelAssigned" id={studentId}></p>  
                </a>
                </dt>
                  <dd>
                    <div className="mutliSelect mutliSelectAssigned" name={this.props.student}>
                      <ul>
                        <li className="topHeadSel"><span>Section 1 horses</span></li>
                        <li className="midHead"><span>Add all Section 1 horses</span></li>
                          {group1}
                        </ul>
                    </div>
                </dd>
            </dl>
        </div>
    </div>
  }
}