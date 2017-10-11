import React, {Component}             from 'react';
import {connect}                      from 'react-redux';
import AtomicForm                     from "atomic-form";
import { bindActionCreators }         from 'redux';
import  LessonAction                  from '../actions/lesson';
import  DashboardAction               from '../actions/dashboard';
import Modal                          from "simple-react-modal";
import BaseComponent                  from '../components/base_component';
import { Link }                       from 'react-router';
import Pagination                     from 'react-js-pagination'
import FooterContainer                from './footer_container';

class HorsesContainer extends BaseComponent {
  constructor(props, context){
    super(props, context);
    this.state = {
      activePage: 1,
      tableData: [],
    };

    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentWillMount(){
    this.props.getHorses();

  }

  handlePageChange(pageNumber) {
    console.log('active page is', pageNumber);
    this.setState({activePage: pageNumber});
    let pageData = [];
    this.state.horses.map((item, index) => {
      if(index >=  (pageNumber-1) * 10 && index < (pageNumber) * 10){
        pageData.push(item);
      }
    });
    this.setState({tableData: pageData});
  }

  componentWillReceiveProps(nextProps) {
    this.state.horses = nextProps.horses;
    this.state.length = nextProps.horses.length;
    this.handlePageChange(this.state.activePage);
  }

  render() {
    console.log('horses data', this.props.horses);

    return (
        <div className="rightMain">
          <div className="rmInr mCustomScrollbar" data-mcs-theme="dark">
            <div className="rghtHeadTop clearfix">
              <h1>Horses</h1>
              <div className="rhtSrch">
                <form>
                  <input type="text" placeholder="Search horses" className="test"/>
                  <button type="submit"></button>
                </form>
              </div>
            </div>
            <div className="rghtHeadTop rghtHeadMid clearfix">
              <div className="rhtSrch rtClientRight">
                <div className="addLsn rtClient primaryBtn">
                  <Link to='/dashboard'>Back to Dashboard</Link>
                </div>
              </div>
              <div className="rhtSrch rtClientRight">
                <div className="addLsn rtClient">
                  <Link to='/horse_create'>Add a Horse</Link>
                </div>
              </div>
            </div>

            <div className="rghtCalCntnr">
              <div className="rccInr">
                <div className="loginCnt">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                      </tr>
                    </thead>
                    <tbody>
                    { this.state.tableData.map((horse, index) => {
                      return (
                        <tr key={index}>
                          <td>{ horse.horse_name }</td>
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
    horses: state.horses
  }
};

function matchDispatchToProps(dispatch){
  return bindActionCreators({getHorses: LessonAction.getHorses, }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(HorsesContainer);
