import React, {Component} from 'react';
import BaseComponent      from '../components/base_component';

export default class InstructorDropdown extends BaseComponent {
  constructor(props, context){
    super(props, context);
    this.state={}
    this._bind('createInstructorList','changeInstructor');
  }

  componentDidMount(){
    $(".dropdown-inst dt a").on('click', function () {
      $(".dropdown-inst dd ul").toggle();
    });

    $(document).click(function (e) {
        e.stopPropagation();
        var container = $(".dropdown");
        if (container.has(e.target).length === 0) {
          $(".dropdown-inst dd ul").hide();
        }
    });
    if(this.props.instructorName){
      var html = '<span title="' + this.props.instructorName + '">' + this.props.instructorName + '</span>';
      $('.multiSelInst ').html(html);
      $('#checkbox-'+this.props.defaultInstructor).prop('checked', true);
      $(".hida").hide();
      setTimeout(()=>{
        $('#inst-'+this.props.defaultInstructor).find('input[type="checkbox"]').parent().append('<span class="chk"></span>');
        $('#inst-'+this.props.defaultInstructor).trigger('click');
        $('#inst-'+this.props.defaultInstructor).find('input[type="checkbox"]').parent().find('span.chk').css('visibility', 'visible');
      },1000);
    }
  }

  changeInstructor(e){
    $('.commonInst').prop('checked',false);
    $('#checkbox-'+e.target.value).prop('checked',true);
    var label = $(e.target).parent().attr('class');
    // $('span.chkInst').remove();
    $(e.target).parent().append('<span class="chkInst"></span>');
    var html = '<span title="' + label + '">' + label + '</span>';
    $('.multiSelInst').html(html);
    $(".hida").hide();
    $(".dropdown-inst dd ul").hide();
    this.props.changeInstructor(e);
  }

  createInstructorList(instructor){
    var uniqId = 'inst-'+instructor.id;
    var chkId = 'checkbox-'+instructor.id;
    return <li key={instructor.id} id={uniqId}>
      <label>
        <div className={instructor.instructor_name}>
          <input id={chkId} className="commonInst" type="checkbox" value={instructor.id} name={instructor.name} onClick={(e)=>{this.changeInstructor(e)}}/>
          <span className="chkInst"></span> 
        </div>
        <div className="instructorImg"><img className="img-test" src="/assets/userImage.png" width="10px" height="10px"/></div>
        <p>{instructor.instructor_name}</p>
      </label>
    </li>
  }

  render() {
    var instructors = _.map(this.props.instructors, this.createInstructorList);
    var className = 'selectpicker '+ this.props.className;

    return <div className="slct_cnt clearfix">
          <label>Instructor</label>
          <div className="snglFld custmSelect">
            <dl className="dropdown dropdown-inst"> 
              <dt>
                <a href="#">
                  <span className="hida">Select instructor</span>    
                  <p className="multiSel multiSelInst"></p>  
                </a>
                </dt>
                  <dd>
                    <div className="mutliSelect">
                        <ul>
                          {instructors}
                        </ul>
                    </div>
                </dd>
            </dl>
        </div>
    </div>
  }
}
