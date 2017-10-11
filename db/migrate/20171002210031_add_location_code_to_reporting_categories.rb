class AddLocationCodeToReportingCategories < ActiveRecord::Migration
  def change
    add_column :reporting_categories, :location_code, :string
  end
end
