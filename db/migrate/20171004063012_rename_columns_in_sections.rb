class RenameColumnsInSections < ActiveRecord::Migration
  def change
    rename_column :sections, :day_of_week_id, :day_of_week_value
    rename_column :sections, :repeat_type_id, :repeat_type_value
  end
end
