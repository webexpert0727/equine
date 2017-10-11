class Api::V1::ReportingCategoriesController < Api::V1::ApiController

  def index
    render status: 200, json: { reportingCategories: ReportingCategory.all }
  end

  def create
    reportingCategory = ReportingCategory.new

    reportingCategory.reporting_category_name = params[:reportingCategoryName]
    reportingCategory.location_code = params[:locationCode]

    reportingCategory.save

    render status: 200, json: { createReportingCategoryStatus: 'success' }
  end

end
