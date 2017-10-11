class Api::V1::InstructorsController < Api::V1::ApiController
 
  def index
    render status: 200, json: { instructors: Instructor.all }
  end

  def create
    instructor = Instructor.new

    instructor.person_id = params[:person_id]
    instructor.instructor_name = params[:instructor_name]
    instructor.ssn = params[:ssn]
    instructor.user_id = params[:user_id]

    instructor.save

    render status: 200, json: { createInstructorStatus: 'success' }
  end

end
