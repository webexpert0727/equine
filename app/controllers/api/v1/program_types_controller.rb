class Api::V1::ProgramTypesController < Api::V1::ApiController

  def index
    render status: 200, json: { programTypes: ProgramType.all }
  end

  def create
    programType = ProgramType.new

    programType.program_type_name = params[:programTypeName]

    programType.save

    render status: 200, json: { createProgramTypeStatus: 'success' }
  end

end
