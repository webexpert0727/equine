import React, {Component}           from 'react';
import Modal                        from "simple-react-modal";
import BaseComponent                from '../components/base_component';

class ModalTemplateMakeupLesson extends BaseComponent {

    constructor(props) {
        super(props);

        this.state = {
            show: false,
        };

        this.show = this.show.bind(this);
        this.close = this.close.bind(this);
    }

    show() {
        this.setState({show: true});
    }

    close() {
        this.setState({show: false});
        location.href = '/makeup_lessons';
        
    }

    render() {

        var okBtnStyle = {
            margin: '20px 0px 0px',
        };

        return (
            <Modal show={this.state.show}>
                <div className="row">
                    <div className="panel panel-login">
                        <div className="panel-body">
                            <div className="row">
                                <div className="col-lg-12 text-center">
                                    <hr/>
                                    <label className="text-center">{this.props.msg}</label>
                                </div>
                                <br/>
                                <div className="col-lg-12 text-center">
                                    <a onClick={this.close} className="btn btn-success" style={okBtnStyle}>OK</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default ModalTemplateMakeupLesson;
