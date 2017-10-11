class Api::V1::ProgramsController < Api::V1::ApiController

  def index
    programs = Program
                   .joins('LEFT OUTER JOIN program_types ON program_types.id = programs.program_type_id')
                   .joins('LEFT OUTER JOIN reporting_categories ON reporting_categories.id = programs.reporting_category_id')
                   .joins('LEFT OUTER JOIN products ON products.id = programs.product_id')
                   .joins('LEFT OUTER JOIN instructors ON instructors.id = programs.instructor_id')
                   .joins('LEFT OUTER JOIN farms ON farms.id = programs.farm_id')
                   .joins('LEFT OUTER JOIN locations ON locations.id = programs.location_id')
                   .select("programs.*, program_types.program_type_name, reporting_categories.reporting_category_name, products.product_name, instructors.instructor_name, farms.farm_name, locations.location_name")

    render status: 200, json: { programs: programs }
  end

  def create

    program = Program.new

    program.program_name = params[:programName]
    program.program_code = params[:programCode]
    program.program_desc = params[:programDescription]
    program.program_type_id = params[:program_type]
    program.reporting_category_id = params[:reporting_category]
    program.duration = params[:programDuration]
    program.product_id = params[:default_product]
    program.instructor_id = params[:default_instructor]
    program.farm_id = params[:default_farm]
    program.location_id = params[:default_location]

    program.save

    render status: 200, json: { createProgramStatus: 'success' }
  end

end
