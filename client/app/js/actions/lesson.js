"use strict";
import Constants   from   "../constants";
import Api         from   "./api";

export default {
  addLesson(data){
    return function(dispatch){
      Api.post('/lesson_date_times', data).then(function(res,err){
        return dispatch({
          type: Constants.ADD_LESSON,
          payload: res
        });
      });
    }
  },

  getLessons(data){
    return function(dispatch){
      Api.get('/lesson_date_times').then(function(res,err){
        return dispatch({
          type: Constants.GET_LESSON_DATE_TIMES,
          payload: res
        });
      });
    }
  },

  getLesson(id){
    return function(dispatch){
      Api.get('/lesson_date_times/'+id).then(function(res,err){
        return dispatch({
          type: Constants.GET_LESSON_DATE_TIME,
          payload: res
        });
      });
    }
  },

  getStudent(id){
    return function(dispatch){
      Api.get('/lesson_statuses/'+id).then(function(res,err){
        return dispatch({
          type: Constants.GET_LESSON_STUDENT,
          payload: res
        });
      });
    }
  },

  // get horses
  getHorses(){
    return function(dispatch){
      Api.get('/horses').then(function(res,err){
        return dispatch({
          type: Constants.GET_HORSES,
          payload: res
        });
      });
    }
  },
  
  // add horse
  createHorse(formData){
    return function(dispatch){
      Api.post(`/horses`, formData).then(function(res,err){
        return dispatch({
          type: Constants.CREATE_HORSE,
          payload: res
        });
      });
    }
  },

  // get horses report
  getHorsesReport(data) {
    return function(dispatch) {
      Api.get(
          '/horses/horses_report?horse_id=' +
          data['horse_id'] +
          '&week=' +
          data['week']
      ).then(function(res, err) {
        return dispatch({
          type: Constants.GET_HORSES_REPORT,
          payload: res
        });
      });
    };
  },

  // get enrollment_statuses
  getEnrollmentStatuses(){
    return function(dispatch){
      Api.get('/enrollment_statuses').then(function(res,err){
        return dispatch({
          type: Constants.GET_ENROLLMENT_STATUSES,
          payload: res
        });
      });
    }
  },

  // get lesson peoples
  getLessonPeople(lessonId){
    return function(dispatch){
      Api.get('/lesson_people?lesson_date_time='+lessonId).then(function(res,err){
        return dispatch({
          type: Constants.GET_LESSON_PEOPLE,
          payload: res
        });
      });
    }
  },

  // get lesson horses
  getLessonHorses(lessonId){
    return function(dispatch){
      Api.get(`/lesson_date_times/${lessonId}/lesson_date_time_horses`).then(function(res,err){
        return dispatch({
          type: Constants.GET_LESSON_HORSES,
          payload: res
        });
      });
    }
  },

  // update lesson
  updateLesson(id, data){
    return function(dispatch){
      Api.put(`/lesson_date_times/${id}`,data).then(function(res,err){
        return dispatch({
          type: Constants.UPDATE_LESSON,
          payload: res
        });
      });
    }
  },

  // update lesson
  deleteLesson(id, type){
    return function(dispatch){
    Api.delete(`/lesson_date_times/${id}?delete_all=${type}`).then(function(res,err){
      console.log('yyyyyyyyyyyy',res)
    });
  }
  },


  updateLessonData(constant){
    return function(dispatch){
      return dispatch({
        type: Constants[constant],
        payload: null
      });
    }
  },

  // get clients
  getClients(){
    return function(dispatch){
      Api.get('/clients').then(function(res,err){
        return dispatch({
          type: Constants.GET_CLIENTS,
          payload: res
        });
      });
    }
  },

  moveLesson(id, data){
    return function(dispatch){
      Api.post(`/lesson_date_times/${id}/move`,data).then(function(res,err){
        return dispatch({
          type: Constants.MOVE_LESSON,
          payload: res
        });
      });
    }
  },

  // get client data
  getClientData(clientID){
    return function(dispatch){
      Api.post(`/clients/${clientID}/client`).then(function(res,err){
        return dispatch({
          type: Constants.GET_CLIENT,
          payload: res
        });
      });
    }
  },

  resizeLesson(id, data){
    return function(dispatch){
      Api.post(`/lesson_date_times/${id}/resize`,data).then(function(res,err){
        return dispatch({
          type: Constants.RESIZE_LESSON,
          payload: res
        });
      });
    }
  },

  // get lesson data
  getLessonsData(clientID){
    return function(dispatch){
      Api.post(`/clients/${clientID}/lessons`).then(function(res,err){
        return dispatch({
          type: Constants.GET_LESSONS,
          payload: res
        });
      });
    }
  },

  // add client
  addClient(formData){
    return function(dispatch){
      Api.post(`/clients/addClient`, formData).then(function(res,err){
        return dispatch({
          type: Constants.ADD_CLIENT,
          payload: res
        });
      });
    }
  },

  // get MakeupLessons
  getMakeupLessons(){
    return function(dispatch){
      Api.get('/lesson_date_times/get_makeupLessons').then(function(res,err){
        return dispatch({
          type: Constants.GET_MAKEUPLESSONS,
          payload: res
        });
      });
    }
  },

}
