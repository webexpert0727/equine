import React, {Component}           from 'react';
import BaseComponent                from './base_component';
import { Button }                   from 'react-bootstrap'

class CreateClient extends BaseComponent {
  constructor(props) {
    super(props);
    //
    this.state ={
      firstName: '',
      lastName: ''
    }
  }

  onChangeByKey(key, e) {
    this.setState({ [key]: e.target.value })
  }

  render() {
    return (
      <div className="create_address">
        <div className="cnt_newAddress">
          <div className="client_photo">
            <img src="/assets/userImage.png" className="user_image" alt="User Image" /><br />
            <a href="javascript:void(0)" onClick={(e)=>{ this.changePhoto(e) }}>Upload Photo</a>
          </div>
          <div className="add_client_invoice">
            <div className="padding_bottom_15">
              <label>First name*</label>
              <input type="text" placeholder="Becky" className="cnt_input" required="required" value={this.state.firstName} onChange={(e) => this.onChangeByKey('firstName', e)} />
            </div>
            <div className="padding_bottom_15">
              <label>Last name*</label>
              <input type="text" placeholder="Johannson" className="cnt_input" required="required" value={this.state.lastName} onChange={(e) => this.onChangeByKey('lastName', e)} />
            </div>
          </div>
          <div className="cnt_submit">
            <Button type="submit" className="btn_create_address" onClick={this.onSubmit}>
              Create new client and add to invoice
            </Button>
            <a href="#">Cancel</a>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateClient;
