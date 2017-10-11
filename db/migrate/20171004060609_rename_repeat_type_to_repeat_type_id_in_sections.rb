class RenameRepeatTypeToRepeatTypeIdInSections < ActiveRecord::Migration
  def change
    rename_column :sections, :repeat_type, :repeat_type_id
  end
end
