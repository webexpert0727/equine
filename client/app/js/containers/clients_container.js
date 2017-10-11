import React, {Component}             from 'react';
import {connect}                      from 'react-redux';
import AtomicForm                     from "atomic-form";
import { bindActionCreators }         from 'redux';
import  LessonAction                  from '../actions/lesson';
import Modal                          from "simple-react-modal";
import BaseComponent                  from '../components/base_component';
import { Link } from 'react-router';
import Pagination                     from 'react-js-pagination'
import FooterContainer                from './footer_container';

class ClientsContainer extends BaseComponent {
  constructor(props, context){
    super(props, context);
    this.state = {
      activePage: 1,
      tableData: []
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillMount(){
    this.props.getClients();
  }

  handlePageChange(pageNumber) {
    console.log('active page is', pageNumber);
    this.setState({activePage: pageNumber});
    let pageData = [];
    this.state.clients.map((item, index) => {
      if(index >=  (pageNumber-1) * 10 && index < (pageNumber) * 10){
        pageData.push(item);
      }
    });
    this.setState({tableData: pageData});
  }

  componentWillReceiveProps(nextProps) {
    this.state.clients = nextProps.clients;
    this.state.length = nextProps.clients.length;
    this.handlePageChange(this.state.activePage);
  }

  render() {
    console.log('clients data', this.props.clients);

    return (
        <div className="rightMain">
          <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
            <div className="rghtHeadTop clearfix">
              <h1>Clients</h1>
              <div className="rhtSrch">
                <form>
                  <input type="text" placeholder="Search clients" className="test"/>
                  <button type="submit"></button>
                </form>
              </div>
            </div>
            <div className="rghtHeadTop rghtHeadMid clearfix">
              <div className="rhtSrch rtClientRight">
                <div className="addLsn rtClient">
                  <Link to='/client_add'>Add a Client</Link>
                </div>
              </div>
            </div>

            <div className="rghtCalCntnr">
              <div className="rccInr">
                <div className="loginCnt">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Client Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      { this.state.tableData.map((client, index) => {
                          return (
                              <tr key={index}>
                                <td>{ client.id }</td>
                                <td>{ client.person_name }</td>
                                <td><Link to={'/client_details?client_id=' + client.id} className="btn btn-primary">View Detail</Link></td>
                              </tr>
                          );
                        })
                      }
                    </tbody>
                  </table>
                </div>
                <div className="text-right">
                  <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={10}
                      totalItemsCount={this.state.length}
                      pageRangeDisplayed={10}
                      onChange={this.handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <FooterContainer/>

        </div>
      );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    clients: state.clients
  }
};

function matchDispatchToProps(dispatch){
    return bindActionCreators({getClients: LessonAction.getClients, }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ClientsContainer);
