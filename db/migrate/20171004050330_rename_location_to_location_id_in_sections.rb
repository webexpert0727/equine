class RenameLocationToLocationIdInSections < ActiveRecord::Migration
  def change
    rename_column :sections, :location, :location_id
  end
end
