class AddDayOfWeekValueToDayOfWeeks < ActiveRecord::Migration
  def change
    add_column :day_of_weeks, :day_of_week_value, :integer
  end
end
