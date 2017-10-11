class Api::V1::LocationsController < Api::V1::ApiController
  def index
    locations = Location
                   .joins('LEFT OUTER JOIN farms ON farms.id = locations.farm_id')
                   .select("locations.*, farms.farm_name")
    render status: 200, json: { locations: locations }
  end

  def create
    location = Location.new

    location.location_name = params[:locationName]
    location.location_code = params[:locationCode]
    location.farm_id = params[:farm]

    location.save

    render status: 200, json: { createLocationStatus: 'success' }
  end
end
