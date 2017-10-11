class Api::V1::SectionsController < Api::V1::ApiController
  def index
    sections = Section
                    .joins('LEFT OUTER JOIN locations ON locations.id = sections.location_id')
                    .joins('LEFT OUTER JOIN day_of_weeks ON day_of_weeks.day_of_week_value = sections.day_of_week_value')
                    .joins('LEFT OUTER JOIN repeat_types ON repeat_types.repeat_type_value = sections.repeat_type_value')
                    .joins('LEFT OUTER JOIN instructors ON instructors.id = sections.instructor_id')
                    .joins('LEFT OUTER JOIN programs ON programs.id = sections.program_id')
                    .select("sections.*, locations.location_name, day_of_weeks.day_of_week_name, repeat_types.repeat_type_name, instructors.instructor_name, programs.program_name")
    render status: 200, json: { sections: sections }
  end

  def create
    section = Section.new

    section.section_name = params[:sectionName]
    section.program_id = params[:program]
    section.startdate = params[:startdate]
    section.enddate = params[:enddate]
    section.starttime = params[:starttime]
    section.endtime = params[:endtime]
    section.repeat_type_value = params[:repeat_type_value]
    section.day_of_week_value = params[:day_of_week_value]
    section.instructor_id = params[:instructor_id]
    section.location_id = params[:location_id]
    section.max_enrollment = params[:max_enrollment]
    section.duration = params[:duration]
    section.repeat_number = params[:repeat_number]
    section.default_product_id = params[:product_id]
    section.current_enrollment = params[:current_enrollment]
    section.farm_id = params[:farm_id]

    section.save

    render status: 200, json: { createSectionStatus: 'success' }
  end
end
