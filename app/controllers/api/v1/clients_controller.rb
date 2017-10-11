class Api::V1::ClientsController < Api::V1::ApiController

  def index
    render status: 200, json: { clients: Person.all }
  end

  def client
    if params[:client_id]
      person = Person.find(params[:client_id])
      student = Student.find_by_person_id(params[:client_id])
      if student.nil?
        render status: 200, json: { client: {person: person, student: nil, billings: [], last_lesson: nil, next_lesson: nil, upcoming_lessons: []} }
      else
        billings = Student
                       .where(billing_person_id: params[:client_id])
                       .joins('LEFT OUTER JOIN people ON people.id = students.person_id')
                       .select('students.*, people.person_name')
        lesson_people = student.lesson_people

        last_lesson = lesson_people
                          .joins(:lesson_date_time => [:instructor, :lesson_status])
                          .joins(:horse)
                          .select("lesson_people.*, lesson_date_times.*, horses.horse_name, instructors.instructor_name, lesson_statuses.lesson_status_name")
                          .where(['lesson_date_times.scheduled_date < ? ', DateTime.now])
                          .order('lesson_date_times.scheduled_date DESC').first


        next_lesson = lesson_people
                          .joins(:lesson_date_time => [:instructor, :lesson_status])
                          .joins(:horse)
                          .select("lesson_people.*, lesson_date_times.*, horses.horse_name, instructors.instructor_name, lesson_statuses.lesson_status_name")
                          .where(['lesson_date_times.scheduled_date > ? ', DateTime.now])
                          .order('lesson_date_times.scheduled_date ASC').first

        upcoming_lessons = lesson_people
                               .joins(:lesson_date_time => [:instructor, :lesson_status])
                               .joins(:horse)
                               .select("lesson_people.*, lesson_date_times.*, horses.horse_name, instructors.instructor_name, lesson_statuses.lesson_status_name")
                               .where(['lesson_date_times.scheduled_date > ? ', DateTime.now])
                               .order('lesson_date_times.scheduled_date ASC').limit(10)

        render status: 200, json: { client: {person: person, student: student, billings: billings, last_lesson: last_lesson, next_lesson: next_lesson, upcoming_lessons: upcoming_lessons} }
      end
    else
      render status: 200, json: { client: nil }
    end
  end

  def lessons
    if params[:client_id]
      student = Student.find(params[:client_id])
      lesson_people = student.lesson_people

      lessons = lesson_people
                        .joins(:lesson_date_time => [:instructor, :lesson_status])
                        .joins(:horse)
                        .select("lesson_people.*, lesson_date_times.*, horses.horse_name, instructors.instructor_name, lesson_statuses.lesson_status_name")

      render status: 200, json: { lessons: {student: student, lessons: lessons} }
    else
      render status: 200, json: { lessons: {} }
    end
  end

  def addClient

    person = Person.new

    person.person_name = params[:firstName] + ' ' + params[:lastName]
    person.street_address1 = params[:address1]
    person.street_address2 = params[:address2]
    person.city = params[:city]
    person.state_province = params[:state_province]
    person.country = params[:country]
    person.person_email = params[:email]
    person.person_mobile = params[:phoneNumber]
    person.person_homephone = params[:homeNumber]
    person.riding_level = params[:ridingLevel]
    person.date_of_birth = params[:birthday]

    person.save

    if params[:isClient] == 'true'

      student = Student.new

      student.person_id = person.id
      student.student_name = person.person_name

      if params[:billing] == 'client'
        student.billing_person_id = person.id
      else
        student.billing_person_id = params[:existing_client]
      end

      student.save
    end

    render status: 200, json: { addclientStatus: 'success' }
  end

end
