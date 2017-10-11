class Api::V1::FarmsController < Api::V1::ApiController

  def index
    render status: 200, json: { farms: Farm.all }
  end

  def create
  end

end
