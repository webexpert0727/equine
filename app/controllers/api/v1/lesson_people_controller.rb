class Api::V1::LessonPeopleController < Api::V1::ApiController
  before_filter :set_lesson_date_time, only: [:index]

  def index
    render status: 200, json: { lesson_people: @lesson_date_time.lesson_people }
  end

  def actionStatus
    lesson_people = LessonPerson.find(params[:lesson_people_id])

    if params[:btnType] == 'yes'
      makeupLesson = MakeupLesson.where(student_id: params[:student_id], missed_lesson_date_time_id: params[:lesson_date_time_id]).first

      if makeupLesson.nil?
        makeupLesson = MakeupLesson.new
      end
      makeupLesson.student_id = params[:student_id]
      makeupLesson.missed_lesson_date_time_id = params[:lesson_date_time_id]
      makeupLesson.makeup_expiry_date = params[:defaultExpiryDate]

      makeupLesson.save

      lesson_people.enrollment_status_id = 4
      status = 'ok_success'

    else
      lesson_people.enrollment_status_id = 1
      status = 'deny_success'
    end
    lesson_people.save

    render status: 200, json: { submitStatusBtnStatus: status }
  end

  private

  def set_lesson_date_time
    @lesson_date_time = LessonDateTime.find(params[:lesson_date_time])
  end
end
