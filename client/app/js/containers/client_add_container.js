import React, {Component}           from 'react';
import {connect}                    from 'react-redux';
import { login }                    from '../actions/user';
import { getLocations }             from '../actions/location';
import { getLessonStatus }          from '../actions/lesson_status';
import { getSections }              from '../actions/section';
import { getInstructors }           from '../actions/instructor';
import { getStudents }              from '../actions/student';
import  LessonAction                from '../actions/lesson';
import AtomicForm                   from "atomic-form";
import { bindActionCreators }       from 'redux';
import { browserHistory }           from 'react-router';
import { RadioGroup, Radio }        from 'react-radio-group'
import { Button }                   from 'react-bootstrap'
import moment                       from 'moment';
import ReactSelect                  from 'react-select';
import ReactSuperSelect             from 'react-super-select'
import Settings                     from '../settings';
import Modal                        from "simple-react-modal";
import BaseComponent                from '../components/base_component';
import CreateAddress                from '../components/create-address';
import CreateClient                 from '../components/CreateClient';
import CreateHorse                  from '../components/CreateHorse';

import _                            from "lodash";
import Api                          from   "../actions/api";
import QuickModalTemplate           from './quick_modal_template';
import EditModalTemplate            from './edit_modal_template';
import AddLesson                    from './add_lesson';
import DuplicateLesson              from './duplicate_lesson';
import { Link } from 'react-router';
import ModalTemplate                from '../components/ModalTemplate';
import FooterContainer              from './footer_container';

import validate from '../startup/validate';

class ClientAddContainer extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      // clientDetails: {}
      firstName: '',
      lastName: '',
      isClient: false,
      birthday: '',
      ridingLevel: '',
      address1: '',
      address2: '',
      city: '',
      state_province: '',
      country: '',
      homeNumber: '',
      phoneNumber: '',
      email: '',
      billing: 'client',
      payment: 'check',
      client: '',
      horse: '',
      emergencyFirst: '',
      emergencyLast: '',
      emergencyRelationship: '',
      emergencyPN: '',
      note: '',

      createAddress: false,
      createClient: false,
      createHorse: false,
      //--------------
      existing_client: '',
      clients: [],
      msg: 'New client has been added successfully!',
      url: '/clients',
    };

    // bindings
    this.onChangeByKey = this.onChangeByKey.bind(this);
    this.onSelectByKey = this.onSelectByKey.bind(this);

    this.onSelectClient = this.onSelectClient.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitAddClient = this.submitAddClient.bind(this);

    // this.onChangeFirstName = this.onChangeByKey.bind(this, 'firstName');

    // this.onChangePayment = this.onSelectByKey.bind(this, 'payment');
  }

  componentDidMount() {
    let component = this;
    validate (this.form, {
      rules: {
        firstName: {
          required: true,
        },
        lastName: {
          required: true,
        },
        email: {
          required: true,
          email: true,
        },
      },
      messages: {
        firstName: {
          required: 'What\'s your first name?',
        },
        lastName: {
          required: 'What\'s your last name?',
        },
        email: {
          required: 'Need an email address.',
          email: 'Invalid email address',
        },
      },
      submitHandler() { component.submitAddClient(); }
    });
  }

  onChangeByKey(key, e) {
    this.setState({ [key]: e.target.value });
  }

  onSelectByKey(key, value) {
    if(value) this.setState({ [key]: value, [`create${_.capitalize(key)}`]: false, [`selected${_.capitalize(key)}`]: true });
    else this.setState({ [`create${_.capitalize(key)}`]: true, [`selected${_.capitalize(key)}`]: true });
  }

  onSelectClient(client) {
    if (client) this.setState({ createClient: false, clients: this.state.clients.concat([client])});
    else this.setState({ createClient: true });
  }

  handleChange() {
    this.setState({isClient: !this.state.isClient})
  }

  onSubmit(data) {
    console.log(data);
  }

  componentWillMount(){
    this.props.getHorses();
    this.props.getClients();
    // console.log(this.props.getHorses());
    console.log('client add wil mount');
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.addclientStatus) {
      this.refs.modalTemp.show();
    }
  }

  submitAddClient() {

    let formData = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      isClient: this.state.isClient,

      birthday: this.state.birthday,
      ridingLevel: this.state.ridingLevel,

      billing: this.state.billing,
      existing_client: this.state.existing_client,

      address1: this.state.address1,
      address2: this.state.address2,
      city: this.state.city,
      state_province: this.state.state_province,
      country: this.state.country,
      homeNumber: this.state.homeNumber,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,

      note: this.state.note,
    };

    console.log("Form Data", formData);
    this.props.addClient(formData);

  }


  render() {

    console.log("Add Client Status", this.props.addclientStatus);

    var noneDisplayStyle = {
      display: 'none'
    };

    const newHorse = {
      horse_name: '+ Create new horse',
      id: null
    };
    const horses = this.props.horses ? [newHorse].concat(this.props.horses) : [newHorse];

    const user = Settings.currentUser();
    const options_riding = [
      { value: 'level1', label: 'Level1' },
      { value: 'level2', label: 'Level2' },
      { value: 'level3', label: 'Level3' }
    ];
    const options_client = [
      { value: null, label: '+ Create new client' },
      { value: 'client1', label: 'Client1' },
      { value: 'client2', label: 'Client2' },
      { value: 'client3', label: 'Client3' },

    ];
    const options_horse = [
      { value: null, label: '+ Create new horse' },
      { value: 'horse1', label: 'Horse1' },
      { value: 'horse2', label: 'Horse2' },
      { value: 'horse3', label: 'Horse3' },

    ];

    const options_existingClient = [];
    Object.keys(this.props.clients).map(key => {
      var tmp = {value: this.props.clients[key].id, label: this.props.clients[key].person_name};
      options_existingClient.push(tmp);
    });



    const options_address = [
      { value: null, label: '+ Create new address' },
      { value: 'address1', label: 'address1' },
      { value: 'address2', label: 'address2' }
    ];

    var groceries = [
    {
      id: 1,
      attributeName: "apple",
      label: "Apple",
      iconClass: "rss-grocery rss-grocery-apple",
      group: "Fruits",
    },{
      id: 2,
      attributeName: "carrot",
      label: "Carrot",
      iconClass: "rss-grocery rss-grocery-carrot",
      group: "Vegetables",
    },
    ];

    const getClients = (input) => {
      return fetch(`/users/${input}.json`)
        .then((response) => {
          return response.json();
        }).then((json) => {
          return { options: json };
        });
    }


    var groceryCartItemTemplate = function(item) {
      var itemClasses = className('grocery-item',
                          'example-' + item.group.toLowerCase()),
            iconClasses = className('grocery-icon',
                          'rss-grocery',
                          'rss-grocery-' + item.attributeName);
                          return(
                            <div className={itemClasses}>
                              <span className={iconClasses}></span>
                              <p>{item.label}</p>
                            </div>
                          );

    }

    function logChange(val) {
      console.log("Selected: " + JSON.stringify(val));
    }

    return (

      <div className="rightMain">
        <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
          <div className="rghtHeadTop clearfix">
            <h1>Add a Client</h1>
            <div className="rhtSrch">
              <form>
              <input type="text" placeholder="Search Clients" className="test"/>
                <button type="submit"></button>
              </form>
            </div>
          </div>
          <div className="rghtCalCntnr clearfix dashboard">

            <div className="rccInr">
              <h5 className="addCnt_title">Clients > Add a Client</h5>
              <div className="addCnt">
              {/* {this.state.userRole != 'student' && */}
                <Link to='/clients'>Back to Lists</Link>
              {/* } */}
              </div>
            </div>
          </div>
          <div className="rghtCntTop clearfix"></div>
          <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
              <div className="addcnt_info">
                <div className="addcnt_photo">
                  <div className="cnt_photo">
                    <img src="/assets/userImage.png" className="user_image" alt="User Image" /><br />
                    <a href="javascript:void(0)" onClick={(e)=>{ this.changePhoto(e) }}>Change Photo</a>
                  </div>
                  <div className="cnt_name">
                    <p></p>
                  </div>
                </div>

                <div className="addcnt_detail">
                  <div className="addcnt_title">
                    <h2>client details</h2>
                  </div>
                  <div className="cnt_detail">
                    <div className="padding_bottom_25">
                      <label className="cnt_label">First name*</label>
                      <input type="text" placeholder="" id="cnt_firstname" name="firstName" className="cnt_firstname cnt_input form-control" value={this.state.firstName} ref={firstName => (this.firstName = firstName)} onChange={(e) => this.onChangeByKey("firstName", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Last name*</label>
                      <input type="text" placeholder="" id="cnt_lastname" name="lastName" className="cnt_lastname cnt_input form-control" value={this.state.lastName} ref={firstName => (this.firstName = firstName)} onChange={(e) => this.onChangeByKey("lastName", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Is Client a Student</label>
                      <input type="checkbox" id="cnt_isClient" className="cnt_isClient cnt_input form-control " checked={this.state.isClient} onChange={this.handleChange} />
                    </div>
                  </div>
                </div>

                {this.state.isClient ?
                <div className="addcnt_detail">
                  <div className="addcnt_title">
                    <h2>student information</h2>
                  </div>
                  <div className="cnt_detail">
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Date of birthday</label>
                      <input type="text" placeholder="MM/DD/YY" id="cnt_birthday" className="cnt_birthday cnt_input" value={this.state.birthday} onChange={(e) => this.onChangeByKey("birthday", e)} />
                    </div>
                    <div className="padding_bottom_50">
                      <label className="cnt_label">Riding level</label>
                      <ReactSelect
                        name="cnt_riding_level"
                        className="cnt_select"
                        value={this.state.ridingLevel}
                        options={options_riding}
                        onChange={(e) => this.onSelectByKey("ridingLevel", e)}
                        clearable={false}
                        simpleValue={true}
                        searchable={false}
                        requried={true}
                      />
                    </div>
                  </div>
                </div>: ''
                }

                <div className="addcnt_detail">
                  <div className="addcnt_title">
                    <h2>billing information</h2>
                  </div>
                  <div className="cnt_detail">
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Send all invoices and billing correspondence to*</label>
                      {this.state.isClient ?
                      <RadioGroup
                        name="billing" className="cnt_radio"
                        selectedValue={this.state.billing}
                        onChange={(e) => this.onSelectByKey("billing", e)}>
                          <Radio value="client" />Client<br />
                          <Radio value="different" />Send invoices and billing correspondence to a different client<br/>
                      </RadioGroup>
                      :
                      <RadioGroup
                        name="billing" className="cnt_radio"
                        selectedValue={this.state.billing}
                        onChange={(e) => this.onSelectByKey("billing", e)}>
                          <Radio value="client" />Client<br />
                      </RadioGroup>
                      }
                      { this.state.billing == 'different'
                          ?
                        <div className="send_invoice">
                          <label className="cnt_label">Send invoices to</label>
                          <ReactSelect
                            name="send_invoice"
                            className="cnt_select"
                            value={this.state.existing_client}
                            options={options_existingClient}
                            onChange={(e) => this.onSelectByKey("existing_client", e)}
                            clearable={false}
                            simpleValue={true}
                            searchable={false}

                          />
                        </div>
                      :null
                      }
                    </div>
                    <div className="padding_bottom_25" style={noneDisplayStyle}>
                      <label className="cnt_label">Preferred payment method*</label>
                      <RadioGroup
                        name="payment" className="cnt_radio"
                        selectedValue={this.state.payment}
                        onChange={(e) => this.onSelectByKey("payment", e)}>
                          <Radio value="check" />Check<br />
                          <Radio value="different" />Credit card<br/>
                      </RadioGroup>
                    </div>
                  </div>
                </div>

                {/* Additional Clients Included on Invoices */}
                <div className="addcnt_detail" style={noneDisplayStyle}>
                  <div className="addcnt_title">
                    <h2>additional clients included on invoices</h2>
                  </div>
                  <div className="cnt_detail">
                    <div className="cnt_description">
                      <p>Note: Use this section to add clients, such as family members, whose expenses will be included on all future invoices for this client.</p>
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Add a client to invoices</label>

                      {/* <ReactSuperSelect
                        // dataSource={groceries}
                        dataSource={this.state.client}
                        onChange={this.onSelectClient}
                        optionLabelkey="label"
                        options={options_client}
                        placeholder="Choose a client or create a new one"
                        searchable={false}
                        clearable={false}
                        simpleValue={true}
                        searchPlaceholder="Search..."
                        groupBy="group"
                      /> */}

                      <ReactSelect
                        name="add_invoiceclient"
                        className="cnt_select"
                        placeholder="Choose a client or create a new one"
                        value={this.state.client}
                        options={options_client}
                        onChange={this.onSelectClient}
                        clearable={false}
                        simpleValue={true}
                        searchable={false}
                        multi={true}
                      />
                      {
                        this.state.createClient
                          ? <CreateClient onSubmit={this.onSubmit} />
                          : null
                      }
                      {
                        this.state.clients.length > 0
                          ?<div>
                            <label>Additional clients included on invoices</label>
                            {
                              this.state.clients.map((client, key) =>
                                <div key={key} className="add_client">
                                  <div className="client_name">{client}</div>
                                  <div className="remove_client">
                                    <a href="#">X</a>
                                  </div>
                                </div>
                                )
                            }
                          </div>
                          :null
                      }
                    </div>
                  </div>
                </div>

                { /* Horses Included on Invoices Section */ }
                <div className="addcnt_detail" style={noneDisplayStyle}>
                  <div className="addcnt_title">
                    <h2>horses included on invoices</h2>
                  </div>
                  <div className="cnt_detail">
                    <div className="cnt_description">
                      <p>Note: Use this section to add clients, such as family members, whose expenses will be included on all future invoices for this client.</p>
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Add a horse to invoices</label>
                      <ReactSelect
                        name="add_invoicehorse"
                        className="cnt_select"
                        value={this.state.horse}
                        options={horses}
                        labelKey="horse_name"
                        valueKey="id"
                        onChange={(e) => this.onSelectByKey("horse", e)}
                        clearable={false}
                        simpleValue={true}
                        searchable={false}
                      />
                      {/* {
                        this.state.createHorse
                          ? <CreateHorse onSubmit={this.onSubmit} />
                          : null
                      } */}
                    </div>
                  </div>
                </div>

                { /* Emergency Contact Section */ }
                <div className="addcnt_detail" style={noneDisplayStyle}>
                  <div className="addcnt_title">
                    <h2>emergency contact</h2>
                  </div>
                  <div className="cnt_detail">
                    <div className="padding_bottom_25">
                      <label className="cnt_label">First name</label>
                      <input type="text" id="cnt_emergency_first" className="cnt_emergency_first cnt_input" value={this.state.emergencyFirst} onChange={(e) => this.onChangeByKey("emergencyFirst", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Last name</label>
                      <input type="text" id="cnt_emergency_last" className="cnt_emergency_last cnt_input" value={this.state.emergencyLast} onChange={(e) => this.onChangeByKey("emergencyLast", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Relationship to client</label>
                      <input type="text" id="cnt_emergency_relationship" className="cnt_emergency_relationship cnt_input" value={this.state.emergencyRelationship} onChange={(e) => this.onChangeByKey("emergencyRelationship", e)} />
                    </div>
                    <div className="padding_bottom_50">
                      <label className="cnt_label">Phone number</label>
                      <input type="text" id="cnt_emergency_ph" className="cnt_emergency_ph cnt_input" value={this.state.emergencyPN} onChange={(e) => this.onChangeByKey("emergencyPN", e)} />
                    </div>
                  </div>
                </div>

                <div className="addcnt_detail">
                  <div className="addcnt_title">
                    <h2>client contact information</h2>
                  </div>
                  <div className="cnt_detail">
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Address 1</label>
                      <input type="text" placeholder="Address" id="cnt_address1" className="cnt_address1 cnt_input" value={this.state.address1} onChange={(e) => this.onChangeByKey("address1", e)} />
                      {/*
                      <ReactSelect.Async
                        name="cnt_address"
                        loadOptions={getClients}
                        value={this.state.address}
                      />
                      */}

                      {/*
                      <ReactSelect
                        name="cnt_address"
                        className="cnt_select"
                        placeholder="Choose from existing addresses or create a new one"
                        value={this.state.address}
                        options={options_address}
                        clearable={false}
                        searchable={false}
                        simpleValue={true}
                        onChange={(e) => this.onSelectByKey("address", e)}
                      />
                      {
                        this.state.createAddress
                          ? <CreateAddress onSubmit={this.onSubmit} />
                          : null
                      }
                      */}
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Address 2</label>
                      <input type="text" placeholder="Address" id="cnt_address2" className="cnt_address2 cnt_input" value={this.state.address2} onChange={(e) => this.onChangeByKey("address2", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">City</label>
                      <input type="text" placeholder="City" id="cnt_city" className="cnt_city cnt_input" value={this.state.city} onChange={(e) => this.onChangeByKey("city", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">State Province</label>
                      <input type="text" placeholder="State Province" id="cnt_state_province" className="cnt_state_province cnt_input" value={this.state.state_province} onChange={(e) => this.onChangeByKey("state_province", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Country</label>
                      <input type="text" placeholder="Country" id="cnt_country" className="cnt_country cnt_input" value={this.state.country} onChange={(e) => this.onChangeByKey("country", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Home phone number</label>
                      <input type="text" placeholder="(555) 555-5555" id="cnt_home_pn" className="cnt_home_pn cnt_input" value={this.state.homeNumber} onChange={(e) => this.onChangeByKey("homeNumber", e)} />
                    </div>
                    <div className="padding_bottom_25">
                      <label className="cnt_label">Cell phone number</label>
                      <input type="text" placeholder="(555) 555-5555" id="cnt_cell_pn" className="cnt_cell_pn cnt_input" value={this.state.phoneNumber} onChange={(e) => this.onChangeByKey("phoneNumber", e)} />
                    </div>
                    <div className="padding_bottom_50">
                      <label className="cnt_label">Email address</label>
                      <input type="email" placeholder="" id="cnt_email" className="cnt_email cnt_input" value={this.state.email} onChange={(e) => this.onChangeByKey("email", e)} />
                    </div>
                  </div>
                </div>

                <div className="addcnt_detail">
                  <div className="addcnt_title">
                    <h2>notes</h2>
                  </div>
                  <div className="cnt_detail">
                    <div className="padding_bottom_50">
                      <label className="cnt_label">Add a note (Optional. Only visible to you.)</label>
                      <textarea placeholder="Add a note" className="cnt_input cnt_textarea" rows="6" value={this.state.note} onChange={(e) => this.onChangeByKey("note", e)}></textarea>
                    </div>
                  </div>
                </div>

                <div className="cnt_submit">
                  <label>* These fields are required.</label>
                  <br/>
                  <Button type="submit" className="btn_submit">
                    Add new client
                  </Button>
                  <a href="#">Cancel</a>
                </div>
              </div>
            </form>
        </div>

        <FooterContainer/>

        <ModalTemplate ref="modalTemp" msg={this.state.msg} url={this.state.url} />

      </div>


    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    locations: state.locations,
    lesson_status: state.lesson_status,
    sections: state.sections,
    instructors: state.instructors,
    students: state.students,
    lessonDateTimes: state.lessonDateTimes,
    lessonDateTime: state.lessonDateTime,
    horses: state.horses,
    enrollmentStatuses: state.enrollment_statuses,
    lessonPeople: state.lessonPeople,
    updatedLesson: state.updatedLesson,
    addedNewLesson: state.addedNewLesson,
    clients: state.clients,
    addclientStatus: state.addclientStatus
  }
};

function matchDispatchToProps(dispatch){
  return bindActionCreators({
    login: login, getLocations: getLocations,
    getLessonStatus: getLessonStatus,
    getSections: getSections,
    getInstructors: getInstructors,
    getStudents: getStudents,
    addLesson: LessonAction.addLesson,
    getLessons: LessonAction.getLessons,
    getLesson: LessonAction.getLesson,
    getStudent: LessonAction.getStudent,
    getHorses: LessonAction.getHorses,
    getEnrollmentStatuses: LessonAction.getEnrollmentStatuses,
    getLessonPeople:  LessonAction.getLessonPeople,
    getLessonHorses: LessonAction.getLessonHorses,
    updateLessonData: LessonAction.updateLessonData,
    getClients: LessonAction.getClients,
    addClient: LessonAction.addClient
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ClientAddContainer);
