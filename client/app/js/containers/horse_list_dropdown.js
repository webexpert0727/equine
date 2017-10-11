import React, {Component} from 'react';
import BaseComponent      from '../components/base_component';

export default class horseListDropdown extends BaseComponent {
  constructor(props, context){
    super(props, context);
    this.state={selectedHorses: []}
    this._bind('createHorsesList','changeHorse');
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.horseDeleted){
      $('span#newhorse-'+nextProps.horseDeleted).remove();
      $('#horseId-'+nextProps.horseDeleted).prop('checked',false)
    }
    if(nextProps.horsesList.length == 0){
      $('.horseOption').remove();
      var ret = $(".hida-horse");
      $('.dropdown-horse dt a').append(ret);
    }
    var selectedHorses = this.state.selectedHorses;

    if(nextProps.type == 'edit' && _.keys(nextProps.selectedHorses).length > 0 && nextProps.init){
      _.each(this.props.selectedHorses, function(val, key){
        var id = val.id;
        selectedHorses.push(id.toString());
        selectedHorses = _.uniq(selectedHorses);
        $('#newhorse-'+val.id).remove();
        $('#horseId-'+val.id).prop('checked',true);
        var html = '<span class="horseOption" id="newhorse-'+val.id+'" title="' + val.horse_name + '">' + val.horse_name + '</span>';
        $('.multiSelHorses').append(html);
        $(".hida-horse").hide();
      });
      this.setState({selectedHorses: selectedHorses});
    }

  }

  componentDidMount(){
    var that = this;
    var selectedHorses = this.state.selectedHorses;

    $(".dropdown-horse dt a.horse-list").on('click', function () {
      $(".dropdown-horse dd ul").slideToggle('fast');
    });

    $(".dropdown-horse dd ul li a").on('click', function () {
      $(".dropdown-horse dd ul").hide();
    });

    function getSelectedValue(id) {
      return $("#" + id).find("dt a span.value").html();
    }

    $(document).bind('click', function (e) {
      var $clicked = $(e.target);
      if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
    });
    $('.mutliSelectHorse li, input[type="checkbox"]').on('click', function (e) {
    });


  }

  changeHorse(e){
    var selectedHorses = this.state.selectedHorses;
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
      val = $(e.target).find('input[type="checkbox"]').val();
    }
    if ($(e.target).find('input[type="checkbox"]').is(':checked') || $(e.target).is(':checked')) {
      var html = '<span class="horseOption" id="newhorse-'+val+'" title="' + title + '">' + title + '</span>';
      $('.multiSelHorses').append(html);
      $(".hida-horse").hide();
    } else {
      $('span[title="' + title + '"]').remove();
      var ret = $(".hida-horse");
      $('.dropdown-horse dt a').append(ret);
    }
    var removedHorse = false;
    if(selectedHorses.indexOf(val) == -1){
      selectedHorses.push(val);
    }else{
      removedHorse = true;
      selectedHorses.splice(selectedHorses.indexOf(val), 1);
    }
      console.log('yyyyy',selectedHorses)
    this.props.addHorseToLesson(removedHorse, selectedHorses, val, this.props.type);
  }

  createHorsesList(horse){
    var uniqId = 'horseId-'+horse.id;
    var avatar = horse.avatar ? horse.avatar : 'horse_avatar_01.svg';
    return <li key={horse.id} id={horse.id}>
    <label>
    <div className={horse.horse_name}>
    <input type="checkbox" id={uniqId} className={horse.horse_name} value={horse.id} name={horse.name} onClick={(e)=>{this.changeHorse(e)}}/>
    <span className="chkHorse" ></span>
    </div>
    <div className="instructorImg"><img className="img-test" src={`/assets/${avatar}`}/></div>
    <p>{horse.horse_name}</p>
    </label>
    </li>
  }

  render() {
    var groupHorse1 = _.map(this.props.groupHorse1, this.createHorsesList);
    var groupHorse2 = _.map(this.props.groupHorse2, this.createHorsesList);
    var className = 'selectpicker '+ this.props.className;

    return <div className="slct_cnt clearfix">
    <label>Add horse to lesson</label>
    <div className="snglFld custmSelect">
    <dl className="dropdown dropdown-horse"> 
    <dt>
    <a href="#" className="horse-list">
    <span className="hida-horse">Select horses</span>    
    <p className="multiSel multiSelHorses"></p>  
    </a>
    </dt>
    <dd>
    <div className="mutliSelect mutliSelectHorse">
    <ul>
    <li className="topHeadSel"><span>Section 1 horses</span></li>
    <li className="midHead"><span>Add all Section 1 horses</span></li>
    {groupHorse1}
    <li className="lastHead"><span>Add all Section 1 horses</span></li>
    {groupHorse2}
    </ul>
    </div>
    </dd>
    </dl>
    </div>
    </div>
  }
}