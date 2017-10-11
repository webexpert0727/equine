class RenameDayOfWeekToDayOfWeekIdInSections < ActiveRecord::Migration
  def change
    rename_column :sections, :day_of_week, :day_of_week_id
  end
end
