class Api::V1::DayOfWeeksController < Api::V1::ApiController
  def index
    render status: 200, json: { dayOfWeeks: DayOfWeek.all }
  end

  def create
  end
end
