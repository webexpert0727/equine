import {combineReducers} from 'redux';
import UserReducer from './reducer-users';
import userLoginDetail from './reducer-user-login-detail';
import LessonStatus from './lesson_status';
import Student from './student';
import LessonDateTimes from './lesson_date_times';
import LessonDateTime from './lesson_date_time';
import GetLesson from './get_lesson';
import Horses from './horses';
import GetHorsesReport from './get_horses_report';
import CreateHorse   from './create_horse';
import EnrollmentStatuses from './enrollment_status';
import LessonPeople from './lesson_people';
import LessonHorses from './get_lesson_horses';
import UpdatedLesson from './update_lesson';
import AddLesson   from './add_lesson';
import GetClients   from './get_clients';
import GetClient   from './get_client';
import GetLessons   from './get_lessons';
import AddClient   from './add_client';
import GetPrograms   from './get_programs';
import CreateProgram   from './create_program';
import GetProgramTypes   from './get_programTypes';
import CreateProgramType   from './create_programType';
import GetReportingCategories   from './get_reportingCategories';
import CreateReportingCategory   from './create_reportingCategory';
import Locations   from './locations';
import CreateLocation   from './create_location';
import Sections   from './section';
import CreateSection   from './create_section';
import SubmitStatusBtn   from './submit_statusBtn';
import GetProducts   from './get_products';
import Instructor   from './instructor';
import GetFarms   from './get_farms';
import GetRepeatTypes   from './get_repeatTypes';
import GetDayOfWeeks   from './get_dayOfWeeks';
import GetMakeupLessons   from './get_makupLessons';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

/*
 * We combine all reducers into a single object before updated data is dispatched (sent) to store
 * Your entire applications state (store) is just whatever gets returned from all your reducers
 * */

const allReducers = combineReducers({
  users: UserReducer,
  userLoginDetail: userLoginDetail,
  lesson_status: LessonStatus,
  students: Student,
  lessonDateTimes: LessonDateTimes,
  lessonDateTime: GetLesson,
  horses: Horses,
  createHorseStatus: CreateHorse,
  horsesReport: GetHorsesReport,
  enrollment_statuses: EnrollmentStatuses,
  lessonPeople: LessonPeople,
  lessonHorses: LessonHorses,
  updatedLesson: UpdatedLesson,
  addedNewLesson: AddLesson,
  routing: routerReducer,
  clients: GetClients,
  client: GetClient,
  lessons: GetLessons,
  addclientStatus: AddClient,
  programs: GetPrograms,
  createProgramStatus: CreateProgram,
  programTypes: GetProgramTypes,
  createProgramTypeStatus: CreateProgramType,
  reportingCategories: GetReportingCategories,
  createReportingCategoryStatus: CreateReportingCategory,
  products: GetProducts,
  instructors: Instructor,
  farms: GetFarms,
  locations: Locations,
  createLocationStatus: CreateLocation,
  sections: Sections,
  createSectionStatus: CreateSection,
  submitStatusBtnStatus: SubmitStatusBtn,
  repeatTypes: GetRepeatTypes,
  dayOfWeeks: GetDayOfWeeks,
  makeupLessons: GetMakeupLessons,

});

export default allReducers
