class AddLocationIdToPrograms < ActiveRecord::Migration
  def change
    add_column :programs, :location_id, :integer
  end
end