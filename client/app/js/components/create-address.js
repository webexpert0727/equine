import React, {Component}           from 'react';
import BaseComponent                from './base_component';
import { Button }                   from 'react-bootstrap'

class CreateAddress extends BaseComponent {
  constructor(props) {
    super(props);

    //
    this.state = {
      newAddress: '',
      newCity: '',
      newState: '',
      newZip: '',
    };

    this.onSubmit = this.onSubmit.bind(this);

  }

  onChangeByKey(key, e) {
    this.setState({ [key]: e.target.value });
  }

  onSubmit() {
    this.props.onSubmit({
      address: this.state.newAddress,
      city: this.state.newCity,
      state: this.state.newState,
      newZip: this.state.newZip
    });
  }

  render() {
    return (
      <div className="create_address">
        <div className="cnt_newAddress">
          <div className="newAddress padding_bottom_15">
            <label className="cnt_label">New address*</label>
            <input type="text" placeholder="5005 Castle Creek Road" className="cnt_input" required="required" value={this.state.newAddress} onChange={(e) => this.onChangeByKey("newAddress", e)} />
          </div>

          <div className="padding_bottom_15">
            <label className="cnt_label">City*</label>
            <input type="text" placeholder="Dayton" className="cnt_input" required="required" value={this.state.newCity} onChange={(e) => this.onChangeByKey("newCity", e)} />
          </div>

          <div className="padding_bottom_15 width_49p_inline">
            <label className="cnt_label">State/Province*</label>
            <input type="text" placeholder="Ohio" className="cnt_input" required="required" value={this.state.newState} onChange={(e) => this.onChangeByKey("newState", e)} />
          </div>

          <div className="padding_bottom_15 width_49p_inline margin_left_2p">
            <label className="cnt_label">Zip code*</label>
            <input type="text" placeholder="14590" className="cnt_input" required="required" value={this.state.newZip} onChange={(e) => this.onChangeByKey("newZip", e)} />
          </div>
          <div className="cnt_submit">
            <Button type="submit" className="btn_create_address" onClick={this.onSubmit}>
              Create new address
            </Button>
            <a href="#">Cancel</a>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateAddress;
