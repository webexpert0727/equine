"use strict";
import Constants   from   "../constants";
import Api         from   "./api";

export default {
  // get programs
  getPrograms(){
    return function(dispatch){
      Api.get('/programs').then(function(res,err){
        return dispatch({
          type: Constants.GET_PROGRAMS,
          payload: res
        });
      });
    }
  },

  // add program
  createProgram(formData){
    return function(dispatch){
      Api.post(`/programs`, formData).then(function(res,err){
        return dispatch({
          type: Constants.CREATE_PROGRAM,
          payload: res
        });
      });
    }
  },

  // get programTypes
  getProgramTypes(){
    return function(dispatch){
      Api.get('/program_types').then(function(res,err){
        return dispatch({
          type: Constants.GET_PROGRAMTYPES,
          payload: res
        });
      });
    }
  },

  // add program
  createProgramType(formData){
    return function(dispatch){
      Api.post(`/program_types`, formData).then(function(res,err){
        return dispatch({
          type: Constants.CREATE_PROGRAMTYPE,
          payload: res
        });
      });
    }
  },

  // get reportingCategories
  getReportingCategories(){
    return function(dispatch){
      Api.get('/reporting_categories').then(function(res,err){
        return dispatch({
          type: Constants.GET_REPORTINGCATEGORIES,
          payload: res
        });
      });
    }
  },

  // add reportingCategory
  createReportingCategory(formData){
    return function(dispatch){
      Api.post(`/reporting_categories`, formData).then(function(res,err){
        return dispatch({
          type: Constants.CREATE_REPORTINGCATEGORY,
          payload: res
        });
      });
    }
  },

  // get Products
  getProducts(){
    return function(dispatch){
      Api.get('/products').then(function(res,err){
        return dispatch({
          type: Constants.GET_PRODUCTS,
          payload: res
        });
      });
    }
  },

  // get Instructors
  // getInstructors(){
  //   return function(dispatch){
  //     Api.get('/instructors').then(function(res,err){
  //       return dispatch({
  //         type: Constants.GET_INSTRUCTORS,
  //         payload: res
  //       });
  //     });
  //   }
  // },

  // add Instructors
  createInstructor(formData){
    return function(dispatch){
      Api.post(`/instructors`, formData).then(function(res,err){
        return dispatch({
          type: Constants.CREATE_INSTRUCTOR,
          payload: res
        });
      });
    }
  },

  // get Farms
  getFarms(){
    return function(dispatch){
      Api.get('/farms').then(function(res,err){
        return dispatch({
          type: Constants.GET_FARMS,
          payload: res
        });
      });
    }
  },

  // get Locations
  // getLocations(){
  //   return function(dispatch){
  //     Api.get('/locations').then(function(res,err){
  //       return dispatch({
  //         type: Constants.GET_LOCATIONS,
  //         payload: res
  //       });
  //     });
  //   }
  // },

  // add Location
  createLocation(formData){
    return function(dispatch){
      Api.post(`/locations`, formData).then(function(res,err){
        return dispatch({
          type: Constants.CREATE_LOCATION,
          payload: res
        });
      });
    }
  },

  // get Sections
  // getSections(){
  //   return function(dispatch){
  //     Api.get('/sections').then(function(res,err){
  //       return dispatch({
  //         type: Constants.GET_SECTIONS,
  //         payload: res
  //       });
  //     });
  //   }
  // },

  // add Section
  createSection(formData){
    return function(dispatch){
      Api.post(`/sections`, formData).then(function(res,err){
        return dispatch({
          type: Constants.CREATE_SECTION,
          payload: res
        });
      });
    }
  },
  
  // get RepeatTypes
  getRepeatTypes(){
    return function(dispatch){
      Api.get('/repeat_types').then(function(res,err){
        return dispatch({
          type: Constants.GET_REPEATTYPES,
          payload: res
        });
      });
    }
  },

  // get DayOfWeeks
  getDayOfWeeks(){
    return function(dispatch){
      Api.get('/day_of_weeks').then(function(res,err){
        return dispatch({
          type: Constants.GET_DAYOFWEEKS,
          payload: res
        });
      });
    }
  },
  
  // submit Yes Button
  submitStatusBtn(formData){
    return function(dispatch){
      Api.post(`/lesson_people/actionStatus`, formData).then(function(res,err){
        return dispatch({
          type: Constants.SUBMIT_STATUSBTN,
          payload: res
        });
      });
    }
  },

}
