class Api::V1::RepeatTypesController < Api::V1::ApiController
  def index
    render status: 200, json: { repeatTypes: RepeatType.all }
  end

  def create
  end
end
